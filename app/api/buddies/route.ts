import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { buddies, users } from '@/lib/db/schema'
import { eq, or, and } from 'drizzle-orm'

// GET /api/buddies?userId=<uuid>
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const results = await db.select({
      id: buddies.id,
      buddyUserId: buddies.buddyUserId,
      status: buddies.status,
      buddyName: users.username,
      buddyAvatar: users.avatarUrl,
    })
    .from(buddies)
    .innerJoin(users, eq(buddies.buddyUserId, users.id))
    .where(
      and(
        eq(buddies.userId, userId),
        eq(buddies.status, 'accepted'),
      )
    )

    return NextResponse.json(results)
  } catch (err) {
    console.error('[API] GET /api/buddies error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// POST /api/buddies — send buddy request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, buddyUserId } = body

    if (!userId || !buddyUserId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (userId === buddyUserId) {
      return NextResponse.json({ error: 'Cannot add yourself' }, { status: 400 })
    }

    const [buddy] = await db.insert(buddies)
      .values({ userId, buddyUserId, status: 'pending' })
      .onConflictDoNothing()
      .returning()

    return NextResponse.json(buddy || { message: 'Already connected' }, { status: 201 })
  } catch (err) {
    console.error('[API] POST /api/buddies error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// PATCH /api/buddies — accept/reject
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const [updated] = await db.update(buddies)
      .set({ status })
      .where(eq(buddies.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[API] PATCH /api/buddies error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
