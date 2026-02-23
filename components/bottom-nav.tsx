'use client'

import { Home, BookOpen, CheckSquare, MapPin, Compass } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/quran', icon: BookOpen, label: 'Quran' },
  { href: '/tracker', icon: CheckSquare, label: 'Tracker' },
  { href: '/masjids', icon: MapPin, label: 'Masjids' },
  { href: '/explore', icon: Compass, label: 'Explore' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60]">
      {/* Gradient fade — sits above nav, outside the opaque area */}
      <div className="pointer-events-none absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-[#0a0b14] to-transparent" />

      <div className="border-t border-white/[0.06] bg-[#0a0b14]" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}>
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
          {tabs.map((tab) => {
            const isActive = tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href)

            const tourId = tab.href === '/' ? 'nav-home'
              : tab.href === '/quran' ? 'nav-quran'
              : tab.href === '/tracker' ? 'nav-tracker'
              : tab.href === '/masjids' ? 'nav-masjids'
              : 'nav-explore'

            return (
              <Link
                key={tab.href}
                href={tab.href}
                data-tour={tourId}
                className={`relative flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-1.5 transition-all duration-300 ${
                  isActive ? 'text-emerald-400' : 'text-gray-600 active:scale-90'
                }`}
              >
                {isActive && (
                  <>
                    <span className="absolute -top-1 h-[3px] w-5 rounded-full bg-emerald-400 transition-all duration-300" />
                    <span className="absolute inset-0 rounded-2xl bg-emerald-500/[0.06]" />
                  </>
                )}
                <tab.icon className={`relative h-5 w-5 transition-all duration-300 ${isActive ? 'scale-105' : ''}`} />
                <span className={`relative text-[10px] transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
