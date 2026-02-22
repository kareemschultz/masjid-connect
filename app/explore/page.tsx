'use client'

import { Compass, Star, BookOpen, Calendar, Navigation2, Calculator, GraduationCap, Users, Circle, Brain, Sparkles } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

const EXPLORE_ITEMS = [
  {
    icon: Star,
    label: 'Adhkar',
    description: 'Morning & Evening',
    href: '/explore/adhkar',
    color: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: BookOpen,
    label: 'Duas',
    description: 'Daily Supplications',
    href: '/explore/duas',
    color: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Brain,
    label: 'Hifz Mode',
    description: 'Memorize Quran',
    href: '/quran/hifz',
    color: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Circle,
    label: 'Tasbih',
    description: 'Digital Counter',
    href: '/explore/tasbih',
    color: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Navigation2,
    label: 'Qibla',
    description: 'Find Direction',
    href: '/explore/qibla',
    color: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Calculator,
    label: 'Zakat',
    description: 'Calculate Zakat',
    href: '/explore/zakat',
    color: 'bg-teal-500/20',
    iconColor: 'text-teal-400',
  },
  {
    icon: Calendar,
    label: 'Calendar',
    description: 'Islamic Dates',
    href: '/explore/calendar',
    color: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
  },
  {
    icon: GraduationCap,
    label: 'Madrasa',
    description: 'Learn Islam',
    href: '/explore/madrasa',
    color: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Sparkles,
    label: '99 Names',
    description: 'Asma Al-Husna',
    href: '/explore/names',
    color: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: Users,
    label: 'Buddy',
    description: 'Faith Partners',
    href: '/explore/buddy',
    color: 'bg-cyan-400/20',
    iconColor: 'text-cyan-400',
  },
]

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={Compass}
        title="Explore"
        subtitle="Islamic Tools & Resources"
        gradient="from-rose-900 to-pink-900"
      />

      <div className="px-4 pt-5">
        <div className="grid grid-cols-2 gap-3 animate-stagger">
          {EXPLORE_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-6 transition-all duration-200 active:scale-95 hover:border-gray-700 hover:bg-gray-800/80"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}>
                <item.icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
