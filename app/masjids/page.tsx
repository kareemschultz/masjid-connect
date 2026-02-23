'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Navigation, Phone, Clock, Search, Map, Star, CheckCircle2, Users, AlertTriangle } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { MASJIDS, AREAS } from '@/lib/masjid-data'
import { getItem, setItem, KEYS } from '@/lib/storage'

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

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

export default function MasjidsPage() {
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('All')
  const [facility, setFacility] = useState<string>('All')
  const [checkins, setCheckins] = useState<Record<string, CheckinData>>({})
  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({})
  const [homeMasjidId, setHomeMasjidId] = useState<string | null>(null)
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)

  const isFriday = new Date().getDay() === 5
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
    setHomeMasjidId(localStorage.getItem('home_masjid_id'))
    // Try to get user location for proximity sort
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLoc({ lat: 6.8013, lng: -58.1551 }), // Georgetown fallback
        { timeout: 4000, maximumAge: 300000 }
      )
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
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={MapPin}
        title="Masjid Directory"
        subtitle="Guyana"
        gradient="from-teal-900 to-green-900"
      
        heroTheme="masjid"
      />

      <div className="px-4 pt-4 space-y-3">
        {/* Friday Banner */}
        {isFriday && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center animate-fade-up">
            <p className="text-sm font-bold text-amber-300">Jumuah Today</p>
            <p className="mt-1 text-xs text-amber-400/70">Find a masjid near you for Friday prayer</p>
          </div>
        )}

        {/* View Map + Count */}
        <div className="flex gap-3">
          <Link
            href="/map"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-500/15 py-2.5 text-xs font-medium text-teal-400 transition-colors active:bg-teal-500/25 border border-teal-800/30"
          >
            <Map className="h-3.5 w-3.5" />
            View Map
          </Link>
          <div className="flex items-center justify-center rounded-xl bg-gray-800/50 px-4 py-2.5">
            <span className="text-xs font-medium text-gray-400">{filtered.length} masjids listed</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500/50"
          />
        </div>

        {/* Area filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {AREAS.map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                area === a
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 active:bg-gray-700'
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
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                facility === f
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-800 text-gray-400 active:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Masjid cards */}
        <div data-tour="masjid-list" className="space-y-3 animate-stagger">
          {filtered.map((masjid) => {
            const checkinCount = checkins[masjid.id]?.count || 0
            const isCheckedIn = checkedIn[masjid.id]

            return (
              <div
                key={masjid.id}
                className={`overflow-hidden rounded-2xl border bg-gray-900 ${masjid.id === homeMasjidId ? 'border-emerald-600/40 ring-1 ring-emerald-600/20' : 'border-gray-800'}`}
              >
                {masjid.id === homeMasjidId && (
                  <div className="bg-emerald-600/20 border-b border-emerald-600/20 px-4 py-1.5 flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">My Masjid — tap to remove</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <Link href={`/masjids/${masjid.id}`} className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#f9fafb]">{masjid.name}</h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
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
                      <span key={f} className="rounded-lg bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                        {FACILITY_ICONS[f] || ''} {f}
                      </span>
                    ))}
                  </div>

                  {masjid.prayerTimes && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
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
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/15 py-2.5 text-xs font-medium text-emerald-400 transition-colors active:bg-emerald-500/25"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Directions
                    </a>
                    <button
                      onClick={() => handleCheckin(masjid.id)}
                      disabled={isCheckedIn}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-all active:scale-95 ${
                        isCheckedIn
                          ? 'bg-teal-500/20 text-teal-400'
                          : 'bg-teal-500/15 text-teal-400 active:bg-teal-500/25'
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
                      className="flex items-center gap-1 text-[10px] text-gray-600 transition-colors hover:text-gray-400"
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
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-700 py-3 text-xs font-medium text-gray-400 transition-colors active:bg-gray-800/50"
        >
          <Star className="h-3.5 w-3.5" />
          Request a Masjid
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
