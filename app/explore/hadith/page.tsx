'use client'

import { useState, useMemo } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { NAWAWI_HADITH, HADITH_CATEGORIES } from '@/lib/hadith-nawawi'

export default function HadithPage() {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [openHadith, setOpenHadith] = useState<number | null>(null)

  const filtered = useMemo(() => {
    let list = NAWAWI_HADITH
    if (filter !== 'all') {
      list = list.filter(h => h.category === filter || (filter === 'faith' && h.category === 'intention'))
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        h =>
          h.title.toLowerCase().includes(q) ||
          h.translation.toLowerCase().includes(q) ||
          h.commentary.toLowerCase().includes(q)
      )
    }
    return list
  }, [filter, query])

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={BookOpen}
        title="40 Hadith An-Nawawi"
        subtitle="Essential hadith every Muslim should know"
        gradient="from-amber-950 to-orange-900"
        showBack
      
        heroTheme="hadith"
      />

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border/50 px-4 py-2.5 space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search hadith..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-9 text-sm text-foreground/80 placeholder-gray-600 outline-none focus:border-gray-600"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/80 hover:text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {HADITH_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filter === cat.key
                  ? 'bg-amber-600 text-foreground'
                  : 'bg-secondary text-muted-foreground/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Hadith list ── */}
      <div className="px-4 pt-4 space-y-2">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center">
            <p className="text-sm text-muted-foreground/80">No hadith match your search</p>
          </div>
        )}

        {filtered.map(hadith => {
          const isOpen = openHadith === hadith.number
          return (
            <div
              key={hadith.number}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setOpenHadith(isOpen ? null : hadith.number)}
                className="flex w-full items-center gap-3 p-4 text-left active:bg-secondary/50 transition-colors"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-xs font-bold text-teal-400">
                  {hadith.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{hadith.title}</h3>
                  <p className="text-[10px] text-muted-foreground/80 mt-0.5">{hadith.source}</p>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                )}
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Arabic */}
                  <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3">
                    <p
                      className="font-arabic text-base text-teal-300 leading-[2.2]"
                      dir="rtl"
                    >
                      {hadith.arabic}
                    </p>
                  </div>

                  {/* Transliteration */}
                  <p className="text-[11px] italic text-amber-400/80 leading-relaxed">
                    {hadith.transliteration}
                  </p>

                  {/* Translation */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {hadith.translation}
                  </p>

                  {/* Commentary */}
                  <div className="border-l-2 border-border pl-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1">Commentary</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {hadith.commentary}
                    </p>
                  </div>

                  {/* Source badge */}
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/80">
                      {hadith.source}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
