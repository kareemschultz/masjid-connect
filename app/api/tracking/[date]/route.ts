import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const { date } = await params
    if (!DATE_RE.test(date)) return Response.json({ error: 'Invalid date format' }, { status: 400 })
    const pool = getPool()
    const result = await pool.query(
      'SELECT * FROM ramadan_tracking WHERE user_id = $1 AND date = $2',
      [session.user.id, date]
    )
    return Response.json(result.rows[0] || null)
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const { date } = await params
    if (!DATE_RE.test(date)) return Response.json({ error: 'Invalid date format' }, { status: 400 })

    const { fasted, quran, dhikr, prayer, masjid, prayer_data, dhikr_data, quran_data } = await request.json()
    const prayerJson = prayer_data ? JSON.stringify(prayer_data) : '{}'
    const dhikrJson = dhikr_data ? JSON.stringify(dhikr_data) : '{}'
    const quranJson = quran_data ? JSON.stringify(quran_data) : '{}'

    const pool = getPool()
    await pool.query(`
      INSERT INTO ramadan_tracking (user_id, date, fasted, quran, dhikr, prayer, masjid, prayer_data, dhikr_data, quran_data, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (user_id, date)
      DO UPDATE SET fasted=$3, quran=$4, dhikr=$5, prayer=$6, masjid=$7, prayer_data=$8, dhikr_data=$9, quran_data=$10, updated_at=NOW()
    `, [session.user.id, date, !!fasted, !!quran, !!dhikr, !!prayer, !!masjid, prayerJson, dhikrJson, quranJson])
    return Response.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
