'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { UtensilsCrossed, ChevronLeft, ChevronRight, Flame, Check, X, Target, Share2 } from 'lucide-react'
import { shareOrCopy } from '@/lib/share'

type FastStatus = 'fasted' | 'missed' | 'intended' | null

export default function FastingTrackerPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [log, setLog] = useState<Record<string, FastStatus>>({})
  const [streak, setStreak] = useState(0)
  const [showTick, setShowTick] = useState('')

  useEffect(() => { setLog(getItem(KEYS.FASTING_LOG, {})) }, [])

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
    setItem(KEYS.FASTING_LOG, updated)
    setShowTick(dateStr)
    setTimeout(() => setShowTick(''), 300)
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const today = new Date().toISOString().split('T')[0]

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1)
    return d.toISOString().split('T')[0]
  })

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
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    shareOrCopy({title: `Fasting Tracker - ${monthName}`, text: `Alhamdulillah! I fasted ${stats.fasted} days in ${monthName} with a ${streak}-day streak. Track your fasts on MasjidConnect GY!`})
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero
        icon={UtensilsCrossed}
        title="Fasting Tracker"
        subtitle="Track your blessed fasts"
        gradient="from-orange-950 to-amber-900"
        showBack
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

        {/* Month nav */}
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="rounded-xl p-2 transition-all active:scale-90 active:bg-white/5" aria-label="Previous month">
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <h2 className="text-sm font-bold text-white">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="rounded-xl p-2 transition-all active:scale-90 active:bg-white/5" aria-label="Next month">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Calendar */}
        <div className="glass rounded-3xl p-4 animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          <div className="mb-3 grid grid-cols-7 gap-1">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
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
