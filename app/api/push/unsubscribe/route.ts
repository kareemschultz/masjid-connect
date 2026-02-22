import { NextRequest } from 'next/server'
import { getPool } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json()
    if (!endpoint) return Response.json({ error: 'Missing endpoint' }, { status: 400 })
    const pool = getPool()
    await pool.query('UPDATE push_subscriptions SET active = false WHERE endpoint = $1', [endpoint])
    return Response.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
