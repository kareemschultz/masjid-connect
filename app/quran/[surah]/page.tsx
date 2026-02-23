'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SURAHS } from '@/lib/quran-data'
import { getItem, setItem, KEYS } from '@/lib/storage'
import {
  BookOpen, Play, Pause, SkipForward, Repeat, Bookmark, Loader2, Brain,
  ChevronUp, Type, Minus, Plus, Share2, Mic, X, ListMusic, Languages,
  SlidersHorizontal, Palette, ToggleLeft, ToggleRight
} from 'lucide-react'
import { shareOrCopy } from '@/lib/share'
import { QURAN_TRANSLATIONS } from '@/lib/quran-settings'
import Link from 'next/link'

interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation: string
}

const FONT_SIZES = [20, 24, 28, 32, 36]

const REPEAT_CYCLE = [1, 2, 3, 5, 0] // 0 = infinite loop

const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy' },
  { id: 'ar.abdurrahmaansudais', name: 'Sudais' },
  { id: 'ar.husary', name: 'Husary' },
  { id: 'ar.minshawi', name: 'Minshawi' },
  { id: 'ar.abdullahbasfar', name: 'Abdullah Basfar' },
  { id: 'ar.ahmedajamy', name: 'Ahmed Al-Ajamy' },
  { id: 'ar.hanirifai', name: 'Hani Rifai' },
  { id: 'ar.muhammadayyoub', name: 'Muhammad Ayyoub' },
  { id: 'ar.muhammadjibreel', name: 'Muhammad Jibreel' },
  { id: 'ar.shaatree', name: 'Abu Bakr Ash-Shaatree' },
  { id: 'ar.mahermuaiqly', name: 'Maher Al-Muaiqly' },
  { id: 'ar.saoodshuraym', name: 'Saud Al-Shuraym' },
]

// ─── Tajweed color parser ─────────────────────────────────────────────────────
// alquran.cloud quran-tajweed edition uses bracket notation: [code[:N][text]
const TAJWEED_COLORS: Record<string, string> = {
  n: '#FF7E1D', m: '#FF7E1D',        // ghunna (nasalization)
  q: '#DD0008',                       // qalqalah (echo)
  p: '#DD00D5', o: '#DD00D5', Q: '#DD00D5', // ikhfa / qalb
  u: '#169777', v: '#169777', f: '#169777',  // idgham (merging)
  i: '#26BFFD',                       // iqlab (conversion)
  r: '#337FFF', R: '#337FFF',         // madd (prolongation)
  e: '#4050FF', E: '#4050FF', x: '#4050FF',  // madd compulsory
}
function parseTajweedText(text: string): string {
  return text.replace(/\[([a-zA-Z])(?::\d+)?\[([^\]]+)\]/g, (_: string, code: string, content: string) => {
    const color = TAJWEED_COLORS[code]
    if (!color) return content
    return `<span style="color:${color}">${content}</span>`
  })
}

export default function SurahReaderPage() {
  const params = useParams()
  const surahNum = Number(params.surah)
  const surah = SURAHS.find((s) => s.number === surahNum)

  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentAyah, setCurrentAyah] = useState(-1)
  const [repeatCount, setRepeatCount] = useState(1) // 1=play once, 2/3/5=repeat N times, 0=infinite
  const [continuousPlay, setContinuousPlay] = useState(true)
  const [bookmarks, setBookmarks] = useState<{ surah: number; ayah: number }[]>([])
  const [speed, setSpeed] = useState(1)
  const [fontSize, setFontSize] = useState(28)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [reciter, setReciter] = useState('ar.alafasy')
  const [showReciterSheet, setShowReciterSheet] = useState(false)
  const [translation, setTranslation] = useState('en.sahih')
  const [displayScript, setDisplayScript] = useState<'uthmani' | 'indopak'>('uthmani')
  const [tajweedColors, setTajweedColors] = useState(false)
  const [tajweedData, setTajweedData] = useState<Record<number, string>>({})
  const [tajweedLoading, setTajweedLoading] = useState(false)
  const [showTranslationSheet, setShowTranslationSheet] = useState(false)
  const [showDisplaySheet, setShowDisplaySheet] = useState(false)
  const [tafsirVerse, setTafsirVerse] = useState<number | null>(null)
  const [tafsirText, setTafsirText] = useState('')
  const [tafsirLoading, setTafsirLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const repeatPlayCountRef = useRef(0)
  const tafsirCacheRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    setBookmarks(getItem(KEYS.BOOKMARKS, []))
    setFontSize(getItem(KEYS.QURAN_FONT_SIZE, 28))
    setReciter(getItem(KEYS.RECITER, 'ar.alafasy'))
    setTranslation(getItem(KEYS.QURAN_TRANSLATION, 'en.sahih'))
    setDisplayScript(getItem(KEYS.QURAN_SCRIPT, 'uthmani'))
    setTajweedColors(getItem(KEYS.QURAN_TAJWEED, false))
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
        const savedReciter = getItem(KEYS.RECITER, 'ar.alafasy')
        const savedTranslation = getItem(KEYS.QURAN_TRANSLATION, 'en.sahih')
        const [arRes, enRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/${savedReciter}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/${savedTranslation}`),
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

  // Re-fetch translation only when translation changes (not on initial mount)
  const translationMountedRef = useRef(false)
  useEffect(() => {
    if (!translationMountedRef.current) {
      translationMountedRef.current = true
      return
    }
    async function refetchTranslation() {
      try {
        const enRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/${translation}`)
        const enData = await enRes.json()
        if (enData.data?.ayahs) {
          setAyahs(prev => prev.map((ayah, i) => ({
            ...ayah,
            translation: enData.data.ayahs[i]?.text || ayah.translation,
          })))
        }
      } catch { /* keep existing translations on error */ }
    }
    refetchTranslation()
  }, [translation, surahNum])

  // Fetch tajweed data when color mode is enabled
  useEffect(() => {
    if (!tajweedColors) return
    if (Object.keys(tajweedData).length > 0) return // already loaded for this surah
    let cancelled = false
    async function loadTajweed() {
      setTajweedLoading(true)
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-tajweed`)
        const data = await res.json()
        if (!cancelled && data.data?.ayahs) {
          const map: Record<number, string> = {}
          data.data.ayahs.forEach((a: { numberInSurah: number; text: string }) => {
            map[a.numberInSurah] = parseTajweedText(a.text)
          })
          setTajweedData(map)
        }
      } catch { /* silently fail, fall back to plain text */ }
      finally { if (!cancelled) setTajweedLoading(false) }
    }
    loadTajweed()
    return () => { cancelled = true }
  }, [tajweedColors, surahNum]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset tajweed data when surah changes
  useEffect(() => { setTajweedData({}) }, [surahNum])

  const scriptClass = displayScript === 'indopak' ? 'font-indopak' : 'font-arabic'

  const playAyah = useCallback((ayahGlobalNumber: number, ayahIndex: number, resetRepeat = true) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    if (resetRepeat) repeatPlayCountRef.current = 0

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
      repeatPlayCountRef.current++

      // Check if we should repeat this ayah
      const shouldRepeat =
        repeatCount === 0 || // infinite loop
        repeatPlayCountRef.current < repeatCount

      if (shouldRepeat) {
        // Repeat same ayah
        playAyah(ayahGlobalNumber, ayahIndex, false)
      } else if (continuousPlay && ayahIndex < ayahs.length - 1) {
        // Advance to next ayah
        const nextAyah = ayahs[ayahIndex + 1]
        playAyah(nextAyah.number, ayahIndex + 1, true)
      } else {
        setPlaying(false)
        setCurrentAyah(-1)
      }
    }
  }, [ayahs, repeatCount, continuousPlay, speed, reciter])

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

  const cycleRepeat = () => {
    const idx = REPEAT_CYCLE.indexOf(repeatCount)
    setRepeatCount(REPEAT_CYCLE[(idx + 1) % REPEAT_CYCLE.length])
  }

  const selectReciter = (id: string) => {
    setReciter(id)
    setItem(KEYS.RECITER, id)
    setShowReciterSheet(false)
  }

  const selectTranslation = (key: string) => {
    setTranslation(key)
    setItem(KEYS.QURAN_TRANSLATION, key)
    setShowTranslationSheet(false)
  }

  const fetchTafsir = async (ayahNumberInSurah: number) => {
    if (tafsirVerse === ayahNumberInSurah) {
      setTafsirVerse(null)
      return
    }
    setTafsirVerse(ayahNumberInSurah)
    const cacheKey = `${surahNum}:${ayahNumberInSurah}`
    const cached = tafsirCacheRef.current.get(cacheKey)
    if (cached) {
      setTafsirText(cached)
      return
    }
    setTafsirLoading(true)
    setTafsirText('')
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNumberInSurah}/en.tafsir.en-tafisr-ibn-kathir`)
      const data = await res.json()
      const text = data?.data?.text || 'Tafsir not available for this verse.'
      tafsirCacheRef.current.set(cacheKey, text)
      setTafsirText(text)
    } catch {
      setTafsirText('Failed to load tafsir. Please try again.')
    } finally {
      setTafsirLoading(false)
    }
  }

  const getRepeatLabel = () => {
    if (repeatCount === 0) return '\u221E' // infinity symbol
    if (repeatCount === 1) return '1x'
    return `${repeatCount}x`
  }

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
    <div ref={scrollRef} className="min-h-screen bg-background pb-56">
      <PageHero
        icon={BookOpen}
        title={surah.englishName}
        subtitle={surah.englishNameTranslation}
        gradient="from-violet-900 to-purple-900"
        heroTheme="quran"
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
          <button
            onClick={() => setShowTranslationSheet(true)}
            className="flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-400"
          >
            <Languages className="h-3 w-3" />
            {QURAN_TRANSLATIONS.find(t => t.key === translation)?.label || 'Sahih Intl'}
          </button>
          <button
            onClick={() => setShowDisplaySheet(true)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-colors ${
              tajweedColors || displayScript === 'indopak'
                ? 'bg-violet-500/15 text-violet-400'
                : 'bg-gray-800 text-gray-400'
            }`}
            aria-label="Display options"
          >
            <Palette className="h-3 w-3" />
            Display
          </button>
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

              {/* Arabic text — tajweed or plain */}
              {tajweedColors && tajweedData[ayah.numberInSurah] ? (
                <p
                  className={`mb-3 text-right leading-[2.2] text-foreground ${scriptClass}`}
                  dir="rtl"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: tajweedData[ayah.numberInSurah] }}
                />
              ) : (
                <p
                  className={`mb-3 text-right leading-[2.2] text-foreground ${scriptClass}`}
                  dir="rtl"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {tajweedColors && tajweedLoading
                    ? <span className="text-gray-500 text-sm">Loading tajweed...</span>
                    : ayah.text
                  }
                </p>
              )}

              {/* Translation */}
              <p className="text-sm leading-relaxed text-gray-400">
                {ayah.translation}
              </p>

              {/* Tafsir button */}
              <button
                onClick={() => fetchTafsir(ayah.numberInSurah)}
                className={`mt-2 text-[10px] font-semibold transition-colors ${
                  tafsirVerse === ayah.numberInSurah ? 'text-amber-400' : 'text-emerald-500'
                }`}
              >
                {tafsirVerse === ayah.numberInSurah ? 'Hide Tafsir' : 'Tafsir'}
              </button>

              {/* Tafsir panel */}
              {tafsirVerse === ayah.numberInSurah && (
                <div className="mt-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-amber-500">Tafsir Ibn Kathir</p>
                  {tafsirLoading
                    ? <p className="text-xs text-gray-500">Loading...</p>
                    : <p className="max-h-60 overflow-y-auto text-xs leading-relaxed text-gray-400">{tafsirText}</p>
                  }
                </div>
              )}
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
          className="fixed right-4 z-[70] flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 shadow-lg transition-all active:scale-90" style={{ bottom: 'calc(max(env(safe-area-inset-bottom, 8px), 8px) + 120px)' }}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* Playback controls */}
      <div className="fixed left-0 right-0 z-[65] border-t border-gray-800 bg-gray-950/95 px-2 py-2 backdrop-blur-lg" style={{ bottom: 'calc(max(env(safe-area-inset-bottom, 8px), 8px) + 52px)' }}>
        {/* Reciter button row */}
        <div className="mx-auto flex max-w-lg items-center justify-between px-2 pb-1.5">
          <button
            onClick={() => setShowReciterSheet(true)}
            className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-2.5 py-1 text-[10px] font-medium text-gray-300 active:bg-gray-700"
          >
            <Mic className="h-3 w-3 text-purple-400" />
            {RECITERS.find((r) => r.id === reciter)?.name || 'Alafasy'}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={cycleSpeed}
              className="flex h-7 items-center rounded-lg bg-gray-800 px-2 text-[10px] font-semibold text-gray-300"
            >
              {speed}x
            </button>
            {currentAyah >= 0 && (
              <span className="text-[10px] text-gray-500">
                {currentAyah + 1}/{ayahs.length}
              </span>
            )}
          </div>
        </div>

        {/* Main controls */}
        <div className="mx-auto flex max-w-lg items-center justify-between px-2">
          <button
            onClick={cycleRepeat}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl ${
              repeatCount !== 1 ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500'
            }`}
            aria-label={`Repeat ${getRepeatLabel()}`}
          >
            <Repeat className="h-4.5 w-4.5" />
            <span className="absolute -bottom-0.5 text-[8px] font-bold">{getRepeatLabel()}</span>
          </button>

          <button
            onClick={() => setContinuousPlay(!continuousPlay)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              continuousPlay ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500'
            }`}
            aria-label={continuousPlay ? 'Continuous play on' : 'Continuous play off'}
          >
            <ListMusic className="h-5 w-5" />
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

          <div className="w-10" />
        </div>
      </div>

      {/* Reciter selector bottom sheet */}
      {showReciterSheet && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowReciterSheet(false)} />
          <div className="relative flex w-full max-w-lg flex-col rounded-t-3xl border-t border-gray-700 bg-gray-900 px-4 pb-6 pt-4" style={{ maxHeight: '80dvh' }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Choose Reciter</h3>
              <button
                onClick={() => setShowReciterSheet(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 active:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto overscroll-contain pb-2">
              {RECITERS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => selectReciter(r.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    reciter === r.id
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-gray-300 active:bg-gray-800'
                  }`}
                >
                  <Mic className={`h-4 w-4 shrink-0 ${reciter === r.id ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <span className="text-sm font-medium">{r.name}</span>
                  {reciter === r.id && (
                    <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Display options bottom sheet */}
      {showDisplaySheet && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowDisplaySheet(false)} />
          <div className="relative flex w-full max-w-lg flex-col rounded-t-3xl border-t border-gray-700 bg-gray-900 px-4 pt-4 pb-6" style={{ maxHeight: '80dvh' }}>
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <h3 className="text-sm font-bold text-white">Display Options</h3>
              <button onClick={() => setShowDisplaySheet(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 active:text-white" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Script section */}
            <p className="mb-2 shrink-0 text-[10px] font-bold uppercase tracking-wider text-gray-500">Arabic Script</p>
            <div className="mb-5 grid shrink-0 grid-cols-2 gap-2">
              <button
                onClick={() => { setDisplayScript('uthmani'); setItem(KEYS.QURAN_SCRIPT, 'uthmani') }}
                className={`rounded-xl px-3 py-4 text-center transition-colors ${displayScript === 'uthmani' ? 'bg-emerald-500/20 ring-1 ring-emerald-500/50' : 'bg-gray-800'}`}
              >
                <p className="font-arabic text-2xl text-white" style={{ lineHeight: '2' }}>بِسْمِ اللّٰهِ</p>
                <p className="mt-2 text-[10px] font-medium text-gray-400">Uthmani (Hafs)</p>
                {displayScript === 'uthmani' && <p className="mt-0.5 text-[9px] text-emerald-400">● Active</p>}
              </button>
              <button
                onClick={() => { setDisplayScript('indopak'); setItem(KEYS.QURAN_SCRIPT, 'indopak') }}
                className={`rounded-xl px-3 py-4 text-center transition-colors ${displayScript === 'indopak' ? 'bg-emerald-500/20 ring-1 ring-emerald-500/50' : 'bg-gray-800'}`}
              >
                <p className="font-indopak text-2xl text-white" style={{ lineHeight: '2.5' }}>بِسۡمِ اللّٰہِ</p>
                <p className="mt-2 text-[10px] font-medium text-gray-400">IndoPak Script</p>
                {displayScript === 'indopak' && <p className="mt-0.5 text-[9px] text-emerald-400">● Active</p>}
              </button>
            </div>

            {/* Tajweed section */}
            <p className="mb-2 shrink-0 text-[10px] font-bold uppercase tracking-wider text-gray-500">Tajweed Coloring</p>
            <button
              onClick={() => { const v = !tajweedColors; setTajweedColors(v); setItem(KEYS.QURAN_TAJWEED, v) }}
              className={`flex shrink-0 items-center gap-3 rounded-xl p-3 transition-colors ${tajweedColors ? 'bg-violet-500/15' : 'bg-gray-800'}`}
            >
              <Palette className={`h-5 w-5 ${tajweedColors ? 'text-violet-400' : 'text-gray-500'}`} />
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${tajweedColors ? 'text-violet-300' : 'text-gray-300'}`}>
                  Color-Coded Tajweed
                </p>
                <p className="text-[10px] text-gray-500">Highlight tajweed rules with colors</p>
              </div>
              {tajweedColors
                ? <ToggleRight className="h-5 w-5 text-violet-400" />
                : <ToggleLeft className="h-5 w-5 text-gray-600" />}
            </button>

            {/* Color legend */}
            {tajweedColors && (
              <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-xl bg-gray-800/60 p-3">
                {[
                  { color: '#FF7E1D', label: 'Ghunna (nasalization)' },
                  { color: '#DD0008', label: 'Qalqalah (echo)' },
                  { color: '#DD00D5', label: 'Ikhfa / Qalb' },
                  { color: '#169777', label: 'Idgham (merging)' },
                  { color: '#26BFFD', label: 'Iqlab (conversion)' },
                  { color: '#337FFF', label: 'Madd (prolongation)' },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-[10px] text-gray-400">{r.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Translation selector bottom sheet */}
      {showTranslationSheet && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowTranslationSheet(false)} />
          <div className="relative flex w-full max-w-lg flex-col rounded-t-3xl border-t border-gray-700 bg-gray-900 px-4 pb-6 pt-4" style={{maxHeight:'80dvh'}}>
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <h3 className="text-sm font-bold text-white">Choose Translation</h3>
              <button
                onClick={() => setShowTranslationSheet(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 active:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto overscroll-contain pb-6">
              {QURAN_TRANSLATIONS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => selectTranslation(t.key)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    translation === t.key
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-gray-300 active:bg-gray-800'
                  }`}
                >
                  <Languages className={`h-4 w-4 shrink-0 ${translation === t.key ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <div>
                    <span className="text-sm font-medium">{t.label}</span>
                    <p className="text-[10px] text-gray-500">{t.note}</p>
                  </div>
                  {translation === t.key && (
                    <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
