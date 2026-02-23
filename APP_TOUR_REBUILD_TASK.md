# App Tour Rebuild — Cross-Page Guided Walkthrough

## Problem
The current app tour (`components/app-tour.tsx`) only highlights elements on the **home page**. Steps describing other pages (Quran, Tracker, Masjids, Explore, Madrasa, Lectures, Community) just show a center card and *describe* those sections — but never navigate there. Users cannot figure out where features are located.

**Real user complaint:** "I can't find the Quran in the app."

## Solution
Rebuild the tour to actually **navigate** to each page, add `data-tour` attributes to key elements on destination pages, then spotlight those elements with the existing spotlight mechanism. When the tour ends, navigate back to `/`.

---

## Part 1 — Add `data-tour` attributes to destination pages

Add these attributes to the specified elements (do not change layout/styling, just add the HTML attribute):

### `/app/quran/page.tsx`
- Add `data-tour="quran-surah-list"` to the main scrollable surah list container (the div/ul wrapping all surah cards)

### `/app/tracker/page.tsx`
- Add `data-tour="tracker-prayer-buttons"` to the container/section holding the 5 daily prayer log buttons (Fajr/Dhuhr/Asr/Maghrib/Isha)

### `/app/masjids/page.tsx` (or wherever the masjid list renders)
- Add `data-tour="masjid-list"` to the list container of masjid cards

### `/app/explore/page.tsx`
- Add `data-tour="explore-grid"` to the main grid of explore section cards

### `/app/explore/duas/page.tsx`
- Add `data-tour="duas-categories"` to the grid/list of dua category cards

### `/app/explore/fiqh/page.tsx`
- Add `data-tour="fiqh-chapters"` to the container of chapter accordion/cards

### `/app/explore/lectures/page.tsx`
- Add `data-tour="lectures-scholars"` to the scholar filter pills/tabs row

### `/app/explore/community/page.tsx`
- Add `data-tour="community-features"` to the container of community feature cards (Feed, Dua Board, Khatam, etc.)

### `/app/explore/madrasa/page.tsx`
- Add `data-tour="madrasa-cards"` to the grid of madrasa topic cards

---

## Part 2 — Rebuild `components/app-tour.tsx`

### New TourStep interface
Add a `route?: string` field:
```typescript
interface TourStep {
  target: string | null          // data-tour selector, null = center card
  route?: string                 // navigate to this route before spotlighting (default: stay on current page)
  emoji: string
  title: string
  description: string
  hint?: string
  tooltipSide?: 'above' | 'below' | 'center'
}
```

### Navigation logic
At the top of the component, add:
```typescript
import { useRouter, usePathname } from 'next/navigation'
```

In `updateSpot`, BEFORE scrollIntoView, check if `step.route` is set and if the current pathname differs:
```typescript
const updateSpot = useCallback(async (target: string | null, route?: string) => {
  setVisible(false)
  if (route && pathname !== route) {
    router.push(route)
    // Wait for page load before trying to find elements
    await new Promise(resolve => setTimeout(resolve, 900))
  }
  // ... rest of existing logic
}, [pathname, router])
```

Also update the `useEffect` to pass `step.route`:
```typescript
useEffect(() => {
  updateSpot(step.target, step.route)
}, [stepIdx, step.target, step.route, updateSpot])
```

When the tour completes or is skipped, navigate back to home:
```typescript
const handleComplete = useCallback(() => {
  router.push('/')
  onComplete()
}, [router, onComplete])
```
Replace all `onComplete()` calls with `handleComplete()`.

### New STEPS array
Replace the existing STEPS with these 14 steps:

```typescript
const STEPS: TourStep[] = [
  {
    target: null,
    emoji: '🕌',
    title: 'Welcome to MasjidConnect GY',
    description: "Your complete Islamic companion for the Guyanese Muslim community. Let's take a quick tour — I'll show you exactly where everything is.",
    tooltipSide: 'center',
  },
  {
    target: '[data-tour="prayer-countdown"]',
    route: '/',
    emoji: '⏱️',
    title: 'Live Prayer Countdown',
    description: 'Always know exactly how long until the next salah. Prayer times auto-calculate for Georgetown using your chosen method.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="quran-surah-list"]',
    route: '/quran',
    emoji: '📖',
    title: 'Full Quran Reader',
    description: 'All 114 surahs with audio recitation, 4 English translations, and Ibn Kathir tafsir per verse. Switch between Uthmani and IndoPak script, or enable tajweed colour coding.',
    hint: 'Tap the Mushaf button at the top for the full 604-page Arabic Mushaf.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="tracker-prayer-buttons"]',
    route: '/tracker',
    emoji: '✅',
    title: 'Ibadah Tracker',
    description: 'Log all 5 daily prayers, Sunnah, Witr, Tahajjud, fasting days, Quran pages, and missed Qada prayers. Build streaks and earn points toward your level.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="masjid-list"]',
    route: '/masjids',
    emoji: '📍',
    title: 'Masjid Directory',
    description: 'Find all 31 masjids across Guyana — prayer times, contact info, Imam details, and directions. Tap any masjid to see full details.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="explore-grid"]',
    route: '/explore',
    emoji: '🧭',
    title: 'Explore — Everything in One Place',
    description: 'This is the heart of the app. Every Islamic tool and resource is organised here — tap any card to go directly to that section.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="duas-categories"]',
    route: '/explore/duas',
    emoji: '🤲',
    title: 'Duas — 80+ in 21 Categories',
    description: 'Authentic duas for every moment of your day — waking up, meals, travel, protection, after salah, and more. All with Arabic, transliteration, and translation.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="fiqh-chapters"]',
    route: '/explore/fiqh',
    emoji: '📚',
    title: 'Fiqh Hub — Hanafi Rulings',
    description: '105+ topics across 14 chapters of Hanafi fiqh — Taharah, Salah, Sawm, Zakah, and more. Includes rulings, examples, and local fatawa from Jami\'yyatul Ulamaa.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="lectures-scholars"]',
    route: '/explore/lectures',
    emoji: '🎙️',
    title: '235+ Islamic Lectures',
    description: 'Full audio lecture series from Imam Anwar al-Awlaki, Shaykh Hamza Yusuf, Dr. Bilal Philips, Ustadha Yasmin Mogahed, Dr. Omar Suleiman, and more — all free.',
    hint: 'Filter by scholar using the buttons above, or browse all series.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="community-features"]',
    route: '/explore/community',
    emoji: '👥',
    title: 'Community',
    description: 'Post to the Feed, share duas on the Dua Board, join the Khatam Collective to complete the Quran together, and add Faith Buddies to keep each other accountable.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="madrasa-cards"]',
    route: '/explore/madrasa',
    emoji: '🎓',
    title: 'Madrasa — Learn Islam',
    description: 'Noorani Qaida, How to Pray step-by-step, Stories of the Prophets, Seerah of the Prophet ﷺ, Islamic Adab, and the full GII Islamic Library.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="quick-actions"]',
    route: '/',
    emoji: '⚡',
    title: 'Quick Actions',
    description: 'Jump to any section in one tap — Fiqh Hub, Duas, Lectures, Community, Tasbih counter, Qibla compass, Zakat calculator, and more.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="checklist"]',
    route: '/',
    emoji: '☑️',
    title: 'Daily Ibadah Checklist',
    description: 'Tick off your daily goals — Fajr prayed, Quran read, Dua made, Charity given, Dhikr done, Sunnah prayers. Each tick earns points toward your level.',
    tooltipSide: 'above',
  },
  {
    target: null,
    emoji: '🤲',
    title: "You're All Set — Bismillah!",
    description: 'بارك الله فيك — May Allah accept your worship and make this app a source of benefit for you and the Guyanese Muslim community. Ameen.',
    tooltipSide: 'center',
  },
]
```

### Important implementation notes
- The `updateSpot` function must be made `async` and `await` the navigation delay before proceeding to `scrollIntoView` + `getSpotRect`
- If the element is not found after navigation (target not on that page), fall back gracefully to a center card (same as `target: null` behavior) — do not crash
- The overlay and spotlight visuals remain identical to the existing implementation
- The `z-[220]` z-index stays the same
- Progress dots stay the same
- Keep the `hint` rendering logic

---

## Part 3 — Build and Deploy

After completing all edits:

```bash
cd /home/karetech/v0-masjid-connect-gy
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . -q && \
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod && \
docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest && \
docker network connect kt-net-apps kt-masjidconnect-prod && \
docker network connect kt-net-databases kt-masjidconnect-prod
```

Verify it's running:
```bash
docker ps | grep kt-masjidconnect-prod
curl -s -o /dev/null -w "%{http_code}" https://masjidconnectgy.com
```

When completely finished, run:
openclaw system event --text "Done: App tour rebuilt as cross-page guided walkthrough — navigates to Quran, Tracker, Masjids, Explore, Duas, Fiqh, Lectures, Community, Madrasa with element spotlighting on each page" --mode now
