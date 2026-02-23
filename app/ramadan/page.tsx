'use client'

import { useEffect, useState, useCallback } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { formatTime, getTimeUntil, PRAYER_NAMES } from '@/lib/prayer-times'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Moon, UtensilsCrossed, Sunrise, BookOpen,
  Target, Flame, ChevronRight, Check, Star, Heart,
  Calendar, Trophy
} from 'lucide-react'

interface PrayerTimeData { name: string; time: string; date: Date }

const RAMADAN_GOALS = [
  { key: 'quran_page', label: 'Read 1 Juz of Quran', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/15' },
  { key: 'taraweeh', label: 'Pray Taraweeh', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/15' },
  { key: 'sadaqah', label: 'Give Sadaqah', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/15' },
  { key: 'dhikr_1000', label: '1000 Dhikr', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { key: 'feed_someone', label: 'Feed Someone for Iftaar', icon: UtensilsCrossed, color: 'text-teal-400', bg: 'bg-teal-500/15' },
  { key: 'dua_list', label: 'Make Dua from List', icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/15' },
]

const IFTAAR_DUAS = [
  { arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ', translation: 'O Allah, I fasted for You and I break my fast with Your provision.', source: 'Abu Dawud' },
  { arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ', translation: 'The thirst has gone, the veins are moist, and the reward is certain, if Allah wills.', source: 'Abu Dawud' },
]

export default function RamadanPage() {
  const router = useRouter()
  const [prayers, setPrayers] = useState<PrayerTimeData[]>([])
  const [iftaarCountdown, setIftaarCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [suhoorCountdown, setSuhoorCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [showIftaarDua, setShowIftaarDua] = useState(false)
  const [todayGoals, setTodayGoals] = useState<Record<string, boolean>>({})
  const [fastingLog, setFastingLog] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)

  const todayKey = new Date().toISOString().split('T')[0]

  // Calc fasts this month
  const totalFasted = Object.values(fastingLog).filter(v => v === 'fasted').length

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
        UmmAlQura: () => adhan.CalculationMethod.UmmAlQura(),
      }
      const params = (methodMap[methodKey] || methodMap.Egyptian)()
      params.madhab = madhabKey === 'Hanafi' ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi
      const pt = new adhan.PrayerTimes(coords, new Date(), params)
      const prayerMap: Record<string, Date> = { Fajr: pt.fajr, Dhuhr: pt.dhuhr, Asr: pt.asr, Maghrib: pt.maghrib, Isha: pt.isha }
      const prayerData: PrayerTimeData[] = PRAYER_NAMES.map((name) => ({ name, time: formatTime(prayerMap[name]), date: prayerMap[name] }))
      setPrayers(prayerData)
    } catch {
      const now = new Date()
      const hours = [5, 12, 15, 18, 19]
      setPrayers(PRAYER_NAMES.map((name, i) => {
        const d = new Date(now); d.setHours(hours[i], i === 0 ? 15 : 0, 0, 0)
        return { name, time: formatTime(d), date: d }
      }))
    }
  }, [])

  useEffect(() => {
    loadPrayerTimes()
    setTodayGoals(getItem(`ramadan_goals_${todayKey}`, {}))
    setFastingLog(getItem(KEYS.FASTING_LOG, {}))
    setMounted(true)
  }, [loadPrayerTimes, todayKey])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const maghrib = prayers.find(p => p.name === 'Maghrib')
      const fajr = prayers.find(p => p.name === 'Fajr')

      if (maghrib && maghrib.date > now) {
        setIftaarCountdown(getTimeUntil(maghrib.date))
        setShowIftaarDua(false)
      } else {
        setIftaarCountdown({ hours: 0, minutes: 0, seconds: 0 })
        setShowIftaarDua(true)
      }

      if (fajr && fajr.date > now) {
        setSuhoorCountdown(getTimeUntil(fajr.date))
      } else {
        setSuhoorCountdown({ hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [prayers])

  const toggleGoal = (key: string) => {
    const updated = { ...todayGoals, [key]: !todayGoals[key] }
    setTodayGoals(updated)
    setItem(`ramadan_goals_${todayKey}`, updated)
  }

  const markFasted = () => {
    const updated = { ...fastingLog, [todayKey]: fastingLog[todayKey] === 'fasted' ? '' : 'fasted' }
    if (!updated[todayKey]) delete updated[todayKey]
    setFastingLog(updated)
    setItem(KEYS.FASTING_LOG, updated)
  }

  const completedGoals = Object.values(todayGoals).filter(Boolean).length
  const fajr = prayers.find(p => p.name === 'Fajr')
  const maghrib = prayers.find(p => p.name === 'Maghrib')
  const todayFasted = fastingLog[todayKey] === 'fasted'

  return (
    <div className={`min-h-screen bg-[#0a0b14] pb-nav ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.3s ease' }}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-900" />
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute bottom-0 -left-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="islamic-pattern absolute inset-0 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0b14]" />

        {/* Floating crescent */}
        <div className="absolute top-10 right-6 animate-float opacity-30">
          <Moon className="h-12 w-12 text-amber-300" />
        </div>

        <div className="relative px-5 pt-12 pb-8">
          {/* Back button */}
          <button onClick={() => router.back()} className="glass mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-white/80 transition-transform active:scale-90" aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="animate-fade-up">
            <span className="rounded-full bg-amber-500/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-300">Ramadan Mubarak</span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">Ramadan Hub</h1>
            <p className="mt-1 text-sm text-white/40">Your blessed month companion</p>
          </div>

          {/* Suhoor & Iftaar times */}
          <div className="mt-6 grid grid-cols-2 gap-3 animate-scale-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            <div className="glass rounded-2xl p-4 text-center">
              <Sunrise className="mx-auto mb-2 h-5 w-5 text-blue-400" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/70">Suhoor Ends</p>
              <p className="mt-1 text-lg font-extrabold text-white">{fajr?.time || '--:--'}</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <UtensilsCrossed className="mx-auto mb-2 h-5 w-5 text-amber-400" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70">Iftaar</p>
              <p className="mt-1 text-lg font-extrabold text-white">{maghrib?.time || '--:--'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 -mt-2">
        {/* Iftaar Countdown */}
        {!showIftaarDua ? (
          <div className="glass-amber rounded-3xl p-5 animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed className="h-4 w-4 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80">Iftaar Countdown</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <div className="text-center">
                <span className="text-5xl font-extrabold tabular-nums text-white">{String(iftaarCountdown.hours).padStart(2, '0')}</span>
                <p className="mt-1 text-[10px] font-medium uppercase text-amber-400/50">Hours</p>
              </div>
              <span className="text-3xl font-bold text-amber-400/30 mb-4">:</span>
              <div className="text-center">
                <span className="text-5xl font-extrabold tabular-nums text-white">{String(iftaarCountdown.minutes).padStart(2, '0')}</span>
                <p className="mt-1 text-[10px] font-medium uppercase text-amber-400/50">Minutes</p>
              </div>
              <span className="text-3xl font-bold text-amber-400/30 mb-4">:</span>
              <div className="text-center">
                <span className="text-5xl font-extrabold tabular-nums text-white">{String(iftaarCountdown.seconds).padStart(2, '0')}</span>
                <p className="mt-1 text-[10px] font-medium uppercase text-amber-400/50">Seconds</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-amber rounded-3xl p-5 animate-scale-in">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400/80">Iftaar Dua</span>
            </div>
            {IFTAAR_DUAS.map((dua, i) => (
              <div key={i} className={i > 0 ? 'mt-4 pt-4 border-t border-amber-500/10' : ''}>
                <p className="text-right font-arabic text-lg leading-[2] text-white/90" dir="rtl">{dua.arabic}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-300/90">{dua.translation}</p>
                <p className="mt-1 text-[10px] text-amber-400/50">{dua.source}</p>
              </div>
            ))}
          </div>
        )}

        {/* Today's Fast */}
        <div className="glass rounded-3xl p-5 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="section-label mb-1">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                {"Today's Fast"}
              </div>
              <p className="text-sm text-white/50">
                {todayFasted ? 'Alhamdulillah, fast logged!' : 'Did you fast today?'}
              </p>
            </div>
            <button onClick={markFasted} className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 active:scale-90 ${
              todayFasted ? 'bg-emerald-500 shadow-lg shadow-emerald-500/25' : 'glass'
            }`}>
              {todayFasted ? <Check className="h-6 w-6 text-white" /> : <UtensilsCrossed className="h-6 w-6 text-gray-400" />}
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-white">{totalFasted}</span>
              <span className="text-xs text-gray-500">fasts this month</span>
            </div>
            <Link href="/tracker/fasting" className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-emerald-400 active:text-emerald-300">
              View Calendar <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Suhoor Countdown */}
        {suhoorCountdown.hours > 0 || suhoorCountdown.minutes > 0 ? (
          <div className="glass rounded-2xl p-4 animate-fade-up" style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                <Sunrise className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400/70">Suhoor ends in</p>
                <p className="text-lg font-extrabold tabular-nums text-white">
                  {String(suhoorCountdown.hours).padStart(2, '0')}h {String(suhoorCountdown.minutes).padStart(2, '0')}m {String(suhoorCountdown.seconds).padStart(2, '0')}s
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Daily Ramadan Goals */}
        <div className="animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="section-label">
              <div className="h-4 w-1 rounded-full bg-purple-500" />
              Daily Ramadan Goals
            </div>
            <span className="text-xs font-bold tabular-nums text-purple-400">{completedGoals}/{RAMADAN_GOALS.length}</span>
          </div>

          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-800/50">
            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-700 ease-out" style={{ width: `${(completedGoals / RAMADAN_GOALS.length) * 100}%` }} />
          </div>

          <div className="space-y-2">
            {RAMADAN_GOALS.map((goal) => (
              <button key={goal.key} onClick={() => toggleGoal(goal.key)} className={`glass flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 active:scale-[0.98] ${
                todayGoals[goal.key] ? 'border-purple-500/20 bg-purple-500/8' : ''
              }`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${goal.bg} transition-transform duration-300 ${todayGoals[goal.key] ? 'scale-110' : ''}`}>
                  <goal.icon className={`h-4 w-4 ${goal.color}`} />
                </div>
                <span className={`text-sm font-medium transition-colors ${todayGoals[goal.key] ? 'text-purple-400 line-through decoration-purple-500/30' : 'text-white'}`}>
                  {goal.label}
                </span>
                {todayGoals[goal.key] && (
                  <Trophy className="ml-auto h-4 w-4 text-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 animate-stagger">
          <Link href="/explore/tasbih" className="glass flex items-center gap-3 rounded-2xl p-4 card-premium">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
              <Star className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Tasbih</p>
              <p className="text-[10px] text-gray-500">Night Dhikr</p>
            </div>
          </Link>
          <Link href="/quran" className="glass flex items-center gap-3 rounded-2xl p-4 card-premium">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
              <BookOpen className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Quran</p>
              <p className="text-[10px] text-gray-500">Read a Juz</p>
            </div>
          </Link>
          <Link href="/explore/duas" className="glass flex items-center gap-3 rounded-2xl p-4 card-premium">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Duas</p>
              <p className="text-[10px] text-gray-500">Supplications</p>
            </div>
          </Link>
          <Link href="/tracker/fasting" className="glass flex items-center gap-3 rounded-2xl p-4 card-premium">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <Calendar className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Calendar</p>
              <p className="text-[10px] text-gray-500">Fast Log</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="h-4" />
      <BottomNav />
    </div>
  )
}
