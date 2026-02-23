import { NextRequest } from 'next/server'
import { getPool } from '@/lib/db'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  name TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'General',
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
)`

let initialized = false

async function ensureTable() {
  if (initialized) return
  const pool = getPool()
  await pool.query(INIT_SQL)
  initialized = true
}

export async function GET() {
  try {
    await ensureTable()
    const pool = getPool()
    const result = await pool.query(
      'SELECT * FROM community_posts ORDER BY created_at DESC LIMIT 100'
    )
    return Response.json(result.rows)
  } catch (err) {
    console.error('GET /api/community/feed error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!rateLimit(ip, 10, 60000)) return rateLimitResponse()
  try {
    await ensureTable()
    const body = await request.json()
    const { name, message, type } = body
    if (!message?.trim()) {
      return Response.json({ error: 'Message required' }, { status: 400 })
    }
    const pool = getPool()
    const result = await pool.query(
      'INSERT INTO community_posts (name, message, type) VALUES ($1, $2, $3) RETURNING *',
      [name?.trim() || 'Anonymous', message.trim(), type || 'General']
    )
    return Response.json(result.rows[0])
  } catch (err) {
    console.error('POST /api/community/feed error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
