'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Navigation, Phone, Clock, CheckCircle2, Users,
  AlertTriangle, ExternalLink, Star, StarOff, Soup, Info
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { MASJIDS } from '@/lib/masjid-data'
import { getItem, setItem, KEYS } from '@/lib/storage'

interface CheckinData { count: number; lastReset: string }

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
    const ramadanStart = localStorage.getItem('ramadan_start')
    if (!ramadanStart) return false
    const start = new Date(ramadanStart)
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
  const [showIftaarInfo, setShowIftaarInfo] = useState(false)

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
    setRamadan(isRamadanNow())
  }, [masjid, today])

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
      <div className="min-h-screen bg-[#0a0b14] pb-nav">
        <PageHero icon={MapPin} title="Not Found" subtitle="Masjid not found" gradient="from-teal-900 to-green-900" showBack />
        <div className="px-4 pt-8 text-center">
          <p className="text-gray-400">This masjid could not be found.</p>
          <Link href="/masjids" className="mt-4 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white">
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
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={MapPin}
        title={masjid.name}
        subtitle={masjid.area}
        gradient="from-teal-900 to-green-900"
        showBack
      />

      <div className="px-4 pt-5 space-y-4">

        {/* ── Set as My Masjid ───────────────────────────────────────── */}
        <button
          onClick={toggleHomeMasjid}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all active:scale-95 border ${
            isHomeMasjid
              ? 'bg-amber-500/15 text-amber-400 border-amber-700/30'
              : 'bg-gray-800 text-gray-300 border-gray-700/30 active:bg-gray-700'
          }`}
        >
          {isHomeMasjid ? (
            <><Star className="h-4 w-4 fill-amber-400" /> My Masjid — tap to remove</>
          ) : (
            <><StarOff className="h-4 w-4" /> Set as My Masjid</>
          )}
        </button>

        {/* ── Quick Info ────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 space-y-3">
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

          <div className="flex items-start gap-2 text-sm text-gray-300">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
            {masjid.address}
          </div>

          {masjid.imam && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-gray-500 text-base">🎓</span>
              <span className="text-gray-400 text-xs">Imam:</span>
              <span>{masjid.imam}</span>
            </div>
          )}

          {masjid.hours && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
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
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
              {masjid.prayerTimes}
            </div>
          )}

          {masjid.notes && (
            <div className="flex items-start gap-2 text-xs text-gray-400 pt-1 border-t border-gray-800">
              <Info className="h-3.5 w-3.5 text-gray-600 mt-0.5 shrink-0" />
              <p>{masjid.notes}</p>
            </div>
          )}

          {!masjid.verified && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertTriangle className="h-3 w-3" />
              Location approximate — not yet verified
            </div>
          )}
        </div>

        {/* ── Prayer Times Detail ───────────────────────────────────── */}
        {prayerRows.length > 0 && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Prayer Times</h3>
            <div className="space-y-1.5">
              {prayerRows.map(([prayer, time]) => (
                <div key={prayer} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{prayer}</span>
                  <span className="text-sm font-semibold text-emerald-400">{time}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-gray-600">Times are approximate — confirm with masjid directly</p>
          </div>
        )}

        {/* ── Ramadan Iftaar ────────────────────────────────────────── */}
        {ramadan && (
          <div className="rounded-2xl border border-orange-800/30 bg-orange-950/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Soup className="h-4 w-4 text-orange-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-orange-400">Iftaar at this Masjid</h3>
            </div>
            {masjid.iftaarInfo ? (
              <p className="text-sm text-gray-300">{masjid.iftaarInfo}</p>
            ) : (
              <p className="text-sm text-gray-400">
                Iftaar arrangements may be available — contact the masjid directly to confirm.
              </p>
            )}
            {masjid.phone && (
              <a
                href={`tel:${masjid.phone}`}
                className="mt-3 flex items-center gap-2 rounded-xl bg-orange-500/15 px-4 py-2.5 text-sm font-semibold text-orange-400 active:bg-orange-500/25"
              >
                <Phone className="h-4 w-4" />
                Call Masjid for Iftaar Info
              </a>
            )}
          </div>
        )}

        {/* ── Facilities ────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {masjid.facilities.map((f) => (
              <span key={f} className="rounded-xl bg-gray-800 px-3 py-1.5 text-xs text-gray-300">
                {FACILITY_ICONS[f] || ''} {f}
              </span>
            ))}
            {masjid.facilities.length === 0 && (
              <p className="text-xs text-gray-500">No facilities listed</p>
            )}
          </div>
        </div>

        {/* ── Check-in ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Check In</h3>
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
              isCheckedIn ? 'bg-teal-500/20 text-teal-400' : 'bg-emerald-600 text-white active:bg-emerald-700'
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300 transition-colors active:bg-gray-700"
        >
          <ExternalLink className="h-4 w-4" />
          View on Google Maps
        </a>

        <Link
          href={`/feedback?category=Report+Masjid+Error&masjid=${encodeURIComponent(masjid.name)}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-800 py-3 text-xs font-medium text-gray-500 transition-colors active:bg-gray-800/50"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Report an Error
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
