# Changelog

## v2.14.0 — Sprint 9: Dua Qunoot · Adab · Omar Suleiman · Nawafil Notifications · Calendar Submission (Feb 23, 2026)

### Duas
- **NEW**: Dua Qunoot added to Prayer (Salah) category — full Arabic, transliteration, source (Abu Dawud / Tirmidhi), Hanafi note (Wajib in Witr, 3rd rakat)

### Madrasa — Islamic Adab
- **NEW**: Bathroom Etiquettes section (18 rules from Al Fiqh-ul Muyassar, Hanafi): entering/exiting duas, istinja method, Qiblah ruling, privacy, right/left hand, what not to bring inside, avoiding splashes, etc.

### Lectures — 6th Scholar
- **NEW**: Dr. Omar Suleiman added as 6th scholar
- Series: "The Firsts — Stories of the Companions" — **60 episodes** covering the earliest believers (Khadijah, Ali, Abu Bakr, Omar, Bilal, Sumayyah, Uthman and more)
- Source: archive.org `the-firsts-dr.-omar-suleiman` (all 60 filenames verified)
- Full bio, specialty: Companions of the Prophet ﷺ · Fiqh · Civil Rights · Founder of Yaqeen Institute

### Nawafil Push Notifications
- **NEW**: 5 new notification types wired into prayer scheduler:
  - **Ishraq** — Sunrise + 20 minutes ("pray 2 rak'ah for reward of Hajj & Umrah")
  - **Duha** — mid-morning between Sunrise and Dhuhr
  - **Awabeen** — Maghrib + 15 minutes (6 rak'ah after Maghrib)
  - **Tahajjud** — 2 hours before Fajr (last third of the night)
  - **Mon/Thu Fasting Reminder** — evening before (Asr + 30 min on Sunday/Wednesday)
- Settings: 5 new toggles under "Nawafil & Reminders" section
- Server-side: `lib/prayer-scheduler.ts` extended; `lib/webpush.ts` updated with rich notification payloads

### Calendar
- **NEW**: "Submit an Event" modal — community members can submit local events for admin review
- Fields: event name, type (6 categories), date, time, location/masjid, description, submitted by
- POSTs to existing `POST /api/events/submit` route; success/error feedback inline

---

## v2.13.0 — GII Library: Practical Essentials (Feb 23, 2026)
- **NEW**: "Practical Essentials for Muslim Students" added to GII Library (Scribd ID 228087653)
- Category: Fiqh | 40 pages | GII publication
- Note: Scribd AI had mislabelled this as "Necessity of Nose Piercing for Nikah" — actual content is student fiqh guide

---

## v2.12.0 — Fiqh Guide + 7 New Duas Categories (Feb 23, 2026)

### Fiqh Guide — New Madrasa Section
- **NEW**: `/explore/madrasa/fiqh` — Hanafi Fiqh reference sourced from Al Fiqh-ul Muyassar
- 7 chapters: Taharah (Purification) · Salah · Sawm (Fasting) · Zakah · Nikah & Family · Halal & Haram · Seeking Knowledge
- Each chapter: overview, key rulings, Quranic/hadith references, links to GII Library for full reading
- Fiqh card added to Madrasa hub

### New Duas Categories (7 added)
- **Bathroom**: entering dua (أعوذ بالله من الخبث والخبائث) + exiting dua (sourced from Al Fiqh-ul Muyassar)
- **Wudu**: dua before wudu + after wudu (Shahada dua from Muslim)
- **Dressing**: putting on clothes + removing clothes
- **Mirror**: looking in the mirror dua
- **Anger**: seeking refuge from anger (3 steps: silence, sit, wudu)
- **Seeking Knowledge**: before study, increasing knowledge (Surah Ta-Ha 114)
- **Istighfar & Repentance**: Sayyidul Istighfar + short forms

---

## v2.11.0 — Darul Uloom Data + Ramadan Content (Feb 23, 2026)

### Critical Data Fixes
- **FIXED**: Ramadan dates reverted to correct GIT/Darul Uloom official values (Saudi: Feb 18, CIOG: Feb 19)
- **FIXED**: Islamic Calendar dates corrected (Laylatul Qadr Mar 10/12/14/16/18, Eid Mar 20)
- **FIXED**: `getRamadanDay()` now reads `ramadan_start` from localStorage (supports Saudi vs CIOG)
- **FIXED**: Moon Sighting in Settings correctly sets Feb 18 (Saudi) or Feb 19 (CIOG)

### GIT Official Ramadan 1447 Timetable
- **NEW**: `lib/ramadan-timetable.ts` — complete 30-day GIT prayer time chart + Eid day
- All prayer times for Georgetown area (Fajr, Sunrise, Zuhr, Asr Shafi/Hanafi, Maghrib, Isha)
- Regional time adjustments for 6 Guyana regions (-4 to +2 min)
- Helper functions: `getTodayTimetable()`, `getRamadanDay()`, `getTodayIftaarTime()`, `getTodaySuhoorEnd()`

### Darul Uloom Masjid — Full Data
- Masjid #22 updated: full name "Darul Uloom Masjid (Islamic & Academic Institute)"
- Address: 310 East Street, South Cummingsburg (was incorrectly "Alberttown")
- Imam: Moulana Badrudeen Khan | Head: Moulana Badrudeen Khan
- Taraweeh reciters: Mufti Mohamed Irfan, Hafiz Khalid Lovell, Hafiz Asif Ameer
- Islamic Store info, D.E.H.C. halal committee, Ramadan iftaar pricing

### D.E.H.C. Halal Certifications
- **NEW**: D.E.H.C. (Darul Uloom East Street Halaal Committee) added as official authority
- **Church's Chicken**: D.E.H.C. certified — Iftar Meal $3,500 GYD
- **Jade's Wok Asian Cuisine**: D.E.H.C. certified — 3 locations (Giftland Mall, Amazonia Mall, West Central Mall)

### Zakat Page — 2026 Official Values
- Nisab updated: $547,298 GYD (was $1,500,000 — incorrect)
- Sadaqatul Fitr: $2,000 GYD/person (was $500 — incorrect)
- Fidya: $60,000 GYD/fast (new display)
- Source: Maulana Badrudeen Khan & Mufti Irfan Qasmi, Darul Uloom East Street

### New Ramadan Content Pages
- **Factors Affecting the Fast** (`/explore/ramadan/factors`): Full reference from Darul Uloom — what invalidates vs. doesn't invalidate the fast
- **Fidya & Missed Fasts Guide** (`/explore/ramadan/fidya`): Who's exempt, Fidya rules, Sadaqatul Fitr guide
- **Sisters in Ramadan** (`/explore/sisters/ramadan`): 8 worship actions for menstruating women (Darul Uloom)
- All 3 pages linked from Explore (new "Ramadan Guides" section)

## v2.8.0 — 99 Names Detail Panel (Feb 22, 2026)
- **99 Names of Allah**: tap any name for full detail panel — explanation, Quranic reference with verse, dhikr benefit, category badge, root word
- New `lib/asmaul-husna-detail.ts` — complete 99-entry dataset with Islamic context
- Detail bottom sheet: body scroll lock, drag handle, teal Quran verse box, rose dhikr benefit section

## v2.7.0 — GII Library + Fixes (Feb 22, 2026)

### GII Islamic Library
- **New**: Guyana Islamic Institute (GII) book library in Madrasa
- Scribd iframe embed — reads natively within the app, no redirect to browser
- Commentary on Aqeedah Tahawiyyah (151 pages) — live
- Fiqh-us-Seerah (185 pages) — coming soon
- Full-screen reader: dark app-styled header, loading spinner, Download button, Open on Scribd link
- GII attribution card with address and contact

### Fixes
- **Fix**: @username save — `displayUsername` column was missing from DB, caused Internal Server Error on save; added via migration
- **Fix**: Qibla compass on iOS — `requestPermission()` was called in useEffect (iOS blocks this); now shows "Enable Compass" tap button first
- **Fix**: Noorani Qaida sheet scrolling — rebuilt as flex column with body scroll lock, save/restore scroll position on close, `overscroll-contain`

### Settings
- **New**: "Your Profile Handle" — set @username in Settings (lowercase alphanumeric + underscore)
- Username stored via Better Auth updateUser, enforces uniqueness at DB level

## v2.6.0 — Buddy System Upgrade (Feb 22, 2026)

### Buddy System
- **5-level ranking system**: Seeker → Devoted → Steadfast → Illuminated → Champion (replaces 3-tier Bronze/Silver/Gold)
- **My Stats card**: See your own points, level, streak, and progress to next level in the Buddies tab
- **Live challenge progress**: Challenges now auto-compute progress from real tracker data (prayer streak, fasting log, nawafil log, Quran khatam, Witr log)
- **Completed challenges**: Challenge cards show ✓ COMPLETED badge when target reached
- **Buddy comparison**: Tap a buddy to see your points vs theirs side by side
- **Find by @username or phone**: Add buddies without needing their email (Settings → set your @username)

### How It Works — Accurate Points Reference
- Fixed points breakdown to match actual calculation engine
- Added Sunnah prayer points (Fajr Sunnah 30 pts, Witr 50 pts, etc.)
- Added Nawafil points (Tahajjud 100 pts highest, Duha 50 pts, etc.)
- Added streak multiplier table (3+ days = 1.2×, up to 2.0× at 21+ days)
- Added Perfect Day bonus (+50 pts for completing all 5 daily ibadah items)
- Corrected 5-level system throughout

### Onboarding
- Updated feature highlights to show all 8 current features including Sunnah tracker, 25 Prophets, @username buddy search

## v2.5.0 — Feb 23, 2026
- Onboarding: Per-step themed animations (crescent+stars on welcome, amber sparkles on name, compass ring on prayer, Ramadan lantern+crescent, confetti on done)
- Onboarding: iOS PWA install expanded to full 3-step guide with numbered badges
- Onboarding: Google Sign-In removed from done step (moved to name step in Sprint 6)

## v2.4.0 — Feb 23, 2026
- New: Sunnah & Nawafil prayer tracker (Witr, Fajr Sunnah, all confirmed sunnahs, Tahajjud, Duha, Ishraq, Awwabeen, Tarawih)
- New: lib/prayer-types.ts — full Islamic prayer taxonomy with rakat, timing, hadith rewards
- Buddy: Nawafil challenges — Witr Streak, Tahajjud Week, Duha Month, Nawafil Sprint, Fajr Sunnah Commitment
- New: "All Islamic Prayers" education page in Madrasa
- Madrasa: Nawafil tab added to Learn to Pray page
- Madrasa: All "Coming Soon" features now live (99 Names linked, Stories of Prophets linked)
- Tracker: Daily sunnah score indicator + points breakdown
- Points: Nawafil prayer logging now awards points (Tahajjud = 100 pts, Witr = 50 pts, etc.)

## v2.3.0 — Feb 23, 2026
- Fix: Prayer timer 00:00:00 — stale closure resolved, timer now uses ref
- Fix: Post-Isha timer now shows time until next Fajr (not 00:00:00)
- Fix: Google Sign-In now appears on the "What should we call you?" onboarding step
- Onboarding: Updated feature highlights with 6 current features
- New: Quran verse sharer — share any ayah via WhatsApp/text/copy
- New: Personal Khatam tracker — 30-Juz grid in Tracker
- New: Stories of 25 Prophets page in Madrasa (lib/prophets-data.ts)
- New: Arabic typing practice tool in Madrasa
- Explore grid: new items added to correct sections

## v2.2.0 — Feb 23, 2026
- Home: Hadith of the Day card (40-hadith rotation, Arabic + transliteration + source)
- Tracker: 7-day prayer statistics chart with streak, best day, Fajr rate stats
- Quran: "Continue Reading" bookmark — saves last page, shows progress bar
- New page: Islamic Names search — 80+ names, Arabic, meaning, gender, origin filter
- Lectures: Playback position saved (Resume at X:XX badge); auto-advance on completion
- Layout: Offline status badge — amber pill when offline, auto-hides when reconnected
- Settings: Notification preferences UI — per-prayer toggles with permission prompt (added Jumu'ah)
- Madrasa: 5 Pillars + Articles of Faith linked to existing New to Islam pages

## v2.1.0 — Feb 23, 2026
- Lectures: Added Bilal Philips (Foundations of Islamic Studies 10, Al-Qada Wal-Qadar 9)
- Lectures: Added Yasmin Mogahed (Reclaim Your Heart 3, Spiritual Gems 12)
- Tracker: Extended ibadah tracking — Quran pages, Sadaqah, Good Deeds, Sleep, Water, Adhkar, Istighfar
- Explore: Grid reorganised into 5 labelled sections
- Madrasa: Seerah page (4 eras of the Prophet's ﷺ life) + Adab page (Islamic etiquette)
- Jumu'ah: New prep page — checklist, Surah Al-Kahf link, khutbah log, Friday duas
- Themed animations: crescent on Ramadan, arabesque on Duas, pulse on Tasbih, sunrise on New to Islam
- Ramadan start auto-set from moon sighting preference
- README.md completely updated with all features
- Navigation fixed: fully opaque bottom nav, pb-nav class across 52 pages

## v1.9.0 — February 2026 — Community & Learning

### Madrasa
- Restored full Noorani Qaida (12 lessons, 29 Arabic letters with makhraj)
- Interactive letter forms viewer (initial, medial, final)
- Tajweed rules: Noon Sakinah, Raa, Laam, and Waqf lessons
- Progress tracking across all lessons

### Tracker
- Year-round fasting (6 of Shawwal, Mon/Thu, Ayyam al-Bayd, Voluntary)
- Each fasting type with own calendar and progress tracking

### Community
- Community Dua Board — submit prayer requests, react with Ameen
- Quran Khatam Collective — claim a Juz, complete Quran together
- Halal Business Directory — searchable directory for Guyana
- Community Feed — share reminders, questions, announcements

### Onboarding
- Simplified Prayer Settings for new Muslims (clearer Asr explanation)
- Clearer moon sighting labels (CIOG / Central Sighting Committee)

### Settings
- Google Sign-In accessible from Settings and Profile (not just onboarding)

### Feedback
- Added "Request New Masjid" and "Report Masjid Error" categories
- Additional fields for masjid name, location, and contact

### UX
- Back button on Map view
- Animated star field on Explore and Quran page heroes
- Community card added to Explore grid

## v1.7.0 — February 2026 — v2 Migration
- Migrated to Next.js 16 + React 19
- New component system (shadcn/ui)
- Leaderboard, Hifz Mode, 99 Names, Fasting Tracker

## v1.6 — February 2026 — Design Consistency
- Unified card styling, changelog page, admin panel redesign

## v1.5 — February 2026 — Push Notifications & Learning
- Prayer time push notifications
- Suhoor/Iftaar alerts
- Madrasa (Noorani Qaida) - 12 structured lessons

## v1.0 — February 2026 — Initial Launch
- Masjid Directory (12 verified Georgetown masjids)
- Ramadan 1447 AH timetable
- Qibla compass, Adhkar, Prayer tracker
