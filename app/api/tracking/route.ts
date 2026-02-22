import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const pool = getPool()
    const result = await pool.query(
      'SELECT * FROM ramadan_tracking WHERE user_id = $1 ORDER BY date ASC',
      [session.user.id]
    )
    return Response.json(result.rows)
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
