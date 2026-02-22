import { NextRequest } from 'next/server'
import { getPool } from '@/lib/db'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!rateLimit(ip, 10, 60000)) return rateLimitResponse()

  const body = await request.json()
  const { title, type, venue, date, time, description, contact, submittedBy } = body || {}
  if (!title || !venue || !date || !submittedBy) {
    return Response.json({ error: 'title, venue, date and submittedBy are required' }, { status: 400 })
  }

  try {
    const pool = getPool()
    await pool.query(
      `INSERT INTO event_submissions (title, type, venue, date, time, description, contact, submitted_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [title, type || 'community', venue, date, time || null, description || null, contact || null, submittedBy]
    )
    return Response.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
