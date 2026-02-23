# Per-Prayer Time Adjustment Feature

## Goal
Replace the current single global prayer offset with **individual per-prayer offsets**, matching the feature shown in the reference app screenshot. Users can set e.g. Fajr +10 min, Maghrib +1 min, etc.

## Reference
The reference app shows a "Prayer Time Adjustment" screen with:
- Fajr: 10 Minutes After
- Dhuhr: 0 Minute Before
- Asr: 0 Minute Before
- Maghrib: 1 Minute After
- Isha: 0 Minute Before

## Part 1 — Add new storage key to `lib/storage.ts`

Add to the KEYS object:
```typescript
PRAYER_OFFSETS: 'prayer_offsets_v2',  // per-prayer offsets
```

Leave the existing `PRAYER_OFFSET: 'prayer_offset'` key in place (for backward compat).

## Part 2 — Create `lib/prayer-offsets.ts`

```typescript
// lib/prayer-offsets.ts
// Per-prayer time offsets

export interface PrayerOffsets {
  Fajr: number    // minutes, can be negative
  Dhuhr: number
  Asr: number
  Maghrib: number
  Isha: number
}

export const DEFAULT_OFFSETS: PrayerOffsets = {
  Fajr: 0,
  Dhuhr: 0,
  Asr: 0,
  Maghrib: 0,
  Isha: 0,
}

export const PRAYER_NAMES_OFFSETS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const

// Apply offset (in minutes) to a Date
export function applyOffset(date: Date, offsetMinutes: number): Date {
  if (!offsetMinutes) return date
  return new Date(date.getTime() + offsetMinutes * 60 * 1000)
}

// Offset options for the selector: -15 to +30 in 1-min steps
export const OFFSET_OPTIONS = Array.from({ length: 46 }, (_, i) => i - 15)
// Display label: "10 Minutes After", "3 Minutes Before", "No adjustment"
export function offsetLabel(min: number): string {
  if (min === 0) return 'No adjustment'
  if (min > 0) return `${min} Minute${min !== 1 ? 's' : ''} After`
  return `${Math.abs(min)} Minute${Math.abs(min) !== 1 ? 's' : ''} Before`
}
```

## Part 3 — Update prayer time calculation in `app/page.tsx`

### Import
```typescript
import { applyOffset, DEFAULT_OFFSETS, type PrayerOffsets } from '@/lib/prayer-offsets'
```

### In `loadPrayerTimes`:
After reading lat/lng/method, also read:
```typescript
const offsets: PrayerOffsets = getItem(KEYS.PRAYER_OFFSETS, DEFAULT_OFFSETS)
```

Then when building `prayerData`, apply offsets:
```typescript
const prayerData: PrayerTimeData[] = PRAYER_NAMES.map((name) => {
  const rawDate = prayerMap[name]
  const offset = offsets[name as keyof PrayerOffsets] ?? 0
  const adjustedDate = applyOffset(rawDate, offset)
  return {
    name,
    time: formatTime(adjustedDate),
    date: adjustedDate,
  }
})
```

## Part 4 — Update `app/timetable/page.tsx`

Same pattern — after loading prayer times, read offsets and apply `applyOffset()` to each prayer's Date before displaying. The timetable shows all prayers so all 5 need offset applied.

Read the full timetable page carefully to understand where times are formatted, then apply offsets there.

## Part 5 — Add Prayer Time Adjustment UI to Settings page (`app/settings/page.tsx`)

### Add state
```typescript
const [prayerOffsets, setPrayerOffsets] = useState<PrayerOffsets>(DEFAULT_OFFSETS)
```

### Hydrate on mount (add to existing useEffect)
```typescript
setPrayerOffsets(getItem(KEYS.PRAYER_OFFSETS, DEFAULT_OFFSETS))
```

### Update function
```typescript
const updatePrayerOffset = (prayer: keyof PrayerOffsets, value: number) => {
  const updated = { ...prayerOffsets, [prayer]: value }
  setPrayerOffsets(updated)
  setItem(KEYS.PRAYER_OFFSETS, updated)
}
```

### JSX — Add a new "Prayer Time Adjustment" card in the Prayer Settings section

Read the existing settings page structure carefully to match the card styling. Place this card INSIDE or AFTER the existing "Prayer Settings" section.

```tsx
{/* Prayer Time Adjustment */}
<div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
  <div className="flex items-center gap-2 mb-4">
    <Clock className="h-4 w-4 text-teal-400" />
    <h3 className="text-sm font-semibold text-foreground">Prayer Time Adjustment</h3>
  </div>
  <p className="text-xs text-gray-400 mb-4">
    Fine-tune each prayer time to match your local masjid or personal preference.
  </p>
  <div className="space-y-3">
    {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((prayer) => (
      <div key={prayer} className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground w-16">{prayer}</span>
        <select
          value={prayerOffsets[prayer]}
          onChange={(e) => updatePrayerOffset(prayer, Number(e.target.value))}
          className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-teal-500 min-w-[160px] text-right"
        >
          {OFFSET_OPTIONS.map((min) => (
            <option key={min} value={min}>{offsetLabel(min)}</option>
          ))}
        </select>
      </div>
    ))}
  </div>
</div>
```

Add `Clock` to lucide-react imports.
Add `import { DEFAULT_OFFSETS, OFFSET_OPTIONS, offsetLabel, type PrayerOffsets } from '@/lib/prayer-offsets'`

## Part 6 — Build and Deploy

```bash
cd /home/karetech/v0-masjid-connect-gy
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . -q && \
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod && \
docker run -d --name kt-masjidconnect-prod --restart always \
  --network pangolin --ip 172.20.0.24 \
  --dns 8.8.8.8 --dns 1.1.1.1 \
  --env-file .env.local \
  ghcr.io/kareemschultz/v0-masjid-connect-gy:latest && \
docker network connect kt-net-apps kt-masjidconnect-prod && \
docker network connect kt-net-databases kt-masjidconnect-prod
```

Verify:
```bash
curl -s -o /dev/null -w "%{http_code}" https://masjidconnectgy.com
```

When completely done:
openclaw system event --text "Done: Per-prayer time adjustments deployed — each prayer (Fajr, Dhuhr, Asr, Maghrib, Isha) now has its own offset selector in Settings → Prayer Time Adjustment. Range -15 to +30 minutes per prayer." --mode now
