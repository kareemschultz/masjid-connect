'use client'

import { FileText, Sparkles, Bug, Zap, Star } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const CHANGELOG = [
  {
    version: '1.0.0',
    date: 'February 2026',
    title: 'Initial Release',
    type: 'major' as const,
    changes: [
      { type: 'feature', text: 'Prayer times with Adhan library for Georgetown, Guyana' },
      { type: 'feature', text: 'Full Quran reader with Arabic text, translation, and audio' },
      { type: 'feature', text: 'Hifz Mode - verse hiding for memorization practice' },
      { type: 'feature', text: 'Prayer tracker with daily, weekly, and monthly views' },
      { type: 'feature', text: 'Masjid directory for Georgetown mosques with directions' },
      { type: 'feature', text: 'Digital Tasbih counter with haptic feedback' },
      { type: 'feature', text: 'Morning, Evening, and Sleep Adhkar collections' },
      { type: 'feature', text: 'Qibla compass for Georgetown bearing' },
      { type: 'feature', text: 'Zakat calculator in Guyanese Dollars (GYD)' },
      { type: 'feature', text: 'Islamic calendar with important dates and events' },
      { type: 'feature', text: 'Faith Buddy system with leaderboard and challenges' },
      { type: 'feature', text: 'Duas collection organized by category' },
      { type: 'feature', text: 'Madrasa learning modules' },
      { type: 'feature', text: 'Community events listing' },
      { type: 'feature', text: 'Onboarding wizard for new users' },
      { type: 'feature', text: 'Profile with stats, badges, and level progression' },
      { type: 'feature', text: 'Gamification with points, streaks, and daily checklists' },
      { type: 'improvement', text: 'PWA-ready with offline support and home screen install' },
      { type: 'improvement', text: 'Optimized for both iOS and Android devices' },
      { type: 'improvement', text: 'Dark Islamic aesthetic with emerald and gold accents' },
    ],
  },
]

const typeIcon = {
  feature: Sparkles,
  improvement: Zap,
  fix: Bug,
}

const typeColor = {
  feature: 'text-emerald-400 bg-emerald-500/15',
  improvement: 'text-blue-400 bg-blue-500/15',
  fix: 'text-amber-400 bg-amber-500/15',
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={FileText}
        title="Changelog"
        subtitle="What is New"
        gradient="from-blue-900 to-indigo-900"
        showBack
      />

      <div className="px-4 pt-5 space-y-6">
        {CHANGELOG.map((release) => (
          <div key={release.version}>
            {/* Version header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5">
                <Star className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">v{release.version}</span>
              </div>
              <span className="text-xs text-gray-500">{release.date}</span>
            </div>

            <h2 className="mb-4 text-lg font-bold text-foreground">{release.title}</h2>

            {/* Changes list */}
            <div className="space-y-2">
              {release.changes.map((change, i) => {
                const Icon = typeIcon[change.type as keyof typeof typeIcon] || Sparkles
                const color = typeColor[change.type as keyof typeof typeColor] || typeColor.feature

                return (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-900 p-3">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color.split(' ')[1]}`}>
                      <Icon className={`h-3.5 w-3.5 ${color.split(' ')[0]}`} />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{change.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
