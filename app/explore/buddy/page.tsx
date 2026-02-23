'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users, Trophy, Bell, Plus, X, Heart, Flame, Star,
  MessageCircle, Target, Send, Copy, Check, Share2,
  Swords, BookOpen, Moon, HandHeart, ChevronRight,
  Sparkles, Info, Crown, Medal, Award, Zap, ShieldCheck, Sun
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
  totalPoints: number
  lastActive?: string
  avatar?: string
  tier?: 'bronze' | 'silver' | 'gold'
  status?: 'pending' | 'accepted'
  direction?: 'sent' | 'received'
}

interface LeaderboardEntry {
  userId: string
  name: string
  displayName: string
  totalPoints: number
  streak: number
  level: { level: number, label: string }
  rank: number
  isMe: boolean
  avatar?: string
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
  category: 'prayer' | 'quran' | 'fasting' | 'dhikr' | 'charity' | 'nawafil' | 'witr'
}

function getTier(points: number): 'bronze' | 'silver' | 'gold' {
  if (points >= 4000) return 'gold'
  if (points >= 1000) return 'silver'
  return 'bronze'
}

function getTierColor(tier: string) {
  if (tier === 'gold') return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' }
  if (tier === 'silver') return { bg: 'bg-gray-400/20', text: 'text-gray-300', border: 'border-gray-400/30' }
  return { bg: 'bg-orange-700/20', text: 'text-orange-400', border: 'border-orange-700/30' }
}

const RANK_ICON = { gold: Crown, silver: Medal, bronze: Award }

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
]

const CHALLENGE_ICONS: Record<string, typeof BookOpen> = {
  prayer: HandHeart, quran: BookOpen, fasting: Moon, dhikr: Sparkles, charity: Heart,
  nawafil: Moon, witr: Star,
}

const CHALLENGE_COLORS: Record<string, string> = {
  prayer: 'from-emerald-500 to-teal-600',
  quran: 'from-purple-500 to-indigo-600',
  fasting: 'from-amber-500 to-orange-600',
  dhikr: 'from-blue-500 to-cyan-600',
  charity: 'from-pink-500 to-rose-600',
  nawafil: 'from-indigo-500 to-violet-600',
  witr: 'from-amber-400 to-orange-500',
}

const NUDGE_MESSAGES = [
  { text: 'Time for Salah! Praying together is 27x more rewarding.', icon: HandHeart, color: 'text-emerald-400' },
  { text: 'Have you read your Quran today? Let us read together!', icon: BookOpen, color: 'text-purple-400' },
  { text: 'SubhanAllah, keep going! Your streak inspires me.', icon: Flame, color: 'text-amber-400' },
  { text: 'The Prophet (PBUH) said: "The best of you are those who remind others of Allah."', icon: Star, color: 'text-blue-400' },
  { text: 'Reminder: Do your morning adhkar today. I already did mine!', icon: Sparkles, color: 'text-cyan-400' },
  { text: 'Time for Tahajjud! The last third of the night is here. Join me in night prayer.', icon: Moon, color: 'text-indigo-400' },
  { text: 'Did you pray Witr last night? Let us hold each other accountable!', icon: Star, color: 'text-amber-400' },
  { text: 'The Prophet ﷺ never abandoned the 2 Fajr Sunnah — not even on a journey. Have you prayed yours?', icon: Flame, color: 'text-orange-400' },
  { text: 'Duha prayer is coming up soon! The Prophet ﷺ said it equals Hajj and Umrah rewards (with Fajr in congregation).', icon: Sun, color: 'text-yellow-400' },
]

const NEW_CHALLENGE_TEMPLATES = [
  { title: 'Prayer Streak', description: 'Pray all 5 daily prayers consistently', category: 'prayer' as const, target: 30, unit: 'days', reward: 150 },
  { title: 'Quran Reading', description: 'Read a set number of pages together', category: 'quran' as const, target: 20, unit: 'pages', reward: 100 },
  { title: 'Fasting Challenge', description: 'Fast voluntary days together (Mon/Thu)', category: 'fasting' as const, target: 8, unit: 'fasts', reward: 200 },
  { title: 'Daily Dhikr', description: 'Complete daily dhikr for a month', category: 'dhikr' as const, target: 30, unit: 'days', reward: 120 },
  { title: 'Charity Drive', description: 'Give sadaqah every Friday together', category: 'charity' as const, target: 4, unit: 'donations', reward: 250 },
  { title: 'Witr Streak', description: 'Pray Witr every night for 30 days — never miss the wajib prayer!', category: 'witr' as const, target: 30, unit: 'nights', reward: 300 },
  { title: 'Tahajjud Week', description: 'Wake up for Tahajjud for 7 consecutive nights. The night prayer brings you closest to Allah.', category: 'nawafil' as const, target: 7, unit: 'nights', reward: 400 },
  { title: 'Duha Prayer Month', description: 'Pray Duha (the forenoon prayer) every day for 30 days.', category: 'nawafil' as const, target: 30, unit: 'days', reward: 350 },
  { title: 'Nawafil Sprint', description: 'Log at least one nawafil prayer daily for 14 days. Any optional prayer counts!', category: 'nawafil' as const, target: 14, unit: 'days', reward: 250 },
  { title: 'Fajr Sunnah Commitment', description: "Pray the 2 Fajr Sunnah rak'ahs every single day for 30 days — better than the world and all it contains!", category: 'prayer' as const, target: 30, unit: 'days', reward: 200 },
]

export default function BuddyPage() {
  const [buddies, setBuddies] = useState<Buddy[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [tab, setTab] = useState<'buddies' | 'challenges' | 'leaderboard'>('buddies')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showNudgeModal, setShowNudgeModal] = useState<string | null>(null)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [showBuddyDetail, setShowBuddyDetail] = useState<Buddy | null>(null)
  const [copied, setCopied] = useState(false)
  const [nudgeSent, setNudgeSent] = useState<Record<string, boolean>>({})
  const [newBuddyEmail, setNewBuddyEmail] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const fetchBuddies = useCallback(async () => {
    try {
      const res = await fetch('/api/friends')
      if (res.ok) {
        const data = await res.json()
        setBuddies(data.map((b: any) => ({
          ...b,
          points: b.totalPoints || 0,
          tier: getTier(b.totalPoints || 0),
          avatar: (b.displayName || b.name || '?')[0].toUpperCase(),
          lastActive: 'Active recently'
        })))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard')
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data.map((e: any) => ({
          ...e,
          avatar: (e.displayName || e.name || '?')[0].toUpperCase()
        })))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    fetchBuddies()
    setChallenges(getItem(KEYS.BUDDY_CHALLENGES, DEMO_CHALLENGES))
  }, [fetchBuddies])

  useEffect(() => {
    if (tab === 'leaderboard') fetchLeaderboard()
  }, [tab, fetchLeaderboard])

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }, [])

  const addBuddy = async () => {
    if (!newBuddyEmail.trim()) return
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newBuddyEmail.trim() })
      })
      
      const data = await res.json()
      if (res.ok) {
        showToast(`Request sent to ${data.addressee?.name || newBuddyEmail}`)
        setNewBuddyEmail('')
        setShowAddModal(false)
        fetchBuddies()
      } else {
        showToast(data.error || 'Failed to send request')
      }
    } catch (e) {
      showToast('Error sending request')
    }
  }

  const acceptBuddy = async (id: string) => {
    try {
      const res = await fetch(`/api/friends/${id}/accept`, { method: 'POST' })
      if (res.ok) {
        showToast('Friend request accepted!')
        fetchBuddies()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const removeBuddy = async (id: string) => {
    if (!confirm('Remove this buddy?')) return
    try {
      const res = await fetch(`/api/friends/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setBuddies(prev => prev.filter(b => b.id !== id))
        setShowBuddyDetail(null)
        showToast('Buddy removed')
      }
    } catch (e) {
      console.error(e)
    }
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
      participants: ['You'],
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
    const link = 'https://masjidconnectgy.com'
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const TABS = [
    { key: 'buddies' as const, label: 'Buddies', icon: Users },
    { key: 'challenges' as const, label: 'Challenges', icon: Swords },
    { key: 'leaderboard' as const, label: 'Board', icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
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
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyInviteLink}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all active:scale-[0.97] ${
                  copied ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-gray-800 bg-gray-900'
                }`}
              >
                {copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5 text-blue-400" />}
                <span className={`text-xs font-medium ${copied ? 'text-emerald-400' : 'text-gray-300'}`}>
                  {copied ? 'Link Copied!' : 'Copy Invite Link'}
                </span>
              </button>
              <button
                onClick={() => shareOrCopy({
                  title: 'Join MasjidConnect GY',
                  text: 'Join me on MasjidConnect GY! Let\'s grow our faith together.\n\nhttps://masjidconnectgy.com'
                })}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-all active:scale-[0.97]"
              >
                <Share2 className="h-5 w-5 text-purple-400" />
                <span className="text-xs font-medium text-gray-300">Share App</span>
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-700 py-4 text-sm font-medium text-gray-400 transition-all active:border-blue-500 active:text-blue-400 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Add a Faith Buddy
            </button>

            {/* Pending Requests */}
            {buddies.filter(b => b.status === 'pending' && b.direction === 'received').length > 0 && (
              <SettingGroup label="Friend Requests" accentColor="bg-orange-500">
                <div className="divide-y divide-gray-800/50">
                  {buddies.filter(b => b.status === 'pending' && b.direction === 'received').map(b => (
                    <div key={b.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 font-bold text-white">
                          {b.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{b.name}</p>
                          <p className="text-xs text-gray-500">Wants to be your buddy</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => acceptBuddy(b.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">Accept</button>
                        <button onClick={() => removeBuddy(b.id)} className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-400">Ignore</button>
                      </div>
                    </div>
                  ))}
                </div>
              </SettingGroup>
            )}

            {buddies.filter(b => b.status === 'accepted').length > 0 && (
              <SettingGroup label={`Your Buddies (${buddies.filter(b => b.status === 'accepted').length})`} accentColor="bg-blue-500">
                <div className="divide-y divide-gray-800/50">
                  {buddies.filter(b => b.status === 'accepted').map((buddy) => {
                    const tierStyle = getTierColor(buddy.tier || 'bronze')
                    const TierIcon = RANK_ICON[buddy.tier || 'bronze']
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
                            <span className={`text-[11px] ${buddy.lastActive?.includes('Active') ? 'text-emerald-400' : 'text-gray-500'}`}>
                              {buddy.lastActive || 'Offline'}
                            </span>
                            <span className="flex items-center gap-0.5 text-[11px] text-gray-500">
                              <Star className="h-2.5 w-2.5 text-amber-400/60" /> {buddy.totalPoints} pts
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
          </>
        )}

        {/* ===================== CHALLENGES TAB (Local Only for now) ===================== */}
        {tab === 'challenges' && (
          <>
            {challenges.map((c) => {
              const pct = Math.round((c.current / c.target) * 100)
              const CIcon = CHALLENGE_ICONS[c.category] || Target
              const gradient = CHALLENGE_COLORS[c.category] || 'from-gray-500 to-gray-600'
              return (
                <div key={c.id} className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
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
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500">{c.current} / {c.target} {c.unit}</span>
                        <span className="text-[11px] font-semibold text-emerald-400">{pct}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-800">
                        <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <button onClick={() => setShowChallengeModal(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-700 py-4 text-sm font-medium text-gray-400">
              <Plus className="h-4 w-4" /> Create New Challenge
            </button>
          </>
        )}

        {/* ===================== LEADERBOARD TAB ===================== */}
        {tab === 'leaderboard' && (
          <>
            {leaderboard.length >= 3 && (
              <div className="flex items-end justify-center gap-3 py-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 text-lg font-bold text-white">
                    {leaderboard[1].avatar}
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400/20 border border-gray-400/40">
                      <span className="text-[10px] font-bold text-gray-300">2</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-400 truncate max-w-[64px]">{leaderboard[1].name}</span>
                  <span className="text-[11px] font-bold text-gray-300">{leaderboard[1].totalPoints}</span>
                </div>
                <div className="flex flex-col items-center gap-2 -mt-4">
                  <Crown className="h-5 w-5 text-amber-400 animate-bounce" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-xl font-bold text-white ring-2 ring-amber-400/30 ring-offset-2 ring-offset-background">
                    {leaderboard[0].avatar}
                  </div>
                  <span className="text-sm font-semibold text-foreground truncate max-w-[72px]">{leaderboard[0].name}</span>
                  <span className="text-xs font-bold text-amber-400">{leaderboard[0].totalPoints}</span>
                </div>
                <div className="flex flex-col items-center gap-2 mt-2">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 text-lg font-bold text-white">
                    {leaderboard[2].avatar}
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600/20 border border-orange-600/40">
                      <span className="text-[10px] font-bold text-orange-400">3</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-400 truncate max-w-[64px]">{leaderboard[2].name}</span>
                  <span className="text-[11px] font-bold text-orange-400">{leaderboard[2].totalPoints}</span>
                </div>
              </div>
            )}

            <SettingGroup label="Full Rankings" accentColor="bg-amber-500">
              <div className="divide-y divide-gray-800/50">
                {leaderboard.map((user, i) => {
                  const isYou = user.isMe
                  const levelLabel = user.level?.label || 'Novice'
                  return (
                    <div key={user.userId} className={`flex items-center gap-3 p-4 ${isYou ? 'bg-emerald-500/5' : ''}`}>
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
                          <span className="rounded-md bg-gray-800 px-1.5 py-0.5 text-[9px] font-medium text-gray-400 uppercase">
                            {levelLabel}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Flame className="h-2.5 w-2.5 text-amber-400/60" /> {user.streak} day streak
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-sm font-bold text-foreground">{user.totalPoints}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </SettingGroup>
          </>
        )}

        {/* ... (Modals remain mostly same, simplified AddBuddy to use email input) */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
            <div className="relative w-full max-w-sm rounded-3xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15">
                <Users className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-center text-lg font-bold text-foreground">Add a Faith Buddy</h3>
              <p className="mt-1 text-center text-sm text-gray-400">Enter their email to send a request</p>
              <input
                type="email"
                value={newBuddyEmail}
                onChange={(e) => setNewBuddyEmail(e.target.value)}
                placeholder="friend@example.com"
                className="mt-5 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3.5 text-sm text-foreground placeholder-gray-500 outline-none focus:border-blue-500/50"
              />
              <div className="mt-4 flex gap-3">
                <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300">Cancel</button>
                <button onClick={addBuddy} disabled={!newBuddyEmail.trim()} className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-medium text-white disabled:opacity-50">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
