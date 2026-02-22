'use client'

import { useEffect, useState } from 'react'
import { Sunrise, Sun, CloudSun, Sunset, Moon } from 'lucide-react'

interface PrayerTime {
  name: string
  time: string
  date: Date
}

interface PrayerStripProps {
  prayers: PrayerTime[]
}

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
} as Record<string, typeof Sunrise>

export function PrayerStrip({ prayers }: PrayerStripProps) {
  const [nextPrayer, setNextPrayer] = useState('')

  useEffect(() => {
    const now = new Date()
    const next = prayers.find((p) => p.date > now)
    setNextPrayer(next?.name || prayers[0]?.name || '')
  }, [prayers])

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {prayers.map((prayer) => {
        const isNext = prayer.name === nextPrayer
        const Icon = PRAYER_ICONS[prayer.name] || Sun

    const isPast = prayer.date < new Date() && !isNext

    return (
      <div
        key={prayer.name}
        className={`flex min-w-[72px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 transition-all ${
          isNext
            ? 'border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/5'
            : isPast
              ? 'border-gray-800/50 bg-gray-900/40 opacity-50'
              : 'border-gray-800 bg-gray-900/80'
        }`}
      >
        <Icon className={`h-4 w-4 ${isNext ? 'text-emerald-400' : 'text-gray-500'}`} />
        <span className={`text-[11px] font-semibold ${isNext ? 'text-emerald-400' : 'text-gray-400'}`}>
          {prayer.name}
        </span>
        <span className={`text-xs font-bold ${isNext ? 'text-foreground' : 'text-gray-300'}`}>
          {prayer.time}
        </span>
      </div>
    )
      })}
    </div>
  )
}
