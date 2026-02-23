'use client'

import { useEffect, useState, useRef } from 'react'
import { Sunrise, Sun, CloudSun, Sunset, Moon } from 'lucide-react'
import { getItem, KEYS } from '@/lib/storage'

interface PrayerTime { name: string; time: string; date: Date }
interface PrayerStripProps { prayers: PrayerTime[] }

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
} as Record<string, typeof Sunrise>

export function PrayerStrip({ prayers }: PrayerStripProps) {
  const [nextPrayer, setNextPrayer] = useState('')
  const [offset, setOffset] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOffset(getItem(KEYS.PRAYER_OFFSET, 0))
  }, [])

  useEffect(() => {
    const now = new Date()
    const next = prayers.find((p) => p.date > now)
    const name = next?.name || prayers[0]?.name || ''
    setNextPrayer(name)

    // Auto-scroll to next prayer
    if (scrollRef.current && name) {
      const el = scrollRef.current.querySelector(`[data-prayer="${name}"]`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [prayers])

  return (
    <div
      ref={scrollRef}
      className="flex gap-2.5 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {prayers.map((prayer) => {
        const isNext = prayer.name === nextPrayer
        const Icon = PRAYER_ICONS[prayer.name] || Sun
        const isPast = prayer.date < new Date() && !isNext

        return (
          <div
            key={prayer.name}
            data-prayer={prayer.name}
            className={`flex min-w-[76px] shrink-0 flex-col items-center gap-2 rounded-2xl px-3 py-3.5 transition-all duration-300 ${
              isNext
                ? 'glass-emerald shadow-lg shadow-emerald-500/5 scale-[1.02]'
                : isPast
                  ? 'glass opacity-35'
                  : 'glass'
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 ${
              isNext ? 'bg-emerald-500/15' : 'bg-white/[0.03]'
            }`}>
              <Icon className={`h-4 w-4 transition-colors duration-300 ${isNext ? 'text-emerald-400' : 'text-gray-500'}`} />
            </div>
            <span className={`text-[11px] font-bold transition-colors duration-300 ${isNext ? 'text-emerald-400' : 'text-gray-500'}`}>
              {prayer.name}
            </span>
            <span className={`text-xs font-extrabold tabular-nums transition-colors duration-300 ${isNext ? 'text-white' : 'text-gray-400'}`}>
              {offset !== 0
                ? new Date(prayer.date.getTime() + offset * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                : prayer.time
              }
            </span>
          </div>
        )
      })}
    </div>
  )
}
