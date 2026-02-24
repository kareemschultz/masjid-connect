'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Navigation, Phone, Clock, CheckCircle2, Users,
  AlertTriangle, ExternalLink, Star, StarOff, Soup, Info,
  Plus, ChevronDown, ChevronUp, ThumbsUp, CalendarDays
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { PremiumAtmosphere } from '@/components/premium-atmosphere'
import { MASJIDS } from '@/lib/masjid-data'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { getRamadanStatus } from '@/lib/ramadan-mode'
import { guyanaDate } from '@/lib/timezone'
import { masjidIdsMatch } from '@/lib/masjid-id'

interface CheckinData { count: number; lastReset: string }

interface IftaarReport {
  id: string
  masjidId: string
  menu: string
  submittedBy: string
  servings: number | null
  notes: string
  date: string
  likes: number
  attending: number
  submittedAt: string
  userLiked?: boolean
  userAttending?: boolean
}

const FACILITY_ICONS: Record<string, string> = {
  Parking: '🅿️',
  "Women's Section": '👩',
  'Wudu Area': '💧',
  Classes: '📚',
  Library: '📖',
  Cafeteria: '🍽️',
  'Medical Room': '🏥',
}

const SURFACE_CLASS =
  'rounded-2xl border border-border/80 bg-card/82 backdrop-blur-md shadow-[0_22px_50px_-35px_rgba(20,184,166,0.45)]'

const IFTAAR_SURFACE_CLASS =
  'rounded-3xl border border-amber-500/28 bg-gradient-to-br from-amber-500/14 via-card/82 to-orange-500/7 backdrop-blur-md shadow-[0_24px_60px_-34px_rgba(251,191,36,0.42)]'

export default function MasjidDetailPage() {
  const params = useParams()
  const masjid = MASJIDS.find((m) => m.id === params.id)
  const [checkinCount, setCheckinCount] = useState(0)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isHomeMasjid, setIsHomeMasjid] = useState(false)
  const [ramadan, setRamadan] = useState(false)
  const [iftaarReports, setIftaarReports] = useState<IftaarReport[]>([])
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportMenu, setReportMenu] = useState('')
  const [reportName, setReportName] = useState('')
  const [reportNotes, setReportNotes] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [showAllReports, setShowAllReports] = useState(false)
  const [showTodayReports, setShowTodayReports] = useState(false)

  const today = guyanaDate()
  const todayReports = useMemo(
    () => iftaarReports.filter((r) => r.date === today),
    [iftaarReports, today]
  )
  const archivedReports = useMemo(
    () => iftaarReports.filter((r) => r.date !== today),
    [iftaarReports, today]
  )

  useEffect(() => {
    if (!masjid) return

    // Check-in data
    const stored = getItem<Record<string, CheckinData>>(KEYS.CHECKINS, {})
    const data = stored[masjid.id]
    if (data?.lastReset === today) setCheckinCount(data.count)
    const checkedIn = getItem<Record<string, boolean>>('masjid_checked_in_today', {})
    setIsCheckedIn(!!checkedIn[masjid.id])
    // Home masjid
    const savedHome = getItem<string>(KEYS.HOME_MASJID, '')
    setIsHomeMasjid(savedHome === masjid.id)
    // Ramadan
    const inRamadan = getRamadanStatus().isRamadan
    setRamadan(inRamadan)

    const loadReports = async () => {
      if (!inRamadan) {
        setIftaarReports([])
        return
      }
      try {
        const res = await fetch(`/api/submissions?masjidId=${encodeURIComponent(masjid.id)}`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const rows = await res.json()
        if (Array.isArray(rows)) {
          setIftaarReports(rows)
          if (rows.some((r) => r?.date === today)) setShowTodayReports(true)
        }
      } catch {
        // Keep current reports on transient errors.
      }
    }

    void loadReports()

    const onFocus = () => {
      void loadReports()
    }

    const onVisibility = () => {
      if (!document.hidden) void loadReports()
    }

    const onIftaarUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ masjidId?: string }>).detail
      if (!detail?.masjidId || masjidIdsMatch(detail.masjidId, masjid.id)) void loadReports()
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'iftaar_last_update') void loadReports()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('iftaar:updated', onIftaarUpdated as EventListener)
    window.addEventListener('storage', onStorage)
    const pollId = window.setInterval(() => {
      if (!document.hidden) void loadReports()
    }, 60000)

    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('iftaar:updated', onIftaarUpdated as EventListener)
      window.removeEventListener('storage', onStorage)
      window.clearInterval(pollId)
    }
  }, [masjid, today])

  const submitIftaarReport = async () => {
    if (!masjid || !reportMenu.trim() || !reportName.trim()) return
    setReportSubmitting(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masjidId: masjid.id,
          menu: reportMenu.trim(),
          submittedBy: reportName.trim(),
          notes: reportNotes.trim(),
          date: today,
        }),
      })
      if (res.ok) {
        const newReport = await res.json()
        setIftaarReports(prev => [newReport, ...prev])
        setReportMenu('')
        setReportNotes('')
        setShowReportForm(false)
        setShowTodayReports(true) // auto-open so user sees their submission
        window.dispatchEvent(
          new CustomEvent('iftaar:updated', { detail: { masjidId: masjid.id } })
        )
      }
    } catch {}
    setReportSubmitting(false)
  }

  const handleCheckin = () => {
    if (!masjid || isCheckedIn) return
    const stored = getItem<Record<string, CheckinData>>(KEYS.CHECKINS, {})
    const current = stored[masjid.id]?.lastReset === today
      ? stored[masjid.id] : { count: 0, lastReset: today }
    setItem(KEYS.CHECKINS, { ...stored, [masjid.id]: { count: current.count + 1, lastReset: today } })
    setCheckinCount(current.count + 1)
    const checkedIn = getItem<Record<string, boolean>>('masjid_checked_in_today', {})
    setItem('masjid_checked_in_today', { ...checkedIn, [masjid.id]: true })
    setIsCheckedIn(true)
  }

  const toggleHomeMasjid = () => {
    if (!masjid) return
    if (isHomeMasjid) {
      setItem(KEYS.HOME_MASJID, '')
      setIsHomeMasjid(false)
    } else {
      setItem(KEYS.HOME_MASJID, masjid.id)
      setIsHomeMasjid(true)
    }
  }

  if (!masjid) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background pb-nav">
        <PremiumAtmosphere tone="masjid" />
        <PageHero icon={MapPin} title="Not Found" subtitle="Masjid not found" gradient="from-teal-900 to-green-900" showBack heroTheme="masjid" />
        <div className="relative px-4 pt-8 text-center">
          <p className="text-muted-foreground">This masjid could not be found.</p>
          <Link href="/masjids" className="mt-4 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-foreground">
            Back to Directory
          </Link>
        </div>
        <BottomNav />
      </div>
    )
  }

  const prayerRows = masjid.prayerTimesDetail
    ? Object.entries(masjid.prayerTimesDetail)
    : []

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-nav">
      <PremiumAtmosphere tone={ramadan ? 'iftaar' : 'masjid'} />
      <PageHero
        icon={MapPin}
        title={masjid.name}
        subtitle={masjid.area}
        gradient="from-teal-900 to-green-900"
        showBack
        heroTheme="masjid"
      />

      <div className="relative px-4 pt-5 space-y-4">

        {/* ── Set as My Masjid ───────────────────────────────────────── */}
        <button
          onClick={toggleHomeMasjid}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
            isHomeMasjid
              ? 'border-amber-500/35 bg-amber-500/15 text-amber-300'
              : 'border-border/70 bg-secondary/65 text-muted-foreground active:bg-muted'
          }`}
        >
          {isHomeMasjid ? (
            <><Star className="h-4 w-4 fill-amber-400" /> My Masjid — tap to remove</>
          ) : (
            <><StarOff className="h-4 w-4" /> Set as My Masjid</>
          )}
        </button>

        {/* ── Quick Info ────────────────────────────────────────────── */}
        <div className={`${SURFACE_CLASS} space-y-3 p-5`}>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">{masjid.type}</span>
            <span className="rounded-lg bg-teal-500/15 px-3 py-1 text-xs font-medium text-teal-400">{masjid.area}</span>
            {masjid.jumuah && (
              <span className="rounded-lg bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">Jumuah</span>
            )}
            {masjid.verified && (
              <span className="rounded-lg bg-emerald-600/20 px-3 py-1 text-xs font-medium text-emerald-300">✓ Verified</span>
            )}
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground/80 mt-0.5 shrink-0" />
            {masjid.address}
          </div>

          {masjid.imam && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-muted-foreground/80 text-base">🎓</span>
              <span className="text-muted-foreground text-xs">Imam:</span>
              <span>{masjid.imam}</span>
            </div>
          )}

          {masjid.hours && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              {masjid.hours}
            </div>
          )}

          {masjid.phone && (
            <a href={`tel:${masjid.phone}`} className="flex items-center gap-2 text-sm text-teal-400">
              <Phone className="h-4 w-4 shrink-0" />
              {masjid.phone}
            </a>
          )}

          {masjid.prayerTimes && !masjid.prayerTimesDetail && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
              {masjid.prayerTimes}
            </div>
          )}

          {masjid.notes && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground pt-1 border-t border-border">
              <Info className="h-3.5 w-3.5 text-muted-foreground/60 mt-0.5 shrink-0" />
              <p>{masjid.notes}</p>
            </div>
          )}

          {!masjid.verified && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
              <AlertTriangle className="h-3 w-3" />
              Location approximate — not yet verified
            </div>
          )}
        </div>

        {/* ── Prayer Times Detail ───────────────────────────────────── */}
        {prayerRows.length > 0 && (
          <div className={`${SURFACE_CLASS} p-5`}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mb-3">Prayer Times</h3>
            <div className="space-y-1.5">
              {prayerRows.map(([prayer, time]) => (
                <div key={prayer} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{prayer}</span>
                  <span className="text-sm font-semibold text-emerald-400">{time}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground/60">Salah/Iqamah times — Adhan is called 10 min before. Confirm with masjid directly.</p>
          </div>
        )}

        {/* ── Ramadan Iftaar Community Feed ────────────────────────── */}
        {ramadan && (
          <div className={`${IFTAAR_SURFACE_CLASS} relative overflow-hidden p-5 space-y-4`}>
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-400/14 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 bottom-8 h-36 w-36 rounded-full bg-orange-400/10 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Soup className="h-4 w-4 text-amber-300" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-amber-300">Iftaar Reports</h3>
                </div>
                <p className="mt-1 text-[11px] text-amber-200/70">
                  Community updates for tonight and previous days at this masjid.
                </p>
              </div>
              <button
                onClick={() => setShowReportForm(v => !v)}
                className="flex items-center gap-1 rounded-xl border border-amber-500/35 bg-amber-500/18 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-all active:scale-[0.98] active:bg-amber-500/28"
              >
                <Plus className="h-3.5 w-3.5" />
                Report
              </button>
            </div>

            {/* Report form */}
            {showReportForm && (
              <div className="relative space-y-2.5 rounded-2xl border border-amber-500/25 bg-card/72 p-4 backdrop-blur-sm">
                <input
                  value={reportName}
                  onChange={e => setReportName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border/80 bg-secondary/65 px-3 py-2.5 text-sm text-foreground placeholder-gray-500 outline-none focus:border-amber-500/50"
                />
                <input
                  value={reportMenu}
                  onChange={e => setReportMenu(e.target.value)}
                  placeholder="What's being served? (e.g. Biryani, Roti)"
                  className="w-full rounded-xl border border-border/80 bg-secondary/65 px-3 py-2.5 text-sm text-foreground placeholder-gray-500 outline-none focus:border-amber-500/50"
                />
                <textarea
                  value={reportNotes}
                  onChange={e => setReportNotes(e.target.value)}
                  placeholder="Any additional info (optional)"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border/80 bg-secondary/65 px-3 py-2.5 text-sm text-foreground placeholder-gray-500 outline-none focus:border-amber-500/50"
                />
                <button
                  onClick={submitIftaarReport}
                  disabled={!reportMenu.trim() || !reportName.trim() || reportSubmitting}
                  className="w-full rounded-xl border border-amber-500/45 bg-amber-600 py-2.5 text-sm font-semibold text-foreground transition-all active:scale-[0.98] active:bg-amber-700 disabled:opacity-40"
                >
                  {reportSubmitting ? 'Submitting…' : 'Submit Report'}
                </button>
              </div>
            )}

            {/* Today's reports — collapsible */}
            <div className="relative border-t border-amber-500/20 pt-3">
              <button
                onClick={() => setShowTodayReports(v => !v)}
                className="flex w-full items-center justify-between gap-1.5 text-xs text-muted-foreground transition-colors active:text-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-amber-200">Today&apos;s Menu</span>
                  {todayReports.length > 0 ? (
                    <span className="rounded-full border border-amber-500/35 bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-200">
                      {todayReports.length}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/70 italic">None yet</span>
                  )}
                </div>
                {showTodayReports ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {showTodayReports && (
                <div className="mt-2.5 space-y-2.5 animate-fade-up">
                  {todayReports.length === 0 ? (
                    <p className="py-1 text-xs text-muted-foreground/70 italic">No iftaar reports yet today. Be the first to share!</p>
                  ) : (
                    todayReports.map(report => (
                      <div key={report.id} className="rounded-2xl border border-amber-500/22 bg-card/78 p-3.5 backdrop-blur-sm">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{report.menu}</p>
                          <div className="flex items-center gap-1 rounded-full border border-border/70 bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground/80">
                            <ThumbsUp className="h-3 w-3" />
                            {report.likes}
                          </div>
                        </div>
                        {report.notes && <p className="mt-1 text-xs text-muted-foreground/90">{report.notes}</p>}
                        <p className="mt-1.5 text-[10px] text-muted-foreground/65">Reported by {report.submittedBy}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Past Iftaar Archive — always visible so users know it exists */}
            <div className="relative border-t border-amber-500/20 pt-3">
              <button
                onClick={() => setShowAllReports(v => !v)}
                className="flex w-full items-center justify-between gap-1.5 text-xs text-muted-foreground transition-colors active:text-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-amber-200/90">Past Iftaar Reports</span>
                  {archivedReports.length > 0 && (
                    <span className="rounded-full border border-amber-500/35 bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-200">
                      {archivedReports.length}
                    </span>
                  )}
                </div>
                {showAllReports ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {showAllReports && (
                <div className="mt-2.5 space-y-4 animate-fade-up">
                  {archivedReports.length === 0 ? (
                    <p className="py-2 text-xs text-muted-foreground/70 italic">No archived reports yet — reports from past days will appear here.</p>
                  ) : (
                    Array.from(
                      archivedReports
                        .reduce((map, r) => {
                          if (!map.has(r.date)) map.set(r.date, [])
                          map.get(r.date)!.push(r)
                          return map
                        }, new Map<string, IftaarReport[]>())
                    )
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([date, reports]) => (
                        <div key={date} className="space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-300/75">
                            {new Date(date + 'T12:00:00').toLocaleDateString('en-GY', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          {reports.map(report => (
                            <div key={report.id} className="rounded-2xl border border-border/75 bg-secondary/55 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-foreground">{report.menu}</p>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground/75">
                                  <ThumbsUp className="h-2.5 w-2.5" /> {report.likes}
                                </div>
                              </div>
                              {report.notes && <p className="mt-1 text-[11px] text-muted-foreground/85">{report.notes}</p>}
                              <p className="mt-1.5 text-[10px] text-muted-foreground/70">by {report.submittedBy}</p>
                            </div>
                          ))}
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>

            {/* Link to full archive on Iftaar page */}
            <div className="relative border-t border-amber-500/20 pt-3">
              <Link
                href="/iftaar"
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/75 transition-colors hover:text-amber-200"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>View full Iftaar history →</span>
              </Link>
            </div>

            {masjid.phone && (
              <a
                href={`tel:${masjid.phone}`}
                className="flex items-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/14 px-4 py-2.5 text-sm font-semibold text-amber-200 transition-all active:scale-[0.98] active:bg-amber-500/24"
              >
                <Phone className="h-4 w-4" />
                Call Masjid Directly
              </a>
            )}
          </div>
        )}

        {/* ── Facilities ────────────────────────────────────────────── */}
        <div className={`${SURFACE_CLASS} p-5`}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mb-3">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {masjid.facilities.map((f) => (
              <span key={f} className="rounded-xl border border-border/70 bg-secondary/65 px-3 py-1.5 text-xs text-muted-foreground">
                {FACILITY_ICONS[f] || ''} {f}
              </span>
            ))}
            {masjid.facilities.length === 0 && (
              <p className="text-xs text-muted-foreground/80">No facilities listed</p>
            )}
          </div>
        </div>

        {/* ── Check-in ──────────────────────────────────────────────── */}
        <div className={`${SURFACE_CLASS} p-5`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Check In</h3>
            {checkinCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Users className="h-3.5 w-3.5" />
                {checkinCount} here today
              </div>
            )}
          </div>
          <button
            onClick={handleCheckin}
            disabled={isCheckedIn}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
              isCheckedIn
                ? 'border-teal-500/35 bg-teal-500/18 text-teal-300'
                : 'border-emerald-500/35 bg-emerald-600 text-foreground active:bg-emerald-700'
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${isCheckedIn ? 'fill-teal-500' : ''}`} />
            {isCheckedIn ? 'Checked In' : 'Check In for Salah'}
          </button>
        </div>

        {/* ── Directions ────────────────────────────────────────────── */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${masjid.lat},${masjid.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/14 py-3 text-sm font-semibold text-emerald-300 transition-all active:scale-[0.98] active:bg-emerald-500/24"
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </a>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${masjid.lat},${masjid.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-secondary/65 py-3 text-sm font-semibold text-muted-foreground transition-colors active:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
          View on Google Maps
        </a>

        <Link
          href={`/feedback?category=Report+Masjid+Error&masjid=${encodeURIComponent(masjid.name)}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/55 py-3 text-xs font-semibold text-muted-foreground/80 transition-colors active:bg-secondary/50"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Report an Error
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
