'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Navigation, Phone, Clock, Search, Map, Star, CheckCircle2, Users, AlertTriangle } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { PremiumAtmosphere } from '@/components/premium-atmosphere'
import { MASJIDS, AREAS } from '@/lib/masjid-data'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { guyanaDate } from '@/lib/timezone'

interface CheckinData {
  count: number
  lastReset: string
}

const FACILITY_FILTERS = ['All', 'Has Jumuah', 'Has Parking', "Has Women's Section"] as const

const FACILITY_ICONS: Record<string, string> = {
  Parking: '🅿️',
  "Women's Section": '👩',
  'Wudu Area': '💧',
  Classes: '📚',
  Library: '📖',
}

const SURFACE_CLASS =
  'rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md shadow-[0_20px_50px_-35px_rgba(20,184,166,0.45)]'

function getTodayKey() {
  return guyanaDate()
}

export default function MasjidsPage() {
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('All')
  const [facility, setFacility] = useState<string>('All')
  const [checkins, setCheckins] = useState<Record<string, CheckinData>>({})
  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({})
  const [homeMasjidId, setHomeMasjidId] = useState<string | null>(null)
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)

  const isFriday = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Guyana', weekday: 'short' }).format(new Date()) === 'Fri'
  const today = getTodayKey()

  useEffect(() => {
    const stored = getItem<Record<string, CheckinData>>(KEYS.CHECKINS, {})
    // Reset counts if the day has changed
    const cleaned: Record<string, CheckinData> = {}
    for (const [id, data] of Object.entries(stored)) {
      if (data.lastReset === today) {
        cleaned[id] = data
      }
    }
    setCheckins(cleaned)
    setCheckedIn(getItem<Record<string, boolean>>('masjid_checked_in_today', {}))
    setHomeMasjidId(getItem<string>(KEYS.HOME_MASJID, ''))

    // Seed from saved onboarding/device location for immediate proximity sorting
    const savedLat = getItem<number | null>(KEYS.USER_LAT, null)
    const savedLng = getItem<number | null>(KEYS.USER_LNG, null)
    if (typeof savedLat === 'number' && typeof savedLng === 'number') {
      setUserLoc({ lat: savedLat, lng: savedLng })
    }

    // Try to get fresher user location for proximity sort
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nextLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserLoc(nextLoc)
          setItem(KEYS.USER_LAT, nextLoc.lat)
          setItem(KEYS.USER_LNG, nextLoc.lng)
        },
        () => {
          if (typeof savedLat === 'number' && typeof savedLng === 'number') return
          setUserLoc({ lat: 6.8013, lng: -58.1551 }) // Georgetown fallback
        },
        { timeout: 4000, maximumAge: 300000 }
      )
    } else if (!(typeof savedLat === 'number' && typeof savedLng === 'number')) {
      setUserLoc({ lat: 6.8013, lng: -58.1551 })
    }
  }, [today])

  const handleCheckin = (masjidId: string) => {
    if (checkedIn[masjidId]) return
    const current = checkins[masjidId] || { count: 0, lastReset: today }
    const updated = { ...checkins, [masjidId]: { count: current.count + 1, lastReset: today } }
    setCheckins(updated)
    setItem(KEYS.CHECKINS, updated)
    const newCheckedIn = { ...checkedIn, [masjidId]: true }
    setCheckedIn(newCheckedIn)
    setItem('masjid_checked_in_today', newCheckedIn)
  }

  const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const filtered = useMemo(() => {
    let list = MASJIDS

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q))
    }
    if (area !== 'All') {
      list = list.filter((m) => m.area === area)
    }
    if (facility === 'Has Jumuah') {
      list = list.filter((m) => m.jumuah)
    } else if (facility === 'Has Parking') {
      list = list.filter((m) => m.facilities.includes('Parking'))
    } else if (facility === "Has Women's Section") {
      list = list.filter((m) => m.facilities.includes("Women's Section"))
    }

    // Sort: My Masjid first, then by proximity (GPS if available), then Jumuah on Fridays
    list = [...list].sort((a, b) => {
      if (a.id === homeMasjidId) return -1
      if (b.id === homeMasjidId) return 1
      if (userLoc) {
        const da = haversineKm(userLoc.lat, userLoc.lng, a.lat, a.lng)
        const db = haversineKm(userLoc.lat, userLoc.lng, b.lat, b.lng)
        return da - db
      }
      if (isFriday) return (b.jumuah ? 1 : 0) - (a.jumuah ? 1 : 0)
      return 0
    })

    return list
  }, [search, area, facility, isFriday, homeMasjidId, userLoc])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-nav">
      <PremiumAtmosphere tone="masjid" />
      <PageHero
        icon={MapPin}
        title="Masjid Directory"
        subtitle="Guyana"
        gradient="from-teal-900 to-green-900"
        heroTheme="masjid"
      />

      <div className="relative px-4 pt-4 space-y-3">
        {/* Friday Banner */}
        {isFriday && (
          <div className={`${SURFACE_CLASS} animate-fade-up border-amber-500/25 bg-gradient-to-br from-amber-500/14 via-amber-500/5 to-orange-500/8 p-4 text-center`}>
            <p className="text-sm font-bold text-amber-300">Jumuah Today</p>
            <p className="mt-1 text-xs text-amber-400/70">Find a masjid near you for Friday prayer</p>
          </div>
        )}

        <div className={`${SURFACE_CLASS} space-y-3 p-3`}>
          {/* View Map + Count */}
          <div className="flex gap-3">
            <Link
              href="/map"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/14 py-2.5 text-xs font-semibold text-teal-300 transition-all active:scale-[0.98] active:bg-teal-500/24"
            >
              <Map className="h-3.5 w-3.5" />
              View Map
            </Link>
            <div className="flex items-center justify-center rounded-xl border border-border/70 bg-secondary/55 px-4 py-2.5">
              <span className="text-xs font-medium text-muted-foreground">{filtered.length} masjids listed</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
            <input
              type="text"
              placeholder="Search by name or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-card/85 py-3 pl-11 pr-4 text-sm text-foreground placeholder-gray-500 outline-none focus:border-teal-500/50"
            />
          </div>

          {/* Area filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {AREAS.map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                  area === a
                    ? 'border-emerald-500/50 bg-emerald-500/90 text-foreground shadow-[0_8px_18px_-12px_rgba(16,185,129,0.8)]'
                    : 'border-border/70 bg-secondary/65 text-muted-foreground active:bg-muted'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Facility filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FACILITY_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFacility(f)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                  facility === f
                    ? 'border-teal-500/50 bg-teal-500/90 text-foreground shadow-[0_8px_18px_-12px_rgba(20,184,166,0.8)]'
                    : 'border-border/70 bg-secondary/65 text-muted-foreground active:bg-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Masjid cards */}
        <div data-tour="masjid-list" className="space-y-3 animate-stagger">
          {filtered.map((masjid) => {
            const checkinCount = checkins[masjid.id]?.count || 0
            const isCheckedIn = checkedIn[masjid.id]

            return (
              <div
                key={masjid.id}
                className={`overflow-hidden rounded-2xl border bg-card/88 backdrop-blur-sm shadow-[0_16px_35px_-30px_rgba(20,184,166,0.45)] transition-all active:scale-[0.995] ${
                  masjid.id === homeMasjidId ? 'border-emerald-600/40 ring-1 ring-emerald-600/25' : 'border-border/80'
                }`}
              >
                {masjid.id === homeMasjidId && (
                  <div className="border-b border-emerald-600/20 bg-emerald-600/18 px-4 py-1.5 flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">My Masjid — tap to remove</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <Link href={`/masjids/${masjid.id}`} className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{masjid.name}</h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {masjid.address}
                      </div>
                    </Link>
                    <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                      <span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-[10px] font-medium text-emerald-400">
                        {masjid.area}
                      </span>
                      {masjid.jumuah && (
                        <span className="rounded-lg bg-amber-500/15 px-2 py-1 text-[10px] font-medium text-amber-400">
                          Jumuah
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Facility pills */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {masjid.facilities.map((f) => (
                      <span key={f} className="rounded-lg border border-border/60 bg-secondary/65 px-2 py-0.5 text-[10px] text-muted-foreground">
                        {FACILITY_ICONS[f] || ''} {f}
                      </span>
                    ))}
                  </div>

                  {masjid.prayerTimes && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                      {masjid.prayerTimes}
                    </div>
                  )}

                  {masjid.phone && (
                    <a href={`tel:${masjid.phone}`} className="mt-1.5 flex items-center gap-1.5 text-xs text-teal-400">
                      <Phone className="h-3 w-3" />
                      {masjid.phone}
                    </a>
                  )}

                  {/* Check-in count */}
                  {checkinCount > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                      <Users className="h-3 w-3" />
                      {checkinCount} here today
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${masjid.lat},${masjid.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/14 py-2.5 text-xs font-semibold text-emerald-300 transition-all active:scale-[0.98] active:bg-emerald-500/24"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Directions
                    </a>
                    <button
                      onClick={() => handleCheckin(masjid.id)}
                      disabled={isCheckedIn}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all active:scale-[0.98] ${
                        isCheckedIn
                          ? 'border-teal-500/35 bg-teal-500/20 text-teal-300'
                          : 'border-teal-500/30 bg-teal-500/14 text-teal-300 active:bg-teal-500/24'
                      }`}
                    >
                      <CheckCircle2 className={`h-3.5 w-3.5 ${isCheckedIn ? 'fill-teal-500' : ''}`} />
                      {isCheckedIn ? 'Checked In' : 'Check In'}
                    </button>
                  </div>

                  {/* Report error */}
                  <div className="mt-2 flex justify-end">
                    <Link
                      href={`/feedback?category=Report+Masjid+Error&masjid=${encodeURIComponent(masjid.name)}`}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                    >
                      <AlertTriangle className="h-2.5 w-2.5" />
                      Report Error
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Request a Masjid */}
        <Link
          href="/feedback?category=Request+New+Masjid"
          className={`${SURFACE_CLASS} flex w-full items-center justify-center gap-2 border-dashed py-3 text-xs font-semibold text-muted-foreground transition-colors active:bg-secondary/50`}
        >
          <Star className="h-3.5 w-3.5" />
          Request a Masjid
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
