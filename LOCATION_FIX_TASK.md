# Location Fix — International Prayer Times

## Problem
Prayer times are hardcoded to Georgetown, Guyana (6.8013°N, 58.1551°W) for any user who hasn't explicitly granted location access. Users in America, UK, etc. see completely wrong prayer times.

## Root Cause
`app/page.tsx`, `app/timetable/page.tsx`, and `app/ramadan/page.tsx` all do:
```ts
const lat = getItem(KEYS.USER_LAT, 6.8013)   // falls back to Georgetown if not set
const lng = getItem(KEYS.USER_LNG, -58.1551)
```
`USER_LAT` / `USER_LNG` only get saved during the onboarding wizard's prayer settings step — which many users may have skipped or never seen.

## Fix Overview

1. **Auto-detect on first open** — if `USER_LAT` is not in localStorage, automatically call geolocation on home page load
2. **Location banner** — if location is not set or detection failed, show an in-page prompt
3. **Settings page** — add a "Your Location" section so users can update at any time

---

## Part 1 — Auto-detect in `app/page.tsx`

### Imports to add at top
```typescript
import { detectLocation, reverseGeocode, getRecommendedMethod } from '@/lib/location'
```

### Logic to add inside the main component

Add a new `useEffect` that runs ONCE on mount, after `loadPrayerTimes` is defined:

```typescript
// Auto-detect location if never set
useEffect(() => {
  const hasLocation = localStorage.getItem('user_lat') !== null
  if (hasLocation) return  // already set, nothing to do

  // Attempt silent geolocation
  detectLocation()
    .then(async (coords) => {
      const geo = await reverseGeocode(coords.latitude, coords.longitude)
      setItem(KEYS.USER_LAT, coords.latitude)
      setItem(KEYS.USER_LNG, coords.longitude)
      setItem(KEYS.USER_CITY, geo.city)
      setItem(KEYS.USER_COUNTRY, geo.country)
      setItem(KEYS.USER_COUNTRY_CODE, geo.countryCode)

      // Auto-update calculation method for their region
      const rec = getRecommendedMethod(coords.latitude, coords.longitude, geo.countryCode)
      const currentMethod = getItem(KEYS.CALCULATION_METHOD, '')
      if (!currentMethod || currentMethod === 'Egyptian') {
        setItem(KEYS.CALCULATION_METHOD, rec.method)
      }

      // Reload prayer times with new coords
      loadPrayerTimes()
      setLocationDetected(true)
    })
    .catch(() => {
      // Silently fail — Georgetown fallback stays
      setLocationFailed(true)
    })
}, [loadPrayerTimes])
```

### State to add
```typescript
const [locationDetected, setLocationDetected] = useState(false)
const [locationFailed, setLocationFailed] = useState(false)
```

### Location banner JSX

Add this block right BEFORE the prayer countdown section (find the prayer countdown div and place this just above it):

```tsx
{/* Location notice */}
{locationFailed && !locationDetected && (
  <div className="mx-4 mb-3 flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
    <div className="flex items-center gap-2 min-w-0">
      <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-amber-400">Using Georgetown, Guyana</p>
        <p className="text-[10px] text-gray-500 truncate">Prayer times may be incorrect for your location</p>
      </div>
    </div>
    <Link href="/settings" className="ml-3 shrink-0 rounded-full bg-amber-500/15 px-3 py-1.5 text-[10px] font-semibold text-amber-400 active:scale-95 transition-transform">
      Update
    </Link>
  </div>
)}
```

Add `MapPin` to the lucide-react import.
Add `Link` import from 'next/link' if not already imported.

---

## Part 2 — `app/timetable/page.tsx`

The timetable page also needs to show the current city name so users know whose times they're seeing. Find where prayer times are loaded and add the city display:

1. Add state: `const [userCity, setUserCity] = useState('')`
2. After loading lat/lng, also load: `setUserCity(getItem(KEYS.USER_CITY, 'Georgetown, Guyana'))`
3. In the page header area (near the top, below the PageHero), add a small location indicator:
```tsx
{userCity && (
  <div className="mx-4 mt-3 flex items-center gap-1.5">
    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
    <span className="text-xs text-gray-400">{userCity}</span>
    <Link href="/settings" className="ml-auto text-[10px] text-emerald-500 underline">Change</Link>
  </div>
)}
```

---

## Part 3 — Settings Page (`app/settings/page.tsx`)

Add a **"Your Location"** card/section. Read the existing settings page structure carefully to match the card style.

The section should contain:
- Current location display: city name from `KEYS.USER_CITY`, country from `KEYS.USER_COUNTRY`
- If not set: show "Georgetown, Guyana (default)"
- A "Detect My Location" button that:
  1. Shows a loading spinner
  2. Calls `detectLocation()` then `reverseGeocode()`
  3. Saves all 5 keys: USER_LAT, USER_LNG, USER_CITY, USER_COUNTRY, USER_COUNTRY_CODE
  4. Also updates CALCULATION_METHOD to `getRecommendedMethod()` result if user hasn't manually set one
  5. Shows success: "✓ Updated to [City], [Country]"
  6. Or error: "Could not detect location. Please try again."
- A "Reset to Georgetown" button (text link, small) for Guyanese users in case they accidentally updated

### State needed in settings page
```typescript
const [userCity, setUserCity] = useState('')
const [userCountry, setUserCountry] = useState('')
const [locationLoading, setLocationLoading] = useState(false)
const [locationMsg, setLocationMsg] = useState('')
```

### Hydrate from storage on mount
```typescript
useEffect(() => {
  setUserCity(getItem(KEYS.USER_CITY, ''))
  setUserCountry(getItem(KEYS.USER_COUNTRY, ''))
}, [])
```

### Detect function
```typescript
const handleDetectLocation = async () => {
  setLocationLoading(true)
  setLocationMsg('')
  try {
    const coords = await detectLocation()
    const geo = await reverseGeocode(coords.latitude, coords.longitude)
    setItem(KEYS.USER_LAT, coords.latitude)
    setItem(KEYS.USER_LNG, coords.longitude)
    setItem(KEYS.USER_CITY, geo.city)
    setItem(KEYS.USER_COUNTRY, geo.country)
    setItem(KEYS.USER_COUNTRY_CODE, geo.countryCode)
    const rec = getRecommendedMethod(coords.latitude, coords.longitude, geo.countryCode)
    setItem(KEYS.CALCULATION_METHOD, rec.method)
    setUserCity(geo.city)
    setUserCountry(geo.country)
    setLocationMsg(`✓ Updated to ${geo.city}, ${geo.country}`)
  } catch {
    setLocationMsg('Could not detect location. Please allow location access in your browser settings.')
  } finally {
    setLocationLoading(false)
  }
}
```

### Reset function
```typescript
const handleResetLocation = () => {
  setItem(KEYS.USER_LAT, 6.8013)
  setItem(KEYS.USER_LNG, -58.1551)
  setItem(KEYS.USER_CITY, 'Georgetown')
  setItem(KEYS.USER_COUNTRY, 'Guyana')
  setItem(KEYS.USER_COUNTRY_CODE, 'GY')
  setItem(KEYS.CALCULATION_METHOD, 'MuslimWorldLeague')
  setUserCity('Georgetown')
  setUserCountry('Guyana')
  setLocationMsg('✓ Reset to Georgetown, Guyana')
}
```

### JSX for the location card (match existing card styling exactly)
```tsx
{/* Location */}
<div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
  <div className="flex items-center gap-2 mb-4">
    <MapPin className="h-4 w-4 text-emerald-400" />
    <h3 className="text-sm font-semibold text-foreground">Your Location</h3>
  </div>
  <div className="flex items-center gap-3 mb-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
      <MapPin className="h-5 w-5 text-emerald-400" />
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground">
        {userCity || 'Georgetown'}
      </p>
      <p className="text-xs text-gray-400">{userCountry || 'Guyana (default)'}</p>
    </div>
  </div>
  <button
    onClick={handleDetectLocation}
    disabled={locationLoading}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60 active:scale-[0.98]"
  >
    {locationLoading ? (
      <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Detecting...</>
    ) : (
      <><MapPin className="h-4 w-4" />Detect My Location</>
    )}
  </button>
  {locationMsg && (
    <p className={`mt-2 text-center text-xs ${locationMsg.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
      {locationMsg}
    </p>
  )}
  <button
    onClick={handleResetLocation}
    className="mt-2 w-full text-center text-[10px] text-gray-600 underline active:text-gray-400"
  >
    Reset to Georgetown, Guyana
  </button>
</div>
```

Add `MapPin` to lucide-react imports in settings page.
Add `import { detectLocation, reverseGeocode, getRecommendedMethod } from '@/lib/location'`

---

## Part 4 — Build and Deploy

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
docker ps | grep kt-masjidconnect-prod
curl -s -o /dev/null -w "%{http_code}" https://masjidconnectgy.com
```

When completely done:
openclaw system event --text "Done: Location fix deployed — auto-detects on first open, Settings location card added, timetable shows city name. Users anywhere in the world now get correct prayer times." --mode now
