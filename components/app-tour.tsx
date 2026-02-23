'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, ChevronRight, Sparkles } from 'lucide-react'

// ─── Tour steps ───────────────────────────────────────────────────────────────

interface TourStep {
  target: string | null          // data-tour selector, null = center card
  emoji: string
  title: string
  description: string
  hint?: string
  tooltipSide?: 'above' | 'below' | 'center'
}

const STEPS: TourStep[] = [
  {
    target: null,
    emoji: '🕌',
    title: 'Welcome to MasjidConnect GY',
    description: "Your complete Islamic companion for the Guyanese Muslim community. Let's take a quick tour — tap Next to begin.",
    tooltipSide: 'center',
  },
  {
    target: '[data-tour="prayer-countdown"]',
    emoji: '⏱️',
    title: 'Live Prayer Countdown',
    description: 'Always know exactly how long until the next prayer. The ring shows progress since the last salah. Prayer times auto-calculate for Georgetown using your chosen method.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="hadith-card"]',
    emoji: '📜',
    title: 'Hadith of the Day',
    description: 'A new authentic hadith every day — Arabic, transliteration, and English translation. Drawn from the 40 Nawawi collection. Tap Explore → Hadith to browse all 40.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="verse-card"]',
    emoji: '🌟',
    title: 'Verse of the Day',
    description: 'A daily ayah rotated from 18 carefully selected verses. Tap "Read Surah" to jump straight into the full Quran reader for that surah.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="nav-quran"]',
    emoji: '📖',
    title: 'Full Quran Reader',
    description: 'All 114 surahs with high-quality audio recitation, 4 English translations (Sahih International, Yusuf Ali, Pickthall, Asad), and Ibn Kathir tafsir per verse.',
    hint: 'Also: tajweed colour coding, Uthmani & IndoPak script toggle, and the complete 604-page Mushaf.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="nav-tracker"]',
    emoji: '✅',
    title: 'Ibadah Tracker',
    description: 'Log all 5 daily prayers, Sunnah, Witr, Tahajjud, fasting days, Quran pages, Sadaqah, and missed (Qada) prayers. Build streaks and earn points.',
    hint: 'Your stats, 7-day chart, and Fajr consistency rate are all tracked.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="nav-masjids"]',
    emoji: '📍',
    title: 'Masjid Directory',
    description: 'Find all 31 masjids across Georgetown, East Coast, East Bank, Berbice, Linden, and West Demerara — with prayer times, contact info, Imam details, and directions.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="quick-actions"]',
    emoji: '⚡',
    title: 'Quick Actions',
    description: 'Jump anywhere in the app in one tap — Fiqh Hub, Duas, Lectures, Community, Madrasa, Tasbih counter, Qibla compass, and Zakat calculator.',
    tooltipSide: 'above',
  },
  {
    target: '[data-tour="nav-explore"]',
    emoji: '🧭',
    title: 'Explore — Islamic Tools',
    description: 'The heart of the app. Over 80 Duas in 21 categories, the full Fiqh Guide (14 chapters, 105+ Hanafi rulings), 99 Names of Allah, Kids section, and Sisters section.',
    tooltipSide: 'above',
  },
  {
    target: null,
    emoji: '🎓',
    title: 'Madrasa — Learn Islam',
    description: "In Explore → Madrasa you'll find: Noorani Qaida for learning to read Arabic, How to Pray step-by-step, Stories of the Prophets, Seerah of the Prophet ﷺ, Islamic Adab, and the GII Islamic Library.",
    tooltipSide: 'center',
  },
  {
    target: null,
    emoji: '🎙️',
    title: '235+ Islamic Lectures',
    description: 'In Explore → Lectures: full audio series from Imam Anwar al-Awlaki, Shaykh Hamza Yusuf, Dr. Bilal Philips, Ustadha Yasmin Mogahed, Dr. Omar Suleiman, and more — all free.',
    tooltipSide: 'center',
  },
  {
    target: null,
    emoji: '👥',
    title: 'Community Features',
    description: 'In Explore → Community: post to the Feed, share and say Ameen on the Dua Board, join the Khatam Collective to complete the Quran together, and add Faith Buddies to keep each other accountable.',
    tooltipSide: 'center',
  },
  {
    target: '[data-tour="checklist"]',
    emoji: '☑️',
    title: 'Daily Ibadah Checklist',
    description: 'Tick off your daily goals — Fajr prayed, Quran read, Dua made, Charity given, Dhikr done, and Sunnah prayers. Each tick earns points toward your level.',
    tooltipSide: 'above',
  },
  {
    target: null,
    emoji: '🤲',
    title: "You're All Set — Bismillah!",
    description: 'بارك الله فيك — May Allah accept your worship and make this app a source of benefit for you and the Guyanese Muslim community. Ameen.',
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

  // Scroll element into view, then calculate spotlight
  const updateSpot = useCallback((target: string | null) => {
    setVisible(false)
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
      setSpot(null)
      setTimeout(() => setVisible(true), 120)
    }
  }, [])

  useEffect(() => {
    updateSpot(step.target)
  }, [stepIdx, step.target, updateSpot])

  // Recalculate on resize
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

  const handleSkip = useCallback(() => { onComplete() }, [onComplete])

  // Tooltip position
  const tooltipStyle = (): React.CSSProperties => {
    if (isCenter || !spot) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '340px' }
    }
    const viewH = window.innerHeight
    const spaceAbove = spot.top
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
                <><Sparkles className="h-4 w-4" /> Let's go!</>
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
