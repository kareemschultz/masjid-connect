'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Search, X, BookOpen, Heart } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { NAMES_DETAIL, type NameDetail } from '@/lib/asmaul-husna-detail'

const CATEGORY_COLORS: Record<NameDetail['category'], string> = {
  mercy: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
  knowledge: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  power: 'bg-red-500/15 text-red-400 border-red-500/25',
  creation: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
  sovereignty: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  beauty: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  justice: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  uniqueness: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
}

export default function NamesOfAllahPage() {
  const [search, setSearch] = useState('')
  const [selectedName, setSelectedName] = useState<NameDetail | null>(null)

  // Lock body scroll when sheet is open — save/restore position to avoid jump on close
  useEffect(() => {
    if (selectedName) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      const top = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (top) window.scrollTo(0, -parseInt(top, 10))
    }
    return () => {
      const top = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (top) window.scrollTo(0, -parseInt(top, 10))
    }
  }, [selectedName])

  const filtered = NAMES_DETAIL.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      n.meaning.toLowerCase().includes(search.toLowerCase()) ||
      n.arabic.includes(search)
  )

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Sparkles}
        title="99 Names of Allah"
        subtitle="Al-Asma Al-Husna"
        gradient="from-amber-900 to-yellow-900"
        showBack
      
        heroTheme="names"
      />

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder-gray-500 outline-none"
          />
        </div>
      </div>

      {/* Names Grid */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((name) => (
            <button
              key={name.number}
              onClick={() => setSelectedName(name)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 px-3 py-5 transition-all active:scale-95 active:bg-gray-800 w-full"
            >
              <span className="text-[10px] font-medium text-amber-500/60">{name.number}</span>
              <p className="font-arabic text-2xl leading-tight text-amber-400">{name.arabic}</p>
              <p className="text-xs font-semibold text-foreground">{name.transliteration}</p>
              <p className="text-center text-[11px] leading-snug text-gray-400">{name.meaning}</p>
              <span className="text-[9px] text-gray-700">tap for detail</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Detail Bottom Sheet ──────────────────────────────────────────── */}
      {selectedName && (
        <div className="fixed inset-0 z-[70] flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelectedName(null)}
          />

          {/* Sheet */}
          <div className="relative mt-auto flex max-h-[90vh] flex-col rounded-t-3xl bg-[#0a0b14] border-t border-gray-800">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-gray-700" />
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedName(null)}
              className="absolute right-4 top-4 rounded-full bg-gray-800 p-1.5"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center gap-2 px-6 pt-2 pb-4">
              <span className="text-xs font-medium text-amber-500/60">#{selectedName.number}</span>
              <p className="font-arabic text-4xl leading-tight text-amber-400">{selectedName.arabic}</p>
              <p className="text-base font-semibold text-foreground">{selectedName.transliteration}</p>
              <p className="text-sm text-gray-400">{selectedName.meaning}</p>
              <span className={`mt-1 rounded-full border px-3 py-0.5 text-[10px] font-medium capitalize ${CATEGORY_COLORS[selectedName.category]}`}>
                {selectedName.category}
              </span>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-10">
              {/* Root word */}
              <p className="mb-4 text-center text-xs text-gray-500">
                Root: <span className="font-arabic text-sm text-gray-400">{selectedName.rootWord}</span>
              </p>

              {/* ① What This Name Means */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm">&#9312;</span>
                  <h3 className="text-sm font-semibold text-foreground">What This Name Means</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-300">
                  {selectedName.explanation}
                </p>
              </div>

              {/* ② In the Quran */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm">&#9313;</span>
                  <h3 className="text-sm font-semibold text-foreground">In the Quran</h3>
                </div>
                <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-xs font-medium text-teal-400">{selectedName.quranRef}</span>
                  </div>
                  <p className="text-sm italic leading-relaxed text-gray-300">
                    &ldquo;{selectedName.quranText}&rdquo;
                  </p>
                </div>
              </div>

              {/* ③ Reflect & Benefit */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm">&#9314;</span>
                  <h3 className="text-sm font-semibold text-foreground">Reflect & Benefit</h3>
                </div>
                <div className="flex gap-3">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  <p className="text-sm leading-relaxed text-gray-300">
                    {selectedName.benefit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
