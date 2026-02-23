/**
 * GIT (Guyana Islamic Trust) Official Ramadan 1447 Timetable
 * Times are for Georgetown / East Bank Demerara area
 * Source: GIT Secretariat, N½ Lot 321 East Street, N/Cummingsburg, G/Town
 * Contact: 227-0115 / 225-5934 | gits@guyana.net.gy
 *
 * Day 1 (*tentative, based on sighting of the moon) = Wednesday 18 Feb 2026
 * Asr (S) = Shafi'i (1 shadow); Asr (H) = Hanafi (2 shadows)
 *
 * REGIONAL ADJUSTMENTS (add/subtract from listed times):
 *   Skeldon to Letter Kenny:               -4 min
 *   Bloomfield to New Amsterdam:           -3 min
 *   Rosignol to Golden Fleece:             -2 min
 *   Paradise to Buxton:                    -1 min
 *   Vreed-en-Hoop to DeKinderen:           +1 min
 *   Zeelugt to Parika, Charity, Pomeroon,
 *     Essequibo Coast and Islands:         +2 min
 */

export interface RamadanDay {
  day: number         // Day of fast (1-30)
  date: string        // YYYY-MM-DD
  weekday: string
  fajr: string        // End of Suhoor / Start of Fajr
  sunrise: string
  zuhr: string
  asrShafi: string    // Asr (S) — 1 shadow
  asrHanafi: string   // Asr (H) — 2 shadows
  maghrib: string     // Breaking of fast / Iftaar
  isha: string
}

export const GIT_RAMADAN_1447: RamadanDay[] = [
  { day:  1, date: '2026-02-18', weekday: 'Wed', fajr: '4:58', sunrise: '6:09', zuhr: '12:12', asrShafi: '3:27', asrHanafi: '4:25', maghrib: '6:08', isha: '7:15' },
  { day:  2, date: '2026-02-19', weekday: 'Thu', fajr: '4:58', sunrise: '6:08', zuhr: '12:11', asrShafi: '3:27', asrHanafi: '4:25', maghrib: '6:08', isha: '7:15' },
  { day:  3, date: '2026-02-20', weekday: 'Fri', fajr: '4:58', sunrise: '6:08', zuhr: '12:11', asrShafi: '3:26', asrHanafi: '4:25', maghrib: '6:08', isha: '7:15' },
  { day:  4, date: '2026-02-21', weekday: 'Sat', fajr: '4:58', sunrise: '6:08', zuhr: '12:11', asrShafi: '3:26', asrHanafi: '4:25', maghrib: '6:08', isha: '7:15' },
  { day:  5, date: '2026-02-22', weekday: 'Sun', fajr: '4:58', sunrise: '6:08', zuhr: '12:11', asrShafi: '3:26', asrHanafi: '4:25', maghrib: '6:08', isha: '7:15' },
  { day:  6, date: '2026-02-23', weekday: 'Mon', fajr: '4:57', sunrise: '6:07', zuhr: '12:11', asrShafi: '3:25', asrHanafi: '4:25', maghrib: '6:08', isha: '7:15' },
  { day:  7, date: '2026-02-24', weekday: 'Tue', fajr: '4:57', sunrise: '6:07', zuhr: '12:11', asrShafi: '3:25', asrHanafi: '4:24', maghrib: '6:08', isha: '7:15' },
  { day:  8, date: '2026-02-25', weekday: 'Wed', fajr: '4:57', sunrise: '6:07', zuhr: '12:11', asrShafi: '3:25', asrHanafi: '4:24', maghrib: '6:08', isha: '7:15' },
  { day:  9, date: '2026-02-26', weekday: 'Thu', fajr: '4:57', sunrise: '6:06', zuhr: '12:11', asrShafi: '3:24', asrHanafi: '4:24', maghrib: '6:08', isha: '7:15' },
  { day: 10, date: '2026-02-27', weekday: 'Fri', fajr: '4:56', sunrise: '6:06', zuhr: '12:10', asrShafi: '3:24', asrHanafi: '4:24', maghrib: '6:08', isha: '7:15' },
  { day: 11, date: '2026-02-28', weekday: 'Sat', fajr: '4:56', sunrise: '6:06', zuhr: '12:10', asrShafi: '3:24', asrHanafi: '4:24', maghrib: '6:08', isha: '7:14' },
  { day: 12, date: '2026-03-01', weekday: 'Sun', fajr: '4:56', sunrise: '6:05', zuhr: '12:10', asrShafi: '3:23', asrHanafi: '4:24', maghrib: '6:08', isha: '7:14' },
  { day: 13, date: '2026-03-02', weekday: 'Mon', fajr: '4:55', sunrise: '6:05', zuhr: '12:10', asrShafi: '3:23', asrHanafi: '4:24', maghrib: '6:08', isha: '7:14' },
  { day: 14, date: '2026-03-03', weekday: 'Tue', fajr: '4:55', sunrise: '6:04', zuhr: '12:10', asrShafi: '3:22', asrHanafi: '4:23', maghrib: '6:08', isha: '7:14' },
  { day: 15, date: '2026-03-04', weekday: 'Wed', fajr: '4:55', sunrise: '6:04', zuhr: '12:09', asrShafi: '3:22', asrHanafi: '4:23', maghrib: '6:08', isha: '7:14' },
  { day: 16, date: '2026-03-05', weekday: 'Thu', fajr: '4:54', sunrise: '6:04', zuhr: '12:09', asrShafi: '3:21', asrHanafi: '4:23', maghrib: '6:08', isha: '7:14' },
  { day: 17, date: '2026-03-06', weekday: 'Fri', fajr: '4:54', sunrise: '6:03', zuhr: '12:09', asrShafi: '3:21', asrHanafi: '4:23', maghrib: '6:08', isha: '7:14' },
  { day: 18, date: '2026-03-07', weekday: 'Sat', fajr: '4:54', sunrise: '6:03', zuhr: '12:09', asrShafi: '3:20', asrHanafi: '4:22', maghrib: '6:08', isha: '7:14' },
  { day: 19, date: '2026-03-08', weekday: 'Sun', fajr: '4:53', sunrise: '6:02', zuhr: '12:08', asrShafi: '3:20', asrHanafi: '4:22', maghrib: '6:08', isha: '7:14' },
  { day: 20, date: '2026-03-09', weekday: 'Mon', fajr: '4:53', sunrise: '6:02', zuhr: '12:08', asrShafi: '3:19', asrHanafi: '4:22', maghrib: '6:07', isha: '7:14' },
  { day: 21, date: '2026-03-10', weekday: 'Tue', fajr: '4:52', sunrise: '6:02', zuhr: '12:08', asrShafi: '3:18', asrHanafi: '4:22', maghrib: '6:07', isha: '7:14' },
  { day: 22, date: '2026-03-11', weekday: 'Wed', fajr: '4:52', sunrise: '6:01', zuhr: '12:08', asrShafi: '3:18', asrHanafi: '4:21', maghrib: '6:07', isha: '7:14' },
  { day: 23, date: '2026-03-12', weekday: 'Thu', fajr: '4:51', sunrise: '6:01', zuhr: '12:07', asrShafi: '3:17', asrHanafi: '4:21', maghrib: '6:07', isha: '7:13' },
  { day: 24, date: '2026-03-13', weekday: 'Fri', fajr: '4:51', sunrise: '6:00', zuhr: '12:07', asrShafi: '3:16', asrHanafi: '4:21', maghrib: '6:07', isha: '7:13' },
  { day: 25, date: '2026-03-14', weekday: 'Sat', fajr: '4:51', sunrise: '6:00', zuhr: '12:07', asrShafi: '3:16', asrHanafi: '4:20', maghrib: '6:07', isha: '7:13' },
  { day: 26, date: '2026-03-15', weekday: 'Sun', fajr: '4:50', sunrise: '5:59', zuhr: '12:07', asrShafi: '3:15', asrHanafi: '4:20', maghrib: '6:07', isha: '7:13' },
  { day: 27, date: '2026-03-16', weekday: 'Mon', fajr: '4:50', sunrise: '5:59', zuhr: '12:06', asrShafi: '3:14', asrHanafi: '4:20', maghrib: '6:07', isha: '7:13' },
  { day: 28, date: '2026-03-17', weekday: 'Tue', fajr: '4:49', sunrise: '5:58', zuhr: '12:06', asrShafi: '3:14', asrHanafi: '4:19', maghrib: '6:07', isha: '7:13' },
  { day: 29, date: '2026-03-18', weekday: 'Wed', fajr: '4:49', sunrise: '5:58', zuhr: '12:06', asrShafi: '3:13', asrHanafi: '4:19', maghrib: '6:07', isha: '7:13' },
  { day: 30, date: '2026-03-19', weekday: 'Thu', fajr: '4:48', sunrise: '5:57', zuhr: '12:05', asrShafi: '3:12', asrHanafi: '4:19', maghrib: '6:07', isha: '7:13' },
]

/** Returns today's timetable row, or null if outside Ramadan */
export function getTodayRamadanTimes(): RamadanDay | null {
  const today = new Date().toISOString().split('T')[0]
  return GIT_RAMADAN_1447.find(d => d.date === today) ?? null
}

/** Alias: Returns today's timetable row (used by iftaar page) */
export const getTodayTimetable = getTodayRamadanTimes

/** Returns the current Ramadan day number (1-30), or 0 if outside Ramadan */
export function getRamadanDay(): number {
  const today = new Date().toISOString().split('T')[0]
  const row = GIT_RAMADAN_1447.find(d => d.date === today)
  return row?.day ?? 0
}

/** Returns today's iftaar time string (e.g. "6:08 PM"), or null if outside Ramadan */
export function getTodayIftaarTime(): string | null {
  const row = getTodayRamadanTimes()
  if (!row) return null
  const [h, m] = row.maghrib.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

/** Returns today's suhoor end time string (e.g. "4:58 AM"), or null if outside Ramadan */
export function getTodaySuhoorEnd(): string | null {
  const row = getTodayRamadanTimes()
  if (!row) return null
  const [h, m] = row.fajr.split(':').map(Number)
  return `${h}:${String(m).padStart(2, '0')} AM`
}

export const GIT_REGIONAL_ADJUSTMENTS = [
  { region: 'Skeldon to Letter Kenny', minutes: -4 },
  { region: 'Bloomfield to New Amsterdam', minutes: -3 },
  { region: 'Rosignol to Golden Fleece', minutes: -2 },
  { region: 'Paradise to Buxton', minutes: -1 },
  { region: 'Vreed-en-Hoop to DeKinderen', minutes: +1 },
  { region: 'Zeelugt to Parika, Charity, Pomeroon, Essequibo Coast & Islands', minutes: +2 },
]
