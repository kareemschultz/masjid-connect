try {
  console.log('[v0] Testing postgres import...')
  const pg = await import('postgres')
  console.log('[v0] postgres imported OK:', typeof pg.default)
} catch (e) {
  console.log('[v0] postgres import FAILED:', e.message)
}

try {
  console.log('[v0] Testing drizzle-orm import...')
  const drizzle = await import('drizzle-orm/postgres-js')
  console.log('[v0] drizzle-orm imported OK:', typeof drizzle.drizzle)
} catch (e) {
  console.log('[v0] drizzle-orm import FAILED:', e.message)
}

try {
  console.log('[v0] Testing drizzle pg-core import...')
  const pgCore = await import('drizzle-orm/pg-core')
  console.log('[v0] pg-core imported OK:', typeof pgCore.pgTable)
} catch (e) {
  console.log('[v0] pg-core import FAILED:', e.message)
}

try {
  console.log('[v0] Testing adhan import...')
  const adhan = await import('adhan')
  console.log('[v0] adhan imported OK:', typeof adhan.PrayerTimes)
} catch (e) {
  console.log('[v0] adhan import FAILED:', e.message)
}

try {
  console.log('[v0] Testing bcryptjs import...')
  const bcrypt = await import('bcryptjs')
  console.log('[v0] bcryptjs imported OK:', typeof bcrypt.hash)
} catch (e) {
  console.log('[v0] bcryptjs import FAILED:', e.message)
}

console.log('[v0] All import tests complete')
