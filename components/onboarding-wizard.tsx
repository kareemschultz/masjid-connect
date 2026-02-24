'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  BookOpen, MapPin, Clock, Users, ChevronRight, ChevronLeft,
  Sparkles, Moon, Bell, Smartphone, Share2, Heart, Star,
  UtensilsCrossed, Headphones, Check
} from 'lucide-react'
import { setItem, KEYS } from '@/lib/storage'
import { CALCULATION_METHODS, MADHABS } from '@/lib/prayer-times'
import { detectLocation, reverseGeocode, getRecommendedMethod } from '@/lib/location'
import { applyTheme } from '@/components/theme-provider'
import { HeroAnimation, type HeroTheme } from '@/components/hero-animations'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingWizardProps {
  onComplete: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOUR_START_EVENT = 'app-tour:start'

const FEATURES = [
  {
    emoji: '\uD83D\uDD4C',
    label: 'Prayer Times',
    desc: 'Accurate Georgetown times, Sunnah & Nawafil tracker, live countdown',
    color: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    emoji: '\uD83D\uDCD6',
    label: 'Quran',
    desc: "Full Mus'haf, 12 reciters, Hifz mode, continue reading bookmark",
    color: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    emoji: '\uD83C\uDF19',
    label: 'Ramadan & Fasting',
    desc: 'Suhoor/Iftaar countdowns, voluntary fasting tracker, moon sighting',
    color: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    emoji: '\uD83C\uDFA7',
    label: 'Lectures',
    desc: 'Al-Awlaki, Hamza Yusuf, Bilal Philips, Yasmin Mogahed \u2014 80+ lectures',
    color: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    emoji: '\uD83D\uDD4C',
    label: 'Masjids & Jumu\'ah',
    desc: '20+ Guyanese masjids, Qibla, prayer timetable, Jumu\'ah prep',
    color: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    iconColor: 'text-teal-400',
  },
  {
    emoji: '\uD83D\uDCDA',
    label: 'Learn Islam',
    desc: 'Noorani Qaida, Salah guide, 25 Prophets, Seerah, 99 Names, Adab',
    color: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    emoji: '\uD83D\uDC65',
    label: 'Faith Buddies',
    desc: 'Add buddies by @username or phone, challenges, leaderboard, nudges',
    color: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    iconColor: 'text-sky-400',
  },
  {
    emoji: '\uD83E\uDD1D',
    label: 'Community',
    desc: 'Dua Board, Khatam Collective, community feed, halal directory',
    color: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    iconColor: 'text-rose-400',
  },
]

const RAMADAN_OPTIONS = [
  {
    value: '2026-02-18',
    label: 'Saudi / International Sighting',
    note: 'Follows Saudi Arabia\u2019s official moon sighting announcement — Ramadan began Wed 18 Feb 2026',
    moonKey: 'saudi',
  },
  {
    value: '2026-02-19',
    label: 'Local Guyana Sighting',
    note: 'Follows the local Guyanese regional moon sighting — as announced by GIT, CIOG, and the Central Moon Sighting Committee — Ramadan began Thu 19 Feb 2026',
    moonKey: 'ciog',
  },
]

// Detect Ramadan proximity using Hijri calendar
function isNearRamadan(): boolean {
  try {
    const fmt = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', { month: 'numeric' })
    const hijriMonth = parseInt(fmt.format(new Date()))
    return hijriMonth === 8 || hijriMonth === 9 || hijriMonth === 10
  } catch {
    return true // default to showing it
  }
}

function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
}

function isIOS(): boolean {
  return typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
}

function isStandalone(): boolean {
  return typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true)
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

// ─── Step Dots ────────────────────────────────────────────────────────────────

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < step
              ? 'w-1.5 bg-emerald-600'
              : i === step
              ? 'w-5 bg-emerald-400'
              : 'w-1.5 bg-muted'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [method, setMethod] = useState('MuslimWorldLeague')
  const [madhab, setMadhab] = useState('Shafi')
  const [ramadanStart, setRamadanStart] = useState('ciog')
  const [notifGranted, setNotifGranted] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [pwaInstalled, setPwaInstalled] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const showRamadanStep = isNearRamadan()

  // Theme selection
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>('dark')

  const pickTheme = (t: 'dark' | 'light') => {
    setSelectedTheme(t)
    setItem(KEYS.THEME, t)
    applyTheme(t)
  }

  // Location detection
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'detected' | 'error'>('idle')
  const [detectedCity, setDetectedCity] = useState('')
  const [detectedCountry, setDetectedCountry] = useState('')
  const [recommendedMethodLabel, setRecommendedMethodLabel] = useState('')
  const [recommendedMethodReason, setRecommendedMethodReason] = useState('')

  const handleDetectLocation = async () => {
    setLocationStatus('detecting')
    try {
      const coords = await detectLocation()
      const { city, country, countryCode } = await reverseGeocode(coords.latitude, coords.longitude)
      const rec = getRecommendedMethod(coords.latitude, coords.longitude, countryCode)
      // Save to storage
      setItem(KEYS.USER_LAT, coords.latitude)
      setItem(KEYS.USER_LNG, coords.longitude)
      setItem(KEYS.USER_CITY, city)
      setItem(KEYS.USER_COUNTRY, country)
      setItem(KEYS.USER_COUNTRY_CODE, countryCode)
      // Update state
      setDetectedCity(city)
      setDetectedCountry(country)
      setRecommendedMethodLabel(rec.label)
      setRecommendedMethodReason(rec.reason)
      setMethod(rec.method)
      setLocationStatus('detected')
    } catch {
      setLocationStatus('error')
    }
  }

  // PWA install prompt capture
  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const requestNotifications = async () => {
    if (!isPushSupported()) return
    const perm = await Notification.requestPermission()
    setNotifGranted(perm === 'granted')
  }

  const triggerInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setPwaInstalled(true)
    setDeferredPrompt(null)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'MasjidConnect GY',
        text: 'Check out this free Islamic app built for the Guyanese Muslim community!',
        url: 'https://masjidconnectgy.com',
      }).catch(() => {})
    } else {
      await navigator.clipboard.writeText('https://masjidconnectgy.com').catch(() => {})
    }
  }

  const handleGoogleSignIn = async () => {
    setSigningIn(true)
    try {
      // Use Better Auth Google sign-in
      const { signIn } = await import('@/lib/auth-client')
      await signIn.social({ provider: 'google', callbackURL: '/?auth_complete=1' })
    } catch {
      setSigningIn(false)
    }
  }

  const finish = () => {
    if (name.trim()) setItem(KEYS.USERNAME, name.trim())
    setItem(KEYS.CALCULATION_METHOD, method)
    setItem(KEYS.MADHAB, madhab)
    if (showRamadanStep) {
      const selectedOption = RAMADAN_OPTIONS.find(o => o.moonKey === ramadanStart)
      setItem('ramadan_start', selectedOption?.value || '2026-02-19')
      setItem('moon_sighting', ramadanStart)
      setItem('ramadan_start_prompted', true)
    }
    if (username.trim()) {
      const cleaned = username.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '')
      fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: cleaned || undefined,
          phoneNumber: phone.trim() || undefined,
        }),
      }).catch(() => {})
    }
    setItem(KEYS.ONBOARDING_COMPLETE, true)
    onComplete()
  }

  // Effective step count (exclude Ramadan step if not needed)
  const steps = [
    'welcome',
    'features',
    'install',
    'theme',
    'profile',
    'prayer',
    ...(showRamadanStep ? ['ramadan'] : []),
    'notifications',
    'done',
  ]
  const totalSteps = steps.length
  const currentStepKey = steps[step]

  const next = () => {
    if (step < totalSteps - 1) setStep(step + 1)
    else finish()
  }
  const prev = () => { if (step > 0) setStep(step - 1) }
  const progress = ((step + 1) / totalSteps) * 100

  const STEP_THEMES: Record<string, HeroTheme> = {
    welcome: 'prayer',
    features: 'explore',
    install: 'community',
    profile: 'community',
    prayer: 'prayer',
    ramadan: 'ramadan',
    notifications: 'duas',
    theme: 'explore',
    done: 'ramadan',
  }
  const STEP_GRADIENTS: Record<string, string> = {
    welcome: 'from-emerald-950 via-emerald-900 to-teal-900',
    features: 'from-rose-950 via-pink-900 to-orange-900',
    install: 'from-teal-950 via-emerald-900 to-cyan-900',
    profile: 'from-cyan-950 via-blue-900 to-slate-900',
    prayer: 'from-emerald-950 via-teal-900 to-sky-900',
    ramadan: 'from-indigo-950 via-purple-900 to-violet-900',
    notifications: 'from-amber-950 via-orange-900 to-red-900',
    theme: 'from-fuchsia-950 via-purple-900 to-indigo-900',
    done: 'from-emerald-950 via-teal-900 to-indigo-900',
  }
  const stepTheme: HeroTheme = STEP_THEMES[currentStepKey] ?? 'default'
  const stepGradient = STEP_GRADIENTS[currentStepKey] ?? STEP_GRADIENTS.welcome

  return (
    <div className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className={`absolute inset-0 bg-gradient-to-br ${stepGradient}`} />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="islamic-pattern absolute inset-0 opacity-45" />
        <div className="absolute inset-x-0 top-0 h-[48vh] overflow-hidden">
          <HeroAnimation theme={stepTheme} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/45 to-background" />
      </div>

      {/* Progress bar */}
      <div className="relative h-0.5 w-full bg-secondary">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="relative flex items-center justify-between px-6 pt-4">
        <StepDots step={step} total={totalSteps} />
        <span className="text-xs text-muted-foreground/60">{step + 1}/{totalSteps}</span>
      </div>

      {/* Content area */}
      <div
        key={currentStepKey}
        className="relative flex flex-1 flex-col overflow-y-auto animate-fade-up"
      >

        {/* ── Step 0: Welcome ──────────────────────────────── */}
        {currentStepKey === 'welcome' && (
          <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {/* Floating crescent top-right */}
              <div className="absolute right-6 top-8 text-emerald-500/20 text-5xl" style={{animation:'float-crescent 4s ease-in-out infinite'}}>☽</div>
              {/* Twinkling stars */}
              {[[15,20],[80,35],[10,65],[85,15],[70,75]].map(([x,y],i)=>(
                <div key={i} className="absolute h-1 w-1 rounded-full bg-emerald-400/40"
                  style={{left:`${x}%`,top:`${y}%`,animation:`twinkle ${1.5+i*0.4}s ease-in-out infinite`,animationDelay:`${i*0.3}s`}} />
              ))}
            </div>
            {/* Logo */}
            <div className="relative mb-6">
              <div className="absolute -inset-6 rounded-full bg-emerald-500/10 blur-3xl" />
              <Image
                src="/images/logo.jpg"
                alt="MasjidConnect GY"
                width={100}
                height={100}
                className="relative rounded-3xl shadow-2xl shadow-emerald-500/20 ring-1 ring-emerald-500/20"
              />
            </div>

            <div className="mb-1 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">بِسْمِ اللَّهِ</p>
            </div>
            <h1 className="mb-1 text-center text-3xl font-bold text-foreground">Assalamu Alaikum</h1>
            <p className="mb-1 text-center text-base font-medium text-emerald-400">Welcome to MasjidConnect GY</p>

            {/* Community Card */}
            <div className="mt-5 w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-emerald-400">Community-Built</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This app was built by and for the Guyanese Muslim community — completely free, no ads, no tracking, no subscriptions. Just a tool for the ummah.
              </p>
            </div>

            {/* Community stats hint */}
            <div className="mt-3 w-full rounded-2xl border border-border bg-card/60 px-5 py-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal-400" />
                  <span>Georgetown, Guyana</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-400" />
                  <span>100% free, always</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-medium text-muted-foreground transition-all active:bg-secondary"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share with a fellow Muslim
            </button>
          </div>
        )}

        {/* ── Step 1: Features / How It Works ─────────────── */}
        {currentStepKey === 'features' && (
          <div className="flex flex-1 flex-col px-5 py-6">
            <div className="mb-1 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Everything in one place</p>
            </div>
            <h2 className="mb-1 text-center text-2xl font-bold text-foreground">How It Works</h2>
            <p className="mb-5 text-center text-sm text-muted-foreground">
              Eight powerful tools to strengthen your daily practice
            </p>

            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 rounded-2xl border ${f.border} ${f.color} p-3.5`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/20 text-lg">
                    {f.emoji}
                  </div>
                  <p className={`text-xs font-bold ${f.iconColor}`}>{f.label}</p>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Community call-to-action */}
            <div className="mt-4 rounded-2xl border border-border bg-card/60 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                🌙 <span className="font-semibold text-muted-foreground">Community-powered</span> — Dua requests, Khatam drives, and Iftaar reports are submitted live by fellow Muslims.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: Profile ────────────────────────────── */}
        {currentStepKey === 'profile' && (
          <div className="flex flex-1 flex-col px-6 pt-6 space-y-5">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Your Profile</h2>
                  <p className="text-xs text-muted-foreground/80">Help your Faith Buddies find you</p>
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Abdullah, Sister Fatima..."
                maxLength={40}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder-gray-600 outline-none focus:border-emerald-500/50"
              />
              <p className="text-[11px] text-muted-foreground/60">Shown in the community and Faith Buddies leaderboard</p>
            </div>

            {/* @Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">@Username <span className="text-gray-700 normal-case font-normal">(optional)</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-400">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.replace(/[^a-z0-9_]/gi, '').toLowerCase())
                    setUsernameError('')
                  }}
                  placeholder="your_username"
                  maxLength={30}
                  className="w-full rounded-2xl border border-border bg-card py-3.5 pl-9 pr-4 text-sm text-foreground placeholder-gray-600 outline-none focus:border-emerald-500/50"
                />
              </div>
              {usernameError && <p className="text-[11px] text-red-400">{usernameError}</p>}
              <p className="text-[11px] text-muted-foreground/60">Buddies can search you by @username — no email needed</p>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Phone / WhatsApp <span className="text-gray-700 normal-case font-normal">(optional)</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+5926123456"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder-gray-600 outline-none focus:border-emerald-500/50"
              />
              <p className="text-[11px] text-muted-foreground/60">Let buddies find you via your WhatsApp number</p>
            </div>

            {/* Google sign-in */}
            <div className="w-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-secondary" />
                <span className="text-xs text-muted-foreground/60">or</span>
                <div className="h-px flex-1 bg-secondary" />
              </div>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground transition-all active:bg-secondary disabled:opacity-50"
              >
                {signingIn ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
                ) : (
                  <GoogleIcon />
                )}
                {signingIn ? 'Redirecting to Google...' : 'Continue with Google'}
              </button>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground/60">
                Sign in to sync your tracker and streaks across devices
              </p>
            </div>

            <p className="text-center text-[10px] text-gray-700 pt-1">All fields optional — you can update these in Settings anytime</p>
          </div>
        )}

        {/* ── Step 3: Prayer Settings ──────────────────────── */}
        {currentStepKey === 'prayer' && (
          <div className="relative flex flex-1 flex-col px-5 pt-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {/* Compass ring top-right */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-emerald-500/10"
                style={{animation:'spin-slow 20s linear infinite'}} />
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full border border-emerald-500/[0.08]"
                style={{animation:'spin-slow 15s linear infinite reverse'}} />
              {/* Cardinal dots */}
              {[0,90,180,270].map((deg,i)=>(
                <div key={i} className="absolute right-2 top-2 h-1 w-1 rounded-full bg-emerald-400/20"
                  style={{transform:`rotate(${deg}deg) translateY(-14px)`,animation:`twinkle ${2+i*0.3}s ease-in-out infinite`}} />
              ))}
            </div>
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/20">
                <Clock className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <h2 className="mb-1 text-center text-2xl font-bold text-foreground">Prayer Settings</h2>
            <p className="mb-5 text-center text-sm text-muted-foreground">Choose the method used in your community</p>

            {/* Location Detection */}
            <div className="mb-4 rounded-2xl border border-border bg-card/50 p-4">
              {locationStatus === 'idle' && (
                <>
                  <p className="text-xs text-muted-foreground mb-3">Let us recommend the best prayer settings for your location.</p>
                  <button
                    onClick={handleDetectLocation}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-2.5 text-sm font-semibold text-emerald-400 active:scale-95 transition-transform"
                  >
                    <MapPin className="h-4 w-4" /> Detect My Location
                  </button>
                </>
              )}
              {locationStatus === 'detecting' && (
                <div className="flex items-center gap-3 py-1">
                  <div className="h-4 w-4 shrink-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                  <p className="text-xs text-muted-foreground">Detecting your location...</p>
                </div>
              )}
              {locationStatus === 'detected' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                    <p className="text-sm font-bold text-foreground">{detectedCity}, {detectedCountry}</p>
                  </div>
                  <p className="text-xs text-emerald-400 font-medium">✓ Recommended: {recommendedMethodLabel}</p>
                  <p className="text-[11px] text-muted-foreground/80">{recommendedMethodReason}. Pre-selected below — you can still change it.</p>
                </div>
              )}
              {locationStatus === 'error' && (
                <p className="text-xs text-muted-foreground/80">⚠️ Location unavailable. Please select your calculation method manually below.</p>
              )}
            </div>

            {/* Method */}
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
              Calculation Method
            </label>
            <p className="mb-2 text-[11px] text-muted-foreground/80">
              {locationStatus === 'detected'
                ? `We recommend ${recommendedMethodLabel} for your area. Change if needed.`
                : 'Most Guyanese Masjids use Standard (MWL) — already selected for you.'}
            </p>
            <div className="mb-4 max-h-[180px] overflow-y-auto rounded-2xl border border-border bg-card">
              {CALCULATION_METHODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all first:rounded-t-2xl last:rounded-b-2xl not-last:border-b not-last:border-border/50 ${
                    method === m.key ? 'bg-emerald-500/10 text-emerald-400' : 'text-muted-foreground active:bg-white/5'
                  }`}
                >
                  {method === m.key && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                  {method !== m.key && <span className="h-3.5 w-3.5 shrink-0" />}
                  <div className="min-w-0">
                    <span className="block text-sm">{m.label}</span>
                    {m.note && <span className="block text-[10px] text-muted-foreground/80 mt-0.5">{m.note}</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* Asr Calculation */}
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
              Asr Prayer Time
            </label>
            <p className="mb-3 text-[11px] text-muted-foreground/80">Different communities pray Asr at slightly different times. Choose what your local masjid follows.</p>
            <div className="flex gap-3">
              {MADHABS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMadhab(m.key)}
                  className={`flex-1 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                    madhab === m.key
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-border bg-card text-muted-foreground active:bg-secondary'
                  }`}
                >
                  <span className="block text-sm font-semibold">{m.label}</span>
                  <span className="block mt-0.5 text-[10px] text-muted-foreground/80">
                    {m.key === 'Hanafi' ? 'Later Asr' : 'Standard Asr (earlier)'}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-3 text-center text-[11px] text-muted-foreground/60">
              You can change these anytime in Settings
            </p>
          </div>
        )}

        {/* ── Step: Ramadan ────────────────────────────────── */}
        {currentStepKey === 'ramadan' && (
          <div className="relative flex flex-1 flex-col px-5 pt-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {/* Large crescent */}
              <div className="absolute right-4 top-4 text-6xl text-orange-500/15" style={{animation:'float-crescent 5s ease-in-out infinite'}}>☽</div>
              {/* Stars around it */}
              {[[75,8],[85,18],[68,22],[82,30]].map(([x,y],i)=>(
                <div key={i} className="absolute text-xs text-orange-400/25"
                  style={{left:`${x}%`,top:`${y}%`,animation:`twinkle ${1.5+i*0.5}s ease-in-out infinite`,animationDelay:`${i*0.4}s`}}>✦</div>
              ))}
              {/* Lantern glow bottom-left */}
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl" />
            </div>
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 ring-1 ring-orange-500/20">
                <Moon className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <h2 className="mb-1 text-center text-2xl font-bold text-foreground">Ramadan Mubarak 🌙</h2>
            <p className="mb-5 text-center text-sm text-muted-foreground">
              Which moon sighting do you follow for Ramadan?
            </p>

            <div className="space-y-3">
              {RAMADAN_OPTIONS.map((opt) => (
                <button
                  key={opt.moonKey}
                  onClick={() => setRamadanStart(opt.moonKey)}
                  className={`w-full flex items-start gap-3 rounded-2xl border-2 px-4 py-4 text-left transition-all ${
                    ramadanStart === opt.moonKey
                      ? 'border-orange-500/40 bg-orange-500/10'
                      : 'border-border bg-card active:bg-secondary'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      ramadanStart === opt.moonKey ? 'border-orange-400' : 'border-gray-600'
                    }`}
                  >
                    {ramadanStart === opt.moonKey && (
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                    )}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${ramadanStart === opt.moonKey ? 'text-orange-300' : 'text-foreground/80'}`}>
                      {opt.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/80">{opt.note}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card/60 px-4 py-3 space-y-2">
              <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                GIT (Guyana Islamic Trust), CIOG, and the Central Moon Sighting Committee are separate organisations. All three follow the local Guyanese regional moon sighting and typically announce the same start date.
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                This setting affects Iftaar times, Ramadan day count, and fasting tracker. You can change it anytime under Settings.
              </p>
            </div>
          </div>
        )}

        {/* ── Step: Notifications ────────────────────────────── */}
        {currentStepKey === 'notifications' && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center space-y-6">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-amber-500/10 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                <Bell className="h-10 w-10 text-amber-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">Never Miss Salah</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Get notified at each of the 5 prayer times — Fajr, Dhuhr, Asr, Maghrib, and Isha.
                {showRamadanStep ? ' Plus Suhoor and Iftaar reminders during Ramadan.' : ''}
              </p>
            </div>

            {/* Preview cards */}
            <div className="w-full space-y-2 text-left">
              {[
                { prayer: 'Fajr', time: '5:12 AM', icon: '🌅' },
                { prayer: 'Dhuhr', time: '12:08 PM', icon: '☀️' },
                { prayer: 'Maghrib', time: '6:21 PM', icon: '🌇' },
              ].map(p => (
                <div key={p.prayer} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                  <span className="text-lg">{p.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">{p.prayer} · {p.time}</p>
                    <p className="text-[10px] text-muted-foreground/80">Time to pray</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Enable button or granted state */}
            {isPushSupported() ? (
              <div className="w-full space-y-2">
                <button
                  onClick={requestNotifications}
                  className={`w-full rounded-2xl py-4 text-sm font-bold transition-all active:scale-95 ${
                    notifGranted
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500 text-foreground shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {notifGranted ? '✓ Notifications Enabled' : '🔔 Enable Prayer Notifications'}
                </button>
                {!notifGranted && (
                  <button onClick={next} className="w-full py-2 text-xs text-muted-foreground/60 underline underline-offset-2">
                    Skip for now
                  </button>
                )}
                {notifGranted && (
                  <p className="text-xs text-muted-foreground/80">You can customise which prayers in Settings → Notifications</p>
                )}
              </div>
            ) : (
              <div className="w-full rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground/80">Notifications not available in this browser. Use the installed app for prayer reminders.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Step: Install ─────────────────────────────────── */}
        {currentStepKey === 'install' && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center space-y-5">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-teal-500/10 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/20">
                <Smartphone className="h-10 w-10 text-teal-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">Add to Home Screen</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Install MasjidConnect GY as an app for instant access — no App Store needed.
                Works offline, loads faster, feels native.
              </p>
            </div>

            {/* Already standalone */}
            {isStandalone() ? (
              <div className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-sm font-bold text-emerald-400">✓ Already installed!</p>
                <p className="text-xs text-muted-foreground/80 mt-0.5">You are running the installed app.</p>
              </div>
            ) : isIOS() ? (
              /* iOS instructions */
              <div className="w-full rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 text-left space-y-3">
                {[
                  { n: '1', icon: '📤', text: 'Tap the Share button', sub: 'At the bottom of your Safari browser' },
                  { n: '2', icon: '➕', text: 'Tap "Add to Home Screen"', sub: 'Scroll down in the share sheet' },
                  { n: '3', icon: '✅', text: 'Tap "Add" to confirm', sub: 'The app will appear on your Home Screen' },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-2.5">
                    <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-foreground text-[10px] font-bold">{s.n}</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{s.icon} {s.text}</p>
                      <p className="text-[10px] text-teal-400/60">{s.sub}</p>
                    </div>
                  </div>
                ))}
                <p className="pt-1 text-[10px] text-muted-foreground/70">
                  ⚠️ Must be opened in <strong className="text-muted-foreground">Safari</strong> — Chrome on iPhone cannot install apps.
                </p>
              </div>
            ) : deferredPrompt ? (
              /* Android / Desktop install */
              <div className="w-full space-y-2">
                <button
                  onClick={triggerInstall}
                  disabled={pwaInstalled}
                  className={`w-full rounded-2xl py-4 text-sm font-bold transition-all active:scale-95 ${
                    pwaInstalled
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-teal-500 text-foreground shadow-lg shadow-teal-500/20'
                  }`}
                >
                  {pwaInstalled ? '✓ App Installed' : '📲 Install App Now'}
                </button>
                {pwaInstalled && (
                  <p className="text-xs text-muted-foreground/80">Open it from your Home Screen for the best experience.</p>
                )}
              </div>
            ) : (
              /* No prompt available */
              <div className="w-full rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground/80">Install prompt not available right now. You can install later from your browser menu.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Step: Theme ──────────────────────────────────── */}
        {currentStepKey === 'theme' && (
          <div className="relative flex flex-1 flex-col px-5 pt-6">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15 ring-1 ring-purple-500/20">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <h2 className="mb-1 text-center text-2xl font-bold text-foreground">Choose Your Theme</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">Pick the look that feels right for you. You can change this anytime in Settings.</p>

            <div className="space-y-3">
              {/* Dark theme option */}
              <button
                onClick={() => pickTheme('dark')}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                  selectedTheme === 'dark'
                    ? 'border-emerald-500/60 bg-emerald-500/10'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Dark preview */}
                  <div className="flex h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-background border border-border">
                    <div className="flex flex-col justify-between p-2 w-full">
                      <div className="h-1.5 w-10 rounded-full bg-emerald-500/60" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded-full bg-muted" />
                        <div className="h-1 w-3/4 rounded-full bg-muted" />
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3].map(i => <div key={i} className="h-3 flex-1 rounded bg-secondary" />)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">Dark</p>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Default</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">Easy on the eyes at night. Ideal for night prayers and late Quran reading.</p>
                  </div>
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selectedTheme === 'dark' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'}`}>
                    {selectedTheme === 'dark' && <Check className="h-3 w-3 text-foreground" />}
                  </div>
                </div>
              </button>

              {/* Light theme option */}
              <button
                onClick={() => pickTheme('light')}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98] ${
                  selectedTheme === 'light'
                    ? 'border-emerald-500/60 bg-emerald-500/10'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Light preview */}
                  <div className="flex h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f0] border border-gray-200">
                    <div className="flex flex-col justify-between p-2 w-full">
                      <div className="h-1.5 w-10 rounded-full bg-emerald-500/80" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded-full bg-gray-200" />
                        <div className="h-1 w-3/4 rounded-full bg-gray-200" />
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3].map(i => <div key={i} className="h-3 flex-1 rounded bg-white border border-gray-100" />)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">Light</p>
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-400">New</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">Clean and bright. Great for daytime use and outdoor reading.</p>
                  </div>
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selectedTheme === 'light' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'}`}>
                    {selectedTheme === 'light' && <Check className="h-3 w-3 text-foreground" />}
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── Step: Done ───────────────────────────────────── */}
        {currentStepKey === 'done' && (
          <div className="relative flex flex-1 flex-col px-6 pt-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {/* Confetti sparkles */}
              {[
                {x:10,y:10,delay:0,color:'bg-emerald-400/30'},
                {x:85,y:15,delay:0.3,color:'bg-teal-400/30'},
                {x:20,y:80,delay:0.6,color:'bg-amber-400/30'},
                {x:80,y:70,delay:0.9,color:'bg-emerald-400/25'},
                {x:50,y:5,delay:0.2,color:'bg-teal-400/25'},
                {x:15,y:45,delay:0.7,color:'bg-amber-400/20'},
                {x:88,y:45,delay:0.4,color:'bg-emerald-400/20'},
              ].map((dot,i)=>(
                <div key={i} className={`absolute h-2 w-2 rounded-full ${dot.color}`}
                  style={{left:`${dot.x}%`,top:`${dot.y}%`,animation:`confetti-fall 3s ease-in-out infinite`,animationDelay:`${dot.delay}s`}} />
              ))}
              {/* Radial glow behind CTA */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
            </div>

            {/* Completion CTA */}
            <div className="flex flex-1 flex-col items-center justify-center pb-4">
              <div className="relative mb-4">
                <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-2xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Sparkles className="h-8 w-8 text-foreground" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {name ? `Bismillah, ${name}!` : "Bismillah — Let's Begin!"}
              </h2>
              <div className="mt-4 w-full max-w-xs space-y-1.5 text-left">
                {[
                  'Track all 5 Fard prayers + Sunnah & Nawafil',
                  'Build streaks and earn points (Tahajjud = 100 pts, Witr = 50 pts)',
                  'Add Faith Buddies by @username or phone number',
                  'Listen to 80+ lectures from world-renowned scholars',
                  'Explore Noorani Qaida, 25 Prophets, Seerah, and Adab',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 w-full max-w-xs mb-4">
                {[
                  { label: '\uD83C\uDFA7 Lectures', href: '/explore/lectures' },
                  { label: '\uD83D\uDCD6 Quran', href: '/quran' },
                  { label: '\uD83D\uDD4C Masjids', href: '/masjids' },
                  { label: '\uD83E\uDD32 Duas', href: '/explore/duas' },
                ].map(item => (
                  <button key={item.href} onClick={() => { finish(); router.push(item.href) }}
                    className="rounded-xl border border-border bg-card/60 py-2.5 text-xs font-medium text-muted-foreground active:bg-secondary">
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-center text-[10px] text-muted-foreground/60 mb-3">Jump straight to what matters</p>

              <button
                onClick={() => {
                  setItem(KEYS.TOUR_PENDING, true)
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event(TOUR_START_EVENT))
                  }
                  finish()
                }}
                className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-foreground shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
              >
                Take the App Tour 🧭
              </button>
              <button
                onClick={finish}
                className="mt-2 text-xs text-muted-foreground/80 active:text-muted-foreground"
              >
                Skip — go straight in
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      {currentStepKey !== 'done' && (
        <div className="relative flex items-center justify-between px-6 pb-10 pt-4">
          <button
            onClick={prev}
            disabled={step === 0}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
              step === 0 ? 'opacity-0 pointer-events-none' : 'bg-secondary text-muted-foreground active:bg-muted'
            }`}
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3.5 text-sm font-bold text-foreground shadow-lg shadow-emerald-500/20 transition-all active:scale-95 active:bg-emerald-600"
          >
            {step === 0 ? 'Get Started' : 'Continue'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
