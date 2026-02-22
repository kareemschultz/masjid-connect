import { getPool } from './db'

const CHECKLIST_KEYS = ['fasted', 'quran', 'dhikr', 'prayer', 'masjid']
const PERFECT_BONUS = 50
const STREAK_MULTIPLIERS: [number, number][] = [[21, 2.0], [14, 1.8], [7, 1.5], [3, 1.2]]
const MIN_FOR_STREAK = 3
const PRAYERS_LIST = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']

function parseJsonField(val: any): Record<string, any> {
  if (!val) return {}
  if (typeof val === 'object') return val
  try { return JSON.parse(val) } catch { return {} }
}

export function calcDayPoints(record: any, streakDays: number): number {
  let base = 0

  if (record.fasted) base += 50
  if (record.masjid) base += 40

  const pd = parseJsonField(record.prayer_data)
  const prayerCount = PRAYERS_LIST.filter((p) => pd[p]).length
  const jamaahCount = PRAYERS_LIST.filter((p) => pd[p + '_jamaah']).length
  base += (prayerCount || (record.prayer ? 1 : 0)) * 5 + jamaahCount * 5

  const dd = parseJsonField(record.dhikr_data)
  const dhikrCount = dd.count || 0
  base += dhikrCount > 0 ? Math.min(Math.floor(dhikrCount / 10), 100) : (record.dhikr ? 10 : 0)

  const qd = parseJsonField(record.quran_data)
  const surahCount = (qd.surahs || []).length
  base += surahCount > 0 ? Math.min(surahCount * 10, 100) : (record.quran ? 10 : 0)

  if (base === 0) return 0

  let multiplier = 1
  for (const [min, mult] of STREAK_MULTIPLIERS) {
    if (streakDays >= min) { multiplier = mult; break }
  }

  const itemsDone = CHECKLIST_KEYS.filter((k) => record[k]).length
  return Math.round(base * multiplier) + (itemsDone === 5 ? PERFECT_BONUS : 0)
}

export function calcTotalPoints(rows: any[]): number {
  const sorted = [...rows].sort((a, b) => String(a.date).localeCompare(String(b.date)))
  let total = 0
  for (let i = 0; i < sorted.length; i++) {
    let streak = 0
    for (let j = i - 1; j >= 0; j--) {
      const count = CHECKLIST_KEYS.filter((k) => sorted[j][k]).length
      if (count >= MIN_FOR_STREAK) streak++
      else break
    }
    total += calcDayPoints(sorted[i], streak)
  }
  return total
}

export const LEVELS = [
  { min: 4000, level: 5, label: 'Champion', arabic: 'البطل' },
  { min: 2500, level: 4, label: 'Illuminated', arabic: 'المنير' },
  { min: 1000, level: 3, label: 'Steadfast', arabic: 'الصابر' },
  { min: 300, level: 2, label: 'Devoted', arabic: 'المحسن' },
  { min: 0, level: 1, label: 'Seeker', arabic: 'المبتدئ' },
]

export function getLevel(pts: number) {
  return LEVELS.find((l) => pts >= l.min) || LEVELS[LEVELS.length - 1]
}

export function calcStatsFromRows(userId: string, rows: any[]) {
  const total = calcTotalPoints(rows)
  let streak = 0
  const today = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const byDate = Object.fromEntries(rows.map((r) => [String(r.date).slice(0, 10), r]))
  const d = new Date(today)
  d.setDate(d.getDate() - 1)
  while (streak < 30) {
    const key = d.toISOString().slice(0, 10)
    const rec = byDate[key]
    if (!rec) break
    const count = CHECKLIST_KEYS.filter((k) => rec[k]).length
    if (count < MIN_FOR_STREAK) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return { totalPoints: total, streak, level: getLevel(total) }
}

export async function getUserStats(userId: string) {
  const pool = getPool()
  const trackRes = await pool.query('SELECT * FROM ramadan_tracking WHERE user_id = $1 ORDER BY date ASC', [userId])
  return calcStatsFromRows(userId, trackRes.rows)
}

export async function getUserStatsBatch(userIds: string[]) {
  if (!userIds.length) return new Map()
  const pool = getPool()
  const trackRes = await pool.query(
    'SELECT * FROM ramadan_tracking WHERE user_id = ANY($1) ORDER BY user_id, date ASC',
    [userIds]
  )
  const rowsByUser: Record<string, any[]> = {}
  for (const row of trackRes.rows) {
    if (!rowsByUser[row.user_id]) rowsByUser[row.user_id] = []
    rowsByUser[row.user_id].push(row)
  }
  const result = new Map()
  for (const uid of userIds) {
    result.set(uid, calcStatsFromRows(uid, rowsByUser[uid] || []))
  }
  return result
}
