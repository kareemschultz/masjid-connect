'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  User, Flame, Star, BookOpen, CheckSquare, Trophy,
  Target, TrendingUp, Edit3, Save, LogOut, Users, Phone
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SettingGroup } from '@/components/setting-group'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { PRAYER_NAMES, type PrayerName } from '@/lib/prayer-times'
import Image from 'next/image'

type PrayerLog = Record<string, Record<PrayerName, boolean>>

function dateKey(d: Date): string {
  return d.toISOString().split('T')[0]
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.7 6.1 29.1 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.7 39.7 16.4 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.6-2.4 4.7-4.6 6.2l6.2 5.2c3.6-3.4 5.8-8.3 5.8-13.4 0-1.3-.1-2.7-.4-4z"/>
    </svg>
  )
}

export default function ProfilePage() {
  const [username, setUsername] = useState('')
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [prayerLog, setPrayerLog] = useState<PrayerLog>({})
  const [bookmarks, setBookmarks] = useState<{ surah: number; ayah: number }[]>([])
  const [session, setSession] = useState<{ user?: { name?: string; email?: string; image?: string } } | null>(null)
  const [signingIn, setSigningIn] = useState(false)
  
  // Buddy profile fields
  const [buddyUsername, setBuddyUsername] = useState('')
  const [buddyUsernameInput, setBuddyUsernameInput] = useState('')
  const [usernameSaving, setUsernameSaving] = useState(false)
  const [usernameMsg, setUsernameMsg] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [phoneSaving, setPhoneSaving] = useState(false)
  const [phoneMsg, setPhoneMsg] = useState('')

  useEffect(() => {
    const name = getItem(KEYS.USERNAME, '')
    setUsername(name)
    setEditName(name)
    setPoints(getItem(KEYS.POINTS, 0))
    setStreak(getItem(KEYS.STREAK, 0))
    setPrayerLog(getItem(KEYS.PRAYER_LOG, {}))
    setBookmarks(getItem(KEYS.BOOKMARKS, []))
    fetch('/api/auth/get-session', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { 
        if (data?.user) {
          setSession(data)
          // Fetch buddy profile data
          fetch('/api/user/preferences', { credentials: 'include' })
            .then(r => r.ok ? r.json() : {})
            .then(prefs => {
              const uname = prefs.username || ''
              const ph = prefs.phone || ''
              setBuddyUsername(uname)
              setBuddyUsernameInput(uname)
              setPhone(ph)
              setPhoneInput(ph)
            })
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  const saveName = () => {
    setUsername(editName.trim())
    setItem(KEYS.USERNAME, editName.trim())
    setEditing(false)
  }

  const saveUsername = async () => {
    if (!buddyUsernameInput.trim()) return
    const val = buddyUsernameInput.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsernameSaving(true)
    setUsernameMsg('')
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: val })
      })
      const data = await res.json()
      if (res.ok) {
        setBuddyUsername(val)
        setBuddyUsernameInput(val)
        setUsernameMsg('Username saved!')
      } else {
        setUsernameMsg(data.error || 'Failed to save')
      }
    } catch {
      setUsernameMsg('Error saving username')
    } finally {
      setUsernameSaving(false)
    }
  }

  const savePhone = async () => {
    if (!phoneInput.trim()) return
    setPhoneSaving(true)
    setPhoneMsg('')
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone: phoneInput.trim() })
      })
      const data = await res.json()
      if (res.ok) {
        setPhone(phoneInput.trim())
        setPhoneMsg('Phone saved!')
      } else {
        setPhoneMsg(data.error || 'Failed to save')
      }
    } catch {
      setPhoneMsg('Error saving phone')
    } finally {
      setPhoneSaving(false)
    }
  }

  // Calculate total prayers prayed
  const totalPrayers = useMemo(() => {
    let count = 0
    Object.values(prayerLog).forEach((day) => {
      PRAYER_NAMES.forEach((p) => {
        if (day[p]) count++
      })
    })
    return count
  }, [prayerLog])

  const daysTracked = Object.keys(prayerLog).length

  // Badge calculation
  const getBadge = () => {
    if (totalPrayers >= 500) return { label: 'Diamond', color: 'text-cyan-400', bg: 'bg-cyan-500/15' }
    if (totalPrayers >= 200) return { label: 'Gold', color: 'text-amber-400', bg: 'bg-amber-500/15' }
    if (totalPrayers >= 50) return { label: 'Silver', color: 'text-muted-foreground', bg: 'bg-gray-500/15' }
    return { label: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-500/15' }
  }
  const badge = getBadge()

  // Level calc
  const level = Math.floor(points / 100) + 1
  const levelProgress = (points % 100)

  // Perfect days count
  const perfectDays = useMemo(() => {
    return Object.values(prayerLog).filter((day) =>
      PRAYER_NAMES.every((p) => day[p])
    ).length
  }, [prayerLog])

  const stats = [
    { icon: Flame, label: 'Day Streak', value: streak, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { icon: CheckSquare, label: 'Prayers Logged', value: totalPrayers, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    { icon: Trophy, label: 'Perfect Days', value: perfectDays, color: 'text-purple-400', bg: 'bg-purple-500/15' },
    { icon: BookOpen, label: 'Bookmarks', value: bookmarks.length, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  ]

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={User}
        title="Profile"
        subtitle="Your Journey"
        gradient="from-emerald-900 to-teal-900"
        showBack
        heroTheme="community"
      />

      <div className="space-y-5 px-4 pt-5">
        {/* Google Sign-In */}
        {!session?.user && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-xs text-muted-foreground">Sign in with Google to sync your data, streaks, and prayer log across devices.</p>
            <button
              onClick={async () => {
                setSigningIn(true)
                try {
                  const { signIn } = await import('@/lib/auth-client')
                  await signIn.social({ provider: 'google', callbackURL: '/profile' })
                } catch { setSigningIn(false) }
              }}
              disabled={signingIn}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-secondary py-3 text-sm font-semibold text-foreground/80 transition-all active:bg-muted disabled:opacity-50"
            >
              <GoogleIcon />
              {signingIn ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        )}
        {session?.user && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            {session.user.image ? (
              <img src={session.user.image} alt="" className="h-10 w-10 rounded-full" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <User className="h-4 w-4 text-emerald-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{session.user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
            </div>
            <button
              onClick={async () => {
                const { signOut } = await import('@/lib/auth-client')
                await signOut()
                setSession(null)
              }}
              className="flex h-8 items-center gap-1 rounded-lg bg-secondary px-2.5 text-[11px] font-medium text-muted-foreground active:bg-muted"
            >
              <LogOut className="h-3 w-3" /> Sign Out
            </button>
          </div>
        )}

        {/* Profile card */}
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6">
          <div className="relative">
            <Image
              src="/images/logo.jpg"
              alt="Profile"
              width={72}
              height={72}
              className="rounded-2xl"
            />
            <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ${badge.bg}`}>
              <Star className={`h-3 w-3 ${badge.color}`} />
            </div>
          </div>

          {editing ? (
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="rounded-xl border border-border bg-secondary px-4 py-2 text-center text-sm text-foreground outline-none focus:border-emerald-500/50"
                autoFocus
              />
              <button
                onClick={saveName}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-foreground"
                aria-label="Save name"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="mt-4 flex items-center gap-2"
            >
              <span className="text-lg font-bold text-foreground">
                {username || 'Set Your Name'}
              </span>
              <Edit3 className="h-3.5 w-3.5 text-muted-foreground/80" />
            </button>
          )}

          <div className={`mt-2 rounded-full px-3 py-1 ${badge.bg}`}>
            <span className={`text-xs font-semibold ${badge.color}`}>
              {badge.label} Rank
            </span>
          </div>

          {/* Level progress */}
          <div className="mt-4 w-full max-w-xs">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Level {level}</span>
              <span className="text-xs text-emerald-400">{points} pts</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground/80">
              {100 - levelProgress} points to Level {level + 1}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <SettingGroup label="Your Stats" accentColor="bg-amber-500">
          <div className="grid grid-cols-2 gap-px bg-secondary">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 bg-card p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </SettingGroup>

        {/* Buddy Profile Settings */}
        {session?.user && (
          <SettingGroup label="Buddy Profile" accentColor="bg-cyan-500" icon={Users}>
            <div className="p-4 space-y-4">
              {/* Username */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <label className="text-xs font-semibold uppercase tracking-widest text-cyan-400/70">Your @Username</label>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Set a @username so Faith Buddies can find you.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={buddyUsernameInput}
                    onChange={(e) => setBuddyUsernameInput(e.target.value)}
                    placeholder="@username"
                    className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-cyan-500/50"
                  />
                  <button
                    onClick={saveUsername}
                    disabled={usernameSaving || !buddyUsernameInput.trim() || buddyUsernameInput === buddyUsername}
                    className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-foreground disabled:opacity-40"
                  >
                    {usernameSaving ? '...' : 'Save'}
                  </button>
                </div>
                {usernameMsg && (
                  <p className={`mt-2 text-xs ${usernameMsg.includes('saved') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {usernameMsg}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="border-t border-border pt-4">
                <div className="mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-cyan-400" />
                  <label className="text-xs font-semibold uppercase tracking-widest text-cyan-400/70">Phone Number</label>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Add your phone number so buddies can find you.
                </p>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+5926123456"
                    className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-cyan-500/50"
                  />
                  <button
                    onClick={savePhone}
                    disabled={phoneSaving || !phoneInput.trim() || phoneInput === phone}
                    className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-foreground disabled:opacity-40"
                  >
                    {phoneSaving ? '...' : 'Save'}
                  </button>
                </div>
                {phoneMsg && (
                  <p className={`mt-2 text-xs ${phoneMsg.includes('saved') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {phoneMsg}
                  </p>
                )}
              </div>
            </div>
          </SettingGroup>
        )}

        {/* Activity Summary */}
        <SettingGroup label="Activity" accentColor="bg-teal-500">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground/80" />
                <span className="text-sm text-muted-foreground">Days Tracked</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{daysTracked}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground/80" />
                <span className="text-sm text-muted-foreground">Avg Prayers/Day</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {daysTracked > 0 ? (totalPrayers / daysTracked).toFixed(1) : '0'}
              </span>
            </div>
          </div>
        </SettingGroup>
      </div>

      <BottomNav />
    </div>
  )
}
