You are working on MasjidConnect GY — a Next.js 16 Islamic community app.
Repo: /home/karetech/v0-masjid-connect-gy/
App is permanently dark — base bg is bg-[#0a0b14], cards use bg-gray-900 border-gray-800.
NEVER add light mode classes or dark: prefixes.

After ALL changes, rebuild & redeploy with:
  cd /home/karetech/v0-masjid-connect-gy
  docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . && docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod && docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest && docker network connect kt-net-apps kt-masjidconnect-prod && docker network connect kt-net-databases kt-masjidconnect-prod
Then: git add -A && git commit -m "feat: major sprint — Qaida, tracker expansion, community features, UX improvements"
Then: git push origin main

=== TASK 1: MADRASA — RESTORE NOORANI QAIDA ===

The v2 Madrasa page (app/explore/madrasa/page.tsx) is a placeholder. The v1 app had 
full Noorani Qaida data in /home/karetech/georgetown-iftaar/src/data/qaidaData.js (480 lines).

A) Copy this data file to /home/karetech/v0-masjid-connect-gy/lib/qaida-data.ts
   Convert it to TypeScript. Keep all lesson content exactly as-is.

B) Redesign app/explore/madrasa/page.tsx to show a proper hub:
   - Top card: "Noorani Qaida" with Arabic label "القاعدة النورانية" — teal accent — links to /explore/madrasa/qaida
   - Below: the 5 learning modules already there (Five Pillars, Articles of Faith, etc.) — mark them "Coming Soon" with a lock icon
   - Card for "Learn to Pray" — links to /explore/madrasa/salah (create placeholder page later)

C) Create app/explore/madrasa/qaida/page.tsx — interactive Noorani Qaida:
   - PageHero with showBack, title "Noorani Qaida", subtitle "Arabic Alphabet & Tajweed"
   - Lesson list: each lesson is a card with lesson number, icon, Arabic title, English title, description, lesson count pill
   - Tapping a lesson opens a bottom-sheet detail panel (or expands inline) showing:
     * For alphabet lessons: show Arabic letters in a grid. Each letter shows: large Arabic char (Amiri font, text-4xl), transliteration below, name in English, makhraj (pronunciation point). Tap letter to see letter forms (initial/medial/final).
     * For tajweed lessons: show the rule name, description, and examples.
   - Progress tracking: remember which lessons are "started" (localStorage key 'qaida_progress')
   - Show a progress bar at top (X of 12 lessons started)
   - Bottom nav visible

=== TASK 2: PRAYER SETTINGS ONBOARDING — SIMPLIFY FOR NEW MUSLIMS ===

In components/onboarding-wizard.tsx, Step 4 is "Prayer Settings" (step index 3).

Issues to fix:
A) The section label "MADHAB (ASR CALCULATION)" is confusing for new Muslims. 
   Replace with: "Asr Prayer Time"
   Add a helper text below: "Different communities pray Asr at slightly different times. Choose what your local masjid follows."
   
B) The two Madhab buttons say "Shafi'i / Hanbali / Maliki" and "Hanafi".
   Keep the technical names but add a subtitle:
   - Shafi'i / Hanbali / Maliki → subtitle "Standard Asr (earlier)"
   - Hanafi → subtitle "Later Asr"

C) Moon sighting step (Step 5): CIOG and "Central Moon Sighting Committee" are the SAME organization in Guyana.
   Update the options:
   - "CIOG / Local Sighting" → label "CIOG / Central Sighting Committee" with subtitle "Follows the Guyanese moon sighting (CIOG & Central Moon Sighting Committee)"
   - "Saudi / Global Sighting" → label "Saudi / International Sighting" with subtitle "Follows Saudi Arabia's official moon sighting announcement"
   Add a helpful note: "Both CIOG and the Central Moon Sighting Committee typically announce the same date for Guyana."

D) The Calculation Method section (Muslim World League, Egyptian General Authority, etc.) — add 1-2 sentences explaining: "These affect only Fajr and Isha times. For most of Guyana, Egyptian General Authority or Muslim World League work well."

=== TASK 3: FEEDBACK PAGE — ADD MASJID REQUESTS ===

Update app/feedback/page.tsx:
A) Add categories: 'Request New Masjid', 'Report Masjid Error', 'Bug Report', 'Feature Request', 'General Feedback', 'Community Suggestion'

B) When "Request New Masjid" is selected, show additional fields:
   - Masjid Name (text input, required)
   - Approximate Location / Area (text input)
   - Contact (optional)

C) When "Report Masjid Error" is selected, show:
   - Which Masjid? (text input — they type the name)  
   - What needs correcting? (textarea)

D) The submit handler currently saves to localStorage. That's fine. But ALSO POST to /api/feedback if it exists (or just keep localStorage — add a TODO comment for backend later).

E) Add a note at top of form: "To request a masjid or report an error, select the appropriate category below."

=== TASK 4: GOOGLE SIGN-IN — ACCESSIBLE FROM SETTINGS & PROFILE ===

Currently Google Sign-in is ONLY in the onboarding wizard. Add it to:

A) app/settings/page.tsx — Add a new section "Account" at the top of settings:
   - If user is signed in (check via useSession from better-auth/react or fetch /api/user/profile): 
     Show avatar, name, email, and a "Sign Out" button
   - If not signed in:
     Show "Sign in with Google to sync your data, streaks, and prayer log across devices."
     Show a Google Sign-In button (same style as onboarding wizard — white button with Google icon)
   
B) app/profile/page.tsx — Check if this page exists and has auth. Add Google sign-in there too if not present.

For the Google sign-in implementation, use the same pattern as onboarding-wizard.tsx:
  import { signIn, signOut, useSession } from '@/lib/auth-client'
  await signIn.social({ provider: 'google', callbackURL: '/' })

=== TASK 5: TRACKER — YEAR-ROUND EXPANSION ===

The tracker currently has:
- /tracker/page.tsx (daily checklist)
- /tracker/fasting/page.tsx (fasting calendar — month view)

Expand to year-round fasting and more tracking:

A) Update app/tracker/page.tsx:
   - Add a "Prayer Tracker" section below the daily checklist
   - For each of the 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha), show a row with:
     * Prayer name + Arabic name
     * A checkmark button (toggle prayed/missed)
     * Persisted in localStorage key 'prayer_log' as { 'YYYY-MM-DD': { fajr: true/false, dhuhr: true/false, ... } }
   - Show a "today's prayers" completion ring (e.g., 3/5 prayed)

B) Update app/tracker/fasting/page.tsx:
   - Add a "Fast Type" selector at top (pill chips):
     * Ramadan (default)
     * 6 of Shawwal
     * Monday & Thursday
     * Ayyam al-Bayd (13/14/15)
     * Voluntary (general)
   - The selected type is remembered in localStorage 'fasting_type'
   - When "Ramadan" is selected — existing behavior (month calendar)
   - When "6 of Shawwal" is selected — show the 6 recommended post-Ramadan fast days to complete (current Shawwal month highlighted, user taps to mark complete, shows progress "X/6 completed")
   - When "Monday & Thursday" is selected — show this week's Mon and Thu, toggle to mark fasted
   - When "Ayyam al-Bayd" — show 13/14/15 of current Hijri month
   - When "Voluntary" — same month calendar but labeled "Voluntary Fast"
   - All fast types use the same { 'YYYY-MM-DD': 'fasted'|'missed'|'intended' } log format (same localStorage key but namespaced: 'fasting_log_ramadan', 'fasting_log_shawwal', etc.)

=== TASK 6: BACKGROUND ANIMATION ON EXPLORE HERO ===

In app/explore/page.tsx, the PageHero has gradient "from-rose-950 to-pink-900".
Looking at screenshot, it already shows a subtle star/geometric pattern.

Add a gentle animated star field to the Explore page hero section:
- Either use a CSS-only animation (keyframe `twinkle`) on small dots
- Or add an absolutely positioned canvas/div behind the hero with 20-30 small dots (white, opacity 0.3-0.6) that gently pulse/twinkle via CSS animation
- The dots should be random positions within the hero area
- Animation: each dot has a different animation-delay (0-3s) and slowly fades in/out over 2-4s

You can also add this to other page heroes if it looks good:
- Home page hero
- Quran page hero

The effect should be SUBTLE — not distracting. Like a night sky.

=== TASK 7: COMMUNITY FEATURES — ALL OF THEM ===

Create a new "Community" section. Add it to the Explore grid page:
- New card in explore grid: "Community" with icon Users2, subtitle "Connect with Muslims in GY", color purple

Then create app/explore/community/page.tsx — Community Hub:
  - PageHero with showBack, title "Community", gradient from-violet-900 to-purple-900
  - Grid of community feature cards linking to sub-pages:
    * Community Dua Board → /explore/community/dua-board
    * Quran Khatam Collective → /explore/community/khatam  
    * Masjid Check-in → /masjids (existing, link to it)
    * Halal Business Directory → /explore/community/halal
    * Community Feed → /explore/community/feed

7A) app/explore/community/dua-board/page.tsx — Community Dua Board:
   - Header: "Community Dua Board" with subtitle "Ask, Share, Say Ameen"
   - Submit a prayer request form: name (optional), dua request (textarea, max 200 chars), anonymous toggle
   - Dua requests list: each card shows:
     * Avatar circle with initials (or "Anonymous")
     * The dua text
     * "آمين" (Ameen) button with count — tap to react
     * Time posted
   - Store in localStorage 'dua_board' for now (comment: TODO: sync to API)
   - Persist Ameen reactions per user (localStorage 'dua_reactions')
   - Pre-populate with 3-4 sample duas so page isn't empty

7B) app/explore/community/khatam/page.tsx — Quran Khatam Collective:
   - Title "Quran Khatam" with subtitle "Complete the Quran Together"
   - Show 30 Juz as a grid of 30 numbered cards
   - Each Juz: number, name (Juz 1 = "Alif Lam Meem", etc.), claimed by X people
   - User can "Claim" a Juz to complete it — their name appears on the card
   - Progress ring at top: X% of Quran claimed for Ramadan khatam
   - Store in localStorage 'khatam_claims' as { juz: userInitials }
   - If user has claimed a juz, show "Complete" button to mark it done
   - Show completion percentage and "Y Juz completed" stats

7C) app/explore/community/halal/page.tsx — Halal Business Directory:
   - Title "Halal Directory", subtitle "Businesses Verified Halal in Guyana"
   - Filter chips: All, Restaurants, Grocery, Meat, Bakery, Other
   - Pre-populate with 6-8 real or representative Georgetown halal businesses:
     * Example: restaurants in Georgetown, halal butchers, etc.
   - Each business card: name, category badge, address, hours (if known), phone
   - Search bar at top
   - "Submit a Business" button → links to /feedback with category pre-set to 'Request Halal Business Listing'
   - Store: hardcoded data + localStorage 'halal_submissions' for user-submitted ones
   - Add a note: "This directory is community-curated. Submit a business to have it reviewed."

7D) app/explore/community/feed/page.tsx — Community Feed:
   - Title "Community Feed", subtitle "What Muslims in GY Are Sharing"
   - Post creation: name (optional), message (textarea, max 300 chars), type (Reminder, Question, Announcement, General)
   - Posts list: each card shows type badge, name, message, time, like button
   - Store in localStorage 'community_feed'
   - Pre-populate with 3-4 sample posts (Islamic reminders, Ramadan announcements)
   - Heart/like reaction button

=== TASK 8: BACK BUTTON — MAP PAGE ===

app/map/page.jsx is missing showBack on its PageHero.
Add showBack to the PageHero in map/page.jsx.

=== TASK 9: DOCUMENTATION & COMMIT ===

A) Update /home/karetech/v0-masjid-connect-gy/CHANGELOG.md:
   Add entry for v1.9.0:
   - Madrasa: Restored full Noorani Qaida (12 lessons, 29 Arabic letters with makhraj)
   - Tracker: Year-round fasting (Shawwal, Mon/Thu, Ayyam al-Bayd) + Prayer tracker
   - Community: Dua Board, Khatam Collective, Halal Directory, Community Feed
   - Onboarding: Simplified Prayer Settings for new Muslims, clearer moon sighting labels
   - Settings: Google Sign-In accessible from settings (not just onboarding)
   - Feedback: Added Request New Masjid and Report Masjid Error categories
   - UX: Back button on map view, animated star field on Explore hero
   
B) Create session log at /home/karetech/KareTech-Vault/Memory/Sessions/2026-02-22-masjidconnect-v1.9-sprint.md
   Brief summary of what was built in this session.

C) After all changes committed:
   git push origin main
   
=== IMPORTANT CONSTRAINTS ===
- All backgrounds: bg-[#0a0b14] for page, bg-gray-900 for cards, border-gray-800
- Never use bg-white, bg-gray-50, bg-gray-100, text-gray-800, text-gray-900 (as text color)
- Text colors: text-[#f9fafb] or text-white for primary, text-gray-400 for secondary, text-gray-500 for muted
- Accent: emerald-400/500/600 for primary actions
- Fonts: Use 'Amiri' for Arabic text (class: font-arabic)
- All new pages must use BottomNav component
- All sub-pages must have showBack on PageHero
- Build target: /home/karetech/v0-masjid-connect-gy (git repo, docker deployable)
- Do NOT modify ~/clawd/ workspace

When all done, run:
openclaw system event --text "Done: MasjidConnect v1.9 sprint complete — Qaida, tracker, community features, UX improvements deployed" --mode now

=== TASK 10: LEARN TO PRAY — HOW TO PERFORM SALAH ===

Add a "Learn to Pray" feature under Madrasa. This should cover Wudu AND full Salah step-by-step.

A) Update app/explore/madrasa/page.tsx:
   - The "Learn to Pray" card already links to /explore/madrasa/salah
   - Make sure this card is prominent, with icon HandHeart or BookOpen, green/emerald accent

B) Create app/explore/madrasa/salah/page.tsx — "How to Pray" guide:
   - PageHero: title "How to Pray", subtitle "Step-by-Step Salah Guide", showBack
   - Two main sections, each as a collapsible or tabbed card:

   SECTION 1 — WUDU (Ablution):
   Show 7 steps with step number, Arabic text, and English description:
   1. Niyyah (intention) — "Bismillah" — In your heart, make intention for wudu
   2. Wash hands 3x — "Wash both hands up to the wrists"
   3. Rinse mouth 3x — "Take water into mouth, swirl, spit out"
   4. Rinse nose 3x — "Sniff water into nostrils, blow out"
   5. Wash face 3x — "From hairline to chin, ear to ear"
   6. Wash arms to elbows 3x — Right arm first, then left
   7. Wipe head once — "Pass wet hands over head once"
   8. Wash feet to ankles 3x — Right foot first, then left
   
   For each step: use an SVG icon (simple line-art style) or a large emoji that represents the action.
   Use these emojis as fallbacks: 🤲, 💧, 👄, 👃, 😊, 💪, 🙏, 🦶

   SECTION 2 — SALAH (Prayer) Steps:
   Show the complete steps of a 2-rakat prayer. For each step, show:
   - Position name in English + Arabic (e.g., "Qiyam — القيام")
   - What to do (short description)
   - What to say (Arabic text in Amiri font + transliteration + English meaning)
   - An icon representing the position (use SVG line-art or descriptive emoji as placeholder)
   
   The positions (use appropriate simple icons):
   🕌 1. Niyyah — "Make intention in your heart for the prayer (e.g., 2 rakats Fajr)"
   🙌 2. Takbiratul Ihram — الله أكبر — "Allahu Akbar" (raise hands to earlobes, fold on chest)
   📖 3. Qiyam (Standing) — recite Surah al-Fatiha + short surah. Show Al-Fatiha in Arabic + English
   🙇 4. Ruku (Bowing) — سبحان ربي العظيم — "Subhana Rabbiyal Adheem" × 3
   🧍 5. I'tidal (Rising) — سمع الله لمن حمده — "Sami'Allahu liman hamidah" then "Rabbana lakal hamd"
   🛐 6. First Sujood (Prostration) — سبحان ربي الأعلى — "Subhana Rabbiyal A'la" × 3
      (forehead, nose, both palms, both knees, toes touching ground — 7 body parts)
   🪑 7. Sitting between Sujoods — رب اغفر لي — "Rabbighfirli"
   🛐 8. Second Sujood — same as first
   
   After 2nd rakat: Tashahhud (sitting) — show full Arabic text of At-Tahiyyat in Amiri font + transliteration
   Then: Salawat Ibrahimiyyah (Allahumma salli 'ala Muhammad...)
   Then: Salam to right "As-salamu alaykum wa rahmatullah", then left
   
   Make each step expandable — tapping opens the full Arabic + transliteration + meaning.
   Progress tracker: "Steps viewed: X/8" shown at top.
   
   Show a reminder note at bottom: "This is for a 2-rakat prayer (like Fajr or Sunnah).
   For 3-rakat (Maghrib) or 4-rakat (Dhuhr, Asr, Isha), additional rakats are added after step 8 
   before the Tashahhud."

C) Use SVG icons for prayer positions (Qiyam, Ruku, Sujood, Sitting):
   Create simple inline SVGs in the component. Style: white/gray lines, dark background, stick-figure style.
   Approximate each posture:
   - Qiyam: standing figure with hands folded on chest
   - Ruku: bent-at-90-degrees figure, hands on knees
   - Sujood: prostrating figure, forehead on ground
   - Sitting: sitting cross-legged figure

   These SVGs don't need to be perfect — simple geometric stick figures are fine, just evocative enough to show the posture.
