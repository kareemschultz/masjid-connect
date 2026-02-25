// ─── Location & Prayer Method Utilities ──────────────────────────────────────
// Handles geolocation detection, reverse geocoding, and method recommendation

export interface UserLocation {
  lat: number
  lng: number
  city: string
  country: string
  countryCode: string
}

export interface MethodRecommendation {
  method: string
  label: string
  reason: string
}

// Georgetown, Guyana — default fallback
export const GEORGETOWN_DEFAULT: UserLocation = {
  lat: 6.8013,
  lng: -58.1551,
  city: 'Georgetown',
  country: 'Guyana',
  countryCode: 'GY',
}

// Recommend the best calculation method based on geographic coordinates
export function getRecommendedMethod(lat: number, lng: number, countryCode?: string): MethodRecommendation {
  const cc = countryCode?.toUpperCase()

  // Gulf region — Saudi Arabia, UAE, Kuwait, Qatar, Bahrain
  if (cc && ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'].includes(cc)) {
    return { method: 'UmmAlQura', label: 'Umm Al-Qura (Makkah)', reason: 'Standard for Gulf countries' }
  }

  // North America — US, Canada
  if (cc && ['US', 'CA'].includes(cc)) {
    return { method: 'NorthAmerica', label: 'North America (ISNA)', reason: 'Recommended for the United States and Canada' }
  }

  // Turkey
  if (cc === 'TR') {
    return { method: 'Turkey', label: 'Turkey (Diyanet)', reason: 'Standard for Turkey' }
  }

  // Iran
  if (cc === 'IR') {
    return { method: 'Tehran', label: 'Tehran', reason: 'Standard for Iran' }
  }

  // Pakistan, India, Bangladesh — Karachi method
  if (cc && ['PK', 'IN', 'BD', 'AF'].includes(cc)) {
    return { method: 'Karachi', label: 'Karachi (Hanafi)', reason: 'Widely used in Pakistan, India & Bangladesh' }
  }

  // Singapore, Malaysia, Indonesia
  if (cc && ['SG', 'MY', 'ID'].includes(cc)) {
    return { method: 'Singapore', label: 'Singapore', reason: 'Standard for Southeast Asia' }
  }

  // Egypt
  if (cc === 'EG') {
    return { method: 'Egyptian', label: 'Egyptian (Cairo)', reason: 'Standard for Egypt' }
  }

  // Dubai / UAE fallback (by coordinates)
  if (lat >= 22 && lat <= 30 && lng >= 50 && lng <= 60) {
    return { method: 'Dubai', label: 'Dubai', reason: 'Recommended for Gulf region' }
  }

  // North America by coordinates (US/Canada without country code)
  if (lat >= 15 && lat <= 72 && lng >= -170 && lng <= -50) {
    return { method: 'NorthAmerica', label: 'North America (ISNA)', reason: 'Recommended for North America' }
  }

  // Europe / UK by coordinates
  if (lat >= 35 && lat <= 72 && lng >= -15 && lng <= 45) {
    return { method: 'MuslimWorldLeague', label: 'Muslim World League', reason: 'Widely used in Europe and the UK' }
  }

  // Caribbean / Latin America / Guyana
  if (lat >= -60 && lat <= 25 && lng >= -85 && lng <= -30) {
    return { method: 'MuslimWorldLeague', label: 'Muslim World League', reason: 'Recommended for the Caribbean and Latin America' }
  }

  // Default — MWL is the safest global default
  return { method: 'MuslimWorldLeague', label: 'Muslim World League', reason: 'Widely recognised globally' }
}

// Reverse geocode using OpenStreetMap Nominatim (client-side only)
export async function reverseGeocode(lat: number, lng: number): Promise<{ city: string; state: string; country: string; countryCode: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'MasjidConnectGY/2.0' } }
    )
    const data = await res.json()
    const addr = data.address || {}
    const city = addr.city || addr.town || addr.village || addr.county || addr.state || 'Unknown City'
    const state = addr.state || addr.region || addr.county || ''
    const country = addr.country || 'Unknown Country'
    const countryCode = addr.country_code?.toUpperCase() || ''
    return { city, state, country, countryCode }
  } catch {
    return { city: 'Unknown', state: '', country: 'Unknown', countryCode: '' }
  }
}

// Detect user location via browser geolocation API
export function detectLocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { timeout: 10000, enableHighAccuracy: false }
    )
  })
}
