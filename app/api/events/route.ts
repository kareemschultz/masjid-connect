import { NextRequest } from "next/server"
import { getPool } from "@/lib/db"

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

  const result = await pool.query("SELECT * FROM event_submissions ORDER BY created_at DESC")
  return Response.json(result.rows)
}
