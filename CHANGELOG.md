# Changelog

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
