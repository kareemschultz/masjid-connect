'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users, Trophy, Bell, Plus, X, Heart, Flame, Star,
  MessageCircle, Target, Send, Copy, Check, Share2,
  Swords, BookOpen, Moon, HandHeart, ChevronRight,
  Sparkles, Info, Crown, Medal, Award, Zap, ShieldCheck
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SettingGroup } from '@/components/setting-group'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { shareOrCopy } from '@/lib/share'
import Link from 'next/link'

interface Buddy {
  id: string
  name: string
  streak: number
  points: number
  lastActive: string
  avatar: string
  tier: 'bronze' | 'silver' | 'gold'
}

interface Challenge {
  id: string
  title: string
  description: string
  icon: string
  target: number
  current: number
  unit: string
  deadline: string
  participants: string[]
  reward: number
  category: 'prayer' | 'quran' | 'fasting' | 'dhikr' | 'charity'
}

function getTier(points: number): 'bronze' | 'silver' | 'gold' {
  if (points >= 400) return 'gold'
  if (points >= 200) return 'silver'
  return 'bronze'
}

function getTierColor(tier: string) {
  if (tier === 'gold') return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' }
  if (tier === 'silver') return { bg: 'bg-gray-400/20', text: 'text-gray-300', border: 'border-gray-400/30' }
  return { bg: 'bg-orange-700/20', text: 'text-orange-400', border: 'border-orange-700/30' }
}

const RANK_ICON = { gold: Crown, silver: Medal, bronze: Award }

const DEMO_BUDDIES: Buddy[] = [
  { id: '1', name: 'Ahmad', streak: 14, points: 280, lastActive: 'Active now', avatar: 'A', tier: 'silver' },
  { id: '2', name: 'Fatimah', streak: 21, points: 450, lastActive: '2h ago', avatar: 'F', tier: 'gold' },
  { id: '3', name: 'Yusuf', streak: 7, points: 120, lastActive: '1d ago', avatar: 'Y', tier: 'bronze' },
]

const DEMO_CHALLENGES: Challenge[] = [
  {
    id: '1', title: '30-Day Prayer Streak', icon: 'prayer',
    description: 'Complete all 5 daily prayers for 30 consecutive days. The ultimate test of consistency.',
    target: 30, current: 14, unit: 'days', deadline: '2 weeks left',
    participants: ['Ahmad', 'You'], reward: 150, category: 'prayer',
  },
  {
    id: '2', title: 'Quran Khatam Race', icon: 'quran',
    description: 'Complete reading the entire Quran. Track progress together and motivate one another.',
    target: 114, current: 42, unit: 'surahs', deadline: 'Ongoing',
    participants: ['Ahmad', 'Fatimah', 'You'], reward: 500, category: 'quran',
  },
  {
    id: '3', title: 'Ramadan Fasting', icon: 'fasting',
    description: 'Fast every day of Ramadan together. Support each other through the blessed month.',
    target: 30, current: 0, unit: 'fasts', deadline: 'Upcoming',
    participants: ['Fatimah', 'You'], reward: 300, category: 'fasting',
  },
]

const CHALLENGE_ICONS: Record<string, typeof BookOpen> = {
  prayer: HandHeart, quran: BookOpen, fasting: Moon, dhikr: Sparkles, charity: Heart,
}

const CHALLENGE_COLORS: Record<string, string> = {
  prayer: 'from-emerald-500 to-teal-600',
  quran: 'from-purple-500 to-indigo-600',
  fasting: 'from-amber-500 to-orange-600',
  dhikr: 'from-blue-500 to-cyan-600',
  charity: 'from-pink-500 to-rose-600',
}

const NUDGE_MESSAGES = [
  { text: 'Time for Salah! Praying together is 27x more rewarding.', icon: HandHeart, color: 'text-emerald-400' },
  { text: 'Have you read your Quran today? Let us read together!', icon: BookOpen, color: 'text-purple-400' },
  { text: 'SubhanAllah, keep going! Your streak inspires me.', icon: Flame, color: 'text-amber-400' },
  { text: 'The Prophet (PBUH) said: "The best of you are those who remind others of Allah."', icon: Star, color: 'text-blue-400' },
  { text: 'Reminder: Do your morning adhkar today. I already did mine!', icon: Sparkles, color: 'text-cyan-400' },
]

const NEW_CHALLENGE_TEMPLATES = [
  { title: 'Prayer Streak', description: 'Pray all 5 daily prayers consistently', category: 'prayer' as const, target: 30, unit: 'days', reward: 150 },
  { title: 'Quran Reading', description: 'Read a set number of pages together', category: 'quran' as const, target: 20, unit: 'pages', reward: 100 },
  { title: 'Fasting Challenge', description: 'Fast voluntary days together (Mon/Thu)', category: 'fasting' as const, target: 8, unit: 'fasts', reward: 200 },
  { title: 'Daily Dhikr', description: 'Complete daily dhikr for a month', category: 'dhikr' as const, target: 30, unit: 'days', reward: 120 },
  { title: 'Charity Drive', description: 'Give sadaqah every Friday together', category: 'charity' as const, target: 4, unit: 'donations', reward: 250 },
]

export default function BuddyPage() {
  const [buddies, setBuddies] = useState<Buddy[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [tab, setTab] = useState<'buddies' | 'challenges' | 'leaderboard'>('buddies')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showNudgeModal, setShowNudgeModal] = useState<string | null>(null)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [showBuddyDetail, setShowBuddyDetail] = useState<Buddy | null>(null)
  const [copied, setCopied] = useState(false)
  const [nudgeSent, setNudgeSent] = useState<Record<string, boolean>>({})
  const [newBuddyName, setNewBuddyName] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  useEffect(() => {
    setBuddies(getItem(KEYS.BUDDY_LIST, DEMO_BUDDIES))
    setChallenges(getItem(KEYS.BUDDY_CHALLENGES, DEMO_CHALLENGES))
  }, [])

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }, [])

  const addBuddy = () => {
    if (!newBuddyName.trim()) return
    const newBuddy: Buddy = {
      id: Date.now().toString(),
      name: newBuddyName.trim(),
      streak: 0, points: 0,
      lastActive: 'Just joined',
      avatar: newBuddyName.trim()[0].toUpperCase(),
      tier: 'bronze',
    }
    const updated = [...buddies, newBuddy]
    setBuddies(updated)
    setItem(KEYS.BUDDY_LIST, updated)
    setNewBuddyName('')
    setShowAddModal(false)
    showToast(`${newBuddy.name} has been added as your faith buddy`)
  }

  const removeBuddy = (id: string) => {
    const buddy = buddies.find(b => b.id === id)
    const updated = buddies.filter(b => b.id !== id)
    setBuddies(updated)
    setItem(KEYS.BUDDY_LIST, updated)
    setShowBuddyDetail(null)
    if (buddy) showToast(`${buddy.name} has been removed`)
  }

  const sendNudge = (buddyId: string) => {
    setNudgeSent({ ...nudgeSent, [buddyId]: true })
    setShowNudgeModal(null)
    const buddy = buddies.find(b => b.id === buddyId)
    showToast(`Nudge sent to ${buddy?.name || 'buddy'}`)
    setTimeout(() => setNudgeSent(prev => ({ ...prev, [buddyId]: false })), 3000)
  }

  const addChallenge = (template: typeof NEW_CHALLENGE_TEMPLATES[0]) => {
    const newChallenge: Challenge = {
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      icon: template.category,
      target: template.target,
      current: 0,
      unit: template.unit,
      deadline: 'Just started',
      participants: [getItem(KEYS.USERNAME, 'You') as string],
      reward: template.reward,
      category: template.category,
    }
    const updated = [...challenges, newChallenge]
    setChallenges(updated)
    setItem(KEYS.BUDDY_CHALLENGES, updated)
    setShowChallengeModal(false)
    showToast(`"${template.title}" challenge created`)
  }

  const copyInviteLink = () => {
    const link = 'https://masjidconnect.gy/invite/abc123'
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const myPoints = getItem(KEYS.POINTS, 0) as number
  const myStreak = getItem(KEYS.STREAK, 0) as number
  const myName = getItem(KEYS.USERNAME, 'You') as string

  const leaderboard = [...buddies, {
    id: 'you', name: myName, streak: myStreak, points: myPoints,
    lastActive: 'You', avatar: (myName[0] || 'Y').toUpperCase(), tier: getTier(myPoints),
  }].sort((a, b) => b.points - a.points)

  const TABS = [
    { key: 'buddies' as const, label: 'Buddies', icon: Users },
    { key: 'challenges' as const, label: 'Challenges', icon: Swords },
    { key: 'leaderboard' as const, label: 'Board', icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero
        icon={Users}
        title="Faith Buddies"
        subtitle="Grow Together in Faith"
        gradient="from-sky-950 to-blue-900"
        showBack
      />

      {/* How It Works link */}
      <div className="px-4 pt-4">
        <Link
          href="/explore/buddy/how-it-works"
          className="glass flex items-center gap-3 rounded-2xl border-blue-500/15 p-3.5 card-premium"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">How the Buddy System Works</h3>
            <p className="text-[11px] text-gray-400">Learn how to earn rewards and compete in good deeds</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-500" />
        </Link>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 px-4 pt-4">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-bold transition-all duration-300 ${
              tab === t.key
                ? 'bg-blue-500/12 text-blue-400 shadow-sm shadow-blue-500/10'
                : 'glass text-gray-500 active:bg-white/[0.03]'
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 space-y-4 animate-stagger">
        {/* ===================== BUDDIES TAB ===================== */}
        {tab === 'buddies' && (
          <>
            {/* Invite + Share row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyInviteLink}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all active:scale-[0.97] ${
                  copied
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-gray-800 bg-gray-900'
                }`}
              >
                {copied
                  ? <Check className="h-5 w-5 text-emerald-400" />
                  : <Copy className="h-5 w-5 text-blue-400" />
                }
                <span className={`text-xs font-medium ${copied ? 'text-emerald-400' : 'text-gray-300'}`}>
                  {copied ? 'Link Copied!' : 'Copy Invite Link'}
                </span>
              </button>
              <button
                onClick={() => shareOrCopy({
                  title: 'Join MasjidConnect GY',
                  text: 'Join me on MasjidConnect GY! Let\'s grow our faith together as accountability buddies.\n\nhttps://masjidconnect.gy/invite/abc123'
                })}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-all active:scale-[0.97]"
              >
                <Share2 className="h-5 w-5 text-purple-400" />
                <span className="text-xs font-medium text-gray-300">Share App</span>
              </button>
            </div>

            {/* Add buddy */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-700 py-4 text-sm font-medium text-gray-400 transition-all active:border-blue-500 active:text-blue-400 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Add a Faith Buddy
            </button>

            {/* Buddy list */}
            {buddies.length > 0 && (
              <SettingGroup label={`Your Buddies (${buddies.length})`} accentColor="bg-blue-500">
                <div className="divide-y divide-gray-800/50">
                  {buddies.map((buddy) => {
                    const tierStyle = getTierColor(buddy.tier)
                    const TierIcon = RANK_ICON[buddy.tier]
                    return (
                      <button
                        key={buddy.id}
                        onClick={() => setShowBuddyDetail(buddy)}
                        className="flex w-full items-center gap-3 p-4 text-left transition-all active:bg-white/5"
                      >
                        <div className="relative">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white`}>
                            {buddy.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${tierStyle.bg} border ${tierStyle.border}`}>
                            <TierIcon className={`h-2.5 w-2.5 ${tierStyle.text}`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground truncate">{buddy.name}</span>
                            {buddy.streak >= 7 && (
                              <span className="flex items-center gap-0.5 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                                <Flame className="h-2.5 w-2.5" /> {buddy.streak}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className={`text-[11px] ${buddy.lastActive === 'Active now' ? 'text-emerald-400' : 'text-gray-500'}`}>
                              {buddy.lastActive}
                            </span>
                            <span className="flex items-center gap-0.5 text-[11px] text-gray-500">
                              <Star className="h-2.5 w-2.5 text-amber-400/60" /> {buddy.points} pts
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      </button>
                    )
                  })}
                </div>
              </SettingGroup>
            )}

            {/* Feature highlights */}
            <SettingGroup label="Why Buddy Up?" accentColor="bg-purple-500">
              <div className="divide-y divide-gray-800/50">
                {[
                  { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/15', title: 'Accountability', desc: 'Stay consistent with gentle nudges and prayer reminders from your partner' },
                  { icon: Swords, color: 'text-blue-400', bg: 'bg-blue-500/15', title: 'Friendly Competition', desc: 'Challenge each other in Quran reading, prayer streaks, and good deeds' },
                  { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/15', title: 'Earn Rewards', desc: 'Gain points for every milestone hit. Climb from Bronze to Gold tier' },
                  { icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/15', title: 'Spiritual Bond', desc: 'The Prophet (PBUH) said: "A person is upon the religion of their close friend"' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3.5 p-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SettingGroup>
          </>
        )}

        {/* ===================== CHALLENGES TAB ===================== */}
        {tab === 'challenges' && (
          <>
            {challenges.map((c) => {
              const pct = Math.round((c.current / c.target) * 100)
              const CIcon = CHALLENGE_ICONS[c.category] || Target
              const gradient = CHALLENGE_COLORS[c.category] || 'from-gray-500 to-gray-600'
              return (
                <div key={c.id} className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
                  {/* Challenge header with gradient */}
                  <div className={`flex items-center gap-3 bg-gradient-to-r ${gradient} p-4`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <CIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white">{c.title}</h3>
                      <span className="text-[11px] text-white/70">{c.deadline}</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="flex items-center gap-0.5 rounded-lg bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        <Star className="h-2.5 w-2.5" /> +{c.reward}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs leading-relaxed text-gray-400">{c.description}</p>

                    {/* Progress */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500">{c.current} / {c.target} {c.unit}</span>
                        <span className="text-[11px] font-semibold text-emerald-400">{pct}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-800">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {c.participants.slice(0, 4).map((p, i) => (
                          <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-900 bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white">
                            {p[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {c.participants.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Create challenge button */}
            <button
              onClick={() => setShowChallengeModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-700 py-4 text-sm font-medium text-gray-400 transition-all active:border-blue-500 active:text-blue-400 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Create New Challenge
            </button>
          </>
        )}

        {/* ===================== LEADERBOARD TAB ===================== */}
        {tab === 'leaderboard' && (
          <>
            {/* Podium top 3 */}
            {leaderboard.length >= 3 && (
              <div className="flex items-end justify-center gap-3 py-4">
                {/* 2nd place */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 text-lg font-bold text-white">
                    {leaderboard[1].avatar}
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400/20 border border-gray-400/40">
                      <span className="text-[10px] font-bold text-gray-300">2</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-400 truncate max-w-[64px]">{leaderboard[1].name}</span>
                  <span className="text-[11px] font-bold text-gray-300">{leaderboard[1].points}</span>
                </div>
                {/* 1st place */}
                <div className="flex flex-col items-center gap-2 -mt-4">
                  <Crown className="h-5 w-5 text-amber-400 animate-bounce" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-xl font-bold text-white ring-2 ring-amber-400/30 ring-offset-2 ring-offset-background">
                    {leaderboard[0].avatar}
                  </div>
                  <span className="text-sm font-semibold text-foreground truncate max-w-[72px]">{leaderboard[0].name}</span>
                  <span className="text-xs font-bold text-amber-400">{leaderboard[0].points}</span>
                </div>
                {/* 3rd place */}
                <div className="flex flex-col items-center gap-2 mt-2">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 text-lg font-bold text-white">
                    {leaderboard[2].avatar}
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600/20 border border-orange-600/40">
                      <span className="text-[10px] font-bold text-orange-400">3</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-400 truncate max-w-[64px]">{leaderboard[2].name}</span>
                  <span className="text-[11px] font-bold text-orange-400">{leaderboard[2].points}</span>
                </div>
              </div>
            )}

            {/* Full list */}
            <SettingGroup label="Full Rankings" accentColor="bg-amber-500">
              <div className="divide-y divide-gray-800/50">
                {leaderboard.map((user, i) => {
                  const isYou = user.id === 'you'
                  const tierStyle = getTierColor(user.tier)
                  return (
                    <div key={user.id} className={`flex items-center gap-3 p-4 ${isYou ? 'bg-emerald-500/5' : ''}`}>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs ${
                        i === 0 ? 'bg-amber-500/20 text-amber-400'
                        : i === 1 ? 'bg-gray-400/20 text-gray-300'
                        : i === 2 ? 'bg-orange-600/20 text-orange-400'
                        : 'bg-gray-800 text-gray-500'
                      }`}>
                        {i + 1}
                      </div>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white`}>
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold truncate ${isYou ? 'text-emerald-400' : 'text-foreground'}`}>
                            {isYou ? `${user.name} (You)` : user.name}
                          </span>
                          <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase ${tierStyle.bg} ${tierStyle.text}`}>
                            {user.tier}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Flame className="h-2.5 w-2.5 text-amber-400/60" /> {user.streak} day streak
                        </span>
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
          </>
        )}
      </div>

      {/* ===================== ADD BUDDY MODAL ===================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-gray-700 bg-gray-900 p-6 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15">
              <Users className="h-7 w-7 text-blue-400" />
            </div>

            <h3 className="text-center text-lg font-bold text-foreground">Add a Faith Buddy</h3>
            <p className="mt-1 text-center text-sm text-gray-400">
              Start an accountability partnership built on shared faith and mutual encouragement.
            </p>

            <input
              type="text"
              value={newBuddyName}
              onChange={(e) => setNewBuddyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addBuddy()}
              placeholder="Enter buddy's name"
              className="mt-5 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3.5 text-sm text-foreground placeholder-gray-500 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              autoFocus
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { setShowAddModal(false); setNewBuddyName('') }}
                className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300 transition-all active:bg-gray-700 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={addBuddy}
                disabled={!newBuddyName.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-medium text-white transition-all active:bg-blue-600 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
              >
                <Plus className="h-4 w-4" />
                Add Buddy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== BUDDY DETAIL MODAL ===================== */}
      {showBuddyDetail && (() => {
        const buddy = showBuddyDetail
        const tierStyle = getTierColor(buddy.tier)
        const TierIcon = RANK_ICON[buddy.tier]
        return (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setShowBuddyDetail(null)} />
            <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-t sm:border border-gray-700 bg-gray-900 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-6 duration-300">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 sm:hidden">
                <div className="h-1 w-10 rounded-full bg-gray-700" />
              </div>

              {/* Header */}
              <div className="flex items-start gap-4 p-5">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white">
                    {buddy.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ${tierStyle.bg} border ${tierStyle.border}`}>
                    <TierIcon className={`h-3 w-3 ${tierStyle.text}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{buddy.name}</h3>
                  <p className={`text-xs ${buddy.lastActive === 'Active now' ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {buddy.lastActive}
                  </p>
                  <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${tierStyle.bg} ${tierStyle.text}`}>
                    {buddy.tier} tier
                  </span>
                </div>
                <button onClick={() => setShowBuddyDetail(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 px-5">
                <div className="flex flex-col items-center rounded-xl bg-gray-800/50 p-3">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span className="mt-1 text-lg font-bold text-foreground">{buddy.streak}</span>
                  <span className="text-[10px] text-gray-500">Day Streak</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-gray-800/50 p-3">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span className="mt-1 text-lg font-bold text-foreground">{buddy.points}</span>
                  <span className="text-[10px] text-gray-500">Points</span>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-gray-800/50 p-3">
                  <Trophy className="h-4 w-4 text-blue-400" />
                  <span className="mt-1 text-lg font-bold text-foreground">#{leaderboard.findIndex(l => l.id === buddy.id) + 1}</span>
                  <span className="text-[10px] text-gray-500">Rank</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-5 pb-safe">
                <button
                  onClick={() => { setShowBuddyDetail(null); setShowNudgeModal(buddy.id) }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 text-sm font-medium text-white transition-all active:bg-blue-600 active:scale-[0.98]"
                >
                  <Bell className="h-4 w-4" />
                  Send Nudge
                </button>
                <button
                  onClick={() => removeBuddy(buddy.id)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-5 py-3.5 text-sm font-medium text-red-400 transition-all active:bg-red-500/20 active:scale-[0.98]"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ===================== NUDGE MODAL ===================== */}
      {showNudgeModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setShowNudgeModal(null)} />
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-t sm:border border-gray-700 bg-gray-900 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-gray-700" />
            </div>

            <div className="p-5 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                    <Send className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Send a Nudge</h3>
                    <p className="text-xs text-gray-400">Choose a message to encourage your buddy</p>
                  </div>
                </div>
                <button onClick={() => setShowNudgeModal(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 px-5 pb-5 pb-safe">
              {NUDGE_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => sendNudge(showNudgeModal)}
                  className="flex w-full items-start gap-3.5 rounded-xl border border-gray-800 bg-gray-800/40 p-4 text-left transition-all active:bg-white/5 active:scale-[0.99] active:border-gray-700"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-800">
                    <msg.icon className={`h-4 w-4 ${msg.color}`} />
                  </div>
                  <span className="text-sm leading-relaxed text-gray-300">{msg.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== CREATE CHALLENGE MODAL ===================== */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setShowChallengeModal(false)} />
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-t sm:border border-gray-700 bg-gray-900 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-gray-700" />
            </div>

            <div className="p-5 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                    <Target className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">New Challenge</h3>
                    <p className="text-xs text-gray-400">Pick a challenge to start with your buddies</p>
                  </div>
                </div>
                <button onClick={() => setShowChallengeModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 px-5 pb-5 pb-safe">
              {NEW_CHALLENGE_TEMPLATES.map((template, i) => {
                const TIcon = CHALLENGE_ICONS[template.category] || Target
                const gradient = CHALLENGE_COLORS[template.category] || 'from-gray-500 to-gray-600'
                return (
                  <button
                    key={i}
                    onClick={() => addChallenge(template)}
                    className="flex w-full items-center gap-3.5 rounded-xl border border-gray-800 bg-gray-800/40 p-4 text-left transition-all active:bg-white/5 active:scale-[0.99]"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}>
                      <TIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">{template.title}</h4>
                      <p className="mt-0.5 text-xs text-gray-400">{template.description}</p>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-gray-500">
                        <span>Goal: {template.target} {template.unit}</span>
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Star className="h-2.5 w-2.5" /> +{template.reward}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TOAST ===================== */}
      {toastMsg && (
        <div className="fixed bottom-24 left-4 right-4 z-[200] flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="rounded-xl bg-gray-800 border border-gray-700 px-5 py-3 shadow-2xl shadow-black/50">
            <span className="text-sm font-medium text-foreground">{toastMsg}</span>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
