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
