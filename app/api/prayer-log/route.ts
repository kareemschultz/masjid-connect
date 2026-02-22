import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { prayerLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const db = getDb()
    const userId = req.nextUrl.searchParams.get('userId')
    const date = req.nextUrl.searchParams.get('date')

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const conditions = [eq(prayerLogs.userId, userId)]
    if (date) conditions.push(eq(prayerLogs.date, date))

    const logs = await db.select().from(prayerLogs).where(and(...conditions))
    return NextResponse.json(logs)
  } catch (err) {
    console.error('[API] GET /api/prayer-log error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDb()
    const body = await req.json()
    const { userId, prayerName, date, status } = body

    if (!userId || !prayerName || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const [log] = await db.insert(prayerLogs)
      .values({ userId, prayerName, date, status: status || 'prayed' })
      .onConflictDoUpdate({
        target: [prayerLogs.userId, prayerLogs.prayerName, prayerLogs.date],
        set: { status: status || 'prayed' },
      })
      .returning()

    return NextResponse.json(log, { status: 201 })
  } catch (err) {
    console.error('[API] POST /api/prayer-log error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
