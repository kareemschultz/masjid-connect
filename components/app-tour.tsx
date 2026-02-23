'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, ChevronRight, Sparkles } from 'lucide-react'

// ─── Tour steps ───────────────────────────────────────────────────────────────

interface TourStep {
  target: string | null          // data-tour selector, null = center card
  emoji: string
  title: string
  description: string
  tooltipSide?: 'above' | 'below' | 'center'
}

const STEPS: TourStep[] = [
  {
    target: null,
    emoji: '🕌',
    title: 'Welcome to MasjidConnect GY',
    description: "Let's take 30 seconds to show you around. Tap Next to begin.",
    tooltipSide: 'center',
  },
  {
    target: '[data-tour="nav-home"]',
    emoji: '🏠',
    title: 'Your Home',
    description: 'See your daily prayer times, Eid countdown, quick actions, and announcements — all at a glance.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="nav-quran"]',
    emoji: '📖',
    title: 'Full Quran Reader',
    description: 'Read with audio, 4 translations, Ibn Kathir tafsir, tajweed colors, script toggle, and the full 604-page Mushaf.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="nav-tracker"]',
    emoji: '✅',
    title: 'Ibadah Tracker',
    description: 'Log all 5 prayers, Sunnah, Witr, fasting, Quran pages, and missed prayers. Build streaks and earn points.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="nav-masjids"]',
    emoji: '📍',
    title: 'Masjid Directory',
    description: 'Find all 31 Georgetown & Guyana masjids with prayer times, contact info, and directions.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="nav-explore"]',
    emoji: '🧭',
    title: 'Explore Everything',
    description: '80+ Duas, full Fiqh Guide, 235+ lectures, Janazah guide, 99 Names, Kids section, Sisters section, and much more.',
    tooltipSide: 'above',
  },
  {
    target: null,
    emoji: '🤲',
    title: "You're All Set!",
    description: 'بارك الله فيك — May Allah accept your worship and bless your journey on this app. Bismillah!',
    tooltipSide: 'center',
  },
]

// ─── Spotlight rect ────────────────────────────────────────────────────────────

interface SpotRect { top: number; left: number; width: number; height: number }

function getSpotRect(selector: string): SpotRect | null {
  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  const pad = 8
  return { top: r.top - pad, left: r.left - pad, width: r.width + pad*2, height: r.height + pad*2 }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppTour({ onComplete }: { onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [spot, setSpot] = useState<SpotRect | null>(null)
  const [visible, setVisible] = useState(false)

  const step = STEPS[stepIdx]
  const isLast = stepIdx === STEPS.length - 1
  const isCenter = step.tooltipSide === 'center' || !step.target

  // Recalculate spotlight whenever step changes
  useEffect(() => {
    setVisible(false)
    const timer = setTimeout(() => {
      if (step.target) {
        setSpot(getSpotRect(step.target))
      } else {
        setSpot(null)
      }
      setVisible(true)
    }, 120)
    return () => clearTimeout(timer)
  }, [stepIdx, step.target])

  // Recalculate on resize/scroll
  useEffect(() => {
    if (!step.target) return
    const recalc = () => setSpot(getSpotRect(step.target!))
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [step.target])

  const handleNext = useCallback(() => {
    if (isLast) { onComplete(); return }
    setStepIdx(i => i + 1)
  }, [isLast, onComplete])

  const handleSkip = useCallback(() => {
    onComplete()
  }, [onComplete])

  // Tooltip vertical position — for BottomNav items, show above the spotlight
  const tooltipTopStyle = (): React.CSSProperties => {
    if (isCenter || !spot) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '320px' }
    }
    const viewH = window.innerHeight
    const spaceAbove = spot.top
    const spaceBelow = viewH - (spot.top + spot.height)

    if (step.tooltipSide === 'above' || spaceBelow < 180) {
      // Position above spotlight
      return {
        bottom: `${viewH - spot.top + 12}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '320px',
      }
    }
    // Below
    return {
      top: `${spot.top + spot.height + 12}px`,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '320px',
    }
  }

  // Arrow direction
  const showArrowBelow = !isCenter && spot && step.tooltipSide === 'above'
  const showArrowAbove = !isCenter && spot && step.tooltipSide === 'below'

  return (
    <div className="fixed inset-0 z-[220]" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease' }}>

      {/* ── Overlay (4-rectangle spotlight cutout) ── */}
      {spot ? (
        <>
          {/* Top */}
          <div className="fixed left-0 right-0 top-0 bg-black/80"
            style={{ height: Math.max(0, spot.top) }} />
          {/* Bottom */}
          <div className="fixed left-0 right-0 bottom-0 bg-black/80"
            style={{ top: spot.top + spot.height }} />
          {/* Left */}
          <div className="fixed bg-black/80"
            style={{ top: spot.top, height: spot.height, left: 0, width: Math.max(0, spot.left) }} />
          {/* Right */}
          <div className="fixed bg-black/80"
            style={{ top: spot.top, height: spot.height, left: spot.left + spot.width, right: 0 }} />
          {/* Spotlight border glow */}
          <div className="fixed rounded-2xl pointer-events-none"
            style={{
              top: spot.top, left: spot.left,
              width: spot.width, height: spot.height,
              boxShadow: '0 0 0 2px rgba(52,211,153,0.6), 0 0 20px rgba(52,211,153,0.2)',
              border: '1.5px solid rgba(52,211,153,0.5)',
            }} />
        </>
      ) : (
        /* Full overlay for center steps */
        <div className="fixed inset-0 bg-black/80" />
      )}

      {/* ── Tooltip card ── */}
      <div
        className="fixed z-[221] w-[calc(100%-2rem)]"
        style={tooltipTopStyle()}
      >
        {/* Arrow pointing down (tooltip is above element) */}
        {showArrowBelow && (
          <div className="flex justify-center pb-1">
            <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-800" />
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-gray-700/80 bg-gray-900 shadow-2xl">
          {/* Progress dots */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIdx ? 'w-5 bg-emerald-400' : i < stepIdx ? 'w-1.5 bg-emerald-700' : 'w-1.5 bg-gray-700'
                }`} />
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 active:text-gray-300"
              aria-label="Skip tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-800 text-2xl">
                {step.emoji}
              </div>
              <h3 className="text-base font-bold text-white leading-tight">{step.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">{step.description}</p>
            {step.target === '[data-tour="nav-quran"]' && (
              <p className="mt-2 text-[11px] text-emerald-500/80">Tap the Quran tab below to explore →</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-800 px-5 py-3">
            <button
              onClick={handleSkip}
              className="text-xs font-medium text-gray-500 active:text-gray-300"
            >
              Skip tour
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 active:bg-emerald-600 active:scale-95 transition-transform"
            >
              {isLast ? (
                <><Sparkles className="h-4 w-4" /> Let's go!</>
              ) : (
                <>Next <ChevronRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* Arrow pointing up (tooltip is below element) */}
        {showArrowAbove && (
          <div className="flex justify-center pt-1">
            <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-800" />
          </div>
        )}
      </div>
    </div>
  )
}
