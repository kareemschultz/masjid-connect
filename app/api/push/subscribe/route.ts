import { NextRequest } from 'next/server'
import { getPool } from '@/lib/db'
import { auth } from '@/lib/auth'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!rateLimit(ip, 10, 60000)) return rateLimitResponse()

  try {
    const { endpoint, keys, anonId, ramadanStart, asrMadhab, notificationPrefs } = await request.json()
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return Response.json({ error: 'Missing subscription fields' }, { status: 400 })
    }

    let userId = null
    try {
      const session = await auth.api.getSession({ headers: request.headers })
      userId = session?.user?.id || null
    } catch {}

    const prefsJson = notificationPrefs ? JSON.stringify(notificationPrefs) : '{}'
    const pool = getPool()

    await pool.query(`
      INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_id, anon_id, ramadan_start, asr_madhab, notification_prefs, active, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
      ON CONFLICT (endpoint)
      DO UPDATE SET p256dh=$2, auth=$3, user_id=COALESCE($4, push_subscriptions.user_id),
        anon_id=COALESCE($5, push_subscriptions.anon_id),
        ramadan_start=COALESCE($6, push_subscriptions.ramadan_start),
        asr_madhab=COALESCE($7, push_subscriptions.asr_madhab),
        notification_prefs=COALESCE($8, push_subscriptions.notification_prefs),
        active=true, updated_at=NOW()
    `, [endpoint, keys.p256dh, keys.auth, userId, anonId || null,
        ramadanStart || '2026-02-19', asrMadhab || 'shafi', prefsJson])

    return Response.json({ success: true })
  } catch (err: any) {
    console.error('Subscribe error:', err.message)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
