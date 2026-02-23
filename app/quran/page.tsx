'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Search, Star, ChevronRight, Bookmark, Target, Headphones, BookMarked, Layers } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SURAHS } from '@/lib/quran-data'
import { getItem, setItem, KEYS } from '@/lib/storage'
import Link from 'next/link'

const MODES = [
  {
    href: '/quran/mushaf',
    icon: Layers,
    label: 'Mus\'haf',
    desc: 'Page-by-page view',
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    textColor: 'text-amber-400',
  },
  {
    href: '/quran/1',
    icon: BookOpen,
    label: 'Read',
    desc: 'Arabic + Translation',
    gradient: 'from-purple-500/20 to-violet-500/10',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    textColor: 'text-purple-400',
  },
  {
    href: '/quran/recitation',
    icon: Headphones,
    label: 'Recitation',
    desc: '12 reciters · audio',
    gradient: 'from-teal-500/20 to-emerald-500/10',
    border: 'border-teal-500/20',
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
    textColor: 'text-teal-400',
  },
  {
    href: '/quran/hifz',
    icon: BookMarked,
    label: 'Memorise',
    desc: 'Hifz mode',
    gradient: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    textColor: 'text-rose-400',
  },
]

export default function QuranPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'meccan' | 'medinan' | 'bookmarked'>('all')
  const [lastRead, setLastRead] = useState<{ surah: number; name: string } | null>(null)
  const [lastPage, setLastPage] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<{ surah: number; ayah: number }[]>([])
  const [completedSurahs, setCompletedSurahs] = useState<number[]>([])

  useEffect(() => {
    setLastRead(getItem(KEYS.LAST_READ, null))
    setBookmarks(getItem(KEYS.BOOKMARKS, []))
    setCompletedSurahs(getItem(KEYS.KHATAM_PROGRESS, []))
    setLastPage(localStorage.getItem('quran_last_page'))
  }, [])

  const toggleKhatam = (num: number) => {
    const updated = completedSurahs.includes(num)
      ? completedSurahs.filter(n => n !== num)
      : [...completedSurahs, num]
    setCompletedSurahs(updated)
    setItem(KEYS.KHATAM_PROGRESS, updated)
  }

  const khatamPercent = Math.round((completedSurahs.length / 114) * 100)
  const bookmarkedSurahs = [...new Set(bookmarks.map((b) => b.surah))]

  const filtered = SURAHS.filter(s => {
    const matchSearch =
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      String(s.number) === search.trim()
    const matchFilter =
      filter === 'all' ||
      (filter === 'meccan' && s.revelationType === 'Meccan') ||
      (filter === 'medinan' && s.revelationType === 'Medinan') ||
      (filter === 'bookmarked' && bookmarkedSurahs.includes(s.number))
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={BookOpen}
        title="Quran"
        subtitle="114 surahs · 6,236 ayahs"
        gradient="from-violet-900 to-purple-900"
        stars
      />

      {/* ── Mode Cards ─────────────────────────────── */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-2.5">
          {MODES.map(m => (
            <Link
              key={m.href}
              href={m.href}
              className={`flex flex-col gap-2.5 rounded-2xl border ${m.border} bg-gradient-to-br ${m.gradient} p-4 transition-all active:scale-[0.97]`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.iconBg}`}>
                <m.icon className={`h-5 w-5 ${m.iconColor}`} />
              </div>
              <div>
                <p className={`text-sm font-bold ${m.textColor}`}>{m.label}</p>
                <p className="text-[11px] text-gray-400">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Continue Reading (Mushaf Page) ─────────── */}
      {lastPage && (
        <div className="px-4 pt-4">
          <div
            className="rounded-xl bg-emerald-900/30 border border-emerald-700/30 p-4 cursor-pointer transition-all active:scale-[0.98]"
            onClick={() => router.push(`/quran/mushaf?page=${lastPage}`)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-400 mb-1">Continue Reading</p>
                <p className="text-white font-semibold">Page {lastPage} / 604</p>
                <p className="text-xs text-gray-400 mt-0.5">Tap to resume</p>
              </div>
              <BookOpen className="h-8 w-8 text-emerald-400/60" />
            </div>
            <div className="mt-2 h-1 rounded-full bg-gray-800">
              <div className="h-1 rounded-full bg-emerald-500" style={{ width: `${(parseInt(lastPage) / 604) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Continue Reading (Surah) ─────────────────── */}
      {lastRead && (
        <div className="px-4 pt-4">
          <Link
            href={`/quran/${lastRead.surah}`}
            className="flex items-center gap-4 rounded-2xl border border-purple-500/20 bg-purple-500/10 px-4 py-3.5 transition-all active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20">
              <BookOpen className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-purple-300/60">Continue Reading</p>
              <p className="text-sm font-bold text-white">{lastRead.name}</p>
              <p className="text-[11px] text-gray-400">Surah {lastRead.surah}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-purple-400/50" />
          </Link>
        </div>
      )}

      {/* ── Khatam Progress ────────────────────────── */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3.5">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2937" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${khatamPercent}, 100`} strokeLinecap="round" />
            </svg>
            <span className="absolute text-xs font-bold text-emerald-400">{khatamPercent}%</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Khatam Progress</h3>
            </div>
            <p className="mt-0.5 text-xs text-gray-400">{completedSurahs.length} of 114 surahs completed</p>
            <p className="mt-1 text-[10px] text-gray-600">Long-press any surah to mark complete</p>
          </div>
        </div>
      </div>

      {/* ── Bookmarked Surahs ──────────────────────── */}
      {bookmarkedSurahs.length > 0 && (
        <div className="px-4 pt-4">
          <h3 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <Bookmark className="h-3 w-3 fill-amber-400 text-amber-400" />
            Bookmarked
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                  <span className="text-xs font-medium text-white">{s.englishName}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Surah Browser ──────────────────────────── */}
      <div className="px-4 pt-4">
        {/* Search */}
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, number, or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
          />
        </div>

        {/* Filter chips */}
        <div className="mb-3 flex gap-2">
          {(['all', 'meccan', 'medinan', 'bookmarked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-[11px] font-bold capitalize transition-all ${
                filter === f ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {f === 'bookmarked' ? `Saved (${bookmarkedSurahs.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Surah List */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          {filtered.map((surah, i) => {
            const hasBookmark = bookmarkedSurahs.includes(surah.number)
            const isCompleted = completedSurahs.includes(surah.number)
            return (
              <Link
                key={surah.number}
                href={`/quran/${surah.number}`}
                onContextMenu={(e) => { e.preventDefault(); toggleKhatam(surah.number) }}
                className={`flex items-center gap-4 px-4 py-3.5 transition-colors active:bg-white/5 ${
                  i < filtered.length - 1 ? 'border-b border-gray-800/50' : ''
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isCompleted ? 'bg-emerald-500/20' : 'bg-purple-500/15'}`}>
                  <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-400' : 'text-purple-400'}`}>{surah.number}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{surah.englishName}</span>
                    {hasBookmark && <Bookmark className="h-3 w-3 fill-amber-400 text-amber-400" />}
                    <span className="rounded-md bg-gray-800 px-1.5 py-0.5 text-[9px] text-gray-400">
                      {surah.revelationType === 'Meccan' ? 'Makkah' : 'Madinah'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">{surah.englishNameTranslation}</p>
                </div>
                <div className="text-right">
                  <p className="font-arabic text-xl leading-none text-white">{surah.name}</p>
                  <p className="mt-1 flex items-center justify-end gap-0.5 text-[10px] text-gray-600">
                    <Star className="h-2.5 w-2.5" />{surah.numberOfAyahs}
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
