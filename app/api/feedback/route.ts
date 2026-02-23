import { NextRequest } from 'next/server'
import { getPool } from '@/lib/db'
import { sendNtfy } from '@/lib/ntfy'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const { auth } = await import("@/lib/auth")
  const headers = Object.fromEntries(request.headers.entries())
  const session = await auth.api.getSession({ headers })
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const pool = getPool()
  const roleRes = await pool.query("SELECT role FROM \"user\" WHERE id = $1", [session.user.id])
  if (!roleRes.rows[0] || (roleRes.rows[0].role !== "admin" && roleRes.rows[0].role !== "masjid_admin")) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const typeFilter = request.nextUrl.searchParams.get("type")
  const query = typeFilter
    ? "SELECT * FROM feedback WHERE type = $1 ORDER BY created_at DESC"
    : "SELECT * FROM feedback ORDER BY created_at DESC"
  const params = typeFilter ? [typeFilter] : []
  const result = await pool.query(query, params)
  return Response.json(result.rows)
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!rateLimit(ip, 10, 60000)) return rateLimitResponse()

  const body = await request.json()
  const { type, name, email, message } = body || {}
  if (!message || !type) return Response.json({ error: 'type and message are required' }, { status: 400 })

  try {
    const pool = getPool()
    await pool.query(
      `INSERT INTO feedback (type, name, email, message) VALUES ($1, $2, $3, $4)`,
      [type, name || null, email || null, message]
    )

    const typeLabel: Record<string, string> = { correction: 'Correction', add_masjid: 'Add Masjid', prayer_time: 'Prayer Time Fix', feature: 'Feature Idea', bug: 'Bug Report', halal_update: 'Halal Directory Update', other: 'Other' }
    const typeEmoji: Record<string, string> = { correction: '✏️', add_masjid: '🕌', prayer_time: '🕐', feature: '💡', bug: '🐛', halal_update: '🥩', other: '💬' }
    const emoji = typeEmoji[type] || '💬'
    const label = typeLabel[type] || type
    const from = name ? `${name}${email ? ` <${email}>` : ''}` : (email || 'Anonymous')
    sendNtfy({
      title: `MasjidConnect Feedback: ${label}`,
      message: `${emoji} ${label}\nFrom: ${from}\n\n${message}`,
      priority: (type === 'bug' || type === 'halal_update') ? 4 : 3,
      tags: [type === 'bug' ? 'bug' : 'speech_balloon', 'masjid'],
    })

    return Response.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
