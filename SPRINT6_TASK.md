You are working on MasjidConnect GY — a Next.js 16 Islamic community PWA for Guyana.
Repo: /home/karetech/v0-masjid-connect-gy/
Permanently dark: bg-[#0a0b14] base, bg-gray-900 cards, border-gray-800.

After ALL tasks, rebuild & redeploy:
  cd /home/karetech/v0-masjid-connect-gy
  docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .
  docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
  docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
  docker network connect kt-net-apps kt-masjidconnect-prod
  docker network connect kt-net-databases kt-masjidconnect-prod
  git add -A && git commit -m "fix: prayer timer stale closure, Google Sign-In on name step, onboarding refresh" && git push origin main

=== BUG 1: PRAYER TIMER SHOWS 00:00:00 ===

File: app/page.tsx

ROOT CAUSE: Stale closure. The countdown useEffect creates the setInterval once on mount,
but the `prayers` array captured in the closure is the initial empty array []. Even when
`prayers` state updates (after loadPrayerTimes() runs), the interval still sees the empty array.

FIX: Use a ref for prayers so the interval always reads the latest value:

At the top of the component add:
  const prayersRef = useRef<typeof prayers>([])

In the loadPrayerTimes callback or wherever prayers state is set, also update the ref:
  prayersRef.current = computedPrayers  // whenever setPrayers is called

In the countdown useEffect, replace `prayers.find(...)` with `prayersRef.current.find(...)`:
  const timer = setInterval(() => {
    const now = new Date()
    const next = prayersRef.current.find((p) => p.date > now)
    if (next) {
      setCountdown(getTimeUntil(next.date))
      setNextPrayerName(next.name)
    }
    const maghrib = prayersRef.current.find((p) => p.name === 'Maghrib')
    ...
  }, 1000)

ALSO: Add an immediate trigger after prayersRef is set (don't wait 1 second):
  After setting prayersRef.current, call:
  const now = new Date()
  const next = prayersRef.current.find((p) => p.date > now)
  if (next) {
    setCountdown(getTimeUntil(next.date))
    setNextPrayerName(next.name)
  }

ALSO: Fix the "next prayer" logic. If the last prayer of the day (Isha) has already passed,
show "Fajr" as the next prayer (tomorrow's Fajr) with the hours until it. Currently it shows
00:00:00 because nextPrayer is undefined after Isha. Handle this case:
  const next = prayersRef.current.find((p) => p.date > now)
  if (next) {
    setCountdown(getTimeUntil(next.date))
    setNextPrayerName(next.name)
  } else {
    // Past Isha — next prayer is Fajr tomorrow
    // Show approximate time until Fajr (roughly 9 hours from Isha)
    setNextPrayerName('Fajr')
    // Calculate: tomorrow's Fajr ≈ today's Fajr time + 24 hours
    const fajr = prayersRef.current.find((p) => p.name === 'Fajr')
    if (fajr) {
      const tomorrowFajr = new Date(fajr.date.getTime() + 24 * 60 * 60 * 1000)
      setCountdown(getTimeUntil(tomorrowFajr))
    }
  }

=== BUG 2: GOOGLE SIGN-IN ON NAME STEP ===

File: components/onboarding-wizard.tsx

Master Kareem wants the "What should we call you?" step to offer Google Sign-In
as an alternative to typing a name. Add this BELOW the name input and skip button:

After the skip button and before the data note paragraph, insert:

  <div className="mt-6 w-full max-w-xs">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-gray-800" />
      <span className="text-xs text-gray-600">or</span>
      <div className="h-px flex-1 bg-gray-800" />
    </div>
    <button
      onClick={handleGoogleSignIn}
      disabled={signingIn}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-700 bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition-all active:bg-gray-800 disabled:opacity-50"
    >
      {signingIn ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
      ) : (
        <GoogleIcon />
      )}
      {signingIn ? 'Redirecting to Google...' : 'Continue with Google'}
    </button>
    <p className="mt-2 text-center text-[10px] text-gray-600">
      Sign in to sync your tracker and streaks across devices
    </p>
  </div>

ALSO: Update the callbackURL to ensure after Google auth, the user lands cleanly.
Change:
  await signIn.social({ provider: 'google', callbackURL: '/' })
To:
  await signIn.social({ provider: 'google', callbackURL: '/?auth_complete=1' })

AND in app/page.tsx, detect auth_complete in the URL to skip onboarding:
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth_complete') === '1') {
      setItem(KEYS.ONBOARDING_COMPLETE, true)
      setShowOnboarding(false)
      // Clean up URL
      window.history.replaceState({}, '', '/')
    }
  }, [])

=== TASK 3: ONBOARDING WIZARD CONTENT REFRESH ===

File: components/onboarding-wizard.tsx

The onboarding was written before many new features were added. Update the welcome step and
the done step to reflect the current app:

A) Welcome step (step 0 / 'welcome') — update the feature highlights:
   Currently shows 3-4 features. Update to 6 features with icons:
   - 🕌 Prayer Times — Accurate times for Georgetown, Guyana
   - 📖 Quran — Mus'haf, recitation with 12 reciters, Hifz mode
   - 🌙 Ramadan — Suhoor/Iftaar countdowns, Fasting Tracker
   - 🎧 Lectures — Anwar al-Awlaki, Hamza Yusuf, Bilal Philips, Yasmin Mogahed
   - 🕌 Masjids — 20+ masjids across Guyana, Jumu'ah prep
   - 📿 Community — Dua Board, Khatam Collective, Buddy System

B) Done step — update the completion text:
   Change:
     "May your journey with MasjidConnect GY be full of barakah. This app is yours — built with love for the community."
   To:
     "MasjidConnect GY has prayer times, Quran, lectures from 5 scholars, 20+ Guyana masjids, Seerah, Islamic Names, and more — all built for the Guyanese Muslim community. May Allah accept it from us all."

C) Done step — add a brief feature preview below the Google sign-in card, before the completion CTA:
   Show 4 quick-access chips linking to key sections:
   <div className="grid grid-cols-2 gap-2 mb-4">
     {[
       { label: '🎧 Lectures', href: '/explore/lectures' },
       { label: '📖 Quran', href: '/quran' },
       { label: '🕌 Masjids', href: '/masjids' },
       { label: '🤲 Duas', href: '/explore/duas' },
     ].map(item => (
       <button key={item.href} onClick={() => { finish(); router.push(item.href) }}
         className="rounded-xl border border-gray-800 bg-gray-900/60 py-2.5 text-xs font-medium text-gray-300 active:bg-gray-800">
         {item.label}
       </button>
     ))}
   </div>
   <p className="text-center text-[10px] text-gray-600 mb-3">Jump straight to what matters</p>

=== TASK 4: ROADMAP ITEMS — CONTINUE IMPLEMENTATION ===

Implement the following from ROADMAP.md:

A) QURAN VERSE SHARER (app/quran/mushaf/page.tsx):
   Add a "Share Verse" button that appears when a user taps any verse in the Mus'haf view.
   
   When tapped:
   1. Show a bottom sheet with:
      - The Arabic verse (large, Amiri font)
      - English translation (from cached data or a short hardcoded set for common verses)
      - Surah name + verse number
      - "Share" button that calls navigator.share() with text:
        "[Arabic text]\n\n\"[Translation]\"\n— Quran [Surah:Verse]\n\nvia MasjidConnect GY"
      - "Copy" button that copies the same text to clipboard
      - "WhatsApp" button: opens `whatsapp://send?text=...`
   
   Style: dark glass bottom sheet, same pattern as SelectModal

B) KHATAM PERSONAL TRACKER (new section in app/tracker/page.tsx):
   Add a "Personal Khatam" section in the tracker (after the existing sections):
   - Shows a visual grid of all 30 Juz (6x5 grid of small circles)
   - Each Juz circle: tappable — turns green when tapped (marked complete)
   - Shows "X/30 Juz complete" progress text
   - Saves to localStorage: 'khatam_personal_progress' as boolean[] of length 30
   - "Reset" button to start a new Khatam (with confirmation)
   - Header: "📖 Personal Khatam" with info text "Track your Quran completion"

C) STORIES OF PROPHETS — FULL CONTENT (app/explore/madrasa/prophets/page.tsx):
   Create a new page with stories of the 25 Quranic prophets.
   
   Title: "Stories of the Prophets", subtitle: "Al-Anbiya' alayhim as-salam"
   showBack + BottomNav + pb-nav
   
   Create lib/prophets-data.ts with data for all 25 prophets:
   
   interface ProphetStory {
     name: string           // English name
     arabicName: string     // Arabic
     title?: string         // e.g. "Kalimullah" (The one who spoke to Allah)
     quranMentions: number  // How many times mentioned in Quran
     era: string            // e.g. "Pre-Ibrahim" / "Between Ibrahim & Musa" etc.
     summary: string        // 3-4 sentences of the key story
     lesson: string         // Key lesson from their story
     keyVerse: string       // One relevant Quran verse reference (e.g. "21:87")
     icon: string           // Emoji
   }
   
   Include all 25 prophets: Adam, Idris, Nuh, Hud, Salih, Ibrahim, Lut, Ismail, Ishaq,
   Yaqub, Yusuf, Ayyub, Shuayb, Musa, Harun, Dhul-Kifl, Dawud, Sulayman, Ilyas, Alyasa,
   Yunus, Zakariyya, Yahya, Isa, Muhammad ﷺ
   
   Page: searchable list of prophet cards, each expandable to show full summary + lesson.
   Sort by chronological order (as listed above).
   Muhammad ﷺ card links to: /explore/madrasa/seerah (already built)
   
   Add card to Madrasa hub (app/explore/madrasa/page.tsx) — "Stories of Prophets" replacing
   the existing "Coming Soon" card, link to /explore/madrasa/prophets

D) ARABIC TYPING PRACTICE (app/explore/madrasa/arabic-typing/page.tsx):
   A simple interactive Arabic letter practice tool.
   
   Title: "Arabic Practice", subtitle: "Learn to write Arabic letters"
   
   Show Arabic letters one at a time (from the Noorani Qaida data: lib/qaida-data.ts)
   User taps letters on a simple on-screen Arabic keyboard (not the device keyboard)
   to spell the displayed letter/word.
   
   Simple keyboard: 28 Arabic letters in a grid, dark glass keys
   Display area: Shows what the user has typed so far (RTL)
   Target: The letter to type (large, gold)
   If correct: green flash, success sound (use a short beep), advance to next
   If wrong: red flash, stay on same letter
   
   Modes:
   - Letters only: practice single letters (alphabet mode)
   - Simple words: practice 10 common Arabic words (الله، الرحمن، بسم، الله، محمد, etc.)
   
   Progress: tracks accuracy % for the session. No persistence needed (just session score).
   
   Add card to Madrasa hub: "Arabic Practice" — links to /explore/madrasa/arabic-typing

=== TASK 5: UPDATE EXPLORE SECTIONS ===

In app/explore/page.tsx, add the new items to their appropriate sections:
- "Stories of Prophets" → Quran & Learning section (if not already there)
- "Arabic Practice" → Quran & Learning section (if not already there)  
- "Islamic Names" → Tools section (if not already there)
- "Jumu'ah" → Prayer & Practice section (if not already there)

=== TASK 6: CHANGELOG + SESSION LOG ===

Append to CHANGELOG.md:
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

Append to KareTech-Vault/Memory/Sessions/2026-02-22-masjidconnect-v1.9-sprint.md:
## Sprint 6 — Bug Fixes + Roadmap
- Fixed prayer timer stale closure (00:00:00 bug)
- Fixed post-Isha timer shows tomorrow's Fajr countdown
- Google Sign-In added to name step in onboarding
- Onboarding feature list refreshed (6 features, accurate to current app)
- Quran verse sharer (bottom sheet, WhatsApp/copy/share)
- Personal Khatam tracker (30-Juz grid, tap to mark complete)
- Stories of 25 Prophets — full content with lib/prophets-data.ts
- Arabic typing practice tool in Madrasa
