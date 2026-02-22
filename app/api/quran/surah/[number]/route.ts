import { NextRequest } from 'next/server'

const QURAN_API_BASE = 'https://api.alquran.cloud/v1'
const quranCache = new Map<string, { data: unknown; ts: number }>()
const QURAN_CACHE_TTL = 24 * 60 * 60 * 1000

export async function GET(request: NextRequest, { params }: { params: Promise<{ number: string }> }) {
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
    const url = `${QURAN_API_BASE}/surah/${num}/editions/quran-uthmani,en.sahih`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Upstream ${response.status}`)
    const data = await response.json()
    quranCache.set(cacheKey, { data, ts: Date.now() })
    return Response.json(data, { headers: { 'X-Cache': 'MISS' } })
  } catch (err: any) {
    console.error(`Quran proxy error (surah ${num}):`, err.message)
    if (cached) {
      return Response.json(cached.data, { headers: { 'X-Cache': 'STALE' } })
    }
    return Response.json({ error: 'Failed to fetch from Quran API' }, { status: 502 })
  }
}
