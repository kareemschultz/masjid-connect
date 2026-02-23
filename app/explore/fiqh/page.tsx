'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Scale, ChevronDown, ChevronUp, Heart, Share2 } from 'lucide-react'
import { getItem, setItem } from '@/lib/storage'
import { shareOrCopy } from '@/lib/share'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import {
  FIQH_TOPICS,
  CHAPTER_ORDER,
  BADGE,
  type FiqhTopic,
  type FiqhHadith,
  type FiqhExample,
} from '@/lib/fiqh-data'

// ─── Component ────────────────────────────────────────────────────────────────

function FiqhHubContent() {
  const searchParams = useSearchParams()

  const [activeChapter, setActiveChapter] = useState<string | null>(null)
  const [sistersMode, setSistersMode] = useState(false)
  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    const saved = getItem<string[]>('fiqh_bookmarks', [])
    return new Set(saved)
  })
  const [showSaved, setShowSaved] = useState(false)

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      setItem('fiqh_bookmarks', [...next])
      return next
    })
  }

  // Read URL params on mount
  useEffect(() => {
    const sisters = searchParams.get('sisters')
    const chapter = searchParams.get('chapter')
    if (sisters === 'true') setSistersMode(true)
    if (chapter) {
      const match = CHAPTER_ORDER.find(
        c => c.toLowerCase() === chapter.toLowerCase()
      )
      if (match) setActiveChapter(match)
    }
  }, [searchParams])

  const filtered = useMemo(() => {
    let list: FiqhTopic[] = FIQH_TOPICS
    if (activeChapter) list = list.filter(t => t.chapter === activeChapter)
    if (sistersMode) list = list.filter(t => t.sistersRelevant)
    if (showSaved) list = list.filter(t => bookmarks.has(t.id))
    return list
  }, [activeChapter, sistersMode, showSaved, bookmarks])

  // Group by chapter (preserving order)
  const grouped = useMemo(() => {
    const map: Record<string, FiqhTopic[]> = {}
    for (const t of filtered) {
      if (!map[t.chapter]) map[t.chapter] = []
      map[t.chapter].push(t)
    }
    return CHAPTER_ORDER
      .filter(ch => map[ch])
      .map(ch => ({ chapter: ch, topics: map[ch] }))
  }, [filtered])

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Scale}
        title="Fiqh Guide"
        subtitle="Islamic Law & Jurisprudence"
        gradient="from-violet-950 to-purple-900"
        showBack
      
        heroTheme="fiqh"
      />

      {/* ── Hanafi badge ───────────────────────────────── */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2">
          <span className="shrink-0 rounded-lg bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-400 border border-violet-500/20">
            Hanafi Fiqh
          </span>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Primary position: <span className="text-violet-300">Hanafi madhab</span> (predominant in Guyana). Positions of Imam Shafi&apos;i, Imam Malik, and Imam Ahmad ibn Hanbal noted where they differ.
          </p>
        </div>
      </div>

      {/* ── Sticky filter bar ──────────────────────────── */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border/50 px-4 py-2.5 space-y-2">
        {/* Row 1: Chapter pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => setActiveChapter(null)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              !activeChapter ? 'bg-violet-600 text-foreground' : 'bg-secondary text-muted-foreground/80'
            }`}
          >
            All
          </button>
          {CHAPTER_ORDER.map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChapter(activeChapter === ch ? null : ch)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeChapter === ch ? 'bg-violet-600 text-foreground' : 'bg-secondary text-muted-foreground/80'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Row 2: Sisters filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSistersMode(!sistersMode)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              sistersMode
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-secondary text-muted-foreground/80'
            }`}
          >
            Sisters Filter
          </button>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              showSaved ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-secondary text-muted-foreground/80'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${showSaved ? 'fill-rose-400' : ''}`} />
            {bookmarks.size > 0 ? `Saved (${bookmarks.size})` : 'Saved'}
          </button>
          {sistersMode && (
            <span className="text-[10px] text-rose-400/60">
              Showing sisters-relevant topics only
            </span>
          )}
        </div>
      </div>

      {/* ── Topics ─────────────────────────────────────── */}
      <div data-tour="fiqh-chapters" className="px-4 pt-4 space-y-1">
        {grouped.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center">
            <p className="text-sm text-muted-foreground/80">No topics match the current filters</p>
          </div>
        )}

        {grouped.map(({ chapter, topics }) => (
          <div key={chapter}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-4 mb-2">
              {chapter}
            </h2>

            <div className="space-y-2 animate-stagger">
              {topics.map(topic => {
                const isOpen = openTopic === topic.id
                return (
                  <div
                    key={topic.id}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    {/* Header */}
                    <button
                      onClick={() => setOpenTopic(isOpen ? null : topic.id)}
                      className="flex w-full items-center gap-3 p-4 text-left active:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground">{topic.title}</h3>
                          {topic.rulingType && (
                            <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${BADGE[topic.rulingType]}`}>
                              {topic.rulingType}
                            </span>
                          )}
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      )}
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-3">
                        {/* Overview */}
                        {topic.overview && (
                          <p className="text-xs text-muted-foreground leading-relaxed italic">
                            {topic.overview}
                          </p>
                        )}

                        {/* Context */}
                        {topic.context && (
                          <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
                            {topic.context}
                          </p>
                        )}

                        {/* Hadith boxes */}
                        {topic.hadith && topic.hadith.length > 0 && (
                          <div className="space-y-2">
                            {topic.hadith.map((h: FiqhHadith, i: number) => (
                              <div key={i} className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3 space-y-1.5">
                                <p className="font-arabic text-sm text-teal-300 leading-loose" dir="rtl">
                                  {h.arabic}
                                </p>
                                {h.transliteration && (
                                  <p className="text-[11px] text-teal-400/70 italic">
                                    {h.transliteration}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {h.translation}
                                </p>
                                <p className="text-[10px] text-teal-500/60 font-semibold">
                                  {h.source}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Points */}
                        <ul className="space-y-2">
                          {topic.points.map((point, i) => (
                            <li key={i} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Examples */}
                        {topic.examples && topic.examples.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Examples</p>
                            {topic.examples.map((ex: FiqhExample, i: number) => (
                              <div key={i} className="rounded-xl bg-secondary/60 border border-border/50 p-3 space-y-1">
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-semibold text-muted-foreground">Scenario:</span> {ex.scenario}
                                </p>
                                <p className="text-xs text-emerald-400">
                                  <span className="font-semibold">Ruling:</span> {ex.ruling}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Definitions */}
                        {topic.definitions && Object.keys(topic.definitions).length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Key Terms</p>
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(topic.definitions).map(([term, def]) => (
                                <div key={term} className="rounded-lg bg-violet-500/10 border border-violet-500/20 px-2.5 py-1.5">
                                  <p className="text-[10px] font-bold text-violet-400">{term}</p>
                                  <p className="text-[10px] text-muted-foreground leading-snug">{def}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Table */}
                        {topic.table && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-muted-foreground">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="py-2 pr-4 text-left text-muted-foreground/80 font-semibold">{topic.table.col1}</th>
                                  <th className="py-2 text-left text-muted-foreground/80 font-semibold">{topic.table.col2}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {topic.table.rows.map(([c1, c2], i) => (
                                  <tr key={i} className="border-b border-border/50">
                                    <td className="py-1.5 pr-4">{c1}</td>
                                    <td className="py-1.5">{c2}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Note */}
                        {topic.note && (
                          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5">
                            <p className="text-[11px] leading-relaxed text-amber-400">
                              {topic.note}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              shareOrCopy({
                                title: topic.title,
                                text: `${topic.title}\n\n${topic.points[0]}\n\n— via MasjidConnect GY Fiqh Guide`,
                              })
                            }}
                            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold bg-secondary text-muted-foreground/80 active:bg-muted transition-all"
                          >
                            <Share2 className="h-3 w-3" />
                            Share
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBookmark(topic.id)
                            }}
                            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                              bookmarks.has(topic.id) ? 'bg-rose-500/20 text-rose-400' : 'bg-secondary text-muted-foreground/80 active:bg-muted'
                            }`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${bookmarks.has(topic.id) ? 'fill-rose-400' : ''}`} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Disclaimer ─────────────────────────────────── */}
      <div className="px-4 pt-6 pb-4">
        <p className="text-[10px] leading-relaxed text-muted-foreground/60 text-center">
          This guide presents the Hanafi position as primary (predominant madhab in Guyana) with notes
          on other schools. Sources: Al Fiqh-ul Muyassar (Maulana Shafeequr Rahman An-Nadvi),
          Islamic Jurisprudence I &amp; II (GII), Halal and Haram in Everyday Life (GII).
          For specific personal rulings, consult a qualified scholar (Mufti/Aalim).
        </p>
      </div>

      <BottomNav />
    </div>
  )
}

export default function FiqhHubPage() {
  return (
    <Suspense>
      <FiqhHubContent />
    </Suspense>
  )
}
