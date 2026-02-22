import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const pool = getPool()
    const result = await pool.query('SELECT role FROM "user" WHERE id = $1', [session.user.id])
    return Response.json({ role: result.rows[0]?.role || 'user' })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
