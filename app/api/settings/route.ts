import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const db = getDb()
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const [user] = await db.select({
      calculationMethod: users.calculationMethod,
      madhab: users.madhab,
      reciter: users.reciter,
      notificationsEnabled: users.notificationsEnabled,
      notifyFajr: users.notifyFajr,
      notifyDhuhr: users.notifyDhuhr,
      notifyAsr: users.notifyAsr,
      notifyMaghrib: users.notifyMaghrib,
      notifyIsha: users.notifyIsha,
      notifyIftaar: users.notifyIftaar,
      notifyRamadan: users.notifyRamadan,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (err) {
    console.error('[API] GET /api/settings error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = getDb()
    const body = await req.json()
    const { userId, ...settings } = body

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const [updated] = await db.update(users)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning({
        calculationMethod: users.calculationMethod,
        madhab: users.madhab,
        reciter: users.reciter,
        notificationsEnabled: users.notificationsEnabled,
      })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[API] PATCH /api/settings error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
