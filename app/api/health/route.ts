import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '0.1.0',
  }

  // Optionally check DB connection
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import('@/lib/db')
      const { users } = await import('@/lib/db/schema')
      await db.select({ id: users.id }).from(users).limit(1)
      Object.assign(healthcheck, { database: 'connected' })
    } catch {
      Object.assign(healthcheck, { database: 'disconnected' })
    }
  } else {
    Object.assign(healthcheck, { database: 'not_configured' })
  }

  return NextResponse.json(healthcheck)
}
