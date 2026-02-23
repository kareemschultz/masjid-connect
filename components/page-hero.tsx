'use client'

import type { LucideIcon } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, type ReactNode } from 'react'
import { HeroAnimation, type HeroTheme } from './hero-animations'

interface PageHeroProps {
  icon: LucideIcon
  title: string
  subtitle: string
  gradient: string
  showBack?: boolean
  /** Optional right-side action */
  action?: ReactNode
  /** Show animated star field */
  stars?: boolean
  /** Compact mode — slim header for hub/nav pages visited frequently */
  compact?: boolean
  /** Page-specific background animation theme */
  heroTheme?: HeroTheme
}

function StarField() {
  const dots = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.floor((i * 37 + 13) % 100)}%`,
      top: `${Math.floor((i * 53 + 7) % 100)}%`,
      size: 1.5 + (i % 3) * 0.5,
      delay: `${(i * 0.13) % 3}s`,
      duration: `${2 + (i % 3)}s`,
      opacity: 0.3 + (i % 4) * 0.1,
    }))
  }, [])

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: var(--star-opacity, 0.5); }
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {dots.map((d) => (
          <span
            key={d.id}
            className="absolute rounded-full bg-white"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              '--star-opacity': d.opacity,
              animationName: 'twinkle',
              animationDelay: d.delay,
              animationDuration: d.duration,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  )
}

export function PageHero({ icon: Icon, title, subtitle, gradient, showBack, action, stars, compact, heroTheme }: PageHeroProps) {
  const router = useRouter()

  // ─── Compact variant — slim header for hub/nav pages ─────────────────────
  if (compact) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
        <div className="islamic-pattern absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0b14]" />
        {heroTheme && <HeroAnimation theme={heroTheme} />}
        <div className="relative flex items-center gap-3 px-5 py-4" style={{ paddingTop: 'max(1rem, calc(env(safe-area-inset-top) + 0.5rem))' }}>
          {showBack && (
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-transform active:scale-90"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">{title}</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50 leading-tight mt-0.5">{subtitle}</p>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    )
  }

  // ─── Full variant ─────────────────────────────────────────────────────────
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
      {/* Decorative blurred orbs */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
      {/* Islamic geometric pattern overlay */}
      <div className="islamic-pattern absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0b14]" />
      {/* Star field */}
      {stars && <StarField />}
      {/* Page-specific animation */}
      {heroTheme && <HeroAnimation theme={heroTheme} />}

      <div className="relative px-5 pb-10" style={{ paddingTop: 'max(3.5rem, calc(env(safe-area-inset-top) + 1rem))' }}>
        <div className="flex items-start justify-between">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="glass mb-4 flex h-10 w-10 items-center justify-center rounded-2xl text-white/80 transition-transform active:scale-90"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          {action && <div className="ml-auto">{action}</div>}
        </div>

        <div className="flex flex-col items-center justify-center pt-2 pb-2">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md animate-scale-in">
            <Icon className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white text-balance animate-fade-up" style={{ animationDelay: '0.08s', animationFillMode: 'backwards' }}>
            {title}
          </h1>
          <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 animate-fade-up" style={{ animationDelay: '0.16s', animationFillMode: 'backwards' }}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
