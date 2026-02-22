'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  User, Flame, Star, BookOpen, CheckSquare, Trophy,
  Target, TrendingUp, Edit3, Save
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

export default function ProfilePage() {
  const [username, setUsername] = useState('')
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [prayerLog, setPrayerLog] = useState<PrayerLog>({})
  const [bookmarks, setBookmarks] = useState<{ surah: number; ayah: number }[]>([])

  useEffect(() => {
    const name = getItem(KEYS.USERNAME, '')
    setUsername(name)
    setEditName(name)
    setPoints(getItem(KEYS.POINTS, 0))
    setStreak(getItem(KEYS.STREAK, 0))
    setPrayerLog(getItem(KEYS.PRAYER_LOG, {}))
    setBookmarks(getItem(KEYS.BOOKMARKS, []))
  }, [])

  const saveName = () => {
    setUsername(editName.trim())
    setItem(KEYS.USERNAME, editName.trim())
    setEditing(false)
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
    if (totalPrayers >= 50) return { label: 'Silver', color: 'text-gray-300', bg: 'bg-gray-500/15' }
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
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={User}
        title="Profile"
        subtitle="Your Journey"
        gradient="from-emerald-900 to-teal-900"
        showBack
      />

      <div className="space-y-5 px-4 pt-5">
        {/* Profile card */}
        <div className="flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900 p-6">
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
                className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-center text-sm text-foreground outline-none focus:border-emerald-500/50"
                autoFocus
              />
              <button
                onClick={saveName}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white"
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
              <Edit3 className="h-3.5 w-3.5 text-gray-500" />
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
              <span className="text-xs text-gray-400">Level {level}</span>
              <span className="text-xs text-emerald-400">{points} pts</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-gray-500">
              {100 - levelProgress} points to Level {level + 1}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <SettingGroup label="Your Stats" accentColor="bg-amber-500">
          <div className="grid grid-cols-2 gap-px bg-gray-800">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-900 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </SettingGroup>

        {/* Activity Summary */}
        <SettingGroup label="Activity" accentColor="bg-teal-500">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-300">Days Tracked</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{daysTracked}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-300">Avg Prayers/Day</span>
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
