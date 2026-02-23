import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getPool } from '@/lib/db'
import { sendNtfy } from '@/lib/ntfy'
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function rowToSubmission(row: any) {
  return {
    id: String(row.id),
    masjidId: row.masjid_id,
    menu: row.menu,
    submittedBy: row.submitted_by,
    servings: row.servings,
    notes: row.notes || '',
    date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : String(row.date),
    likes: row.likes,
    attending: row.attending,
    submittedAt: row.submitted_at,
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const date = url.searchParams.get('date')
    if (date && !DATE_RE.test(date)) return Response.json({ error: 'Invalid date format' }, { status: 400 })

    let userId = null
    try {
      const session = await auth.api.getSession({ headers: request.headers })
      userId = session?.user?.id || null
    } catch {}

    const pool = getPool()
    const masjidId = url.searchParams.get('masjidId')
    let query = 'SELECT * FROM iftaar_submissions'
    const params: any[] = []
    const clauses: string[] = []
    if (date) { clauses.push(`date = $${params.length + 1}`); params.push(date) }
    if (masjidId) { clauses.push(`masjid_id = $${params.length + 1}`); params.push(masjidId) }
    if (clauses.length) query += ' WHERE ' + clauses.join(' AND ')
    query += ' ORDER BY date DESC, submitted_at DESC LIMIT 50'

    const result = await pool.query(query, params)

    if (!userId || !result.rows.length) {
      return Response.json(result.rows.map(rowToSubmission))
    }

    const ids = result.rows.map((r: any) => r.id)
    const reactRes = await pool.query(
      'SELECT submission_id, type FROM submission_reactions WHERE submission_id = ANY($1) AND user_id = $2',
      [ids, userId]
    )
    const reacted = new Map<number, Set<string>>()
    for (const r of reactRes.rows) {
      if (!reacted.has(r.submission_id)) reacted.set(r.submission_id, new Set())
      reacted.get(r.submission_id)!.add(r.type)
    }

    return Response.json(result.rows.map((row: any) => ({
      ...rowToSubmission(row),
      userLiked: reacted.get(row.id)?.has('like') ?? false,
      userAttending: reacted.get(row.id)?.has('attend') ?? false,
    })))
  } catch (err: any) {
    console.error('GET /api/submissions error:', err.message)
    return Response.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!rateLimit(ip, 10, 60000)) return rateLimitResponse()

  try {
    const { masjidId, menu, submittedBy, servings, notes, date } = await request.json()
    if (!masjidId || !menu || !submittedBy) {
      return Response.json({ error: 'masjidId, menu, submittedBy are required' }, { status: 400 })
    }

    const pool = getPool()
    const result = await pool.query(
      `INSERT INTO iftaar_submissions (masjid_id, menu, submitted_by, servings, notes, date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [masjidId, menu, submittedBy, servings || null, notes || '', date || new Date().toISOString().split('T')[0]]
    )
    const submission = rowToSubmission(result.rows[0])

    sendNtfy({
      title: 'New Iftaar Report',
      message: `${submittedBy} submitted for ${masjidId}: ${menu}`,
      tags: ['fork_and_knife'],
    })

    return Response.json(submission, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/submissions error:', err.message)
    return Response.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}
