import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Lazy singleton — only connects when getDb() is first called,
// so the app boots even when DATABASE_URL is not set (e.g. v0 preview).
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (_db) return _db

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Database features are unavailable in this environment.'
    )
  }

  const conn = postgres(url, { max: 10 })
  _db = drizzle(conn, { schema })
  return _db
}

// Re-export schema for convenience
export { schema }
