'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SURAHS } from '@/lib/quran-data'
import { getItem, setItem, KEYS } from '@/lib/storage'
import {
  BookOpen, Play, Pause, SkipForward, Repeat, Bookmark, Loader2, Brain,
  ChevronUp, Type, Minus, Plus, Share2
} from 'lucide-react'
import { shareOrCopy } from '@/lib/share'
import Link from 'next/link'

interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation: string
}

const FONT_SIZES = [20, 24, 28, 32, 36]

export default function SurahReaderPage() {
  const params = useParams()
  const surahNum = Number(params.surah)
  const surah = SURAHS.find((s) => s.number === surahNum)

  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentAyah, setCurrentAyah] = useState(-1)
  const [loopMode, setLoopMode] = useState(false)
  const [bookmarks, setBookmarks] = useState<{ surah: number; ayah: number }[]>([])
  const [speed, setSpeed] = useState(1)
  const [fontSize, setFontSize] = useState(28)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setBookmarks(getItem(KEYS.BOOKMARKS, []))
    setFontSize(getItem(KEYS.QURAN_FONT_SIZE, 28))
  }, [])

  // Save last read position
  useEffect(() => {
    if (surah) {
      setItem(KEYS.LAST_READ, { surah: surahNum, name: surah.englishName })
    }
  }, [surahNum, surah])

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchAyahs() {
      try {
        const reciter = getItem(KEYS.RECITER, 'ar.alafasy')
        const [arRes, enRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/${reciter}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/en.asad`),
        ])
        const arData = await arRes.json()
        const enData = await enRes.json()

        if (arData.data?.ayahs && enData.data?.ayahs) {
          const merged: Ayah[] = arData.data.ayahs.map((ar: { number: number; numberInSurah: number; text: string }, i: number) => ({
            number: ar.number,
            numberInSurah: ar.numberInSurah,
            text: ar.text,
            translation: enData.data.ayahs[i]?.text || '',
          }))
          setAyahs(merged)
        }
      } catch {
        setAyahs([])
      } finally {
        setLoading(false)
      }
    }
    fetchAyahs()
  }, [surahNum])

  const playAyah = useCallback((ayahGlobalNumber: number, ayahIndex: number) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const reciter = getItem(KEYS.RECITER, 'ar.alafasy')
    const audio = new Audio(
      `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahGlobalNumber}.mp3`
    )
    audio.playbackRate = speed
    audioRef.current = audio
    setCurrentAyah(ayahIndex)
    setPlaying(true)

    audio.play().catch(() => {
      setPlaying(false)
    })

    audio.onended = () => {
      if (loopMode) {
        playAyah(ayahGlobalNumber, ayahIndex)
      } else if (ayahIndex < ayahs.length - 1) {
        const nextAyah = ayahs[ayahIndex + 1]
        playAyah(nextAyah.number, ayahIndex + 1)
      } else {
        setPlaying(false)
        setCurrentAyah(-1)
      }
    }
  }, [ayahs, loopMode, speed])

  const togglePlay = () => {
    if (playing && audioRef.current) {
      audioRef.current.pause()
      setPlaying(false)
    } else if (ayahs.length > 0) {
      const idx = currentAyah >= 0 ? currentAyah : 0
      playAyah(ayahs[idx].number, idx)
    }
  }

  const skipNext = () => {
    if (currentAyah < ayahs.length - 1 && ayahs.length > 0) {
      const nextIdx = currentAyah + 1
      playAyah(ayahs[nextIdx].number, nextIdx)
    }
  }

  const toggleBookmark = (ayahNum: number) => {
    const exists = bookmarks.some((b) => b.surah === surahNum && b.ayah === ayahNum)
    const updated = exists
      ? bookmarks.filter((b) => !(b.surah === surahNum && b.ayah === ayahNum))
      : [...bookmarks, { surah: surahNum, ayah: ayahNum }]
    setBookmarks(updated)
    setItem(KEYS.BOOKMARKS, updated)
  }

  const isBookmarked = (ayahNum: number) =>
    bookmarks.some((b) => b.surah === surahNum && b.ayah === ayahNum)

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5]
    const idx = speeds.indexOf(speed)
    const newSpeed = speeds[(idx + 1) % speeds.length]
    setSpeed(newSpeed)
    if (audioRef.current) audioRef.current.playbackRate = newSpeed
  }

  const adjustFontSize = (delta: number) => {
    const currentIdx = FONT_SIZES.indexOf(fontSize)
    const newIdx = Math.max(0, Math.min(FONT_SIZES.length - 1, currentIdx + delta))
    const newSize = FONT_SIZES[newIdx]
    setFontSize(newSize)
    setItem(KEYS.QURAN_FONT_SIZE, newSize)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!surah) return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Surah not found</div>

  return (
    <div ref={scrollRef} className="min-h-screen bg-background pb-40">
      <PageHero
        icon={BookOpen}
        title={surah.englishName}
        subtitle={surah.englishNameTranslation}
        gradient="from-violet-900 to-purple-900"
        showBack
      />

      {/* Surah info bar */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/50 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="font-arabic text-lg text-foreground">{surah.name}</span>
          <span className="text-xs text-gray-400">
            {surah.numberOfAyahs} Ayahs
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Font size controls */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-800 p-1">
            <button
              onClick={() => adjustFontSize(-1)}
              className="flex h-7 w-7 items-center justify-center rounded text-gray-400 active:text-white"
              aria-label="Decrease font size"
            >
              <Minus className="h-3 w-3" />
            </button>
            <Type className="h-3.5 w-3.5 text-gray-500" />
            <button
              onClick={() => adjustFontSize(1)}
              className="flex h-7 w-7 items-center justify-center rounded text-gray-400 active:text-white"
              aria-label="Increase font size"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <Link
            href="/quran/hifz"
            className="flex items-center gap-1 rounded-lg bg-indigo-500/15 px-2.5 py-1 text-[10px] font-medium text-indigo-400"
          >
            <Brain className="h-3 w-3" />
            Hifz
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm text-gray-400">Loading surah...</p>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-4">
          {/* Bismillah */}
          {surahNum !== 1 && surahNum !== 9 && (
            <div className="py-4 text-center">
              <p className="font-arabic text-2xl leading-loose text-amber-400">
                {'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'}
              </p>
              <p className="mt-1 text-xs text-gray-400">In the name of Allah, the Most Gracious, the Most Merciful</p>
            </div>
          )}

          {ayahs.map((ayah, i) => (
            <div
              key={ayah.number}
              id={`ayah-${ayah.numberInSurah}`}
              className={`rounded-2xl border p-4 transition-all ${
                currentAyah === i
                  ? 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/5'
                  : 'border-gray-800 bg-gray-900'
              }`}
            >
              {/* Ayah header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/15">
                  <span className="text-[10px] font-bold text-purple-400">{ayah.numberInSurah}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => playAyah(ayah.number, i)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      currentAyah === i && playing ? 'text-emerald-400' : 'text-gray-400 active:text-emerald-400'
                    }`}
                    aria-label={`Play ayah ${ayah.numberInSurah}`}
                  >
                    {currentAyah === i && playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => toggleBookmark(ayah.numberInSurah)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isBookmarked(ayah.numberInSurah) ? 'text-amber-400' : 'text-gray-400'
                    }`}
                    aria-label={`Bookmark ayah ${ayah.numberInSurah}`}
                  >
                    <Bookmark className={`h-3.5 w-3.5 ${isBookmarked(ayah.numberInSurah) ? 'fill-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => shareOrCopy({
                      title: `${surah?.englishName} ${ayah.numberInSurah}`,
                      text: `${ayah.text}\n\n"${ayah.translation}"\n\n- ${surah?.englishName} (${surah?.englishNameTranslation}), Ayah ${ayah.numberInSurah}\n\nvia MasjidConnect GY`
                    })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors active:text-emerald-400"
                    aria-label={`Share ayah ${ayah.numberInSurah}`}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Arabic text */}
              <p
                className="mb-3 text-right font-arabic leading-[2.2] text-foreground"
                dir="rtl"
                style={{ fontSize: `${fontSize}px` }}
              >
                {ayah.text}
              </p>

              {/* Translation */}
              <p className="text-sm leading-relaxed text-gray-400">
                {ayah.translation}
              </p>
            </div>
          ))}

          {/* Reading progress */}
          {ayahs.length > 0 && (
            <div className="py-6 text-center">
              <p className="text-xs text-gray-500">
                End of {surah.englishName} - {ayahs.length} Ayahs
              </p>
              {surahNum < 114 && (
                <Link
                  href={`/quran/${surahNum + 1}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-purple-500/10 px-5 py-2.5 text-sm font-medium text-purple-400 transition-all active:scale-95"
                >
                  Next Surah
                  <SkipForward className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-36 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 shadow-lg transition-all active:scale-90"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* Playback controls */}
      <div className="fixed bottom-[72px] left-0 right-0 z-40 border-t border-gray-800 bg-gray-950/95 px-4 py-3 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <button
            onClick={cycleSpeed}
            className="flex h-9 items-center rounded-lg bg-gray-800 px-3 text-xs font-semibold text-gray-300"
          >
            {speed}x
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLoopMode(!loopMode)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                loopMode ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'
              }`}
              aria-label="Loop"
            >
              <Repeat className="h-5 w-5" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <button
              onClick={skipNext}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500"
              aria-label="Next ayah"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          <div className="w-12 text-center">
            {currentAyah >= 0 && (
              <span className="text-[10px] text-gray-500">
                {currentAyah + 1}/{ayahs.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
