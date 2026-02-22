'use client'

import { Users, Trophy, Bell, Plus } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

export default function BuddyPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={Users}
        title="Buddy System"
        subtitle="Faith Partners"
        gradient="from-sky-900 to-blue-900"
        showBack
      />

      <div className="px-4 pt-5 space-y-5">
        {/* Add buddy */}
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-700 py-5 text-sm font-medium text-gray-400 transition-colors active:border-emerald-500 active:text-emerald-400">
          <Plus className="h-5 w-5" />
          Add a Faith Buddy
        </button>

        {/* Features preview */}
        <div className="space-y-3 animate-stagger">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20">
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Leaderboard</h3>
              <p className="mt-0.5 text-xs text-gray-400">Compare prayer streaks with friends</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Gentle Nudges</h3>
              <p className="mt-0.5 text-xs text-gray-400">Send reminders to pray together</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Group Challenges</h3>
              <p className="mt-0.5 text-xs text-gray-400">Complete Quran readings together</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 text-center">
          <p className="text-xs text-gray-400">
            Share your invite link to connect with friends and family. Coming soon, InshaAllah.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
