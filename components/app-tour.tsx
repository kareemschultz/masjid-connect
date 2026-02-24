'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { flushSync } from 'react-dom'
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
    description: 'This is the heart of the app. Every Islamic tool and resource is organised here into four distinct Hubs.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="explore-hub-learning"]',
    route: '/explore',
    emoji: '\u{1F393}',
    title: 'Learning Hub',
    description: 'Everything you need to master your deen: Quran, Fiqh Guide, Hadith, Madrasa, Lectures, and more.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="explore-hub-practice"]',
    route: '/explore',
    emoji: '\u2728',
    title: 'Practice & Tools',
    description: 'Essential daily tools for every Muslim: Duas, Adhkar, Tasbih, Qibla, Zakat, and Islamic Calendar.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="explore-hub-community"]',
    route: '/explore',
    emoji: '\u{1F465}',
    title: 'Community Hub',
    description: 'Connect with your local community: Halal Directory, Masjids, Local Scholars, and Events.',
    tooltipSide: 'below',
  },
  {
    target: '[data-tour="explore-hub-sisters"]',
    route: '/explore',
    emoji: '\u{1F338}',
    title: 'Sisters & New Muslims',
    description: 'Dedicated resources for our sisters and new brothers: New to Islam, Sisters, and Kids Corner.',
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const VIEWPORT_MARGIN = 12
const TOUR_CARD_FALLBACK_HEIGHT = 260

async function waitForRoute(route: string, timeoutMs = 7000): Promise<boolean> {
  if (window.location.pathname === route) return true
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    await sleep(120)
    if (window.location.pathname === route) return true
  }
  return false
}

async function ensureTargetSpot(selector: string, timeoutMs = 5000): Promise<SpotRect | null> {
  const started = Date.now()
  let lastRect: SpotRect | null = null
  let stableFrames = 0
  let visibleFrames = 0

  while (Date.now() - started < timeoutMs) {
    const found = document.querySelector(selector) as HTMLElement | null
    if (!found) {
      await sleep(80)
      continue
    }

    found.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' })
    await sleep(40)

    const rect = getSpotRect(selector)
    if (!rect) {
      await sleep(80)
      continue
    }

    const visibleTop = Math.max(rect.top, 0)
    const visibleBottom = Math.min(rect.top + rect.height, window.innerHeight)
    const visibleHeight = Math.max(0, visibleBottom - visibleTop)
    const minVisible = Math.min(rect.height, window.innerHeight) * 0.35
    const inViewport = visibleHeight >= Math.max(48, minVisible)
    const nearLast =
      !!lastRect &&
      Math.abs(rect.top - lastRect.top) < 1 &&
      Math.abs(rect.left - lastRect.left) < 1 &&
      Math.abs(rect.width - lastRect.width) < 1 &&
      Math.abs(rect.height - lastRect.height) < 1

    visibleFrames = inViewport ? visibleFrames + 1 : 0
    stableFrames = inViewport && nearLast ? stableFrames + 1 : 0
    lastRect = rect

    if (inViewport && (stableFrames >= 1 || visibleFrames >= 2)) {
      return rect
    }

    await sleep(80)
  }

  return lastRect ?? getSpotRect(selector)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppTour({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [stepIdx, setStepIdx] = useState(0)
  const [spot, setSpot] = useState<SpotRect | null>(null)
  const [visible, setVisible] = useState(false)
  const [cardHeight, setCardHeight] = useState(TOUR_CARD_FALLBACK_HEIGHT)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const runIdRef = useRef(0)

  const step = STEPS[stepIdx]
  const isLast = stepIdx === STEPS.length - 1
  const isCenter = step.tooltipSide === 'center' || !step.target

  const handleComplete = useCallback(() => {
    router.push('/')
    onComplete()
  }, [router, onComplete])

  useEffect(() => {
    const uniqueRoutes = Array.from(
      new Set(
        STEPS
          .map((tourStep) => tourStep.route)
          .filter((route): route is string => !!route)
      )
    )
    uniqueRoutes.forEach((route) => router.prefetch(route))
  }, [router])

  // Scroll element into view, then calculate spotlight
  const updateSpot = useCallback(async (target: string | null, route?: string) => {
    const runId = ++runIdRef.current
    const routeChanging = !!route && window.location.pathname !== route

    if (routeChanging) {
      setVisible(false)
    }

    // Navigate if needed
    if (routeChanging && route) {
      router.push(route)
      const reachedRoute = await waitForRoute(route, 10000)
      if (!reachedRoute) {
        if (runId !== runIdRef.current) return
        setSpot(null)
        setVisible(true)
        return
      }
      await sleep(40)
      if (runId !== runIdRef.current) return
    }

    if (!target) {
      setSpot(null)
      if (runId !== runIdRef.current) return
      setVisible(true)
      return
    }

    const rect = await ensureTargetSpot(target)
    if (runId !== runIdRef.current) return

    // Element missing or unstable — fall back to center card.
    setSpot(rect)
    setVisible(true)
  }, [router])

  useEffect(() => {
    updateSpot(step.target, step.route)
    return () => {
      runIdRef.current += 1
    }
  }, [stepIdx, step.target, step.route, updateSpot])

  // Recalculate on resize
  useEffect(() => {
    if (!step.target) return
    let frame = 0
    const recalc = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        setSpot(getSpotRect(step.target!))
      })
    }
    window.addEventListener('resize', recalc)
    window.addEventListener('scroll', recalc, { passive: true })
    window.visualViewport?.addEventListener('resize', recalc)
    window.visualViewport?.addEventListener('scroll', recalc)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', recalc)
      window.removeEventListener('scroll', recalc)
      window.visualViewport?.removeEventListener('resize', recalc)
      window.visualViewport?.removeEventListener('scroll', recalc)
    }
  }, [step.target])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const updateHeight = () => {
      const nextHeight = card.getBoundingClientRect().height
      if (nextHeight > 0) setCardHeight(nextHeight)
    }

    updateHeight()

    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(updateHeight)
    ro.observe(card)
    return () => ro.disconnect()
  }, [stepIdx, visible, step.title, step.description, step.hint])

  const handleNext = useCallback(() => {
    if (isLast) { handleComplete(); return }
    const nextStep = STEPS[stepIdx + 1]
    flushSync(() => {
      if (nextStep?.route && window.location.pathname !== nextStep.route) {
        setVisible(false)
        setSpot(null)
      }
      setStepIdx(i => i + 1)
    })
  }, [isLast, handleComplete, stepIdx])

  const handleSkip = useCallback(() => { handleComplete() }, [handleComplete])

  const getTooltipLayout = (): { style: React.CSSProperties; placement: 'above' | 'below' | 'center' } => {
    if (isCenter || !spot) {
      return {
        style: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '340px' },
        placement: 'center',
      }
    }

    const viewH = window.innerHeight
    const maxTop = Math.max(VIEWPORT_MARGIN, viewH - cardHeight - VIEWPORT_MARGIN)
    const belowTop = spot.top + spot.height + VIEWPORT_MARGIN
    const aboveTop = spot.top - cardHeight - VIEWPORT_MARGIN
    const belowFits = belowTop <= maxTop
    const aboveFits = aboveTop >= VIEWPORT_MARGIN

    let placement: 'above' | 'below'

    if (step.tooltipSide === 'above') {
      placement = aboveFits || !belowFits ? 'above' : 'below'
    } else if (step.tooltipSide === 'below') {
      placement = belowFits || !aboveFits ? 'below' : 'above'
    } else {
      const spaceBelow = viewH - (spot.top + spot.height)
      const spaceAbove = spot.top
      placement = spaceBelow >= spaceAbove ? 'below' : 'above'
      if (placement === 'below' && !belowFits && aboveFits) placement = 'above'
      if (placement === 'above' && !aboveFits && belowFits) placement = 'below'
    }

    let top = placement === 'below' ? belowTop : aboveTop
    if (!Number.isFinite(top)) top = VIEWPORT_MARGIN
    top = Math.min(Math.max(top, VIEWPORT_MARGIN), maxTop)

    return {
      style: {
        top: `${top}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '340px',
      },
      placement,
    }
  }

  const tooltipLayout = getTooltipLayout()
  const showArrowBelow = !isCenter && !!spot && tooltipLayout.placement === 'above'
  const showArrowAbove = !isCenter && !!spot && tooltipLayout.placement === 'below'

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
      <div className="fixed z-[221] w-[calc(100%-2rem)]" style={tooltipLayout.style}>

        {showArrowBelow && (
          <div className="flex justify-center pb-1">
            <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-800" />
          </div>
        )}

        <div ref={cardRef} className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl">
          {/* Progress dots */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex gap-1 flex-wrap max-w-[200px]">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIdx ? 'w-4 bg-emerald-400' : i < stepIdx ? 'w-1.5 bg-emerald-700' : 'w-1.5 bg-muted'
                }`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground/60">{stepIdx + 1}/{STEPS.length}</span>
              <button
                onClick={handleSkip}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground/80 active:text-muted-foreground"
                aria-label="Skip tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl">
                {step.emoji}
              </div>
              <h3 className="text-base font-bold text-foreground leading-tight">{step.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            {step.hint && (
              <p className="mt-2 text-[11px] text-emerald-500/80 leading-relaxed">{step.hint}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <button onClick={handleSkip} className="text-xs font-medium text-muted-foreground/80 active:text-muted-foreground">
              Skip tour
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-foreground shadow-lg shadow-emerald-500/25 active:bg-emerald-600 active:scale-95 transition-transform"
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
