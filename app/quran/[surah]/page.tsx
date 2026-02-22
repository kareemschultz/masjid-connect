'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SURAHS } from '@/lib/quran-data'
import { getItem, setItem, KEYS } from '@/lib/storage'
import {
  BookOpen, Play, Pause, SkipForward, Repeat, Bookmark, Loader2, Brain
} from 'lucide-react'
import Link from 'next/link'

interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation: string
}

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
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setBookmarks(getItem(KEYS.BOOKMARKS, []))
  }, [])

  useEffect(() => {
    async function fetchAyahs() {
      try {
        const [arRes, enRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/ar.alafasy`),
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

    const audio = new Audio(
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNumber}.mp3`
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

  if (!surah) return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Surah not found</div>

  return (
    <div className="min-h-screen bg-background pb-40">
      <PageHero
        icon={BookOpen}
        title={surah.englishName}
        subtitle={surah.englishNameTranslation}
        gradient="from-violet-900 to-purple-900"
        showBack
      />

      {/* Surah info bar */}
      <div className="flex items-center justify-center gap-4 border-b border-gray-800 bg-gray-900/50 px-4 py-2.5">
        <span className="font-arabic text-lg text-foreground">{surah.name}</span>
        <span className="text-xs text-gray-400">
          {surah.numberOfAyahs} Ayahs | {surah.revelationType}
        </span>
        <Link
          href="/quran/hifz"
          className="flex items-center gap-1 rounded-lg bg-indigo-500/15 px-2.5 py-1 text-[10px] font-medium text-indigo-400"
        >
          <Brain className="h-3 w-3" />
          Hifz Mode
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-4">
          {/* Bismillah */}
          {surahNum !== 1 && surahNum !== 9 && (
            <div className="py-4 text-center">
              <p className="font-arabic text-2xl leading-loose text-amber-400">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <p className="mt-1 text-xs text-gray-400">In the name of Allah, the Most Gracious, the Most Merciful</p>
            </div>
          )}

          {ayahs.map((ayah, i) => (
            <div
              key={ayah.number}
              className={`rounded-2xl border p-4 transition-all ${
                currentAyah === i
                  ? 'border-emerald-500/30 bg-emerald-500/5'
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 active:text-emerald-400"
                    aria-label={`Play ayah ${ayah.numberInSurah}`}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBookmark(ayah.numberInSurah)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isBookmarked(ayah.numberInSurah) ? 'text-amber-400' : 'text-gray-400'
                    }`}
                    aria-label={`Bookmark ayah ${ayah.numberInSurah}`}
                  >
                    <Bookmark className={`h-3.5 w-3.5 ${isBookmarked(ayah.numberInSurah) ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Arabic text */}
              <p className="mb-3 text-right font-arabic text-2xl leading-[2.2] text-foreground" dir="rtl">
                {ayah.text}
              </p>

              {/* Translation */}
              <p className="text-sm leading-relaxed text-gray-400">
                {ayah.translation}
              </p>
            </div>
          ))}
        </div>
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

          <div className="w-12" />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
