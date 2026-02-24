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
import { CardAnimation, type CardAnimationTheme } from '@/components/card-animations'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    key: 'learning',
    label: 'Learning Hub',
    description: 'Master your deen with structured courses and resources',
    icon: GraduationCap,
    gradient: 'from-indigo-600/20 to-purple-600/10',
    iconColor: 'text-indigo-400',
    items: [
      { icon: BookOpen,    label: 'Quran',          description: 'Read & Listen',          href: '/quran',                          color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400', animationTheme: 'quran' as CardAnimationTheme },
      { icon: Scale,       label: 'Fiqh Guide',        description: 'Islamic Law reference',  href: '/explore/fiqh',                   color: 'from-violet-500/20 to-purple-600/10', iconColor: 'text-violet-400', animationTheme: 'fiqh' as CardAnimationTheme },
      { icon: BookText,    label: 'Hadith',           description: '40 Nawawi Hadith',       href: '/explore/hadith',                 color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400', animationTheme: 'hadith' as CardAnimationTheme },
      { icon: GraduationCap, label: 'Madrasa',      description: 'Learn Islam',            href: '/explore/madrasa',                color: 'from-indigo-500/20 to-indigo-600/10', iconColor: 'text-indigo-400', animationTheme: 'madrasa' as CardAnimationTheme },
      { icon: Headphones,  label: 'Lectures',        description: 'Audio Series',           href: '/explore/lectures',               color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400', animationTheme: 'lectures' as CardAnimationTheme },
      { icon: Brain,       label: 'Hifz Mode',       description: 'Memorize Quran',         href: '/quran/hifz',                     color: 'from-indigo-500/20 to-indigo-600/10', iconColor: 'text-indigo-400', animationTheme: 'hifz' as CardAnimationTheme },
      { icon: Users,       label: 'Prophets',        description: '25 Quranic Stories',     href: '/explore/madrasa/prophets',       color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400', animationTheme: 'prophets' as CardAnimationTheme },
      { icon: Keyboard,    label: 'Arabic Practice', description: 'Learn the Letters',      href: '/explore/madrasa/arabic-typing',  color: 'from-cyan-500/20 to-cyan-600/10', iconColor: 'text-cyan-400', animationTheme: 'arabic' as CardAnimationTheme },
      { icon: Library,     label: 'GII Library',     description: 'Islamic Books',          href: '/explore/madrasa/library',        color: 'from-sky-500/20 to-sky-600/10', iconColor: 'text-sky-400', animationTheme: 'hadith' as CardAnimationTheme },
    ],
  },
  {
    key: 'practice',
    label: 'Practice & Tools',
    description: 'Essential daily tools for every Muslim',
    icon: Sparkles,
    gradient: 'from-amber-600/20 to-orange-600/10',
    iconColor: 'text-amber-400',
    items: [
      { icon: BookOpen,    label: 'Duas',            description: 'Daily Supplications',    href: '/explore/duas',                   color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400', animationTheme: 'duas' as CardAnimationTheme },
      { icon: Star,        label: 'Adhkar',          description: 'Morning & Evening',      href: '/explore/adhkar',                 color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400', animationTheme: 'duas' as CardAnimationTheme },
      { icon: Circle,      label: 'Tasbih',          description: 'Digital Counter',        href: '/explore/tasbih',                 color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400', animationTheme: 'tasbih' as CardAnimationTheme },
      { icon: Navigation2, label: 'Qibla',           description: 'Find Direction',         href: '/explore/qibla',                  color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400', animationTheme: 'qibla' as CardAnimationTheme },
      { icon: Calculator,  label: 'Zakat',           description: 'Calculate Zakat',        href: '/explore/zakat',                  color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400', animationTheme: 'default' as CardAnimationTheme },
      { icon: Calendar,    label: 'Islamic Calendar',description: 'Hijri Dates & Events',   href: '/explore/calendar',               color: 'from-rose-500/20 to-rose-600/10', iconColor: 'text-rose-400', animationTheme: 'default' as CardAnimationTheme },
      { icon: Sun,         label: "Jumu'ah",         description: 'Friday Prayer Prep',     href: '/explore/jumuah',                 color: 'from-emerald-500/20 to-teal-600/10', iconColor: 'text-emerald-400', animationTheme: 'default' as CardAnimationTheme },
      { icon: Sparkles,    label: '99 Names',        description: 'Asma Al-Husna',          href: '/explore/names',                  color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400', animationTheme: 'arabic' as CardAnimationTheme },
      { icon: Heart,       label: 'Islamic Names',   description: 'Meanings & origins',     href: '/explore/names-search',           color: 'from-rose-500/20 to-pink-600/10', iconColor: 'text-rose-400', animationTheme: 'default' as CardAnimationTheme },
      { icon: Library,     label: 'Resources',       description: 'Islamic Learning',       href: '/explore/resources',              color: 'from-sky-500/20 to-sky-600/10', iconColor: 'text-sky-400', animationTheme: 'default' as CardAnimationTheme },
    ],
  },
  {
    key: 'community',
    label: 'Community Hub',
    description: 'Connect with your local community and services',
    icon: Users2,
    gradient: 'from-teal-600/20 to-emerald-600/10',
    iconColor: 'text-teal-400',
    items: [
      { icon: Users,       label: 'Buddy',           description: 'Faith Partners',         href: '/explore/buddy',                  color: 'from-cyan-500/20 to-cyan-600/10', iconColor: 'text-cyan-400', animationTheme: 'community' as CardAnimationTheme },
      { icon: Users2,      label: 'Community Feed',  description: 'Connect with Muslims',   href: '/explore/community',              color: 'from-violet-500/20 to-purple-600/10', iconColor: 'text-violet-400', animationTheme: 'community' as CardAnimationTheme },
      { icon: ShieldCheck, label: 'Halal Directory',  description: 'Certified businesses',   href: '/explore/halal-directory',       color: 'from-emerald-500/20 to-green-600/10', iconColor: 'text-emerald-400', animationTheme: 'halal' as CardAnimationTheme },
      { icon: ShieldCheck, label: 'Halal Guide',     description: 'Rulings & E-numbers',    href: '/explore/halal-guide',            color: 'from-teal-500/20 to-emerald-600/10', iconColor: 'text-teal-400', animationTheme: 'halal' as CardAnimationTheme },
      { icon: MapPin,      label: 'Masjids',         description: 'Masjid Directory',       href: '/masjids',                        color: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400', animationTheme: 'community' as CardAnimationTheme },
      { icon: GraduationCap, label: 'Local Scholars', description: 'Guyanese Scholars',      href: '/explore/scholars',            color: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400', animationTheme: 'madrasa' as CardAnimationTheme },
      { icon: HeartHandshake, label: 'Janazah Guide', description: 'Funeral Rites',          href: '/explore/janazah',                color: 'from-gray-500/20 to-gray-600/10', iconColor: 'text-muted-foreground', animationTheme: 'default' as CardAnimationTheme },
      { icon: UtensilsCrossed, label: 'Iftaar Feed', description: 'Community reports',      href: '/iftaar',                         color: 'from-orange-500/20 to-amber-600/10', iconColor: 'text-orange-400', animationTheme: 'community' as CardAnimationTheme },
      { icon: Calendar,    label: 'Events',          description: 'Upcoming Programs',      href: '/explore/events',                 color: 'from-blue-500/20 to-indigo-600/10', iconColor: 'text-blue-400', animationTheme: 'community' as CardAnimationTheme },
      { icon: HeartHandshake, label: 'Support the App', description: 'Keep it free',        href: '/support', color: 'from-amber-500/20 to-yellow-600/10', iconColor: 'text-amber-400', animationTheme: 'community' as CardAnimationTheme },
    ],
  },
  {
    key: 'sisters',
    label: 'Sisters & New Muslims',
    description: 'Dedicated resources for our sisters and new brothers',
    icon: Heart,
    gradient: 'from-rose-600/20 to-pink-600/10',
    iconColor: 'text-rose-400',
    items: [
      { icon: MessageCircle, label: 'New to Islam',  description: 'Start your journey',     href: '/explore/new-to-islam',           color: 'from-emerald-500/20 to-teal-600/10', iconColor: 'text-emerald-400', animationTheme: 'community' as CardAnimationTheme },
      { icon: Heart,       label: 'Sisters',         description: 'For Muslim women',       href: '/explore/sisters',                color: 'from-rose-500/20 to-pink-600/10', iconColor: 'text-rose-400', animationTheme: 'sisters' as CardAnimationTheme },
      { icon: Moon,        label: 'Sisters in Ramadan', description: 'Worship guide',       href: '/explore/sisters/ramadan', color: 'from-rose-500/20 to-rose-600/10', iconColor: 'text-rose-400', animationTheme: 'sisters' as CardAnimationTheme },
      { icon: Baby,        label: 'Kids Corner',     description: 'For children',           href: '/explore/kids',           color: 'from-yellow-500/20 to-yellow-600/10', iconColor: 'text-yellow-400', animationTheme: 'kids' as CardAnimationTheme },
    ],
  },
]


const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'learning',  label: 'Learning' },
  { key: 'practice',  label: 'Practice' },
  { key: 'community', label: 'Community' },
  { key: 'sisters',   label: 'Sisters' },
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
    <div className="min-h-screen bg-background pb-nav">
      <PageHero icon={Compass} title="Explore" subtitle="Islamic Tools & Resources" gradient="from-rose-950 to-pink-900" heroTheme="explore" />

      <div className="px-4 pt-4 space-y-4">

        {/* ── Search bar (Sticky) ── */}
        <div className="sticky top-0 z-50 -mx-4 px-4 pt-4 pb-3 bg-background border-b border-border/30">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search features…"
              className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-11 text-sm text-foreground/80 placeholder-gray-600 outline-none focus:border-gray-600 focus:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/80 hover:text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* ── Category filter pills ── */}
          {!isSearching && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    filter === f.key
                      ? 'bg-white text-gray-900'
                      : 'bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Search results ── */}
        {isSearching && (
          <div>
            {searchResults && searchResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border py-12 text-center">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm text-muted-foreground/80">No results for &ldquo;{query}&rdquo;</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {searchResults?.map(item => (
                  <Link
                    key={item.label + item.href}
                    href={item.href}
                    className="glass relative flex flex-col items-center gap-3 rounded-2xl px-4 py-5 card-premium overflow-hidden"
                  >
                    <CardAnimation theme={item.animationTheme} />
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">{item.label}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/80">{item.description}</p>
                      <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[9px] text-muted-foreground/80">
                        {item.sectionLabel}
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
          <div data-tour="explore-grid" className="space-y-6">
            {filter === 'all' && (
              <Link
                href="/ramadan"
                className={`glass relative flex items-center gap-4 rounded-2xl px-5 py-5 card-premium overflow-hidden ${
                  isRamadan ? 'ring-1 ring-emerald-500/30' : 'grayscale opacity-60'
                }`}
              >
                <CardAnimation theme="ramadan" />
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${
                  isRamadan ? 'from-emerald-500/25 to-emerald-600/15' : 'from-violet-500/20 to-purple-600/10'
                }`}>
                  <Moon className={`h-6 w-6 ${isRamadan ? 'text-emerald-400' : 'text-violet-400'}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Ramadan Hub</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/80">
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
              <div key={section.key} className="space-y-4" data-tour={`explore-hub-${section.key}`}>
                {/* Hub Header */}
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${section.gradient} p-5 border border-white/5`}>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/40 backdrop-blur-sm shadow-inner">
                      <section.icon className={`h-6 w-6 ${section.iconColor}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{section.label}</h2>
                      <p className="text-xs text-muted-foreground/80">{section.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 animate-stagger">
                  {section.items.map((item) => (
                    <Link
                      key={item.label + item.href}
                      href={item.href}
                      className="glass relative flex flex-col items-center gap-3 rounded-2xl px-4 py-6 card-premium overflow-hidden"
                    >
                      <CardAnimation theme={item.animationTheme} />
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-foreground">{item.label}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground/80 line-clamp-2">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
