'use client'

import { useState, useEffect } from 'react'
import { Circle, RotateCcw } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem, KEYS } from '@/lib/storage'

const TARGETS = [33, 99, 100, 500, 1000]

const PHRASES = [
  { arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah' },
  { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', meaning: 'All praise is due to Allah' },
  { arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest' },
  { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', meaning: 'There is no god but Allah' },
  { arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', meaning: 'I seek forgiveness from Allah' },
]

export default function TasbihPage() {
  const [count, setCount] = useState(0)
  const [target, setTarget] = useState(33)
  const [phraseIdx, setPhraseIdx] = useState(0)

  useEffect(() => {
    setCount(getItem(KEYS.TASBIH_COUNT, 0))
  }, [])

  const [pulse, setPulse] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState(false)

  const handleTap = () => {
    const newCount = count + 1
    setCount(newCount)
    setItem(KEYS.TASBIH_COUNT, newCount)

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (newCount % target === 0) {
        navigator.vibrate([50, 30, 50, 30, 100]) // celebration pattern
        setMilestoneReached(true)
        setTimeout(() => setMilestoneReached(false), 2000)
      } else {
        navigator.vibrate(15)
      }
    }

    // Visual pulse
    setPulse(true)
    setTimeout(() => setPulse(false), 150)
  }

  const reset = () => {
    setCount(0)
    setItem(KEYS.TASBIH_COUNT, 0)
  }

  const progress = Math.min((count % target) / target * 100, 100)
  const phrase = PHRASES[phraseIdx]

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={Circle}
        title="Tasbih"
        subtitle="Digital Counter"
        gradient="from-emerald-900 to-teal-900"
        showBack
      />

      <div className="flex flex-col items-center px-4 pt-8">
        {/* Phrase selector */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {PHRASES.map((p, i) => (
            <button
              key={i}
              onClick={() => setPhraseIdx(i)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                phraseIdx === i ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {p.transliteration}
            </button>
          ))}
        </div>

        {/* Arabic phrase */}
        <p className="font-arabic text-3xl text-foreground">{phrase.arabic}</p>
        <p className="mt-1 text-xs text-gray-400">{phrase.meaning}</p>

        {/* Circular counter */}
        <div className="relative mt-10 flex h-52 w-52 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="4" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray={`${progress * 2.83}, 283`}
              strokeLinecap="round"
              className="transition-all duration-200"
            />
          </svg>
          <button
            onClick={handleTap}
            className={`flex h-40 w-40 items-center justify-center rounded-full bg-gray-900 border-2 text-5xl font-bold text-foreground transition-all active:scale-95 ${
              pulse ? 'scale-105 border-emerald-500' : 'border-gray-800'
            } ${milestoneReached ? 'ring-4 ring-emerald-500/40' : ''}`}
            aria-label="Count"
          >
            {count}
          </button>
          {milestoneReached && (
            <div className="absolute -bottom-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white animate-bounce">
              Target reached!
            </div>
          )}
        </div>

        {/* Target selector */}
        <div className="mt-8 flex gap-2">
          {TARGETS.map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                target === t ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={reset}
          className="mt-6 flex items-center gap-2 rounded-xl bg-gray-800 px-6 py-3 text-sm font-medium text-gray-300 transition-colors active:bg-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
