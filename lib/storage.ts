'use client'

export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or restricted
  }
}

// Storage keys
export const KEYS = {
  CALCULATION_METHOD: 'calculation_method',
  MADHAB: 'madhab',
  DARK_MODE: 'dark_mode',
  QURAN_FONT: 'quran_font',
  RECITER: 'adhan_reciter',
  NOTIF_PRAYERS: 'adhan_notif_prayers',
  PRAYER_LOG: 'prayer_log',
  TASBIH_COUNT: 'tasbih_count',
  BOOKMARKS: 'bookmarks',
  POINTS: 'points',
  STREAK: 'streak',
  PROFILE: 'profile',
  CHECKLIST: 'checklist',
} as const
