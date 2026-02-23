'use client'

import { useState, useMemo, useRef } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { BookOpen, Search, X } from 'lucide-react'
import { GLOSSARY_TERMS, CATEGORY_LABELS, type GlossaryCategory } from '@/lib/islamic-glossary'

const ALL_CATEGORIES: (GlossaryCategory | 'all')[] = ['all', 'pillars', 'prayer', 'quran', 'fiqh', 'aqeedah', 'character', 'worship', 'community', 'greetings']

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function GlossaryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<GlossaryCategory | 'all'>('all')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Filter terms
  const filtered = useMemo(() => {
    let terms = GLOSSARY_TERMS
    if (category !== 'all') {
      terms = terms.filter(t => t.category === category)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      terms = terms.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.arabic.includes(search) ||
        t.definition.toLowerCase().includes(q)
      )
    }
    return terms.sort((a, b) => a.term.localeCompare(b.term))
  }, [search, category])

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(t)
    }
    return map
  }, [filtered])

  const scrollToLetter = (letter: string) => {
    const el = sectionRefs.current[letter]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={BookOpen}
        title="Islamic Glossary"
        subtitle="Words Every Muslim Should Know"
        gradient="from-blue-950 to-indigo-900"
        showBack
        heroTheme="quran"
      />

      <div className="px-4 pt-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search terms, Arabic, or definitions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-gray-900 border border-gray-800 py-3 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Term count */}
        <p className="text-xs text-gray-500">{filtered.length} term{filtered.length !== 1 ? 's' : ''}</p>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {ALL_CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                category === c
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              {c === 'all' ? 'All' : CATEGORY_LABELS[c].label}
            </button>
          ))}
        </div>

        {/* Alphabet index */}
        <div className="flex flex-wrap gap-1">
          {ALPHABET.map(letter => {
            const has = !!grouped[letter]
            return (
              <button
                key={letter}
                onClick={() => has && scrollToLetter(letter)}
                disabled={!has}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  has
                    ? 'bg-gray-800 text-white active:bg-blue-500/30'
                    : 'bg-gray-900/50 text-gray-700 cursor-default'
                }`}
              >
                {letter}
              </button>
            )
          })}
        </div>

        {/* Terms grouped by letter */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">No terms found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(grouped).sort().map(letter => (
              <div key={letter} ref={el => { sectionRefs.current[letter] = el }}>
                {/* Sticky letter header */}
                <div className="sticky top-0 z-10 bg-[#0a0b14] py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/15 text-sm font-bold text-blue-400">
                      {letter}
                    </span>
                    <div className="h-px flex-1 bg-gray-800" />
                    <span className="text-[10px] text-gray-600">{grouped[letter].length}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-2 pt-1">
                  {grouped[letter].map(term => {
                    const catStyle = CATEGORY_LABELS[term.category]
                    return (
                      <div key={term.id} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-base font-bold text-white">{term.term}</h3>
                            {term.plural && (
                              <p className="text-[11px] text-gray-500">Plural: {term.plural}</p>
                            )}
                          </div>
                          <p className="font-arabic text-lg text-blue-300/80 shrink-0" dir="rtl">{term.arabic}</p>
                        </div>
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold mb-2 ${catStyle.color}`}>
                          {catStyle.label}
                        </span>
                        <p className="text-sm text-gray-300 leading-relaxed">{term.definition}</p>
                        {term.usage && (
                          <p className="mt-2 text-xs italic text-gray-500">{term.usage}</p>
                        )}
                      </div>
                    )
                  })}
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
