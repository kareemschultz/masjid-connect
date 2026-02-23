# Buddy System Upgrade + Onboarding Update

## Overview
Three areas to fix and upgrade:
1. Fix the broken/inconsistent buddy system (wrong tiers, wrong points, challenges not connected to real data)
2. Upgrade challenges to auto-compute progress from real tracker data
3. Update onboarding wizard FEATURES to reflect current app

---

## ISSUE 1: Level system is inconsistent everywhere

`lib/points.ts` exports 5 LEVELS:
```
Champion: 4000+
Illuminated: 2500+
Steadfast: 1000+
Devoted: 300+
Seeker: 0+
```

But `buddy/page.tsx` uses its own local `getTier()` that returns only bronze/silver/gold with wrong thresholds.
And `how-it-works/page.tsx` TIERS array shows Bronze 0-199 / Silver 200-399 / Gold 400+ which is completely wrong.

**Fix:** Import `getLevel, LEVELS` from `@/lib/points` everywhere. Replace all `getTier()` usage in buddy/page.tsx with `getLevel()`.

---

## ISSUE 2: Points breakdown in how-it-works is wrong

The current `POINT_SYSTEM` array shows made-up values. Actual values from `lib/points.ts` and `lib/prayer-types.ts`:

**Daily tracking points (lib/points.ts):**
- Each Fard prayer: 5 pts (+ 5 pts if prayed in jamaah = 10 pts each)
- All 5 Fard prayers: base 25 pts + up to 25 jamaah bonus
- Fasting a day: 50 pts (Ramadan) or 25 pts (voluntary)
- Visiting masjid: 40 pts
- Daily adhkar (per 10 count): 10 pts, up to 100 pts max
- Reading a surah: 10 pts each, up to 100 pts max
- **Perfect Day bonus**: +50 pts (all 5 checklist items: prayer + quran + dhikr + fasting + masjid)

**Streak multipliers:**
- 3+ consecutive active days: × 1.2
- 7+ days: × 1.5
- 14+ days: × 1.8
- 21+ days: × 2.0
(Multiplier applies to the base score before adding perfect bonus)

**Sunnah prayer points (lib/prayer-types.ts PRAYER_POINTS):**
- Fajr Sunnah (2 rak'ah): 30 pts
- Dhuhr Sunnah before (4): 20 pts
- Dhuhr Sunnah after (2): 20 pts
- Maghrib Sunnah (2): 20 pts
- Isha Sunnah (2): 20 pts
- Witr (3, Wajib per Hanafi): 50 pts

**Nawafil points:**
- Tahajjud: 100 pts
- Tarawih: 60 pts
- Duha: 50 pts
- Ishraq: 40 pts
- Awwabeen: 30 pts

---

## CHANGES REQUIRED

### FILE 1: `app/explore/buddy/how-it-works/page.tsx`

**Complete rewrite of the data sections** (keep JSX structure, just fix data):

**Replace POINT_SYSTEM with accurate values organized into sections:**
```ts
const DAILY_POINTS = [
  { action: 'Each Fard prayer', points: 5, bonus: '+5 in jamaah', icon: HandHeart, color: 'text-emerald-400' },
  { action: 'Fast a day (Ramadan)', points: 50, icon: Moon, color: 'text-amber-400' },
  { action: 'Fast a voluntary day', points: 25, icon: Moon, color: 'text-amber-400' },
  { action: 'Visit the masjid', points: 40, icon: Sparkles, color: 'text-teal-400' },
  { action: 'Daily adhkar (per 10)', points: 10, bonus: 'up to 100', icon: Sparkles, color: 'text-cyan-400' },
  { action: 'Read a surah', points: 10, bonus: 'up to 100', icon: BookOpen, color: 'text-purple-400' },
  { action: 'Perfect Day (all 5 items)', points: '+50 bonus', icon: ShieldCheck, color: 'text-emerald-400' },
]

const SUNNAH_POINTS = [
  { label: 'Fajr Sunnah (2 rak\'ah)', pts: 30, note: 'Prophet ﷺ never missed it' },
  { label: 'Witr (Wajib/Sunnah)', pts: 50, note: 'Wajib per Hanafi school' },
  { label: 'Dhuhr Sunnah (before + after)', pts: 40, note: '4+2 rak\'ah' },
  { label: 'Maghrib Sunnah', pts: 20 },
  { label: 'Isha Sunnah', pts: 20 },
]

const NAWAFIL_POINTS = [
  { label: 'Tahajjud', pts: 100, icon: '🌙', note: 'Highest reward' },
  { label: 'Tarawih (Ramadan)', pts: 60, icon: '🌙' },
  { label: 'Duha', pts: 50, icon: '☀️' },
  { label: 'Ishraq', pts: 40, icon: '🌅' },
  { label: 'Awwabeen', pts: 30, icon: '⭐' },
]

const STREAK_MULTIPLIERS = [
  { days: '3+ days', mult: '1.2×', label: 'Consistent' },
  { days: '7+ days', mult: '1.5×', label: 'Committed' },
  { days: '14+ days', mult: '1.8×', label: 'Dedicated' },
  { days: '21+ days', mult: '2.0×', label: 'Elite' },
]
```

**Replace TIERS with LEVELS (5 levels from lib/points.ts):**
```ts
import { LEVELS } from '@/lib/points'
// Use LEVELS directly — don't define a separate TIERS array
// Level data: { min, level, label, arabic }
// Ranges: Seeker 0-299, Devoted 300-999, Steadfast 1000-2499, Illuminated 2500-3999, Champion 4000+
```

Level gradients/colors to use:
- Seeker (level 1): `from-gray-500 to-gray-600`, `text-gray-400`, `border-gray-500/40`
- Devoted (level 2): `from-blue-600 to-blue-700`, `text-blue-400`, `border-blue-600/40`
- Steadfast (level 3): `from-emerald-500 to-emerald-600`, `text-emerald-400`, `border-emerald-500/40`
- Illuminated (level 4): `from-purple-500 to-purple-600`, `text-purple-400`, `border-purple-500/40`
- Champion (level 5): `from-amber-400 to-amber-600`, `text-amber-400`, `border-amber-400/40`

Level range display: Show `{min} - {next.min - 1} pts` (Champion: `4,000+ pts`)

Level descriptions:
- Seeker: "Every journey starts here. Begin your daily ibadah and earn your first points."
- Devoted: "You've established consistent habits. Your dedication is showing, keep going!"
- Steadfast: "Strong in faith and practice. You inspire those around you with your consistency."
- Illuminated: "Your ibadah shines like a lantern. You are an example for the whole community."
- Champion: "The pinnacle of devotion. You are a role model for the Ummah. May Allah keep you firm."

**Fix Step 4 text** — change "Climb the leaderboard and reach Gold tier" to "Climb the leaderboard and reach Champion level".

**Update Challenge Types** — add nawafil/sunnah challenge type:
```ts
{
  icon: Moon,
  color: 'from-indigo-500 to-violet-600',
  title: 'Sunnah & Nawafil',
  description: 'Track your sunnah prayers and nawafil — Tahajjud, Duha, Witr. Earn the highest points per prayer in the app.',
  examples: ['Witr Every Night', 'Tahajjud Week', 'Fajr Sunnah Month'],
}
```

Add a visual "Points multiplier" section showing how streaks boost all daily points.

---

### FILE 2: `app/explore/buddy/page.tsx`

**A. Fix levels — replace getTier() and getTierColor() with real levels:**

Remove the local `getTier()` and `getTierColor()` and `RANK_ICON` functions.
Import `getLevel, LEVELS` from `@/lib/points`.

```ts
import { getLevel } from '@/lib/points'

// Level color map (use level number 1-5)
function getLevelStyle(levelNum: number) {
  const styles: Record<number, { bg: string; text: string; border: string; icon: string }> = {
    1: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', icon: '🌱' },
    2: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: '📿' },
    3: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: '⭐' },
    4: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', icon: '✨' },
    5: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', icon: '👑' },
  }
  return styles[levelNum] || styles[1]
}
```

Update Buddy interface to use level object instead of tier string:
```ts
interface Buddy {
  id: string; name: string; streak: number; totalPoints: number
  lastActive?: string; avatar?: string
  level?: { level: number; label: string; arabic: string; min: number }
  status?: 'pending' | 'accepted'; direction?: 'sent' | 'received'
}
```

Update `fetchBuddies` mapping:
```ts
setBuddies(data.map((b: any) => ({
  ...b,
  points: b.totalPoints || 0,
  level: getLevel(b.totalPoints || 0),
  avatar: (b.displayName || b.name || '?')[0].toUpperCase(),
  lastActive: 'Active recently'
})))
```

Update buddy card display — instead of tier badge, show level emoji + label:
```tsx
<div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ${ls.bg} border ${ls.border} text-xs`}>
  {ls.icon}
</div>
// Below name: show level label
<span className={`text-[10px] font-semibold ${ls.text}`}>{buddy.level?.label || 'Seeker'}</span>
```

**B. Add "My Stats" card** at the top of the buddies tab:

Fetch own stats from `/api/user/profile` on mount, display a card:
```tsx
// State
const [myStats, setMyStats] = useState<{ totalPoints: number; streak: number; level: any } | null>(null)

// Fetch in useEffect (alongside fetchBuddies)
useEffect(() => {
  fetch('/api/friends').then(...)  // existing
  // Add own stats
  fetch('/api/tracking/stats').then(r => r.ok ? r.json() : null)
    .then(data => { if (data) setMyStats(data) })
    .catch(() => {})
}, [fetchBuddies])
```

Wait — there may not be a `/api/tracking/stats` endpoint. Instead use the leaderboard endpoint and find `isMe: true` entry. Or fetch from `/api/leaderboard` and filter.

Actually simpler: on mount, fetch `/api/leaderboard` and find the `isMe: true` entry for own stats. OR fetch it separately.

The My Stats card shows (only when myStats exists):
```tsx
{myStats && (
  <div className="rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 p-4">
    <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Your Standing</p>
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white">
        {session?.user?.name?.[0]?.toUpperCase() || '?'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${lvlStyle.bg} ${lvlStyle.text}`}>
            {myLevel.label}
          </span>
          {myStats.streak >= 3 && (
            <span className="flex items-center gap-0.5 text-xs text-amber-400">
              <Flame className="h-3 w-3" /> {myStats.streak}d
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <div>
            <p className="text-lg font-bold text-foreground">{myStats.totalPoints.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500">Total Points</p>
          </div>
          {/* Progress to next level */}
          {nextLevel && (
            <div className="flex-1">
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>Next: {nextLevel.label}</span>
                <span>{nextLevel.min - myStats.totalPoints} pts away</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-800">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  style={{ width: `${Math.min(100, ((myStats.totalPoints - myLevel.min) / (nextLevel.min - myLevel.min)) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
```

For myStats, fetch from leaderboard on mount:
```ts
const [myStats, setMyStats] = useState<{ totalPoints: number; streak: number } | null>(null)

// in fetchLeaderboard or separate useEffect:
fetch('/api/leaderboard').then(r => r.ok ? r.json() : [])
  .then((data: any[]) => {
    setLeaderboard(data.map(e => ({ ...e, avatar: (e.displayName || e.name || '?')[0].toUpperCase() })))
    const me = data.find(e => e.isMe)
    if (me) setMyStats({ totalPoints: me.totalPoints, streak: me.streak })
  }).catch(() => {})
```

Call this on initial load (not just when leaderboard tab opens).

**C. Challenges — auto-compute progress from real data:**

Add a `computeChallengeProgress` function that reads localStorage to compute real progress:

```ts
import { getItem } from '@/lib/storage'

function computeProgress(challenge: Challenge): number {
  try {
    if (challenge.category === 'prayer') {
      // Current streak from sunnah_log + daily tracking approximation
      // Use stored streak if available, else return stored current
      const streak = getItem('prayer_streak_cache', 0)
      return Math.min(challenge.target, streak)
    }
    if (challenge.category === 'quran') {
      // khatam_personal_progress: array of completed juz indices
      const juzDone = getItem('khatam_personal_progress', [])
      return Math.min(challenge.target, Array.isArray(juzDone) ? juzDone.length : 0)
    }
    if (challenge.category === 'nawafil') {
      // nawafil_log: { [date]: { [key]: rakats } }
      const nawafilLog = getItem('nawafil_log', {})
      const days = Object.keys(nawafilLog).filter(d => {
        const entry = nawafilLog[d]
        return entry && Object.values(entry).some((v: any) => v > 0)
      })
      return Math.min(challenge.target, days.length)
    }
    if (challenge.category === 'witr') {
      // sunnah_log: { [date]: { witr: bool } }
      const sunnahLog = getItem('sunnah_log', {})
      const days = Object.keys(sunnahLog).filter(d => sunnahLog[d]?.witr)
      return Math.min(challenge.target, days.length)
    }
    if (challenge.category === 'fasting') {
      // fasting_log_ramadan + fasting_log_voluntary etc
      let count = 0
      for (const key of ['fasting_log_ramadan','fasting_log_shawwal','fasting_log_monday_thursday','fasting_log_ayyam','fasting_log_voluntary']) {
        const log = getItem(key, {})
        count += Object.values(log).filter((v: any) => v === 'fasted').length
      }
      return Math.min(challenge.target, count)
    }
    if (challenge.category === 'dhikr') {
      // Check if any dhikr logged in tracker data
      return challenge.current
    }
  } catch { }
  return challenge.current
}
```

After loading challenges from localStorage, run `computeProgress` on each and update `current`:
```ts
useEffect(() => {
  const stored = getItem(KEYS.BUDDY_CHALLENGES, DEMO_CHALLENGES)
  const withProgress = stored.map((c: Challenge) => ({ ...c, current: computeProgress(c) }))
  setChallenges(withProgress)
}, [])
```

**D. Challenge display improvements:**

In the challenges tab, when a challenge is completed (`current >= target`), show a green "COMPLETED ✓" badge and different styling.

When `current >= target`:
```tsx
<div className="flex items-center gap-2">
  <div className="flex h-6 items-center rounded-lg bg-emerald-500/20 px-2 text-[10px] font-bold text-emerald-400">
    ✓ COMPLETED
  </div>
  <span className="text-[11px] text-gray-400">{c.current}/{c.target} {c.unit}</span>
</div>
```

**E. New Challenge Templates** — update the existing `NEW_CHALLENGE_TEMPLATES` to show progress source clearly. The templates are already good — just ensure they match the categories used in `computeProgress`.

**F. Challenge leaderboard/compare** — in the Buddy Detail modal (when you tap a buddy), add a section comparing your points/streak vs theirs:
```tsx
// In showBuddyDetail modal, add comparison section:
<div className="mt-4 grid grid-cols-2 gap-3">
  <div className="rounded-xl bg-gray-800 p-3 text-center">
    <p className="text-lg font-bold text-emerald-400">{myStats?.totalPoints || 0}</p>
    <p className="text-[10px] text-gray-500">Your Points</p>
  </div>
  <div className="rounded-xl bg-gray-800 p-3 text-center">
    <p className="text-lg font-bold text-blue-400">{showBuddyDetail.totalPoints || 0}</p>
    <p className="text-[10px] text-gray-500">Their Points</p>
  </div>
</div>
```

---

### FILE 3: `components/onboarding-wizard.tsx`

**Replace FEATURES array** (currently 6 items) with 8 items covering everything that's now in the app:

```ts
const FEATURES = [
  {
    emoji: '🕌',
    label: 'Prayer Times',
    desc: 'Accurate Georgetown times, Sunnah & Nawafil tracker, live countdown',
    color: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    emoji: '📖',
    label: 'Quran',
    desc: "Full Mus'haf, 12 reciters, Hifz mode, continue reading bookmark",
    color: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    emoji: '🌙',
    label: 'Ramadan & Fasting',
    desc: 'Suhoor/Iftaar countdowns, voluntary fasting tracker, moon sighting',
    color: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    emoji: '🎧',
    label: 'Lectures',
    desc: 'Al-Awlaki, Hamza Yusuf, Bilal Philips, Yasmin Mogahed — 80+ lectures',
    color: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    emoji: '🕌',
    label: 'Masjids & Jumu\'ah',
    desc: '20+ Guyanese masjids, Qibla, prayer timetable, Jumu\'ah prep',
    color: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    iconColor: 'text-teal-400',
  },
  {
    emoji: '📚',
    label: 'Learn Islam',
    desc: "Noorani Qaida, Salah guide, 25 Prophets, Seerah, 99 Names, Adab",
    color: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    emoji: '👥',
    label: 'Faith Buddies',
    desc: 'Add buddies by @username or phone, challenges, leaderboard, nudges',
    color: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    iconColor: 'text-sky-400',
  },
  {
    emoji: '🤝',
    label: 'Community',
    desc: 'Dua Board, Khatam Collective, community feed, halal directory',
    color: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    iconColor: 'text-rose-400',
  },
]
```

Update the subtitle: change "Six powerful tools" to "Eight powerful tools to strengthen your daily practice"

Update the community note at the bottom: "🌙 Community-powered — Dua requests, Khatam drives, and Iftaar reports are submitted live by fellow Muslims."

**In the done step** — update the feature highlights list (the bullet points that say things like "Track your prayers and build streaks"). Update to mention new features:
Find the done step (around line 519) and update whatever list/bullets are there to include:
- Track all 5 Fard prayers + Sunnah & Nawafil
- Build streaks and earn points (Tahajjud = 100 pts, Witr = 50 pts)
- Add Faith Buddies by @username or phone number
- Listen to 80+ lectures from world-renowned scholars
- Explore Noorani Qaida, 25 Prophets, Seerah, and Adab

---

### FILE 4: `CHANGELOG.md`

Add a new entry at the top:

```markdown
## v2.4.0 — Buddy System Upgrade (Feb 22, 2026)

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
```

---

## After All Changes

1. `npm run build` — fix any TypeScript errors
2. Rebuild and redeploy:
```bash
cd /home/karetech/v0-masjid-connect-gy
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
docker run -d --name kt-masjidconnect-prod --restart always \
  --network pangolin --ip 172.20.0.24 \
  --env-file .env.local \
  ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
docker network connect kt-net-apps kt-masjidconnect-prod
docker network connect kt-net-databases kt-masjidconnect-prod
```
3. Verify: `docker ps | grep masjidconnect`
4. Commit: `git add -A && git commit -m "feat: buddy system upgrade — 5 levels, real challenge progress, my stats card, accurate points guide"`
5. Notify: `openclaw --profile alfred system event --text "Done: Buddy system v2.4.0 — 5 levels, real challenge progress, my stats card, accurate how-it-works, onboarding updated" --mode now`
