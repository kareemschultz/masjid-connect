import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'
import { getUserStatsBatch, getLevel } from '@/lib/points'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const uid = session.user.id
    const pool = getPool()

    const friendRes = await pool.query(`
      SELECT CASE WHEN requester_id = $1 THEN addressee_id ELSE requester_id END AS friend_id
      FROM friendships WHERE (requester_id=$1 OR addressee_id=$1) AND status='accepted'
    `, [uid])
    const participantIds = [uid, ...friendRes.rows.map((r: any) => r.friend_id)]

    const userRes = await pool.query(
      `SELECT id, name, "displayName", username FROM "user" WHERE id = ANY($1)`,
      [participantIds]
    )
    const usersById = Object.fromEntries(userRes.rows.map((u: any) => [u.id, u]))

    const statsMap = await getUserStatsBatch(participantIds)
    const entries = participantIds.map((pid) => {
      const stats = statsMap.get(pid) || { totalPoints: 0, streak: 0, level: getLevel(0) }
      const u = usersById[pid] || {}
      return {
        userId: pid,
        name: u.name || '',
        displayName: u.displayName || u.name || '',
        username: u.username || null,
        totalPoints: stats.totalPoints,
        streak: stats.streak,
        level: stats.level,
        isMe: pid === uid,
      }
    })

    entries.sort((a, b) => b.totalPoints - a.totalPoints)
    entries.forEach((e, i) => { (e as any).rank = i + 1 })

    return Response.json(entries)
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
