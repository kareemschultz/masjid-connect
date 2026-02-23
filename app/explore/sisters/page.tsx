'use client'

import { Heart, Moon, Star, BookOpen, Scale, MapPin, GraduationCap, Users2, Sparkles } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

const items = [
  {
    icon: Heart,
    label: 'Hijab Guide',
    description: 'What it is, why, and how to wear it',
    href: '/explore/sisters/hijab',
    color: 'from-rose-500/20 to-rose-600/10',
    iconColor: 'text-rose-400',
  },
  {
    icon: Moon,
    label: 'Women in Prayer',
    description: 'How Salah differs for women',
    href: '/explore/sisters/prayer',
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-400',
  },
  {
    icon: Star,
    label: 'Ramadan for Sisters',
    description: 'Fasting, exemptions, and making the most of it',
    href: '/explore/sisters/ramadan',
    color: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: BookOpen,
    label: "Women's Duas",
    description: 'Supplications for mothers, wives, and daughters',
    href: '/explore/sisters/duas',
    color: 'from-teal-500/20 to-teal-600/10',
    iconColor: 'text-teal-400',
  },
  {
    icon: Scale,
    label: 'Rights of Women',
    description: 'What Islam gives you — clearly',
    href: '/explore/sisters/rights',
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: MapPin,
    label: 'Sisters Near Me',
    description: "Masjids with a sisters' section in Guyana",
    href: '/masjids',
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: GraduationCap,
    label: 'Inspiring Sisters',
    description: 'Female scholars and their teachings',
    href: '/explore/sisters/scholars',
    color: 'from-violet-500/20 to-violet-600/10',
    iconColor: 'text-violet-400',
  },
  {
    icon: Users2,
    label: 'Sisters Community',
    description: 'Connect with sisters in the community',
    href: '/explore/community',
    color: 'from-pink-500/20 to-pink-600/10',
    iconColor: 'text-pink-400',
  },
]

export default function SistersPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0b14] pb-nav">
      {/* Soft geometric flower */}
      <div className="pointer-events-none absolute bottom-20 right-4 h-24 w-24 overflow-hidden" aria-hidden>
        <svg viewBox="0 0 100 100" className="text-rose-400" fill="currentColor" style={{animation:'gentle-spin 20s linear infinite',opacity:0.08}}>
          {[0,60,120,180,240,300].map((deg)=>(
            <ellipse key={deg} cx="50" cy="50" rx="12" ry="30" transform={`rotate(${deg} 50 50)`} />
          ))}
        </svg>
      </div>

      <PageHero
        icon={Heart}
        title="Sisters"
        subtitle="For Muslim Women"
        gradient="from-rose-950 to-pink-900"
        showBack
        compact
      />

      <div className="space-y-4 px-4 pt-5 animate-stagger">
        {/* Welcome Card */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
          <p className="font-arabic text-xl text-rose-300">أُخُوَّةٌ فِي الإِسْلَام</p>
          <p className="mt-1 text-sm font-semibold text-[#f9fafb]">Sisterhood in Islam</p>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            This space is for you, sister — your guidance, your questions, your community.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <Link
              key={item.href}
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

      <BottomNav />
    </div>
  )
}
