# MasjidConnect GY — Codebase Audit Reference

**Version**: v2.20.0  
**Date**: February 23, 2026  
**Repo**: `kareemschultz/v0-masjid-connect-gy`  
**Local path**: `/home/karetech/v0-masjid-connect-gy/`  
**Live**: `https://masjidconnectgy.com`

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (partial) |
| Auth | Better Auth |
| Database | PostgreSQL (via `pg` pool) |
| Container | Docker — `kt-masjidconnect-prod` |
| Networks | `pangolin` (172.20.0.24) + `kt-net-apps` + `kt-net-databases` |
| DB Host | `kt-central-db:5432` (Docker internal DNS) |
| Node | v22.22.0 |
| Push | Web Push (VAPID) |

---

## 2. Critical Constraints (DO NOT VIOLATE)

### Dark Mode
- App is **permanently dark** — `bg-[#0a0b14]` base, `bg-gray-900` cards, `border-gray-800`
- **NEVER use `dark:` prefixes** — there is no light mode
- All new components must follow this palette

### Layout
- All sub-pages: `<PageHero showBack ... />` at top
- `<BottomNav />` at the very bottom of every page
- **`pb-nav` class** (not `pb-24`) for bottom padding — this is a CSS custom property that accounts for safe area

### Arabic Text
- **Always** use `className="font-arabic"` on Arabic text — loads Amiri font
- For IndoPak script: `className="font-indopak"` — Noto Nastaliq Urdu
- Arabic text direction: always `dir="rtl"`

### Node v22 + Docker: CRITICAL
- Node v22 native `fetch` (undici) **fails** for external HTTPS calls from inside Docker containers
- **Fix pattern**: Use `node:https` module with manual DNS resolution via `dns.Resolver`
- Both `/api/quran/surah/[number]/route.ts` and `/api/quran/page/route.ts` implement this fix
- **Any new API proxy routes** that call external services must use the same pattern
- DO NOT use `fetch()` in server-side route handlers

### Islamic Content Accuracy
- Witr: Wajib per Hanafi, Sunnah per Shafi'i/Hanbali/Maliki — never call it "optional"
- Fiqh content: Hanafi primary, other madhabs noted inline
- Asr time setting: calls it "Asr Prayer Time", not "Madhab" (the setting only affects Asr shadow ratio)
- Prayer calculation default: MWL (Muslim World League) — not Egyptian
- Moon sighting: GIT/CIOG/Central Moon Sighting = local/regional; Saudi = international

---

## 3. Project Structure

```
app/
├── page.tsx                      # Home page — prayer times, Eid countdown, quick actions
├── settings/page.tsx             # All user settings (prayer calc, madhab, offset, notifications)
├── tracker/page.tsx              # Ibadah tracker — prayers, fasting, Quran, Qada, Adhkar
├── quran/
│   ├── page.tsx                  # Quran hub — surah list, continue reading, Mushaf link
│   ├── [surah]/page.tsx          # Surah reader — audio, translation, tafsir, bookmarks, tajweed, script
│   ├── mushaf/page.tsx           # 604-page Madinah Mushaf (word-by-word from QuranCDN)
│   ├── hifz/page.tsx             # Hifz (memorization) mode
│   └── recitation/page.tsx       # Full recitation mode
├── masjids/
│   ├── page.tsx                  # Masjid directory (31 Georgetown/Guyana masjids)
│   └── [id]/page.tsx             # Individual masjid detail
├── explore/
│   ├── page.tsx                  # Explore hub — all sections, search/filter
│   ├── duas/page.tsx             # Duas collection (21 categories, 80+ duas)
│   ├── adhkar/page.tsx           # Morning/evening adhkar with counters
│   ├── fiqh/page.tsx             # Fiqh Hub (14 chapters, 105+ topics, Hanafi focus)
│   ├── lectures/page.tsx         # Lectures — 6 scholars, 235+ archive.org lectures
│   ├── madrasa/
│   │   ├── page.tsx              # Madrasa hub
│   │   ├── adab/page.tsx         # Islamic Adab (etiquette)
│   │   ├── arabic-typing/page.tsx
│   │   ├── fiqh/page.tsx         # Redirect → /explore/fiqh
│   │   ├── library/page.tsx      # GII Islamic Library (Scribd embeds, 4 books)
│   │   ├── prayers/page.tsx      # Learn to Pray
│   │   ├── prophets/page.tsx     # Stories of Prophets
│   │   ├── qaida/page.tsx        # Noorani Qaida
│   │   ├── salah/page.tsx        # Salah guide
│   │   └── seerah/page.tsx       # Seerah of the Prophet ﷺ
│   ├── calendar/page.tsx         # Islamic calendar — events, submission form
│   ├── community/
│   │   ├── page.tsx              # Community Hub — 6 org listings
│   │   ├── dua-board/page.tsx    # Community Dua requests
│   │   ├── feed/page.tsx         # Community feed/posts
│   │   ├── halal/page.tsx        # Halal community
│   │   └── khatam/page.tsx       # Khatam (Quran completion) tracker
│   ├── halal-directory/page.tsx  # Halal business directory (Georgetown)
│   ├── halal-guide/page.tsx      # What is halal? Guide
│   ├── hadith/page.tsx           # 40 Nawawi Hadith browser (search + category filter)
│   ├── janazah/page.tsx          # Janazah (funeral) guide — full step-by-step
│   ├── jumuah/page.tsx           # Jumu'ah guide and checklist
│   ├── kids/page.tsx             # Kids section — 5 Pillars, Prophets, duas, activities
│   ├── names/page.tsx            # 99 Names of Allah (Asma'ul Husna) with detail
│   ├── names-search/page.tsx     # Islamic names search (80+ names)
│   ├── new-to-islam/             # New to Islam — 6 sub-pages
│   │   ├── page.tsx
│   │   ├── beliefs/page.tsx
│   │   ├── duas/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── pillars/page.tsx
│   │   ├── shahada/page.tsx
│   │   └── vocabulary/page.tsx
│   ├── qibla/page.tsx            # Qibla compass (DeviceOrientation API, iOS permission)
│   ├── ramadan/
│   │   ├── page.tsx              # Ramadan hub
│   │   ├── factors/page.tsx      # Factors that affect fast
│   │   └── fidya/page.tsx        # Fidya calculator
│   ├── resources/page.tsx        # Islamic resources and links
│   ├── scholars/page.tsx         # Local scholars directory (Guyana)
│   ├── sisters/                  # Sisters section — 6 sub-pages
│   │   ├── page.tsx
│   │   ├── duas/page.tsx
│   │   ├── hijab/page.tsx
│   │   ├── prayer/page.tsx
│   │   ├── ramadan/page.tsx
│   │   ├── rights/page.tsx
│   │   └── scholars/page.tsx
│   ├── tasbih/page.tsx           # Tasbih counter with haptic feedback
│   ├── zakat/page.tsx            # Zakat calculator v2 (GYD-first, 2026 Nisab values)
│   └── events/page.tsx           # Events listing
├── ramadan/page.tsx              # Ramadan companion page
├── timetable/page.tsx            # Annual prayer timetable
├── profile/page.tsx              # User profile
├── leaderboard/page.tsx          # Points leaderboard
├── feedback/page.tsx             # Feedback form
├── admin/page.tsx                # Admin panel (4 tabs: announcements, content, events, users)
├── about/page.tsx                # About page
├── changelog/page.tsx            # Changelog viewer
└── api/                          # API routes (see Section 6)
```

---

## 4. Key Components

| Component | File | Notes |
|---|---|---|
| `PageHero` | `components/page-hero.tsx` | All sub-pages use this. `showBack` prop for back button. `gradient` prop for custom colors. |
| `BottomNav` | `components/bottom-nav.tsx` | 5 tabs: Home, Quran, Tracker, Masjids, Explore |
| `SelectModal` | `components/select-modal.tsx` | Supports `subtitle` and option `note` fields. Used for prayer calculation, Asr setting, etc. |
| `OnboardingWizard` | `components/onboarding-wizard.tsx` | 5 steps: welcome, location, moon sighting, calculation method, Asr. |
| `PrayerTimesCard` | Used inline in `app/page.tsx` | |

---

## 5. Key Data Files

| File | Contents | Size |
|---|---|---|
| `lib/fiqh-data.ts` | 105+ Fiqh topics, 14 chapters, Hanafi focus | ~3000 lines |
| `lib/quran-data.ts` | 114 surahs metadata (name, ayah count, revelation) | |
| `lib/quran-settings.ts` | `QURAN_TRANSLATIONS` (4 options), export types | |
| `lib/masjid-data.ts` | 31 Georgetown/Guyana masjids with coords, times, contact | |
| `lib/prayer-times.ts` | `CALCULATION_METHODS` (8 methods), `MADHABS`, prayer calc logic using `adhan` library | |
| `lib/storage.ts` | `KEYS` enum for all localStorage keys | |
| `lib/hadith-nawawi.ts` | 40 Nawawi hadith with Arabic, translation, category | |
| `lib/ramadan-timetable.ts` | Full Ramadan 1447 suhoor/iftaar timetable for Georgetown | |
| `lib/share.ts` | `shareOrCopy()` utility — native Web Share API with clipboard fallback | |
| `lib/points-client.ts` | Points calculation — safe for client components (no db imports) | |

---

## 6. API Routes

All server routes in `app/api/`:

| Route | Method | Description |
|---|---|---|
| `/api/quran/surah/[number]` | GET | Proxy to `api.alquran.cloud` — uses `node:https` + DNS workaround |
| `/api/quran/page` | GET | Proxy to `api.qurancdn.com` — uses `node:https` + DNS workaround |
| `/api/tracking/[date]` | GET/POST | Daily prayer tracking (DB) |
| `/api/user/profile` | GET/PATCH | User profile |
| `/api/user/preferences` | GET/PATCH | User preferences |
| `/api/community/feed` | GET/POST | Community posts |
| `/api/community/dua-board` | GET/POST | Community dua requests |
| `/api/community/khatam` | GET/POST | Khatam progress (DB sync) |
| `/api/announcements` | GET/POST | Admin announcements |
| `/api/events` | GET | Events listing |
| `/api/events/submit` | POST | Submit community event |
| `/api/leaderboard` | GET | Points leaderboard |
| `/api/friends` | GET/POST | Buddy/friendship system |
| `/api/push/*` | Various | Push notification subscription management |
| `/api/auth/[...all]` | All | Better Auth handler |
| `/api/health` | GET | Health check endpoint |
| `/api/submissions` | GET/POST | Community submissions |
| `/api/feedback` | GET/POST | User feedback |

---

## 7. Database Schema

PostgreSQL at `kt-central-db:5432` / database `masjidconnect`.

### Core Tables
- `user` — Better Auth users (id, name, email, role, username, displayUsername)
- `session` — Better Auth sessions
- `account` — Better Auth accounts (OAuth)
- `verification` — Email/phone verification tokens

### App Tables
- `prayer_tracking` — Daily prayer logs per user (5 prayers + bonus tracking)
- `announcements` — Admin announcements (type: urgent/info/event, active boolean)
- `community_posts` — Community feed posts
- `community_dua_requests` — Dua board requests
- `khatam_claims` — Khatam (Quran completion) progress per user
- `friendships` — Buddy connections (user_id, friend_id, status)
- `iftaar_submissions` — Community iftaar submissions
- `push_subscriptions` — VAPID push subscription objects
- `feedback` — User feedback submissions
- `event_submissions` — Community event submissions

---

## 8. LocalStorage Keys (KEYS enum in lib/storage.ts)

```typescript
ONBOARDING_DONE     // boolean
LOCATION            // { lat, lng, city }
PRAYER_LOG          // daily prayer log
QURAN_FONT          // legacy
RECITER             // reciter ID (ar.alafasy default)
MADHAB              // 'Shafi' | 'Hanafi' (affects Asr shadow ratio only)
BOOKMARKS           // ayah bookmarks []
LAST_READ           // { surah, name }
QURAN_FONT_SIZE     // 20|24|28|32|36
SUNNAH_LOG          // sunnah prayer log
NAWAFIL_LOG         // nawafil prayer log
HOME_MASJID         // selected masjid ID
QURAN_TRANSLATION   // 'en.sahih' | 'en.yusufali' | 'en.pickthall' | 'en.asad'
QURAN_SCRIPT        // 'uthmani' | 'indopak'
QURAN_TAJWEED       // boolean — tajweed color mode
PRAYER_OFFSET       // number (minutes, -10 to +10)
CALCULATION_METHOD  // 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Gulf' | 'Kuwait'
NOTIF_PRAYERS       // prayer notification prefs
moon_sighting        // 'local' | 'saudi'
ramadan_start        // { date: 'YYYY-MM-DD' }
khatam_personal_progress // Quran completion progress
qada_log            // { prayer, count }[] — missed prayers tracker
```

---

## 9. Auth & Roles

- **Better Auth** with email/password + Google OAuth
- User roles: `'user'` (default) | `'admin'`
- Admin access: `/admin` route, protected by role check
- Username plugin: `username` + `displayUsername` columns (both required)

---

## 10. External APIs Used

| API | Used For | Notes |
|---|---|---|
| `api.alquran.cloud` | Surah text (Uthmani + translations), tajweed edition | Client-side direct fetch (browser); proxy uses `node:https` workaround |
| `api.qurancdn.com` | Mushaf page-by-page word data (`text_uthmani`, `char_type_name`) | Proxy uses `node:https` workaround |
| `cdn.islamic.network` | Recitation audio MP3 files | Direct URL in `<Audio>` src |
| `archive.org` | Lecture MP3 files (6 scholars) | Direct URL streams |
| `qurancdn.com` (CDN) | Mushaf page images (fallback) | |
| Google Fonts | Amiri, Amiri Quran, Noto Nastaliq Urdu | Preconnect in layout.tsx |

---

## 11. Push Notifications

- VAPID keys stored in `.env.local`
- Subscription stored in `push_subscriptions` DB table
- Notification types: 5 daily prayers (Fajr/Dhuhr/Asr/Maghrib/Isha) + Suhoor + Iftaar + Ishraq + Duha + Awabeen + Tahajjud + Mon/Thu fasting
- Scheduled server-side via cron or Next.js background

---

## 12. Lecture Sources (archive.org)

All lecture file lists were verified via `https://archive.org/metadata/{identifier}/files` before coding.

| Scholar | Identifier | Count |
|---|---|---|
| Anwar al-Awlaki (Makkah period) | `lifeofmuhammadmakkah` | 16 |
| Anwar al-Awlaki (Madinah period) | `TheLifeOfTheProphetMuhammadMedinahPeriod-Part1ByImamAnwarAl-Awlaki` | 18 |
| Anwar al-Awlaki (Lives of Prophets) | `TheLivesOfTheProphetsByAnwarAl-Awlaki` | 21 |
| Anwar al-Awlaki (Hereafter) | `hereafter-anwar-al-awlaki_202505` | 22 |
| Hamza Yusuf (Purification of Heart) | `Sheikh_Hamza_Yusuf_Hanson_-_Purification_Of_The_Heart_CD_Audio_MP3` | 41 |
| Hamza Yusuf (Vision of Islam) | `TheVisionOfIslamByHamzaYusuf` | 24 |
| Bilal Philips | `Dr.BilalPhilipsCollection` | 542 |
| Yasmin Mogahed | `AJourneyToAllah` | 130+ |
| Dr. Omar Suleiman (The Firsts) | `the-firsts-dr.-omar-suleiman` | 60 |

---

## 13. Known Issues & Technical Debt

### Pre-existing TypeScript Errors (non-breaking)
- `app/page.tsx:163`, `app/ramadan/page.tsx:60`, `app/timetable/page.tsx:51` — `TS2367`: Comparison of `'Shafi'` and `'Hanafi'` always false. The madhab value from localStorage is untyped string, being compared to typed union. Fix: type the `getItem` call with the union type or cast.

### Fiqh Hadith Arabic (⚠️ AUDIT PRIORITY)
- 57 hadith entries in `lib/fiqh-data.ts` have Arabic text that was AI-generated
- **Risk**: tashkeel errors, minor wording differences from canonical sources
- **Fix needed**: Cross-reference each against Sunnah.com before promoting these to higher visibility
- All hadith have `reference` fields (Bukhari, Muslim, Abu Dawud, etc.) — use these to look up canonical text

### Tajweed Parser Edge Cases
- `parseTajweedText()` in `app/quran/[surah]/page.tsx` uses regex to parse bracket notation from alquran.cloud
- Some edge cases with nested brackets may not parse correctly
- Test across multiple surahs before considering production-complete

### IndoPak Script Line Height
- `font-indopak` class has `line-height: 3.2 !important` which may affect layout in tight containers
- Monitor on Noorani Qaida page and other Arabic-heavy pages

### Prayer Offset Not Applied to Mushaf Page
- Prayer offset from settings is stored in localStorage as `KEYS.PRAYER_OFFSET`
- Applied in home page and settings display but verify it's applied in ALL prayer time displays (timetable, masjid detail pages, etc.)

### Better Auth Username Plugin
- Both `username` AND `displayUsername` columns required in `user` table
- If schema migrations are run, ensure both columns exist

### CSP Headers
- Check `next.config.mjs` Content-Security-Policy for completeness:
  - `media-src` must include archive.org, cdn.islamic.network, qurancdn.com
  - `frame-src` must include scribd.com (for GII Library embeds)
  - Any new external services need CSP updates

---

## 14. Islamic Calendar Data

### Ramadan 1447 (2026)
- **Saudi / International**: February 18, 2026
- **CIOG / GIT / Central Moon Sighting Committee (Local Guyana)**: February 19, 2026
- **Eid al-Fitr**: March 20, 2026
- **Laylatul Qadr** (odd nights last 10): Mar 10, 12, 14, 16, 18

---

## 15. GII Scribd Library (Embed Keys)

| Book | Scribd ID | Key | Status |
|---|---|---|---|
| Aqeedah Tahawiyyah | 228105475 | `key-55vSmeJbyVmwMye3atWH` | ✅ Live |
| Adab — Islamic Mannerism | 213312968 | `key-1r4d1wkisdu4hhm72zjt` | ✅ Live |
| Practical Essentials | 228087653 | `key-63DSgbtSjzLdB6gYQUlJ` | ✅ Live |
| Tafsir Ibn Kathir Juz' Amma | 206921362 | `key-29k82oaahqsumjdanolp` | ✅ Live |
| Fiqh-us-Seerah | 205398282 | (awaiting) | ⏳ Blocked |
| Islamic Jurisprudence Vol. 1 | 197764480 | (awaiting) | ⏳ Blocked |
| Islamic Jurisprudence Vol. 2 | 227182496 | (awaiting) | ⏳ Blocked |

---

## 16. Deployment

### Rebuild Command
```bash
cd /home/karetech/v0-masjid-connect-gy
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . -q
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
docker run -d --name kt-masjidconnect-prod --restart always \
  --network pangolin --ip 172.20.0.24 \
  --env-file .env.local \
  ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
docker network connect kt-net-apps kt-masjidconnect-prod
docker network connect kt-net-databases kt-masjidconnect-prod
```

### Database Connection
```
postgres://mcgy_user:E0wOhDr4rxGobJVcViPGFzSsUJShMtw1@kt-central-db:5432/masjidconnect
```
(Internal Docker DNS; `kt-central-db` resolves within `kt-net-databases` network)

---

## 17. Audit Checklist for Codex

When auditing this codebase, check for:

### Bugs / Correctness
- [ ] All prayer time displays respect `KEYS.PRAYER_OFFSET` value
- [ ] `ramadan_start` localStorage key always written as `{ date: 'YYYY-MM-DD' }` object (not raw string)
- [ ] No `fetch()` calls in server-side API route handlers (must use `node:https` pattern)
- [ ] Every page has `<PageHero>` + `<BottomNav>` + `pb-nav` padding
- [ ] Mushaf page prefetch doesn't hit rate limits on page load
- [ ] Khatam DB sync handles unauthenticated users gracefully (localStorage fallback)
- [ ] Better Auth username plugin — `displayUsername` column used correctly in all user profile queries
- [ ] Qada tracker: `qada_log` localStorage serialization is correct JSON
- [ ] Eid countdown: hides correctly when `diff <= 0` (after March 20, 2026)

### Performance
- [ ] `lib/fiqh-data.ts` at ~3000 lines — check if it causes bundle size issues; consider code-splitting
- [ ] Mushaf page: page prefetch strategy — verify it doesn't prefetch all 604 pages on load
- [ ] Lecture page: archive.org files are streamed (not downloaded) — verify no large payloads

### Security
- [ ] Admin routes properly check user role from DB (not just localStorage)
- [ ] Community feed post route validates content length and sanitizes HTML
- [ ] Push subscription route validates auth before storing endpoint
- [ ] Event submission rate limiting in place
- [ ] No API keys exposed in client-side code

### Code Consistency
- [ ] All Arabic text uses `font-arabic` or `font-indopak` class, never `font-family` inline styles
- [ ] All Arabic text has `dir="rtl"` attribute
- [ ] Bottom sheet modals use `80dvh` max-height + `flex flex-col` pattern (not fixed px heights)
- [ ] All `useEffect` cleanup functions in place (especially for audio, event listeners)
- [ ] No `dark:` Tailwind prefixes anywhere (app is permanently dark)
- [ ] Shared utility functions use `lib/share.ts` not custom implementations

### Accessibility
- [ ] All icon-only buttons have `aria-label`
- [ ] Audio player has keyboard controls
- [ ] Focus management in modal bottom sheets

### Data Integrity
- [ ] Fiqh hadith Arabic text — 57 entries flagged for Sunnah.com verification
- [ ] Lecture file lists match actual archive.org content (may drift over time)
- [ ] Masjid prayer times in `lib/masjid-data.ts` are accurate

---

## 18. Feature Status Matrix

| Feature | Status | Notes |
|---|---|---|
| Prayer times (home) | ✅ | MWL default, location-aware, offset support |
| Quran surah reader | ✅ | Audio, translation, tafsir, bookmarks, share, tajweed, script |
| Mushaf (page-by-page) | ✅ | 604 pages, QuranCDN word data |
| Quran Hifz mode | ✅ | Memorization helper |
| Fasting Tracker | ✅ | Full DB + localStorage |
| Prayer Tracker | ✅ | DB sync |
| Qada Tracker | ✅ | localStorage only |
| Adhkar Counter | ✅ | Daily reset |
| Tasbih | ✅ | Haptic feedback, custom dhikr |
| Zakat Calculator | ✅ | GYD v2, 2026 nisab |
| Fiqh Hub | ✅ | 14 chapters, 105+ topics, Hanafi focus |
| Duas | ✅ | 21 categories, 80+ duas, bookmarks, share |
| 99 Names | ✅ | Detail panels |
| Islamic Names Search | ✅ | 80+ names, filters |
| Lectures | ✅ | 6 scholars, 235+ lectures |
| 40 Nawawi Hadith | ✅ | Search + category filter |
| Janazah Guide | ✅ | Full step-by-step |
| Kids Section | ✅ | Pillars, Prophets, duas, activities |
| New to Islam | ✅ | 6 sub-pages |
| Sisters Section | ✅ | 6 sub-pages + Fiqh filter |
| Masjid Directory | ✅ | 31 masjids, map, prayer times |
| Halal Guide | ✅ | |
| Halal Directory | ✅ | Georgetown businesses |
| GII Library | ✅ | 4 books live, 3 awaiting embed keys |
| Madrasa | ✅ | Qaida, Seerah, Adab, Learn to Pray, Arabic Typing |
| Community Hub | ✅ | 6 organisations listed |
| Community Feed | ✅ | DB backed |
| Dua Board | ✅ | DB backed |
| Khatam Tracker | ✅ | DB sync |
| Buddy System | ✅ | Email/username/phone search, 5 levels |
| Leaderboard | ✅ | DB backed |
| Islamic Calendar | ✅ | Events, Ramadan dates, submission form |
| Eid Countdown | ✅ | Home page, hides after Mar 20 2026 |
| Qibla Compass | ✅ | iOS permission button |
| Prayer Time Offset | ✅ | ±1-10 minutes in Settings |
| Push Notifications | ✅ | 13 notification types |
| Nawafil Reminders | ✅ | Ishraq, Duha, Awabeen, Tahajjud, Mon/Thu fast |
| Admin Panel | ✅ | 4-tab: announcements, content, events, users |
| Translation Switcher | ✅ | 4 translations (Sahih/Yusuf Ali/Pickthall/Asad) |
| Tafsir (Ibn Kathir) | ✅ | Per-verse expandable |
| Script Toggle | ✅ | Uthmani/IndoPak |
| Tajweed Colors | ✅ | 6 rule types color-coded |
| Resources Page | ✅ | Islamic links and tools |
| Local Scholars | ✅ | Guyana scholars directory |
| Ramadan Timetable | ✅ | Full Suhoor/Iftaar for Ramadan 1447 |
| Annual Timetable | ✅ | Year-round prayer times |
| Moon Sighting Setting | ✅ | Local/Saudi toggle |
| Onboarding | ✅ | 5-step wizard |
| Google Sign-In | ✅ | Better Auth, trust proxy configured |
| Dark Mode (permanent) | ✅ | No light mode |
| PWA | ✅ | Installable, offline capable |
| Hajj/Umrah guide | ⏳ | Fiqh Hub has text, dedicated page pending |
| Eid Prayer guide | ⏳ | Not yet built |
| Arabic course | ⏳ | Arabic Typing page exists but limited |
| Islamic history timeline | ⏳ | Not built |
