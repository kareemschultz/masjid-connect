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
import { getLevel, LEVELS } from '@/lib/points-client'
import { shareOrCopy } from '@/lib/share'
import Link from 'next/link'

interface Buddy {
  id: string
  name: string
  streak: number
  totalPoints: number
  lastActive?: string
  avatar?: string
  level?: { level: number; label: string; arabic: string; min: number }
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

function getLevelStyle(levelNum: number) {
  const styles: Record<number, { bg: string; text: string; border: string; icon: string }> = {
    1: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', icon: '\uD83C\uDF31' },
    2: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: '\uD83D\uDCFF' },
    3: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: '\u2B50' },
    4: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', icon: '\u2728' },
    5: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', icon: '\uD83D\uDC51' },
  }
  return styles[levelNum] || styles[1]
}

function computeProgress(challenge: Challenge): number {
  try {
    if (challenge.category === 'prayer') {
      const streak = getItem('prayer_streak_cache', 0)
      return Math.min(challenge.target, typeof streak === 'number' ? streak : 0)
    }
    if (challenge.category === 'quran') {
      const juzDone = getItem('khatam_personal_progress', [])
      return Math.min(challenge.target, Array.isArray(juzDone) ? juzDone.length : 0)
    }
    if (challenge.category === 'nawafil') {
      const nawafilLog = getItem(KEYS.NAWAFIL_LOG, {} as Record<string, Record<string, number>>)
      const days = Object.keys(nawafilLog).filter(d => {
        const entry = nawafilLog[d]
        return entry && Object.values(entry).some((v) => typeof v === 'number' && v > 0)
      })
      return Math.min(challenge.target, days.length)
    }
    if (challenge.category === 'witr') {
      const sunnahLog = getItem(KEYS.SUNNAH_LOG, {} as Record<string, Record<string, boolean>>)
      const days = Object.keys(sunnahLog).filter(d => {
        const entry = sunnahLog[d] as Record<string, boolean> | undefined
        return entry?.witr
      })
      return Math.min(challenge.target, days.length)
    }
    if (challenge.category === 'fasting') {
      let count = 0
      for (const key of [KEYS.FASTING_LOG_RAMADAN, KEYS.FASTING_LOG_SHAWWAL, KEYS.FASTING_LOG_MONTHU, KEYS.FASTING_LOG_AYYAM, KEYS.FASTING_LOG_VOLUNTARY]) {
        const log = getItem(key, {} as Record<string, string>)
        count += Object.values(log).filter((v) => v === 'fasted').length
      }
      return Math.min(challenge.target, count)
    }
    if (challenge.category === 'dhikr') {
      return challenge.current
    }
  } catch { /* fallback */ }
  return challenge.current
}

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
  { text: "The Prophet \u2E3A never abandoned the 2 Fajr Sunnah \u2014 not even on a journey. Have you prayed yours?", icon: Flame, color: 'text-orange-400' },
  { text: "Duha prayer is coming up soon! The Prophet \u2E3A said it equals Hajj and Umrah rewards (with Fajr in congregation).", icon: Sun, color: 'text-yellow-400' },
]

const NEW_CHALLENGE_TEMPLATES = [
  { title: 'Prayer Streak', description: 'Pray all 5 daily prayers consistently', category: 'prayer' as const, target: 30, unit: 'days', reward: 150 },
  { title: 'Quran Reading', description: 'Read a set number of pages together', category: 'quran' as const, target: 20, unit: 'pages', reward: 100 },
  { title: 'Fasting Challenge', description: 'Fast voluntary days together (Mon/Thu)', category: 'fasting' as const, target: 8, unit: 'fasts', reward: 200 },
  { title: 'Daily Dhikr', description: 'Complete daily dhikr for a month', category: 'dhikr' as const, target: 30, unit: 'days', reward: 120 },
  { title: 'Charity Drive', description: 'Give sadaqah every Friday together', category: 'charity' as const, target: 4, unit: 'donations', reward: 250 },
  { title: 'Witr Streak', description: 'Pray Witr every night for 30 days \u2014 never miss the wajib prayer!', category: 'witr' as const, target: 30, unit: 'nights', reward: 300 },
  { title: 'Tahajjud Week', description: 'Wake up for Tahajjud for 7 consecutive nights. The night prayer brings you closest to Allah.', category: 'nawafil' as const, target: 7, unit: 'nights', reward: 400 },
  { title: 'Duha Prayer Month', description: 'Pray Duha (the forenoon prayer) every day for 30 days.', category: 'nawafil' as const, target: 30, unit: 'days', reward: 350 },
  { title: 'Nawafil Sprint', description: 'Log at least one nawafil prayer daily for 14 days. Any optional prayer counts!', category: 'nawafil' as const, target: 14, unit: 'days', reward: 250 },
  { title: 'Fajr Sunnah Commitment', description: "Pray the 2 Fajr Sunnah rak'ahs every single day for 30 days \u2014 better than the world and all it contains!", category: 'prayer' as const, target: 30, unit: 'days', reward: 200 },
]

export default function BuddyPage() {
  const [buddies, setBuddies] = useState<Buddy[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [myStats, setMyStats] = useState<{ totalPoints: number; streak: number } | null>(null)
  const [tab, setTab] = useState<'buddies' | 'challenges' | 'leaderboard'>('buddies')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showNudgeModal, setShowNudgeModal] = useState<string | null>(null)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [showBuddyDetail, setShowBuddyDetail] = useState<Buddy | null>(null)
  const [copied, setCopied] = useState(false)
  const [nudgeSent, setNudgeSent] = useState<Record<string, boolean>>({})
  const [myUsername, setMyUsername] = useState<string | null>(null)
  const [addMode, setAddMode] = useState<'email' | 'username' | 'phone'>('email')
  const [newBuddyInput, setNewBuddyInput] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  const fetchBuddies = useCallback(async () => {
    try {
      const res = await fetch('/api/friends')
      if (res.ok) {
        const data = await res.json()
        setBuddies(data.map((b: any) => ({
          ...b,
          points: b.totalPoints || 0,
          level: getLevel(b.totalPoints || 0),
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
        const me = data.find((e: any) => e.isMe)
        if (me) setMyStats({ totalPoints: me.totalPoints, streak: me.streak })
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    fetchBuddies()
    fetchLeaderboard()
    const stored = getItem(KEYS.BUDDY_CHALLENGES, DEMO_CHALLENGES)
    const withProgress = stored.map((c: Challenge) => ({ ...c, current: computeProgress(c) }))
    setChallenges(withProgress)
    // Fetch own profile to personalise the invite link
    fetch('/api/user/profile', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.username) setMyUsername(data.username) })
      .catch(() => {})
  }, [fetchBuddies, fetchLeaderboard])

  useEffect(() => {
    if (tab === 'leaderboard') fetchLeaderboard()
  }, [tab, fetchLeaderboard])

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }, [])

  const handleBuddyInputChange = (val: string) => {
    setNewBuddyInput(val)
    if (val.startsWith('@')) setAddMode('username')
    else if (/^\+?[0-9\s]{4,}$/.test(val) && !val.includes('@')) setAddMode('phone')
  }

  const addBuddy = async () => {
    if (!newBuddyInput.trim()) return
    let body: Record<string, string> = {}
    const val = newBuddyInput.trim()
    if (addMode === 'username') {
      body = { username: val.replace(/^@/, '') }
    } else if (addMode === 'phone') {
      body = { phone: val }
    } else {
      body = { email: val }
    }
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) {
        showToast(`Request sent to ${data.addressee?.displayName || data.addressee?.name || val}`)
        setNewBuddyInput('')
        setAddMode('email')
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
    const base = 'https://masjidconnectgy.com/explore/buddy'
    const link = myUsername ? `${base}?invite=@${myUsername}` : base
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const myLevel = myStats ? getLevel(myStats.totalPoints) : LEVELS[LEVELS.length - 1]
  const nextLevel = LEVELS.slice().reverse().find(l => l.level === myLevel.level + 1)
  const myLevelStyle = getLevelStyle(myLevel.level)

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
            {/* My Stats Card */}
            {myStats && (
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 p-4">
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Your Standing</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white">
                    {getItem(KEYS.USERNAME, '?')[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${myLevelStyle.bg} ${myLevelStyle.text}`}>
                        {myLevelStyle.icon} {myLevel.label}
                      </span>
                      {myStats.streak >= 3 && (
                        <span className="flex items-center gap-0.5 text-xs text-amber-400">
                          <Flame className="h-3 w-3" /> {myStats.streak}d
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-lg font-bold text-foreground">{myStats.totalPoints.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500">Total Points</p>
                      </div>
                      {nextLevel && (
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Next: {nextLevel.label}</span>
                            <span>{(nextLevel.min - myStats.totalPoints).toLocaleString()} pts away</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-800">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                              style={{ width: `${Math.min(100, ((myStats.totalPoints - myLevel.min) / (nextLevel.min - myLevel.min)) * 100)}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  text: `Join me on MasjidConnect GY — Faith Buddies! Let's grow together in faith.\n\n${myUsername ? `Add me: @${myUsername}\n\n` : ''}https://masjidconnectgy.com/explore/buddy`
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
                    const ls = getLevelStyle(buddy.level?.level || 1)
                    return (
                      <button
                        key={buddy.id}
                        onClick={() => setShowBuddyDetail(buddy)}
                        className="flex w-full items-center gap-3 p-4 text-left transition-all active:bg-white/5"
                      >
                        <div className="relative">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
                            {buddy.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ${ls.bg} border ${ls.border} text-xs`}>
                            {ls.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground truncate">{buddy.name}</span>
                            <span className={`text-[10px] font-semibold ${ls.text}`}>{buddy.level?.label || 'Seeker'}</span>
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

        {/* ===================== CHALLENGES TAB ===================== */}
        {tab === 'challenges' && (
          <>
            {challenges.map((c) => {
              const pct = Math.round((c.current / c.target) * 100)
              const isCompleted = c.current >= c.target
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
                        {isCompleted ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 items-center rounded-lg bg-emerald-500/20 px-2 text-[10px] font-bold text-emerald-400">
                              \u2713 COMPLETED
                            </div>
                            <span className="text-[11px] text-gray-400">{c.current}/{c.target} {c.unit}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500">{c.current} / {c.target} {c.unit}</span>
                        )}
                        <span className={`text-[11px] font-semibold ${isCompleted ? 'text-emerald-400' : 'text-emerald-400'}`}>{Math.min(pct, 100)}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-800">
                        <div className={`h-full rounded-full bg-gradient-to-r ${isCompleted ? 'from-emerald-400 to-emerald-500' : gradient}`} style={{ width: `${Math.min(pct, 100)}%` }} />
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
                  const levelLabel = user.level?.label || 'Seeker'
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
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

        {/* ===================== MODALS ===================== */}

        {/* Add Buddy Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
            <div className="relative w-full max-w-sm rounded-3xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15">
                <Users className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-center text-lg font-bold text-foreground">Add a Faith Buddy</h3>
              <p className="mt-1 text-center text-sm text-gray-400">Find them by email, @username, or phone</p>

              {/* Mode selector */}
              <div className="mt-4 flex gap-1 rounded-xl bg-gray-800 p-1">
                {(['email', 'username', 'phone'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => { setAddMode(mode); setNewBuddyInput('') }}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                      addMode === mode
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-400 active:bg-gray-700'
                    }`}
                  >
                    {mode === 'email' ? 'Email' : mode === 'username' ? '@Username' : 'Phone'}
                  </button>
                ))}
              </div>

              <input
                type={addMode === 'email' ? 'email' : addMode === 'phone' ? 'tel' : 'text'}
                value={newBuddyInput}
                onChange={(e) => handleBuddyInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addBuddy()}
                placeholder={
                  addMode === 'email' ? 'friend@example.com'
                  : addMode === 'username' ? '@their_username'
                  : '+592 XXX XXXX'
                }
                className="mt-4 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3.5 text-sm text-foreground placeholder-gray-500 outline-none focus:border-blue-500/50"
              />

              {addMode === 'username' && (
                <p className="mt-2 text-[11px] text-gray-500 text-center">
                  Ask your buddy to set their @username in Settings
                </p>
              )}
              {addMode === 'phone' && (
                <p className="mt-2 text-[11px] text-gray-500 text-center">
                  Include country code, e.g. +592 for Guyana
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <button onClick={() => { setShowAddModal(false); setNewBuddyInput(''); setAddMode('email') }}
                  className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300">
                  Cancel
                </button>
                <button onClick={addBuddy} disabled={!newBuddyInput.trim()}
                  className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-medium text-white disabled:opacity-50">
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buddy Detail Modal */}
        {showBuddyDetail && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowBuddyDetail(null)} />
            <div className="relative w-full max-w-sm rounded-t-3xl border-t border-gray-700 bg-gray-900 p-6 pb-10 shadow-2xl">
              <button onClick={() => setShowBuddyDetail(null)} className="absolute right-4 top-4 rounded-lg bg-gray-800 p-1.5">
                <X className="h-4 w-4 text-gray-400" />
              </button>
              <div className="flex flex-col items-center">
                {(() => {
                  const ls = getLevelStyle(showBuddyDetail.level?.level || 1)
                  return (
                    <>
                      <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white">
                          {showBuddyDetail.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full ${ls.bg} border ${ls.border} text-sm`}>
                          {ls.icon}
                        </div>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-foreground">{showBuddyDetail.name}</h3>
                      <span className={`text-xs font-semibold ${ls.text}`}>{showBuddyDetail.level?.label || 'Seeker'}</span>
                    </>
                  )
                })()}
              </div>

              {/* Stats comparison */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-800 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-400">{myStats?.totalPoints?.toLocaleString() || 0}</p>
                  <p className="text-[10px] text-gray-500">Your Points</p>
                </div>
                <div className="rounded-xl bg-gray-800 p-3 text-center">
                  <p className="text-lg font-bold text-blue-400">{showBuddyDetail.totalPoints?.toLocaleString() || 0}</p>
                  <p className="text-[10px] text-gray-500">Their Points</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-800/60 px-4 py-3">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Flame className="h-3.5 w-3.5 text-amber-400" /> Streak
                </span>
                <span className="text-sm font-bold text-foreground">{showBuddyDetail.streak} days</span>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => { setShowBuddyDetail(null); setShowNudgeModal(showBuddyDetail.id) }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-medium text-white"
                >
                  <Bell className="h-4 w-4" /> Nudge
                </button>
                <button
                  onClick={() => removeBuddy(showBuddyDetail.id)}
                  className="rounded-xl bg-gray-800 px-4 py-3 text-sm font-medium text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nudge Modal */}
        {showNudgeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowNudgeModal(null)} />
            <div className="relative w-full max-w-sm rounded-3xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
              <h3 className="mb-4 text-center text-lg font-bold text-foreground">Send a Nudge</h3>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {NUDGE_MESSAGES.map((nudge, i) => (
                  <button
                    key={i}
                    onClick={() => sendNudge(showNudgeModal)}
                    className="flex w-full items-start gap-3 rounded-xl border border-gray-800 bg-gray-800/50 p-3 text-left transition-all active:bg-gray-700"
                  >
                    <nudge.icon className={`mt-0.5 h-4 w-4 shrink-0 ${nudge.color}`} />
                    <span className="text-xs leading-relaxed text-gray-300">{nudge.text}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowNudgeModal(null)}
                className="mt-4 w-full rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* New Challenge Modal */}
        {showChallengeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowChallengeModal(false)} />
            <div className="relative w-full max-w-sm rounded-3xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
              <h3 className="mb-4 text-center text-lg font-bold text-foreground">Choose a Challenge</h3>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {NEW_CHALLENGE_TEMPLATES.map((t, i) => {
                  const CIcon = CHALLENGE_ICONS[t.category] || Target
                  const gradient = CHALLENGE_COLORS[t.category] || 'from-gray-500 to-gray-600'
                  return (
                    <button
                      key={i}
                      onClick={() => addChallenge(t)}
                      className="flex w-full items-start gap-3 rounded-xl border border-gray-800 bg-gray-800/50 p-3 text-left transition-all active:bg-gray-700"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}>
                        <CIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground">{t.title}</p>
                        <p className="text-[10px] text-gray-500">{t.description}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] text-gray-600">{t.target} {t.unit}</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                            <Star className="h-2 w-2" /> +{t.reward}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <button onClick={() => setShowChallengeModal(false)}
                className="mt-4 w-full rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMsg && (
          <div className="fixed bottom-24 left-1/2 z-[200] -translate-x-1/2 rounded-2xl bg-gray-800 px-5 py-3 text-xs font-medium text-white shadow-xl border border-gray-700">
            {toastMsg}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
