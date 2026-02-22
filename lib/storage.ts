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
  ONBOARDING_COMPLETE: 'onboarding_complete',
  BUDDY_LIST: 'buddy_list',
  BUDDY_CHALLENGES: 'buddy_challenges',
  HIFZ_PROGRESS: 'hifz_progress',
  USERNAME: 'username',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  LAST_READ: 'last_read',
  QURAN_FONT_SIZE: 'quran_font_size',
  INSTALL_PROMPT_DISMISSED: 'install_prompt_dismissed',
} as const
