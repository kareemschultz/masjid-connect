'use client'

import { Users2, Heart, BookOpen, MapPin, Store, MessageCircle, ChevronRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

const FEATURES = [
  {
    icon: Heart,
    label: 'Community Dua Board',
    description: 'Ask, share & say Ameen together',
    href: '/explore/community/dua-board',
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15',
  },
  {
    icon: BookOpen,
    label: 'Quran Khatam Collective',
    description: 'Complete the Quran together',
    href: '/explore/community/khatam',
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
  },
  {
    icon: MapPin,
    label: 'Masjid Check-in',
    description: 'Find masjids near you',
    href: '/masjids',
    color: 'from-teal-500/20 to-teal-600/10',
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/15',
  },
  {
    icon: Store,
    label: 'Halal Business Directory',
    description: 'Halal businesses in Guyana',
    href: '/explore/community/halal',
    color: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
  },
  {
    icon: MessageCircle,
    label: 'Community Feed',
    description: 'Connect with Muslims in GY',
    href: '/explore/community/feed',
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/15',
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Users2}
        title="Community"
        subtitle="Connect with Muslims in GY"
        gradient="from-violet-900 to-purple-900"
        showBack
      />

      <div className="px-4 pt-5 -mt-2 space-y-3 animate-stagger">
        {FEATURES.map((feature) => (
          <Link
            key={feature.label}
            href={feature.href}
            className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-all active:scale-[0.98]"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${feature.iconBg}`}>
              <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white">{feature.label}</h3>
              <p className="mt-0.5 text-[11px] text-gray-400">{feature.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-gray-600" />
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
