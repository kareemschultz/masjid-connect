import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { hifzProgress } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const db = getDb()
    const userId = req.nextUrl.searchParams.get('userId')
    const surah = req.nextUrl.searchParams.get('surah')

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const conditions = [eq(hifzProgress.userId, userId)]
    if (surah) conditions.push(eq(hifzProgress.surahNumber, parseInt(surah)))

    const results = await db.select().from(hifzProgress).where(and(...conditions))
    return NextResponse.json(results)
  } catch (err) {
    console.error('[API] GET /api/hifz error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDb()
    const body = await req.json()
    const { userId, surahNumber, ayahNumber, status, accuracy } = body

    if (!userId || !surahNumber || !ayahNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const [entry] = await db.insert(hifzProgress)
      .values({
        userId,
        surahNumber,
        ayahNumber,
        status: status || 'learning',
        accuracy: accuracy || null,
        lastReviewedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [hifzProgress.userId, hifzProgress.surahNumber, hifzProgress.ayahNumber],
        set: {
          status: status || 'learning',
          accuracy: accuracy || null,
          lastReviewedAt: new Date(),
          reviewCount: hifzProgress.reviewCount,
        },
      })
      .returning()

    return NextResponse.json(entry, { status: 201 })
  } catch (err) {
    console.error('[API] POST /api/hifz error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
