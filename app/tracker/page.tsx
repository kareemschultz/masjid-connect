'use client'

import { useEffect, useState, useMemo } from 'react'
import { CheckSquare, Flame, TrendingUp, Calendar } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SettingGroup } from '@/components/setting-group'
import { PRAYER_NAMES, type PrayerName } from '@/lib/prayer-times'
import { getItem, setItem, KEYS } from '@/lib/storage'

type PrayerLog = Record<string, Record<PrayerName, boolean>>

function dateKey(d: Date): string {
  return d.toISOString().split('T')[0]
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

export default function TrackerPage() {
  const [log, setLog] = useState<PrayerLog>({})
  const today = dateKey(new Date())
  const weekDates = useMemo(() => getWeekDates(), [])

  useEffect(() => {
    setLog(getItem(KEYS.PRAYER_LOG, {}))
  }, [])

  const togglePrayer = (prayer: PrayerName) => {
    const dayLog = log[today] || ({} as Record<PrayerName, boolean>)
    const updated: PrayerLog = {
      ...log,
      [today]: { ...dayLog, [prayer]: !dayLog[prayer] },
    }
    setLog(updated)
    setItem(KEYS.PRAYER_LOG, updated)

    // Update streak
    let streak = 0
    const d = new Date()
    while (true) {
      const key = dateKey(d)
      const dayData = key === today ? updated[key] : log[key]
      if (dayData && PRAYER_NAMES.every((p) => dayData[p])) {
        streak++
        d.setDate(d.getDate() - 1)
      } else if (key !== today) {
        break
      } else {
        break
      }
    }
    setItem(KEYS.STREAK, streak)
  }

  const todayLog = log[today] || ({} as Record<PrayerName, boolean>)
  const todayCount = PRAYER_NAMES.filter((p) => todayLog[p]).length

  // Calculate streak
  const streak = useMemo(() => {
    let count = 0
    const d = new Date()
    d.setDate(d.getDate() - 1) // start from yesterday for completed days
    while (true) {
      const key = dateKey(d)
      const dayData = log[key]
      if (dayData && PRAYER_NAMES.every((p) => dayData[p])) {
        count++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    // check if today is complete too
    if (todayCount === 5) count++
    return count
  }, [log, todayCount])

  // Monthly stats
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
      if (dayData) {
        totalPrayed += PRAYER_NAMES.filter((p) => dayData[p]).length
      }
    }

    return totalPossible > 0 ? Math.round((totalPrayed / totalPossible) * 100) : 0
  }, [log])

  const PRAYER_COLORS: Record<PrayerName, { bg: string; ring: string }> = {
    Fajr: { bg: 'bg-blue-500/20', ring: 'ring-blue-500' },
    Dhuhr: { bg: 'bg-amber-500/20', ring: 'ring-amber-500' },
    Asr: { bg: 'bg-orange-500/20', ring: 'ring-orange-500' },
    Maghrib: { bg: 'bg-red-500/20', ring: 'ring-red-500' },
    Isha: { bg: 'bg-indigo-500/20', ring: 'ring-indigo-500' },
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={CheckSquare}
        title="Prayer Tracker"
        subtitle="Track Your Salah"
        gradient="from-blue-900 to-indigo-900"
      />

      <div className="space-y-5 px-4 pt-5">
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

        {/* Today's Prayers */}
        <SettingGroup label="Today's Prayers" accentColor="bg-blue-500">
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {todayCount}/5 completed
              </span>
              <span className="text-xs font-medium text-emerald-400">
                {todayCount === 5 ? 'All done!' : `${5 - todayCount} remaining`}
              </span>
            </div>

            {/* Progress */}
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${(todayCount / 5) * 100}%` }}
              />
            </div>

            {/* Prayer buttons */}
            <div className="grid grid-cols-5 gap-2">
              {PRAYER_NAMES.map((prayer) => {
                const prayed = todayLog[prayer]
                const colors = PRAYER_COLORS[prayer]

                return (
                  <button
                    key={prayer}
                    onClick={() => togglePrayer(prayer)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-2 py-4 transition-all active:scale-95 ${
                      prayed
                        ? `border-emerald-500/30 bg-emerald-500/10`
                        : `border-gray-800 ${colors.bg}`
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                        prayed ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {prayed ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border-2 border-gray-500" />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        prayed ? 'text-emerald-400' : 'text-gray-400'
                      }`}
                    >
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
              {/* Day labels */}
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="text-center text-[10px] font-medium text-gray-500">
                  {label}
                </div>
              ))}

              {/* Day cells */}
              {weekDates.map((date, i) => {
                const key = dateKey(date)
                const dayData = log[key]
                const count = dayData ? PRAYER_NAMES.filter((p) => dayData[p]).length : 0
                const isToday = key === today
                const allDone = count === 5
                const future = date > new Date()

                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-1 rounded-xl py-2 ${
                      isToday ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''
                    }`}
                  >
                    <span className={`text-xs font-medium ${isToday ? 'text-emerald-400' : 'text-gray-300'}`}>
                      {date.getDate()}
                    </span>
                    {future ? (
                      <div className="h-2 w-2 rounded-full bg-gray-700" />
                    ) : allDone ? (
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    ) : count > 0 ? (
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-red-500/50" />
                    )}
                    <span className="text-[9px] text-gray-500">{count}/5</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" /> All done
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-amber-500" /> Partial
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500/50" /> Missed
              </span>
            </div>
          </div>
        </SettingGroup>

        {/* Monthly Stats */}
        <SettingGroup label="Monthly Overview" accentColor="bg-teal-500">
          <div className="flex items-center gap-4 p-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={`${monthStats}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-lg font-bold text-emerald-400">{monthStats}%</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Keep going! Consistency is key to building a strong prayer habit.
              </p>
            </div>
          </div>
        </SettingGroup>
      </div>

      <BottomNav />
    </div>
  )
}
