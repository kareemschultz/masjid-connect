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

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingWizardProps {
  onComplete: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 6

const FEATURES = [
  {
    emoji: '\uD83D\uDD4C',
    label: 'Prayer Times',
    desc: 'Accurate times for Georgetown, Guyana',
    color: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    emoji: '\uD83D\uDCD6',
    label: 'Quran',
    desc: "Mus'haf, recitation with 12 reciters, Hifz mode",
    color: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  {
    emoji: '\uD83C\uDF19',
    label: 'Ramadan',
    desc: 'Suhoor/Iftaar countdowns, Fasting Tracker',
    color: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    border: 'border-orange-500/20',
  },
  {
    emoji: '\uD83C\uDFA7',
    label: 'Lectures',
    desc: 'Anwar al-Awlaki, Hamza Yusuf, Bilal Philips, Yasmin Mogahed',
    color: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
    border: 'border-teal-500/20',
  },
  {
    emoji: '\uD83D\uDD4C',
    label: 'Masjids',
    desc: '20+ masjids across Guyana, Jumu\'ah prep',
    color: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  {
    emoji: '\uD83D\uDCFF',
    label: 'Community',
    desc: 'Dua Board, Khatam Collective, Buddy System',
    color: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    border: 'border-amber-500/20',
  },
]

const RAMADAN_OPTIONS = [
  {
    value: '2026-03-01',
    label: 'Saudi / International Sighting',
    note: 'Follows Saudi Arabia\u2019s official moon sighting announcement',
    moonKey: 'saudi',
  },
  {
    value: '2026-03-01',
    label: 'CIOG / Central Sighting Committee',
    note: 'Follows the Guyanese moon sighting (CIOG & Central Moon Sighting Committee)',
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
              : 'w-1.5 bg-gray-700'
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
  const [method, setMethod] = useState('Egyptian')
  const [madhab, setMadhab] = useState('Shafi')
  const [ramadanStart, setRamadanStart] = useState('ciog')
  const [notifGranted, setNotifGranted] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [pwaInstalled, setPwaInstalled] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const showRamadanStep = isNearRamadan()

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
      setItem('ramadan_start', selectedOption?.value || '2026-03-01')
      setItem('moon_sighting', ramadanStart)
      setItem('ramadan_start_prompted', true)
    }
    setItem(KEYS.ONBOARDING_COMPLETE, true)
    onComplete()
  }

  // Effective step count (exclude Ramadan step if not needed)
  const steps = [
    'welcome',
    'features',
    'name',
    'prayer',
    ...(showRamadanStep ? ['ramadan'] : []),
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

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#0a0b14]">
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between px-6 pt-4">
        <StepDots step={step} total={totalSteps} />
        <span className="text-xs text-gray-600">{step + 1}/{totalSteps}</span>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-y-auto">

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
            <h1 className="mb-1 text-center text-3xl font-bold text-white">Assalamu Alaikum</h1>
            <p className="mb-1 text-center text-base font-medium text-emerald-400">Welcome to MasjidConnect GY</p>

            {/* Community Card */}
            <div className="mt-5 w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-emerald-400">Community-Built</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-300">
                This app was built by and for the Guyanese Muslim community — completely free, no ads, no tracking, no subscriptions. Just a tool for the ummah.
              </p>
            </div>

            {/* Community stats hint */}
            <div className="mt-3 w-full rounded-2xl border border-gray-800 bg-gray-900/60 px-5 py-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
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
              className="mt-4 flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-5 py-2.5 text-xs font-medium text-gray-300 transition-all active:bg-gray-800"
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
            <h2 className="mb-1 text-center text-2xl font-bold text-white">How It Works</h2>
            <p className="mb-5 text-center text-sm text-gray-400">
              Six powerful tools to strengthen your daily practice
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
                  <p className="text-[10px] leading-relaxed text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Community call-to-action */}
            <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-900/60 px-4 py-3 text-center">
              <p className="text-xs text-gray-400">
                🌙 <span className="font-semibold text-gray-300">Community-powered</span> — Iftaar Reports are submitted live by fellow Muslims. You can contribute too.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: Your Name ────────────────────────────── */}
        {currentStepKey === 'name' && (
          <div className="relative flex flex-1 flex-col items-center justify-center px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {/* Soft amber glints */}
              {[[20,25],[75,20],[15,70],[80,60],[50,85]].map(([x,y],i)=>(
                <div key={i} className="absolute h-1.5 w-1.5 rounded-full bg-amber-400/30"
                  style={{left:`${x}%`,top:`${y}%`,animation:`gentle-pulse ${2+i*0.5}s ease-in-out infinite`,animationDelay:`${i*0.4}s`}} />
              ))}
              {/* Subtle sparkle lines */}
              <div className="absolute top-16 left-8 h-px w-12 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" style={{animation:'float-up 3s ease-in-out infinite'}} />
              <div className="absolute bottom-20 right-10 h-px w-8 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" style={{animation:'float-up 3.5s ease-in-out infinite',animationDelay:'1s'}} />
            </div>
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 ring-1 ring-amber-500/20">
              <Sparkles className="h-7 w-7 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">What should we call you?</h2>
            <p className="mt-2 mb-6 text-center text-sm text-gray-400">
              This personalises your experience across the app
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && next()}
              placeholder="Your name or kunya"
              className="w-full max-w-xs rounded-2xl border border-gray-800 bg-gray-900 px-5 py-4 text-center text-lg text-white placeholder-gray-600 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              autoFocus
            />
            <button onClick={next} className="mt-5 text-sm text-gray-500 underline underline-offset-4 active:text-gray-400">
              Skip for now
            </button>

            <div className="mt-6 w-full max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gray-800" />
                <span className="text-xs text-gray-600">or</span>
                <div className="h-px flex-1 bg-gray-800" />
              </div>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-700 bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition-all active:bg-gray-800 disabled:opacity-50"
              >
                {signingIn ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
                ) : (
                  <GoogleIcon />
                )}
                {signingIn ? 'Redirecting to Google...' : 'Continue with Google'}
              </button>
              <p className="mt-2 text-center text-[10px] text-gray-600">
                Sign in to sync your tracker and streaks across devices
              </p>
            </div>

            {/* Data note */}
            <p className="mt-4 max-w-xs text-center text-[11px] text-gray-600">
              Your name is stored only on this device. No personal data is ever sent to a server without your consent.
            </p>
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
            <h2 className="mb-1 text-center text-2xl font-bold text-white">Prayer Settings</h2>
            <p className="mb-5 text-center text-sm text-gray-400">Choose the method used in your community</p>

            {/* Method */}
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Calculation Method
            </label>
            <p className="mb-2 text-[11px] text-gray-500">These affect only Fajr and Isha times. For most of Guyana, Egyptian General Authority or Muslim World League work well.</p>
            <div className="mb-4 max-h-[180px] overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900">
              {CALCULATION_METHODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-all first:rounded-t-2xl last:rounded-b-2xl not-last:border-b not-last:border-gray-800/50 ${
                    method === m.key ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300 active:bg-white/5'
                  }`}
                >
                  {method === m.key && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                  {method !== m.key && <span className="h-3.5 w-3.5 shrink-0" />}
                  {m.label}
                </button>
              ))}
            </div>

            {/* Madhab */}
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Asr Prayer Time
            </label>
            <p className="mb-3 text-[11px] text-gray-500">Different communities pray Asr at slightly different times. Choose what your local masjid follows.</p>
            <div className="flex gap-3">
              {MADHABS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMadhab(m.key)}
                  className={`flex-1 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                    madhab === m.key
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-gray-800 bg-gray-900 text-gray-400 active:bg-gray-800'
                  }`}
                >
                  <span className="block text-sm font-semibold">{m.label}</span>
                  <span className="block mt-0.5 text-[10px] text-gray-500">
                    {m.key === 'Hanafi' ? 'Later Asr' : 'Standard Asr (earlier)'}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-3 text-center text-[11px] text-gray-600">
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
            <h2 className="mb-1 text-center text-2xl font-bold text-white">Ramadan Mubarak 🌙</h2>
            <p className="mb-5 text-center text-sm text-gray-400">
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
                      : 'border-gray-800 bg-gray-900 active:bg-gray-800'
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
                    <p className={`text-sm font-semibold ${ramadanStart === opt.moonKey ? 'text-orange-300' : 'text-gray-200'}`}>
                      {opt.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500">{opt.note}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-900/60 px-4 py-3 space-y-2">
              <p className="text-[11px] leading-relaxed text-gray-500">
                Both CIOG and the Central Moon Sighting Committee typically announce the same date for Guyana.
              </p>
              <p className="text-[11px] leading-relaxed text-gray-500">
                This setting affects Iftaar times, Ramadan day count, and fasting tracker. You can change it anytime under Settings.
              </p>
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
            {/* Notification & Install */}
            <div className="space-y-3 mb-5">
              {/* Push Notifications */}
              {isPushSupported() && (
                <div className="rounded-2xl border border-gray-800 bg-gray-900 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
                      <Bell className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">Adhan Notifications</p>
                      <p className="mt-0.5 text-xs text-gray-400">Get notified at each prayer time</p>
                    </div>
                    <button
                      onClick={requestNotifications}
                      className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        notifGranted
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500 text-white active:bg-amber-600'
                      }`}
                    >
                      {notifGranted ? '✓ Enabled' : 'Enable'}
                    </button>
                  </div>
                </div>
              )}

              {/* PWA Install */}
              {!isStandalone() && (deferredPrompt || isIOS()) && (
                <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 px-5 py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/15">
                      <Smartphone className="h-5 w-5 text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">Install App</p>
                      <p className="mt-0.5 text-xs text-teal-400/70">Add to your Home Screen for the best experience</p>
                    </div>
                    {!isIOS() && (
                      <button
                        onClick={triggerInstall}
                        disabled={pwaInstalled}
                        className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                          pwaInstalled
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-teal-500 text-white active:bg-teal-600'
                        }`}
                      >
                        {pwaInstalled ? '✓ Installed' : 'Install'}
                      </button>
                    )}
                  </div>
                  {isIOS() && (
                    <div className="space-y-2.5">
                      {[
                        { n: '1', text: 'Tap the Share button', sub: '📤 at the bottom of your Safari screen' },
                        { n: '2', text: 'Scroll and tap "Add to Home Screen"', sub: 'Look for the icon with a plus sign' },
                        { n: '3', text: 'Tap "Add" in the top right', sub: 'The app will appear on your Home Screen' },
                      ].map(s => (
                        <div key={s.n} className="flex items-start gap-2.5">
                          <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white text-[10px] font-bold mt-0.5">{s.n}</span>
                          <div>
                            <p className="text-xs font-semibold text-white">{s.text}</p>
                            <p className="text-[10px] text-teal-400/60">{s.sub}</p>
                          </div>
                        </div>
                      ))}
                      <p className="text-[10px] text-gray-600 pt-1">⚠️ Must be opened in <strong className="text-gray-500">Safari</strong> — Chrome on iPhone cannot install apps.</p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Completion CTA */}
            <div className="flex flex-col items-center pb-4">
              <div className="relative mb-4">
                <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-2xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">
                {name ? `Bismillah, ${name}!` : "Bismillah — Let's Begin!"}
              </h2>
              <p className="mt-2 max-w-xs text-center text-sm text-gray-400">
                MasjidConnect GY has prayer times, Quran, lectures from 5 scholars, 20+ Guyana masjids, Seerah, Islamic Names, and more — all built for the Guyanese Muslim community. May Allah accept it from us all.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 w-full max-w-xs mb-4">
                {[
                  { label: '\uD83C\uDFA7 Lectures', href: '/explore/lectures' },
                  { label: '\uD83D\uDCD6 Quran', href: '/quran' },
                  { label: '\uD83D\uDD4C Masjids', href: '/masjids' },
                  { label: '\uD83E\uDD32 Duas', href: '/explore/duas' },
                ].map(item => (
                  <button key={item.href} onClick={() => { finish(); router.push(item.href) }}
                    className="rounded-xl border border-gray-800 bg-gray-900/60 py-2.5 text-xs font-medium text-gray-300 active:bg-gray-800">
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-center text-[10px] text-gray-600 mb-3">Jump straight to what matters</p>

              <button
                onClick={finish}
                className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
              >
                Open MasjidConnect GY
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      {currentStepKey !== 'done' && (
        <div className="flex items-center justify-between px-6 pb-10 pt-4">
          <button
            onClick={prev}
            disabled={step === 0}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
              step === 0 ? 'opacity-0 pointer-events-none' : 'bg-gray-800 text-gray-300 active:bg-gray-700'
            }`}
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 active:bg-emerald-600"
          >
            {step === 0 ? 'Get Started' : 'Continue'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
