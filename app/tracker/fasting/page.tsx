'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { UtensilsCrossed, ChevronLeft, ChevronRight, Flame, Check, X, Target, Share2, Moon, Sun, Calendar } from 'lucide-react'
import { shareOrCopy } from '@/lib/share'

type FastStatus = 'fasted' | 'missed' | 'intended' | null

type FastType = 'ramadan' | 'shawwal' | 'monthu' | 'ayyam' | 'voluntary'

const FAST_TYPES: { key: FastType; label: string }[] = [
  { key: 'ramadan', label: 'Ramadan' },
  { key: 'shawwal', label: 'Shawwal' },
  { key: 'monthu', label: 'Mon & Thu' },
  { key: 'ayyam', label: 'Ayyam al-Bayd' },
  { key: 'voluntary', label: 'Voluntary' },
]

const STORAGE_KEYS: Record<FastType, string> = {
  ramadan: KEYS.FASTING_LOG_RAMADAN,
  shawwal: KEYS.FASTING_LOG_SHAWWAL,
  monthu: KEYS.FASTING_LOG_MONTHU,
  ayyam: KEYS.FASTING_LOG_AYYAM,
  voluntary: KEYS.FASTING_LOG_VOLUNTARY,
}

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function dateKey(d: Date): string {
  return d.toISOString().split('T')[0]
}

export default function FastingTrackerPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [log, setLog] = useState<Record<string, FastStatus>>({})
  const [streak, setStreak] = useState(0)
  const [showTick, setShowTick] = useState('')
  const [fastType, setFastType] = useState<FastType>('ramadan')
  const [mounted, setMounted] = useState(false)

  // Load fast type from localStorage on mount
  useEffect(() => {
    const savedType = getItem<FastType>(KEYS.FASTING_TYPE, 'ramadan')
    setFastType(savedType)
    setMounted(true)
  }, [])

  // Load the log for the current fast type
  useEffect(() => {
    if (!mounted) return
    const storageKey = STORAGE_KEYS[fastType]
    // Migrate old fasting_log data to ramadan key if ramadan key is empty
    if (fastType === 'ramadan') {
      const ramadanLog = getItem<Record<string, FastStatus>>(storageKey, {})
      if (Object.keys(ramadanLog).length === 0) {
        const oldLog = getItem<Record<string, FastStatus>>(KEYS.FASTING_LOG, {})
        if (Object.keys(oldLog).length > 0) {
          setItem(storageKey, oldLog)
          setLog(oldLog)
          return
        }
      }
      setLog(ramadanLog)
    } else {
      setLog(getItem<Record<string, FastStatus>>(storageKey, {}))
    }
  }, [fastType, mounted])

  const handleTypeChange = (type: FastType) => {
    setFastType(type)
    setItem(KEYS.FASTING_TYPE, type)
  }

  const calculateStreak = useCallback((data: Record<string, FastStatus>) => {
    let s = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().split('T')[0]
      if (data[key] === 'fasted') { s++; d.setDate(d.getDate() - 1) } else break
    }
    return s
  }, [])

  useEffect(() => { setStreak(calculateStreak(log)) }, [log, calculateStreak])

  const toggleDay = (dateStr: string) => {
    const cycle: FastStatus[] = [null, 'intended', 'fasted', 'missed']
    const current = log[dateStr] || null
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length]
    const updated = { ...log }
    if (next) updated[dateStr] = next; else delete updated[dateStr]
    setLog(updated)
    setItem(STORAGE_KEYS[fastType], updated)
    setShowTick(dateStr)
    setTimeout(() => setShowTick(''), 300)
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const today = new Date().toISOString().split('T')[0]

  const monthDays = useMemo(() =>
    Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month, i + 1)
      return d.toISOString().split('T')[0]
    }),
    [year, month, daysInMonth]
  )

  const stats = monthDays.reduce((a, d) => {
    if (log[d] === 'fasted') a.fasted++
    if (log[d] === 'missed') a.missed++
    if (log[d] === 'intended') a.intended++
    return a
  }, { fasted: 0, missed: 0, intended: 0 })

  const statusStyle = (s: FastStatus, isToday: boolean) => {
    const base = isToday ? 'ring-2 ring-emerald-400/40 ring-offset-1 ring-offset-[#0a0b14]' : ''
    if (s === 'fasted') return `bg-emerald-500/80 text-white ${base}`
    if (s === 'missed') return `bg-red-500/60 text-white ${base}`
    if (s === 'intended') return `bg-amber-500/60 text-white ${base}`
    return `bg-white/[0.03] text-gray-500 hover:bg-white/[0.06] ${base}`
  }

  const statusIcon = (s: FastStatus) => {
    if (s === 'fasted') return <Check className="h-3.5 w-3.5" />
    if (s === 'missed') return <X className="h-3.5 w-3.5" />
    if (s === 'intended') return <Target className="h-3.5 w-3.5" />
    return null
  }

  const handleShare = () => {
    const typeLabel = FAST_TYPES.find(t => t.key === fastType)?.label || 'Fasting'
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    shareOrCopy({ title: `${typeLabel} Tracker - ${monthName}`, text: `Alhamdulillah! I fasted ${stats.fasted} days in ${monthName} with a ${streak}-day streak. Track your fasts on MasjidConnect GY!` })
  }

  // --- Shawwal helpers ---
  const shawwalDays = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => `shawwal_${i + 1}`)
  }, [])

  const shawwalCompleted = shawwalDays.filter(d => log[d] === 'fasted').length

  // --- Mon & Thu helpers ---
  const monThuDates = useMemo(() => {
    const now = new Date()
    const monday = getMonday(now)
    const thursday = new Date(monday)
    thursday.setDate(monday.getDate() + 3)
    return [
      { label: 'Monday', date: monday, key: dateKey(monday) },
      { label: 'Thursday', date: thursday, key: dateKey(thursday) },
    ]
  }, [])

  // --- Ayyam al-Bayd helpers ---
  const ayyamDates = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    return [13, 14, 15].map(day => {
      const d = new Date(y, m, day)
      return { day, date: d, key: dateKey(d) }
    })
  }, [])

  const ayyamCompleted = ayyamDates.filter(d => log[d.key] === 'fasted').length

  // --- Calendar title ---
  const calendarTitle = fastType === 'voluntary' ? 'Voluntary Fasts' : 'Ramadan Fasts'

  // Render fast-type specific card status
  const renderCardStatus = (status: FastStatus) => {
    if (status === 'fasted') return <Check className="h-5 w-5 text-emerald-400" />
    if (status === 'missed') return <X className="h-5 w-5 text-red-400" />
    if (status === 'intended') return <Target className="h-5 w-5 text-amber-400" />
    return <Moon className="h-5 w-5 text-gray-600" />
  }

  const renderCardBg = (status: FastStatus) => {
    if (status === 'fasted') return 'bg-emerald-500/10 border-emerald-500/30'
    if (status === 'missed') return 'bg-red-500/10 border-red-500/30'
    if (status === 'intended') return 'bg-amber-500/10 border-amber-500/30'
    return 'bg-gray-900 border-gray-800'
  }

  const renderCardLabel = (status: FastStatus) => {
    if (status === 'fasted') return 'Fasted'
    if (status === 'missed') return 'Missed'
    if (status === 'intended') return 'Intended'
    return 'Tap to log'
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={UtensilsCrossed}
        title="Fasting Tracker"
        subtitle="Track your blessed fasts"
        gradient="from-orange-950 to-amber-900"
        showBack
        heroTheme="ramadan"
        action={
          <button onClick={handleShare} className="glass flex h-10 w-10 items-center justify-center rounded-2xl text-white/60 transition-transform active:scale-90" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
        }
      />

      <div className="space-y-4 px-4 -mt-2">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-stagger">
          <div className="glass rounded-2xl p-3.5 text-center">
            <div className="text-2xl font-extrabold tabular-nums text-emerald-400">{stats.fasted}</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Fasted</div>
          </div>
          <div className="glass rounded-2xl p-3.5 text-center">
            <div className="text-2xl font-extrabold tabular-nums text-red-400">{stats.missed}</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Missed</div>
          </div>
          <div className="glass rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-2xl font-extrabold tabular-nums text-amber-400">
              <Flame className="h-5 w-5" />{streak}
            </div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">Streak</div>
          </div>
        </div>

        {/* Fast Type Selector */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2 w-max">
            {FAST_TYPES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTypeChange(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  fastType === key
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ========== RAMADAN / VOLUNTARY — Full Calendar ========== */}
        {(fastType === 'ramadan' || fastType === 'voluntary') && (
          <>
            {/* Month nav */}
            <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
              <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="rounded-xl p-2 transition-all active:scale-90 active:bg-white/5" aria-label="Previous month">
                <ChevronLeft className="h-5 w-5 text-gray-400" />
              </button>
              <div className="text-center">
                <h2 className="text-sm font-bold text-white">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                {fastType === 'voluntary' && (
                  <p className="text-[10px] text-gray-500 mt-0.5">Voluntary Fasts</p>
                )}
              </div>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="rounded-xl p-2 transition-all active:scale-90 active:bg-white/5" aria-label="Next month">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Calendar */}
            <div className="glass rounded-3xl p-4 animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
              <div className="mb-3 grid grid-cols-7 gap-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-600">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
                {monthDays.map((dateStr) => {
                  const dayNum = parseInt(dateStr.split('-')[2])
                  const status = log[dateStr] || null
                  const isToday = dateStr === today
                  return (
                    <button
                      key={dateStr}
                      onClick={() => toggleDay(dateStr)}
                      className={`flex h-10 w-full items-center justify-center rounded-xl text-xs font-semibold transition-all duration-200 active:scale-90 ${statusStyle(status, isToday)} ${showTick === dateStr ? 'animate-count-tick' : ''}`}
                      aria-label={`${dateStr}: ${status || 'not logged'}`}
                    >
                      {statusIcon(status) || dayNum}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-5 text-[10px] font-medium text-gray-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Fasted</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Missed</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Intended</span>
              </div>
            </div>
          </>
        )}

        {/* ========== SHAWWAL — 6 Cards ========== */}
        {fastType === 'shawwal' && (
          <div className="space-y-4 animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            {/* Progress */}
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold text-emerald-400">{shawwalCompleted}<span className="text-base text-gray-500 font-medium">/6</span></div>
              <p className="text-xs text-gray-400 mt-1">6 Fasts of Shawwal completed</p>
              <div className="mt-3 h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(shawwalCompleted / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500 text-center px-2">
              Whoever fasts Ramadan then follows it with six days of Shawwal, it is as if he fasted for a lifetime.
              <span className="block text-[10px] text-amber-400/50 mt-1">Sahih Muslim 1164</span>
            </p>

            {/* 6 Cards */}
            <div className="grid grid-cols-3 gap-3">
              {shawwalDays.map((key, i) => {
                const status = log[key] || null
                return (
                  <button
                    key={key}
                    onClick={() => toggleDay(key)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all active:scale-95 ${renderCardBg(status)} ${showTick === key ? 'animate-count-tick' : ''}`}
                  >
                    <div className="text-lg font-bold text-[#f9fafb]">{i + 1}</div>
                    {renderCardStatus(status)}
                    <div className="text-[10px] font-medium text-gray-400">{renderCardLabel(status)}</div>
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 text-[10px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Fasted</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Missed</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Intended</span>
            </div>
          </div>
        )}

        {/* ========== MON & THU — Two Cards ========== */}
        {fastType === 'monthu' && (
          <div className="space-y-4 animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            {/* Info */}
            <div className="glass rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-bold text-white">This Week</p>
              </div>
              <p className="text-xs text-gray-400">
                The Prophet (PBUH) used to fast on Mondays and Thursdays.
              </p>
              <span className="block text-[10px] text-amber-400/50 mt-1">Sunan al-Tirmidhi 745</span>
            </div>

            {/* Two Cards */}
            <div className="grid grid-cols-2 gap-4">
              {monThuDates.map(({ label, date, key }) => {
                const status = log[key] || null
                const isToday = key === today
                return (
                  <button
                    key={key}
                    onClick={() => toggleDay(key)}
                    className={`flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all active:scale-95 ${renderCardBg(status)} ${isToday ? 'ring-2 ring-emerald-400/40 ring-offset-1 ring-offset-[#0a0b14]' : ''} ${showTick === key ? 'animate-count-tick' : ''}`}
                  >
                    <div className="text-sm font-bold text-[#f9fafb]">{label}</div>
                    <div className="text-xs text-gray-500">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    {renderCardStatus(status)}
                    <div className="text-[10px] font-medium text-gray-400">{renderCardLabel(status)}</div>
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 text-[10px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Fasted</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Missed</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Intended</span>
            </div>
          </div>
        )}

        {/* ========== AYYAM AL-BAYD — Three Cards ========== */}
        {fastType === 'ayyam' && (
          <div className="space-y-4 animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            {/* Progress & Info */}
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl font-extrabold text-emerald-400">{ayyamCompleted}<span className="text-base text-gray-500 font-medium">/3</span></div>
              <p className="text-xs text-gray-400 mt-1">The White Days of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              <div className="mt-3 h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(ayyamCompleted / 3) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">
                The white days of each month (13th, 14th, 15th) when the moon is full.
              </p>
              <span className="block text-[10px] text-amber-400/50 mt-1">Sahih al-Bukhari 1981</span>
            </div>

            {/* Three Cards */}
            <div className="grid grid-cols-3 gap-3">
              {ayyamDates.map(({ day, date, key }) => {
                const status = log[key] || null
                const isToday = key === today
                return (
                  <button
                    key={key}
                    onClick={() => toggleDay(key)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all active:scale-95 ${renderCardBg(status)} ${isToday ? 'ring-2 ring-emerald-400/40 ring-offset-1 ring-offset-[#0a0b14]' : ''} ${showTick === key ? 'animate-count-tick' : ''}`}
                  >
                    <div className="text-2xl font-bold text-[#f9fafb]">{day}</div>
                    <div className="text-[10px] text-gray-500">
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    {renderCardStatus(status)}
                    <div className="text-[10px] font-medium text-gray-400">{renderCardLabel(status)}</div>
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 text-[10px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Fasted</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Missed</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Intended</span>
            </div>
          </div>
        )}

        {/* Motivation */}
        <div className="glass-amber rounded-2xl p-4 text-center animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <p className="font-arabic text-base leading-[2] text-white/80" dir="rtl">
            {'كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ'}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Fasting has been prescribed for you as it was prescribed for those before you.
          </p>
          <p className="mt-1 text-[10px] text-amber-400/50">Al-Baqarah 2:183</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
