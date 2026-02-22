'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { UtensilsCrossed, ChevronLeft, ChevronRight, Flame, Check, X, Target } from 'lucide-react'

type FastStatus = 'fasted' | 'missed' | 'intended' | null

export default function FastingTrackerPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [log, setLog] = useState<Record<string, FastStatus>>({})
  const [streak, setStreak] = useState(0)

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
    return a
  }, { fasted: 0, missed: 0 })

  const statusColor = (s: FastStatus) => {
    if (s === 'fasted') return 'bg-emerald-500 text-white'
    if (s === 'missed') return 'bg-red-500/80 text-white'
    if (s === 'intended') return 'bg-amber-500/80 text-white'
    return 'bg-gray-800/60 text-gray-500'
  }

  const statusIcon = (s: FastStatus) => {
    if (s === 'fasted') return <Check className="h-3 w-3" />
    if (s === 'missed') return <X className="h-3 w-3" />
    if (s === 'intended') return <Target className="h-3 w-3" />
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero icon={UtensilsCrossed} title="Fasting Tracker" subtitle="Track your fasts" gradient="from-orange-900 to-amber-900" showBack />

      <div className="space-y-4 px-4 -mt-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{stats.fasted}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Fasted</div>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.missed}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Missed</div>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-amber-400"><Flame className="h-5 w-5" />{streak}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Streak</div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="rounded-lg p-2 active:bg-gray-800" aria-label="Previous month"><ChevronLeft className="h-5 w-5 text-gray-400" /></button>
          <h2 className="text-sm font-bold text-[#f9fafb]">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="rounded-lg p-2 active:bg-gray-800" aria-label="Next month"><ChevronRight className="h-5 w-5 text-gray-400" /></button>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <div className="mb-3 grid grid-cols-7 gap-1">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-center text-[10px] font-medium uppercase text-gray-500">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
            {monthDays.map((dateStr) => {
              const dayNum = parseInt(dateStr.split('-')[2])
              const status = log[dateStr] || null
              const isToday = dateStr === today
              return (
                <button key={dateStr} onClick={() => toggleDay(dateStr)}
                  className={`flex h-10 w-full items-center justify-center rounded-xl text-xs font-medium transition-all active:scale-90 ${statusColor(status)} ${isToday ? 'ring-2 ring-emerald-400/50' : ''}`}
                  aria-label={`${dateStr}: ${status || 'not logged'}`}
                >
                  {statusIcon(status) || dayNum}
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Fasted</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Missed</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Intended</span>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
