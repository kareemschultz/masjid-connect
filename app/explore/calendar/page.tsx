'use client'

import { Calendar } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getHijriDate } from '@/lib/prayer-times'
import { useEffect, useState } from 'react'

const ISLAMIC_EVENTS = [
  { name: 'Ramadan Begins', hijriDate: '1 Ramadan', description: 'The blessed month of fasting begins' },
  { name: 'Laylat al-Qadr', hijriDate: '27 Ramadan', description: 'The Night of Power, better than a thousand months' },
  { name: 'Eid al-Fitr', hijriDate: '1 Shawwal', description: 'Festival of Breaking the Fast' },
  { name: 'Day of Arafah', hijriDate: '9 Dhul Hijjah', description: 'The best day on which the sun rises' },
  { name: 'Eid al-Adha', hijriDate: '10 Dhul Hijjah', description: 'Festival of Sacrifice' },
  { name: 'Islamic New Year', hijriDate: '1 Muharram', description: 'Beginning of the new Hijri year' },
  { name: 'Day of Ashura', hijriDate: '10 Muharram', description: 'Day of atonement and fasting' },
  { name: 'Mawlid an-Nabi', hijriDate: '12 Rabi al-Awwal', description: 'Birth of Prophet Muhammad (PBUH)' },
  { name: 'Isra and Mi\'raj', hijriDate: '27 Rajab', description: 'The Night Journey and Ascension' },
  { name: 'Shab-e-Barat', hijriDate: '15 Sha\'ban', description: 'Night of Fortune and Forgiveness' },
]

export default function CalendarPage() {
  const [hijri, setHijri] = useState('')

  useEffect(() => {
    setHijri(getHijriDate())
  }, [])

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={Calendar}
        title="Islamic Calendar"
        subtitle="Important Dates"
        gradient="from-rose-900 to-pink-900"
        showBack
      />

      <div className="px-4 pt-5">
        {/* Current date */}
        <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-400">Today</p>
          <p className="mt-1 text-lg font-bold text-foreground">{hijri}</p>
          <p className="mt-0.5 text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Events list */}
        <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          <div className="h-4 w-1 rounded-full bg-rose-500" />
          Upcoming Events
        </h2>

        <div className="space-y-2 animate-stagger">
          {ISLAMIC_EVENTS.map((event, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15">
                <Calendar className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{event.name}</h3>
                <p className="mt-0.5 text-xs text-emerald-400">{event.hijriDate}</p>
                <p className="mt-0.5 text-xs text-gray-400">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
