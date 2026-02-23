'use client'

import { useState, useMemo } from 'react'
import {
  Compass, Star, BookOpen, Calendar, Navigation2, Calculator,
  GraduationCap, Users, Users2, Circle, Brain, Sparkles, Library,
  Moon, UtensilsCrossed, Headphones, Heart, MessageCircle, Sun,
  MapPin, Keyboard, ShieldCheck, ShieldAlert, HelpCircle, Search, X,
  Scale, Banknote, BookText, HeartHandshake, Baby,
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getRamadanStatus } from '@/lib/ramadan-mode'
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    key: 'fiqh',
    label: '⚖️ Fiqh & Islamic Law',
    items: [
      { icon: Scale,       label: 'Fiqh Guide',        description: 'Islamic Law — full reference', href: '/explore/fiqh',                   color: 'from-violet-500/20 to-purple-600/10', iconColor: 'text-violet-400' },
      { icon: Heart,       label: "Women's Fiqh",       description: 'Hayd, nifas, ghusl & more',  href: '/explore/fiqh?sisters=true',       color: 'from-rose-500/20 to-pink-600/10', iconColor: 'text-rose-400' },
      { icon: Users,       label: 'Nikah & Family',     description: 'Marriage, divorce, rights',  href: '/explore/fiqh?chapter=Nikah',      color: 'from-amber-500/20 to-orange-600/10', iconColor: 'text-amber-400' },
      { icon: Banknote,    label: 'Muamalaat',          description: 'Trade, riba & contracts',    href: '/explore/fiqh?chapter=Muamalaat',  color: 'from-emerald-500/20 to-teal-600/10', iconColor: 'text-emerald-400' },
    ],
  },
  {
    key: 'quran',
    label: '📖 Quran & Learning',
    items: [
      { icon: BookOpen,    label: 'Quran',          description: 'Read & Listen',          href: '/quran',                          color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400' },
      { icon: GraduationCap, label: 'Madrasa',      description: 'Learn Islam',            href: '/explore/madrasa',                color: 'from-indigo-500/20 to-indigo-600/10', iconColor: 'text-indigo-400' },
      { icon: Headphones,  label: 'Lectures',        description: 'Audio Series',           href: '/explore/lectures',               color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
      { icon: Brain,       label: 'Hifz Mode',       description: 'Memorize Quran',         href: '/quran/hifz',                     color: 'from-indigo-500/20 to-indigo-600/10', iconColor: 'text-indigo-400' },
      { icon: Users,       label: 'Prophets',        description: '25 Quranic Stories',     href: '/explore/madrasa/prophets',       color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
      { icon: Keyboard,    label: 'Arabic Practice', description: 'Learn the Letters',      href: '/explore/madrasa/arabic-typing',  color: 'from-cyan-500/20 to-cyan-600/10', iconColor: 'text-cyan-400' },
      { icon: Library,     label: 'GII Library',     description: 'Islamic Books',          href: '/explore/madrasa/library',        color: 'from-sky-500/20 to-sky-600/10', iconColor: 'text-sky-400' },
      { icon: BookText,    label: 'Hadith',           description: '40 Nawawi Hadith',       href: '/explore/hadith',                 color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400' },
    ],
  },
  {
    key: 'prayer',
    label: '🕌 Prayer & Practice',
    items: [
      { icon: Star,        label: 'Adhkar',          description: 'Morning & Evening',      href: '/explore/adhkar',                 color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
      { icon: BookOpen,    label: 'Duas',            description: 'Daily Supplications',    href: '/explore/duas',                   color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400' },
      { icon: Circle,      label: 'Tasbih',          description: 'Digital Counter',        href: '/explore/tasbih',                 color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
      { icon: Navigation2, label: 'Qibla',           description: 'Find Direction',         href: '/explore/qibla',                  color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400' },
      { icon: Calculator,  label: 'Zakat',           description: 'Calculate Zakat',        href: '/explore/zakat',                  color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400' },
      { icon: Calendar,    label: 'Islamic Calendar',description: 'Hijri Dates & Events',   href: '/explore/calendar',               color: 'from-rose-500/20 to-rose-600/10', iconColor: 'text-rose-400' },
      { icon: Sun,         label: "Jumu'ah",         description: 'Friday Prayer Prep',     href: '/explore/jumuah',                 color: 'from-emerald-500/20 to-teal-600/10', iconColor: 'text-emerald-400' },
    ],
  },
  {
    key: 'community',
    label: '👥 Community',
    items: [
      { icon: Users2,      label: 'Community',       description: 'Connect with Muslims',   href: '/explore/community',              color: 'from-violet-500/20 to-purple-600/10', iconColor: 'text-violet-400' },
      { icon: Users,       label: 'Buddy',           description: 'Faith Partners',         href: '/explore/buddy',                  color: 'from-cyan-500/20 to-cyan-600/10', iconColor: 'text-cyan-400' },
      { icon: UtensilsCrossed, label: 'Iftaar',      description: "Tonight's Menu",         href: '/iftaar',                         color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
      { icon: MapPin,      label: 'Masjids',         description: 'Masjid Directory',       href: '/masjids',                        color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400' },
      { icon: ShieldCheck, label: 'Halal Directory',  description: 'CIOG & D.E.H.C. certified businesses', href: '/explore/halal-directory',       color: 'from-emerald-500/20 to-green-600/10', iconColor: 'text-emerald-400' },
      { icon: ShieldCheck, label: 'Halal Guide',     description: 'Haram foods, E-numbers & rulings',  href: '/explore/halal-guide',            color: 'from-teal-500/20 to-emerald-600/10', iconColor: 'text-teal-400' },
      { icon: HeartHandshake, label: 'Janazah Guide', description: 'Islamic Funeral Rites',  href: '/explore/janazah',                color: 'from-gray-500/20 to-gray-600/10', iconColor: 'text-gray-400' },
      { icon: GraduationCap, label: 'Local Scholars', description: 'Guyanese Islamic Scholars', href: '/explore/scholars',            color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
    ],
  },
  {
    key: 'ramadan',
    label: '🌙 Ramadan',
    items: [
      { icon: Moon,        label: 'Ramadan Hub',     description: 'Fasting & Worship',      href: '/ramadan',                        color: 'from-emerald-500/20 to-teal-600/10', iconColor: 'text-emerald-400' },
      { icon: ShieldAlert, label: 'Fasting Guide',   description: 'What breaks the fast?',  href: '/explore/ramadan/factors',        color: 'from-red-500/20 to-orange-600/10', iconColor: 'text-red-400' },
      { icon: HelpCircle,  label: 'Fidya Guide',     description: 'Missed fasts & Fidya',   href: '/explore/ramadan/fidya',          color: 'from-amber-500/20 to-orange-600/10', iconColor: 'text-amber-400' },
      { icon: UtensilsCrossed, label: 'Iftaar Feed', description: 'Community iftaar reports',href: '/iftaar',                        color: 'from-orange-500/20 to-amber-600/10', iconColor: 'text-orange-400' },
    ],
  },
  {
    key: 'sisters',
    label: '🌸 New Here? / Sisters',
    items: [
      { icon: MessageCircle, label: 'New to Islam',  description: 'Start your journey',     href: '/explore/new-to-islam',           color: 'from-emerald-500/20 to-teal-600/10', iconColor: 'text-emerald-400' },
      { icon: Heart,       label: 'Sisters',         description: 'For Muslim women',       href: '/explore/sisters',                color: 'from-rose-500/20 to-pink-600/10', iconColor: 'text-rose-400' },
      { icon: Moon,        label: 'Sisters in Ramadan', description: 'Worship during your cycle', href: '/explore/sisters/ramadan', color: 'from-rose-500/20 to-rose-600/10', iconColor: 'text-rose-400' },
      { icon: Baby,        label: 'Kids Corner',     description: 'Islamic learning for children', href: '/explore/kids',           color: 'from-yellow-500/20 to-yellow-600/10', iconColor: 'text-yellow-400' },
    ],
  },
  {
    key: 'tools',
    label: '🔧 Tools',
    items: [
      { icon: Sparkles,    label: '99 Names',        description: 'Asma Al-Husna',          href: '/explore/names',                  color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
      { icon: Heart,       label: 'Islamic Names',   description: 'Meanings & origins',     href: '/explore/names-search',           color: 'from-rose-500/20 to-pink-600/10', iconColor: 'text-rose-400' },
      { icon: Library,     label: 'Resources',       description: 'Islamic Learning',       href: '/explore/resources',              color: 'from-sky-500/20 to-sky-600/10', iconColor: 'text-sky-400' },
    ],
  },
]

const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'fiqh',      label: 'Fiqh' },
  { key: 'quran',     label: 'Quran' },
  { key: 'prayer',    label: 'Prayer' },
  { key: 'community', label: 'Community' },
  { key: 'ramadan',   label: 'Ramadan' },
  { key: 'sisters',   label: 'Sisters' },
  { key: 'tools',     label: 'Tools' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const { isRamadan, hijriYear } = getRamadanStatus()
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState('all')

  // Flat list of all items with their section key attached (for search results)
  const allItems = useMemo(() =>
    SECTIONS.flatMap(s => s.items.map(item => ({ ...item, sectionKey: s.key, sectionLabel: s.label }))),
    []
  )

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return allItems.filter(
      item =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sectionLabel.toLowerCase().includes(q)
    )
  }, [query, allItems])

  const visibleSections = useMemo(() => {
    if (filter === 'all') return SECTIONS
    return SECTIONS.filter(s => s.key === filter)
  }, [filter])

  const isSearching = query.trim().length > 0

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero icon={Compass} title="Explore" subtitle="Islamic Tools & Resources" gradient="from-rose-950 to-pink-900" stars />

      <div className="px-4 pt-4 space-y-3">

        {/* ── Search bar ── */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search features…"
            className="w-full rounded-2xl border border-gray-800 bg-gray-900 py-3 pl-11 pr-11 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-gray-600 focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Category filter pills ── */}
        {!isSearching && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f.key
                    ? 'bg-white text-gray-900'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Search results ── */}
        {isSearching && (
          <div>
            {searchResults && searchResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-800 py-12 text-center">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm text-gray-500">No results for &ldquo;{query}&rdquo;</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {searchResults?.map(item => (
                  <Link
                    key={item.label + item.href}
                    href={item.href}
                    className="glass flex flex-col items-center gap-3 rounded-2xl px-4 py-5 card-premium"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="mt-0.5 text-[10px] text-gray-500">{item.description}</p>
                      <span className="mt-1 inline-block rounded-full bg-gray-800 px-2 py-0.5 text-[9px] text-gray-500">
                        {item.sectionLabel.replace(/^[^ ]+ /, '')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Section grid (no search active) ── */}
        {!isSearching && (
          <>
            {/* Ramadan banner (only shown on All or Ramadan filter) */}
            {(filter === 'all' || filter === 'ramadan') && (
              <Link
                href="/ramadan"
                className={`glass flex items-center gap-4 rounded-2xl px-5 py-5 card-premium ${
                  isRamadan ? 'ring-1 ring-emerald-500/30' : 'grayscale opacity-60'
                }`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${
                  isRamadan ? 'from-emerald-500/25 to-emerald-600/15' : 'from-violet-500/20 to-purple-600/10'
                }`}>
                  <Moon className={`h-6 w-6 ${isRamadan ? 'text-emerald-400' : 'text-violet-400'}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ramadan</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {isRamadan ? `Ramadan ${hijriYear} AH — Active` : 'Outside Ramadan'}
                  </p>
                </div>
                {isRamadan && (
                  <span className="ml-auto rounded-full bg-emerald-900/40 px-2.5 py-1 text-[9px] font-bold text-emerald-400">
                    LIVE
                  </span>
                )}
              </Link>
            )}

            {visibleSections.map((section) => (
              <div key={section.key}>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mt-4 mb-2 px-1">
                  {section.label}
                </h2>
                <div className="grid grid-cols-2 gap-3 animate-stagger">
                  {section.items.map((item) => (
                    <Link
                      key={item.label + item.href}
                      href={item.href}
                      className="glass flex flex-col items-center gap-3 rounded-2xl px-4 py-6 card-premium"
                    >
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="mt-0.5 text-[11px] text-gray-500">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
