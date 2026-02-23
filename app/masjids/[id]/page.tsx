'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Navigation, Phone, Clock, CheckCircle2, Users,
  AlertTriangle, ExternalLink, Star, StarOff, Soup, Info,
  Plus, ChevronDown, ChevronUp, ThumbsUp, CalendarDays
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { MASJIDS } from '@/lib/masjid-data'
import { getItem, setItem, KEYS } from '@/lib/storage'

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

function getTodayKey() { return new Date().toISOString().split('T')[0] }

/** Returns true if we are currently in Ramadan (ramadan_start localStorage key exists and today ≤ Eid) */
function isRamadanNow(): boolean {
  try {
    // Use getItem() so JSON-encoded values (from setItem) are parsed correctly
    const ramadanStart = getItem<string | null>('ramadan_start', null)
    if (!ramadanStart) return false
    const start = new Date(ramadanStart + 'T00:00:00')
    const end = new Date(start)
    end.setDate(end.getDate() + 30) // Ramadan is 29-30 days
    const today = new Date()
    return today >= start && today <= end
  } catch { return false }
}

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

  const today = getTodayKey()

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
    const inRamadan = isRamadanNow()
    setRamadan(inRamadan)
    // Iftaar reports (Ramadan only)
    if (inRamadan && masjid) {
      fetch(`/api/submissions?masjidId=${encodeURIComponent(masjid.id)}`)
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setIftaarReports(data) })
        .catch(() => {})
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
      <div className="min-h-screen bg-background pb-nav">
        <PageHero icon={MapPin} title="Not Found" subtitle="Masjid not found" gradient="from-teal-900 to-green-900" showBack heroTheme="masjid" />
        <div className="px-4 pt-8 text-center">
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
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={MapPin}
        title={masjid.name}
        subtitle={masjid.area}
        gradient="from-teal-900 to-green-900"
        showBack
        heroTheme="masjid"
      />

      <div className="px-4 pt-5 space-y-4">

        {/* ── Set as My Masjid ───────────────────────────────────────── */}
        <button
          onClick={toggleHomeMasjid}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all active:scale-95 border ${
            isHomeMasjid
              ? 'bg-amber-500/15 text-amber-400 border-amber-700/30'
              : 'bg-secondary text-muted-foreground border-border/30 active:bg-muted'
          }`}
        >
          {isHomeMasjid ? (
            <><Star className="h-4 w-4 fill-amber-400" /> My Masjid — tap to remove</>
          ) : (
            <><StarOff className="h-4 w-4" /> Set as My Masjid</>
          )}
        </button>

        {/* ── Quick Info ────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
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
          <div className="rounded-2xl border border-border bg-card p-5">
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
          <div className="rounded-2xl border border-orange-800/30 bg-orange-950/20 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Soup className="h-4 w-4 text-orange-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-orange-400">Iftaar Reports</h3>
              </div>
              <button
                onClick={() => setShowReportForm(v => !v)}
                className="flex items-center gap-1 rounded-xl bg-orange-500/15 px-3 py-1.5 text-xs font-semibold text-orange-400 active:bg-orange-500/25"
              >
                <Plus className="h-3.5 w-3.5" />
                Report
              </button>
            </div>

            {/* Report form */}
            {showReportForm && (
              <div className="space-y-2.5 rounded-xl border border-orange-800/30 bg-orange-950/30 p-4">
                <input
                  value={reportName}
                  onChange={e => setReportName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2.5 text-sm text-foreground placeholder-gray-500 outline-none focus:border-orange-500/50"
                />
                <input
                  value={reportMenu}
                  onChange={e => setReportMenu(e.target.value)}
                  placeholder="What's being served? (e.g. Biryani, Roti)"
                  className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2.5 text-sm text-foreground placeholder-gray-500 outline-none focus:border-orange-500/50"
                />
                <textarea
                  value={reportNotes}
                  onChange={e => setReportNotes(e.target.value)}
                  placeholder="Any additional info (optional)"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border bg-secondary/60 px-3 py-2.5 text-sm text-foreground placeholder-gray-500 outline-none focus:border-orange-500/50"
                />
                <button
                  onClick={submitIftaarReport}
                  disabled={!reportMenu.trim() || !reportName.trim() || reportSubmitting}
                  className="w-full rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-foreground disabled:opacity-40 active:bg-orange-700"
                >
                  {reportSubmitting ? 'Submitting…' : 'Submit Report'}
                </button>
              </div>
            )}

            {/* Today's reports */}
            {iftaarReports.filter(r => r.date === today).length > 0 ? (
              <div className="space-y-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-400/60">Today</p>
                {iftaarReports.filter(r => r.date === today).map(report => (
                  <div key={report.id} className="rounded-xl bg-card border border-border p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{report.menu}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80">
                        <ThumbsUp className="h-3 w-3" />
                        {report.likes}
                      </div>
                    </div>
                    {report.notes && <p className="mt-1 text-xs text-muted-foreground">{report.notes}</p>}
                    <p className="mt-1.5 text-[10px] text-muted-foreground/60">Reported by {report.submittedBy}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground/80 italic">No iftaar reports yet today. Be the first to share!</p>
            )}

            {/* Link to full archive on Iftaar page */}
            <div className="border-t border-orange-900/30 pt-3">
              <Link href="/iftaar" className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-orange-400 transition-colors">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>View full Iftaar history →</span>
              </Link>
            </div>

            {masjid.phone && (
              <a
                href={`tel:${masjid.phone}`}
                className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2.5 text-sm font-medium text-orange-400/80 active:bg-orange-500/20"
              >
                <Phone className="h-4 w-4" />
                Call Masjid Directly
              </a>
            )}
          </div>
        )}

        {/* ── Facilities ────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mb-3">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {masjid.facilities.map((f) => (
              <span key={f} className="rounded-xl bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                {FACILITY_ICONS[f] || ''} {f}
              </span>
            ))}
            {masjid.facilities.length === 0 && (
              <p className="text-xs text-muted-foreground/80">No facilities listed</p>
            )}
          </div>
        </div>

        {/* ── Check-in ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-5">
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
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all active:scale-95 ${
              isCheckedIn ? 'bg-teal-500/20 text-teal-400' : 'bg-emerald-600 text-foreground active:bg-emerald-700'
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/15 py-3 text-sm font-medium text-emerald-400 transition-colors active:bg-emerald-500/25 border border-emerald-800/30"
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </a>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${masjid.lat},${masjid.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-medium text-muted-foreground transition-colors active:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
          View on Google Maps
        </a>

        <Link
          href={`/feedback?category=Report+Masjid+Error&masjid=${encodeURIComponent(masjid.name)}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-xs font-medium text-muted-foreground/80 transition-colors active:bg-secondary/50"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Report an Error
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
