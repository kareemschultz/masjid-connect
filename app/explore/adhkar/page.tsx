'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const CATEGORIES = ['Morning', 'Evening', 'Sleep'] as const

const ADHKAR = {
  Morning: [
    { arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', transliteration: 'Asbahna wa asbahal mulku lillah', meaning: 'We have entered morning and the dominion belongs to Allah', repeat: 1 },
    { arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا', transliteration: 'Allahumma bika asbahna wa bika amsayna', meaning: 'O Allah, by You we enter the morning and by You we enter the evening', repeat: 1 },
    { arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', transliteration: 'SubhanAllahi wa bihamdihi', meaning: 'Glory and praise be to Allah', repeat: 100 },
    { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', transliteration: 'La ilaha illallahu wahdahu la shareeka lah', meaning: 'None has the right to be worshipped but Allah alone, having no partner', repeat: 10 },
  ],
  Evening: [
    { arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', transliteration: 'Amsayna wa amsal mulku lillah', meaning: 'We have entered evening and the dominion belongs to Allah', repeat: 1 },
    { arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq', meaning: 'I seek refuge in the perfect words of Allah from the evil of what He has created', repeat: 3 },
    { arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ', transliteration: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'un', meaning: 'In the Name of Allah, with Whose Name nothing can harm', repeat: 3 },
  ],
  Sleep: [
    { arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', transliteration: 'Bismika Allahumma amutu wa ahya', meaning: 'In Your name, O Allah, I die and I live', repeat: 1 },
    { arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', meaning: 'Glory be to Allah', repeat: 33 },
    { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', meaning: 'All praise is due to Allah', repeat: 33 },
    { arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah is the Greatest', repeat: 34 },
  ],
}

export default function AdhkarPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Morning')
  const [counts, setCounts] = useState<Record<string, number>>({})

  const handleCount = (key: string, max: number) => {
    const current = counts[key] || 0
    if (current < max) {
      setCounts({ ...counts, [key]: current + 1 })
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Star}
        title="Adhkar"
        subtitle="Remembrance of Allah"
        gradient="from-amber-900 to-yellow-900"
        showBack
      
        heroTheme="tasbih"
      />

      {/* Category tabs */}
      <div className="flex gap-2 px-4 pt-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setCounts({}) }}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
              category === cat
                ? 'bg-amber-500 text-foreground'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reset & Progress */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="text-xs text-muted-foreground">
          {ADHKAR[category].filter((_, i) => (counts[`${category}-${i}`] || 0) >= ADHKAR[category][i].repeat).length}/{ADHKAR[category].length} complete
        </div>
        <button
          onClick={() => setCounts({})}
          className="rounded-lg bg-secondary px-3 py-1.5 text-[11px] font-medium text-muted-foreground active:bg-muted transition-all"
        >
          Reset All
        </button>
      </div>

      {/* Adhkar list */}
      <div className="space-y-3 px-4 pt-4 animate-stagger">
        {ADHKAR[category].map((dhikr, i) => {
          const key = `${category}-${i}`
          const current = counts[key] || 0
          const done = current >= dhikr.repeat

          return (
            <button
              key={key}
              onClick={() => handleCount(key, dhikr.repeat)}
              disabled={done}
              className={`w-full rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
                done
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-border bg-card'
              }`}
            >
              <p className="text-right font-arabic text-xl leading-loose text-foreground" dir="rtl">
                {dhikr.arabic}
              </p>
              <p className="mt-2 text-xs font-medium text-amber-400">{dhikr.transliteration}</p>
              <p className="mt-1 text-xs text-muted-foreground">{dhikr.meaning}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs font-bold ${done ? 'text-emerald-400' : 'text-muted-foreground/80'}`}>
                  {done ? '✓ ' : ''}{current} / {dhikr.repeat}
                </span>
                <div className="h-1 w-24 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-200"
                    style={{ width: `${(current / dhikr.repeat) * 100}%` }}
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Completion banner */}
      {ADHKAR[category].every((dhikr, i) => (counts[`${category}-${i}`] || 0) >= dhikr.repeat) && (
        <div className="mx-4 mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
          <p className="text-lg mb-1">✅</p>
          <p className="text-sm font-bold text-emerald-400">{category} Adhkar Complete!</p>
          <p className="text-xs text-emerald-400/70 mt-1">May Allah accept your remembrance</p>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
