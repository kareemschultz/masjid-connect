import { NextRequest } from 'next/server'
import { getPool } from '@/lib/db'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!rateLimit(ip, 30, 60000)) return rateLimitResponse()
  try {
    const body = await request.json()
    const { post_id } = body
    if (!post_id) {
      return Response.json({ error: 'post_id required' }, { status: 400 })
    }
    const pool = getPool()
    const result = await pool.query(
      'UPDATE community_posts SET like_count = like_count + 1 WHERE id = $1 RETURNING *',
      [post_id]
    )
    if (result.rows.length === 0) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json(result.rows[0])
  } catch (err) {
    console.error('POST /api/community/feed/like error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
