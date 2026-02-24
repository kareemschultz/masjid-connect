'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { PrayerStrip } from '@/components/prayer-strip'
import { HeroAnimation } from '@/components/hero-animations'
import { getHijriDate, formatTime, getTimeUntil, PRAYER_NAMES } from '@/lib/prayer-times'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { detectLocation, reverseGeocode, getRecommendedMethod } from '@/lib/location'
import { applyOffset, DEFAULT_OFFSETS, type PrayerOffsets } from '@/lib/prayer-offsets'
import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpen, Circle, Compass, Calculator, Star,
  Settings, User, CheckCircle2, Timer, Sparkles, Brain,
  ChevronRight, Flame, BookMarked, Moon, UtensilsCrossed,
  Clock, HandHeart, MapPin, CheckSquare, Users, Users2, Scale,
  Headphones, Navigation, GraduationCap
} from 'lucide-react'
import { OnboardingWizard } from '@/components/onboarding-wizard'
import { AppTour } from '@/components/app-tour'
import { AnnouncementsBanner } from '@/components/announcements-banner'
import {
  requestNotificationPermission,
  schedulePrayerNotification,
  scheduleIftaarNotification,
  scheduleSuhoorNotification,
  cancelAllNotifications,
} from '@/lib/notifications'
import { getRamadanStatus } from '@/lib/ramadan-mode'
import { getTodayHadith } from '@/lib/hadith-data'
import { MASJIDS } from '@/lib/masjid-data'

interface PrayerTimeData { name: string; time: string; date: Date }

const QUICK_ACTIONS = [
  { icon: Compass, label: 'Explore', href: '/explore', color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
  { icon: BookOpen, label: 'Quran', href: '/quran', color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400' },
  { icon: CheckSquare, label: 'Tracker', href: '/tracker', color: 'from-orange-500/20 to-orange-600/10', iconColor: 'text-orange-400' },
  { icon: Users, label: 'Buddy', href: '/explore/buddy', color: 'from-cyan-500/20 to-cyan-600/10', iconColor: 'text-cyan-400' },
  { icon: MapPin, label: 'Masjids', href: '/masjids', color: 'from-rose-500/20 to-rose-600/10', iconColor: 'text-rose-400' },
  { icon: Scale, label: 'Fiqh Hub', href: '/explore/fiqh', color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
  { icon: HandHeart, label: 'Duas', href: '/explore/duas', color: 'from-pink-500/20 to-pink-600/10', iconColor: 'text-pink-400' },
  { icon: Headphones, label: 'Lectures', href: '/explore/lectures', color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400' },
  { icon: Users2, label: 'Community', href: '/explore/community', color: 'from-violet-500/20 to-violet-600/10', iconColor: 'text-violet-400' },
  { icon: GraduationCap, label: 'Madrasa', href: '/explore/madrasa', color: 'from-indigo-500/20 to-indigo-600/10', iconColor: 'text-indigo-400' },
  { icon: Circle, label: 'Tasbih', href: '/explore/tasbih', color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400' },
  { icon: Navigation, label: 'Qibla', href: '/explore/qibla', color: 'from-sky-500/20 to-sky-600/10', iconColor: 'text-sky-400' },
  { icon: Calculator, label: 'Zakat', href: '/explore/zakat', color: 'from-lime-500/20 to-lime-600/10', iconColor: 'text-lime-400' },
]

const CHECKLIST_ITEMS = [
  { key: 'fajr_prayed', label: 'Fajr Prayed', icon: '🌅' },
  { key: 'quran_read', label: 'Quran Read', icon: '📖' },
  { key: 'dua_made', label: 'Dua Made', icon: '🤲' },
  { key: 'charity', label: 'Charity Given', icon: '💝' },
  { key: 'dhikr', label: 'Dhikr Done', icon: '📿' },
  { key: 'sunnah', label: 'Sunnah Prayers', icon: '🕌' },
  { key: 'qaida_practiced', label: 'Qaida Practiced', icon: '📚' },
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
  const prayersRef = useRef<PrayerTimeData[]>([])
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [nextPrayerName, setNextPrayerName] = useState('')
  const [hijriDate, setHijriDate] = useState('')
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [streak, setStreak] = useState(0)
  const [points, setPoints] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [username, setUsername] = useState('')
  const [lastRead, setLastRead] = useState<{ surah: number; name: string } | null>(null)
  const [iftaarCountdown, setIftaarCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)
  const [suhoorCountdown, setSuhoorCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [homeMasjidName, setHomeMasjidName] = useState<string>('')
  const [locationDetected, setLocationDetected] = useState(false)
  const [locationFailed, setLocationFailed] = useState(false)
  const [buddies, setBuddies] = useState<any[]>([])

  const dailyVerse = getDailyVerse()
  const hadith = getTodayHadith()
  const ramadanStatus = getRamadanStatus()
  const ramadan = ramadanStatus.isRamadan

  const fetchBuddies = useCallback(async () => {
    try {
      const res = await fetch('/api/friends')
      if (res.ok) {
        const data = await res.json()
        setBuddies(data.filter((b: any) => b.status === 'accepted'))
      }
    } catch { /* skip */ }
  }, [])

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
      const lat = getItem(KEYS.USER_LAT, 6.8013)
      const lng = getItem(KEYS.USER_LNG, -58.1551)
      const coords = new adhan.Coordinates(lat, lng)
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
      const offsets: PrayerOffsets = getItem(KEYS.PRAYER_OFFSETS, DEFAULT_OFFSETS)
      const prayerData: PrayerTimeData[] = PRAYER_NAMES.map((name) => {
        const rawDate = prayerMap[name]
        const offsetMin = offsets[name as keyof PrayerOffsets] ?? 0
        const adjustedDate = applyOffset(rawDate, offsetMin)
        return { name, time: formatTime(adjustedDate), date: adjustedDate }
      })
      setPrayers(prayerData)
      prayersRef.current = prayerData
      scheduleNotifications(prayerData)
      // Immediate countdown update (don't wait 1 second)
      const now = new Date()
      const next = prayerData.find((p) => p.date > now)
      if (next) {
        setCountdown(getTimeUntil(next.date))
        setNextPrayerName(next.name)
      } else {
        // Past Isha — next prayer is Fajr tomorrow
        setNextPrayerName('Fajr')
        const fajr = prayerData.find((p) => p.name === 'Fajr')
        if (fajr) {
          const tomorrowFajr = new Date(fajr.date.getTime() + 24 * 60 * 60 * 1000)
          setCountdown(getTimeUntil(tomorrowFajr))
        }
      }
    } catch {
      const now = new Date()
      const hours = [5, 12, 15, 18, 19]
      const fallback = PRAYER_NAMES.map((name, i) => {
        const d = new Date(now); d.setHours(hours[i], i === 0 ? 15 : 0, 0, 0)
        return { name, time: formatTime(d), date: d }
      })
      setPrayers(fallback)
      prayersRef.current = fallback
      const nextFallback = fallback.find(p => p.date > now)
      if (nextFallback) {
        setNextPrayerName(nextFallback.name)
        setCountdown(getTimeUntil(nextFallback.date))
      } else {
        setNextPrayerName('Fajr')
        const fajrFallback = fallback.find(p => p.name === 'Fajr')
        if (fajrFallback) {
          setCountdown(getTimeUntil(new Date(fajrFallback.date.getTime() + 24 * 60 * 60 * 1000)))
        }
      }
    }
  }, [scheduleNotifications])

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})

    // Handle Google auth callback — skip onboarding if auth just completed
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth_complete') === '1') {
      setItem(KEYS.ONBOARDING_COMPLETE, true)
      setShowOnboarding(false)
      window.history.replaceState({}, '', '/')
    }
    setHijriDate(getHijriDate())
    setChecklist(getItem(KEYS.CHECKLIST, {}))
    setStreak(getItem(KEYS.STREAK, 0))
    setPoints(getItem(KEYS.POINTS, 0))
    setUsername(getItem(KEYS.USERNAME, ''))
    setLastRead(getItem(KEYS.LAST_READ, null))
    // Home masjid
    const savedHomeMasjidId = getItem<string>(KEYS.HOME_MASJID, '')
    if (savedHomeMasjidId) {
      const found = MASJIDS.find((m) => m.id === savedHomeMasjidId)
      if (found) setHomeMasjidName(found.name)
    }

    const onboardingDone = getItem(KEYS.ONBOARDING_COMPLETE, false)
    if (onboardingDone) {
      setShowOnboarding(false)
      // Check if tour was queued from the wizard
      if (getItem(KEYS.TOUR_PENDING, false)) {
        setItem(KEYS.TOUR_PENDING, false)
        setTimeout(() => setShowTour(true), 600) // Small delay for page to settle
      }
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
    fetchBuddies()
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

  // Auto-detect location if never set
  useEffect(() => {
    const hasLocation = localStorage.getItem('user_lat') !== null
    if (hasLocation) return

    detectLocation()
      .then(async (coords) => {
        const geo = await reverseGeocode(coords.latitude, coords.longitude)
        setItem(KEYS.USER_LAT, coords.latitude)
        setItem(KEYS.USER_LNG, coords.longitude)
        setItem(KEYS.USER_CITY, geo.city)
        setItem(KEYS.USER_COUNTRY, geo.country)
        setItem(KEYS.USER_COUNTRY_CODE, geo.countryCode)

        const rec = getRecommendedMethod(coords.latitude, coords.longitude, geo.countryCode)
        const currentMethod = getItem(KEYS.CALCULATION_METHOD, '')
        if (!currentMethod || currentMethod === 'Egyptian') {
          setItem(KEYS.CALCULATION_METHOD, rec.method)
        }

        loadPrayerTimes()
        setLocationDetected(true)
      })
      .catch(() => {
        setLocationFailed(true)
      })
  }, [loadPrayerTimes])

  // Countdown timers — uses ref to avoid stale closure
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const next = prayersRef.current.find((p) => p.date > now)
      if (next) {
        setCountdown(getTimeUntil(next.date))
        setNextPrayerName(next.name)
      } else if (prayersRef.current.length > 0) {
        // Past Isha — next prayer is Fajr tomorrow
        setNextPrayerName('Fajr')
        const fajr = prayersRef.current.find((p) => p.name === 'Fajr')
        if (fajr) {
          const tomorrowFajr = new Date(fajr.date.getTime() + 24 * 60 * 60 * 1000)
          setCountdown(getTimeUntil(tomorrowFajr))
        }
      }
      // Iftaar countdown (time until Maghrib)
      const maghrib = prayersRef.current.find((p) => p.name === 'Maghrib')
      if (maghrib && maghrib.date > now) {
        setIftaarCountdown(getTimeUntil(maghrib.date))
      } else {
        setIftaarCountdown(null)
      }
      // Suhoor countdown (time until Fajr) — shown during Ramadan after Iftaar
      const fajrToday = prayersRef.current.find((p) => p.name === 'Fajr')
      const maghribPassed = !maghrib || maghrib.date <= now
      if (maghribPassed && fajrToday) {
        // After Maghrib: count down to tomorrow's Fajr
        const tomorrowFajr = new Date(fajrToday.date.getTime() + 24 * 60 * 60 * 1000)
        setSuhoorCountdown(getTimeUntil(tomorrowFajr))
      } else if (!maghribPassed && fajrToday && fajrToday.date > now) {
        // Before Fajr (early morning): count down to today's Fajr
        setSuhoorCountdown(getTimeUntil(fajrToday.date))
      } else {
        setSuhoorCountdown(null)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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

    // Special sync for Qaida
    if (key === 'qaida_practiced') {
      const todayStr = new Date().toISOString().split('T')[0]
      const qaidaLog = getItem<Record<string, { lesson: number; completed: boolean }>>(KEYS.QAIDA_LOG, {})
      const current = qaidaLog[todayStr] || { lesson: 1, completed: false }
      qaidaLog[todayStr] = { ...current, completed: newVal }
      setItem(KEYS.QAIDA_LOG, qaidaLog)
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
        // Check if user opted into the app tour
        if (getItem(KEYS.TOUR_PENDING, false)) {
          setItem(KEYS.TOUR_PENDING, false)
          setTimeout(() => setShowTour(true), 800)
        }
      }} />
    )
  }

  return (
    <div className={`min-h-screen bg-background pb-nav ${mounted ? '' : 'opacity-0'}`} style={{ transition: 'opacity 0.3s ease' }}>
      {/* ========== HERO ========== */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 ${ramadan ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-900' : 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900'}`} />
        {/* Decorative blurred orbs */}
        <div className={`absolute -top-20 -right-20 h-60 w-60 rounded-full blur-3xl ${ramadan ? 'bg-purple-500/15' : 'bg-emerald-500/15'}`} />
        <div className={`absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl ${ramadan ? 'bg-indigo-500/20' : 'bg-teal-500/20'}`} />
        {/* Pattern overlay */}
        <div className="islamic-pattern absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        {/* Hero animation */}
        <HeroAnimation theme={ramadan ? 'ramadan' : 'prayer'} />

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
                <Image src="/images/logo.jpg" alt="MasjidConnect GY" width={44} height={44} className="rounded-2xl ring-2 ring-border" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a0b14] bg-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wide text-foreground/50">{getIslamicGreeting()}</p>
                <h1 className="text-lg font-bold text-foreground">{username || 'MasjidConnect GY'}</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/explore" className="glass flex h-10 w-10 items-center justify-center rounded-2xl text-foreground/80 transition-transform active:scale-90" aria-label="Explore">
                <Compass className="h-5 w-5" />
              </Link>
              <Link href="/profile" className="glass flex h-10 w-10 items-center justify-center rounded-2xl text-foreground/80 transition-transform active:scale-90" aria-label="Profile">
                <User className="h-5 w-5" />
              </Link>
              <Link href="/settings" className="glass flex h-10 w-10 items-center justify-center rounded-2xl text-foreground/80 transition-transform active:scale-90" aria-label="Settings">
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Date pills */}
          <div className="mb-6 flex items-center gap-2 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${ramadan ? 'glass-amber text-amber-300' : 'glass-emerald text-emerald-300'}`}>
              {hijriDate || 'Loading...'}
            </span>
            <span className="glass rounded-full px-3 py-1.5 text-[11px] font-medium text-foreground/50">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Location notice */}
          {locationFailed && !locationDetected && (
            <div className="mb-3 flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-amber-400">Using Georgetown, Guyana</p>
                  <p className="text-[10px] text-foreground/40 truncate">Prayer times may be incorrect for your location</p>
                </div>
              </div>
              <Link href="/settings" className="ml-3 shrink-0 rounded-full bg-amber-500/15 px-3 py-1.5 text-[10px] font-semibold text-amber-400 active:scale-95 transition-transform">
                Update
              </Link>
            </div>
          )}

          {/* Next Prayer Countdown */}
          <div data-tour="prayer-countdown" className="glass-emerald rounded-3xl p-5 animate-scale-in" style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}>
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
                  <span className="text-4xl font-extrabold tabular-nums text-foreground tracking-tight">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="text-base font-medium text-emerald-400/50 mx-0.5">:</span>
                  <span className="text-4xl font-extrabold tabular-nums text-foreground tracking-tight">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="text-base font-medium text-emerald-400/50 mx-0.5">:</span>
                  <span className="text-4xl font-extrabold tabular-nums text-foreground tracking-tight">{String(countdown.seconds).padStart(2, '0')}</span>
                </div>
                {nextPrayer && <p className="mt-1 text-[11px] text-foreground/30">{nextPrayer.time} &middot; {getTimeGreeting()}</p>}
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
                  <span className="text-2xl font-extrabold tabular-nums text-foreground">{String(iftaarCountdown.hours).padStart(2, '0')}</span>
                  <span className="text-sm text-amber-400/50">h</span>
                  <span className="text-2xl font-extrabold tabular-nums text-foreground">{String(iftaarCountdown.minutes).padStart(2, '0')}</span>
                  <span className="text-sm text-amber-400/50">m</span>
                  <span className="text-2xl font-extrabold tabular-nums text-foreground">{String(iftaarCountdown.seconds).padStart(2, '0')}</span>
                  <span className="text-sm text-amber-400/50">s</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-amber-400/30 shrink-0" />
            </Link>
          )}

          {/* Suhoor Countdown -- shown during Ramadan after Iftaar / before Fajr */}
          {ramadan && suhoorCountdown && (
            <Link href="/ramadan" className="mt-3 flex items-center gap-4 rounded-2xl p-4 glass border border-blue-500/20 animate-fade-up card-premium" style={{ animationDelay: '0.35s', animationFillMode: 'backwards' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15">
                <Moon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400/70">Suhoor ends in</span>
                  <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-300">Fajr</span>
                </div>
                <div className="mt-1 flex items-baseline gap-0.5">
                  <span className="text-2xl font-extrabold tabular-nums text-foreground">{String(suhoorCountdown.hours).padStart(2, '0')}</span>
                  <span className="text-sm text-blue-400/50">h</span>
                  <span className="text-2xl font-extrabold tabular-nums text-foreground">{String(suhoorCountdown.minutes).padStart(2, '0')}</span>
                  <span className="text-sm text-blue-400/50">m</span>
                  <span className="text-2xl font-extrabold tabular-nums text-foreground">{String(suhoorCountdown.seconds).padStart(2, '0')}</span>
                  <span className="text-sm text-blue-400/50">s</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400/30 shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {/* ========== PRAYER STRIP ========== */}
      <div className="-mt-2 pt-2">
        <PrayerStrip prayers={prayers} />
        {homeMasjidName && (
          <p className="mt-1 px-4 text-center text-[10px] text-muted-foreground/60">
            ⭐ Prayer times for <span className="text-muted-foreground/80">{homeMasjidName}</span>
          </p>
        )}
      </div>

      {/* ========== HADITH OF THE DAY ========== */}
      <div data-tour="hadith-card" className="mx-4 mb-4 mt-3 rounded-xl bg-card/70 border border-border p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-400 text-sm">{'\uD83D\uDCDC'}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-400/80">Hadith of the Day</span>
        </div>
        <p className="font-arabic text-right text-lg leading-loose text-foreground mb-2">{hadith.arabic}</p>
        <p className="text-xs text-muted-foreground italic mb-2">&ldquo;{hadith.transliteration}&rdquo;</p>
        <p className="text-sm text-foreground/80 mb-3">&ldquo;{hadith.english}&rdquo;</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/80">{hadith.narrator}</span>
          <span className="text-[10px] text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded-full">{hadith.source}</span>
        </div>
      </div>

      {/* ========== STATS BAR ========== */}
      <div className="flex gap-3 px-4 pt-5 animate-stagger">
        <div className="glass flex flex-1 items-center gap-3 rounded-2xl px-4 py-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
            <Flame className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-extrabold tabular-nums text-foreground">{streak}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">Day Streak</p>
          </div>
        </div>
        <div className="glass flex flex-1 items-center gap-3 rounded-2xl px-4 py-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xl font-extrabold tabular-nums text-foreground">{points}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">Points</p>
          </div>
        </div>
      </div>

      {/* ========== ANNOUNCEMENTS ========== */}
      <div className="px-4 pt-4">
        <AnnouncementsBanner />
      </div>

      {/* ========== VERSE OF THE DAY ========== */}
      <div data-tour="verse-card" className="px-4 pt-5 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
        <div className="relative overflow-hidden rounded-3xl glass-amber p-5">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl" />
          <div className="mb-3 flex items-center gap-2">
            <BookMarked className="h-4 w-4 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80">Verse of the Day</span>
          </div>
          <p className="mb-3 text-right font-arabic text-xl leading-[2.2] text-foreground/90" dir="rtl">{dailyVerse.arabic}</p>
          <p className="text-sm leading-relaxed text-muted-foreground/90">{dailyVerse.translation}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] font-medium text-amber-400/50">{dailyVerse.reference}</p>
            <Link href={`/quran/${dailyVerse.surah}`} className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-400 transition-all active:scale-95">
              Read Surah <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========== BUDDY BAR ========== */}
      <div className="px-4 pt-5 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
        {buddies.length > 0 ? (
          <div className="glass flex items-center gap-4 rounded-2xl p-4 card-premium">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15">
              <Users className="h-5 w-5 text-sky-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400/70">Faith Buddy</p>
              <div className="mt-0.5 flex items-center gap-2">
                <p className="text-sm font-bold text-foreground truncate">{buddies[0].displayName || buddies[0].name}</p>
                {buddies[0].streak > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400">
                    <Flame className="h-3 w-3" /> {buddies[0].streak}d
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/explore/buddy"
              className="rounded-xl bg-sky-500/15 px-4 py-2 text-xs font-bold text-sky-400 transition-all active:scale-95"
            >
              Nudge
            </Link>
          </div>
        ) : (
          <Link
            href="/explore/buddy"
            className="glass flex items-center gap-4 rounded-2xl p-4 card-premium border border-dashed border-sky-500/20"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10">
              <Users className="h-5 w-5 text-sky-400/60" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground/80">Find a Faith Buddy</p>
              <p className="text-[10px] text-muted-foreground">Compete in good deeds together</p>
            </div>
            <ChevronRight className="h-4 w-4 text-sky-400/30" />
          </Link>
        )}
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
              <p className="text-sm font-bold text-foreground">{lastRead.name}</p>
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
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-foreground/70">
                    Day {ramadanStatus.ramadanDay}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-lg font-bold text-foreground">Ramadan Mode</h3>
              <p className="mt-1 text-xs text-foreground/50">Quick access to your Ramadan essentials</p>

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
                    <span className="text-[9px] font-medium text-foreground/70">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== EID COUNTDOWN ========== */}
      {ramadan && (() => {
        const eid = new Date('2026-03-20')
        const todayEid = new Date()
        todayEid.setHours(0,0,0,0)
        const diff = Math.ceil((eid.getTime() - todayEid.getTime()) / (1000*60*60*24))
        if (diff <= 0 || diff > 30) return null
        return (
          <div className="mx-4 mt-4">
            <div className="glass-amber rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">🌙</span>
              <div>
                <p className="text-xs font-bold text-amber-300">
                  {diff === 1 ? 'Eid al-Fitr is TOMORROW! 🎉' : `${diff} days until Eid al-Fitr`}
                </p>
                <p className="text-[10px] text-amber-400/70">1 Shawwal 1447 · March 20, 2026</p>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ========== QUICK ACTIONS ========== */}
      <div data-tour="quick-actions" className="px-4 pt-6">
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
              <span className="text-xs font-semibold text-muted-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ========== DAILY CHECKLIST ========== */}
      <div data-tour="checklist" className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="section-label">
            <div className="h-4 w-1 rounded-full bg-amber-500" />
            Daily Checklist
          </div>
          <span className="text-xs font-bold tabular-nums text-emerald-400">{completedCount}/{CHECKLIST_ITEMS.length}</span>
        </div>

        {/* Progress bar */}
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-secondary/50">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out" style={{ width: `${(completedCount / CHECKLIST_ITEMS.length) * 100}%` }} />
        </div>

        <div className="space-y-2 animate-stagger">
          {CHECKLIST_ITEMS.map((item) => (
            <button key={item.key} onClick={() => toggleCheck(item.key)}
              className={`glass flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 active:scale-[0.98] ${
                checklist[item.key] ? 'border-emerald-500/20 bg-emerald-500/8' : ''
              }`}>
              <CheckCircle2 className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                checklist[item.key] ? 'fill-emerald-500 text-emerald-500 scale-110' : 'text-muted-foreground/60'
              }`} />
              <span className={`text-sm font-medium transition-colors ${checklist[item.key] ? 'text-emerald-400 line-through decoration-emerald-500/30' : 'text-foreground'}`}>
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

      {/* App tour overlay */}
      {showTour && (
        <AppTour onComplete={() => setShowTour(false)} />
      )}
    </div>
  )
}
