You are working on MasjidConnect GY — a Next.js 16 Islamic community PWA for Guyana.
Repo: /home/karetech/v0-masjid-connect-gy/
Permanently dark: bg-[#0a0b14] base, bg-gray-900 cards, border-gray-800.
NEVER use light-mode classes. Arabic: className="font-arabic" (Amiri font).
All sub-pages: showBack on PageHero, BottomNav at bottom, pb-nav on root div.

After ALL tasks, rebuild & redeploy:
  cd /home/karetech/v0-masjid-connect-gy
  docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . && docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod && docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest && docker network connect kt-net-apps kt-masjidconnect-prod && docker network connect kt-net-databases kt-masjidconnect-prod

Then commit & push:
  git add -A && git commit -m "feat: sprint 4 — lectures expansion, ibadah tracker, themed animations, Madrasa content, Jumu'ah, README" && git push origin main

=== TASK 1: ADD SCHOLARS TO LECTURES ===

File: app/explore/lectures/page.tsx
Add two new scholars to the SCHOLARS array BEFORE the jabbar entry:

A) BILAL PHILIPS (after Hamza Yusuf, before Abdul Jabbar):
  {
    id: 'bilal-philips',
    name: 'Bilal Philips',
    bio: 'Canadian-Jamaican Islamic scholar, founder of Islamic Online University. Known for clear, accessible teaching on Aqeedah (Islamic theology) and the fundamentals of Islam.',
    avatar: '📚',
    color: 'from-blue-900/60 to-indigo-900/60',
    series: [
      {
        id: 'bp-foundations',
        title: 'Foundations of Islamic Studies',
        subtitle: '10 sessions — Islam from the ground up',
        archiveId: 'Dr.BilalPhilipsCollection',
        category: 'Standalone' as Category,
        accent: 'blue',
        color: 'from-blue-900 to-indigo-900',
        lectures: [
          { title: 'Part 1 — Introduction', file: 'FoundationsOfIslamicStudies-Pt1.mp3' },
          { title: 'Part 2 — Aqeedah', file: 'FoundationsOfIslamicStudies-Pt2.mp3' },
          { title: 'Part 3 — Tawheed', file: 'FoundationsOfIslamicStudies-Pt3.mp3' },
          { title: 'Part 4 — Prophethood', file: 'FoundationsOfIslamicStudies-Pt4.mp3' },
          { title: 'Part 5 — The Quran', file: 'FoundationsOfIslamicStudies-Pt5.mp3' },
          { title: 'Part 6 — The Sunnah', file: 'FoundationsOfIslamicStudies-Pt6.mp3' },
          { title: 'Part 7 — The Pillars of Islam', file: 'FoundationsOfIslamicStudies-Pt7.mp3' },
          { title: 'Part 8 — Islamic Law (Shariah)', file: 'FoundationsOfIslamicStudies-Pt8.mp3' },
          { title: 'Part 9 — Islamic History', file: 'FoundationsOfIslamicStudies-Pt9.mp3' },
          { title: 'Part 10 — Conclusion', file: 'FoundationsOfIslamicStudies-Pt10.mp3' },
        ],
      },
      {
        id: 'bp-qadar',
        title: 'Al-Qada Wal-Qadar',
        subtitle: 'Divine Decree — 9 sessions',
        archiveId: 'Dr.BilalPhilipsCollection',
        category: 'Standalone' as Category,
        accent: 'blue',
        color: 'from-indigo-900 to-blue-900',
        lectures: Array.from({ length: 9 }, (_, i) => ({
          title: `Session ${i + 1}`,
          file: `Al-qadaWal-qadar-${i + 1}.mp3`,
        })),
      },
    ],
  },

B) YASMIN MOGAHED (after Bilal Philips, before Abdul Jabbar):
  {
    id: 'yasmin-mogahed',
    name: 'Yasmin Mogahed',
    bio: 'Egyptian-American Muslim writer and speaker. Author of "Reclaim Your Heart". Known for her deeply personal and spiritual approach to topics of the heart, love, and relationship with Allah.',
    avatar: '💫',
    color: 'from-rose-900/60 to-pink-900/60',
    series: [
      {
        id: 'ym-reclaim',
        title: 'Reclaim Your Heart',
        subtitle: '3 sessions — Detaching from dunya',
        archiveId: 'AJourneyToAllah',
        category: 'Tazkiyah' as Category,
        accent: 'rose',
        color: 'from-rose-900 to-pink-900',
        lectures: [
          { title: 'Reclaim Your Heart — Part 1', file: 'ReclaimYourHeart01.mp3' },
          { title: 'Reclaim Your Heart — Part 2', file: 'ReclaimYourHeart02.mp3' },
          { title: 'Reclaim Your Heart — Part 3', file: 'ReclaimYourHeart03.mp3' },
        ],
      },
      {
        id: 'ym-standalone',
        title: 'Spiritual Gems',
        subtitle: '12 selected talks',
        archiveId: 'AJourneyToAllah',
        category: 'Tazkiyah' as Category,
        accent: 'rose',
        color: 'from-pink-900 to-rose-900',
        lectures: [
          { title: 'Inner Peace', file: 'InnerPeace.mp3' },
          { title: 'Searching for Inner Peace', file: 'SearchingForInnerPeace.mp3' },
          { title: 'Path to the Most Merciful', file: 'PathToTheMostMerciful.mp3' },
          { title: 'Healing a Broken Heart', file: 'HealingABrokenHeart.mp3' },
          { title: 'Love of Allah', file: 'LoveOfAllah.mp3' },
          { title: 'Breaking Through the Illusion of Dunya', file: 'BreakingThroughTheIllusionOfDunya.mp3' },
          { title: 'A Secret Path to Happiness', file: 'ASecretPathToHappiness.mp3' },
          { title: 'The Attribute of Patience', file: 'TheAttributeOfPatience.mp3' },
          { title: 'When Allah Comes to You', file: 'WhenAllahComesToYou.mp3' },
          { title: 'How to Forgive and Heal', file: 'HowToForgiveAndHeal.mp3' },
          { title: 'Why Am I Empty?', file: 'WhyAmIEmpty.mp3' },
          { title: 'Beauty of the Beloved', file: 'BeautyOfTheBeloved.mp3' },
        ],
      },
    ],
  },

=== TASK 2: EXPLORE GRID — SECTION LABELS ===

Update app/explore/page.tsx to group cards under section headers.
Replace the flat EXPLORE_ITEMS grid with sectioned rendering:

Sections:
1. "📖 Quran & Learning" — Quran (link /quran), Madrasa, Lectures, Hifz Mode
2. "🕌 Prayer & Practice" — Adhkar, Duas, Tasbih, Qibla, Zakat, Calendar
3. "👥 Community" — Community, Buddy, Iftaar, Masjids (link /masjids)
4. "🌱 New Here?" — New to Islam, Sisters
5. "🔧 Tools" — Resources, 99 Names, Events

Section header style:
  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mt-6 mb-2 px-1">
    {section.label}
  </h2>

Keep the Ramadan card at the very top (before any sections), full-width or 2-col as it is now.
Keep the 2-column grid within each section.
Keep all existing card styles (glass, card-premium, icon, etc.) unchanged.

=== TASK 3: EXTENDED IBADAH TRACKER ===

Update app/tracker/page.tsx to add new ibadah tracking sections:

A) Add to lib/storage.ts new KEYS:
   QURAN_LOG: 'quran_log',           // Record<'YYYY-MM-DD', { pages: number, juz: number }>
   SADAQAH_LOG: 'sadaqah_log',       // Record<'YYYY-MM-DD', { amount: number, type: string }[]>
   GOOD_DEEDS_LOG: 'good_deeds_log', // Record<'YYYY-MM-DD', string[]>
   SLEEP_LOG: 'sleep_log',           // Record<'YYYY-MM-DD', number>
   WATER_LOG: 'water_log',           // Record<'YYYY-MM-DD', number>
   ADHKAR_LOG: 'adhkar_log',         // Record<'YYYY-MM-DD', { morning: boolean, evening: boolean }>
   ISTIGHFAR_COUNT: 'istighfar_count', // Record<'YYYY-MM-DD', number>

B) In app/tracker/page.tsx, add collapsible sections BELOW the existing daily prayer checklist:

SECTION: "📖 Quran Today"
  - "Pages read today" — number input (+ and - buttons, min 0)
  - Small progress text: "Total pages this Ramadan: X" (sum all days)
  - Tap +/- to update, auto-save to QURAN_LOG

SECTION: "💧 Sadaqah"
  - "Record charity given" — amount in GYD (number input)
  - Type selector (pill chips): Sadaqah | Zakat | Sadaqah Jariyah | Feed Someone | Other
  - "Add" button — appends to today's list
  - Today's entries listed below with amount, type, delete button
  - Total for today shown

SECTION: "🤲 Good Deeds"  
  - 6 preset deed chips to toggle: "Visited sick", "Fed someone", "Helped a neighbor", "Called parents", "Smiled at a Muslim", "Removed harm from path"
  - Custom deed: text input + add button
  - Ticked deeds show as completed (green)
  - Saved to GOOD_DEEDS_LOG

SECTION: "😴 Sleep & Water" (compact, side by side)
  - Sleep: stepper (- 0.5 + ) showing hours, range 0-12h
  - Water: stepper (- 1 +) showing glasses, range 0-20
  - Small note: "Track your sleep and hydration during Ramadan"

SECTION: "🔢 Istighfar Counter"
  - Large circular counter showing today's count
  - Tap anywhere on the circle to increment
  - "Reset today" button (small)
  - Shows "X Astaghfirullah today"
  - Goal: "Target: 100 per day" (Sunnah)

SECTION: "📿 Adhkar"
  - Two toggle cards: Morning Adhkar ✓/✗ | Evening Adhkar ✓/✗
  - Tap to mark complete
  - Links to /explore/adhkar (arrow icon)
  - Message: "Completing morning & evening adhkar is Sunnah"

Each section: collapsible with a chevron, header shows summary (e.g., "Quran — 5 pages today")

=== TASK 4: THEMED BACKGROUND ANIMATIONS ===

Add subtle CSS animations to page heroes. Use a single CSS class + keyframe approach.
Add new keyframes to app/globals.css:

@keyframes float-crescent {
  0%, 100% { transform: translateY(0px) rotate(-5deg); opacity: 0.15; }
  50% { transform: translateY(-8px) rotate(5deg); opacity: 0.25; }
}
@keyframes arabesque-drift {
  0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.06; }
  50% { transform: rotate(3deg) scale(1.02); opacity: 0.1; }
}
@keyframes gentle-pulse {
  0%, 100% { transform: scale(1); opacity: 0.08; }
  50% { transform: scale(1.05); opacity: 0.14; }
}

Then add themed background SVGs as absolutely positioned divs in these pages:

A) app/ramadan/page.tsx — Crescent + stars floating:
   Add below the opening div: 
   <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
     <svg className="absolute right-8 top-16 h-24 w-24 text-emerald-400" style={{animation:'float-crescent 4s ease-in-out infinite', opacity:0.15}} viewBox="0 0 100 100">
       <path d="M50 10 A40 40 0 1 0 90 60 A30 30 0 1 1 50 10Z" fill="currentColor"/>
     </svg>
     {/* 5 small stars at varied positions */}
     {[{x:20,y:30},{x:75,y:20},{x:85,y:60},{x:15,y:70},{x:60,y:15}].map((pos,i)=>(
       <div key={i} className="absolute h-1.5 w-1.5 rounded-full bg-white" style={{left:`${pos.x}%`,top:`${pos.y}%`,animation:`twinkle ${2+i*0.4}s ease-in-out infinite`,animationDelay:`${i*0.5}s`,opacity:0.3}} />
     ))}
   </div>

B) app/explore/duas/page.tsx — Flowing arabesque pattern:
   Add an absolutely positioned SVG with a 8-pointed star pattern, gentle rotate animation:
   <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 overflow-hidden" aria-hidden>
     <svg viewBox="0 0 200 200" style={{animation:'arabesque-drift 6s ease-in-out infinite',opacity:0.08}} className="text-purple-300" fill="currentColor">
       <polygon points="100,10 120,80 190,80 135,125 155,195 100,155 45,195 65,125 10,80 80,80" />
     </svg>
   </div>

C) app/explore/tasbih/page.tsx — Pulsing geometric ring:
   Add concentric rings that gently pulse behind the counter:
   Use absolute divs with rounded-full borders, gentle scale animation.
   3 rings: inner (h-40 w-40), middle (h-56 w-56), outer (h-72 w-72)
   All centered, opacity 0.05-0.08, border-emerald-500/20, animation: gentle-pulse with staggered delays

D) app/explore/new-to-islam/page.tsx — Sunrise gradient rays:
   Add absolutely positioned gradient "rays" emanating from the bottom center:
   3 divs, each a thin gradient strip (w-0.5, h-32) rotated at different angles, opacity 0.12
   Colors: from-emerald-400/30 to-transparent
   Animation: pulse gently

E) app/explore/sisters/page.tsx — Soft geometric flower:
   Add a rose/pink 6-petal SVG flower, slowly rotating, bottom right:
   opacity 0.08, animation: gentle spin (360deg over 20s infinite linear)

F) The existing star field (on Explore, Quran, Madrasa heroes via stars={true} prop) is already done.
   Just confirm it's working by NOT removing it.

=== TASK 5: MADRASA CONTENT EXPANSION ===

A) Create app/explore/madrasa/seerah/page.tsx — Life of the Prophet ﷺ:
   Title: "Seerah", subtitle: "Life of the Prophet Muhammad ﷺ"
   4 era cards, each expandable:
   
   Era 1: Birth & Early Life (570–610 CE)
   - Born in Makkah, Year of the Elephant (570 CE)
   - Father Abdullah died before his birth; mother Aminah died when he was 6
   - Raised by grandfather Abd al-Muttalib, then uncle Abu Talib
   - Known as Al-Amin (The Trustworthy) by all Makkah
   - Married Khadijah (رضي الله عنها) at age 25; she was 40
   - Had 6 children: Qasim, Abdullah, Zainab, Ruqayyah, Umm Kulthum, Fatimah
   
   Era 2: Revelation & Makkah Period (610–622 CE)
   - First revelation in Cave Hira (Surah Al-Alaq): "Read in the name of your Lord..."
   - 13 years in Makkah, facing severe persecution
   - Night Journey (Isra wal Mi'raj): Jerusalem → 7 heavens → meeting Allah
   - 5 daily prayers made obligatory during Isra wal Mi'raj
   - Key companions: Khadijah, Abu Bakr, Ali, Bilal (first muezzin)
   - Year of Sadness: death of Khadijah and Abu Talib in the same year
   
   Era 3: Hijra & Madinah Period (622–632 CE)
   - Hijra (migration) to Madinah in 622 CE — this is Year 1 of Islamic calendar
   - Brotherhood established between Muhajireen and Ansar
   - Constitution of Madinah: first written multicultural civic agreement
   - Key battles: Badr (victory), Uhud (test), Khandaq (Trench)
   - Conquest of Makkah (630 CE): entered peacefully, idol-free Ka'bah
   - Farewell Pilgrimage (632 CE): 124,000 companions; famous sermon
   
   Era 4: Final Days & Legacy
   - Passed away Monday 12 Rabi al-Awwal, 11 AH (632 CE), aged 63
   - Buried in Madinah in Masjid an-Nabawi
   - Final revelation: "Today I have perfected your religion..." (Quran 5:3)
   - Left: Quran and Sunnah; no worldly inheritance
   - Legacy: 1.8 billion followers today, the most influential human in history
   
   Each era: expandable card, timeline-style with year markers

B) Create app/explore/madrasa/adab/page.tsx — Islamic Etiquette (Adab):
   Title: "Islamic Adab", subtitle: "Manners of the Muslim"
   8 categories as expandable cards:
   
   1. Greetings — As-Salamu Alaykum, returning greetings, greeting non-Muslims
   2. Eating & Drinking — Bismillah, right hand, sitting, not blowing on food, 3 sips for water
   3. Entering Home — knock 3 times, say salam, ask permission
   4. Entering Masjid — right foot first, dua, not speaking loudly, phone on silent
   5. Sneezing & Yawning — say Alhamdulillah after sneezing, cover yawn
   6. Speaking — speak truth, avoid backbiting (gheebah), don't mock others
   7. Dealing with Parents — never say "uff", lower voice, obey within Islamic limits
   8. Dealing with Neighbours — don't harm them, share food, check on them
   
   For each: the Islamic ruling (Wajib/Sunnah/Mustahabb), what to say (Arabic), why it matters

C) Add "Seerah" and "Adab" cards to app/explore/madrasa/page.tsx:
   - Seerah card: icon Calendar, teal color, links to /explore/madrasa/seerah
   - Adab card: icon Star, amber color, links to /explore/madrasa/adab
   - Mark the other "Coming Soon" modules as: the card text shows "Coming Soon" but now
     also link Five Pillars → /explore/new-to-islam/pillars (already exists!)
     and Articles of Faith → /explore/new-to-islam/beliefs (already exists!)

=== TASK 6: JUMU'AH FEATURES ===

A) Create app/explore/jumuah/page.tsx — Jumu'ah Prep:
   - PageHero: title "Jumu'ah", subtitle "Friday Prayer Preparation", gradient from-emerald-900 to-teal-900
   - showBack
   
   Section 1: Preparation Checklist (with progress ring):
   - [ ] Made ghusl (full bath) before Jumu'ah
   - [ ] Wore clean clothes / best appearance
   - [ ] Applied attar/perfume (men)
   - [ ] Read Surah Al-Kahf
   - [ ] Went early to masjid
   - [ ] Made dua between Asr and Maghrib (blessed time on Friday)
   - [ ] Sent extra salawat on the Prophet ﷺ
   Each item: checkable, saved to localStorage 'jumuah_checklist_YYYY-MM-DD'
   
   Section 2: Surah Al-Kahf (link card)
   - "Read Surah Al-Kahf every Friday" — hadith: 10 ayahs protect from Dajjal
   - Link button: "Open in Quran" → /quran/18 (Surah Al-Kahf)
   - Show the Surah Al-Kahf in Arabic (at least first 10 ayahs): use QuranCDN API:
     fetch('/api/quran/page?page=293') — Surah 18 starts around page 293
     OR hardcode the first 5 ayahs in Arabic as a static display
   
   Section 3: Khutbah Log
   - Text area: "What was today's khutbah about?"
   - "Save Note" button — saves to localStorage 'jumuah_notes' as array [{date, note}]
   - Past notes listed below (last 4 Fridays)
   
   Section 4: Friday Duas
   - Dua when leaving for Jumu'ah: اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ
   - Special dua to find the blessed hour: اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ هَذَا الْيَوْمِ
   - Salawat to recite abundantly: اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
   Each with Arabic, transliteration, meaning

B) Add Jumu'ah to Explore grid — in the "Prayer & Practice" section:
   { icon: Sun, label: "Jumu'ah", description: "Friday Prayer Prep", href: '/explore/jumuah', color: 'from-emerald-500/20 to-teal-600/10', iconColor: 'text-emerald-400' }
   Import Sun from lucide-react if not already imported.

C) Add Jumu'ah to ROADMAP — mark "Surah Al-Kahf push notification" as pending (Task 7 could implement it)

=== TASK 7: RAMADAN START FROM MOON SIGHTING ===

In app/onboarding/page.tsx (or components/onboarding-wizard.tsx), after the user selects their moon sighting preference (CIOG or Saudi), auto-set the Ramadan start date:

Add to the moon sighting save logic (where moonSighting is saved to localStorage):
```
// Set Ramadan 1447 AH start based on selection
const ramadanStarts = {
  'ciog': '2026-03-01',   // CIOG/Central Moon Sighting Committee expected date (GY local)
  'saudi': '2026-03-01',  // Saudi typically aligns; update if they differ
}
const ramadanStart = ramadanStarts[moonSighting] || '2026-03-01'
localStorage.setItem('ramadan_start', ramadanStart)
localStorage.setItem('ramadan_start_prompted', 'true')
```

Also check lib/ramadan-mode.ts — ensure getRamadanStatus() reads from localStorage:
```
// Priority: user-set date > calculated date
const storedStart = typeof window !== 'undefined' ? localStorage.getItem('ramadan_start') : null
```

=== TASK 8: UPDATE README.md ===

Completely replace /home/karetech/v0-masjid-connect-gy/README.md with:

# MasjidConnect GY 🕌

**The Islamic community app for Guyana** — prayer times, Quran, fasting tracker, masjid directory, Islamic education, and community features.

**Live:** https://masjidconnectgy.com | **GitHub:** https://github.com/kareemschultz/v0-masjid-connect-gy

---

## Features

### 🕌 Prayer & Worship
- **Prayer Times** — accurate times for Georgetown, Guyana (Muslim World League / Egyptian General Authority)
- **Adhan** — prayer countdown with next salah highlighted
- **Prayer Tracker** — log your 5 daily prayers
- **Qibla** — compass direction to Makkah
- **Adhkar** — morning and evening supplications

### 📖 Quran
- **Mus'haf** — page-by-page Quran (604 pages, text-based with Amiri Quran font)
- **Recitation** — audio recitation with 12 reciters (Mishary Alafasy, Sudais, Maher al-Muaiqly, and more)
- **Hifz Mode** — memorisation aid with reveal/hide mechanic
- **Noorani Qaida** — 12 lessons for learning the Arabic alphabet and Tajweed

### 🌙 Ramadan
- **Ramadan Companion** — suhoor/iftaar countdowns, Hijri date
- **Fasting Tracker** — year-round (Ramadan, Shawwal, Mon/Thu, Ayyam al-Bayd, Voluntary)
- **Ibadah Tracker** — daily prayer log, Quran pages, Sadaqah, Adhkar, Istighfar, Sleep, Water

### 🏫 Masjid Directory
- 20+ masjids across Georgetown, East Coast Demerara, Berbice, Linden, West Demerara
- Search, area filter, facility badges (Parking, Women's Section, Jumu'ah, Wudu Area)
- Masjid check-in with live daily counter
- Jumu'ah Friday pulse banner

### 🌍 Community
- **Community Dua Board** — share prayer requests, say Ameen
- **Quran Khatam Collective** — claim a Juz for community Khatam
- **Halal Business Directory** — Georgetown halal businesses
- **Community Feed** — share reminders and announcements
- **Buddy System** — faith partner streaks

### 📚 Madrasa (Islamic Education)
- **Noorani Qaida** — interactive Arabic alphabet with makhraj
- **Learn to Pray** — Wudu (8 steps) + Salah (10 steps) with SVG posture icons
- **Seerah** — Life of the Prophet ﷺ by era
- **Islamic Adab** — manners and etiquette
- **5 Pillars, 6 Articles of Faith** (under New to Islam)

### 🌱 New to Islam
- Shahada guide, 6 Articles of Faith, 5 Pillars
- Islamic Vocabulary (30+ terms searchable)
- FAQ for new Muslims (10 common questions)
- Duas for new reverts

### ❤️ Sisters Section
- Hijab guide, Women in Prayer, Ramadan for sisters
- Women's Duas, Rights of Women in Islam
- Inspiring Muslim women (Aisha, Khadijah, Fatimah, Yasmin Mogahed)

### 🎧 Lectures
- **Anwar al-Awlaki** — Makkah Period (16), Madinah Period (18), Lives of Prophets (21), Hereafter (22)
- **Hamza Yusuf** — Purification of the Heart (41), Vision of Islam (24)
- **Bilal Philips** — Foundations of Islamic Studies (10), Al-Qada Wal-Qadar (9)
- **Yasmin Mogahed** — Reclaim Your Heart (3), Spiritual Gems (12)
- **Muhammad Abdul Jabbar** — Standalone lectures (10)

### 🔧 Tools
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

*Built with ❤️ for the Muslim community of Guyana. May Allah accept it.*

=== TASK 9: UPDATE CHANGELOG ===

Add to CHANGELOG.md:

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

=== TASK 10: SESSION LOG ===

Append to /home/karetech/KareTech-Vault/Memory/Sessions/2026-02-22-masjidconnect-v1.9-sprint.md:

## Sprint 4 (10:00 PM+ GYT)
- Added Bilal Philips and Yasmin Mogahed to Lectures (archive.org verified)
- Extended Tracker: Quran log, Sadaqah, Good deeds, Sleep, Water, Adhkar, Istighfar
- Explore grid sectioned into 5 labelled groups
- Seerah page (Prophet's life ﷺ by era) and Adab page added to Madrasa
- Jumu'ah prep page: checklist, Al-Kahf link, khutbah log, Friday duas
- Themed background animations: crescent (Ramadan), arabesque (Duas), pulse (Tasbih), etc.
- Ramadan start auto-set from moon sighting preference
- README.md fully rewritten
- All changes committed and deployed

=== CONSTRAINTS ===
- bg-[#0a0b14] base, bg-gray-900 cards, border-gray-800
- NEVER bg-white, bg-gray-50, bg-gray-100
- Arabic: font-arabic class
- All pages: showBack on PageHero, BottomNav, pb-nav
- Lectures archiveId and file names must be EXACTLY as specified — they are verified on archive.org
- Yasmin Mogahed is in the Sisters section inspiration + now also in Lectures — both are fine

When completely done:
git add -A && git commit -m "feat: sprint 4 — Bilal Philips, Yasmin Mogahed lectures, ibadah tracker, sections, Seerah, Adab, Jumuah, animations" && git push origin main
