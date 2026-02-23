'use client'

import { useEffect, useState } from 'react'
import { Trophy, Shield, Crown, Medal } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

interface LeaderboardEntry {
  userId: string
  name: string
  displayName: string
  username: string | null
  totalPoints: number
  streak: number
  level: { label: string; arabic: string; min: number }
  isMe: boolean
  rank: number
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEntries(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Trophy}
        title="Leaderboard"
        subtitle="Community Ranking"
        gradient="from-amber-900 to-yellow-900"
        showBack
        heroTheme="community"
      />

      <div className="px-4 pt-5 -mt-2 space-y-3 animate-stagger">
        {loading ? (
          // Skeleton loader
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass h-16 w-full rounded-2xl animate-pulse bg-secondary/50" />
          ))
        ) : entries.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground/80">No entries yet. Be the first!</p>
          </div>
        ) : (
          entries.map((entry, i) => (
            <div
              key={entry.userId}
              className={`glass flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                entry.isMe ? 'border-emerald-500/30 bg-emerald-500/10' : 'card-premium'
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center font-bold text-lg">
                {MEDALS[i] || <span className="text-muted-foreground/80 text-sm">#{entry.rank}</span>}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-bold truncate ${entry.isMe ? 'text-emerald-400' : 'text-foreground'}`}>
                    {entry.displayName || entry.name}
                    {entry.isMe && <span className="ml-2 text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300 font-normal">(You)</span>}
                  </p>
                  {i === 0 && <Crown className="h-3 w-3 text-amber-400 fill-amber-400/20" />}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground">{entry.level.label}</span>
                  <span>•</span>
                  <span>{entry.streak} day streak</span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-emerald-400 text-sm">{entry.totalPoints.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground/80">pts</p>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}
