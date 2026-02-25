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
  SELECTED_MASJID: 'selected_masjid_id',
  BUDDY_LIST: 'buddy_list',
  BUDDY_CHALLENGES: 'buddy_challenges',
  HIFZ_PROGRESS: 'hifz_progress',
  USERNAME: 'username',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  LAST_READ: 'last_read',
  QURAN_FONT_SIZE: 'quran_font_size',
  INSTALL_PROMPT_DISMISSED: 'install_prompt_dismissed',
  FASTING_LOG: 'fasting_log',
  FASTING_LOG_RAMADAN: 'fasting_log_ramadan',
  FASTING_LOG_SHAWWAL: 'fasting_log_shawwal',
  FASTING_LOG_MONTHU: 'fasting_log_monthu',
  FASTING_LOG_AYYAM: 'fasting_log_ayyam',
  FASTING_LOG_VOLUNTARY: 'fasting_log_voluntary',
  FASTING_TYPE: 'fasting_type',
  FEEDBACK_LOG: 'feedback_log',
  APP_RATING: 'app_rating',
  ANNOUNCEMENTS: 'announcements',
  DISMISSED_ANNOUNCEMENTS: 'dismissed_announcements',
  IS_ADMIN: 'is_admin',
  KHATAM_PROGRESS: 'khatam_progress',
  QURAN_GOAL: 'quran_goal',
  CHECKINS: 'masjid_checkins',
  QURAN_LOG: 'quran_log',
  SADAQAH_LOG: 'sadaqah_log',
  GOOD_DEEDS_LOG: 'good_deeds_log',
  SLEEP_LOG: 'sleep_log',
  WATER_LOG: 'water_log',
  ADHKAR_LOG: 'adhkar_log',
  ISTIGHFAR_COUNT: 'istighfar_count',
  QURAN_LAST_PAGE: 'quran_last_page',
  SUNNAH_LOG: 'sunnah_log',
  NAWAFIL_LOG: 'nawafil_log',
  HOME_MASJID: 'home_masjid_id',
  QURAN_TRANSLATION: 'quran_translation',
  QURAN_TRANSLITERATION: 'quran_transliteration',
  TOUR_PENDING: 'app_tour_pending',
  QAIDA_LOG: 'qaida_log',
  QURAN_SCRIPT: 'quran_script',
  QURAN_TAJWEED: 'quran_tajweed_colors',
  PRAYER_OFFSET: 'prayer_offset',
  PRAYER_OFFSETS: 'prayer_offsets_v2',
  USER_LAT: 'user_lat',
  USER_LNG: 'user_lng',
  USER_CITY: 'user_city',
  USER_COUNTRY: 'user_country',
  USER_COUNTRY_CODE: 'user_country_code',
  THEME: 'app_theme',
} as const
