'use client'

import { useState, useEffect } from 'react'
import {
  Users, Trophy, Bell, Plus, X, Heart, Flame, Star,
  MessageCircle, Target, Send, Copy, Check, Share2
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SettingGroup } from '@/components/setting-group'
import { getItem, setItem, KEYS } from '@/lib/storage'

interface Buddy {
  id: string
  name: string
  streak: number
  points: number
  lastActive: string
  avatar: string
}

interface Challenge {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  deadline: string
  participants: string[]
}

const DEMO_BUDDIES: Buddy[] = [
  { id: '1', name: 'Ahmad', streak: 14, points: 280, lastActive: 'Active now', avatar: 'A' },
  { id: '2', name: 'Fatima', streak: 21, points: 450, lastActive: '2h ago', avatar: 'F' },
  { id: '3', name: 'Yusuf', streak: 7, points: 120, lastActive: '1d ago', avatar: 'Y' },
]

const DEMO_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: '30-Day Prayer Streak',
    description: 'Complete all 5 daily prayers for 30 consecutive days',
    target: 30,
    current: 14,
    unit: 'days',
    deadline: '2 weeks left',
    participants: ['Ahmad', 'You'],
  },
  {
    id: '2',
    title: 'Quran Khatam',
    description: 'Complete reading the entire Quran together',
    target: 114,
    current: 42,
    unit: 'surahs',
    deadline: 'Ongoing',
    participants: ['Ahmad', 'Fatima', 'You'],
  },
]

const NUDGE_MESSAGES = [
  'Time for Salah! Praying together is 27x more rewarding.',
  'Have you read your Quran today? Your buddy is waiting!',
  'SubhanAllah, keep going! Your streak inspires me.',
  'The Prophet (PBUH) said: "The best of you are those who remind others of Allah."',
]

export default function BuddyPage() {
  const [buddies, setBuddies] = useState<Buddy[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [tab, setTab] = useState<'buddies' | 'challenges' | 'leaderboard'>('buddies')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showNudgeModal, setShowNudgeModal] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [nudgeSent, setNudgeSent] = useState<Record<string, boolean>>({})
  const [newBuddyName, setNewBuddyName] = useState('')

  useEffect(() => {
    const savedBuddies = getItem(KEYS.BUDDY_LIST, DEMO_BUDDIES)
    setBuddies(savedBuddies)
    setChallenges(getItem(KEYS.BUDDY_CHALLENGES, DEMO_CHALLENGES))
  }, [])

  const addBuddy = () => {
    if (!newBuddyName.trim()) return
    const newBuddy: Buddy = {
      id: Date.now().toString(),
      name: newBuddyName.trim(),
      streak: 0,
      points: 0,
      lastActive: 'Just joined',
      avatar: newBuddyName.trim()[0].toUpperCase(),
    }
    const updated = [...buddies, newBuddy]
    setBuddies(updated)
    setItem(KEYS.BUDDY_LIST, updated)
    setNewBuddyName('')
    setShowAddModal(false)
  }

  const removeBuddy = (id: string) => {
    const updated = buddies.filter(b => b.id !== id)
    setBuddies(updated)
    setItem(KEYS.BUDDY_LIST, updated)
  }

  const sendNudge = (buddyId: string) => {
    setNudgeSent({ ...nudgeSent, [buddyId]: true })
    setShowNudgeModal(null)
    setTimeout(() => {
      setNudgeSent(prev => ({ ...prev, [buddyId]: false }))
    }, 3000)
  }

  const copyInviteLink = () => {
    const link = 'https://masjidconnect.gy/invite/abc123'
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Sort for leaderboard
  const leaderboard = [...buddies, {
    id: 'you',
    name: getItem(KEYS.USERNAME, 'You'),
    streak: getItem(KEYS.STREAK, 0),
    points: getItem(KEYS.POINTS, 0),
    lastActive: 'You',
    avatar: (getItem(KEYS.USERNAME, 'Y') as string)[0]?.toUpperCase() || 'Y',
  }].sort((a, b) => b.points - a.points)

  const TABS = [
    { key: 'buddies' as const, label: 'Buddies', icon: Users },
    { key: 'challenges' as const, label: 'Challenges', icon: Target },
    { key: 'leaderboard' as const, label: 'Board', icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={Users}
        title="Faith Buddies"
        subtitle="Grow Together in Faith"
        gradient="from-sky-900 to-blue-900"
        showBack
      />

      {/* Tab bar */}
      <div className="flex gap-1 px-4 pt-4">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
              tab === t.key
                ? 'bg-blue-500/15 text-blue-400'
                : 'bg-gray-800/50 text-gray-500'
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Buddies Tab */}
        {tab === 'buddies' && (
          <>
            {/* Invite card */}
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Invite a Friend</h3>
                  <p className="mt-0.5 text-xs text-gray-400">Share your faith journey together</p>
                </div>
                <button
                  onClick={copyInviteLink}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                    copied
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-blue-500/15 text-blue-400 active:bg-blue-500/25'
                  }`}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Add buddy button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-700 py-4 text-sm font-medium text-gray-400 transition-colors active:border-blue-500 active:text-blue-400"
            >
              <Plus className="h-4 w-4" />
              Add a Faith Buddy
            </button>

            {/* Buddy list */}
            {buddies.length > 0 && (
              <SettingGroup label={`Your Buddies (${buddies.length})`} accentColor="bg-blue-500">
                <div className="divide-y divide-gray-800/50">
                  {buddies.map((buddy) => (
                    <div key={buddy.id} className="flex items-center gap-3 p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                        {buddy.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground truncate">{buddy.name}</span>
                          {buddy.streak > 7 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                              <Flame className="h-3 w-3" /> {buddy.streak}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500">{buddy.lastActive}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setShowNudgeModal(buddy.id)}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                            nudgeSent[buddy.id]
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-gray-800 text-gray-400 active:text-blue-400'
                          }`}
                          aria-label={`Nudge ${buddy.name}`}
                        >
                          {nudgeSent[buddy.id] ? <Check className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => removeBuddy(buddy.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-500 active:text-red-400"
                          aria-label={`Remove ${buddy.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </SettingGroup>
            )}

            {/* Feature cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20">
                  <Heart className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Accountability</h3>
                  <p className="mt-0.5 text-xs text-gray-400">Stay motivated with gentle prayer reminders from friends</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20">
                  <MessageCircle className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Encouragement</h3>
                  <p className="mt-0.5 text-xs text-gray-400">Send motivational Islamic reminders and duas to each other</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Challenges Tab */}
        {tab === 'challenges' && (
          <>
            {challenges.map((c) => {
              const pct = Math.round((c.current / c.target) * 100)
              return (
                <div key={c.id} className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                      <p className="mt-0.5 text-xs text-gray-400">{c.description}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-blue-500/15 px-2 py-1 text-[10px] font-medium text-blue-400">
                      {c.deadline}
                    </span>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{c.current}/{c.target} {c.unit}</span>
                      <span className="text-xs font-medium text-emerald-400">{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500">Participants:</span>
                    {c.participants.map((p, i) => (
                      <span key={i} className="rounded-md bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}

            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-700 py-4 text-sm font-medium text-gray-400 active:border-blue-500 active:text-blue-400">
              <Plus className="h-4 w-4" />
              Create New Challenge
            </button>
          </>
        )}

        {/* Leaderboard Tab */}
        {tab === 'leaderboard' && (
          <SettingGroup label="Points Leaderboard" accentColor="bg-amber-500">
            <div className="divide-y divide-gray-800/50">
              {leaderboard.map((user, i) => {
                const isYou = user.id === 'you'
                return (
                  <div key={user.id} className={`flex items-center gap-3 p-4 ${isYou ? 'bg-emerald-500/5' : ''}`}>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                      i === 0 ? 'bg-amber-500/20 text-amber-400'
                      : i === 1 ? 'bg-gray-400/20 text-gray-300'
                      : i === 2 ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-gray-800 text-gray-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isYou ? 'text-emerald-400' : 'text-foreground'}`}>
                          {isYou ? `${user.name} (You)` : user.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="flex items-center gap-0.5">
                          <Flame className="h-2.5 w-2.5 text-amber-400" /> {user.streak} streak
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-sm font-bold text-foreground">{user.points}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </SettingGroup>
        )}
      </div>

      {/* Add Buddy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Add a Buddy</h3>
              <button onClick={() => setShowAddModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              Enter your buddy{"'"}s name to start your accountability partnership.
            </p>
            <input
              type="text"
              value={newBuddyName}
              onChange={(e) => setNewBuddyName(e.target.value)}
              placeholder="Buddy's name"
              className="mb-4 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-blue-500/50"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300 active:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addBuddy}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-medium text-white active:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nudge Modal */}
      {showNudgeModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNudgeModal(null)} />
          <div className="relative w-full max-w-lg rounded-t-3xl border-t border-gray-800 bg-gray-900 pb-safe">
            <div className="border-b border-gray-800 px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Send a Nudge</h3>
              <button onClick={() => setShowNudgeModal(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {NUDGE_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => sendNudge(showNudgeModal)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/50 p-3.5 text-left transition-all active:bg-white/5"
                >
                  <Send className="h-4 w-4 shrink-0 text-blue-400" />
                  <span className="text-sm text-gray-300">{msg}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
