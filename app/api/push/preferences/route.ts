import { NextRequest } from 'next/server'
import { getPool } from '@/lib/db'

export async function PATCH(request: NextRequest) {
  try {
    const { endpoint, ramadanStart, asrMadhab, notificationPrefs } = await request.json()
    if (!endpoint) return Response.json({ error: 'Missing endpoint' }, { status: 400 })

    const updates: string[] = []
    const values: any[] = []
    if (ramadanStart) { updates.push(`ramadan_start = $${values.length + 1}`); values.push(ramadanStart) }
    if (asrMadhab) { updates.push(`asr_madhab = $${values.length + 1}`); values.push(asrMadhab) }
    if (notificationPrefs) { updates.push(`notification_prefs = $${values.length + 1}`); values.push(JSON.stringify(notificationPrefs)) }
    if (!updates.length) return Response.json({ success: true })

    values.push(endpoint)
    const pool = getPool()
    await pool.query(
      `UPDATE push_subscriptions SET ${updates.join(', ')}, updated_at = NOW() WHERE endpoint = $${values.length}`,
      values
    )
    return Response.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
