# MasjidConnect GY — Master Roadmap & TODO
*Last updated: Sunday, Feb 22, 2026 — compiled from all session conversations*

> This file is the single source of truth for everything planned, in-progress, and done.
> Read this at the start of every session to pick up exactly where we left off.

---

## 🟢 COMPLETED TODAY (Feb 22, 2026)

### v1.7.0 (afternoon)
- [x] Ported from v2: Fasting Tracker, 99 Names, Resources, PWA Install Prompt, Announcements Banner, Buddy How-It-Works
- [x] v2 (Next.js/shadcn/ui) swapped in as production at masjidconnectgy.com

### v1.8.0
- [x] Sprint 1: Lectures page — 2 scholars, 5 series, 87 lectures (Anwar al-Awlaki + Abdul Jabbar)
- [x] Onboarding wizard rebuilt — 6 steps with auth bypass for signed-in users
- [x] Quran hub redesigned — Mus'haf viewer, Recitation (12 reciters), Memorise mode
- [x] Design consistency sweep — all light-mode classes removed
- [x] Tracker bug fixes (307 redirect, Tasbih SVG tap blocking)
- [x] Duas expanded — 20 categories, 70+ duas, bookmarks, search, sources

### v1.9.0
- [x] Submit form: native `<select>` replaced with dark glass SelectModal
- [x] Madrasa: Noorani Qaida restored (12 lessons, 29 letters, makhraj, letter forms, tajweed)
- [x] Learn to Pray: Wudu (8 steps) + Salah (10 steps) with SVG posture icons, Arabic, transliteration
- [x] Tracker: Year-round fasting — Ramadan, Shawwal, Mon/Thu, Ayyam al-Bayd, Voluntary
- [x] Community Hub: Dua Board, Khatam Collective, Halal Directory, Community Feed
- [x] Prayer Settings onboarding: "Asr Prayer Time" (plain English), CIOG = Central Moon Sighting note
- [x] Google Sign-In: accessible from Settings page (not only onboarding)
- [x] Feedback: "Request New Masjid" + "Report Masjid Error" categories with conditional fields
- [x] Map page: back button added
- [x] Explore hero: animated star field

### v1.9.1 (Sprint 2)
- [x] Safe-area fix: `viewport-fit: cover` + `env(safe-area-inset-top)` on PageHero and home hero
- [x] Bottom nav: `env(safe-area-inset-bottom)` — no more content behind iPhone home bar
- [x] Home checklist: wired to POST /api/tracking (backend sync)
- [x] Masjid directory: 20 masjids (Georgetown, East Coast, Berbice, Linden, West Demerara), search, area + facility filters, individual masjid detail pages
- [x] Masjid check-in: live daily counter per masjid, Jumu'ah Friday banner
- [x] Community features: Dua Board, Feed, Khatam wired to PostgreSQL (API routes created, tables auto-created)
- [x] Zakat: GYD formatting, Zakat al-Fitr (per-head), 8 asnaf categories, CIOG payment guidance
- [x] Islamic Calendar: 13 real 2026 events, relative "X days away" labels, Google Calendar links
- [x] Session log written to KareTech Vault

### v2.0.0 (Sprint 3 — in progress)
- [x] New to Islam hub: Shahada, 6 Articles of Faith, 5 Pillars, Vocabulary (30+ terms), FAQ (10 Qs), Duas for reverts
- [x] Sisters section: Hijab guide, Women in Prayer, Ramadan for sisters, Women's Duas, Rights in Islam, Inspiring Sisters
- [x] "New to Islam" and "Sisters" cards added to Explore grid

---

## 🟡 IN PROGRESS RIGHT NOW

- [ ] **Sprint 3 build + deploy** — building Docker image (started ~8:30 PM GYT)
- [ ] **Explore grid reorganisation** — group into sections (Quran & Learning, Prayer & Practice, Community, New Here?, Tools) — agent created code but needs verification

---

## 🔴 NEXT UP — PRIORITY ORDER

### Must Do (Critical UX / Missing Features)
1. [ ] **Prayer Tracker UI on main Tracker page** — agent added it but needs backend verification that 5-prayer daily log syncs to /api/tracking correctly
2. [ ] **Google Sign-In end-to-end test** — verify Better Auth Google OAuth works in production (settings page shows button but needs testing)
3. [ ] **PWA Install Prompt** — make "Add to Home Screen" prompt more prominent (currently buried; when installed as PWA the status bar issue disappears fully)
4. [ ] **Quran Khatam Collective** — verify 30 Juz names are correct, add "Complete" flow, ensure DB sync works
5. [ ] **Halal Business Directory** — needs real Georgetown businesses (currently placeholder data). Need Master Kareem to provide or confirm actual businesses to list

### High Priority (Features mentioned, not yet built)
6. [ ] **Masjid Check-in → Masjid detail page** — tapping a masjid card goes to detail page with full info, map link, check-in button, phone tap-to-call
7. [ ] **Community Dua Board moderation** — flag/report inappropriate content (localStorage now, API when community grows)
8. [ ] **Push notifications for prayer times** — 5 prayers scheduled server-side. Currently VAPID wired but per-prayer scheduling not fully tested
9. [ ] **Ramadan Companion** — the `/ramadan` page needs reviewing in v2 (was in v1, might need feature parity check)
10. [ ] **Leaderboard** — /leaderboard page exists but points need to actually save to DB and sync across devices (currently partially wired)

### Medium Priority (Polish & Enhancements)
11. [ ] **Explore grid sections** — visual grouping with section headers (Quran & Learning / Prayer & Practice / Community / New Here? / Tools)
12. [ ] **Madrasa** — "Learn to Pray" card now links correctly; the other 5 modules (Five Pillars, Articles of Faith, etc.) are "Coming Soon" — wire to New to Islam pages
13. [ ] **Lectures** — add more scholars/series:
    - Dr. Bilal Philips lectures
    - Mufti Menk series  
    - Yasmin Mogahed (for Sisters section)
    - Omar Suleiman
14. [ ] **Quran Read mode** — `/quran/[surah]` page: verse-by-verse Arabic + English, bookmark, share verse
15. [ ] **Quran Memorise (Hifz) mode** — currently placeholder; needs repetition/hide-reveal mechanic
16. [ ] **Settings page** — currently minimal; expand with:
    - Notification preferences (which prayers to get push notifications for)
    - Moon sighting preference (changeable, not just in onboarding)
    - Language preference
    - Clear data / reset option
17. [ ] **Profile page** — show user's stats: streak, points, prayers tracked, fasts completed, Quran progress

### Community / Social Features
18. [ ] **Masjid events** — allow masjids to post events (Eid salah time, Tarawih schedule, Halaqah) — needs admin or masjid rep account
19. [ ] **Buddy system** — currently: add friends by phone/username, see their streak. Still needed: send nudge notification, challenge a buddy to a goal
20. [ ] **Community Feed moderation** — report button, admin view

### New to Islam (follow-on)
21. [ ] **New to Islam — "Find a Revert Support Group"** — add contact info for CIOG revert programme
22. [ ] **New to Islam — Progress tracker** — "I've completed: Shahada ✓, Wudu ✓, First Salah ✓..." — a simple checklist for the revert journey

### Sisters Section (follow-on)
23. [ ] **Sisters — Inspirational Daily Quote** — a daily quote from a female companion or scholar on the Sisters hub
24. [ ] **Sisters community tab** — separate filtered view of Dua Board and Community Feed for sisters only

### Backend / Technical Debt
25. [ ] **Wire all community localStorage to DB** — Halal submissions, Khatam individual user claims, Buddy connections all partially localStorage
26. [ ] **Rate limiting on community APIs** — prevent spam on Dua Board and Community Feed posts
27. [ ] **Iftaar submission moderation** — flagging system for inappropriate iftaar reports
28. [ ] **DB backups verified** — confirm Restic is backing up PostgreSQL (kt-central-db) regularly
29. [ ] **Push notification scheduler** — verify 5-prayer cron is firing correctly in production container

---

## 📋 FEATURE IDEAS (mentioned but not yet specced)

From Master Kareem's voice notes and messages today:

| Idea | Source | Notes |
|------|--------|-------|
| **Masjid events calendar** | Queued msg | Masjids can post Eid times, Tarawih, Jumu'ah speaker |
| **Halal food delivery / ordering** | Voice note | Link to businesses in Halal Directory who deliver |
| **Islamic finance basics** | Implied | Halal investing, avoiding riba (interest) — could be under Madrasa or Resources |
| **Pregnancy / parenting Islamic guide** | Sisters section | Dua for baby, aqiqah, naming, circumcision |
| **Daily Islamic reminder widget** | Voice note | Morning/evening reminder push notification with hadith/verse |
| **Quran verse wallpaper generator** | Implied | Share an ayah as a styled image |
| **GY Muslim events aggregator** | Implied | Pull in events from CIOG website |
| **Multi-language support** | Future | English is fine for now; Urdu/Arabic labels already included |
| **Offline mode** | PWA | Service worker caches key pages already; full offline Quran reading would be ideal |

---

## 🔧 KNOWN BUGS / ISSUES

| Bug | Status | Notes |
|-----|--------|-------|
| Browser status bar overlap | ✅ FIXED (Sprint 2) | viewport-fit: cover added |
| Tracker 307 redirect loop | ✅ FIXED | next.config.mjs self-redirect removed |
| Tasbih SVG blocking tap | ✅ FIXED | pointer-events-none added |
| Submit form native select system styling | ✅ FIXED | Replaced with dark SelectModal |
| Audio silent on iOS first open | ✅ FIXED | AudioContext unlocked with silent buffer |
| Google Sign-In not accessible post-onboarding | ✅ FIXED | Added to Settings page |
| White cards in iftaar archive (light mode remnants) | ✅ FIXED | Design sweep complete |
| Community features localStorage-only | ✅ FIXED (Sprint 2) | Wired to PostgreSQL API |
| Prayer Tracker not syncing to backend | ✅ FIXED (Sprint 1) | POST /api/tracking wired |
| Home checklist not syncing | ✅ FIXED (Sprint 2) | POST /api/tracking wired |
| Lectures page missing in v2 | ✅ FIXED | Built in Sprint 1 |
| Quran Recitation audio CDN blocked | ✅ FIXED | Using cdn.islamic.network |
| Mus'haf image CDN 404/blocked | ✅ FIXED | Using text API (QuranCDN) with Amiri font |
| Pangolin target empty `method` field | ✅ DOCUMENTED | Method must be 'http' — documented in MEMORY.md |
| Node v22 DNS / undici issue | ✅ DOCUMENTED | Use node:https with manual DNS resolver |

---

## 🏗️ TECHNICAL REFERENCE

### App Architecture
- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** shadcn/ui + Tailwind CSS — permanently dark (`bg-[#0a0b14]`)
- **Auth:** Better Auth with Google Sign-In
- **DB:** PostgreSQL (`kt-central-db`) — `lib/db.ts` (pg pool)
- **Push:** Web Push (VAPID) via `lib/webpush.ts`
- **Container:** `kt-masjidconnect-prod` at `172.20.0.24:3000`
- **Networks:** `pangolin` + `kt-net-apps` + `kt-net-databases`
- **Domain:** `masjidconnectgy.com` → Pangolin resource 38

### Rebuild Command
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

### Key File Paths
- **Repo:** `/home/karetech/v0-masjid-connect-gy/`
- **Env:** `.env.local`
- **DB lib:** `lib/db.ts`
- **Auth client:** `lib/auth-client.ts`
- **Prayer times:** `lib/prayer-times.ts`
- **Masjid data:** `lib/masjid-data.ts`
- **Qaida data:** `lib/qaida-data.ts`
- **Storage keys:** `lib/storage.ts`
- **Bottom nav:** `components/bottom-nav.tsx`
- **Page hero:** `components/page-hero.tsx`

### Design Rules (NEVER BREAK THESE)
- Base: `bg-[#0a0b14]`
- Cards: `bg-gray-900 border border-gray-800`
- Primary text: `text-[#f9fafb]` or `text-white`
- Secondary text: `text-gray-400`
- Muted text: `text-gray-500`
- Accent: `emerald-400/500/600`
- Arabic font: `className="font-arabic"` (Amiri + Amiri Quran loaded)
- **NEVER:** `bg-white`, `bg-gray-50`, `bg-gray-100`, `text-gray-800`, `text-gray-900`, `dark:` prefixes

---

*This file should be read at the start of every dev session.*
*Update the checkboxes as tasks complete.*

---

## 📝 ITEMS FOUND IN REVIEW (added after full message audit, Feb 22 ~8:45 PM)

*These were mentioned in voice notes / captions but not captured in original ROADMAP.*

### From msg 7480 — "Incorporate into the body system"
Master Kareem asked for the Tracker to go beyond fasting/prayer into broader ibadah & wellness:
- [ ] **Quran daily log** — pages read today, cumulative progress toward Khatam
- [ ] **Sadaqah/charity log** — amount given (GYD), type (Sadaqah, Zakat, Sadaqah Jariyah)
- [ ] **Good deeds counter** — custom daily deeds to tick off (e.g., visited sick person, fed someone)
- [ ] **Sleep tracker** — hours of sleep (especially important during Ramadan; Suhoor alarm integration)
- [ ] **Water intake** — glasses drunk during non-fasting hours
- [ ] **Adhkar completion** — did I complete morning adhkar today? Evening adhkar?
- [ ] **Istighfar counter** — how many times said Astaghfirullah today
All to live under Tracker tab as additional cards/sections.

### From msg 7474 — "Remember we had that so we can determine when that person fast started"
The moon sighting preference (CIOG/Saudi) should feed into the Fasting Tracker:
- [ ] **Ramadan start auto-detect** — when user selects CIOG sighting in onboarding, 
  automatically set Ramadan 1 based on CIOG announcement date (Feb 28 or Mar 1, 2026).
  When Saudi selected, use Saudi announcement date.
  Store as `ramadan_start` in localStorage (already partially wired from v1).
- [ ] **Fasting streak calculation** — start counting from the correct Ramadan Day 1 per sighting

### From msg 7482 — "Relative to each palette" (background animations)
The star field is on Explore/Quran heroes only. Request was for THEMED animations per section:
- [ ] **Ramadan page** — animated crescent moon + stars floating gently
- [ ] **Quran pages** — subtle arabesque/geometric pattern animation
- [ ] **Duas page** — soft calligraphy stroke animation or flowing lines  
- [ ] **Tasbih page** — gentle pulsing ring/geometric tessellation
- [ ] **New to Islam** — sunrise/dawn gradient animation (hope/new beginning)
- [ ] **Sisters section** — soft floral or flowing geometric pattern
- [ ] **Masjid directory** — subtle dome/arch silhouette pattern
- [ ] **Tracker** — growing plant/progress animation theme
Implementation: CSS-only keyframe animations on `::before` pseudo-elements or absolutely 
positioned SVG patterns with opacity animation. Keep subtle — not distracting.

### From msg 7469 — "We had way more madrasa stuff"
Beyond Qaida, v1 had or was planned to have:
- [ ] **How to make Wudu** ✅ done (inside Learn to Pray page)
- [ ] **Stories of the Prophets** (fully written content, not just a card)
- [ ] **Seerah (Life of the Prophet)** ﷺ — summary by era: Birth, Makkah, Hijra, Madinah
- [ ] **Islamic etiquette (Adab)** — manners when eating, entering home, greeting, sneezing
- [ ] **Halal & Haram basics** — what's permissible/forbidden (food, finance, speech, relations)
- [ ] **Death & Afterlife** — Barzakh, Day of Judgement, Jannah, Jahannam (in plain terms)
- [ ] **Children's section** — simplified content for kids (basic Arabic letters fun mode, colouring-style SVG icons)

### From msg 7481 — "Jumu'ah stuff"
The check-in has a Friday banner. "Jumu'ah stuff" may also mean:
- [ ] **Jumu'ah prep checklist** — Thursday evening reminder, ghusl, Surah Al-Kahf, early arrival
- [ ] **Jumu'ah khutbah log** — what topic was discussed (personal note)
- [ ] **Surah Al-Kahf reminder** — push notification Thursday evening/Friday morning

### From msg 7483 — "Log what we've done today + update the docs"  
- [x] Session log written to KareTech Vault ✅
- [x] CLAUDE_CODE_CONTEXT.md created ✅
- [x] ROADMAP.md created ✅
- [ ] **README.md** for the GitHub repo still needs updating (probably shows old v0.dev placeholder)

### Additional from screenshots / captions
- From iftaar screenshot (original issue): iftaar page masjid cards white/light — ✅ FIXED
- Submit form native select — ✅ FIXED (dark glass SelectModal)
- Explore bottom cards cropped (Community, New to Islam partially cut off) — ✅ FIXED (pb-nav)
- Browser URL bar visible in onboarding (PWA not installed) — inherent browser behaviour, 
  mitigated by prominent "Install App" PWA prompt showing ABOVE the nav

