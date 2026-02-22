'use client'

import { useState } from 'react'
import { MapPin, Navigation, Phone, Clock, Filter } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { MASJIDS } from '@/lib/masjid-data'

const TYPES = ['All', 'Sunni', 'Ahmadiyya']

export default function MasjidsPage() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? MASJIDS : MASJIDS.filter((m) => m.type === filter)

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={MapPin}
        title="Masjid Directory"
        subtitle="Georgetown, Guyana"
        gradient="from-teal-900 to-green-900"
      />

      {/* Filter chips */}
      <div className="flex gap-2 px-4 pt-4">
        <Filter className="h-4 w-4 shrink-0 self-center text-gray-500" />
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              filter === type
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-800 text-gray-400 active:bg-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Masjid cards */}
      <div className="space-y-3 px-4 pt-4 animate-stagger">
        {filtered.map((masjid) => (
          <div
            key={masjid.id}
            className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{masjid.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {masjid.address}
                  </div>
                </div>
                <span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-[10px] font-medium text-emerald-400">
                  {masjid.type}
                </span>
              </div>

              {masjid.prayerTimes && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="h-3 w-3 text-amber-400" />
                  {masjid.prayerTimes}
                </div>
              )}

              {masjid.phone && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
                  <Phone className="h-3 w-3" />
                  {masjid.phone}
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${masjid.lat},${masjid.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/15 py-2.5 text-xs font-medium text-emerald-400 transition-colors active:bg-emerald-500/25"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
