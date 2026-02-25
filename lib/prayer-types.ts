export type SunnahCategory = 'sunnah_muakkadah' | 'wajib'
export type NaflCategory = 'nafl'
export type SunnahImportance = 'highest' | 'high' | 'wajib'

export interface SunnahPrayer {
  key: string
  label: string
  arabic: string
  rakat: number
  timing: string
  category: SunnahCategory
  reward: string
  source: string
  importance: SunnahImportance
  note?: string
}

export interface NafilPrayer {
  key: string
  label: string
  arabic: string
  rakat: number | string
  timing: string
  category: NaflCategory
  reward: string
  source: string
  icon: string
  ramadanOnly?: boolean
}

export const SUNNAH_PRAYERS: SunnahPrayer[] = [
  {
    key: 'fajr_sunnah',
    label: 'Fajr Sunnah',
    arabic: 'سنة الفجر',
    rakat: 2,
    timing: 'Before Fajr Fard',
    category: 'sunnah_muakkadah',
    reward: 'The Prophet ﷺ said: "The two rak\'ahs of Fajr are better than the world and everything in it." (Muslim)',
    source: 'Sahih Muslim',
    importance: 'highest',
  },
  {
    key: 'dhuhr_sunnah_before',
    label: 'Dhuhr Sunnah (Before)',
    arabic: 'سنة الظهر القبلية',
    rakat: 4,
    timing: 'Before Dhuhr Fard',
    category: 'sunnah_muakkadah',
    reward: 'Whoever prays 4 before Dhuhr and 4 after, Allah forbids that person from the Fire. (Abu Dawud)',
    source: 'Sunan Abu Dawud',
    importance: 'high',
  },
  {
    key: 'dhuhr_sunnah_after',
    label: 'Dhuhr Sunnah (After)',
    arabic: 'سنة الظهر البعدية',
    rakat: 2,
    timing: 'After Dhuhr Fard',
    category: 'sunnah_muakkadah',
    reward: 'Regular confirmed Sunnah of the Prophet ﷺ and part of the 12 daily Sunnah rak\'ahs tied to a house in Jannah.',
    source: 'Sahih Muslim',
    importance: 'high',
  },
  {
    key: 'maghrib_sunnah',
    label: 'Maghrib Sunnah',
    arabic: 'سنة المغرب',
    rakat: 2,
    timing: 'After Maghrib Fard',
    category: 'sunnah_muakkadah',
    reward: 'Regular confirmed Sunnah and part of the 12 daily Sunnah rak\'ahs tied to a house in Jannah.',
    source: 'Sahih Muslim',
    importance: 'high',
  },
  {
    key: 'isha_sunnah',
    label: 'Isha Sunnah',
    arabic: 'سنة العشاء',
    rakat: 2,
    timing: 'After Isha Fard',
    category: 'sunnah_muakkadah',
    reward: 'Regular confirmed Sunnah and part of the 12 daily Sunnah rak\'ahs tied to a house in Jannah.',
    source: 'Sahih Muslim',
    importance: 'high',
  },
  {
    key: 'witr',
    label: 'Witr',
    arabic: 'الوتر',
    rakat: 3,
    timing: 'After Isha Sunnah, before Fajr',
    category: 'wajib',
    reward: 'The Prophet ﷺ said: "Witr is a duty for every Muslim." (Abu Dawud). In the Hanafi school, Witr is Wajib.',
    source: 'Sunan Abu Dawud',
    importance: 'wajib',
    note: 'Wajib per Hanafi school; Sunnah Mu\'akkadah per other schools',
  },
]

export const NAWAFIL_PRAYERS: NafilPrayer[] = [
  {
    key: 'tahajjud',
    label: 'Tahajjud',
    arabic: 'تهجد',
    rakat: '2–12',
    timing: 'Last third of the night (after sleeping, before Fajr)',
    category: 'nafl',
    reward: 'Allah descends to the lowest heaven in the last third of the night and calls: "Who will supplicate Me that I may respond?"',
    source: 'Bukhari & Muslim',
    icon: '🌙',
  },
  {
    key: 'duha',
    label: 'Duha (Forenoon)',
    arabic: 'صلاة الضحى',
    rakat: '2–12',
    timing: 'After sunrise until before Dhuhr (best: mid-morning)',
    category: 'nafl',
    reward: '"Whoever prays 12 rak\'ahs of Duha, Allah will build a palace of gold for him in Paradise." (Tirmidhi)',
    source: 'Tirmidhi',
    icon: '☀️',
  },
  {
    key: 'ishraq',
    label: 'Ishraq (Post-Sunrise)',
    arabic: 'صلاة الإشراق',
    rakat: 2,
    timing: '15–20 minutes after sunrise',
    category: 'nafl',
    reward: '"Whoever prays Fajr in congregation, then sits remembering Allah until the sun rises, then prays 2 rak\'ahs, he has the reward of Hajj and Umrah."',
    source: 'Tirmidhi',
    icon: '🌅',
  },
  {
    key: 'awwabeen',
    label: 'Awwabeen',
    arabic: 'صلاة الأوابين',
    rakat: 6,
    timing: 'After Maghrib fard + sunnah',
    category: 'nafl',
    reward: '"Whoever prays 6 rak\'ahs after Maghrib, without speaking evil in between, they are equivalent to 12 years of worship." (Tirmidhi)',
    source: 'Tirmidhi',
    icon: '⭐',
  },
  {
    key: 'tarawih',
    label: 'Tarawih',
    arabic: 'صلاة التراويح',
    rakat: '8 or 20',
    timing: 'After Isha — Ramadan nights only',
    category: 'nafl',
    reward: '"Whoever prays Tarawih during Ramadan out of faith and seeking reward, all their past sins are forgiven." (Bukhari & Muslim)',
    source: 'Bukhari & Muslim',
    icon: '🌙',
    ramadanOnly: true,
  },
]

/** Points awarded for completing each prayer */
export const PRAYER_POINTS: Record<string, number> = {
  // Sunnah Mu'akkadah & Wajib
  fajr_sunnah: 30,
  dhuhr_sunnah_before: 20,
  dhuhr_sunnah_after: 20,
  maghrib_sunnah: 20,
  isha_sunnah: 20,
  witr: 50,
  // Nawafil
  tahajjud: 100,
  duha: 50,
  ishraq: 40,
  awwabeen: 30,
  tarawih: 60,
}

/** Total number of sunnah + wajib prayers (excluding nawafil) */
export const TOTAL_SUNNAH_COUNT = SUNNAH_PRAYERS.length // 6 (5 sunnah + witr)
