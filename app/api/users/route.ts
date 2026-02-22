import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// GET /api/users?id=<uuid>
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const user = await db.select().from(users).where(eq(users.id, id)).limit(1)
    if (!user.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Never return password hash
    const { passwordHash: _, ...safeUser } = user[0]
    return NextResponse.json(safeUser)
  } catch (err) {
    console.error('[API] GET /api/users error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// POST /api/users — register
export async function POST(req: NextRequest) {
  try {
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

// PATCH /api/users — update profile/settings
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Prevent updating password hash directly
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
