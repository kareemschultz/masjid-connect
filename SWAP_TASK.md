# Swap Task: Make v2 the Main App at masjidconnectgy.com

## Goal
1. Port 2 missing pages from v1 into v2
2. Add URL redirects for path changes
3. Fix any backend errors
4. Update env and deploy v2 as the main app at masjidconnectgy.com

---

## Step 1: Port Missing Pages from v1

### 1A — TonightIftaar Page
**v1 source files to copy:**
- `/home/karetech/georgetown-iftaar/src/components/TonightIftaar.jsx`
- `/home/karetech/georgetown-iftaar/src/components/SubmitForm.jsx`
- `/home/karetech/georgetown-iftaar/src/components/SubmitHub.jsx`
- `/home/karetech/georgetown-iftaar/src/hooks/useSubmissions.js`
- `/home/karetech/georgetown-iftaar/src/data/masjids.js`
- `/home/karetech/georgetown-iftaar/src/data/ramadanTimetable.js`
- `/home/karetech/georgetown-iftaar/src/utils/timezone.js`
- `/home/karetech/georgetown-iftaar/src/utils/pushNotifications.js`

**Target in v2:**
- Copy data files → `lib/masjids.ts` (or .js — remove types minimally)
- Copy timezone utils → `lib/timezone.ts`
- Create `app/iftaar/page.tsx` — port TonightIftaar.jsx as a Next.js client component
  - Change all React Router `<Link>` → Next.js `<Link>`
  - Change all `fetch('/api/...')` calls → keep as-is (Next.js API routes use same paths)
  - Add `'use client'` at top
  - Keep all the logic, state, UI exactly as v1
  - Use v2's existing PageHero component

**Note:** The API endpoints this page uses:
- `GET /api/submissions` — list today's iftaar submissions
- `POST /api/submissions` — submit new iftaar info
- `POST /api/submissions/:id/react` — react to a submission
These are already in v2's API routes. Just verify they work.

### 1B — Map View
**v1 source:** `/home/karetech/georgetown-iftaar/src/components/MapView.jsx`

**Target:** `app/map/page.tsx`
- Port MapView.jsx as Next.js client component
- Leaflet requires `'use client'` and dynamic import (no SSR):
```tsx
// app/map/page.tsx
'use client'
import dynamic from 'next/dynamic'
const MapView = dynamic(() => import('@/components/map-view'), { ssr: false })
export default function MapPage() { return <MapView /> }
```
- Create `components/map-view.tsx` from the v1 MapView.jsx
- Add leaflet to dependencies: `npm install leaflet @types/leaflet`
- Add to `app/masjids/page.tsx` a "View Map" button linking to `/map`

---

## Step 2: Add URL Redirects (backward compat for v1 links)

In `next.config.mjs`, add redirects for all v1 paths that changed in v2:

```js
async redirects() {
  return [
    { source: '/adhkar',    destination: '/explore/adhkar',  permanent: true },
    { source: '/duas',      destination: '/explore/duas',    permanent: true },
    { source: '/events',    destination: '/explore/events',  permanent: true },
    { source: '/madrasa',   destination: '/explore/madrasa', permanent: true },
    { source: '/qibla',     destination: '/explore/qibla',   permanent: true },
    { source: '/resources', destination: '/explore/resources', permanent: true },
    { source: '/tasbih',    destination: '/explore/tasbih',  permanent: true },
    { source: '/zakat',     destination: '/explore/zakat',   permanent: true },
    { source: '/fasting',   destination: '/tracker/fasting', permanent: true },
    { source: '/names',     destination: '/explore/names',   permanent: true },
    { source: '/buddy/how-it-works', destination: '/explore/buddy/how-it-works', permanent: true },
    { source: '/tracker',   destination: '/tracker',         permanent: false },
  ]
}
```

---

## Step 3: Fix Backend Issues

Check and fix these known/potential issues in v2:

1. **BETTER_AUTH_URL** — currently set to `https://v2.masjidconnectgy.com/api/auth`
   - Update `.env.local`: `BETTER_AUTH_URL=https://masjidconnectgy.com/api/auth`

2. **Google OAuth redirect URI** — Google Console must have `https://masjidconnectgy.com/api/auth/callback/google`
   - This should already work since v1 used the same domain (no code change needed)

3. **Check lib/auth.ts** — verify `trustedOrigins` includes `https://masjidconnectgy.com`

4. **Test key API endpoints** (do this after build):
```bash
curl -s https://v2.masjidconnectgy.com/api/health
curl -s https://v2.masjidconnectgy.com/api/config
curl -s https://v2.masjidconnectgy.com/api/announcements
```

---

## Step 4: Community Wording Check

Search v2 for any placeholder/generic text and replace with proper GY community wording:
- Any "Demo" or "placeholder" text → remove
- About page: "Built by the Muslim community of Georgetown, Guyana. Independent. No ads. No affiliations."
- App description: "Free Islamic companion for every Muslim in Guyana"
- NOT affiliated with CIOG, GIT, or any specific masjid organisation

---

## Step 5: Build & Deploy as Main App

```bash
cd /home/karetech/v0-masjid-connect-gy

# 1. Update env
sed -i 's|BETTER_AUTH_URL=.*|BETTER_AUTH_URL=https://masjidconnectgy.com/api/auth|' .env.local

# 2. Build
npm run build

# 3. If build passes, rebuild Docker image
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .

# 4. Stop current v2 container, restart with updated env
docker stop kt-masjidconnect-v2 && docker rm kt-masjidconnect-v2
docker run -d --name kt-masjidconnect-v2 \
  --network kt-net-apps \
  -p 3001:3000 \
  --env-file .env.local \
  --restart unless-stopped \
  ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
docker network connect pangolin kt-masjidconnect-v2
docker network connect kt-net-databases kt-masjidconnect-v2

# 5. Get new container IP on pangolin network
V2_IP=$(docker inspect kt-masjidconnect-v2 --format '{{(index .NetworkSettings.Networks "pangolin").IPAddress}}')
echo "v2 IP on pangolin: $V2_IP"

# 6. Point masjidconnectgy.com (resource 38) at v2 container
sudo sqlite3 /opt/infrastructure/docker/pangolin/config/db/db.sqlite \
  "UPDATE targets SET ip='$V2_IP' WHERE resourceId=38;"

# 7. Also update resource 39 (v2.masjidconnectgy.com) to same container
sudo sqlite3 /opt/infrastructure/docker/pangolin/config/db/db.sqlite \
  "UPDATE targets SET ip='$V2_IP' WHERE resourceId=39;"

# 8. Restart Pangolin
docker restart pangolin
sleep 12

# 9. Verify both domains
curl -s -o /dev/null -w "masjidconnectgy.com: %{http_code}\n" https://masjidconnectgy.com
curl -s -o /dev/null -w "v2.masjidconnectgy.com: %{http_code}\n" https://v2.masjidconnectgy.com
curl -s https://masjidconnectgy.com/api/health
```

---

## Step 6: Retire v1 Container Gracefully

```bash
# Stop v1 container (keep image for 48h in case rollback needed)
docker stop kt-masjidconnect-web
# Do NOT remove yet — keep as fallback for 48 hours
echo "v1 container stopped. Image preserved for rollback if needed."
```

---

## Step 7: Commit & Push

```bash
cd /home/karetech/v0-masjid-connect-gy
git add -A
git commit -m "feat: v1 feature parity + masjidconnectgy.com swap

- Ported TonightIftaar (/iftaar) — community iftaar submissions
- Ported MapView (/map) — Leaflet masjid map
- Added URL redirects for all v1 path changes
- Updated BETTER_AUTH_URL to masjidconnectgy.com
- masjidconnectgy.com now served by Next.js v2 app"
git push origin main
```

---

## Step 8: Signal Completion

```bash
openclaw --profile alfred system event --text "MasjidConnect v2 is now live at masjidconnectgy.com — swap complete" --mode now
```
