'use client'

import { Calendar, ExternalLink, Star, Sparkles, Plus, X } from 'lucide-react'
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
    name: "Laylatul Bara'at",
    hijriDate: "15 Sha'ban 1447",
    date: '2026-02-14',
    description: 'Night of Fortune and Forgiveness. Special night of worship before Ramadan.',
    importance: 'Blessed Night',
  },
  {
    name: 'Ramadan Begins',
    hijriDate: '1 Ramadan 1447',
    date: '2026-02-18',   // GIT/Saudi: Wed 18 Feb. CIOG: Thu 19 Feb. Per GIT official timetable.
    description: 'The blessed month of fasting begins. GIT/Saudi: Wed 18 Feb. CIOG local sighting: Thu 19 Feb. Based on GIT Ramadan 1447 timetable for Guyana.',
    importance: 'Very Important',
  },
  {
    name: 'Laylatul Qadr (Night 21)',
    hijriDate: '21 Ramadan 1447',
    date: '2026-03-10',
    description: 'First odd night in the last 10 nights. The Night of Power is better than a thousand months. Increase ibadah, dua, and Quran.',
    importance: 'Blessed Night',
  },
  {
    name: 'Laylatul Qadr (Night 23)',
    hijriDate: '23 Ramadan 1447',
    date: '2026-03-12',
    description: 'Odd night in the last 10 nights of Ramadan. Seek Laylatul Qadr with extra prayer and dua.',
    importance: 'Blessed Night',
  },
  {
    name: 'Laylatul Qadr (Night 25)',
    hijriDate: '25 Ramadan 1447',
    date: '2026-03-14',
    description: 'Odd night in the last 10 nights of Ramadan. Seek Laylatul Qadr.',
    importance: 'Blessed Night',
  },
  {
    name: 'Laylatul Qadr (Night 27)',
    hijriDate: '27 Ramadan 1447',
    date: '2026-03-16',
    description: 'Most commonly believed to be Laylatul Qadr. The Night of Power is better than a thousand months (Q97:3). Increase worship, dua, and dhikr.',
    importance: 'Very Important',
  },
  {
    name: 'Laylatul Qadr (Night 29)',
    hijriDate: '29 Ramadan 1447',
    date: '2026-03-18',
    description: 'Last odd night in the last 10 nights of Ramadan. Do not neglect this night.',
    importance: 'Blessed Night',
  },
  {
    name: 'Eid al-Fitr',
    hijriDate: '1 Shawwal 1447',
    date: '2026-03-20',   // Eid after 30-day Ramadan ending March 19 (per GIT timetable)
    description: 'Festival of Breaking the Fast. Celebrate with family, pray Eid Salah, give Zakat al-Fitr before Eid prayer. Date subject to CIOG moon sighting announcement.',
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

const EVENT_TYPES = ['Community Event', 'Islamic Lecture', 'Masjid Program', 'Eid Celebration', 'Fundraiser', 'Other']

export default function CalendarPage() {
  const [hijri, setHijri] = useState('')
  const [showSubmit, setShowSubmit] = useState(false)
  const [submitForm, setSubmitForm] = useState({ name: '', type: 'Community Event', date: '', time: '', location: '', description: '', submittedBy: '' })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    setHijri(getHijriDate())
  }, [])

  const handleSubmitEvent = async () => {
    if (!submitForm.name.trim() || !submitForm.date) return
    setSubmitLoading(true)
    setSubmitMsg(null)
    try {
      const res = await fetch('/api/events/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: submitForm.name.trim(),
          type: submitForm.type,
          date: submitForm.date,
          time: submitForm.time || undefined,
          venue: submitForm.location.trim() || 'TBA',
          description: submitForm.description.trim() || undefined,
          submittedBy: submitForm.submittedBy.trim() || 'Anonymous',
        }),
      })
      if (res.ok) {
        setSubmitMsg({ ok: true, text: 'Event submitted! The admin team will review and add it to the calendar.' })
        setSubmitForm({ name: '', type: 'Community Event', date: '', time: '', location: '', description: '', submittedBy: '' })
      } else {
        const data = await res.json().catch(() => ({}))
        setSubmitMsg({ ok: false, text: data.error || 'Failed to submit event. Please try again.' })
      }
    } catch {
      setSubmitMsg({ ok: false, text: 'Network error. Please try again.' })
    } finally {
      setSubmitLoading(false)
    }
  }

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
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Calendar}
        title="Islamic Calendar"
        subtitle="2026 / 1447-1448 AH"
        gradient="from-rose-900 to-pink-900"
        showBack
        heroTheme="prayer"
      />

      <div className="px-4 pt-5 space-y-5">
        {/* Current date */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-400">Today</p>
          <p className="mt-1 text-lg font-bold text-foreground">{hijri}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Submit an Event */}
        <button
          onClick={() => { setShowSubmit(true); setSubmitMsg(null) }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 py-3.5 text-sm font-semibold text-emerald-400 transition-all active:bg-secondary"
        >
          <Plus className="h-4 w-4" />
          Submit an Event
        </button>

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
                      <h3 className="text-base font-bold text-foreground">{event.name}</h3>
                      <p className="mt-0.5 text-xs text-emerald-400">{event.hijriDate}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
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
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
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
                    className={`rounded-xl border border-border bg-card p-4 ${
                      isNear ? 'ring-1 ring-amber-500/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                        <Calendar className={`h-4 w-4 ${style.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground">{event.name}</h3>
                          <span className={`rounded-lg px-2 py-0.5 text-[9px] font-bold ${style.bg} ${style.text}`}>
                            {event.importance}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-emerald-400">{event.hijriDate}</span>
                          <span className="text-gray-700">|</span>
                          <span className="text-xs text-muted-foreground/80">{formatDate(event.date)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className={`text-[11px] font-semibold ${
                            daysUntil === 0 ? 'text-amber-400' : daysUntil <= 7 ? 'text-emerald-400' : 'text-muted-foreground/80'
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
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
              <div className="h-4 w-1 rounded-full bg-muted" />
              Past Events
            </h2>
            <div className="space-y-2">
              {pastEvents.map((event, i) => {
                const daysUntil = getDaysUntil(event.date)
                return (
                  <div key={i} className="rounded-xl border border-border/50 bg-card/50 p-4 opacity-60">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                        <Calendar className="h-4 w-4 text-muted-foreground/80" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-muted-foreground">{event.name}</h3>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground/80">{event.hijriDate}</span>
                          <span className="text-gray-700">|</span>
                          <span className="text-xs text-muted-foreground/60">{formatDate(event.date)}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground/60">{getRelativeLabel(daysUntil)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Note */}
        <div className="rounded-2xl border border-border bg-card/50 p-4 text-center">
          <p className="text-[11px] text-muted-foreground/80">
            Dates are approximate and based on astronomical calculations. Actual dates depend on local moon sighting by CIOG for Guyana.
          </p>
        </div>
      </div>

      {/* Submit Event Modal */}
      {showSubmit && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubmit(false)} />
          <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-border bg-card p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Submit an Event</h3>
              <button onClick={() => setShowSubmit(false)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Event Name *</label>
                <input
                  type="text"
                  value={submitForm.name}
                  onChange={e => setSubmitForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Jumu'ah Khutbah"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder-gray-600 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Event Type</label>
                <select
                  value={submitForm.type}
                  onChange={e => setSubmitForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50"
                >
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Date *</label>
                  <input
                    type="date"
                    value={submitForm.date}
                    onChange={e => setSubmitForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Time</label>
                  <input
                    type="time"
                    value={submitForm.time}
                    onChange={e => setSubmitForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Location / Masjid</label>
                <input
                  type="text"
                  value={submitForm.location}
                  onChange={e => setSubmitForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Queenstown Masjid"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder-gray-600 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Description <span className="text-muted-foreground/60">(max 500 chars)</span></label>
                <textarea
                  value={submitForm.description}
                  onChange={e => setSubmitForm(f => ({ ...f, description: e.target.value.slice(0, 500) }))}
                  placeholder="Brief description of the event..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder-gray-600 outline-none focus:border-emerald-500/50 resize-none"
                />
                <p className="text-right text-[10px] text-muted-foreground/60 mt-0.5">{submitForm.description.length}/500</p>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Submitted By</label>
                <input
                  type="text"
                  value={submitForm.submittedBy}
                  onChange={e => setSubmitForm(f => ({ ...f, submittedBy: e.target.value }))}
                  placeholder="Your name or masjid name"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder-gray-600 outline-none focus:border-emerald-500/50"
                />
              </div>

              {submitMsg && (
                <div className={`rounded-xl px-4 py-3 text-xs font-medium ${submitMsg.ok ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  {submitMsg.text}
                </div>
              )}

              <button
                onClick={handleSubmitEvent}
                disabled={submitLoading || !submitForm.name.trim() || !submitForm.date}
                className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-foreground transition-all active:bg-emerald-600 disabled:opacity-40"
              >
                {submitLoading ? 'Submitting...' : 'Submit Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
