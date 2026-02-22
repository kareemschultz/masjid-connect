'use client'

import { useState } from 'react'
import { BookOpen, Search, MapPin, Star } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SURAHS } from '@/lib/quran-data'
import Link from 'next/link'

export default function QuranPage() {
  const [search, setSearch] = useState('')

  const filtered = SURAHS.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search)
  )

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={BookOpen}
        title="Quran"
        subtitle="Read & Listen"
        gradient="from-violet-900 to-purple-900"
      />

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search surah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder-gray-500 outline-none"
          />
        </div>
      </div>

      {/* Surah List */}
      <div className="px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          {filtered.map((surah, i) => (
            <Link
              key={surah.number}
              href={`/quran/${surah.number}`}
              className={`flex items-center gap-4 px-4 py-3.5 transition-colors active:bg-white/5 ${
                i < filtered.length - 1 ? 'border-b border-gray-800/50' : ''
              }`}
            >
              {/* Number badge */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15">
                <span className="text-xs font-bold text-purple-400">{surah.number}</span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{surah.englishName}</span>
                  <span className="flex items-center gap-0.5 rounded-md bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">
                    <MapPin className="h-2.5 w-2.5" />
                    {surah.revelationType}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{surah.englishNameTranslation}</p>
              </div>

              {/* Arabic name */}
              <div className="text-right">
                <p className="font-arabic text-lg leading-none text-foreground">{surah.name}</p>
                <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-gray-500">
                  <Star className="h-2.5 w-2.5" />
                  {surah.numberOfAyahs} ayahs
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
