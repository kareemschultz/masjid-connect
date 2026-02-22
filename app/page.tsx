'use client'

import { useEffect, useState, useCallback } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { PrayerStrip } from '@/components/prayer-strip'
import { getHijriDate, formatTime, getTimeUntil, PRAYER_NAMES } from '@/lib/prayer-times'
import { getItem, setItem, KEYS } from '@/lib/storage'
import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpen, Circle, Compass, Calculator, Star,
  Settings, User, CheckCircle2, Timer, Sparkles, Brain
} from 'lucide-react'
import { OnboardingWizard } from '@/components/onboarding-wizard'

interface PrayerTimeData {
  name: string
  time: string
  date: Date
}

const QUICK_ACTIONS = [
  { icon: BookOpen, label: 'Quran', href: '/quran', color: 'bg-purple-500/20', iconColor: 'text-purple-400' },
  { icon: Brain, label: 'Hifz', href: '/quran/hifz', color: 'bg-indigo-500/20', iconColor: 'text-indigo-400' },
  { icon: Circle, label: 'Tasbih', href: '/explore/tasbih', color: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
  { icon: Star, label: 'Adhkar', href: '/explore/adhkar', color: 'bg-amber-500/20', iconColor: 'text-amber-400' },
  { icon: Compass, label: 'Qibla', href: '/explore/qibla', color: 'bg-blue-500/20', iconColor: 'text-blue-400' },
  { icon: Calculator, label: 'Zakat', href: '/explore/zakat', color: 'bg-teal-500/20', iconColor: 'text-teal-400' },
]

const CHECKLIST_ITEMS = [
  { key: 'fajr_prayed', label: 'Fajr Prayed' },
  { key: 'quran_read', label: 'Quran Read' },
  { key: 'dua_made', label: 'Dua Made' },
  { key: 'charity', label: 'Charity Given' },
  { key: 'dhikr', label: 'Dhikr Done' },
  { key: 'sunnah', label: 'Sunnah Prayers' },
]

export default function HomePage() {
  const [prayers, setPrayers] = useState<PrayerTimeData[]>([])
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [nextPrayerName, setNextPrayerName] = useState('')
  const [hijriDate, setHijriDate] = useState('')
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [streak, setStreak] = useState(0)
  const [points, setPoints] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [username, setUsername] = useState('')

  const loadPrayerTimes = useCallback(async () => {
    try {
      const adhan = await import('adhan')
      const methodKey = getItem(KEYS.CALCULATION_METHOD, 'Egyptian')
      const madhabKey = getItem(KEYS.MADHAB, 'Shafi')
      const coords = new adhan.Coordinates(6.8013, -58.1551)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const methodMap: Record<string, () => any> = {
        MuslimWorldLeague: () => adhan.CalculationMethod.MuslimWorldLeague(),
        Egyptian: () => adhan.CalculationMethod.Egyptian(),
        Karachi: () => adhan.CalculationMethod.Karachi(),
        NorthAmerica: () => adhan.CalculationMethod.NorthAmerica(),
        MoonsightingCommittee: () => adhan.CalculationMethod.MoonsightingCommittee(),
        UmmAlQura: () => adhan.CalculationMethod.UmmAlQura(),
        Dubai: () => adhan.CalculationMethod.Dubai(),
        Qatar: () => adhan.CalculationMethod.Qatar(),
        Kuwait: () => adhan.CalculationMethod.Kuwait(),
        Singapore: () => adhan.CalculationMethod.Singapore(),
        Tehran: () => adhan.CalculationMethod.Tehran(),
        Turkey: () => adhan.CalculationMethod.Turkey(),
      }

      const params = (methodMap[methodKey] || methodMap.Egyptian)()
      params.madhab = madhabKey === 'Hanafi' ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi
      const pt = new adhan.PrayerTimes(coords, new Date(), params)

      const prayerMap: Record<string, Date> = {
        Fajr: pt.fajr,
        Dhuhr: pt.dhuhr,
        Asr: pt.asr,
        Maghrib: pt.maghrib,
        Isha: pt.isha,
      }

      const prayerData: PrayerTimeData[] = PRAYER_NAMES.map((name) => ({
        name,
        time: formatTime(prayerMap[name]),
        date: prayerMap[name],
      }))
      setPrayers(prayerData)

      const now = new Date()
      const next = prayerData.find((p) => p.date > now) || prayerData[0]
      setNextPrayerName(next.name)
    } catch (err) {
      console.log('[v0] Prayer times error:', err)
      const now = new Date()
      const hours = [5, 12, 15, 18, 19]
      const fallback = PRAYER_NAMES.map((name, i) => {
        const d = new Date(now)
        d.setHours(hours[i], i === 0 ? 15 : 0, 0, 0)
        return { name, time: formatTime(d), date: d }
      })
      setPrayers(fallback)
      setNextPrayerName(fallback.find(p => p.date > now)?.name || fallback[0].name)
    }
  }, [])

  useEffect(() => {
    setHijriDate(getHijriDate())
    setChecklist(getItem(KEYS.CHECKLIST, {}))
    setStreak(getItem(KEYS.STREAK, 0))
    setPoints(getItem(KEYS.POINTS, 0))
    setUsername(getItem(KEYS.USERNAME, ''))
    const onboardingDone = getItem(KEYS.ONBOARDING_COMPLETE, false)
    if (!onboardingDone) setShowOnboarding(true)
    loadPrayerTimes()
  }, [loadPrayerTimes])

  useEffect(() => {
    const timer = setInterval(() => {
      const next = prayers.find((p) => p.date > new Date())
      if (next) {
        setCountdown(getTimeUntil(next.date))
        setNextPrayerName(next.name)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [prayers])

  const toggleCheck = (key: string) => {
    const updated = { ...checklist, [key]: !checklist[key] }
    setChecklist(updated)
    setItem(KEYS.CHECKLIST, updated)
    if (!checklist[key]) {
      const newPoints = points + 10
      setPoints(newPoints)
      setItem(KEYS.POINTS, newPoints)
    }
  }

  const completedCount = Object.values(checklist).filter(Boolean).length

  if (showOnboarding) {
    return (
      <OnboardingWizard
        onComplete={() => {
          setShowOnboarding(false)
          setUsername(getItem(KEYS.USERNAME, ''))
          loadPrayerTimes()
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-900">
        <div className="islamic-pattern absolute inset-0 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b14] to-transparent" />

        <div className="relative px-5 pt-12 pb-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="MasjidConnect GY"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <div>
                <h1 className="text-lg font-bold text-white">
                  {username ? `Salaam, ${username}` : 'MasjidConnect GY'}
                </h1>
                <p className="text-[11px] text-emerald-300/70">{hijriDate}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm"
                aria-label="Profile"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/settings"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Countdown Card */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 backdrop-blur-md">
            <div className="mb-1 flex items-center gap-2">
              <Timer className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                Next: {nextPrayerName}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tabular-nums text-white">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-lg text-emerald-400">h</span>
              <span className="text-4xl font-bold tabular-nums text-white">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-lg text-emerald-400">m</span>
              <span className="text-4xl font-bold tabular-nums text-white">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-lg text-emerald-400">s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Times Strip */}
      <div className="-mt-1 pt-4">
        <PrayerStrip prayers={prayers} />
      </div>

      {/* Streak & Points */}
      <div className="flex gap-3 px-4 pt-5">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{streak}</p>
            <p className="text-[11px] text-gray-400">Day Streak</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
            <Star className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{points}</p>
            <p className="text-[11px] text-gray-400">Points</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pt-6">
        <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          <div className="h-4 w-1 rounded-full bg-emerald-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 px-3 py-4 transition-all active:scale-95"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.color}`}>
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <span className="text-xs font-medium text-gray-300">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Daily Checklist */}
      <div className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <div className="h-4 w-1 rounded-full bg-amber-500" />
            Daily Checklist
          </h2>
          <span className="text-xs font-medium text-emerald-400">
            {completedCount}/{CHECKLIST_ITEMS.length}
          </span>
        </div>

        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${(completedCount / CHECKLIST_ITEMS.length) * 100}%` }}
          />
        </div>

        <div className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => toggleCheck(item.key)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition-all active:scale-[0.98] ${
                checklist[item.key]
                  ? 'border-emerald-500/20 bg-emerald-500/10'
                  : 'border-gray-800 bg-gray-900'
              }`}
            >
              <CheckCircle2
                className={`h-5 w-5 transition-colors ${
                  checklist[item.key] ? 'fill-emerald-500 text-emerald-500' : 'text-gray-600'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  checklist[item.key] ? 'text-emerald-400 line-through' : 'text-white'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
