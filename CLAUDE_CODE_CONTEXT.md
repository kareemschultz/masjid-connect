# MasjidConnect GY — Claude Code Handoff Context
*Generated: Feb 22, 2026 — for continuity across sessions*

## What This App Is
MasjidConnect GY is a Progressive Web App (PWA) for the Muslim community in Guyana.
It is an all-in-one Islamic companion: prayer times, Quran, fasting tracker, masjid directory,
community features, Noorani Qaida, and more.

**Live URL:** https://masjidconnectgy.com  
**Repo:** https://github.com/kareemschultz/v0-masjid-connect-gy  
**Local path:** `/home/karetech/v0-masjid-connect-gy/`

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Auth:** Better Auth with Google Sign-In
- **Database:** PostgreSQL via `lib/db.ts` (container: `kt-central-db`)
- **Push notifications:** Web Push VAPID via `lib/webpush.ts`
- **Fonts:** Amiri + Amiri Quran (for Arabic text — use `className="font-arabic"`)
- **Container:** `kt-masjidconnect-prod` at `172.20.0.24:3000`
- **Networks:** `pangolin` + `kt-net-apps` + `kt-net-databases` (ALL THREE required)

## Design Rules — NEVER BREAK
```
Base background:   bg-[#0a0b14]
Cards:             bg-gray-900  border border-gray-800
Primary text:      text-[#f9fafb]  or  text-white
Secondary text:    text-gray-400
Muted text:        text-gray-500
Accent:            emerald-400 / emerald-500 / emerald-600
Arabic font:       className="font-arabic"   (Amiri loaded globally)

NEVER USE:  bg-white, bg-gray-50, bg-gray-100
NEVER USE:  text-gray-800, text-gray-900 (as text color)
NEVER USE:  dark: prefixes (app is permanently dark)
```

## Rebuild & Deploy Command
```bash
cd /home/karetech/v0-masjid-connect-gy
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
docker run -d --name kt-masjidconnect-prod --restart always \
  --network pangolin --ip 172.20.0.24 \
  --env-file .env.local \
  ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
docker network connect kt-net-apps kt-masjidconnect-prod
docker network connect kt-net-databases kt-masjidconnect-prod
```

---

## Current State (as of Feb 22, 2026 evening)

### Navigation Structure
```
/ (Home)             — prayer countdown, checklist, verse of the day
/quran               — hub: Mus'haf, Read, Recitation, Memorise
/quran/mushaf        — page-by-page Quran (604 pages, QuranCDN API)
/quran/recitation    — audio recitation (12 reciters, cdn.islamic.network)
/quran/[surah]       — surah read mode (Arabic + English)
/tracker             — daily prayer tracker + checklist
/tracker/fasting     — fasting calendar (Ramadan, Shawwal, Mon/Thu, Ayyam al-Bayd, Voluntary)
/masjids             — directory of 20 masjids across 5 GY regions
/masjids/[id]        — individual masjid detail page
/map                 — masjid map view
/explore             — grid of Islamic tools
/explore/adhkar      — morning/evening adhkar
/explore/duas        — 70+ duas in 20 categories with search & bookmarks
/explore/madrasa     — learning hub
/explore/madrasa/qaida   — Noorani Qaida (12 lessons, 29 letters)
/explore/madrasa/salah   — How to Pray (Wudu + Salah steps, SVG icons)
/explore/tasbih      — digital tasbih counter
/explore/qibla       — Qibla direction compass
/explore/zakat       — Zakat calculator (GYD + Zakat al-Fitr)
/explore/calendar    — Islamic calendar (2026 events)
/explore/names       — 99 Names of Allah
/explore/lectures    — lectures (Anwar al-Awlaki + Abdul Jabbar)
/explore/buddy       — faith partner system
/explore/community   — community hub
/explore/community/dua-board  — prayer requests + Ameen
/explore/community/khatam     — Quran Khatam collective
/explore/community/halal      — Halal business directory
/explore/community/feed       — community posts
/explore/new-to-islam         — hub for new reverts
/explore/new-to-islam/shahada  — Shahada guide
/explore/new-to-islam/beliefs  — 6 Articles of Faith
/explore/new-to-islam/pillars  — 5 Pillars
/explore/new-to-islam/vocabulary — Islamic vocabulary (30+ terms)
/explore/new-to-islam/faq      — FAQ for new Muslims
/explore/new-to-islam/duas     — Duas for new reverts
/explore/sisters               — Sisters hub
/explore/sisters/hijab         — Hijab guide
/explore/sisters/prayer        — Women in prayer
/explore/sisters/ramadan       — Ramadan for sisters
/explore/sisters/duas          — Women's duas
/explore/sisters/rights        — Rights of women in Islam
/explore/sisters/scholars      — Inspiring Muslim women
/explore/resources    — Islamic resource links
/explore/events       — events listing
/iftaar               — iftaar report submission + archive
/leaderboard          — points leaderboard
/timetable            — monthly prayer timetable
/ramadan              — Ramadan companion page
/profile              — user profile
/settings             — app settings (includes Google Sign-In)
/feedback             — feedback form (includes Request Masjid, Report Error)
/changelog            — version history
/about                — about page
/admin                — admin panel (announcements)
/onboarding           — NOT a page; wizard is component in app/page.tsx
```

### API Routes (`app/api/`)
```
GET/POST /api/tracking        — daily prayer/checklist tracking
GET      /api/config          — prayer config (location, method, madhab)
GET      /api/leaderboard     — top users by points
GET/POST /api/announcements   — admin announcements
GET      /api/user/profile    — current user profile
POST     /api/push/subscribe  — push notification subscription
GET      /api/quran/page      — Quran page proxy (QuranCDN API, 24h cache)
GET/POST /api/community/dua-board        — prayer requests
POST     /api/community/dua-board/react  — Ameen reaction
GET/POST /api/community/feed             — community posts
POST     /api/community/feed/like        — like a post
GET/POST /api/community/khatam           — Juz claims
```

### Key Libraries
- `lib/db.ts` — PostgreSQL pool (`{ pool }`)
- `lib/auth-client.ts` — Better Auth client (`signIn`, `signOut`, `useSession`)
- `lib/prayer-times.ts` — adhan.js wrapper, prayer time calculations
- `lib/ramadan-mode.ts` — `getRamadanStatus()` — Hijri date, Ramadan check
- `lib/masjid-data.ts` — MASJIDS array (20 masjids, Georgetown + regions)
- `lib/qaida-data.ts` — Noorani Qaida lessons (12 lessons, TypeScript)
- `lib/storage.ts` — localStorage KEYS enum + getItem/setItem helpers
- `lib/share.ts` — Web Share API + clipboard fallback

### Key Components
- `components/page-hero.tsx` — page headers (icon, title, subtitle, gradient, showBack, stars)
- `components/bottom-nav.tsx` — fixed bottom tab bar (z-[60], fully opaque bg-[#0a0b14])
- `components/select-modal.tsx` — dark glass bottom-sheet picker
- `components/onboarding-wizard.tsx` — 6-step onboarding (skipped if signed in)
- `components/pwa-install-prompt.tsx` — Add to Home Screen prompt

---

## What Still Needs To Be Done

See `ROADMAP.md` for the full list. Top items:

### Critical / High Priority
1. **More lecture series** — Add to `/explore/lectures/page.tsx` the `SCHOLARS` array:
   - Dr. Bilal Philips (archive.org has many series)
   - Mufti Menk (archive.org)
   - Yasmin Mogahed (for Sisters section)
   - Omar Suleiman

2. **Google Sign-In end-to-end test** — The button is in Settings. Verify Better Auth 
   Google OAuth actually works in production. Check `BETTER_AUTH_URL` env var.

3. **New to Islam — Revert progress tracker** — Add to `/explore/new-to-islam/page.tsx`
   a simple checklist: "I've completed: Shahada ✓, Wudu ✓, First Prayer ✓..."
   Store in localStorage `new_muslim_progress`.

4. **Explore grid sections** — Group cards into labelled sections in `app/explore/page.tsx`:
   - "📖 Quran & Learning" (Quran, Madrasa, Hifz, Lectures)
   - "🕌 Prayer & Practice" (Adhkar, Duas, Tasbih, Qibla, Zakat, Calendar)
   - "👥 Community" (Community, Buddy, Masjids)
   - "🌱 New Here?" (New to Islam, Sisters)
   - "🔧 Tools" (Resources, Events, Iftaar)

5. **Push notifications** — Verify the 5-prayer cron scheduler (`lib/prayer-scheduler.ts`)
   is firing in production. Check logs: `docker logs kt-masjidconnect-prod --tail 50`

6. **Halal Directory real data** — `app/explore/community/halal/page.tsx` has placeholder 
   businesses. Replace with real verified halal businesses in Georgetown, Guyana.

7. **Buddy system notifications** — The nudge feature needs push notification wiring.

8. **Settings notifications panel** — Let users toggle which prayers to receive push 
   notifications for.

### Feature Ideas (from owner)
- Masjid events calendar (masjids can post Eid times, Tarawih schedule, speaker names)
- Quran verse wallpaper generator (share an ayah as styled image)
- Daily Islamic reminder notification (hadith or verse each morning)
- Islamic finance basics (avoiding riba, halal investing)
- Pregnancy & parenting Islamic guide (under Sisters)
- GY Muslim events aggregator

---

## Important Patterns to Follow

### Adding a New Explore Page
1. Create `app/explore/YOUR_PAGE/page.tsx`
2. Use `PageHero` with `showBack` prop
3. Add `<BottomNav />` at the bottom
4. Use `pb-nav` class on the root div (NOT pb-24)
5. Add a card to `EXPLORE_ITEMS` in `app/explore/page.tsx`

### Adding API Routes with DB
```typescript
import { pool } from '@/lib/db'

export async function GET() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS your_table (...)`)
    const { rows } = await pool.query('SELECT * FROM your_table ORDER BY created_at DESC')
    return Response.json(rows)
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### Arabic Text
Always use `className="font-arabic"` + `dir="rtl"` for Arabic:
```tsx
<p className="font-arabic text-2xl text-emerald-300 leading-relaxed" dir="rtl">
  بِسْمِ اللَّهِ
</p>
```

### New Page Template
```tsx
'use client'
import { YOUR_ICON } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

export default function YourPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={YOUR_ICON}
        title="Title"
        subtitle="Subtitle"
        gradient="from-emerald-900 to-teal-900"
        showBack
      />
      <div className="px-4 pt-4 space-y-3">
        {/* content */}
      </div>
      <BottomNav />
    </div>
  )
}
```

---

## Environment Variables (in .env.local)
```
DATABASE_URL=postgres://mcgy_user:...@kt-central-db:5432/masjidconnect
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://masjidconnectgy.com/api/auth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:...
```

## Git History (recent)
```
fbffb2c fix: bottom nav fully opaque, z-[60], pb-nav utility across 52 pages
2ecf128 feat: New to Islam hub + Sisters section + Explore cards + ROADMAP.md
ba97850 feat: sprint 2 — API wiring, masjid enhancements, safe-area, Zakat GYD, Islamic calendar
1fc7c6f feat: Learn to Pray — Wudu steps + Salah guide with Arabic, SVG posture icons
b7cc7d6 feat: major sprint — Qaida, tracker expansion, community features, UX improvements
fe5eac4 fix: replace native <select> in submit-form with dark SelectModal
b41127b feat: Duas — 20 categories, 70+ duas, search, bookmarks, copy, source refs
```

---

*Read ROADMAP.md for the complete feature backlog and bug tracker.*
*This file is the entry point for any new Claude Code or coding agent session.*
