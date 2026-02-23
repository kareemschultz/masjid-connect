import { NextRequest, NextResponse } from 'next/server'
import https from 'node:https'
import dns from 'node:dns'

const QURANCDN_HOST = 'api.qurancdn.com'
const pageCache = new Map<number, { data: unknown; ts: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24h

// Cache resolved IP to avoid repeated DNS lookups per request
let resolvedIp: string | null = null

function resolveHost(): Promise<string> {
  if (resolvedIp) return Promise.resolve(resolvedIp)
  return new Promise((resolve, reject) => {
    const resolver = new dns.Resolver()
    resolver.setServers(['8.8.8.8', '1.1.1.1'])
    resolver.resolve4(QURANCDN_HOST, (err, addrs) => {
      if (err || !addrs?.length) {
        // Fallback to system DNS
        dns.lookup(QURANCDN_HOST, { family: 4 }, (err2, addr) => {
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

async function fetchPageData(pageNum: number): Promise<string> {
  const ip = await resolveHost()
  const path = `/api/qdc/verses/by_page/${pageNum}?words=true&word_fields=text_uthmani,char_type_name,line_number,page_number&per_page=50`
  return new Promise((resolve, reject) => {
    const req = https.get(
      {
        hostname: ip,
        path,
        headers: { Host: QURANCDN_HOST, 'User-Agent': 'MasjidConnectGY/1.0' },
        timeout: 12000,
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`Upstream ${res.statusCode}`))
          } else {
            resolve(data)
          }
        })
      }
    )
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')) })
  })
}

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page') || '1'
  const pageNum = Math.max(1, Math.min(604, parseInt(page) || 1))

  // Serve from in-memory cache if fresh
  const cached = pageCache.get(pageNum)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: { 'Cache-Control': 'public, s-maxage=86400', 'X-Cache': 'HIT' },
    })
  }

  try {
    const raw = await fetchPageData(pageNum)
    const data = JSON.parse(raw)
    pageCache.set(pageNum, { data, ts: Date.now() })
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800', 'X-Cache': 'MISS' },
    })
  } catch (err: any) {
    console.error(`QuranCDN page proxy error (page ${pageNum}):`, err.message)
    // Reset cached IP on failure so next request re-resolves
    resolvedIp = null
    // Serve stale if available
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'public, s-maxage=3600', 'X-Cache': 'STALE' },
      })
    }
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 502 })
  }
}
