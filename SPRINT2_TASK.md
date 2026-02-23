You are working on MasjidConnect GY — a Next.js 16 Islamic community app for Guyana.
Repo: /home/karetech/v0-masjid-connect-gy/
App is permanently dark — bg-[#0a0b14] base, bg-gray-900 cards, border-gray-800.
NEVER add light-mode classes or dark: prefixes. Text: text-[#f9fafb] or text-white primary, text-gray-400 secondary.

After ALL changes, rebuild & redeploy:
  cd /home/karetech/v0-masjid-connect-gy
  docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . && docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod && docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest && docker network connect kt-net-apps kt-masjidconnect-prod && docker network connect kt-net-databases kt-masjidconnect-prod

Then commit & push:
  git add -A && git commit -m "feat: sprint 2 — API wiring, masjid enhancements, safe-area, Zakat GYD, Islamic calendar" && git push origin main

=== TASK 1: PHONE STATUS BAR / SAFE-AREA FIX ===

The phone status bar (time, battery, signal) sometimes overlaps content because the viewport
doesn't declare viewport-fit=cover and the PageHero pt-14 doesn't account for the notch/Dynamic Island.

A) In app/layout.tsx, update the viewport export:
  export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',   // ← ADD THIS
    themeColor: [ ... same as before ... ],
  }

B) In components/page-hero.tsx, change pt-14 to use safe area:
  Replace: className="relative px-5 pt-14 pb-10"
  With:    className="relative px-5 pb-10" style={{ paddingTop: 'max(3.5rem, calc(env(safe-area-inset-top) + 1rem))' }}

C) In app/globals.css (or the global CSS file), add:
  .pb-safe { padding-bottom: env(safe-area-inset-bottom, 24px); }
  .pt-safe { padding-top: env(safe-area-inset-top, 0px); }
  
  Also make the bottom nav safe:
  Find the bottom nav component (components/bottom-nav.tsx) and ensure it has:
  style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
  or className uses pb-safe

=== TASK 2: HOME PAGE CHECKLIST → WIRE TO API ===

In app/page.tsx, the daily checklist (toggleItem function around line 225) currently only
updates localStorage. Wire it to also POST to /api/tracking.

Find the toggleItem/handleCheck function and add a fire-and-forget fetch after the localStorage update:
  fetch('/api/tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      [item.key]: true,  // item.key is the checklist key (e.g. 'quran_read', 'fajr_prayed', etc.)
    }),
  }).catch(() => {}) // silent fail - localStorage is the source of truth

Also read from /api/tracking on mount to hydrate the checklist from server (same as tracker/page.tsx does).

=== TASK 3: MASJID DIRECTORY ENHANCEMENTS ===

A) Expand lib/masjid-data.ts with:
   - Add more fields to the Masjid interface:
     * area: string  (neighbourhood/region: "Georgetown", "Linden", "Berbice", "East Coast Demerara", etc.)
     * facilities: string[]  (e.g. ['Parking', "Women's Section", 'Wudu Area', 'Classes', 'Library'])
     * jumu'ah: boolean  (holds Friday prayer)
     * phone: string (optional)
     * hours?: string  (e.g. "5:00 AM - 9:00 PM")
   
   - Populate ALL existing masjids with these new fields
   - Add 8–10 more Georgetown/Guyana masjids to bring total to ~20:
     * Include masjids from: East Coast Demerara (Annandale, Buxton, Mahaica), 
       Berbice region (New Amsterdam, Rose Hall), Linden, West Demerara (Vreed-en-Hoop)
     * Use realistic coordinates for Guyana (lat ~6.0–8.0, lng ~-58.0 to -57.0)
     * For added masjids you can approximate locations — mark them with verified: false

B) Update app/masjids/page.tsx with:
   - Search bar at the top (filter by name)
   - Area filter chips: All, Georgetown, East Coast, Berbice, Linden, West Demerara
   - Facility filter: All, Has Jumu'ah, Has Parking, Has Women's Section
   - Each masjid card now shows:
     * Name, address, area badge
     * Facility pills (small colored badges: parking, women's, etc.)
     * Jumu'ah badge if applicable
     * Phone number if available (tappable, opens dialer)
     * "Report Error" button (small, links to /feedback?category=Report+Masjid+Error&masjid=NAME)
   - "Request a Masjid" button at bottom linking to /feedback?category=Request+New+Masjid
   - "Check In" button on each card (more on this in Task 4)
   - Show total count: "X masjids listed"

C) Add a detail view for each masjid: 
   - Create app/masjids/[id]/page.tsx
   - Shows full masjid info: name, address, area, facilities, hours, phone, map embed (Google Maps link)
   - Check-in button
   - "Report Error" button

=== TASK 4: MASJID CHECK-IN ===

Add a live check-in feature. Use localStorage for the count (backend later).

A) In lib/storage.ts, add: CHECKINS: 'masjid_checkins' (Record<masjidId, {count, lastReset}>)

B) In app/masjids/page.tsx (and app/masjids/[id]/page.tsx):
   - Each masjid card has a "Check In" button
   - Tapping it increments a count stored in localStorage for that masjid (reset daily at midnight)
   - Show live count badge: "🕌 12 here today"
   - After checking in, button becomes "Checked In ✓" for that session

C) For Jumu'ah Friday pulse:
   - If today is Friday, show a special banner at top of Masjids page:
     "🕌 Jumu'ah today — Find a masjid near you"
   - Sort Jumu'ah masjids first on Fridays

=== TASK 5: COMMUNITY FEATURES — API WIRING ===

The community pages (Dua Board, Khatam, Feed) use localStorage. Wire them to API:

A) Create API routes:
   - app/api/community/dua-board/route.ts:
     * GET: returns dua_requests from DB (table: community_dua_requests)
     * POST: inserts new dua request { name, message, anonymous, date }
   - app/api/community/dua-board/react/route.ts:
     * POST: increments ameen_count for a request { request_id }
   - app/api/community/feed/route.ts:
     * GET: returns community posts (table: community_posts) 
     * POST: inserts new post { name, message, type, date }
   - app/api/community/feed/like/route.ts:
     * POST: increments like_count { post_id }
   - app/api/community/khatam/route.ts:
     * GET: returns khatam claims (table: khatam_claims)
     * POST: creates/updates claim { juz, user_name, completed }

   For each route:
   - Import { pool } from '@/lib/db'
   - Create the table if it doesn't exist (using CREATE TABLE IF NOT EXISTS in the GET handler's startup)
   - Wrap in try/catch, return 500 on error

B) Update community pages to fetch from API:
   - app/explore/community/dua-board/page.tsx: 
     * On mount: fetch('/api/community/dua-board') instead of getItem
     * On submit: POST to '/api/community/dua-board'
     * On Ameen: POST to '/api/community/dua-board/react'
     * Keep localStorage as fallback if fetch fails
   - app/explore/community/feed/page.tsx: same pattern with /api/community/feed
   - app/explore/community/khatam/page.tsx: same pattern with /api/community/khatam

=== TASK 6: ZAKAT CALCULATOR — GYD CURRENCY ===

app/explore/zakat/page.tsx already exists. Enhance it:

A) The NISAB_GYD is set to 1,500,000. Update to reflect current gold rate.
   Add a note: "Nisab based on ~85g gold (≈ GYD 1,500,000). Update based on current gold prices."

B) Add GYD formatting throughout: show all values as "GYD X,XXX,XXX" format

C) Add a section for Zakat al-Fitr (per-head charity at end of Ramadan):
   - Fixed amount per person: GYD 500 (or user-adjustable)
   - Input: number of family members
   - Output: total Zakat al-Fitr due

D) Add a "Who receives Zakat?" section at the bottom — 8 categories (asnaf) listed clearly

E) Add a "Pay Zakat" note at bottom: "To pay Zakat in Guyana, contact CIOG (Central Islamic Organisation of Guyana) or your local masjid."

=== TASK 7: ISLAMIC CALENDAR — REAL GY EVENTS ===

app/explore/calendar/page.tsx — enhance with real Islamic calendar events for 2026:

A) Add a data array of Islamic dates for 2026:
   Include:
   - Ramadan 1447 AH start: Feb 28 or Mar 1, 2026 (based on CIOG local sighting)
   - Laylatul Qadr: last 10 nights of Ramadan (odd nights: 21, 23, 25, 27, 29)
   - Eid al-Fitr 1447: ~Mar 30-31, 2026
   - Eid al-Adha 1447: ~Jun 6-7, 2026
   - Islamic New Year (1 Muharram 1448): ~Jul 7, 2026
   - Ashura (10 Muharram): ~Jul 16, 2026
   - Mawlid al-Nabi (12 Rabi al-Awwal): ~Sep 5, 2026
   - Isra wal Mi'raj (27 Rajab): ~Feb 17, 2026
   - Laylatul Bara'at (15 Sha'ban): ~Mar 14, 2026

B) Show events in a timeline/list view sorted by date
   - Event card: date, Hijri date, event name, brief description, importance badge (Important / Very Important / Blessed Night)
   - "X days away" or "X days ago" relative label
   - Upcoming events highlighted with a glow
   - Today's events (if any) shown at top with special styling

C) Add a "Add to Calendar" button for each event (generates an .ics file or opens Google Calendar)
   For Google Calendar: https://calendar.google.com/calendar/r/eventedit?text=EVENT&dates=YYYYMMDD/YYYYMMDD

=== TASK 8: SESSION LOG IN VAULT ===

Create /home/karetech/KareTech-Vault/Memory/Sessions/2026-02-22-masjidconnect-v1.9-sprint.md

Content:
# MasjidConnect GY — v1.9 Sprint Session Log
Date: Sunday, February 22, 2026
Duration: ~3 hours (6 PM – 9 PM GYT)

## Summary
Massive feature sprint completing MasjidConnect GY v1.9 and beginning v2.0 features.

## Features Built
- Noorani Qaida restored with 12 lessons, 29 Arabic letters (makhraj, letter forms)
- Learn to Pray: Wudu steps + Salah guide with SVG prayer position icons
- Year-round fasting tracker: Ramadan, Shawwal, Mon/Thu, Ayyam al-Bayd, Voluntary
- Community Hub: Dua Board, Khatam Collective, Halal Directory, Community Feed
- Prayer Settings onboarding simplified for new Muslims
- Google Sign-In accessible from Settings
- Feedback: Request New Masjid + Report Masjid Error
- Map page back button added
- Explore hero: animated star field

## Technical
- 21 files changed, 2,608+ lines added
- Commits: fe5eac4, b7cc7d6, 1fc7c6f
- Container: kt-masjidconnect-prod at 172.20.0.24:3000
- All endpoints verified 200

=== IMPORTANT CONSTRAINTS ===
- NEVER use bg-white, bg-gray-50, bg-gray-100 for backgrounds
- NEVER use text-gray-800, text-gray-900 as text color
- All pages: bg-[#0a0b14], cards: bg-gray-900, borders: border-gray-800
- Arabic text: className="font-arabic" with Amiri font
- All new sub-pages: showBack on PageHero, BottomNav at bottom
- DB: postgres via pool from '@/lib/db' — container name kt-central-db
- Do NOT modify ~/clawd/ workspace

When completely done, run:
openclaw system event --text "Done: Sprint 2 complete — API wiring, masjid enhancements, safe-area fix, Zakat GYD, Islamic calendar" --mode now
