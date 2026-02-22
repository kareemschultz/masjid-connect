import { NextRequest } from 'next/server'
import https from 'node:https'
import dns from 'node:dns'

const QURAN_HOST = 'api.alquran.cloud'
const quranCache = new Map<string, { data: unknown; ts: number }>()
const QURAN_CACHE_TTL = 24 * 60 * 60 * 1000

// Cache the resolved IP to avoid repeated DNS lookups
let resolvedIp: string | null = null

function resolveHost(): Promise<string> {
  if (resolvedIp) return Promise.resolve(resolvedIp)
  return new Promise((resolve, reject) => {
    const resolver = new dns.Resolver()
    resolver.setServers(['8.8.8.8', '1.1.1.1'])
    resolver.resolve4(QURAN_HOST, (err, addrs) => {
      if (err || !addrs?.length) {
        // Fallback to system DNS
        dns.lookup(QURAN_HOST, { family: 4 }, (err2, addr) => {
          if (err2) reject(err2)
          else { resolvedIp = addr; resolve(addr) }
        })
      } else {
        resolvedIp = addrs[0]
        resolve(addrs[0])
      }
    })
  })
}

async function fetchQuranSurah(path: string): Promise<string> {
  const ip = await resolveHost()
  return new Promise((resolve, reject) => {
    const req = https.get({
      hostname: ip,
      path,
      headers: { Host: QURAN_HOST },
      timeout: 12000,
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`Upstream ${res.statusCode}`))
        } else {
          resolve(data)
        }
      })
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')) })
  })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params
  const num = parseInt(number, 10)
  if (isNaN(num) || num < 1 || num > 114) {
    return Response.json({ error: 'Invalid surah number (1-114)' }, { status: 400 })
  }

  const cacheKey = `surah_${num}`
  const cached = quranCache.get(cacheKey)
  if (cached && (Date.now() - cached.ts) < QURAN_CACHE_TTL) {
    return Response.json(cached.data, { headers: { 'X-Cache': 'HIT' } })
  }

  try {
    const raw = await fetchQuranSurah(`/v1/surah/${num}/editions/quran-uthmani,en.sahih`)
    const data = JSON.parse(raw)
    quranCache.set(cacheKey, { data, ts: Date.now() })
    return Response.json(data, { headers: { 'X-Cache': 'MISS' } })
  } catch (err: any) {
    console.error(`Quran proxy error (surah ${num}):`, err.message)
    // Reset cached IP on failure so next request re-resolves
    resolvedIp = null
    if (cached) return Response.json(cached.data, { headers: { 'X-Cache': 'STALE' } })
    return Response.json({ error: 'Failed to fetch from Quran API' }, { status: 502 })
  }
}
