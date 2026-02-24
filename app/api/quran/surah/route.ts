import { NextRequest } from 'next/server'
import { GET as getByNumber } from './[number]/route'

// Compatibility route for older clients using query-style surah lookup.
// Remove after 2026-06-30 once legacy app versions are sunset.

export async function GET(request: NextRequest) {
  const surah = request.nextUrl.searchParams.get('surah')
  if (!surah) {
    return Response.json({ error: 'surah query parameter is required' }, { status: 400 })
  }

  return getByNumber(request, { params: Promise.resolve({ number: surah }) })
}
