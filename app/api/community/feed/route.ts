import { NextRequest } from 'next/server'
import { getPool } from '@/lib/db'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

const MAX_MESSAGE_LENGTH = 600

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
    const body = await request.json()
    const { name, message, type } = body
    const normalizedMessage = typeof message === 'string' ? message.trim() : ''
    if (!normalizedMessage) {
      return Response.json({ error: 'Message required' }, { status: 400 })
    }
    if (normalizedMessage.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` },
        { status: 400 }
      )
    }
    await ensureTable()
    const pool = getPool()
    const normalizedType =
      typeof type === 'string' && type.trim() ? type.trim() : 'General'
    const normalizedName =
      typeof name === 'string' && name.trim() ? name.trim() : 'Anonymous'
    const result = await pool.query(
      'INSERT INTO community_posts (name, message, type) VALUES ($1, $2, $3) RETURNING *',
      [normalizedName, normalizedMessage, normalizedType]
    )
    return Response.json(result.rows[0])
  } catch (err) {
    console.error('POST /api/community/feed error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
