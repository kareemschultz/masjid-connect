'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  BookOpen, MapPin, Clock, Users, ChevronRight, ChevronLeft, Sparkles
} from 'lucide-react'
import { setItem, KEYS } from '@/lib/storage'
import { CALCULATION_METHODS, MADHABS } from '@/lib/prayer-times'

const STEPS = [
  { key: 'welcome', title: 'Welcome', subtitle: 'Assalamu Alaikum' },
  { key: 'name', title: 'Your Name', subtitle: 'How should we greet you?' },
  { key: 'prayer', title: 'Prayer Settings', subtitle: 'Configure your calculations' },
  { key: 'features', title: 'Discover', subtitle: 'What you can do' },
  { key: 'ready', title: 'All Set', subtitle: 'Bismillah, let us begin' },
]

const FEATURES = [
  { icon: Clock, label: 'Prayer Times', desc: 'Accurate times for Georgetown, Guyana with countdown & adhan notifications', color: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
  { icon: BookOpen, label: 'Quran Reader', desc: 'Full Quran with Arabic, translation, audio, and Hifz memorization mode', color: 'bg-purple-500/20', iconColor: 'text-purple-400' },
  { icon: MapPin, label: 'Masjid Finder', desc: 'Directory of Georgetown masjids with directions & prayer schedules', color: 'bg-teal-500/20', iconColor: 'text-teal-400' },
  { icon: Users, label: 'Faith Buddies', desc: 'Connect with friends, share streaks, and grow together in faith', color: 'bg-blue-500/20', iconColor: 'text-blue-400' },
]

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [method, setMethod] = useState('Egyptian')
  const [madhab, setMadhab] = useState('Shafi')

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      finish()
    }
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  const finish = () => {
    if (name.trim()) setItem(KEYS.USERNAME, name.trim())
    setItem(KEYS.CALCULATION_METHOD, method)
    setItem(KEYS.MADHAB, madhab)
    setItem(KEYS.ONBOARDING_COMPLETE, true)
    onComplete()
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-background">
      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-1.5 pt-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-6 bg-emerald-400' : i < step ? 'w-1.5 bg-emerald-600' : 'w-1.5 bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center px-8">
            <div className="relative mb-8">
              <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-2xl" />
              <Image
                src="/images/logo.jpg"
                alt="MasjidConnect GY"
                width={120}
                height={120}
                className="relative rounded-3xl shadow-2xl shadow-emerald-500/10"
              />
            </div>
            <h1 className="text-center text-3xl font-bold text-foreground">
              Assalamu Alaikum
            </h1>
            <p className="mt-2 text-center text-lg text-emerald-400">
              Welcome to MasjidConnect GY
            </p>
            <p className="mt-4 max-w-xs text-center text-sm leading-relaxed text-gray-400">
              Your daily Islamic companion, built by your community. Independent. No ads. No data collection. Just faith.
            </p>
          </div>
        )}

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="flex flex-1 flex-col items-center justify-center px-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15">
              <Sparkles className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              What should we call you?
            </h2>
            <p className="mt-2 mb-8 text-center text-sm text-gray-400">
              This helps personalize your experience
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full max-w-xs rounded-2xl border border-gray-800 bg-gray-900 px-5 py-4 text-center text-lg text-foreground placeholder-gray-600 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              autoFocus
            />
            <button
              onClick={next}
              className="mt-4 text-sm text-gray-500 active:text-gray-400"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 2: Prayer Settings */}
        {step === 2 && (
          <div className="flex flex-1 flex-col px-6 pt-8">
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
                <Clock className="h-7 w-7 text-emerald-400" />
              </div>
            </div>
            <h2 className="mb-1 text-center text-2xl font-bold text-foreground">
              Prayer Calculation
            </h2>
            <p className="mb-6 text-center text-sm text-gray-400">
              Choose the method used in your community
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Calculation Method
                </label>
                <div className="max-h-44 space-y-1.5 overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 p-2">
                  {CALCULATION_METHODS.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMethod(m.key)}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-all ${
                        method === m.key
                          ? 'bg-emerald-500/10 font-medium text-emerald-400'
                          : 'text-gray-300 active:bg-white/5'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Madhab (Asr Calculation)
                </label>
                <div className="flex gap-3">
                  {MADHABS.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMadhab(m.key)}
                      className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                        madhab === m.key
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-gray-800 bg-gray-900 text-gray-400'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Feature Discovery */}
        {step === 3 && (
          <div className="flex flex-1 flex-col px-6 pt-8">
            <h2 className="mb-1 text-center text-2xl font-bold text-foreground">
              Everything You Need
            </h2>
            <p className="mb-8 text-center text-sm text-gray-400">
              Your complete Islamic companion
            </p>

            <div className="space-y-3">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${f.color}`}>
                    <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{f.label}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Ready */}
        {step === 4 && (
          <div className="flex flex-1 flex-col items-center justify-center px-8">
            <div className="relative mb-8">
              <div className="absolute -inset-6 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {"You're All Set!"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              {name ? `Welcome, ${name}. ` : ''}May your journey with MasjidConnect GY be blessed. Bismillah.
            </p>

            <button
              onClick={finish}
              className="mt-10 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              Get Started
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      {step < 4 && (
        <div className="flex items-center justify-between px-6 pb-10 pt-4">
          <button
            onClick={prev}
            disabled={step === 0}
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
              step === 0 ? 'opacity-0' : 'bg-gray-800 text-gray-300 active:bg-gray-700'
            }`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white transition-all active:scale-95 active:bg-emerald-600"
          >
            {step === 0 ? 'Get Started' : 'Continue'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
