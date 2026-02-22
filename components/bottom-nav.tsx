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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950/95 backdrop-blur-lg pb-safe">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 transition-colors ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-gray-500 active:text-gray-400'
              }`}
            >
              <tab.icon className={`h-5 w-5 ${isActive ? 'fill-emerald-400/20' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
