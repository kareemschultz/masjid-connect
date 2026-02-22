/**
 * Database seed script
 * Usage: DATABASE_URL=postgresql://... node scripts/seed.mjs
 *
 * Seeds the database with sample data for development.
 * Safe to run multiple times (uses ON CONFLICT DO NOTHING).
 */

import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL || 'postgresql://masjidconnect:masjidconnect_secret@localhost:5432/masjidconnect')

async function seed() {
  console.log('Seeding database...')

  // Create a demo user
  const [user] = await sql`
    INSERT INTO users (username, email, calculation_method, madhab, reciter, points, streak)
    VALUES ('Demo User', 'demo@masjidconnect.gy', 'Egyptian', 'Shafi', 'ar.alafasy', 150, 7)
    ON CONFLICT DO NOTHING
    RETURNING id, username
  `

  if (!user) {
    console.log('Demo user already exists, skipping seed.')
    await sql.end()
    return
  }

  console.log(`Created demo user: ${user.username} (${user.id})`)

  // Seed some prayer logs for the last 7 days
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    for (const prayer of prayers) {
      const status = Math.random() > 0.15 ? 'prayed' : 'missed'
      await sql`
        INSERT INTO prayer_logs (user_id, prayer_name, date, status)
        VALUES (${user.id}, ${prayer}, ${dateStr}, ${status})
        ON CONFLICT DO NOTHING
      `
    }
  }

  console.log('Seeded 7 days of prayer logs')

  // Create a sample challenge
  const [challenge] = await sql`
    INSERT INTO challenges (creator_id, title, description, type, target_value, start_date, end_date)
    VALUES (
      ${user.id},
      '30-Day Prayer Streak',
      'Complete all 5 daily prayers for 30 consecutive days',
      'prayer_streak',
      30,
      ${today.toISOString().split('T')[0]},
      ${new Date(today.getTime() + 30 * 86400000).toISOString().split('T')[0]}
    )
    RETURNING id
  `

  await sql`
    INSERT INTO challenge_participants (challenge_id, user_id, progress)
    VALUES (${challenge.id}, ${user.id}, 7)
  `

  console.log('Seeded sample challenge')
  console.log('Done!')

  await sql.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
