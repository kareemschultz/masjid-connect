import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  try {
    const db = getDb()
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const user = await db.select().from(users).where(eq(users.id, id)).limit(1)
    if (!user.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { passwordHash: _, ...safeUser } = user[0]
    return NextResponse.json(safeUser)
  } catch (err) {
    console.error('[API] GET /api/users error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDb()
    const body = await req.json()
    const { username, email, password } = body

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const passwordHash = password ? await bcrypt.hash(password, 12) : null

    const [newUser] = await db.insert(users).values({
      username,
      email: email || null,
      passwordHash,
    }).returning()

    const { passwordHash: _, ...safeUser } = newUser
    return NextResponse.json(safeUser, { status: 201 })
  } catch (err) {
    console.error('[API] POST /api/users error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = getDb()
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    delete updates.passwordHash
    updates.updatedAt = new Date()

    const [updated] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { passwordHash: _, ...safeUser } = updated
    return NextResponse.json(safeUser)
  } catch (err) {
    console.error('[API] PATCH /api/users error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
