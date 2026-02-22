import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const pool = getPool()
    const result = await pool.query(
      `UPDATE friendships SET status = 'accepted' WHERE id = $1 AND addressee_id = $2 AND status = 'pending' RETURNING id`,
      [id, session.user.id]
    )
    if (!result.rows.length) return Response.json({ error: 'Request not found or already handled' }, { status: 404 })
    return Response.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
