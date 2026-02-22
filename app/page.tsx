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
  ChevronRight, Flame, BookMarked, Moon, UtensilsCrossed,
  Clock, HandHeart
} from 'lucide-react'
import { OnboardingWizard } from '@/components/onboarding-wizard'
import { AnnouncementsBanner } from '@/components/announcements-banner'
import {
  requestNotificationPermission,
  schedulePrayerNotification,
  scheduleIftaarNotification,
  scheduleSuhoorNotification,
  cancelAllNotifications,
} from '@/lib/notifications'
import { getRamadanStatus } from '@/lib/ramadan-mode'

interface PrayerTimeData { name: string; time: string; date: Date }

const QUICK_ACTIONS = [
  { icon: BookOpen, label: 'Quran', href: '/quran', color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400' },
  { icon: Brain, label: 'Hifz', href: '/quran/hifz', color: 'from-indigo-500/20 to-indigo-600/10', iconColor: 'text-indigo-400' },
  { icon: Circle, label: 'Tasbih', href: '/explore/tasbih', color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
  { icon: Star, label: 'Adhkar', href: '/explore/adhkar', color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
  { icon: Compass, label: 'Qibla', href: '/explore/qibla', color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400' },
  { icon: Calculator, label: 'Zakat', href: '/explore/zakat', color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400' },
]

const CHECKLIST_ITEMS = [
  { key: 'fajr_prayed', label: 'Fajr Prayed', icon: '🌅' },
  { key: 'quran_read', label: 'Quran Read', icon: '📖' },
  { key: 'dua_made', label: 'Dua Made', icon: '🤲' },
  { key: 'charity', label: 'Charity Given', icon: '💝' },
  { key: 'dhikr', label: 'Dhikr Done', icon: '📿' },
  { key: 'sunnah', label: 'Sunnah Prayers', icon: '🕌' },
]

const DAILY_VERSES = [
  { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease.', reference: 'Ash-Sharh 94:6', surah: 94 },
  { arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', translation: 'And whoever relies upon Allah - then He is sufficient for him.', reference: 'At-Talaq 65:3', surah: 65 },
  { arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ', translation: 'So remember Me; I will remember you.', reference: 'Al-Baqarah 2:152', surah: 2 },
  { arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', translation: 'And your Lord is going to give you, and you will be satisfied.', reference: 'Ad-Duha 93:5', surah: 93 },
  { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي', translation: 'My Lord, expand for me my breast [with assurance].', reference: 'Ta-Ha 20:25', surah: 20 },
  { arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', translation: 'Indeed, Allah is with the patient.', reference: 'Al-Baqarah 2:153', surah: 2 },
  { arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', translation: 'Allah does not burden a soul beyond that it can bear.', reference: 'Al-Baqarah 2:286', surah: 2 },
  { arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', translation: 'And say, "My Lord, increase me in knowledge."', reference: 'Ta-Ha 20:114', surah: 20 },
  { arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', translation: 'Verily, in the remembrance of Allah do hearts find rest.', reference: 'Ar-Ra\'d 13:28', surah: 13 },
  { arabic: 'ادْعُونِي أَسْتَجِبْ لَكُمْ', translation: 'Call upon Me; I will respond to you.', reference: 'Ghafir 40:60', surah: 40 },
  { arabic: 'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ', translation: 'And my success is only by Allah.', reference: 'Hud 11:88', surah: 11 },
  { arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', translation: 'And do not despair of the mercy of Allah.', reference: 'Yusuf 12:87', surah: 12 },
  { arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', translation: 'So which of the favors of your Lord would you deny?', reference: 'Ar-Rahman 55:13', surah: 55 },
  { arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: 'Say: He is Allah, the One.', reference: 'Al-Ikhlas 112:1', surah: 112 },
  { arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', translation: 'And He is with you wherever you are.', reference: 'Al-Hadid 57:4', surah: 57 },
  { arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', translation: 'Read in the name of your Lord who created.', reference: 'Al-Alaq 96:1', surah: 96 },
  { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', translation: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good.', reference: 'Al-Baqarah 2:201', surah: 2 },
  { arabic: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ', translation: 'And We have not sent you except as a mercy to the worlds.', reference: 'Al-Anbya 21:107', surah: 21 },
]

function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 3 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 16) return 'Good Afternoon'
  if (hour >= 16 && hour < 20) return 'Good Evening'
  return 'Good Night'
}

function getIslamicGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 3 && hour < 12) return 'Sabah al-Khayr'
  if (hour >= 12 && hour < 16) return 'As-Salamu Alaykum'
  if (hour >= 16 && hour < 20) return 'Masa al-Khayr'
  return 'Layla Sa\'ida'
}

function getDailyVerse() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / 86400000)
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length]
}

// Ramadan detection removed — now using getRamadanStatus() from lib/ramadan-mode

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
  const [iftaarCountdown, setIftaarCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  const dailyVerse = getDailyVerse()
  const ramadanStatus = getRamadanStatus()
  const ramadan = ramadanStatus.isRamadan

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
    } catch { /* noop */ }
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
      const prayerMap: Record<string, Date> = { Fajr: pt.fajr, Dhuhr: pt.dhuhr, Asr: pt.asr, Maghrib: pt.maghrib, Isha: pt.isha }
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
        const d = new Date(now); d.setHours(hours[i], i === 0 ? 15 : 0, 0, 0)
        return { name, time: formatTime(d), date: d }
      })
      setPrayers(fallback)
      setNextPrayerName(fallback.find(p => p.date > now)?.name || fallback[0].name)
    }
  }, [scheduleNotifications])

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
    setHijriDate(getHijriDate())
    setChecklist(getItem(KEYS.CHECKLIST, {}))
    setStreak(getItem(KEYS.STREAK, 0))
    setPoints(getItem(KEYS.POINTS, 0))
    setUsername(getItem(KEYS.USERNAME, ''))
    setLastRead(getItem(KEYS.LAST_READ, null))

    const onboardingDone = getItem(KEYS.ONBOARDING_COMPLETE, false)
    if (onboardingDone) {
      setShowOnboarding(false)
    } else {
      // Check if user is already signed in (returning user with empty localStorage)
      fetch('/api/user/profile')
        .then((res) => (res.ok ? res.json() : null))
        .then((profile) => {
          if (profile?.name || profile?.email) {
            setItem(KEYS.ONBOARDING_COMPLETE, true)
            setShowOnboarding(false)
          } else {
            setShowOnboarding(true)
          }
        })
        .catch(() => {
          setShowOnboarding(true)
        })
    }

    loadPrayerTimes()
    setMounted(true)

    // Hydrate checklist from server (API is source of truth when available)
    fetch('/api/tracking')
      .then((res) => (res.ok ? res.json() : null))
      .then((rows) => {
        if (!Array.isArray(rows) || rows.length === 0) return
        const today = new Date().toISOString().split('T')[0]
        const todayRow = rows.find((r: any) => r.date === today)
        if (!todayRow) return
        const serverChecklist: Record<string, boolean> = {}
        for (const item of CHECKLIST_ITEMS) {
          if (todayRow[item.key] === true) serverChecklist[item.key] = true
        }
        // Merge: server wins where it's true
        const local = getItem(KEYS.CHECKLIST, {}) as Record<string, boolean>
        const merged = { ...local, ...serverChecklist }
        setChecklist(merged)
        setItem(KEYS.CHECKLIST, merged)
      })
      .catch(() => {})
  }, [loadPrayerTimes])

  // Countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const next = prayers.find((p) => p.date > now)
      if (next) {
        setCountdown(getTimeUntil(next.date))
        setNextPrayerName(next.name)
      }
      // Iftaar countdown (time until Maghrib)
      const maghrib = prayers.find((p) => p.name === 'Maghrib')
      if (maghrib && maghrib.date > now) {
        setIftaarCountdown(getTimeUntil(maghrib.date))
      } else {
        setIftaarCountdown(null)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [prayers])

  const toggleCheck = (key: string) => {
    const newVal = !checklist[key]
    const updated = { ...checklist, [key]: newVal }
    setChecklist(updated)
    setItem(KEYS.CHECKLIST, updated)
    if (newVal) {
      const newPoints = points + 10
      setPoints(newPoints)
      setItem(KEYS.POINTS, newPoints)
    }
    // Fire-and-forget sync to API
    fetch('/api/tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        [key]: newVal,
      }),
    }).catch(() => {})
  }

  const completedCount = Object.values(checklist).filter(Boolean).length

  // Circular countdown progress
  const nextPrayer = prayers.find((p) => p.date > new Date())
  const prevPrayerIdx = prayers.findIndex((p) => p === nextPrayer) - 1
  const prevPrayerDate = prevPrayerIdx >= 0 ? prayers[prevPrayerIdx].date : (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })()
  const totalDuration = nextPrayer ? nextPrayer.date.getTime() - prevPrayerDate.getTime() : 1
  const remaining = nextPrayer ? nextPrayer.date.getTime() - Date.now() : 0
  const countdownProgress = totalDuration > 0 ? Math.max(0, Math.min(100, ((totalDuration - remaining) / totalDuration) * 100)) : 0

  if (showOnboarding) {
    return (
      <OnboardingWizard onComplete={() => {
        setShowOnboarding(false)
        setUsername(getItem(KEYS.USERNAME, ''))
        loadPrayerTimes()
      }} />
    )
  }

  return (
    <div className={`min-h-screen bg-[#0a0b14] pb-24 ${mounted ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.3s ease' }}>
      {/* ========== HERO ========== */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 ${ramadan ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-900' : 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900'}`} />
        {/* Decorative blurred orbs */}
        <div className={`absolute -top-20 -right-20 h-60 w-60 rounded-full blur-3xl ${ramadan ? 'bg-purple-500/15' : 'bg-emerald-500/15'}`} />
        <div className={`absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl ${ramadan ? 'bg-indigo-500/20' : 'bg-teal-500/20'}`} />
        {/* Pattern overlay */}
        <div className="islamic-pattern absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0b14]" />

        {/* Crescent moon for Ramadan */}
        {ramadan && (
          <div className="absolute top-8 right-8 animate-float">
            <Moon className="h-8 w-8 text-amber-300/40" />
          </div>
        )}

        <div className="relative px-5 pb-8" style={{ paddingTop: 'max(3rem, calc(env(safe-area-inset-top) + 0.75rem))' }}>
          {/* Top Bar */}
          <div className="mb-6 flex items-center justify-between animate-fade-down" style={{ animationDelay: '0.05s', animationFillMode: 'backwards' }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image src="/images/logo.jpg" alt="MasjidConnect GY" width={44} height={44} className="rounded-2xl ring-2 ring-white/10" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a0b14] bg-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wide text-white/50">{getIslamicGreeting()}</p>
                <h1 className="text-lg font-bold text-white">{username || 'MasjidConnect GY'}</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/profile" className="glass flex h-10 w-10 items-center justify-center rounded-2xl text-white/80 transition-transform active:scale-90" aria-label="Profile">
                <User className="h-5 w-5" />
              </Link>
              <Link href="/settings" className="glass flex h-10 w-10 items-center justify-center rounded-2xl text-white/80 transition-transform active:scale-90" aria-label="Settings">
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Date pills */}
          <div className="mb-6 flex items-center gap-2 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${ramadan ? 'glass-amber text-amber-300' : 'glass-emerald text-emerald-300'}`}>
              {hijriDate || 'Loading...'}
            </span>
            <span className="glass rounded-full px-3 py-1.5 text-[11px] font-medium text-white/50">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Next Prayer Countdown */}
          <div className="glass-emerald rounded-3xl p-5 animate-scale-in" style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}>
            <div className="flex items-center gap-5">
              {/* Progress ring */}
              <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="2.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray={`${countdownProgress}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <Timer className="h-4 w-4 text-emerald-400 animate-glow-pulse" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/70">Next Prayer</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">{nextPrayerName}</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-0.5">
                  <span className="text-4xl font-extrabold tabular-nums text-white tracking-tight">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="text-base font-medium text-emerald-400/50 mx-0.5">:</span>
                  <span className="text-4xl font-extrabold tabular-nums text-white tracking-tight">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="text-base font-medium text-emerald-400/50 mx-0.5">:</span>
                  <span className="text-4xl font-extrabold tabular-nums text-white tracking-tight">{String(countdown.seconds).padStart(2, '0')}</span>
                </div>
                {nextPrayer && <p className="mt-1 text-[11px] text-white/30">{nextPrayer.time} &middot; {getTimeGreeting()}</p>}
              </div>
            </div>
          </div>

          {/* Iftaar Countdown -- shown during Ramadan or always if before Maghrib */}
          {iftaarCountdown && (
            <Link href="/ramadan" className="mt-3 flex items-center gap-4 rounded-2xl p-4 glass-amber animate-fade-up card-premium" style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15">
                <UtensilsCrossed className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400/70">
                    {ramadan ? 'Iftaar in' : 'Maghrib in'}
                  </span>
                  {ramadan && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">Ramadan</span>}
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-2xl font-extrabold tabular-nums text-white">{String(iftaarCountdown.hours).padStart(2, '0')}</span>
                  <span className="text-sm text-amber-400/50">h</span>
                  <span className="text-2xl font-extrabold tabular-nums text-white">{String(iftaarCountdown.minutes).padStart(2, '0')}</span>
                  <span className="text-sm text-amber-400/50">m</span>
                  <span className="text-2xl font-extrabold tabular-nums text-white">{String(iftaarCountdown.seconds).padStart(2, '0')}</span>
                  <span className="text-sm text-amber-400/50">s</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-amber-400/30 shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {/* ========== PRAYER STRIP ========== */}
      <div className="-mt-2 pt-2">
        <PrayerStrip prayers={prayers} />
      </div>

      {/* ========== STATS BAR ========== */}
      <div className="flex gap-3 px-4 pt-5 animate-stagger">
        <div className="glass flex flex-1 items-center gap-3 rounded-2xl px-4 py-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
            <Flame className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-extrabold tabular-nums text-white">{streak}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Day Streak</p>
          </div>
        </div>
        <div className="glass flex flex-1 items-center gap-3 rounded-2xl px-4 py-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xl font-extrabold tabular-nums text-white">{points}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Points</p>
          </div>
        </div>
      </div>

      {/* ========== ANNOUNCEMENTS ========== */}
      <div className="px-4 pt-4">
        <AnnouncementsBanner />
      </div>

      {/* ========== VERSE OF THE DAY ========== */}
      <div className="px-4 pt-5 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
        <div className="relative overflow-hidden rounded-3xl glass-amber p-5">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl" />
          <div className="mb-3 flex items-center gap-2">
            <BookMarked className="h-4 w-4 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80">Verse of the Day</span>
          </div>
          <p className="mb-3 text-right font-arabic text-xl leading-[2.2] text-white/90" dir="rtl">{dailyVerse.arabic}</p>
          <p className="text-sm leading-relaxed text-gray-300/90">{dailyVerse.translation}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] font-medium text-amber-400/50">{dailyVerse.reference}</p>
            <Link href={`/quran/${dailyVerse.surah}`} className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-400 transition-all active:scale-95">
              Read Surah <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========== CONTINUE READING ========== */}
      {lastRead && (
        <div className="px-4 pt-5">
          <Link href={`/quran/${lastRead.surah}`} className="glass flex items-center gap-4 rounded-2xl p-4 card-premium">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
              <BookOpen className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-400/60">Continue Reading</p>
              <p className="text-sm font-bold text-white">{lastRead.name}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-purple-400/30 shrink-0" />
          </Link>
        </div>
      )}

      {/* ========== RAMADAN MODE ========== */}
      {ramadan && (
        <div className="px-4 pt-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-5">
            <div className="absolute -right-4 -top-4 animate-crescent opacity-20">
              <Moon className="h-20 w-20 text-amber-300" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">Ramadan Mubarak</span>
                {ramadanStatus.ramadanDay && (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70">
                    Day {ramadanStatus.ramadanDay}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-lg font-bold text-white">Ramadan Mode</h3>
              <p className="mt-1 text-xs text-white/50">Quick access to your Ramadan essentials</p>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {[
                  { href: '/', icon: Clock, label: 'Prayer' },
                  { href: '/iftaar', icon: UtensilsCrossed, label: 'Iftaar' },
                  { href: '/tracker/fasting', icon: Moon, label: 'Fasting' },
                  { href: '/explore/duas', icon: HandHeart, label: 'Duas' },
                  { href: '/ramadan', icon: Star, label: 'Hub' },
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/5 py-2.5 active:bg-white/10">
                    <item.icon className="h-4 w-4 text-amber-300" />
                    <span className="text-[9px] font-medium text-white/70">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== QUICK ACTIONS ========== */}
      <div className="px-4 pt-6">
        <div className="section-label mb-3">
          <div className="h-4 w-1 rounded-full bg-emerald-500" />
          Quick Actions
        </div>
        <div className="grid grid-cols-3 gap-3 animate-stagger">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.label} href={action.href} className="glass flex flex-col items-center gap-2.5 rounded-2xl px-3 py-4 card-premium">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color}`}>
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <span className="text-xs font-semibold text-gray-300">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ========== DAILY CHECKLIST ========== */}
      <div className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="section-label">
            <div className="h-4 w-1 rounded-full bg-amber-500" />
            Daily Checklist
          </div>
          <span className="text-xs font-bold tabular-nums text-emerald-400">{completedCount}/{CHECKLIST_ITEMS.length}</span>
        </div>

        {/* Progress bar */}
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-800/50">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out" style={{ width: `${(completedCount / CHECKLIST_ITEMS.length) * 100}%` }} />
        </div>

        <div className="space-y-2 animate-stagger">
          {CHECKLIST_ITEMS.map((item) => (
            <button key={item.key} onClick={() => toggleCheck(item.key)}
              className={`glass flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 active:scale-[0.98] ${
                checklist[item.key] ? 'border-emerald-500/20 bg-emerald-500/8' : ''
              }`}>
              <CheckCircle2 className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                checklist[item.key] ? 'fill-emerald-500 text-emerald-500 scale-110' : 'text-gray-600'
              }`} />
              <span className={`text-sm font-medium transition-colors ${checklist[item.key] ? 'text-emerald-400 line-through decoration-emerald-500/30' : 'text-white'}`}>
                {item.label}
              </span>
              {checklist[item.key] && (
                <span className="ml-auto rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">+10</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-6" />
      <BottomNav />
    </div>
  )
}
