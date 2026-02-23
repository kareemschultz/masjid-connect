'use client'

import { Compass, Star, BookOpen, Calendar, Navigation2, Calculator, GraduationCap, Users, Users2, Circle, Brain, Sparkles, Library, Moon, UtensilsCrossed, Headphones, Heart, MessageCircle, Sun, MapPin } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getRamadanStatus } from '@/lib/ramadan-mode'
import Link from 'next/link'

const SECTIONS = [
  {
    label: '\u{1F4D6} Quran & Learning',
    items: [
      { icon: BookOpen, label: 'Quran', description: 'Read & Listen', href: '/quran', color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400' },
      { icon: GraduationCap, label: 'Madrasa', description: 'Learn Islam', href: '/explore/madrasa', color: 'from-indigo-500/20 to-indigo-600/10', iconColor: 'text-indigo-400' },
      { icon: Headphones, label: 'Lectures', description: 'Audio Series', href: '/explore/lectures', color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
      { icon: Brain, label: 'Hifz Mode', description: 'Memorize Quran', href: '/quran/hifz', color: 'from-indigo-500/20 to-indigo-600/10', iconColor: 'text-indigo-400' },
    ],
  },
  {
    label: '\u{1F54C} Prayer & Practice',
    items: [
      { icon: Star, label: 'Adhkar', description: 'Morning & Evening', href: '/explore/adhkar', color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
      { icon: BookOpen, label: 'Duas', description: 'Daily Supplications', href: '/explore/duas', color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400' },
      { icon: Circle, label: 'Tasbih', description: 'Digital Counter', href: '/explore/tasbih', color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
      { icon: Navigation2, label: 'Qibla', description: 'Find Direction', href: '/explore/qibla', color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400' },
      { icon: Calculator, label: 'Zakat', description: 'Calculate Zakat', href: '/explore/zakat', color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400' },
      { icon: Calendar, label: 'Calendar', description: 'Islamic Dates', href: '/explore/calendar', color: 'from-rose-500/20 to-rose-600/10', iconColor: 'text-rose-400' },
      { icon: Sun, label: 'Jumu\'ah', description: 'Friday Prayer Prep', href: '/explore/jumuah', color: 'from-emerald-500/20 to-teal-600/10', iconColor: 'text-emerald-400' },
    ],
  },
  {
    label: '\u{1F465} Community',
    items: [
      { icon: Users2, label: 'Community', description: 'Connect with Muslims', href: '/explore/community', color: 'from-violet-500/20 to-purple-600/10', iconColor: 'text-violet-400' },
      { icon: Users, label: 'Buddy', description: 'Faith Partners', href: '/explore/buddy', color: 'from-cyan-500/20 to-cyan-600/10', iconColor: 'text-cyan-400' },
      { icon: UtensilsCrossed, label: 'Iftaar', description: 'Tonight\'s Menu', href: '/iftaar', color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
      { icon: MapPin, label: 'Masjids', description: 'Masjid Directory', href: '/masjids', color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400' },
    ],
  },
  {
    label: '\u{1F331} New Here?',
    items: [
      { icon: MessageCircle, label: 'New to Islam', description: 'Start your journey', href: '/explore/new-to-islam', color: 'from-emerald-500/20 to-teal-600/10', iconColor: 'text-emerald-400' },
      { icon: Heart, label: 'Sisters', description: 'For Muslim women', href: '/explore/sisters', color: 'from-rose-500/20 to-pink-600/10', iconColor: 'text-rose-400' },
    ],
  },
  {
    label: '\u{1F527} Tools',
    items: [
      { icon: Library, label: 'Resources', description: 'Islamic Learning', href: '/explore/resources', color: 'from-sky-500/20 to-sky-600/10', iconColor: 'text-sky-400' },
      { icon: Sparkles, label: '99 Names', description: 'Asma Al-Husna', href: '/explore/names', color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
      { icon: Calendar, label: 'Events', description: 'Islamic Events', href: '/explore/calendar', color: 'from-rose-500/20 to-rose-600/10', iconColor: 'text-rose-400' },
    ],
  },
]

export default function ExplorePage() {
  const { isRamadan, hijriYear } = getRamadanStatus()

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero icon={Compass} title="Explore" subtitle="Islamic Tools & Resources" gradient="from-rose-950 to-pink-900" stars />

      <div className="px-4 pt-5 -mt-2">
        {/* Ramadan card — full width at top */}
        <div className="grid grid-cols-2 gap-3 mb-1">
          <Link
            href="/ramadan"
            className={`col-span-2 glass flex items-center gap-4 rounded-2xl px-5 py-5 card-premium ${
              isRamadan ? 'ring-1 ring-emerald-500/30' : 'grayscale opacity-60'
            }`}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${
              isRamadan ? 'from-emerald-500/25 to-emerald-600/15' : 'from-violet-500/20 to-purple-600/10'
            }`}>
              <Moon className={`h-6 w-6 ${isRamadan ? 'text-emerald-400' : 'text-violet-400'}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Ramadan</p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                {isRamadan ? `Ramadan ${hijriYear} AH` : 'Outside Ramadan'}
              </p>
            </div>
            {!isRamadan && (
              <span className="ml-auto rounded-full bg-gray-700/50 px-2 py-0.5 text-[9px] font-medium text-gray-400">
                Outside Ramadan
              </span>
            )}
          </Link>
        </div>

        {/* Sectioned grid */}
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mt-6 mb-2 px-1">
              {section.label}
            </h2>
            <div className="grid grid-cols-2 gap-3 animate-stagger">
              {section.items.map((item) => (
                <Link
                  key={item.label + item.href}
                  href={item.href}
                  className="glass flex flex-col items-center gap-3 rounded-2xl px-4 py-6 card-premium"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
