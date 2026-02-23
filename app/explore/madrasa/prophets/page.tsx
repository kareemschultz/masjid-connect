'use client'

import { useState } from 'react'
import { BookOpen, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { PROPHETS, type ProphetStory } from '@/lib/prophets-data'
import Link from 'next/link'

function ProphetCard({ prophet }: { prophet: ProphetStory }) {
  const [expanded, setExpanded] = useState(false)
  const isMuhammad = prophet.name.includes('Muhammad')

  return (
    <button
      onClick={() => {
        if (isMuhammad) return // Muhammad card links to Seerah
        setExpanded(!expanded)
      }}
      className="w-full text-left rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden transition-all active:scale-[0.99]"
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-lg">
          {prophet.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{prophet.name}</h3>
            {prophet.title && (
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-400">
                {prophet.title}
              </span>
            )}
          </div>
          <p className="font-arabic text-base text-amber-400/80 mt-0.5">{prophet.arabicName}</p>
          <div className="mt-1.5 flex items-center gap-3 text-[10px] text-gray-500">
            <span>{prophet.era}</span>
            <span>&middot;</span>
            <span>Mentioned {prophet.quranMentions}x</span>
            <span>&middot;</span>
            <span>{prophet.keyVerse}</span>
          </div>
        </div>
        {isMuhammad ? (
          <Link
            href="/explore/madrasa/seerah"
            className="shrink-0 rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-[10px] font-bold text-emerald-400"
            onClick={e => e.stopPropagation()}
          >
            Seerah
          </Link>
        ) : (
          <div className="shrink-0 pt-1">
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        )}
      </div>

      {expanded && !isMuhammad && (
        <div className="border-t border-gray-800 px-4 py-3 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Story</p>
            <p className="text-xs leading-relaxed text-gray-300">{prophet.summary}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Key Lesson</p>
            <p className="text-xs leading-relaxed text-emerald-400/80">{prophet.lesson}</p>
          </div>
          <p className="text-[10px] text-gray-600">
            Key verse: Quran {prophet.keyVerse}
          </p>
        </div>
      )}
    </button>
  )
}

export default function ProphetsPage() {
  const [search, setSearch] = useState('')

  const filtered = PROPHETS.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.arabicName.includes(search) ||
      p.era.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={BookOpen}
        title="Stories of the Prophets"
        subtitle="Al-Anbiya' alayhim as-salam"
        gradient="from-amber-900 to-orange-900"
        showBack
      />

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prophets..."
            className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
          />
        </div>
      </div>

      {/* Count */}
      <p className="px-5 pt-3 text-[10px] font-medium text-gray-500">
        {filtered.length} of 25 prophets
      </p>

      {/* List */}
      <div className="space-y-2 px-4 pt-2">
        {filtered.map((prophet) => (
          <ProphetCard key={prophet.name} prophet={prophet} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-4 pt-10 text-center">
          <p className="text-sm text-gray-500">No prophets found for &ldquo;{search}&rdquo;</p>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
