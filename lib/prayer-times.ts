// Prayer time calculation using the Adhan library
// Georgetown, Guyana coordinates
import { getItem } from './storage'

export const GEORGETOWN_COORDS = { latitude: 6.8013, longitude: -58.1551 }

export const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const
export type PrayerName = (typeof PRAYER_NAMES)[number]

export const CALCULATION_METHODS = [
  { key: 'MuslimWorldLeague', label: 'Muslim World League' },
  { key: 'Egyptian', label: 'Egyptian General Authority' },
  { key: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { key: 'NorthAmerica', label: 'Islamic Society of North America (ISNA)' },
  { key: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { key: 'UmmAlQura', label: 'Umm Al-Qura University, Makkah' },
  { key: 'Dubai', label: 'Dubai' },
  { key: 'Qatar', label: 'Qatar' },
  { key: 'Kuwait', label: 'Kuwait' },
  { key: 'Singapore', label: 'Singapore' },
  { key: 'Tehran', label: 'Institute of Geophysics, Tehran' },
  { key: 'Turkey', label: 'Turkey (Diyanet)' },
] as const

export const MADHABS = [
  { key: 'Shafi', label: "Shafi'i / Hanbali / Maliki" },
  { key: 'Hanafi', label: 'Hanafi' },
] as const

export const RECITERS = [
  { key: 'ar.alafasy', label: 'Mishary Al-Afasy' },
  { key: 'ar.abdulbasit', label: 'Abdul Basit Abdul Samad' },
  { key: 'ar.abdurrahmaansudais', label: 'Abdurrahman As-Sudais' },
  { key: 'ar.hanirifai', label: 'Hani Ar-Rifai' },
  { key: 'ar.husary', label: 'Mahmoud Khalil Al-Husary' },
  { key: 'ar.minshawi', label: 'Mohamed Siddiq Al-Minshawi' },
  { key: 'ar.muhammadayyoub', label: 'Muhammad Ayyub' },
  { key: 'ar.muhammadjibreel', label: 'Muhammad Jibreel' },
  { key: 'ar.saaborimaa', label: "Sa'ud Ash-Shuraym" },
  { key: 'ar.parhizgar', label: 'Parhizgar' },
  { key: 'ar.mahermuaiqly', label: 'Maher Al-Muaiqly' },
  { key: 'ar.ibrahimakhbar', label: 'Ibrahim Al-Akhdar' },
] as const

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function getHijriDate(): string {
  try {
    const today = new Date()
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    // If user has a stored ramadan_start, calculate the Ramadan day from their preference
    // so CIOG users see "Ramadan 5" rather than the Saudi "Ramadan 6" etc.
    const storedStart = getItem<string | null>('ramadan_start', null)
    if (storedStart) {
      const startDate = new Date(storedStart + 'T00:00:00')
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 30)
      if (today >= startDate && today <= endDate) {
        const day = Math.floor((todayMidnight.getTime() - startDate.getTime()) / 86400000) + 1
        // Get the year from Intl (or fallback to 1447)
        let year = 1447
        try {
          const parts = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', { year: 'numeric' }).formatToParts(today)
          year = parseInt(parts.find(p => p.type === 'year')?.value || '1447')
        } catch { /* use 1447 */ }
        return `Ramadan ${day}, ${year} AH`
      }
    }

    // No stored date (fresh/incognito) — fall back to Intl Hijri
    return new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(today)
  } catch {
    return ''
  }
}

export function getTimeUntil(target: Date): { hours: number; minutes: number; seconds: number } {
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}
