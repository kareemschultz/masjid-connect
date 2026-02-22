'use client'

import type { LucideIcon } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

interface PageHeroProps {
  icon: LucideIcon
  title: string
  subtitle: string
  gradient: string
  showBack?: boolean
  /** Optional right-side action */
  action?: ReactNode
}

export function PageHero({ icon: Icon, title, subtitle, gradient, showBack, action }: PageHeroProps) {
  const router = useRouter()

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
      {/* Decorative blurred orbs */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
      {/* Islamic geometric pattern overlay */}
      <div className="islamic-pattern absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0b14]" />

      <div className="relative px-5 pt-14 pb-10">
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
