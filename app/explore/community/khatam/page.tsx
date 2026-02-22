'use client'

import { useState, useEffect, useMemo } from 'react'
import { BookOpen, Check, User } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'

interface JuzClaim {
  initials: string
  completed: boolean
}

type KhatamClaims = Record<number, JuzClaim>

export default function KhatamPage() {
  const [claims, setClaims] = useState<KhatamClaims>({})
  const [userInitials, setUserInitials] = useState('')
  const [nameInput, setNameInput] = useState('')

  useEffect(() => {
    setClaims(getItem<KhatamClaims>('khatam_claims', {}))
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
  }

  const completeJuz = (juz: number) => {
    const claim = claims[juz]
    if (!claim || claim.initials !== userInitials) return
    const updated = { ...claims, [juz]: { ...claim, completed: true } }
    setClaims(updated)
    setItem('khatam_claims', updated)
  }

  const stats = useMemo(() => {
    const entries = Object.values(claims)
    const claimed = entries.length
    const completed = entries.filter((c) => c.completed).length
    const pct = Math.round((claimed / 30) * 100)
    return { claimed, completed, pct }
  }, [claims])

  // Progress ring SVG
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (stats.pct / 100) * circumference

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero
        icon={BookOpen}
        title="Khatam Collective"
        subtitle="Complete the Quran Together"
        gradient="from-emerald-900 to-teal-900"
        showBack
      />

      <div className="px-4 pt-5 -mt-2 space-y-5">
        {/* Name Input */}
        {!userInitials ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-3">
            <p className="text-sm font-semibold text-white">Enter your name to get started</p>
            <p className="text-xs text-gray-400">Your initials will appear on the Juz you claim.</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Your name or initials"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="flex-1 rounded-xl border border-gray-800 bg-[#0a0b14] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500/50"
              />
              <button
                onClick={saveName}
                disabled={!nameInput.trim()}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400">
              {userInitials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Your initials: {userInitials}</p>
              <p className="text-[11px] text-gray-500">Claim a Juz below to begin</p>
            </div>
            <button
              onClick={() => {
                setUserInitials('')
                setItem('khatam_user_initials', '')
              }}
              className="text-xs text-gray-500 underline"
            >
              Change
            </button>
          </div>
        )}

        {/* Progress Ring + Stats */}
        <div className="flex items-center justify-center gap-8">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#1f2937"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{stats.pct}%</span>
              <span className="text-[10px] text-gray-500">Claimed</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-white">{stats.claimed}</p>
              <p className="text-xs text-gray-500">Juz claimed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
              <p className="text-xs text-gray-500">Juz completed</p>
            </div>
          </div>
        </div>

        {/* 30 Juz Grid */}
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
                    ? 'border border-gray-700 bg-gray-800/60 opacity-60'
                    : 'border border-gray-800 bg-gray-900'
                } ${!userInitials || (isClaimed && !isMine) || isCompleted ? '' : 'active:scale-95'}`}
              >
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
                <span className={`text-xs font-bold ${
                  isCompleted ? 'text-emerald-400' : isMine ? 'text-teal-400' : isClaimed ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  {juz}
                </span>
                <span className="mt-0.5 text-[8px] text-gray-600">Juz {juz}</span>
                {isClaimed && (
                  <span className={`mt-1 text-[9px] font-semibold ${
                    isCompleted ? 'text-emerald-400' : isMine ? 'text-teal-400' : 'text-gray-500'
                  }`}>
                    {claim.initials}
                  </span>
                )}
                {!isClaimed && userInitials && (
                  <span className="mt-1 text-[8px] text-gray-600">Claim</span>
                )}
                {isMine && !isCompleted && (
                  <span className="mt-0.5 text-[7px] text-teal-500">Complete</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
