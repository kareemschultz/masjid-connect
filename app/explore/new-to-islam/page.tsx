'use client'

import Link from 'next/link'
import { Star, Heart, Columns, BookOpen, MessageCircle, HelpCircle, MapPin, Moon, Sparkles, BookMarked } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const items = [
  {
    icon: Star,
    label: 'The Shahada',
    description: 'Declaration of Faith — The First Step',
    href: '/explore/new-to-islam/shahada',
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Heart,
    label: 'What Muslims Believe',
    description: 'The 6 Articles of Faith explained simply',
    href: '/explore/new-to-islam/beliefs',
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: Columns,
    label: 'The 5 Pillars',
    description: 'The foundations of Islamic practice',
    href: '/explore/new-to-islam/pillars',
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-400',
  },
  {
    icon: BookOpen,
    label: 'Learn to Pray',
    description: 'Wudu + step-by-step Salah guide',
    href: '/explore/madrasa/salah',
    color: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: MessageCircle,
    label: 'Islamic Vocabulary',
    description: 'Common Arabic words every Muslim uses',
    href: '/explore/new-to-islam/vocabulary',
    color: 'from-teal-500/20 to-teal-600/10',
    iconColor: 'text-teal-400',
  },
  {
    icon: BookMarked,
    label: 'Islamic Glossary',
    description: '80+ Islamic terms with Arabic and definitions',
    href: '/explore/new-to-islam/glossary',
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: HelpCircle,
    label: 'Common Questions',
    description: 'New Muslims ask — Islam answers',
    href: '/explore/new-to-islam/faq',
    color: 'from-rose-500/20 to-rose-600/10',
    iconColor: 'text-rose-400',
  },
  {
    icon: MapPin,
    label: 'Find a Community',
    description: 'Masjids in Georgetown ready to welcome you',
    href: '/masjids',
    color: 'from-orange-500/20 to-orange-600/10',
    iconColor: 'text-orange-400',
  },
  {
    icon: Moon,
    label: 'Duas for New Muslims',
    description: 'Supplications for your new journey',
    href: '/explore/new-to-islam/duas',
    color: 'from-indigo-500/20 to-indigo-600/10',
    iconColor: 'text-indigo-400',
  },
]

export default function NewToIslamPage() {
  return (
    <div className="relative min-h-screen bg-background pb-nav">
      {/* Sunrise gradient rays */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden" aria-hidden style={{height:'200px',width:'200px'}}>
        <div className="absolute bottom-0 left-1/2 h-32 w-0.5 -translate-x-1/2 bg-gradient-to-t from-emerald-400/30 to-transparent" style={{animation:'gentle-pulse 3s ease-in-out infinite',transformOrigin:'bottom center',transform:'translateX(-50%) rotate(-15deg)'}} />
        <div className="absolute bottom-0 left-1/2 h-32 w-0.5 -translate-x-1/2 bg-gradient-to-t from-emerald-400/30 to-transparent" style={{animation:'gentle-pulse 3s ease-in-out infinite',animationDelay:'0.5s'}} />
        <div className="absolute bottom-0 left-1/2 h-32 w-0.5 -translate-x-1/2 bg-gradient-to-t from-emerald-400/30 to-transparent" style={{animation:'gentle-pulse 3s ease-in-out infinite',animationDelay:'1s',transformOrigin:'bottom center',transform:'translateX(-50%) rotate(15deg)'}} />
      </div>

      <PageHero
        icon={Sparkles}
        title="New to Islam"
        subtitle="Your Journey Begins Here"
        gradient="from-emerald-950 to-teal-900"
        showBack
        heroTheme="prayer"
      />

      <div className="space-y-4 px-4 pt-5 animate-stagger">
        {/* Welcome Card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-arabic text-2xl text-emerald-300">مَرْحَبًا</p>
          <p className="mt-1 text-sm font-semibold text-foreground">Marhaban — Welcome</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Whether you&apos;ve just taken your Shahada or are still exploring, this space is for you. Islam is a journey — take it one step at a time.
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
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground/80">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 mt-4">
          <p className="text-sm font-semibold text-foreground">You are not alone.</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            There are Muslims across Guyana ready to welcome you. Contact CIOG or any masjid — they have revert support programmes.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
