import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookmarks } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// GET /api/bookmarks?userId=<uuid>
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const results = await db.select().from(bookmarks).where(eq(bookmarks.userId, userId))
    return NextResponse.json(results)
  } catch (err) {
    console.error('[API] GET /api/bookmarks error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// POST /api/bookmarks — toggle bookmark
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, surahNumber, ayahNumber, note } = body

    if (!userId || !surahNumber || !ayahNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if exists - toggle
    const existing = await db.select().from(bookmarks).where(
      and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.surahNumber, surahNumber),
        eq(bookmarks.ayahNumber, ayahNumber),
      )
    ).limit(1)

    if (existing.length) {
      await db.delete(bookmarks).where(eq(bookmarks.id, existing[0].id))
      return NextResponse.json({ removed: true })
    }

    const [bm] = await db.insert(bookmarks)
      .values({ userId, surahNumber, ayahNumber, note })
      .returning()

    return NextResponse.json(bm, { status: 201 })
  } catch (err) {
    console.error('[API] POST /api/bookmarks error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
