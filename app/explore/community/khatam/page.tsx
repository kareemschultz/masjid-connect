'use client'

import { useState, useEffect, useMemo } from 'react'
import { BookOpen, Check, Cloud, CloudOff } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'
import Link from 'next/link'

interface JuzClaim {
  initials: string
  completed: boolean
}

type KhatamClaims = Record<number, JuzClaim>

export default function KhatamPage() {
  const [claims, setClaims] = useState<KhatamClaims>({})
  const [userInitials, setUserInitials] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [synced, setSynced] = useState<'loading' | 'online' | 'offline'>('loading')
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    // Check auth status
    fetch('/api/auth/get-session', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setIsSignedIn(true) })
      .catch(() => {})

    // Try API first, fallback to localStorage
    fetch('/api/community/khatam')
      .then((res) => (res.ok ? res.json() : null))
      .then((rows) => {
        if (Array.isArray(rows) && rows.length > 0) {
          const mapped: KhatamClaims = {}
          for (const row of rows) {
            mapped[row.juz] = { initials: row.user_name, completed: row.completed }
          }
          setClaims(mapped)
          // Also update localStorage as cache
          setItem('khatam_claims', mapped)
          setSynced('online')
        } else {
          setClaims(getItem<KhatamClaims>('khatam_claims', {}))
          setSynced('online')
        }
      })
      .catch(() => {
        setClaims(getItem<KhatamClaims>('khatam_claims', {}))
        setSynced('offline')
      })
    setUserInitials(getItem<string>('khatam_user_initials', ''))
  }, [])

  const saveName = () => {
    const initials = nameInput
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 3)
    if (!initials) return
    setUserInitials(initials)
    setItem('khatam_user_initials', initials)
    setNameInput('')
  }

  const claimJuz = (juz: number) => {
    if (!userInitials) return
    if (claims[juz]) return
    const updated = { ...claims, [juz]: { initials: userInitials, completed: false } }
    setClaims(updated)
    setItem('khatam_claims', updated)

    fetch('/api/community/khatam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ juz, user_name: userInitials, completed: false }),
    }).catch(() => {})
  }

  const completeJuz = (juz: number) => {
    const claim = claims[juz]
    if (!claim || claim.initials !== userInitials) return
    const updated = { ...claims, [juz]: { ...claim, completed: true } }
    setClaims(updated)
    setItem('khatam_claims', updated)

    fetch('/api/community/khatam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ juz, user_name: userInitials, completed: true }),
    }).catch(() => {})
  }

  const stats = useMemo(() => {
    const entries = Object.values(claims)
    const claimed = entries.length
    const completed = entries.filter((c) => c.completed).length
    const pct = Math.round((claimed / 30) * 100)
    return { claimed, completed, pct }
  }, [claims])

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (stats.pct / 100) * circumference

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero icon={BookOpen} title="Khatam Collective" subtitle="Complete the Quran Together" gradient="from-emerald-900 to-teal-900" showBack heroTheme="quran" />

      <div className="px-4 pt-5 -mt-2 space-y-5">
        {!userInitials ? (
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">Enter your name to get started</p>
            <p className="text-xs text-muted-foreground">Your initials will appear on the Juz you claim.</p>
            <div className="flex gap-3">
              <input type="text" placeholder="Your name or initials" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-emerald-500/50" />
              <button onClick={saveName} disabled={!nameInput.trim()} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-foreground transition-all active:scale-95 disabled:opacity-40">
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400">{userInitials}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Your initials: {userInitials}</p>
              <p className="text-[11px] text-muted-foreground/80">Claim a Juz below to begin</p>
            </div>
            <button onClick={() => { setUserInitials(''); setItem('khatam_user_initials', '') }} className="text-xs text-muted-foreground/80 underline">Change</button>
          </div>
        )}

        <div className="flex items-center justify-center gap-8">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{stats.pct}%</span>
              <span className="text-[10px] text-muted-foreground/80">Claimed</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.claimed}</p>
              <p className="text-xs text-muted-foreground/80">Juz claimed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
              <p className="text-xs text-muted-foreground/80">Juz completed</p>
            </div>
          </div>
        </div>

        {/* Sync status */}
        <div className="flex items-center justify-center gap-2">
          {synced === 'online' ? (
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400"><Cloud className="h-3 w-3" /> Synced with server</span>
          ) : synced === 'offline' ? (
            <span className="flex items-center gap-1.5 text-[10px] text-amber-400"><CloudOff className="h-3 w-3" /> Offline — using local data</span>
          ) : (
            <span className="text-[10px] text-muted-foreground/80 animate-pulse">Syncing...</span>
          )}
        </div>

        {/* Sign in prompt */}
        {!isSignedIn && synced !== 'loading' && (
          <Link href="/settings" className="block rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-center">
            <p className="text-xs font-medium text-blue-400">Sign in to sync your Khatam progress</p>
            <p className="text-[10px] text-muted-foreground/80 mt-0.5">Your progress is saved locally for now</p>
          </Link>
        )}

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
            const claim = claims[juz]
            const isMine = claim?.initials === userInitials
            const isCompleted = claim?.completed
            const isClaimed = !!claim

            return (
              <button
                key={juz}
                onClick={() => {
                  if (!userInitials) return
                  if (!isClaimed) claimJuz(juz)
                  else if (isMine && !isCompleted) completeJuz(juz)
                }}
                disabled={!userInitials || (isClaimed && !isMine) || isCompleted}
                className={`relative flex flex-col items-center justify-center rounded-xl py-3 text-center transition-all active:scale-95 ${
                  isCompleted
                    ? 'border border-emerald-500/30 bg-emerald-500/15'
                    : isMine
                    ? 'border border-teal-500/40 bg-teal-500/10'
                    : isClaimed
                    ? 'border border-border bg-secondary/60 opacity-60'
                    : 'border border-border bg-card'
                }`}
              >
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-2.5 w-2.5 text-foreground" />
                  </div>
                )}
                <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-400' : isMine ? 'text-teal-400' : isClaimed ? 'text-muted-foreground/80' : 'text-muted-foreground'}`}>
                  {juz}
                </span>
                <span className="mt-0.5 text-[8px] text-muted-foreground/60">Juz {juz}</span>
                {isClaimed && (
                  <span className={`mt-1 text-[9px] font-semibold ${isCompleted ? 'text-emerald-400' : isMine ? 'text-teal-400' : 'text-muted-foreground/80'}`}>
                    {claim.initials}
                  </span>
                )}
                {!isClaimed && userInitials && <span className="mt-1 text-[8px] text-muted-foreground/60">Claim</span>}
                {isMine && !isCompleted && <span className="mt-0.5 text-[7px] text-teal-500">Complete</span>}
              </button>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
