import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

function rowToSubmission(row: any) {
  return {
    id: String(row.id),
    masjidId: row.masjid_id,
    menu: row.menu,
    submittedBy: row.submitted_by,
    servings: row.servings,
    notes: row.notes || '',
    date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : String(row.date),
    likes: row.likes,
    attending: row.attending,
    submittedAt: row.submitted_at,
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request)
  if (!rateLimit(ip, 10, 60000)) return rateLimitResponse()

  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    if (!/^\d+$/.test(id)) return Response.json({ error: 'Invalid id' }, { status: 400 })

    const { type, delta } = await request.json()
    if (!['like', 'attend'].includes(type) || ![1, -1].includes(delta)) {
      return Response.json({ error: 'Invalid type or delta' }, { status: 400 })
    }

    const col = type === 'like' ? 'likes' : 'attending'
    const userId = session.user.id
    const pool = getPool()

    if (delta === 1) {
      const ins = await pool.query(
        `INSERT INTO submission_reactions (submission_id, user_id, type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [id, userId, type]
      )
      if (ins.rowCount === 0) {
        const cur = await pool.query('SELECT * FROM iftaar_submissions WHERE id = $1', [id])
        if (!cur.rows.length) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json({ ...rowToSubmission(cur.rows[0]), userLiked: true, userAttending: true })
      }
      await pool.query(`UPDATE iftaar_submissions SET ${col} = ${col} + 1 WHERE id = $1`, [id])
    } else {
      const del = await pool.query(
        `DELETE FROM submission_reactions WHERE submission_id = $1 AND user_id = $2 AND type = $3`,
        [id, userId, type]
      )
      if (del.rowCount && del.rowCount > 0) {
        await pool.query(`UPDATE iftaar_submissions SET ${col} = GREATEST(0, ${col} - 1) WHERE id = $1`, [id])
      }
    }

    const result = await pool.query('SELECT * FROM iftaar_submissions WHERE id = $1', [id])
    if (!result.rows.length) return Response.json({ error: 'Not found' }, { status: 404 })

    const userReactions = await pool.query(
      'SELECT type FROM submission_reactions WHERE submission_id = $1 AND user_id = $2',
      [id, userId]
    )
    const reacted = new Set(userReactions.rows.map((r: any) => r.type))
    return Response.json({ ...rowToSubmission(result.rows[0]), userLiked: reacted.has('like'), userAttending: reacted.has('attend') })
  } catch (err: any) {
    console.error('POST /api/submissions/:id/react error:', err.message)
    return Response.json({ error: 'Failed to update reaction' }, { status: 500 })
  }
}
