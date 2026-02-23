# MasjidConnect GY

**The Islamic community app for Guyana** — prayer times, Quran, fasting tracker, masjid directory, Islamic education, and community features.

**Live:** https://masjidconnectgy.com | **GitHub:** https://github.com/kareemschultz/v0-masjid-connect-gy

---

## Features

### Prayer & Worship
- **Prayer Times** — accurate times for Georgetown, Guyana (Muslim World League / Egyptian General Authority)
- **Adhan** — prayer countdown with next salah highlighted
- **Prayer Tracker** — log your 5 daily prayers
- **Qibla** — compass direction to Makkah
- **Adhkar** — morning and evening supplications

### Quran
- **Mus'haf** — page-by-page Quran (604 pages, text-based with Amiri Quran font)
- **Recitation** — audio recitation with 12 reciters (Mishary Alafasy, Sudais, Maher al-Muaiqly, and more)
- **Hifz Mode** — memorisation aid with reveal/hide mechanic
- **Noorani Qaida** — 12 lessons for learning the Arabic alphabet and Tajweed

### Ramadan
- **Ramadan Companion** — suhoor/iftaar countdowns, Hijri date
- **Fasting Tracker** — year-round (Ramadan, Shawwal, Mon/Thu, Ayyam al-Bayd, Voluntary)
- **Ibadah Tracker** — daily prayer log, Quran pages, Sadaqah, Adhkar, Istighfar, Sleep, Water

### Masjid Directory
- 20+ masjids across Georgetown, East Coast Demerara, Berbice, Linden, West Demerara
- Search, area filter, facility badges (Parking, Women's Section, Jumu'ah, Wudu Area)
- Masjid check-in with live daily counter
- Jumu'ah Friday pulse banner

### Community
- **Community Dua Board** — share prayer requests, say Ameen
- **Quran Khatam Collective** — claim a Juz for community Khatam
- **Halal Business Directory** — Georgetown halal businesses
- **Community Feed** — share reminders and announcements
- **Buddy System** — faith partner streaks

### Madrasa (Islamic Education)
- **Noorani Qaida** — interactive Arabic alphabet with makhraj
- **Learn to Pray** — Wudu (8 steps) + Salah (10 steps) with SVG posture icons
- **Seerah** — Life of the Prophet (peace be upon him) by era
- **Islamic Adab** — manners and etiquette
- **5 Pillars, 6 Articles of Faith** (under New to Islam)

### New to Islam
- Shahada guide, 6 Articles of Faith, 5 Pillars
- Islamic Vocabulary (30+ terms searchable)
- FAQ for new Muslims (10 common questions)
- Duas for new reverts

### Sisters Section
- Hijab guide, Women in Prayer, Ramadan for sisters
- Women's Duas, Rights of Women in Islam
- Inspiring Muslim women (Aisha, Khadijah, Fatimah, Yasmin Mogahed)

### Lectures
- **Anwar al-Awlaki** — Makkah Period (16), Madinah Period (18), Lives of Prophets (21), Hereafter (22)
- **Hamza Yusuf** — Purification of the Heart (41), Vision of Islam (24)
- **Bilal Philips** — Foundations of Islamic Studies (10), Al-Qada Wal-Qadar (9)
- **Yasmin Mogahed** — Reclaim Your Heart (3), Spiritual Gems (12)
- **Muhammad Abdul Jabbar** — Standalone lectures (10)

### Tools
- **Zakat Calculator** — GYD currency, Zakat al-Fitr per head, 8 asnaf
- **Islamic Calendar** — 2026 events with Google Calendar links
- **99 Names of Allah** — Asma Al-Husna
- **Tasbih** — digital counter with haptic feedback
- **Duas** — 70+ duas in 20 categories with bookmarks and search
- **Jumu'ah Prep** — checklist, Surah Al-Kahf, khutbah log

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** Tailwind CSS + shadcn/ui (permanently dark)
- **Auth:** Better Auth with Google Sign-In
- **Database:** PostgreSQL
- **PWA:** Service Worker, Web Push (VAPID), Offline support

## Development
```bash
cd /home/karetech/v0-masjid-connect-gy
npm install
npm run dev
```

## Deployment
See CLAUDE_CODE_CONTEXT.md for full deployment instructions.

---

*Built with love for the Muslim community of Guyana. May Allah accept it.*
