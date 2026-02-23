'use client'

import { Calendar, MapPin, Clock, Plus } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const EVENTS = [
  {
    title: 'Friday Jumu\'ah Khutbah',
    location: 'Central Islamic Organisation Masjid',
    time: 'Every Friday, 12:30 PM',
    type: 'Weekly',
  },
  {
    title: 'Islamic Studies Circle',
    location: 'Queenstown Jama Masjid',
    time: 'Saturday, 4:00 PM',
    type: 'Weekly',
  },
  {
    title: 'Youth Quran Competition',
    location: 'Masjid Al-Noor',
    time: 'Coming soon',
    type: 'Special',
  },
  {
    title: 'Community Iftar',
    location: 'Various Masjids',
    time: 'During Ramadan',
    type: 'Seasonal',
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Calendar}
        title="Events"
        subtitle="Community Gatherings"
        gradient="from-rose-900 to-pink-900"
        showBack
        heroTheme="masjid"
      />

      <div className="px-4 pt-5 space-y-3">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-700 py-4 text-sm font-medium text-gray-400 transition-colors active:border-emerald-500 active:text-emerald-400">
          <Plus className="h-4 w-4" />
          Submit an Event
        </button>

        <div className="animate-stagger space-y-3">
          {EVENTS.map((event, i) => (
            <div key={i} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
                <span className="rounded-lg bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  {event.type}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin className="h-3 w-3" />
                {event.location}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {event.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
