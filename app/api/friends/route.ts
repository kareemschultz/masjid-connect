import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'
import { getUserStatsBatch, getLevel } from '@/lib/points'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const uid = session.user.id
    const pool = getPool()

    const result = await pool.query(`
      SELECT f.id, f.status, f.created_at,
        CASE WHEN f.requester_id = $1 THEN 'sent' ELSE 'received' END AS direction,
        u.id AS friend_id, u.name, u."displayName", u.email, u.username
      FROM friendships f
      JOIN "user" u ON u.id = CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END
      WHERE f.requester_id = $1 OR f.addressee_id = $1
      ORDER BY f.created_at DESC
    `, [uid])

    const acceptedIds = result.rows.filter((r: any) => r.status === 'accepted').map((r: any) => r.friend_id)
    const statsMap = await getUserStatsBatch(acceptedIds)
    const enriched = result.rows.map((row: any) => {
      if (row.status === 'accepted') {
        const stats = statsMap.get(row.friend_id) || { totalPoints: 0, streak: 0, level: getLevel(0) }
        return { ...row, ...stats }
      }
      return { ...row, totalPoints: null, streak: null, level: null }
    })

    return Response.json(enriched)
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!rateLimit(ip, 10, 60000)) return rateLimitResponse()

  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const { email, username, phone } = await request.json()
    if (!email && !username && !phone) return Response.json({ error: 'email, username, or phone required' }, { status: 400 })

    const pool = getPool()
    let userRes
    if (username) {
      const handle = username.replace(/^@/, '').toLowerCase()
      userRes = await pool.query('SELECT id, name, email, "displayName" FROM "user" WHERE LOWER(username) = $1', [handle])
    } else if (phone) {
      let p = phone.replace(/[\s-]/g, '')
      if (p.startsWith('6') && p.length === 7) p = '592' + p
      userRes = await pool.query('SELECT id, name, email, "displayName" FROM "user" WHERE "phoneNumber" = $1', [p])
    } else {
      userRes = await pool.query('SELECT id, name, email, "displayName" FROM "user" WHERE email = $1', [email])
    }

    if (!userRes.rows.length) return Response.json({ success: true })
    const addressee = userRes.rows[0]

    if (addressee.id === session.user.id) return Response.json({ error: 'Cannot add yourself' }, { status: 400 })

    const existing = await pool.query(
      `SELECT id, status FROM friendships WHERE (requester_id=$1 AND addressee_id=$2) OR (requester_id=$2 AND addressee_id=$1)`,
      [session.user.id, addressee.id]
    )
    if (existing.rows.length) {
      const s = existing.rows[0].status
      return Response.json({ error: s === 'accepted' ? 'Already friends' : 'Request already sent' }, { status: 409 })
    }

    const ins = await pool.query(
      'INSERT INTO friendships (requester_id, addressee_id) VALUES ($1, $2) RETURNING id',
      [session.user.id, addressee.id]
    )
    return Response.json({ id: ins.rows[0].id, addressee: { name: addressee.name, displayName: addressee.displayName, email: addressee.email } })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
