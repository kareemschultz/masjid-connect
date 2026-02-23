# Task: Fix Settings Buttons + Proper Light Theme

## Context
App: MasjidConnect GY — Next.js 15, Tailwind CSS, permanently dark by default.
Repo: /home/karetech/v0-masjid-connect-gy/
Running container: kt-masjidconnect-prod

## PART 1 — Fix Non-Functional Settings Buttons

In `app/settings/page.tsx`, these buttons have `onClick={() => {}}` and do nothing:

### 1a. Quran Font selector
- Currently: `<SettingRow icon={BookOpen} iconColor="bg-violet-600" label="Quran Font" value="Default" onClick={() => {}} />`
- Fix: Open a SelectModal with these options:
  - Default (uses app default Geist/system Arabic)
  - Amiri (className="font-arabic" — already loaded via Google Fonts)
  - IndoPak Nastaliq (className="font-indopak" — Noto Nastaliq Urdu, already loaded)
- Store selection in localStorage using `KEYS.QURAN_FONT` (add this key to `lib/storage.ts` as `'quran_font'`)
- Display the current value in the SettingRow (e.g. "Amiri", "IndoPak", "Default")
- The font preference should be READ by the Quran surah reader (`app/quran/[surah]/page.tsx`) — apply `font-arabic` or `font-indopak` class to the Arabic verse text based on the stored preference. Check existing font class usage in that file.

### 1b. Language selector
- Currently: `<SettingRow icon={Globe} iconColor="bg-teal-600" label="Language" value="English" onClick={() => {}} />`
- Fix: Show a SelectModal with only "English" available, and a note "More languages coming soon"
- No actual functionality needed beyond showing the modal — English is the only option
- The modal should have options: `[{ value: 'en', label: 'English', description: 'More languages coming soon' }]`

---

## PART 2 — Full Light Theme Audit & Fix

### The Problem
The current light theme CSS in `app/globals.css` uses `html[data-theme='light']` overrides but:
1. The hero/header section still shows the dark purple gradient — jarring contrast with white body
2. The top header (greetings, icons) on the home page is hard to read
3. The PageHero component (`components/page-hero.tsx`) hero gradient uses dark colors that don't adapt
4. Overall the half-dark-half-light look is ugly

### What Good Looks Like
In light mode, the app should feel like a clean Islamic app with warm whites:
- **Background**: `#f5f5f0` (warm off-white — already defined)
- **Hero sections**: Should use a LIGHT gradient — e.g. `from-emerald-50 via-teal-50 to-white` instead of the dark purple/indigo/violet gradients
- **Cards**: White with subtle borders
- **Text**: Dark (`#111827`)
- **Accent**: Emerald green stays (looks great on light backgrounds)
- **Bottom nav**: `rgba(245,245,240,0.95)` backdrop — already defined

### What to Change

#### 1. Home page hero (`app/page.tsx`)
The home page has a dark gradient hero at the top:
```
bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-900
```
In light mode this should become a light version. Add to globals.css:
```css
html[data-theme='light'] .from-indigo-950 { --tw-gradient-from: #ecfdf5 !important; }
html[data-theme='light'] .via-purple-950 { --tw-gradient-via: #f0fdf4 !important; }
html[data-theme='light'] .to-violet-900 { --tw-gradient-to: #f5f5f0 !important; }
```

#### 2. PageHero component (`components/page-hero.tsx`)
The PageHero has a gradient: `from-indigo-950 via-purple-950 to-violet-900`
Need to override so in light mode it becomes a soft green/teal gradient.

#### 3. Text on hero in light mode
On the home page header, text like "As-Salamu Alaykum" and "Kareem Schultz" and the icon buttons need to be readable on light backgrounds. Currently they're white text which works on dark but is invisible on white.

In globals.css, the hero text override needs to work. The issue is that `text-white` in light mode was mapped to `#111827` but some hero elements need DIFFERENT treatment because they're on a now-light hero background.

Actually, the BETTER approach is: make text on the hero dark in light mode since hero is now light.

#### 4. Blobs and decorative elements
The purple/indigo blur blobs in the hero:
```
bg-purple-500/15, bg-indigo-500/20
```
In light mode these should be emerald-tinted:
```css
html[data-theme='light'] .bg-purple-500\/15 { background-color: rgba(16,185,129,0.08) !important; }
html[data-theme='light'] .bg-indigo-500\/20 { background-color: rgba(16,185,129,0.10) !important; }
```

#### 5. Hero animation SVG
The `<HeroAnimation>` component draws SVGs. In light mode, the crescent and stars are light-colored (white/yellow) — they'll be invisible on a light background.
Add light mode styles to the hero animation SVG in `components/hero-animations.tsx`:
- The SVG `<style>` block in hero-animations doesn't react to `data-theme`. 
- Simplest fix: in `components/hero-animations.tsx`, make the component read the current theme from localStorage/DOM and apply different opacity/colors. Or just add:
```css
html[data-theme='light'] .hero-animation-svg circle { opacity: 0.15 !important; }
html[data-theme='light'] .hero-animation-svg path { opacity: 0.15 !important; }
```
Add `className="hero-animation-svg"` to the `<svg>` in hero-animations.tsx if it doesn't have one.

#### 6. Ramadan card on home page
There's a `bg-gradient-to-r from-indigo-900/80 to-purple-900/80` Ramadan mode card. In light mode:
```css
html[data-theme='light'] .from-indigo-900\/80 { --tw-gradient-from: rgba(236,253,245,0.9) !important; }
html[data-theme='light'] .to-purple-900\/80 { --tw-gradient-to: rgba(240,253,244,0.9) !important; }
```
And make text dark in that card too.

#### 7. Glass morphism on home page header icons
The icon buttons at the top (Explore, Profile, Settings) use `.glass` class. In light mode, `.glass` is already handled. But verify the icons inside are visible.

#### 8. Prayer countdown card
The `glass-emerald` card already handles light mode. Verify it looks clean.

#### 9. Prayer time strip (the horizontal scroll strip with Fajr/Dhuhr/etc)
These should use white cards with emerald accent in light mode — check if CSS handles this.

#### 10. Bottom section (Hadith card, Quick Actions, Checklist)
These look good in the screenshot already. Keep as is.

#### 11. PageHero on sub-pages (Explore, Quran, Tracker, etc)
`components/page-hero.tsx` has a gradient hero. Check what classes it uses and override them in globals.css for light mode. Sub-page heroes should use a soft emerald/teal light gradient, not a dark purple one.

### Testing Approach
After changes, check these pages in light mode look cohesive:
- Home page (most complex)
- Settings page  
- Explore page
- Any page with PageHero

---

## Implementation Order
1. Fix Quran Font selector (Part 1a) — update storage.ts, settings/page.tsx, quran/[surah]/page.tsx
2. Fix Language selector (Part 1b) — update settings/page.tsx
3. Audit and fix light theme CSS in globals.css (Part 2)
4. Fix PageHero for light mode (components/page-hero.tsx if needed)

## After Making Changes
Run the rebuild command:
```bash
cd /home/karetech/v0-masjid-connect-gy
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . -q
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
docker run -d --name kt-masjidconnect-prod --restart always \
  --network pangolin --ip 172.20.0.24 \
  --dns 8.8.8.8 --dns 1.1.1.1 \
  --env-file .env.local \
  ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
docker network connect kt-net-apps kt-masjidconnect-prod
docker network connect kt-net-databases kt-masjidconnect-prod
```

Then bump the service worker cache version in `public/sw.js`:
- Change `masjidconnect-v2` → `masjidconnect-v3`

Then notify:
openclaw system event --text "Done: Fixed Quran Font + Language settings buttons, full light theme audit and fixes deployed to masjidconnectgy.com" --mode now
