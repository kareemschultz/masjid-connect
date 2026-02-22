import { NextRequest } from 'next/server'
import { getPool } from '@/lib/db'

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS khatam_claims (
  id SERIAL PRIMARY KEY,
  juz INTEGER NOT NULL,
  user_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(juz, user_name)
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
      'SELECT * FROM khatam_claims ORDER BY juz ASC'
    )
    return Response.json(result.rows)
  } catch (err) {
    console.error('GET /api/community/khatam error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable()
    const body = await request.json()
    const { juz, user_name, completed } = body
    if (!juz || !user_name?.trim()) {
      return Response.json({ error: 'juz and user_name required' }, { status: 400 })
    }
    const pool = getPool()
    const result = await pool.query(
      `INSERT INTO khatam_claims (juz, user_name, completed)
       VALUES ($1, $2, $3)
       ON CONFLICT (juz, user_name) DO UPDATE SET completed = $3
       RETURNING *`,
      [juz, user_name.trim(), !!completed]
    )
    return Response.json(result.rows[0])
  } catch (err) {
    console.error('POST /api/community/khatam error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
