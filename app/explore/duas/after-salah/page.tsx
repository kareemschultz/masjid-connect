'use client'

import { useState, useCallback } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { HandHeart, Play, X, ChevronRight, Info, RotateCcw } from 'lucide-react'
import { POST_SALAH_ADHKAR, type PostSalahDhikr } from '@/lib/post-salah-adhkar'

type PrayerFilter = 'all' | 'fajr' | 'maghrib'

function getFilteredAdhkar(filter: PrayerFilter): (PostSalahDhikr & { displayCount: number })[] {
  return POST_SALAH_ADHKAR.map(d => {
    let displayCount = d.count
    if (filter === 'fajr' || filter === 'maghrib') {
      if (d.afterSpecificPrayer?.includes(filter) && d.fajrMaghribCount) {
        displayCount = d.fajrMaghribCount
      }
    }
    return { ...d, displayCount }
  })
}

// ─── Counter Mode ─────────────────────────────────────────────────────────────

function CounterMode({ adhkar, onExit }: { adhkar: (PostSalahDhikr & { displayCount: number })[]; onExit: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [count, setCount] = useState(0)

  const current = adhkar[currentIdx]
  const totalAdhkar = adhkar.length
  const isLast = currentIdx === totalAdhkar - 1
  const progress = ((currentIdx / totalAdhkar) * 100)

  const handleTap = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10)
    const next = count + 1
    if (next >= current.displayCount) {
      // Advance to next dhikr
      if (!isLast) {
        setCurrentIdx(i => i + 1)
        setCount(0)
      } else {
        // Completed all
        setCount(next)
      }
    } else {
      setCount(next)
    }
  }, [count, current.displayCount, isLast])

  const handleSkip = () => {
    if (!isLast) {
      setCurrentIdx(i => i + 1)
      setCount(0)
    }
  }

  const handleReset = () => {
    setCurrentIdx(0)
    setCount(0)
  }

  const completed = isLast && count >= current.displayCount

  return (
    <div className="fixed inset-0 z-[70] bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${completed ? 100 : progress + (count / current.displayCount) * (100 / totalAdhkar)}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2" style={{ paddingTop: 'max(1rem, calc(env(safe-area-inset-top) + 0.5rem))' }}>
        <button onClick={onExit} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-muted-foreground active:scale-90 transition-transform">
          <X className="h-5 w-5" />
        </button>
        <span className="text-xs text-muted-foreground/80 font-medium">{currentIdx + 1} / {totalAdhkar}</span>
        <button onClick={handleReset} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-muted-foreground active:scale-90 transition-transform">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Main area — tap to count */}
      {completed ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Alhamdulillah!</h2>
          <p className="text-sm text-muted-foreground mb-8">You have completed the post-salah adhkar. May Allah accept your worship.</p>
          <button onClick={onExit} className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-foreground active:scale-95 transition-transform">
            Done
          </button>
        </div>
      ) : (
        <button onClick={handleTap} className="flex-1 flex flex-col items-center justify-center px-6 text-center active:bg-card/50 transition-colors select-none">
          {/* Arabic */}
          <p className="font-arabic text-2xl leading-[2] text-foreground mb-4 max-w-sm" dir="rtl">{current.arabic}</p>

          {/* Transliteration */}
          <p className="text-sm italic text-muted-foreground mb-2 max-w-sm">{current.transliteration}</p>

          {/* Translation */}
          <p className="text-xs text-muted-foreground/80 mb-6 max-w-sm">{current.translation}</p>

          {/* Count display */}
          <div className="relative mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-extrabold tabular-nums text-emerald-400">{count}</span>
              <span className="text-2xl font-bold text-muted-foreground/60">/ {current.displayCount}</span>
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-4">Tap anywhere to count</p>

          {!isLast && (
            <button
              onClick={(e) => { e.stopPropagation(); handleSkip() }}
              className="flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-xs text-muted-foreground active:scale-95 transition-transform"
            >
              Skip <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </button>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AfterSalahPage() {
  const [filter, setFilter] = useState<PrayerFilter>('all')
  const [counterMode, setCounterMode] = useState(false)

  const adhkar = getFilteredAdhkar(filter)

  const filters: { key: PrayerFilter; label: string }[] = [
    { key: 'all', label: 'After Every Prayer' },
    { key: 'fajr', label: 'After Fajr' },
    { key: 'maghrib', label: 'After Maghrib' },
  ]

  if (counterMode) {
    return <CounterMode adhkar={adhkar} onExit={() => setCounterMode(false)} />
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={HandHeart}
        title="After Prayer Adhkar"
        subtitle="Sunnah Dhikr After Every Salah"
        gradient="from-emerald-950 to-teal-900"
        showBack
        heroTheme="tasbih"
      />

      <div className="px-4 pt-4 space-y-4">
        {/* Start Counter Button */}
        <button
          onClick={() => setCounterMode(true)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-foreground shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-transform"
        >
          <Play className="h-4 w-4" /> Start Guided Counter
        </button>

        {/* Prayer filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                filter === f.key
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-secondary text-muted-foreground border border-border'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Info banner */}
        {(filter === 'fajr' || filter === 'maghrib') && (
          <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
            <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/80">
              {filter === 'fajr' ? 'After Fajr' : 'After Maghrib'}: certain adhkar are recited more times (3x for Qul surahs, 10x for the tahleel). The counts below reflect this.
            </p>
          </div>
        )}

        {/* Adhkar list */}
        <div className="space-y-3">
          {adhkar.map((dhikr, idx) => (
            <div key={dhikr.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start gap-3 mb-3">
                {/* Step number */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Count badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                      {dhikr.displayCount === 1 ? 'Once' : `${dhikr.displayCount}\u00D7`}
                    </span>
                    {dhikr.afterSpecificPrayer && (filter === 'fajr' || filter === 'maghrib') && (
                      <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                        Enhanced
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Arabic */}
              <p className="font-arabic text-xl leading-[2.2] text-foreground mb-3 whitespace-pre-line" dir="rtl">
                {dhikr.arabic}
              </p>

              {/* Transliteration */}
              <p className="text-xs italic text-muted-foreground mb-2">{dhikr.transliteration}</p>

              {/* Translation */}
              <p className="text-sm text-muted-foreground mb-3">{dhikr.translation}</p>

              {/* Notes */}
              {dhikr.notes && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-500/5 border border-amber-500/10 px-3 py-2 mb-2">
                  <Info className="h-3.5 w-3.5 text-amber-400/70 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-300/70">{dhikr.notes}</p>
                </div>
              )}

              {/* Reference */}
              <p className="text-[10px] text-muted-foreground/60">{dhikr.reference}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
