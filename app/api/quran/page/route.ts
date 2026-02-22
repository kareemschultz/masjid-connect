import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 86400 // cache 24h

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page') || '1'
  const pageNum = Math.max(1, Math.min(604, parseInt(page) || 1))

  try {
    const res = await fetch(
      `https://api.qurancdn.com/api/qdc/verses/by_page/${pageNum}?words=true&word_fields=text_uthmani,char_type_name,line_number,page_number&per_page=50`,
      { next: { revalidate: 86400 }, headers: { 'User-Agent': 'MasjidConnectGY/1.0' } }
    )

    if (!res.ok) throw new Error(`QuranCDN API returned ${res.status}`)
    const data = await res.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 502 })
  }
}
