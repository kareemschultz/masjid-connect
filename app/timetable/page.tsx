'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, KEYS } from '@/lib/storage'
import { Table2, ChevronLeft, ChevronRight, Share2, Copy, Check } from 'lucide-react'

interface DayRow {
  date: string
  dayName: string
  dayNum: number
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function TimetablePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [rows, setRows] = useState<DayRow[]>([])
  const [copied, setCopied] = useState(false)

  const loadTimetable = useCallback(async () => {
    try {
      const adhan = await import('adhan')
      const methodKey = getItem(KEYS.CALCULATION_METHOD, 'Egyptian')
      const madhabKey = getItem(KEYS.MADHAB, 'Shafi')
      const coords = new adhan.Coordinates(6.8013, -58.1551)

      const methodMap: Record<string, () => ReturnType<typeof adhan.CalculationMethod.Egyptian>> = {
        MuslimWorldLeague: () => adhan.CalculationMethod.MuslimWorldLeague(),
        Egyptian: () => adhan.CalculationMethod.Egyptian(),
        Karachi: () => adhan.CalculationMethod.Karachi(),
        NorthAmerica: () => adhan.CalculationMethod.NorthAmerica(),
        UmmAlQura: () => adhan.CalculationMethod.UmmAlQura(),
        Dubai: () => adhan.CalculationMethod.Dubai(),
        Qatar: () => adhan.CalculationMethod.Qatar(),
        Kuwait: () => adhan.CalculationMethod.Kuwait(),
        Singapore: () => adhan.CalculationMethod.Singapore(),
        Tehran: () => adhan.CalculationMethod.Tehran(),
        Turkey: () => adhan.CalculationMethod.Turkey(),
      }

      const params = (methodMap[methodKey] || methodMap.Egyptian)()
      params.madhab = madhabKey === 'Hanafi' ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi

      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      const data: DayRow[] = []
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i)
        const pt = new adhan.PrayerTimes(coords, d, params)
        data.push({
          date: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNum: i,
          fajr: formatTime(pt.fajr),
          dhuhr: formatTime(pt.dhuhr),
          asr: formatTime(pt.asr),
          maghrib: formatTime(pt.maghrib),
          isha: formatTime(pt.isha),
        })
      }
      setRows(data)
    } catch {
      setRows([])
    }
  }, [currentMonth])

  useEffect(() => { loadTimetable() }, [loadTimetable])

  const today = new Date().toISOString().split('T')[0]
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const shareTimetable = async () => {
    const text = `Prayer Timetable - ${monthLabel}\nGeorgetown, Guyana\n\n` +
      rows.map(r => `${r.dayName} ${r.dayNum}: F ${r.fajr} | D ${r.dhuhr} | A ${r.asr} | M ${r.maghrib} | I ${r.isha}`).join('\n') +
      '\n\nvia MasjidConnect GY'

    if (navigator.share) {
      await navigator.share({ title: `Prayer Timetable - ${monthLabel}`, text })
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero icon={Table2} title="Prayer Timetable" subtitle="Monthly Schedule" gradient="from-cyan-900 to-teal-900" showBack heroTheme="prayer" />

      <div className="space-y-4 px-4 -mt-2">
        {/* Month Navigator */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="rounded-lg p-2 active:bg-gray-800" aria-label="Previous month">
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <h2 className="text-sm font-bold text-[#f9fafb]">{monthLabel}</h2>
          <div className="flex items-center gap-1">
            <button onClick={shareTimetable} className="rounded-lg p-2 active:bg-gray-800" aria-label="Share timetable">
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4 text-gray-400" />}
            </button>
            <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="rounded-lg p-2 active:bg-gray-800" aria-label="Next month">
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900">
          <table className="w-full min-w-[500px] text-[11px]">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="px-2 py-2.5 text-left font-semibold">Day</th>
                <th className="px-2 py-2.5 text-center font-semibold text-blue-400">Fajr</th>
                <th className="px-2 py-2.5 text-center font-semibold text-amber-400">Dhuhr</th>
                <th className="px-2 py-2.5 text-center font-semibold text-orange-400">Asr</th>
                <th className="px-2 py-2.5 text-center font-semibold text-red-400">Mghb</th>
                <th className="px-2 py-2.5 text-center font-semibold text-indigo-400">Isha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.date}
                  className={`border-b border-gray-800/50 transition-colors ${r.date === today ? 'bg-emerald-500/10' : ''} ${r.dayName === 'Fri' ? 'bg-amber-500/5' : ''}`}
                >
                  <td className={`px-2 py-2 font-medium ${r.date === today ? 'text-emerald-400' : 'text-gray-300'}`}>
                    <span className="text-gray-500">{r.dayName}</span> {r.dayNum}
                  </td>
                  <td className="px-2 py-2 text-center text-gray-300">{r.fajr}</td>
                  <td className="px-2 py-2 text-center text-gray-300">{r.dhuhr}</td>
                  <td className="px-2 py-2 text-center text-gray-300">{r.asr}</td>
                  <td className="px-2 py-2 text-center text-gray-300">{r.maghrib}</td>
                  <td className="px-2 py-2 text-center text-gray-300">{r.isha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
