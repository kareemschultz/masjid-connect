'use client'

import { GitCommit, Sparkles } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const changelog = [
  {
    version: 'v1.9.0',
    date: 'February 2026',
    label: 'Community & Learning',
    color: 'purple',
    tag: 'current',
    sections: [
      {
        heading: 'Madrasa',
        items: [
          'Restored full Noorani Qaida with 12 interactive lessons and 29 Arabic letters with makhraj',
          'Arabic letter forms viewer (initial, medial, final) with pronunciation guides',
          'Tajweed rules: Noon Sakinah, Raa, Laam, and Waqf lessons',
          'Progress tracking across all Qaida lessons',
        ],
      },
      {
        heading: 'Community Features',
        items: [
          'Community Dua Board — submit prayer requests, react with Ameen',
          'Quran Khatam Collective — claim a Juz, complete the Quran together',
          'Halal Business Directory — searchable directory for Guyana',
          'Community Feed — share reminders, questions, and announcements',
        ],
      },
      {
        heading: 'Tracker Expansion',
        items: [
          'Year-round fasting types: Shawwal, Monday & Thursday, Ayyam al-Bayd, Voluntary',
          'Each fasting type with its own calendar and progress tracking',
        ],
      },
      {
        heading: 'UX Improvements',
        items: [
          'Simplified Prayer Settings in onboarding for new Muslims',
          'Clearer moon sighting labels (CIOG / Central Sighting Committee)',
          'Google Sign-In accessible from Settings and Profile pages',
          'New feedback categories: Request New Masjid, Report Masjid Error',
          'Animated star field on Explore and Quran page heroes',
          'Back button on Map page',
        ],
      },
    ],
  },
  {
    version: 'v1.7.0',
    date: 'February 2026',
    label: 'v2 Migration',
    color: 'emerald',
    sections: [
      {
        heading: 'Architecture Upgrade',
        items: [
          'Migrated to Next.js 16 + React 19 for blazingly fast performance',
          'New component system based on shadcn/ui for polished, spring-animated interactions',
          'Server-side rendering (SSR) for instant initial load',
        ],
      },
      {
        heading: 'New Features',
        items: [
          'Leaderboard: Compete with friends and seeing global rankings (/leaderboard)',
          'Hifz Mode: Hide verses in Quran Reader to test your memorization (/quran/hifz)',
          '99 Names: Full list of Asma ul Husna with search and audio (/explore/names)',
          'Fasting Tracker: Log fasts (Fasted/Missed/Intended) with streak tracking',
        ],
      },
    ],
  },
  {
    version: 'v1.6',
    date: 'February 2026',
    label: 'Design Consistency',
    color: 'purple',
    sections: [
      {
        heading: 'Design Overhaul',
        items: [
          'Unified card styling across every page',
          'Changelog converted from modal to full standalone page',
          'Admin Panel redesigned with consistent card layout',
          'RamadanCompanion cards updated to match Settings design language',
        ],
      },
    ],
  },
  {
    version: 'v1.5',
    date: 'February 2026',
    label: 'Push Notifications & Learning',
    color: 'blue',
    sections: [
      {
        heading: 'Push Notifications',
        items: [
          'Prayer time push notifications — Fajr, Dhuhr, Asr, Maghrib, Isha',
          'Suhoor reminder — 30 minutes before Fajr during Ramadan',
          'Iftaar alert — at Maghrib time during Ramadan',
        ],
      },
      {
        heading: 'Madrasa (Noorani Qaida)',
        items: [
          '12 structured lessons — from Arabic alphabet to Tajweed rules',
          'Interactive lesson cards with audio pronunciation guide',
        ],
      },
    ],
  },
  {
    version: 'v1.0',
    date: 'February 2026',
    label: 'Initial Launch',
    color: 'amber',
    sections: [
      {
        heading: 'Core Features',
        items: [
          'Masjid Directory with 12 verified Georgetown masjids',
          'Full Ramadan 1447 AH timetable (GIT-sourced)',
          'Live countdown timers to Suhoor and Iftaar',
          'Qibla compass with live device-orientation support',
          'Morning & Evening Adhkar with Arabic/English',
        ],
      },
    ],
  },
]

const ACCENT_COLORS: Record<string, any> = {
  emerald: { bar: 'bg-emerald-500', badge: 'bg-emerald-500/15 text-emerald-400', bullet: 'text-emerald-500', heading: 'text-emerald-400' },
  amber: { bar: 'bg-amber-500', badge: 'bg-amber-500/15 text-amber-400', bullet: 'text-amber-500', heading: 'text-amber-400' },
  blue: { bar: 'bg-blue-500', badge: 'bg-blue-500/15 text-blue-400', bullet: 'text-blue-500', heading: 'text-blue-400' },
  purple: { bar: 'bg-purple-500', badge: 'bg-purple-500/15 text-purple-400', bullet: 'text-purple-500', heading: 'text-purple-400' },
  rose: { bar: 'bg-rose-500', badge: 'bg-rose-500/15 text-rose-400', bullet: 'text-rose-500', heading: 'text-rose-400' },
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero icon={GitCommit} title="Changelog" subtitle="What is New" gradient="from-blue-900 to-indigo-900" showBack />

      <div className="px-4 pt-5 space-y-5">
        {changelog.map((release) => {
          const accent = ACCENT_COLORS[release.color] || ACCENT_COLORS.emerald
          return (
            <div key={release.version} className="mb-5">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className={`w-1 h-4 rounded-full ${accent.bar}`} />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{release.version}</h3>
                {release.label && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${accent.badge}`}>
                    {release.label}
                  </span>
                )}
                {release.tag === 'current' && (
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                    <Sparkles className="w-3 h-3" />
                    current
                  </span>
                )}
                <span className="text-[10px] text-gray-500 ml-auto">{release.date}</span>
              </div>

              {/* Card */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
                <div className="divide-y divide-gray-800">
                  {release.sections.map((section) => (
                    <div key={section.heading} className="px-4 py-3.5">
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${accent.heading}`}>
                        {section.heading}
                      </p>
                      <ul className="space-y-1.5">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                            <span className={`mt-0.5 shrink-0 ${accent.bullet}`}>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
