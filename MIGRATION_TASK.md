# Backend Migration Task — Express → Next.js API Routes

## Goal
Port the entire Express.js backend from `../georgetown-iftaar/api/src/index.js`
into this Next.js app as App Router route handlers (`app/api/...`).

The existing Next.js app already has the frontend UI.
This task ONLY adds the backend — do NOT change any existing frontend pages or components.

## Tech Stack (keep identical)
- PostgreSQL via `pg` Pool (same DB, same schema — runs in Docker)
- Better Auth v1.4.x with username plugin + Google OAuth
- web-push (VAPID) for push notifications
- node-cron for prayer time scheduling
- adhan@4.4.3 for prayer time calculation
- ntfy for admin notifications

## Dependencies to add
```bash
npm install pg better-auth web-push node-cron adhan express-rate-limit
npm install --save-dev @types/pg @types/web-push @types/node-cron
```

## Environment Variables (copy from existing .env)
The existing API uses these env vars. Add them to `.env.local`:
```
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=https://masjidconnectgy.com/api/auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@masjidconnectgy.com
NTFY_URL=http://172.20.0.12
NTFY_TOKEN=
NTFY_TOPIC=masjidconnect-feedback
PORT=3000
```

Read the actual values from: `../georgetown-iftaar/api/.env`

## Shared Utilities to create

Create `lib/db.ts` — PostgreSQL pool (singleton):
```ts
import pg from 'pg'
const { Pool } = pg
let pool: pg.Pool

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  }
  return pool
}
```

Create `lib/auth.ts` — Better Auth instance (singleton):
Port the `betterAuth({...})` config from the Express app exactly.
Use `toNextJsHandler` from `better-auth/next-js` instead of `toNodeHandler`.
Keep all the same fields: emailAndPassword, username plugin, Google OAuth,
additionalFields (displayName, community, ramadanStart, asrMadhab, phoneNumber),
trustedOrigins, advanced cookie config.

Create `lib/webpush.ts` — VAPID setup + sendPrayerPush function.
Port exactly from the Express app. Keep PRAYER_NOTIF_CONFIG, parseNotifPrefs,
sendPrayerPush, isRamadan, RAMADAN_START/END.

Create `lib/prayer-scheduler.ts` — Prayer time cron logic.
Port getTodayPrayerTimes, sentToday, resetSentTracker.
Export `startPrayerScheduler()` function that sets up the two cron jobs.

Create `lib/points.ts` — Points calculation.
Port calcDayPoints, calcTotalPoints, LEVELS, getLevel, calcStatsFromRows,
getUserStats, getUserStatsBatch from the Express app exactly.

Create `lib/ntfy.ts` — sendNtfy function (port exactly).

## API Routes to create (App Router format)

Each route file exports GET/POST/PUT/PATCH/DELETE named handlers.

```
app/api/
├── health/route.ts
├── config/route.ts
├── auth/[...all]/route.ts          ← Better Auth handler
├── quran/surah/[number]/route.ts   ← with in-memory cache Map
├── push/
│   ├── vapid-public-key/route.ts
│   ├── subscribe/route.ts
│   ├── unsubscribe/route.ts
│   └── preferences/route.ts
├── user/
│   ├── profile/route.ts
│   ├── preferences/route.ts
│   └── role/route.ts
├── tracking/
│   ├── route.ts                    ← GET all tracking
│   └── [date]/route.ts             ← GET + PUT by date
├── feedback/route.ts
├── events/
│   └── submit/route.ts
├── friends/
│   ├── route.ts                    ← GET list + POST request
│   └── [id]/
│       ├── accept/route.ts
│       └── route.ts                ← DELETE
├── leaderboard/route.ts
├── announcements/
│   ├── route.ts                    ← GET list + POST create
│   └── [id]/route.ts               ← DELETE
└── submissions/
    ├── route.ts                    ← GET list + POST create
    └── [id]/
        └── react/route.ts
```

## Rate Limiting
Port the three limiters (global 100/min, mutation 10/min, auth 5/min).
Use a simple in-memory Map-based rate limiter for Next.js since
express-rate-limit won't work directly. Or use `next-rate-limit` package.
Apply to: subscribe (mutation), feedback (mutation), events/submit (mutation),
friends/request (mutation), submissions POST (mutation), submissions react (mutation),
auth routes (auth limiter).

Simple implementation:
```ts
// lib/rate-limit.ts
const requests = new Map<string, {count: number, resetAt: number}>()

export function rateLimit(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const key = ip
  const entry = requests.get(key)
  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }
  if (entry.count >= max) return false // blocked
  entry.count++
  return true // allowed
}
```

## Cron Job (CRITICAL — use instrumentation.ts)

Next.js 14+ supports `instrumentation.ts` at the project root which runs
once on server startup. Use it to start the cron:

```ts
// instrumentation.ts (project root)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startPrayerScheduler } = await import('./lib/prayer-scheduler')
    startPrayerScheduler()
    console.log('[Instrumentation] Prayer scheduler started')
  }
}
```

Enable it in next.config.mjs:
```js
const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  experimental: { instrumentationHook: true },
}
```

## DB Schema Migration
Port the full `app.listen` DB migration block into a `lib/db-migrate.ts` function.
Call it from `instrumentation.ts` after starting the scheduler:
```ts
const { runMigrations } = await import('./lib/db-migrate')
await runMigrations()
```

## CORS
Next.js handles CORS differently. Add these headers to all API responses:
```ts
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
    ? 'https://masjidconnectgy.com'
    : 'http://localhost:5173',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,Cookie',
}
```

Handle OPTIONS preflight in each route with:
```ts
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}
```

Or create a middleware.ts that sets CORS headers for all /api/* routes.

## Trust Proxy
Next.js automatically trusts proxy headers when deployed behind a reverse proxy.
Use `request.headers.get('x-forwarded-for')` for IP addresses.

## Quran API Cache
The in-memory cache Map needs to be a module-level singleton:
```ts
// In the quran route file
const quranCache = new Map<string, {data: unknown, ts: number}>()
const QURAN_CACHE_TTL = 24 * 60 * 60 * 1000
```

## After Completing All Routes

1. Build to verify no errors: `npm run build`
2. Copy env vars from `../georgetown-iftaar/api/.env` to `.env.local`
3. Rebuild Docker image:
```bash
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .
docker stop kt-masjidconnect-v2 && docker rm kt-masjidconnect-v2
docker run -d --name kt-masjidconnect-v2 \
  --network kt-net-apps \
  -p 3001:3000 \
  --env-file ../georgetown-iftaar/api/.env \
  --restart unless-stopped \
  ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
docker network connect pangolin kt-masjidconnect-v2
PANGOLIN_IP=$(docker inspect kt-masjidconnect-v2 --format '{{(index .NetworkSettings.Networks "pangolin").IPAddress}}')
sudo sqlite3 /opt/infrastructure/docker/pangolin/config/db/db.sqlite \
  "UPDATE targets SET ip = '$PANGOLIN_IP' WHERE resourceId = 39;"
docker restart pangolin
```
4. Test key endpoints:
```bash
curl https://v2.masjidconnectgy.com/api/health
curl https://v2.masjidconnectgy.com/api/config
curl https://v2.masjidconnectgy.com/api/push/vapid-public-key
```
5. Commit all changes: `git add -A && git commit -m "feat: migrate Express backend to Next.js API routes"`
6. When all tests pass, run:
   `openclaw --profile alfred system event --text "MasjidConnect v2 backend migration complete — all API routes live" --mode now`
