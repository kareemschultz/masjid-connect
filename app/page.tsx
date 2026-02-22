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
  Settings, User, CheckCircle2, Timer, Sparkles, Brain,
  ChevronRight, Flame, BookMarked
} from 'lucide-react'
import { OnboardingWizard } from '@/components/onboarding-wizard'
import {
  requestNotificationPermission,
  schedulePrayerNotification,
  scheduleIftaarNotification,
  scheduleSuhoorNotification,
  cancelAllNotifications,
} from '@/lib/notifications'

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

// Daily verses -- cycles based on day-of-year
const DAILY_VERSES = [
  { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease.', reference: 'Surah Ash-Sharh 94:6' },
  { arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', translation: 'And whoever relies upon Allah - then He is sufficient for him.', reference: 'Surah At-Talaq 65:3' },
  { arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ', translation: 'So remember Me; I will remember you.', reference: 'Surah Al-Baqarah 2:152' },
  { arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', translation: 'And your Lord is going to give you, and you will be satisfied.', reference: 'Surah Ad-Duha 93:5' },
  { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي', translation: 'My Lord, expand for me my breast [with assurance].', reference: 'Surah Ta-Ha 20:25' },
  { arabic: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ', translation: 'And be patient, for indeed, Allah does not allow to be lost the reward of those who do good.', reference: 'Surah Hud 11:115' },
  { arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', translation: 'Indeed, Allah is with the patient.', reference: 'Surah Al-Baqarah 2:153' },
]

function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 3 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 16) return 'Good Afternoon'
  if (hour >= 16 && hour < 20) return 'Good Evening'
  return 'Good Night'
}

function getDailyVerse() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / 86400000)
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length]
}

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
  const [lastRead, setLastRead] = useState<{ surah: number; name: string } | null>(null)

  const dailyVerse = getDailyVerse()

  const scheduleNotifications = useCallback(async (prayerData: PrayerTimeData[]) => {
    try {
      const notificationsEnabled = getItem(KEYS.NOTIFICATIONS_ENABLED, false)
      if (!notificationsEnabled) return
      const granted = await requestNotificationPermission()
      if (!granted) return
      cancelAllNotifications()
      prayerData.forEach((prayer) => {
        schedulePrayerNotification({ prayerName: prayer.name, prayerTime: prayer.date })
      })
      const maghrib = prayerData.find((p) => p.name === 'Maghrib')
      if (maghrib) scheduleIftaarNotification(maghrib.date)
      const fajr = prayerData.find((p) => p.name === 'Fajr')
      if (fajr) scheduleSuhoorNotification(fajr.date)
    } catch {
      // Notifications not supported
    }
  }, [])

  const loadPrayerTimes = useCallback(async () => {
    try {
      const adhan = await import('adhan')
      const methodKey = getItem(KEYS.CALCULATION_METHOD, 'Egyptian')
      const madhabKey = getItem(KEYS.MADHAB, 'Shafi')
      const coords = new adhan.Coordinates(6.8013, -58.1551)

      const methodMap: Record<string, () => ReturnType<typeof adhan.CalculationMethod.Egyptian>> = {
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
        Fajr: pt.fajr, Dhuhr: pt.dhuhr, Asr: pt.asr, Maghrib: pt.maghrib, Isha: pt.isha,
      }

      const prayerData: PrayerTimeData[] = PRAYER_NAMES.map((name) => ({
        name, time: formatTime(prayerMap[name]), date: prayerMap[name],
      }))
      setPrayers(prayerData)
      scheduleNotifications(prayerData)

      const now = new Date()
      const next = prayerData.find((p) => p.date > now) || prayerData[0]
      setNextPrayerName(next.name)
    } catch {
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
  }, [scheduleNotifications])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
    setHijriDate(getHijriDate())
    setChecklist(getItem(KEYS.CHECKLIST, {}))
    setStreak(getItem(KEYS.STREAK, 0))
    setPoints(getItem(KEYS.POINTS, 0))
    setUsername(getItem(KEYS.USERNAME, ''))
    setLastRead(getItem(KEYS.LAST_READ, null))
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

  // Circular countdown progress
  const nextPrayer = prayers.find((p) => p.date > new Date())
  const prevPrayerIdx = prayers.findIndex((p) => p === nextPrayer) - 1
  const prevPrayerDate = prevPrayerIdx >= 0 ? prayers[prevPrayerIdx].date : (() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d
  })()
  const totalDuration = nextPrayer ? nextPrayer.date.getTime() - prevPrayerDate.getTime() : 1
  const remaining = nextPrayer ? nextPrayer.date.getTime() - Date.now() : 0
  const countdownProgress = totalDuration > 0 ? Math.max(0, Math.min(100, ((totalDuration - remaining) / totalDuration) * 100)) : 0

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

        <div className="relative px-5 pt-12 pb-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.jpg"
                alt="MasjidConnect GY"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <div>
                <p className="text-[11px] font-medium text-emerald-300/70">{getTimeGreeting()}</p>
                <h1 className="text-lg font-bold text-white">
                  {username ? username : 'MasjidConnect GY'}
                </h1>
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

          {/* Hijri date pill */}
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300/80">
              {hijriDate || 'Loading...'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/60">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Circular Countdown Card */}
          <div className="flex items-center gap-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 backdrop-blur-md">
            {/* Circular progress ring */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(16,185,129,0.15)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={`${countdownProgress}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <Timer className="absolute h-5 w-5 text-emerald-400" />
            </div>

            <div className="flex-1">
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                Next: {nextPrayerName}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold tabular-nums text-white">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <span className="text-sm text-emerald-400/70">h</span>
                <span className="text-3xl font-bold tabular-nums text-white">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <span className="text-sm text-emerald-400/70">m</span>
                <span className="text-3xl font-bold tabular-nums text-white">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
                <span className="text-sm text-emerald-400/70">s</span>
              </div>
              {nextPrayer && (
                <p className="mt-1 text-[11px] text-emerald-300/50">
                  {nextPrayer.time}
                </p>
              )}
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
            <Flame className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{streak}</p>
            <p className="text-[11px] text-gray-400">Day Streak</p>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{points}</p>
            <p className="text-[11px] text-gray-400">Points</p>
          </div>
        </div>
      </div>

      {/* Daily Verse */}
      <div className="px-4 pt-5">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/5 to-amber-900/10 p-5">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-500/5 blur-2xl" />
          <div className="mb-3 flex items-center gap-2">
            <BookMarked className="h-4 w-4 text-amber-400" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400/80">
              Verse of the Day
            </span>
          </div>
          <p className="mb-2 text-right font-arabic text-xl leading-[2] text-white/90" dir="rtl">
            {dailyVerse.arabic}
          </p>
          <p className="text-sm leading-relaxed text-gray-300">
            {dailyVerse.translation}
          </p>
          <p className="mt-2 text-[11px] text-amber-400/60">{dailyVerse.reference}</p>
        </div>
      </div>

      {/* Continue Reading */}
      {lastRead && (
        <div className="px-4 pt-5">
          <Link
            href={`/quran/${lastRead.surah}`}
            className="flex items-center gap-4 rounded-2xl border border-purple-500/15 bg-purple-500/5 p-4 transition-all active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20">
              <BookOpen className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-purple-300/70">Continue Reading</p>
              <p className="text-sm font-semibold text-white">{lastRead.name}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-purple-400/50" />
          </Link>
        </div>
      )}

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
              {checklist[item.key] && (
                <span className="ml-auto text-[10px] font-medium text-emerald-500/60">+10 pts</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Spacer at bottom */}
      <div className="h-4" />

      <BottomNav />
    </div>
  )
}
