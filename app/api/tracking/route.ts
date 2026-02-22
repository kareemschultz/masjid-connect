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

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    
    const body = await request.json()
    const { date, prayer_data, fasting, quran, dhikr, masjid } = body
    
    if (!date) return Response.json({ error: 'Date required' }, { status: 400 })

    const pool = getPool()
    
    // We need to handle partial updates carefully. 
    // If a field is undefined in the body, we shouldn't overwrite it with false.
    // However, PostgreSQL's ON CONFLICT DO UPDATE is tricky with partials unless we use COALESCE with the existing value.
    // But we can't easily access the "existing" value in the VALUES clause to pass to EXCLUDED.
    // A standard pattern is to build the query dynamically or use COALESCE(EXCLUDED.col, table.col) but 
    // that requires sending NULL in the INSERT for the fields we want to keep.
    
    // Helper to Convert undefined to null (so we can use COALESCE in SQL)
    const val = (v: any) => v === undefined ? null : v
    
    // For prayer_data (JSON), we merge if it exists? Or just replace? 
    // v1 usually replaced the whole JSON for that day. Let's replace for now.
    const prayerDataVal = prayer_data === undefined ? null : JSON.stringify(prayer_data)

    // Calculate 'prayer' boolean summary if prayer_data is being updated
    let prayerSummary = null
    if (prayer_data) {
        // If any prayer is true, set prayer=true. 
        // Note: v1 logic might differ, but this is a safe default.
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
        prayerSummary = prayers.some(p => prayer_data[p])
    }

    const query = `
      INSERT INTO ramadan_tracking (user_id, date, prayer, prayer_data, fasting, quran, dhikr, masjid, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (user_id, date) DO UPDATE SET
        prayer = COALESCE(EXCLUDED.prayer, ramadan_tracking.prayer),
        prayer_data = COALESCE(EXCLUDED.prayer_data, ramadan_tracking.prayer_data),
        fasting = COALESCE(EXCLUDED.fasting, ramadan_tracking.fasting),
        quran = COALESCE(EXCLUDED.quran, ramadan_tracking.quran),
        dhikr = COALESCE(EXCLUDED.dhikr, ramadan_tracking.dhikr),
        masjid = COALESCE(EXCLUDED.masjid, ramadan_tracking.masjid),
        updated_at = NOW()
      RETURNING *
    `
    
    const values = [
      session.user.id,
      date,
      prayerSummary, // $3
      prayerDataVal, // $4
      val(fasting),  // $5
      val(quran),    // $6
      val(dhikr),    // $7
      val(masjid)    // $8
    ]

    const result = await pool.query(query, values)
    return Response.json(result.rows[0])
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
