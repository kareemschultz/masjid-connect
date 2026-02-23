'use client'

import { Calendar, ExternalLink, Star, Sparkles } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getHijriDate } from '@/lib/prayer-times'
import { useEffect, useState, useMemo } from 'react'

interface IslamicEvent {
  name: string
  hijriDate: string
  date: string // YYYY-MM-DD
  description: string
  importance: 'Important' | 'Very Important' | 'Blessed Night'
}

// Islamic dates for 2026 (1447-1448 AH) — approximate, subject to CIOG local sighting
const ISLAMIC_EVENTS_2026: IslamicEvent[] = [
  {
    name: "Isra wal Mi'raj",
    hijriDate: '27 Rajab 1447',
    date: '2026-02-17',
    description: "The Night Journey and Ascension of the Prophet (PBUH) from Makkah to Jerusalem and to the heavens.",
    importance: 'Blessed Night',
  },
  {
    name: 'Ramadan Begins',
    hijriDate: '1 Ramadan 1447',
    date: '2026-02-28',
    description: 'The blessed month of fasting begins. Based on CIOG local moon sighting for Guyana.',
    importance: 'Very Important',
  },
  {
    name: "Laylatul Bara'at",
    hijriDate: "15 Sha'ban 1447",
    date: '2026-02-14',
    description: 'Night of Fortune and Forgiveness. Special night of worship before Ramadan.',
    importance: 'Blessed Night',
  },
  {
    name: 'Laylatul Qadr (Night 21)',
    hijriDate: '21 Ramadan 1447',
    date: '2026-03-20',
    description: 'First odd night in the last 10 nights. The Night of Power is better than a thousand months.',
    importance: 'Blessed Night',
  },
  {
    name: 'Laylatul Qadr (Night 23)',
    hijriDate: '23 Ramadan 1447',
    date: '2026-03-22',
    description: 'Odd night in the last 10 nights of Ramadan. Seek Laylatul Qadr.',
    importance: 'Blessed Night',
  },
  {
    name: 'Laylatul Qadr (Night 25)',
    hijriDate: '25 Ramadan 1447',
    date: '2026-03-24',
    description: 'Odd night in the last 10 nights of Ramadan. Seek Laylatul Qadr.',
    importance: 'Blessed Night',
  },
  {
    name: 'Laylatul Qadr (Night 27)',
    hijriDate: '27 Ramadan 1447',
    date: '2026-03-26',
    description: 'Most commonly believed to be the Night of Power. Increase worship and dua.',
    importance: 'Very Important',
  },
  {
    name: 'Laylatul Qadr (Night 29)',
    hijriDate: '29 Ramadan 1447',
    date: '2026-03-28',
    description: 'Last odd night in the last 10 nights of Ramadan.',
    importance: 'Blessed Night',
  },
  {
    name: 'Eid al-Fitr',
    hijriDate: '1 Shawwal 1447',
    date: '2026-03-30',
    description: 'Festival of Breaking the Fast. Celebrate with family, pray Eid Salah, give Zakat al-Fitr.',
    importance: 'Very Important',
  },
  {
    name: 'Eid al-Adha',
    hijriDate: '10 Dhul Hijjah 1447',
    date: '2026-06-07',
    description: 'Festival of Sacrifice. Commemorating Ibrahim (AS) willingness to sacrifice his son.',
    importance: 'Very Important',
  },
  {
    name: 'Islamic New Year',
    hijriDate: '1 Muharram 1448',
    date: '2026-07-07',
    description: 'Beginning of the new Hijri year 1448. Reflect on the Hijrah of the Prophet (PBUH).',
    importance: 'Important',
  },
  {
    name: 'Day of Ashura',
    hijriDate: '10 Muharram 1448',
    date: '2026-07-16',
    description: "Day of fasting and reflection. The day Allah saved Musa (AS) and his people.",
    importance: 'Important',
  },
  {
    name: 'Mawlid al-Nabi',
    hijriDate: "12 Rabi al-Awwal 1448",
    date: '2026-09-05',
    description: 'Birth of Prophet Muhammad (PBUH). Celebrated with gatherings, nasheeds, and remembrance.',
    importance: 'Important',
  },
]

const IMPORTANCE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Very Important': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20' },
  'Important': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'Blessed Night': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/20' },
}

function getDaysUntil(dateStr: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  return Math.round((target.getTime() - now.getTime()) / 86400000)
}

function getRelativeLabel(daysUntil: number): string {
  if (daysUntil === 0) return 'Today!'
  if (daysUntil === 1) return 'Tomorrow'
  if (daysUntil > 0) return `${daysUntil} days away`
  if (daysUntil === -1) return 'Yesterday'
  return `${Math.abs(daysUntil)} days ago`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getGoogleCalendarUrl(event: IslamicEvent): string {
  const start = event.date.replace(/-/g, '')
  // next day for end date (all-day event)
  const d = new Date(event.date + 'T00:00:00')
  d.setDate(d.getDate() + 1)
  const end = d.toISOString().split('T')[0].replace(/-/g, '')
  const title = encodeURIComponent(event.name)
  const details = encodeURIComponent(`${event.hijriDate}\n${event.description}`)
  return `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${start}/${end}&details=${details}`
}

export default function CalendarPage() {
  const [hijri, setHijri] = useState('')

  useEffect(() => {
    setHijri(getHijriDate())
  }, [])

  const sortedEvents = useMemo(() => {
    return [...ISLAMIC_EVENTS_2026].sort((a, b) => a.date.localeCompare(b.date))
  }, [])

  const todayEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return sortedEvents.filter((e) => e.date === today)
  }, [sortedEvents])

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return sortedEvents.filter((e) => e.date >= today)
  }, [sortedEvents])

  const pastEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return sortedEvents.filter((e) => e.date < today)
  }, [sortedEvents])

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Calendar}
        title="Islamic Calendar"
        subtitle="2026 / 1447-1448 AH"
        gradient="from-rose-900 to-pink-900"
        showBack
      />

      <div className="px-4 pt-5 space-y-5">
        {/* Current date */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-400">Today</p>
          <p className="mt-1 text-lg font-bold text-[#f9fafb]">{hijri}</p>
          <p className="mt-0.5 text-xs text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Today's events */}
        {todayEvents.length > 0 && (
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              Happening Today
            </h2>
            {todayEvents.map((event, i) => {
              const style = IMPORTANCE_STYLES[event.importance]
              return (
                <div key={i} className={`rounded-2xl border ${style.border} bg-gradient-to-r from-amber-500/5 to-rose-500/5 p-5`}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
                      <Star className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-[#f9fafb]">{event.name}</h3>
                      <p className="mt-0.5 text-xs text-emerald-400">{event.hijriDate}</p>
                      <p className="mt-1 text-xs text-gray-400">{event.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Upcoming events */}
        {upcomingEvents.length > 0 && (
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <div className="h-4 w-1 rounded-full bg-rose-500" />
              Upcoming Events
            </h2>
            <div className="space-y-2 animate-stagger">
              {upcomingEvents.map((event, i) => {
                const daysUntil = getDaysUntil(event.date)
                const style = IMPORTANCE_STYLES[event.importance]
                const isNear = daysUntil >= 0 && daysUntil <= 7

                return (
                  <div
                    key={i}
                    className={`rounded-xl border border-gray-800 bg-gray-900 p-4 ${
                      isNear ? 'ring-1 ring-amber-500/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                        <Calendar className={`h-4 w-4 ${style.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-[#f9fafb]">{event.name}</h3>
                          <span className={`rounded-lg px-2 py-0.5 text-[9px] font-bold ${style.bg} ${style.text}`}>
                            {event.importance}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-emerald-400">{event.hijriDate}</span>
                          <span className="text-gray-700">|</span>
                          <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">{event.description}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className={`text-[11px] font-semibold ${
                            daysUntil === 0 ? 'text-amber-400' : daysUntil <= 7 ? 'text-emerald-400' : 'text-gray-500'
                          }`}>
                            {getRelativeLabel(daysUntil)}
                          </span>
                          <a
                            href={getGoogleCalendarUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] text-teal-400 transition-colors hover:text-teal-300"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Add to Calendar
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Past events */}
        {pastEvents.length > 0 && (
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              <div className="h-4 w-1 rounded-full bg-gray-700" />
              Past Events
            </h2>
            <div className="space-y-2">
              {pastEvents.map((event, i) => {
                const daysUntil = getDaysUntil(event.date)
                return (
                  <div key={i} className="rounded-xl border border-gray-800/50 bg-gray-900/50 p-4 opacity-60">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-800">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-400">{event.name}</h3>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs text-gray-500">{event.hijriDate}</span>
                          <span className="text-gray-700">|</span>
                          <span className="text-xs text-gray-600">{formatDate(event.date)}</span>
                        </div>
                        <span className="text-[11px] text-gray-600">{getRelativeLabel(daysUntil)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Note */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 text-center">
          <p className="text-[11px] text-gray-500">
            Dates are approximate and based on astronomical calculations. Actual dates depend on local moon sighting by CIOG for Guyana.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
