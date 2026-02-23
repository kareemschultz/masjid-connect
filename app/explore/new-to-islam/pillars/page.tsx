'use client'

import { useState } from 'react'
import { Columns, Star, Moon, Heart, UtensilsCrossed, MapPin, ChevronDown } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

const pillars = [
  {
    number: 1,
    arabic: '\u0627\u0644\u0634\u0647\u0627\u062F\u0629',
    name: 'Shahada',
    english: 'Declaration of Faith',
    icon: Star,
    color: 'emerald',
    description:
      'The declaration that there is no god but Allah and Muhammad is His messenger. This is the entry into Islam \u2014 the first and most fundamental pillar. It only needs to be said once with sincerity to become Muslim.',
    link: { href: '/explore/new-to-islam/shahada', label: 'Learn about the Shahada \u2192' },
  },
  {
    number: 2,
    arabic: '\u0627\u0644\u0635\u0644\u0627\u0629',
    name: 'Salah',
    english: 'Prayer',
    icon: Moon,
    color: 'blue',
    description:
      'The five daily prayers connect you directly to Allah. They are Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night). Prayer is the second most important pillar after the Shahada.',
    link: { href: '/explore/madrasa/salah', label: 'Learn to Pray \u2192' },
  },
  {
    number: 3,
    arabic: '\u0627\u0644\u0632\u0643\u0627\u0629',
    name: 'Zakat',
    english: 'Charity',
    icon: Heart,
    color: 'teal',
    description:
      'Purification of wealth. Muslims who possess wealth above the nisab (minimum threshold) give 2.5% of their qualifying savings annually to those in need. It purifies the heart from greed and helps the community.',
    link: { href: '/explore/zakat', label: 'Calculate Your Zakat \u2192' },
  },
  {
    number: 4,
    arabic: '\u0627\u0644\u0635\u0648\u0645',
    name: 'Sawm',
    english: 'Fasting',
    icon: UtensilsCrossed,
    color: 'amber',
    description:
      'Fasting from dawn to sunset during the holy month of Ramadan. It teaches self-discipline, empathy for the hungry, and gratitude for Allah\u2019s blessings. Those who are ill, pregnant, breastfeeding, elderly, or travelling are exempt.',
  },
  {
    number: 5,
    arabic: '\u0627\u0644\u062D\u062C',
    name: 'Hajj',
    english: 'Pilgrimage',
    icon: MapPin,
    color: 'rose',
    description:
      'The annual pilgrimage to Makkah during Dhul Hijjah. Every Muslim who is physically and financially able must perform Hajj at least once in their lifetime. Millions gather in unity, all dressed the same, equal before Allah.',
  },
]

const colorMap: Record<string, { badge: string; text: string; link: string }> = {
  emerald: {
    badge: 'bg-emerald-500/20 text-emerald-400',
    text: 'text-emerald-400',
    link: 'text-emerald-400',
  },
  blue: {
    badge: 'bg-blue-500/20 text-blue-400',
    text: 'text-blue-400',
    link: 'text-blue-400',
  },
  teal: {
    badge: 'bg-teal-500/20 text-teal-400',
    text: 'text-teal-400',
    link: 'text-teal-400',
  },
  amber: {
    badge: 'bg-amber-500/20 text-amber-400',
    text: 'text-amber-400',
    link: 'text-amber-400',
  },
  rose: {
    badge: 'bg-rose-500/20 text-rose-400',
    text: 'text-rose-400',
    link: 'text-rose-400',
  },
}

export default function PillarsPage() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Columns}
        title="The Five Pillars"
        subtitle="Foundations of Islamic Practice"
        gradient="from-purple-950 to-violet-900"
        showBack
        stars
        heroTheme="prayer"
      />

      <div className="space-y-3 px-4 pt-5">
        {/* Intro Card */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The Five Pillars are the core practices that every Muslim follows. They are the framework of a Muslim&apos;s life.
          </p>
        </div>

        {/* Pillar Cards */}
        {pillars.map((pillar, index) => {
          const colors = colorMap[pillar.color]
          const isOpen = openIndex === index
          const Icon = pillar.icon

          return (
            <div
              key={pillar.number}
              className="rounded-2xl border border-border bg-card/50 p-5 cursor-pointer"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <div className="flex items-center gap-3">
                {/* Number Badge */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colors.badge}`}
                >
                  {pillar.number}
                </div>

                {/* Name & Arabic */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{pillar.name}</p>
                    <span className="font-arabic text-base text-muted-foreground">{pillar.arabic}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/80">{pillar.english}</p>
                </div>

                {/* Icon & Chevron */}
                <Icon className={`h-5 w-5 shrink-0 ${colors.text}`} />
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground/80 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Expanded Content */}
              {isOpen && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                  {pillar.link && (
                    <Link
                      href={pillar.link.href}
                      className={`inline-block text-sm font-medium ${colors.link}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {pillar.link.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
