'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Search, MapPin, Star, ChevronRight, Bookmark } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SURAHS } from '@/lib/quran-data'
import { getItem, KEYS } from '@/lib/storage'
import Link from 'next/link'

export default function QuranPage() {
  const [search, setSearch] = useState('')
  const [lastRead, setLastRead] = useState<{ surah: number; name: string } | null>(null)
  const [bookmarks, setBookmarks] = useState<{ surah: number; ayah: number }[]>([])

  useEffect(() => {
    setLastRead(getItem(KEYS.LAST_READ, null))
    setBookmarks(getItem(KEYS.BOOKMARKS, []))
  }, [])

  const bookmarkedSurahs = [...new Set(bookmarks.map((b) => b.surah))]

  const filtered = SURAHS.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      String(s.number) === search.trim()
  )

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={BookOpen}
        title="Quran"
        subtitle="Read & Listen"
        gradient="from-violet-900 to-purple-900"
      />

      {/* Continue reading card */}
      {lastRead && (
        <div className="px-4 pt-4">
          <Link
            href={`/quran/${lastRead.surah}`}
            className="flex items-center gap-4 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 transition-all active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
              <BookOpen className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-medium text-purple-300/70">Continue Reading</p>
              <p className="text-base font-semibold text-foreground">{lastRead.name}</p>
              <p className="text-[11px] text-gray-400">Surah {lastRead.surah}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-purple-400/50" />
          </Link>
        </div>
      )}

      {/* Bookmarked surahs */}
      {bookmarkedSurahs.length > 0 && (
        <div className="px-4 pt-4">
          <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Bookmark className="h-3 w-3 fill-amber-400 text-amber-400" />
            Bookmarked
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {bookmarkedSurahs.map((num) => {
              const s = SURAHS.find((s) => s.number === num)
              if (!s) return null
              return (
                <Link
                  key={num}
                  href={`/quran/${num}`}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-amber-500/15 bg-amber-500/5 px-3 py-2 transition-all active:scale-95"
                >
                  <span className="text-xs font-bold text-amber-400">{s.number}</span>
                  <span className="text-xs font-medium text-foreground">{s.englishName}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, number, or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder-gray-500 outline-none"
          />
        </div>
      </div>

      {/* Surah List */}
      <div className="px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          {filtered.map((surah, i) => {
            const hasBookmark = bookmarkedSurahs.includes(surah.number)
            return (
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
                    {hasBookmark && <Bookmark className="h-3 w-3 fill-amber-400 text-amber-400" />}
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
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
