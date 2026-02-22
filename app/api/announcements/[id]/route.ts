import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const pool = getPool()
    const roleRes = await pool.query('SELECT role FROM "user" WHERE id = $1', [session.user.id])
    const role = roleRes.rows[0]?.role
    if (role !== 'admin' && role !== 'masjid_admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params
    await pool.query('DELETE FROM announcements WHERE id = $1', [id])
    return Response.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
