You are working on MasjidConnect GY — a Next.js 16 Islamic community PWA for Guyana.
Repo: /home/karetech/v0-masjid-connect-gy/
Permanently dark: bg-[#0a0b14] base, bg-gray-900 cards, border-gray-800.
NEVER use light-mode classes. Arabic: className="font-arabic".
All sub-pages: showBack on PageHero, BottomNav at bottom, pb-nav on root div.

After ALL tasks, rebuild & redeploy:
  cd /home/karetech/v0-masjid-connect-gy
  docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .
  docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
  docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
  docker network connect kt-net-apps kt-masjidconnect-prod
  docker network connect kt-net-databases kt-masjidconnect-prod
  git add -A && git commit -m "feat: sprint 7 — nawafil/sunnah tracker, buddy nawafil challenges, all coming soon features" && git push origin main

=== TASK 1: NAWAFIL & SUNNAH PRAYER TRACKER ===

This is the most important task. Add a "Sunnah & Nawafil Prayers" section to app/tracker/page.tsx.

A) Add these KEYS to lib/storage.ts:
   SUNNAH_LOG: 'sunnah_log',   // Record<'YYYY-MM-DD', Record<string, boolean>>
   NAWAFIL_LOG: 'nawafil_log', // Record<'YYYY-MM-DD', Record<string, number>> — rakat count

B) Create lib/prayer-types.ts with the full Islamic prayer taxonomy:

export const SUNNAH_PRAYERS = [
  // Fard (Obligatory) — shown for reference only, not tracked here (tracked in main checklist)
  // Sunnah Mu'akkadah (Confirmed Sunnah — strongly recommended)
  {
    key: 'fajr_sunnah',
    label: 'Fajr Sunnah',
    arabic: 'سنة الفجر',
    rakat: 2,
    timing: 'Before Fajr Fard',
    category: 'sunnah_muakkadah',
    reward: 'The Prophet ﷺ said: "The two rak\'ahs of Fajr are better than the world and everything in it." (Muslim)',
    importance: 'highest', // Never missed by the Prophet ﷺ
  },
  {
    key: 'dhuhr_sunnah_before',
    label: 'Dhuhr Sunnah (Before)',
    arabic: 'سنة الظهر القبلية',
    rakat: 4,
    timing: 'Before Dhuhr Fard',
    category: 'sunnah_muakkadah',
    reward: 'Whoever prays 4 before Dhuhr and 4 after, Allah forbids that person from the Fire. (Abu Dawud)',
    importance: 'high',
  },
  {
    key: 'dhuhr_sunnah_after',
    label: 'Dhuhr Sunnah (After)',
    arabic: 'سنة الظهر البعدية',
    rakat: 2,
    timing: 'After Dhuhr Fard',
    category: 'sunnah_muakkadah',
    reward: 'Regular confirmed Sunnah of the Prophet ﷺ.',
    importance: 'high',
  },
  {
    key: 'maghrib_sunnah',
    label: 'Maghrib Sunnah',
    arabic: 'سنة المغرب',
    rakat: 2,
    timing: 'After Maghrib Fard',
    category: 'sunnah_muakkadah',
    reward: 'Regular confirmed Sunnah.',
    importance: 'high',
  },
  {
    key: 'isha_sunnah',
    label: 'Isha Sunnah',
    arabic: 'سنة العشاء',
    rakat: 2,
    timing: 'After Isha Fard',
    category: 'sunnah_muakkadah',
    reward: 'Regular confirmed Sunnah.',
    importance: 'high',
  },
  // Wajib (Obligatory in Hanafi school)
  {
    key: 'witr',
    label: 'Witr',
    arabic: 'الوتر',
    rakat: 3,
    timing: 'After Isha Sunnah, before Fajr',
    category: 'wajib',
    reward: 'The Prophet ﷺ said: "Witr is a duty for every Muslim." (Abu Dawud). In the Hanafi school, Witr is Wajib.',
    importance: 'wajib',
    note: 'Wajib per Hanafi school; Sunnah Mu\'akkadah per other schools',
  },
]

export const NAWAFIL_PRAYERS = [
  {
    key: 'tahajjud',
    label: 'Tahajjud',
    arabic: 'تهجد',
    rakat: '2–12',
    timing: 'Last third of the night (after sleeping, before Fajr)',
    category: 'nafl',
    reward: 'Allah descends to the lowest heaven in the last third of the night and calls: "Who will supplicate Me that I may respond?"',
    source: 'Bukhari & Muslim',
    icon: '🌙',
  },
  {
    key: 'duha',
    label: 'Duha (Forenoon)',
    arabic: 'صلاة الضحى',
    rakat: '2–12',
    timing: 'After sunrise until before Dhuhr (best: mid-morning)',
    category: 'nafl',
    reward: '"Whoever prays 12 rak\'ahs of Duha, Allah will build a palace of gold for him in Paradise." (Tirmidhi)',
    source: 'Tirmidhi',
    icon: '☀️',
  },
  {
    key: 'ishraq',
    label: 'Ishraq (Post-Sunrise)',
    arabic: 'صلاة الإشراق',
    rakat: 2,
    timing: '15–20 minutes after sunrise',
    category: 'nafl',
    reward: '"Whoever prays Fajr in congregation, then sits remembering Allah until the sun rises, then prays 2 rak\'ahs, he has the reward of Hajj and Umrah."',
    source: 'Tirmidhi',
    icon: '🌅',
  },
  {
    key: 'awwabeen',
    label: 'Awwabeen',
    arabic: 'صلاة الأوابين',
    rakat: 6,
    timing: 'After Maghrib fard + sunnah',
    category: 'nafl',
    reward: '"Whoever prays 6 rak\'ahs after Maghrib, without speaking evil in between, they are equivalent to 12 years of worship." (Tirmidhi)',
    source: 'Tirmidhi',
    icon: '⭐',
  },
  {
    key: 'tarawih',
    label: 'Tarawih',
    arabic: 'صلاة التراويح',
    rakat: '8 or 20',
    timing: 'After Isha — Ramadan nights only',
    category: 'nafl',
    reward: '"Whoever prays Tarawih during Ramadan out of faith and seeking reward, all their past sins are forgiven." (Bukhari & Muslim)',
    source: 'Bukhari & Muslim',
    icon: '🌙',
    ramadanOnly: true,
  },
]

C) In app/tracker/page.tsx, add a "🕌 Sunnah & Nawafil" section after the main prayer checklist:

Section structure:

Header: "🕌 Sunnah & Nawafil Prayers" with total count badge (X/8 today)
Collapsible (default: expanded)

Sub-section 1: "Sunnah Mu'akkadah & Wajib"
Show each sunnah prayer as a toggle row:
  [Arabic name] [Label] [X rakat] [Timing]   [Toggle ✓/○]
  
  Tapping toggles it complete for today.
  Witr has a special gold/amber accent (it's Wajib).
  Fajr Sunnah has a star ⭐ (highest importance).
  
  Show a small quote when toggled on (the reward hadith), then fade out after 2s.

Sub-section 2: "Nawafil (Optional)"
Show each nawafil as a tap-to-log card:
  [Icon] [Label] [Rakat range] [Timing]
  [+2] [+4] [+6] stepper buttons to log rakat count
  Shows "Logged: X rakat today" if already logged

Total points awarded:
  Witr: +50 points per day
  Fajr Sunnah: +30 points
  Each other Sunnah: +20 points
  Tahajjud: +100 points (it's that special)
  Duha: +50 points
  Ishraq: +40 points
  Awwabeen: +30 points
  Tarawih: +60 points per night

Update the points system to include these.

=== TASK 2: BUDDY SYSTEM — NAWAFIL CHALLENGES ===

File: app/explore/buddy/page.tsx

A) Add new category to the Challenge type:
   category: 'prayer' | 'quran' | 'fasting' | 'dhikr' | 'charity' | 'nawafil' | 'witr'

B) Add to CHALLENGE_ICONS:
   nawafil: Moon,  // or Sparkles
   witr: Star,

C) Add to CHALLENGE_COLORS:
   nawafil: 'from-indigo-500 to-violet-600',
   witr: 'from-amber-400 to-orange-500',

D) Add new challenge templates to NEW_CHALLENGE_TEMPLATES:
  {
    title: 'Witr Streak',
    description: 'Pray Witr every night for 30 days — never miss the wajib prayer!',
    category: 'witr',
    target: 30,
    unit: 'nights',
    reward: 300,
  },
  {
    title: 'Tahajjud Week',
    description: 'Wake up for Tahajjud for 7 consecutive nights. The night prayer brings you closest to Allah.',
    category: 'nawafil',
    target: 7,
    unit: 'nights',
    reward: 400,
  },
  {
    title: 'Duha Prayer Month',
    description: 'Pray Duha (the forenoon prayer) every day for 30 days.',
    category: 'nawafil',
    target: 30,
    unit: 'days',
    reward: 350,
  },
  {
    title: 'Nawafil Sprint',
    description: 'Log at least one nawafil prayer daily for 14 days. Any optional prayer counts!',
    category: 'nawafil',
    target: 14,
    unit: 'days',
    reward: 250,
  },
  {
    title: 'Fajr Sunnah Commitment',
    description: 'Pray the 2 Fajr Sunnah rak\'ahs every single day for 30 days — better than the world and all it contains!',
    category: 'prayer',
    target: 30,
    unit: 'days',
    reward: 200,
  },

E) Add new NUDGE_MESSAGES for nawafil:
  { text: 'Time for Tahajjud! The last third of the night is here. Join me in night prayer.', icon: Moon, color: 'text-indigo-400' },
  { text: 'Did you pray Witr last night? Let us hold each other accountable!', icon: Star, color: 'text-amber-400' },
  { text: 'The Prophet ﷺ never abandoned the 2 Fajr Sunnah — not even on a journey. Have you prayed yours?', icon: Flame, color: 'text-orange-400' },
  { text: 'Duha prayer is coming up soon! The Prophet ﷺ said it equals Hajj and Umrah rewards (with Fajr in congregation).', icon: Sun, color: 'text-yellow-400' },

Make sure Sun is imported from lucide-react.

F) In the buddies tab, add a "Sunnah Score" metric below the prayer streak:
   Read from SUNNAH_LOG in localStorage — count how many sunnah prayers the buddy logged today.
   Show as: "🕌 X/8 Sunnah today" in small text below the streak counter.
   (This is approximate since buddy data is local — just show the user's own count for now)

=== TASK 3: NAWAFIL EDUCATION PAGE ===

Create app/explore/madrasa/prayers/page.tsx — "The Prayer Explained" reference guide:

Title: "All Islamic Prayers", subtitle: "Fard, Wajib, Sunnah & Nawafil"
showBack + BottomNav + pb-nav

Sections:
1. "The 5 Fard Prayers" — table with name, Arabic, rakat, timing
2. "Sunnah Mu'akkadah" — the confirmed sunnah before/after fard with hadith reward for each
3. "Wajib: Witr Prayer" — special section, 3 rakat, after Isha, Hanafi = Wajib
4. "Special Nawafil" — Tahajjud, Duha, Ishraq, Awwabeen with timing, rakat, reward
5. "Ramadan Nawafil" — Tarawih (8 or 20), Witr in Tarawih, Qiyam al-Layl
6. "Quick Reference Card" — compact table: Prayer | Rakat | Category | Timing

This page should be beautifully formatted with:
- Gold accent for Wajib/Fard
- Emerald for Sunnah Mu'akkadah
- Purple/indigo for Nawafil
- Clear hadith quotes (shorter, impactful)

Add card to Madrasa hub: "All Islamic Prayers" — links to /explore/madrasa/prayers
Remove it from FUTURE_MODULES (or if it's not there, just add it as an ACTIVE_MODULE)

=== TASK 4: REMAINING COMING SOON FEATURES ===

In app/explore/madrasa/page.tsx, the FUTURE_MODULES array has:
1. "99 Names of Allah" — already exists at /explore/names (or wherever it is). Link it:
   Move from FUTURE_MODULES to ACTIVE_MODULES, change href to '/explore/names' (or wherever the 99 Names page is — check if it's /explore/names or /explore/names-search)
   
2. "Stories of the Prophets" — being built in Sprint 6. Change href to '/explore/madrasa/prophets', move to ACTIVE_MODULES with badge 'NEW'

After these changes, FUTURE_MODULES should be empty (or have only items truly not yet built).
If empty, remove the "Coming Soon" section header entirely and remove the "More learning modules coming soon" footer card.

=== TASK 5: SUNNAH PRAYER GUIDE IN LEARN TO PRAY ===

File: app/explore/madrasa/salah/page.tsx

Currently this page has 2 tabs: Wudu and Salah (the fard prayer).
Add a 3rd tab: "Nawafil" — a compact guide to the sunnah and nawafil prayers.

Tab 3 content:
- Brief intro: "Beyond the 5 daily prayers, the Prophet ﷺ prayed many optional prayers. These bring extra reward and strengthen the connection with Allah."
- Accordion list of the sunnah prayers (use data from lib/prayer-types.ts if created)
- Each item: shows name, Arabic, rakat, timing, and the key hadith reward
- Special callout for Witr: "Witr is Wajib in the Hanafi school — treat it like a 6th prayer."
- Special callout for Tahajjud: "The night prayer is the most virtuous after the obligatory prayers." — with a moon icon

=== TASK 6: TRACKER — POINTS DISPLAY ===

In app/tracker/page.tsx, update the points display (if any) to show:
- Today's total points
- Breakdown: X from fard, X from sunnah, X from nawafil

Also add a "Daily Sunnah Score" indicator at the top of the tracker:
  Sunnah prayers completed: [filled dots] / 8
  Formatted as: ● ● ● ○ ○ ○ ○ ○ (colored dots, emerald for complete, gray for incomplete)

=== TASK 7: CHANGELOG + DOCUMENTATION ===

Append to CHANGELOG.md:
## v2.4.0 — Feb 23, 2026
- New: Sunnah & Nawafil prayer tracker (Witr, Fajr Sunnah, all confirmed sunnahs, Tahajjud, Duha, Ishraq, Awwabeen, Tarawih)
- New: lib/prayer-types.ts — full Islamic prayer taxonomy with rakat, timing, hadith rewards
- Buddy: Nawafil challenges — Witr Streak, Tahajjud Week, Duha Month, Nawafil Sprint, Fajr Sunnah Commitment
- New: "All Islamic Prayers" education page in Madrasa
- Madrasa: Nawafil tab added to Learn to Pray page
- Madrasa: All "Coming Soon" features now live (99 Names linked, Stories of Prophets linked)
- Tracker: Daily sunnah score indicator + points breakdown
- Points: Nawafil prayer logging now awards points (Tahajjud = 100 pts, Witr = 50 pts, etc.)

Append to KareTech-Vault/Memory/Sessions/2026-02-22-masjidconnect-v1.9-sprint.md:
## Sprint 7 — Nawafil + All Coming Soon
- Sunnah Mu'akkadah tracker: all 5 confirmed sunnah prayers + Witr (Wajib)
- Nawafil tracker: Tahajjud, Duha, Ishraq, Awwabeen, Tarawih with rakat logging
- lib/prayer-types.ts: comprehensive Islamic prayer data with hadith rewards
- Buddy: 5 new nawafil challenge templates, new nudge messages
- Education: "All Islamic Prayers" page in Madrasa
- 3rd tab "Nawafil" added to Learn to Pray page
- All Coming Soon features now active (99 Names linked, Prophets linked)
- Daily sunnah score dots indicator in Tracker

=== CONSTRAINTS ===
- PERMANENTLY DARK: bg-[#0a0b14], bg-gray-900, border-gray-800
- NEVER bg-white/gray-50/gray-100
- Arabic text always uses font-arabic className
- All new pages: showBack on PageHero, BottomNav at bottom, pb-nav on root div
- Islamic accuracy: all rakat counts, categories (Fard/Wajib/Sunnah Mu'akkadah/Nafl) and hadith must be correct
- Witr: always note it is Wajib per Hanafi school, Sunnah per others — don't call it "optional"
- Tahajjud: last third of night (not just any night prayer)
- Duha: after sunrise until before Dhuhr begins (roughly 9:30 AM – 11:30 AM for Georgetown)
