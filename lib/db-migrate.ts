import { getPool } from './db'

export async function runMigrations() {
  const pool = getPool()
  try {
    // better-auth tables (camelCase column names — required by better-auth's Kysely adapter)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
        image TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "displayName" TEXT DEFAULT '',
        community TEXT DEFAULT '',
        "ramadanStart" TEXT DEFAULT '2026-02-19',
        "asrMadhab" TEXT DEFAULT 'shafi',
        "phoneNumber" TEXT
      );
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS session (
        id TEXT NOT NULL PRIMARY KEY,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        token TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS session_user_id_idx ON session("userId");
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS account (
        id TEXT NOT NULL PRIMARY KEY,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "accessTokenExpiresAt" TIMESTAMPTZ,
        "refreshTokenExpiresAt" TIMESTAMPTZ,
        scope TEXT,
        password TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS account_user_id_idx ON account("userId");
      CREATE INDEX IF NOT EXISTS account_provider_idx ON account("providerId", "accountId");
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification (
        id TEXT NOT NULL PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
    `)
    // App-specific tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT,
        email TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        reviewed BOOLEAN DEFAULT FALSE
      );
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_submissions (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT DEFAULT 'community',
        venue TEXT NOT NULL,
        date DATE NOT NULL,
        time TIME,
        description TEXT,
        contact TEXT,
        submitted_by TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        approved BOOLEAN DEFAULT FALSE
      );
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ramadan_tracking (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        date DATE NOT NULL,
        fasted BOOLEAN DEFAULT FALSE,
        quran BOOLEAN DEFAULT FALSE,
        dhikr BOOLEAN DEFAULT FALSE,
        prayer BOOLEAN DEFAULT FALSE,
        masjid BOOLEAN DEFAULT FALSE,
        prayer_data TEXT DEFAULT '{}',
        dhikr_data TEXT DEFAULT '{}',
        quran_data TEXT DEFAULT '{}',
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, date)
      );
    `)
    await pool.query(`ALTER TABLE ramadan_tracking ADD COLUMN IF NOT EXISTS quran_data TEXT DEFAULT '{}'`)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        user_id TEXT,
        anon_id TEXT,
        ramadan_start TEXT DEFAULT '2026-02-19',
        asr_madhab TEXT DEFAULT 'shafi',
        notification_prefs TEXT DEFAULT '{}',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS push_subs_active_idx ON push_subscriptions(active) WHERE active = true;
      CREATE INDEX IF NOT EXISTS push_subs_user_idx ON push_subscriptions(user_id) WHERE user_id IS NOT NULL;
    `)
    await pool.query(`ALTER TABLE push_subscriptions ADD COLUMN IF NOT EXISTS notification_prefs TEXT DEFAULT '{}'`)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS friendships (
        id SERIAL PRIMARY KEY,
        requester_id TEXT NOT NULL,
        addressee_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(requester_id, addressee_id)
      );
      CREATE INDEX IF NOT EXISTS friendships_requester_idx ON friendships(requester_id);
      CREATE INDEX IF NOT EXISTS friendships_addressee_idx ON friendships(addressee_id);
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS iftaar_submissions (
        id SERIAL PRIMARY KEY,
        masjid_id TEXT NOT NULL,
        menu TEXT NOT NULL,
        submitted_by TEXT NOT NULL,
        servings INTEGER,
        notes TEXT DEFAULT '',
        date DATE NOT NULL,
        likes INTEGER NOT NULL DEFAULT 0,
        attending INTEGER NOT NULL DEFAULT 0,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS iftaar_submissions_date_idx ON iftaar_submissions(date);
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submission_reactions (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER NOT NULL REFERENCES iftaar_submissions(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('like', 'attend')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(submission_id, user_id, type)
      );
      CREATE INDEX IF NOT EXISTS submission_reactions_sub_idx ON submission_reactions(submission_id);
      CREATE INDEX IF NOT EXISTS submission_reactions_user_idx ON submission_reactions(user_id);
    `)
    // Add role column to user table if missing
    await pool.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'`)
    await pool.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS username TEXT`)
    console.log('DB schema ready')
  } catch (err: any) {
    console.error('DB schema error:', err.message)
  }
}
