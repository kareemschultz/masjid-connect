import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'

export async function GET() {
  try {
    const pool = getPool()
    const result = await pool.query(
      `SELECT a.*, u.name as author_name, u."displayName" as author_display
       FROM announcements a
       LEFT JOIN "user" u ON u.id = a.created_by
       WHERE a.expires_at IS NULL OR a.expires_at > NOW()
       ORDER BY
         CASE WHEN a.priority = 'urgent' THEN 0 WHEN a.priority = 'important' THEN 1 ELSE 2 END,
         a.created_at DESC
       LIMIT 50`
    )
    return Response.json(result.rows)
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const pool = getPool()
    const roleRes = await pool.query('SELECT role FROM "user" WHERE id = $1', [session.user.id])
    const role = roleRes.rows[0]?.role
    if (role !== 'admin' && role !== 'masjid_admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { title, body, type, priority, masjid_id, expires_at } = await request.json()
    if (!title) return Response.json({ error: 'Title is required' }, { status: 400 })

    const result = await pool.query(
      `INSERT INTO announcements (title, body, type, priority, masjid_id, created_by, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, body || null, type || 'general', priority || 'normal', masjid_id || null, session.user.id, expires_at || null]
    )
    return Response.json(result.rows[0], { status: 201 })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
