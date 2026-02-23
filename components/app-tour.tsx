'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { X, ChevronRight, Sparkles } from 'lucide-react'

// ─── Tour steps ───────────────────────────────────────────────────────────────

interface TourStep {
  target: string | null          // data-tour selector, null = center card
  route?: string                 // navigate to this route before spotlighting
  emoji: string
  title: string
  description: string
  hint?: string
  tooltipSide?: 'above' | 'below' | 'center'
}

const STEPS: TourStep[] = [
  {
    target: null,
    emoji: '\u{1F54C}',
    title: 'Welcome to MasjidConnect GY',
    description: "Your complete Islamic companion for the Guyanese Muslim community. Let's take a quick tour \u2014 I'll show you exactly where everything is.",
    tooltipSide: 'center',
  },
  {
    target: '[data-tour="prayer-countdown"]',
    route: '/',
    emoji: '\u23F1\uFE0F',
    title: 'Live Prayer Countdown',
    description: 'Always know exactly how long until the next salah. Prayer times auto-calculate for Georgetown using your chosen method.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="quran-surah-list"]',
    route: '/quran',
    emoji: '\u{1F4D6}',
    title: 'Full Quran Reader',
    description: 'All 114 surahs with audio recitation, 4 English translations, and Ibn Kathir tafsir per verse. Switch between Uthmani and IndoPak script, or enable tajweed colour coding.',
    hint: 'Tap the Mushaf button at the top for the full 604-page Arabic Mushaf.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="tracker-prayer-buttons"]',
    route: '/tracker',
    emoji: '\u2705',
    title: 'Ibadah Tracker',
    description: 'Log all 5 daily prayers, Sunnah, Witr, Tahajjud, fasting days, Quran pages, and missed Qada prayers. Build streaks and earn points toward your level.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="masjid-list"]',
    route: '/masjids',
    emoji: '\u{1F4CD}',
    title: 'Masjid Directory',
    description: 'Find all 31 masjids across Guyana \u2014 prayer times, contact info, Imam details, and directions. Tap any masjid to see full details.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="explore-grid"]',
    route: '/explore',
    emoji: '\u{1F9ED}',
    title: 'Explore \u2014 Everything in One Place',
    description: 'This is the heart of the app. Every Islamic tool and resource is organised here \u2014 tap any card to go directly to that section.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="duas-categories"]',
    route: '/explore/duas',
    emoji: '\u{1F932}',
    title: 'Duas \u2014 80+ in 21 Categories',
    description: 'Authentic duas for every moment of your day \u2014 waking up, meals, travel, protection, after salah, and more. All with Arabic, transliteration, and translation.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="fiqh-chapters"]',
    route: '/explore/fiqh',
    emoji: '\u{1F4DA}',
    title: 'Fiqh Hub \u2014 Hanafi Rulings',
    description: "105+ topics across 14 chapters of Hanafi fiqh \u2014 Taharah, Salah, Sawm, Zakah, and more. Includes rulings, examples, and local fatawa from Jami'yyatul Ulamaa.",
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="lectures-scholars"]',
    route: '/explore/lectures',
    emoji: '\u{1F399}\uFE0F',
    title: '235+ Islamic Lectures',
    description: 'Full audio lecture series from Imam Anwar al-Awlaki, Shaykh Hamza Yusuf, Dr. Bilal Philips, Ustadha Yasmin Mogahed, Dr. Omar Suleiman, and more \u2014 all free.',
    hint: 'Filter by scholar using the buttons above, or browse all series.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="community-features"]',
    route: '/explore/community',
    emoji: '\u{1F465}',
    title: 'Community',
    description: 'Post to the Feed, share duas on the Dua Board, join the Khatam Collective to complete the Quran together, and add Faith Buddies to keep each other accountable.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="madrasa-cards"]',
    route: '/explore/madrasa',
    emoji: '\u{1F393}',
    title: 'Madrasa \u2014 Learn Islam',
    description: "Noorani Qaida, How to Pray step-by-step, Stories of the Prophets, Seerah of the Prophet \uFDFA, Islamic Adab, and the full GII Islamic Library.",
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="quick-actions"]',
    route: '/',
    emoji: '\u26A1',
    title: 'Quick Actions',
    description: 'Jump to any section in one tap \u2014 Fiqh Hub, Duas, Lectures, Community, Tasbih counter, Qibla compass, Zakat calculator, and more.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="checklist"]',
    route: '/',
    emoji: '\u2611\uFE0F',
    title: 'Daily Ibadah Checklist',
    description: 'Tick off your daily goals \u2014 Fajr prayed, Quran read, Dua made, Charity given, Dhikr done, Sunnah prayers. Each tick earns points toward your level.',
    tooltipSide: 'above',
  },
  {
    target: null,
    emoji: '\u{1F932}',
    title: "You're All Set \u2014 Bismillah!",
    description: '\u0628\u0627\u0631\u0643 \u0627\u0644\u0644\u0647 \u0641\u064A\u0643 \u2014 May Allah accept your worship and make this app a source of benefit for you and the Guyanese Muslim community. Ameen.',
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
  const router = useRouter()
  const pathname = usePathname()
  const [stepIdx, setStepIdx] = useState(0)
  const [spot, setSpot] = useState<SpotRect | null>(null)
  const [visible, setVisible] = useState(false)

  const step = STEPS[stepIdx]
  const isLast = stepIdx === STEPS.length - 1
  const isCenter = step.tooltipSide === 'center' || !step.target

  const handleComplete = useCallback(() => {
    router.push('/')
    onComplete()
  }, [router, onComplete])

  // Scroll element into view, then calculate spotlight
  const updateSpot = useCallback(async (target: string | null, route?: string) => {
    setVisible(false)

    // Navigate if needed
    if (route && pathname !== route) {
      router.push(route)
      // Wait for page to load before trying to find elements
      await new Promise(resolve => setTimeout(resolve, 900))
    }

    if (!target) {
      setSpot(null)
      setTimeout(() => setVisible(true), 120)
      return
    }

    const el = document.querySelector(target)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Wait for scroll to settle before measuring
      setTimeout(() => {
        setSpot(getSpotRect(target))
        setVisible(true)
      }, 450)
    } else {
      // Element not found — fall back to center card
      setSpot(null)
      setTimeout(() => setVisible(true), 120)
    }
  }, [pathname, router])

  useEffect(() => {
    updateSpot(step.target, step.route)
  }, [stepIdx, step.target, step.route, updateSpot])

  // Recalculate on resize
  useEffect(() => {
    if (!step.target) return
    const recalc = () => setSpot(getSpotRect(step.target!))
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [step.target])

  const handleNext = useCallback(() => {
    if (isLast) { handleComplete(); return }
    setStepIdx(i => i + 1)
  }, [isLast, handleComplete])

  const handleSkip = useCallback(() => { handleComplete() }, [handleComplete])

  // Tooltip position
  const tooltipStyle = (): React.CSSProperties => {
    if (isCenter || !spot) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '340px' }
    }
    const viewH = window.innerHeight
    const spaceBelow = viewH - (spot.top + spot.height)

    if (step.tooltipSide === 'above' || spaceBelow < 220) {
      return {
        bottom: `${viewH - spot.top + 12}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '340px',
      }
    }
    return {
      top: `${spot.top + spot.height + 12}px`,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '340px',
    }
  }

  const showArrowBelow = !isCenter && spot && step.tooltipSide === 'above'
  const showArrowAbove = !isCenter && spot && step.tooltipSide === 'below'

  return (
    <div className="fixed inset-0 z-[220]" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease' }}>

      {/* ── Overlay ── */}
      {spot ? (
        <>
          <div className="fixed left-0 right-0 top-0 bg-black/80" style={{ height: Math.max(0, spot.top) }} />
          <div className="fixed left-0 right-0 bottom-0 bg-black/80" style={{ top: spot.top + spot.height }} />
          <div className="fixed bg-black/80" style={{ top: spot.top, height: spot.height, left: 0, width: Math.max(0, spot.left) }} />
          <div className="fixed bg-black/80" style={{ top: spot.top, height: spot.height, left: spot.left + spot.width, right: 0 }} />
          <div className="fixed rounded-2xl pointer-events-none"
            style={{
              top: spot.top, left: spot.left,
              width: spot.width, height: spot.height,
              boxShadow: '0 0 0 2px rgba(52,211,153,0.6), 0 0 20px rgba(52,211,153,0.2)',
              border: '1.5px solid rgba(52,211,153,0.5)',
            }} />
        </>
      ) : (
        <div className="fixed inset-0 bg-black/80" />
      )}

      {/* ── Tooltip card ── */}
      <div className="fixed z-[221] w-[calc(100%-2rem)]" style={tooltipStyle()}>

        {showArrowBelow && (
          <div className="flex justify-center pb-1">
            <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-800" />
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-gray-700/80 bg-gray-900 shadow-2xl">
          {/* Progress dots */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex gap-1 flex-wrap max-w-[200px]">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIdx ? 'w-4 bg-emerald-400' : i < stepIdx ? 'w-1.5 bg-emerald-700' : 'w-1.5 bg-gray-700'
                }`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-600">{stepIdx + 1}/{STEPS.length}</span>
              <button
                onClick={handleSkip}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 active:text-gray-300"
                aria-label="Skip tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
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
            {step.hint && (
              <p className="mt-2 text-[11px] text-emerald-500/80 leading-relaxed">{step.hint}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-800 px-5 py-3">
            <button onClick={handleSkip} className="text-xs font-medium text-gray-500 active:text-gray-300">
              Skip tour
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 active:bg-emerald-600 active:scale-95 transition-transform"
            >
              {isLast ? (
                <><Sparkles className="h-4 w-4" /> Let&apos;s go!</>
              ) : (
                <>Next <ChevronRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>

        {showArrowAbove && (
          <div className="flex justify-center pt-1">
            <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-800" />
          </div>
        )}
      </div>
    </div>
  )
}
