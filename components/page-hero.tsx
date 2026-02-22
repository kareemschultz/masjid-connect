'use client'

import type { LucideIcon } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PageHeroProps {
  icon: LucideIcon
  title: string
  subtitle: string
  gradient: string
  showBack?: boolean
}

export function PageHero({ icon: Icon, title, subtitle, gradient, showBack }: PageHeroProps) {
  const router = useRouter()

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
      {/* Islamic geometric pattern overlay */}
      <div className="islamic-pattern absolute inset-0 opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      <div className="relative flex flex-col items-center justify-center px-6 pt-14 pb-8">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="absolute top-14 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm transition-transform active:scale-90"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md animate-in fade-in zoom-in duration-500">
          <Icon className="h-7 w-7 text-white" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white text-balance animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">{title}</h1>
        <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/70 animate-in fade-in slide-in-from-bottom-1 duration-500 delay-200">{subtitle}</p>
      </div>
    </div>
  )
}
