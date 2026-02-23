'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  CheckSquare, Flame, TrendingUp, UtensilsCrossed, Table2, ChevronRight, Share2,
  ChevronDown, ChevronUp, Plus, Minus, Trash2, BookOpen as BookOpenIcon, Heart, Droplets, Moon as MoonIcon,
  BarChart2,
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SettingGroup } from '@/components/setting-group'
import { PRAYER_NAMES, type PrayerName } from '@/lib/prayer-times'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { shareOrCopy } from '@/lib/share'
import Link from 'next/link'

/* ─── types ─── */
type PrayerLog = Record<string, Record<PrayerName, boolean>>
type QuranLog = Record<string, { pages: number }>
type SadaqahEntry = { amount: number; type: string }
type SadaqahLog = Record<string, SadaqahEntry[]>
type GoodDeedsLog = Record<string, string[]>
type SleepLog = Record<string, number>
type WaterLog = Record<string, number>
type AdhkarLog = Record<string, { morning: boolean; evening: boolean }>
type IstighfarLog = Record<string, number>

/* ─── helpers ─── */
function dateKey(d: Date): string {
  const gyt = new Date(d.getTime() - 4 * 60 * 60 * 1000)
  return gyt.toISOString().split('T')[0]
}

function getWeekDates(): Date[] {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((day + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const SADAQAH_TYPES = ['Sadaqah', 'Zakat', 'Sadaqah Jariyah', 'Feed Someone', 'Other']

const PRESET_DEEDS = [
  'Visited sick',
  'Fed someone',
  'Helped a neighbor',
  'Called parents',
  'Smiled at a Muslim',
  'Removed harm from path',
]

async function syncToServer(date: string, prayers: Record<PrayerName, boolean>) {
  try {
    await fetch('/api/tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, prayer_data: prayers }),
    })
  } catch {
    // Silently fail — local data is the source of truth for offline use
  }
}

/* ─── month pages helper ─── */
function monthPages(log: QuranLog): number {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `${year}-${month}`
  let total = 0
  for (const [k, v] of Object.entries(log)) {
    if (k.startsWith(prefix)) total += v.pages
  }
  return total
}

export default function TrackerPage() {
  /* ── prayer tracker state ── */
  const [log, setLog] = useState<PrayerLog>({})
  const [synced, setSynced] = useState(false)
  const today = dateKey(new Date())
  const weekDates = useMemo(() => getWeekDates(), [])

  /* ── ibadah tracker states ── */
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [quranLog, setQuranLog] = useState<QuranLog>({})
  const [sadaqahLog, setSadaqahLog] = useState<SadaqahLog>({})
  const [sadaqahAmount, setSadaqahAmount] = useState('')
  const [sadaqahType, setSadaqahType] = useState('Sadaqah')
  const [goodDeedsLog, setGoodDeedsLog] = useState<GoodDeedsLog>({})
  const [customDeed, setCustomDeed] = useState('')
  const [sleepLog, setSleepLog] = useState<SleepLog>({})
  const [waterLog, setWaterLog] = useState<WaterLog>({})
  const [istighfarLog, setIstighfarLog] = useState<IstighfarLog>({})
  const [adhkarLog, setAdhkarLog] = useState<AdhkarLog>({})

  /* ── toggle section helper ── */
  const toggleSection = useCallback((key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  /* ── load prayer log ── */
  useEffect(() => {
    const localLog = getItem<PrayerLog>(KEYS.PRAYER_LOG, {})
    setLog(localLog)

    fetch('/api/tracking')
      .then(res => res.ok ? res.json() : [])
      .then((rows: any[]) => {
        if (!Array.isArray(rows) || rows.length === 0) return
        const merged = { ...localLog }
        for (const row of rows) {
          const dateStr = String(row.date).slice(0, 10)
          let prayerData: Record<PrayerName, boolean> = {} as Record<PrayerName, boolean>
          if (row.prayer_data) {
            try {
              prayerData = typeof row.prayer_data === 'string'
                ? JSON.parse(row.prayer_data)
                : row.prayer_data
            } catch { /* skip */ }
          }
          if (dateStr !== today) {
            merged[dateStr] = prayerData
          } else if (!merged[dateStr]) {
            merged[dateStr] = prayerData
          }
        }
        setLog(merged)
        setItem(KEYS.PRAYER_LOG, merged)
      })
      .catch(() => { /* offline */ })
      .finally(() => setSynced(true))
  }, [today])

  /* ── load ibadah logs ── */
  useEffect(() => {
    setQuranLog(getItem<QuranLog>(KEYS.QURAN_LOG, {}))
    setSadaqahLog(getItem<SadaqahLog>(KEYS.SADAQAH_LOG, {}))
    setGoodDeedsLog(getItem<GoodDeedsLog>(KEYS.GOOD_DEEDS_LOG, {}))
    setSleepLog(getItem<SleepLog>(KEYS.SLEEP_LOG, {}))
    setWaterLog(getItem<WaterLog>(KEYS.WATER_LOG, {}))
    setIstighfarLog(getItem<IstighfarLog>(KEYS.ISTIGHFAR_COUNT, {}))
    setAdhkarLog(getItem<AdhkarLog>(KEYS.ADHKAR_LOG, {}))
  }, [])

  /* ── prayer toggle ── */
  const togglePrayer = useCallback((prayer: PrayerName) => {
    setLog(prev => {
      const dayLog = prev[today] || ({} as Record<PrayerName, boolean>)
      const updated: PrayerLog = {
        ...prev,
        [today]: { ...dayLog, [prayer]: !dayLog[prayer] },
      }
      setItem(KEYS.PRAYER_LOG, updated)

      let streak = 0
      const d = new Date()
      while (streak < 30) {
        const key = dateKey(d)
        const dayData = updated[key]
        if (dayData && PRAYER_NAMES.every((p) => dayData[p])) {
          streak++
          d.setDate(d.getDate() - 1)
        } else {
          break
        }
      }
      setItem(KEYS.STREAK, streak)
      syncToServer(today, updated[today])
      return updated
    })
  }, [today])

  /* ── Quran helpers ── */
  const quranToday = quranLog[today]?.pages ?? 0
  const adjustQuran = useCallback((delta: number) => {
    setQuranLog(prev => {
      const current = prev[today]?.pages ?? 0
      const next = Math.max(0, current + delta)
      const updated = { ...prev, [today]: { pages: next } }
      setItem(KEYS.QURAN_LOG, updated)
      return updated
    })
  }, [today])

  /* ── Sadaqah helpers ── */
  const sadaqahToday = sadaqahLog[today] ?? []
  const sadaqahTodayTotal = sadaqahToday.reduce((s, e) => s + e.amount, 0)
  const addSadaqah = useCallback(() => {
    const amt = parseFloat(sadaqahAmount)
    if (!amt || amt <= 0) return
    setSadaqahLog(prev => {
      const existing = prev[today] ?? []
      const updated = { ...prev, [today]: [...existing, { amount: amt, type: sadaqahType }] }
      setItem(KEYS.SADAQAH_LOG, updated)
      return updated
    })
    setSadaqahAmount('')
  }, [sadaqahAmount, sadaqahType, today])
  const removeSadaqah = useCallback((idx: number) => {
    setSadaqahLog(prev => {
      const existing = [...(prev[today] ?? [])]
      existing.splice(idx, 1)
      const updated = { ...prev, [today]: existing }
      setItem(KEYS.SADAQAH_LOG, updated)
      return updated
    })
  }, [today])

  /* ── Good Deeds helpers ── */
  const deedsToday = goodDeedsLog[today] ?? []
  const toggleDeed = useCallback((deed: string) => {
    setGoodDeedsLog(prev => {
      const existing = prev[today] ?? []
      const has = existing.includes(deed)
      const updated = {
        ...prev,
        [today]: has ? existing.filter(d => d !== deed) : [...existing, deed],
      }
      setItem(KEYS.GOOD_DEEDS_LOG, updated)
      return updated
    })
  }, [today])
  const addCustomDeed = useCallback(() => {
    const trimmed = customDeed.trim()
    if (!trimmed) return
    setGoodDeedsLog(prev => {
      const existing = prev[today] ?? []
      if (existing.includes(trimmed)) return prev
      const updated = { ...prev, [today]: [...existing, trimmed] }
      setItem(KEYS.GOOD_DEEDS_LOG, updated)
      return updated
    })
    setCustomDeed('')
  }, [customDeed, today])

  /* ── Sleep & Water helpers ── */
  const sleepToday = sleepLog[today] ?? 0
  const waterToday = waterLog[today] ?? 0
  const adjustSleep = useCallback((delta: number) => {
    setSleepLog(prev => {
      const next = Math.min(12, Math.max(0, (prev[today] ?? 0) + delta))
      const updated = { ...prev, [today]: next }
      setItem(KEYS.SLEEP_LOG, updated)
      return updated
    })
  }, [today])
  const adjustWater = useCallback((delta: number) => {
    setWaterLog(prev => {
      const next = Math.min(20, Math.max(0, (prev[today] ?? 0) + delta))
      const updated = { ...prev, [today]: next }
      setItem(KEYS.WATER_LOG, updated)
      return updated
    })
  }, [today])

  /* ── Istighfar helpers ── */
  const istighfarToday = istighfarLog[today] ?? 0
  const incrementIstighfar = useCallback(() => {
    setIstighfarLog(prev => {
      const updated = { ...prev, [today]: (prev[today] ?? 0) + 1 }
      setItem(KEYS.ISTIGHFAR_COUNT, updated)
      return updated
    })
  }, [today])
  const resetIstighfar = useCallback(() => {
    setIstighfarLog(prev => {
      const updated = { ...prev, [today]: 0 }
      setItem(KEYS.ISTIGHFAR_COUNT, updated)
      return updated
    })
  }, [today])

  /* ── Adhkar helpers ── */
  const adhkarToday = adhkarLog[today] ?? { morning: false, evening: false }
  const toggleAdhkar = useCallback((period: 'morning' | 'evening') => {
    setAdhkarLog(prev => {
      const current = prev[today] ?? { morning: false, evening: false }
      const updated = { ...prev, [today]: { ...current, [period]: !current[period] } }
      setItem(KEYS.ADHKAR_LOG, updated)
      return updated
    })
  }, [today])

  /* ── weekly prayer stats for chart ── */
  const weeklyStats = useMemo(() => {
    return weekDates.map((date) => {
      const key = dateKey(date)
      const dayData = log[key]
      const count = dayData ? PRAYER_NAMES.filter((p) => dayData[p]).length : 0
      const hasFajr = dayData ? !!dayData['Fajr' as PrayerName] : false
      return { date, key, count, hasFajr }
    })
  }, [weekDates, log])

  const weekAverage = useMemo(() => {
    const pastDays = weeklyStats.filter(s => s.date <= new Date())
    if (pastDays.length === 0) return 0
    return pastDays.reduce((sum, s) => sum + s.count, 0) / pastDays.length
  }, [weeklyStats])

  const prayerStreak = useMemo(() => {
    let count = 0
    const d = new Date()
    while (count < 365) {
      const key = dateKey(d)
      const dayData = log[key]
      if (dayData && PRAYER_NAMES.some((p) => dayData[p])) {
        count++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    return count
  }, [log])

  const bestDay = useMemo(() => {
    let best = { label: '-', count: 0 }
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    for (const s of weeklyStats) {
      if (s.count > best.count) {
        best = { label: dayNames[s.date.getDay()], count: s.count }
      }
    }
    return best
  }, [weeklyStats])

  const fajrRate = useMemo(() => {
    const pastDays = weeklyStats.filter(s => s.date <= new Date())
    if (pastDays.length === 0) return 0
    const fajrCount = pastDays.filter(s => s.hasFajr).length
    return Math.round((fajrCount / pastDays.length) * 100)
  }, [weeklyStats])

  /* ── derived prayer stats ── */
  const todayLog = log[today] || ({} as Record<PrayerName, boolean>)
  const todayCount = PRAYER_NAMES.filter((p) => todayLog[p]).length

  const streak = useMemo(() => {
    let count = 0
    const d = new Date()
    d.setDate(d.getDate() - 1)
    while (count < 30) {
      const key = dateKey(d)
      const dayData = log[key]
      if (dayData && PRAYER_NAMES.every((p) => dayData[p])) {
        count++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    if (todayCount === 5) count++
    return count
  }, [log, todayCount])

  const monthStats = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let totalPossible = 0
    let totalPrayed = 0
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day)
      if (d > now) break
      totalPossible += 5
      const key = dateKey(d)
      const dayData = log[key]
      if (dayData) totalPrayed += PRAYER_NAMES.filter((p) => dayData[p]).length
    }
    return totalPossible > 0 ? Math.round((totalPrayed / totalPossible) * 100) : 0
  }, [log])

  const PRAYER_COLORS: Record<PrayerName, { bg: string }> = {
    Fajr: { bg: 'bg-blue-500/20' },
    Dhuhr: { bg: 'bg-amber-500/20' },
    Asr: { bg: 'bg-orange-500/20' },
    Maghrib: { bg: 'bg-red-500/20' },
    Isha: { bg: 'bg-indigo-500/20' },
  }

  /* ── section header renderer ── */
  const SectionHeader = ({ id, emoji, title, summary }: { id: string; emoji: string; title: string; summary: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="flex w-full items-center justify-between p-4"
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-gray-200">
        <span>{emoji}</span> {title}
      </span>
      <span className="flex items-center gap-2">
        <span className="text-[11px] text-gray-400">{summary}</span>
        {openSections[id] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </span>
    </button>
  )

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={CheckSquare}
        title="Prayer Tracker"
        subtitle="Track Your Salah"
        gradient="from-blue-900 to-indigo-900"
      />

      <div className="space-y-5 px-4 pt-5">
        {/* ── Prayer Statistics ── */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">Prayer Statistics</span>
          </div>

          {/* 7-day bar chart */}
          <div className="flex items-end justify-between gap-1.5 h-[60px] mb-2">
            {weeklyStats.map((s, i) => {
              const height = s.count > 0 ? (s.count / 5) * 100 : 4
              const isToday = s.key === today
              const barColor = s.count === 5 ? 'bg-emerald-500' : s.count >= 3 ? 'bg-amber-500' : s.count >= 1 ? 'bg-rose-500' : 'bg-gray-700'
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className={`w-full rounded-t-md transition-all ${barColor} ${isToday ? 'ring-2 ring-emerald-400/50' : ''}`} style={{ height: `${height}%`, minHeight: '2px' }} />
                </div>
              )
            })}
          </div>
          <div className="flex justify-between gap-1.5 mb-3">
            {DAY_LABELS.map((label, i) => (
              <div key={i} className={`flex-1 text-center text-[10px] font-medium ${weeklyStats[i]?.key === today ? 'text-emerald-400' : 'text-gray-500'}`}>{label}</div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400">Week Average: <span className="font-bold text-white">{weekAverage.toFixed(1)}/5</span> prayers</p>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-3 text-center">
              <p className="text-lg font-bold text-amber-400">{prayerStreak}</p>
              <p className="text-[10px] text-gray-500">Day Streak</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-3 text-center">
              <p className="text-lg font-bold text-emerald-400">{bestDay.count > 0 ? `${bestDay.label}` : '-'}</p>
              <p className="text-[10px] text-gray-500">Best Day</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-3 text-center">
              <p className="text-lg font-bold text-blue-400">{fajrRate}%</p>
              <p className="text-[10px] text-gray-500">Fajr Rate</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
              <Flame className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{streak}</p>
              <p className="text-[11px] text-gray-400">Day Streak</p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{monthStats}%</p>
              <p className="text-[11px] text-gray-400">This Month</p>
            </div>
          </div>
        </div>

        {/* Sync indicator */}
        {!synced && (
          <p className="text-center text-[11px] text-gray-500 animate-pulse">Syncing with server...</p>
        )}

        {/* Share */}
        <button
          onClick={() => shareOrCopy({
            title: 'Prayer Streak',
            text: `I prayed ${todayCount}/5 prayers today on MasjidConnect GY! Current streak: ${streak} days.\n\nvia MasjidConnect GY`,
          })}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-3 text-sm font-medium text-emerald-400 transition-all active:scale-[0.98]"
        >
          <Share2 className="h-4 w-4" /> Share Today&apos;s Progress
        </button>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/tracker/fasting" className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3.5 transition-all active:scale-[0.98]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20">
              <UtensilsCrossed className="h-4 w-4 text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-[#f9fafb]">Fasting</div>
              <div className="text-[10px] text-gray-500">Track fasts</div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
          </Link>
          <Link href="/timetable" className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3.5 transition-all active:scale-[0.98]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20">
              <Table2 className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-[#f9fafb]">Timetable</div>
              <div className="text-[10px] text-gray-500">Monthly view</div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
          </Link>
        </div>

        {/* Today's Prayers */}
        <SettingGroup label="Today's Prayers" accentColor="bg-blue-500">
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">{todayCount}/5 completed</span>
              <span className="text-xs font-medium text-emerald-400">
                {todayCount === 5 ? 'All done! 🎉' : `${5 - todayCount} remaining`}
              </span>
            </div>

            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${(todayCount / 5) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {PRAYER_NAMES.map((prayer) => {
                const prayed = todayLog[prayer]
                const colors = PRAYER_COLORS[prayer]
                return (
                  <button
                    key={prayer}
                    onClick={() => togglePrayer(prayer)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-2 py-4 transition-all active:scale-95 ${
                      prayed ? 'border-emerald-500/30 bg-emerald-500/10' : `border-gray-800 ${colors.bg}`
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                      prayed ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {prayed
                        ? <CheckSquare className="h-4 w-4" />
                        : <div className="h-3 w-3 rounded-full border-2 border-gray-500" />
                      }
                    </div>
                    <span className={`text-[11px] font-semibold ${prayed ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {prayer}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </SettingGroup>

        {/* Weekly View */}
        <SettingGroup label="This Week" accentColor="bg-purple-500">
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1.5">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="text-center text-[10px] font-medium text-gray-500">{label}</div>
              ))}
              {weekDates.map((date, i) => {
                const key = dateKey(date)
                const dayData = log[key]
                const count = dayData ? PRAYER_NAMES.filter((p) => dayData[p]).length : 0
                const isToday = key === today
                const allDone = count === 5
                const future = date > new Date()
                return (
                  <div key={i} className={`flex flex-col items-center gap-1 rounded-xl py-2 ${isToday ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''}`}>
                    <span className={`text-xs font-medium ${isToday ? 'text-emerald-400' : 'text-gray-300'}`}>{date.getDate()}</span>
                    {future
                      ? <div className="h-2 w-2 rounded-full bg-gray-700" />
                      : allDone
                        ? <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        : count > 0
                          ? <div className="h-2 w-2 rounded-full bg-amber-500" />
                          : <div className="h-2 w-2 rounded-full bg-red-500/50" />
                    }
                    <span className="text-[9px] text-gray-500">{count}/5</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> All done</span>
              <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> Partial</span>
              <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500/50" /> Missed</span>
            </div>
          </div>
        </SettingGroup>

        {/* Monthly Stats */}
        <SettingGroup label="Monthly Overview" accentColor="bg-teal-500">
          <div className="flex items-center gap-4 p-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2937" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${monthStats}, 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-lg font-bold text-emerald-400">{monthStats}%</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
              <p className="mt-1 text-xs text-gray-400">Consistency is key to building a strong prayer habit.</p>
            </div>
          </div>
        </SettingGroup>

        {/* ═══════════════════════════════════════════════════════════
            IBADAH TRACKER SECTIONS
           ═══════════════════════════════════════════════════════════ */}

        {/* SECTION 1: Quran Today */}
        <SettingGroup label="Quran Today" accentColor="bg-sky-500">
          <SectionHeader
            id="quran"
            emoji="📖"
            title="Quran Today"
            summary={`Total this month: ${monthPages(quranLog)} pages`}
          />
          {openSections.quran && (
            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => adjustQuran(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-gray-800 text-gray-300 transition-all active:scale-90"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-sky-400">{quranToday}</span>
                  <span className="text-[11px] text-gray-500">pages today</span>
                </div>
                <button
                  onClick={() => adjustQuran(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-gray-800 text-gray-300 transition-all active:scale-90"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </SettingGroup>

        {/* SECTION 2: Sadaqah */}
        <SettingGroup label="Sadaqah" accentColor="bg-emerald-500">
          <SectionHeader
            id="sadaqah"
            emoji="💧"
            title="Sadaqah"
            summary={sadaqahTodayTotal > 0 ? `GYD ${sadaqahTodayTotal.toLocaleString()} today` : 'None today'}
          />
          {openSections.sadaqah && (
            <div className="border-t border-gray-800 p-4 space-y-4">
              {/* Amount input */}
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-gray-400">Amount (GYD)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={sadaqahAmount}
                  onChange={e => setSadaqahAmount(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              {/* Type pills */}
              <div className="flex flex-wrap gap-2">
                {SADAQAH_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setSadaqahType(t)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                      sadaqahType === t
                        ? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                        : 'border border-gray-700 bg-gray-800 text-gray-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Add button */}
              <button
                onClick={addSadaqah}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/20 py-2.5 text-sm font-medium text-emerald-400 transition-all active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" /> Add
              </button>

              {/* Today's entries */}
              {sadaqahToday.length > 0 && (
                <div className="space-y-2">
                  {sadaqahToday.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5">
                      <div>
                        <span className="text-sm font-medium text-gray-200">GYD {entry.amount.toLocaleString()}</span>
                        <span className="ml-2 text-[11px] text-gray-500">{entry.type}</span>
                      </div>
                      <button onClick={() => removeSadaqah(idx)} className="text-red-400/70 transition-all hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </SettingGroup>

        {/* SECTION 3: Good Deeds */}
        <SettingGroup label="Good Deeds" accentColor="bg-pink-500">
          <SectionHeader
            id="deeds"
            emoji="🤲"
            title="Good Deeds"
            summary={`${deedsToday.length} today`}
          />
          {openSections.deeds && (
            <div className="border-t border-gray-800 p-4 space-y-4">
              {/* Preset deed chips */}
              <div className="flex flex-wrap gap-2">
                {PRESET_DEEDS.map(deed => {
                  const active = deedsToday.includes(deed)
                  return (
                    <button
                      key={deed}
                      onClick={() => toggleDeed(deed)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                        active
                          ? 'border border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                          : 'border border-gray-700 bg-gray-800 text-gray-400'
                      }`}
                    >
                      {deed}
                    </button>
                  )
                })}
              </div>

              {/* Custom deed input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDeed}
                  onChange={e => setCustomDeed(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomDeed()}
                  placeholder="Add a custom deed..."
                  className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                />
                <button
                  onClick={addCustomDeed}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 transition-all active:scale-90"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Active custom deeds (non-preset) */}
              {deedsToday.filter(d => !PRESET_DEEDS.includes(d)).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {deedsToday.filter(d => !PRESET_DEEDS.includes(d)).map(deed => (
                    <button
                      key={deed}
                      onClick={() => toggleDeed(deed)}
                      className="rounded-full border border-emerald-500/50 bg-emerald-500/15 px-3 py-1.5 text-[11px] font-medium text-emerald-400 transition-all"
                    >
                      {deed} &times;
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </SettingGroup>

        {/* SECTION 4: Sleep & Water */}
        <SettingGroup label="Sleep & Water" accentColor="bg-violet-500">
          <SectionHeader
            id="sleepwater"
            emoji="😴"
            title="Sleep & Water"
            summary={`${sleepToday}h / ${waterToday} glasses`}
          />
          {openSections.sleepwater && (
            <div className="border-t border-gray-800 p-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Sleep stepper */}
                <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/40 p-4">
                  <MoonIcon className="h-5 w-5 text-violet-400" />
                  <span className="text-[11px] font-medium text-gray-400">Sleep</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => adjustSleep(-0.5)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 transition-all active:scale-90"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[3rem] text-center text-xl font-bold text-violet-400">{sleepToday}h</span>
                    <button
                      onClick={() => adjustSleep(0.5)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 transition-all active:scale-90"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Water stepper */}
                <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/40 p-4">
                  <Droplets className="h-5 w-5 text-cyan-400" />
                  <span className="text-[11px] font-medium text-gray-400">Water</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => adjustWater(-1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 transition-all active:scale-90"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[3rem] text-center text-xl font-bold text-cyan-400">{waterToday}</span>
                    <button
                      onClick={() => adjustWater(1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 transition-all active:scale-90"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SettingGroup>

        {/* SECTION 5: Istighfar Counter */}
        <SettingGroup label="Istighfar Counter" accentColor="bg-amber-500">
          <SectionHeader
            id="istighfar"
            emoji="🔢"
            title="Istighfar Counter"
            summary={`${istighfarToday} / 100`}
          />
          {openSections.istighfar && (
            <div className="border-t border-gray-800 p-4">
              <div className="flex flex-col items-center gap-4">
                {/* Large circular counter button */}
                <button
                  onClick={incrementIstighfar}
                  className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-amber-500/30 bg-amber-500/10 transition-all active:scale-95 active:bg-amber-500/20"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-amber-400">{istighfarToday}</span>
                    <span className="text-[10px] text-gray-400">tap to count</span>
                  </div>
                  {/* Progress ring */}
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray={`${Math.min(istighfarToday, 100)}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <p className="text-sm text-gray-300">
                  <span className="font-medium text-amber-400">{istighfarToday}</span> Astaghfirullah today
                </p>
                <p className="text-[11px] text-gray-500">Target: 100</p>

                {/* Reset button */}
                <button
                  onClick={resetIstighfar}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-1.5 text-[11px] font-medium text-gray-400 transition-all active:scale-95"
                >
                  Reset today
                </button>
              </div>
            </div>
          )}
        </SettingGroup>

        {/* SECTION 6: Adhkar */}
        <SettingGroup label="Adhkar" accentColor="bg-lime-500">
          <SectionHeader
            id="adhkar"
            emoji="📿"
            title="Adhkar"
            summary={
              adhkarToday.morning && adhkarToday.evening
                ? 'Both done'
                : adhkarToday.morning
                  ? 'Morning done'
                  : adhkarToday.evening
                    ? 'Evening done'
                    : 'Not started'
            }
          />
          {openSections.adhkar && (
            <div className="border-t border-gray-800 p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Morning card */}
                <button
                  onClick={() => toggleAdhkar('morning')}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all active:scale-95 ${
                    adhkarToday.morning
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <span className="text-2xl">🌅</span>
                  <span className={`text-sm font-semibold ${adhkarToday.morning ? 'text-emerald-400' : 'text-gray-400'}`}>
                    Morning
                  </span>
                  <span className={`text-[10px] ${adhkarToday.morning ? 'text-emerald-500/70' : 'text-gray-600'}`}>
                    {adhkarToday.morning ? 'Completed' : 'Tap to mark'}
                  </span>
                </button>

                {/* Evening card */}
                <button
                  onClick={() => toggleAdhkar('evening')}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all active:scale-95 ${
                    adhkarToday.evening
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <span className="text-2xl">🌙</span>
                  <span className={`text-sm font-semibold ${adhkarToday.evening ? 'text-emerald-400' : 'text-gray-400'}`}>
                    Evening
                  </span>
                  <span className={`text-[10px] ${adhkarToday.evening ? 'text-emerald-500/70' : 'text-gray-600'}`}>
                    {adhkarToday.evening ? 'Completed' : 'Tap to mark'}
                  </span>
                </button>
              </div>

              <Link
                href="/explore/adhkar"
                className="flex items-center justify-center gap-2 rounded-xl border border-lime-500/20 bg-lime-500/10 py-2.5 text-sm font-medium text-lime-400 transition-all active:scale-[0.98]"
              >
                <BookOpenIcon className="h-4 w-4" /> Open Adhkar Collection
              </Link>

              <p className="text-center text-[11px] text-gray-500">
                Completing morning &amp; evening adhkar is Sunnah
              </p>
            </div>
          )}
        </SettingGroup>
      </div>

      <BottomNav />
    </div>
  )
}
