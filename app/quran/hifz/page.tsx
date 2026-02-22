'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Brain, Eye, EyeOff, ChevronRight, ChevronLeft, Play, Pause,
  RotateCcw, Sparkles, BookOpen, Target, Trophy, ArrowLeft, Settings2,
  Volume2, Check, X
} from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'
import { SURAHS } from '@/lib/quran-data'
import { getItem, setItem, KEYS } from '@/lib/storage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation: string
}

interface HifzProgress {
  [surahKey: string]: {
    totalReviewed: number
    correctCount: number
    lastReviewed: string
    memorized: number[]
  }
}

type HideMode = 'full' | 'partial' | 'first-last'

export default function HifzPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'select' | 'configure' | 'practice' | 'results'>('select')
  const [selectedSurah, setSelectedSurah] = useState(0)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [loading, setLoading] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [hideMode, setHideMode] = useState<HideMode>('full')
  const [showTranslation, setShowTranslation] = useState(true)
  const [startAyah, setStartAyah] = useState(1)
  const [endAyah, setEndAyah] = useState(7)
  const [progress, setProgress] = useState<HifzProgress>({})
  const [sessionResults, setSessionResults] = useState<{ ayah: number; correct: boolean }[]>([])
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setProgress(getItem(KEYS.HIFZ_PROGRESS, {}))
  }, [])

  const surah = SURAHS.find(s => s.number === selectedSurah)

  const fetchAyahs = useCallback(async (surahNum: number, start: number, end: number) => {
    setLoading(true)
    try {
      const [arRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/ar.alafasy`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/en.asad`),
      ])
      const arData = await arRes.json()
      const enData = await enRes.json()

      if (arData.data?.ayahs && enData.data?.ayahs) {
        const filtered: Ayah[] = arData.data.ayahs
          .map((ar: { number: number; numberInSurah: number; text: string }, i: number) => ({
            number: ar.number,
            numberInSurah: ar.numberInSurah,
            text: ar.text,
            translation: enData.data.ayahs[i]?.text || '',
          }))
          .filter((a: Ayah) => a.numberInSurah >= start && a.numberInSurah <= end)
        setAyahs(filtered)
      }
    } catch {
      setAyahs([])
    } finally {
      setLoading(false)
    }
  }, [])

  const startPractice = async () => {
    await fetchAyahs(selectedSurah, startAyah, endAyah)
    setCurrentIdx(0)
    setRevealed(false)
    setSessionResults([])
    setPhase('practice')
  }

  const getHiddenText = (text: string): string => {
    if (hideMode === 'full') return ''
    if (hideMode === 'first-last') {
      const words = text.split(' ')
      if (words.length <= 2) return text
      return words[0] + ' ' + words.slice(1, -1).map(() => '___').join(' ') + ' ' + words[words.length - 1]
    }
    // partial: show every other word
    return text.split(' ').map((w, i) => i % 2 === 0 ? w : '___').join(' ')
  }

  const markResult = (correct: boolean) => {
    const ayah = ayahs[currentIdx]
    const newResults = [...sessionResults, { ayah: ayah.numberInSurah, correct }]
    setSessionResults(newResults)

    // Update progress
    const key = `surah-${selectedSurah}`
    const existing = progress[key] || { totalReviewed: 0, correctCount: 0, lastReviewed: '', memorized: [] }
    const updated: HifzProgress = {
      ...progress,
      [key]: {
        totalReviewed: existing.totalReviewed + 1,
        correctCount: existing.correctCount + (correct ? 1 : 0),
        lastReviewed: new Date().toISOString(),
        memorized: correct && !existing.memorized.includes(ayah.numberInSurah)
          ? [...existing.memorized, ayah.numberInSurah]
          : existing.memorized.filter(n => correct || n !== ayah.numberInSurah),
      },
    }
    setProgress(updated)
    setItem(KEYS.HIFZ_PROGRESS, updated)

    // Move to next or finish
    if (currentIdx < ayahs.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setRevealed(false)
    } else {
      setPhase('results')
    }
  }

  const playCurrentAyah = () => {
    if (!ayahs[currentIdx]) return
    if (audioRef.current) audioRef.current.pause()

    const audio = new Audio(
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahs[currentIdx].number}.mp3`
    )
    audioRef.current = audio
    setPlaying(true)
    audio.play().catch(() => setPlaying(false))
    audio.onended = () => setPlaying(false)
  }

  const togglePlay = () => {
    if (playing && audioRef.current) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      playCurrentAyah()
    }
  }

  const currentAyah = ayahs[currentIdx]
  const sessionCorrect = sessionResults.filter(r => r.correct).length
  const sessionTotal = sessionResults.length
  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0

  const filteredSurahs = SURAHS.filter(s =>
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.name.includes(search)
  )

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-950 to-violet-900">
        <div className="islamic-pattern absolute inset-0 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="relative flex flex-col items-center justify-center px-6 pt-14 pb-8">
          <button
            onClick={() => phase === 'select' ? router.back() : setPhase('select')}
            className="absolute top-14 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white text-balance">Hifz Mode</h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/70">Memorization Practice</p>
        </div>
      </div>

      {/* Phase: Select Surah */}
      {phase === 'select' && (
        <div className="px-4 pt-4 space-y-4">
          {/* Description card */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20">
                <EyeOff className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Test Your Memory</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">
                  Verses are hidden for you to recite from memory. Reveal the text to check your accuracy, then mark whether you got it right. Build your memorization streak.
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search surah to memorize..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder-gray-500 outline-none"
            />
          </div>

          {/* Surah grid */}
          <div className="space-y-2">
            {filteredSurahs.map((s) => {
              const key = `surah-${s.number}`
              const p = progress[key]
              const memorizedCount = p?.memorized?.length || 0
              const pct = s.numberOfAyahs > 0 ? Math.round((memorizedCount / s.numberOfAyahs) * 100) : 0

              return (
                <button
                  key={s.number}
                  onClick={() => {
                    setSelectedSurah(s.number)
                    setStartAyah(1)
                    setEndAyah(Math.min(s.numberOfAyahs, 10))
                    setPhase('configure')
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-3.5 text-left transition-all active:scale-[0.98]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15">
                    <span className="text-xs font-bold text-indigo-400">{s.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">{s.englishName}</span>
                      {pct > 0 && (
                        <span className={`text-[10px] font-bold ${pct === 100 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                          {pct}%
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">{s.numberOfAyahs} ayahs</p>
                  </div>
                  <span className="font-arabic text-base text-gray-400">{s.name}</span>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Phase: Configure */}
      {phase === 'configure' && surah && (
        <div className="px-4 pt-5 space-y-5">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 text-center">
            <p className="font-arabic text-2xl text-foreground">{surah.name}</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{surah.englishName}</p>
            <p className="text-xs text-gray-400">{surah.numberOfAyahs} ayahs</p>
          </div>

          {/* Ayah range */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-foreground">Ayah Range</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-500">From</label>
                <input
                  type="number"
                  min={1}
                  max={surah.numberOfAyahs}
                  value={startAyah}
                  onChange={(e) => setStartAyah(Math.max(1, Math.min(surah.numberOfAyahs, Number(e.target.value))))}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-center text-sm text-foreground outline-none focus:border-indigo-500/50"
                />
              </div>
              <span className="pt-4 text-gray-600">to</span>
              <div className="flex-1">
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-500">To</label>
                <input
                  type="number"
                  min={startAyah}
                  max={surah.numberOfAyahs}
                  value={endAyah}
                  onChange={(e) => setEndAyah(Math.max(startAyah, Math.min(surah.numberOfAyahs, Number(e.target.value))))}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-center text-sm text-foreground outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Hide mode */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-foreground">Hide Mode</h3>
            </div>
            <div className="space-y-2">
              {[
                { key: 'full' as HideMode, label: 'Full Hide', desc: 'Entire verse is hidden. Maximum challenge.' },
                { key: 'partial' as HideMode, label: 'Partial Hide', desc: 'Every other word is hidden to jog your memory.' },
                { key: 'first-last' as HideMode, label: 'First & Last', desc: 'Only first and last words shown as hints.' },
              ].map(m => (
                <button
                  key={m.key}
                  onClick={() => setHideMode(m.key)}
                  className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
                    hideMode === m.key
                      ? 'border-indigo-500/30 bg-indigo-500/10'
                      : 'border-gray-800 bg-gray-800/50'
                  }`}
                >
                  <span className={`text-sm font-medium ${hideMode === m.key ? 'text-indigo-400' : 'text-gray-300'}`}>
                    {m.label}
                  </span>
                  <p className="mt-0.5 text-[11px] text-gray-500">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Show translation toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <span className="text-sm text-foreground">Show Translation Hints</span>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                showTranslation ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={showTranslation}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                showTranslation ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Start button */}
          <button
            onClick={startPractice}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
          >
            <Brain className="h-5 w-5" />
            Start Memorization
          </button>
        </div>
      )}

      {/* Phase: Practice */}
      {phase === 'practice' && currentAyah && (
        <div className="px-4 pt-5 space-y-4">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{currentIdx + 1}/{ayahs.length}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / ayahs.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Ayah card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            {/* Ayah number */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15">
                <span className="text-xs font-bold text-indigo-400">{currentAyah.numberInSurah}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-400 active:text-emerald-400"
                  aria-label={playing ? 'Pause audio' : 'Play audio'}
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Hidden/Revealed text */}
            {!revealed ? (
              <div className="space-y-4">
                {hideMode === 'full' ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
                      <EyeOff className="h-8 w-8 text-indigo-400" />
                    </div>
                    <p className="text-center text-sm text-gray-400">
                      Recite Ayah {currentAyah.numberInSurah} from memory
                    </p>
                    {showTranslation && (
                      <p className="mt-2 text-center text-xs leading-relaxed text-gray-500 italic">
                        Hint: {currentAyah.translation.substring(0, 80)}...
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-right font-arabic text-2xl leading-[2.2] text-foreground/60" dir="rtl">
                      {getHiddenText(currentAyah.text)}
                    </p>
                    {showTranslation && (
                      <p className="mt-3 text-xs text-gray-500 italic">
                        {currentAyah.translation.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setRevealed(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500/15 py-3 text-sm font-medium text-indigo-400 transition-all active:bg-indigo-500/25"
                >
                  <Eye className="h-4 w-4" />
                  Reveal Verse
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Revealed text */}
                <p className="text-right font-arabic text-2xl leading-[2.2] text-foreground" dir="rtl">
                  {currentAyah.text}
                </p>
                <p className="text-sm leading-relaxed text-gray-400">
                  {currentAyah.translation}
                </p>

                {/* Self-assessment */}
                <div className="pt-2 space-y-2">
                  <p className="text-center text-xs text-gray-500">How did you do?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => markResult(false)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-500/20 bg-red-500/5 py-3 text-sm font-medium text-red-400 transition-all active:bg-red-500/15"
                    >
                      <X className="h-4 w-4" />
                      Need Practice
                    </button>
                    <button
                      onClick={() => markResult(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-500/20 bg-emerald-500/5 py-3 text-sm font-medium text-emerald-400 transition-all active:bg-emerald-500/15"
                    >
                      <Check className="h-4 w-4" />
                      Got It
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          )}
        </div>
      )}

      {/* Phase: Results */}
      {phase === 'results' && (
        <div className="px-4 pt-5 space-y-5">
          <div className="flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900 p-8">
            <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-3xl ${
              accuracy >= 80 ? 'bg-emerald-500/15' : accuracy >= 50 ? 'bg-amber-500/15' : 'bg-red-500/15'
            }`}>
              {accuracy >= 80 ? (
                <Trophy className="h-10 w-10 text-emerald-400" />
              ) : accuracy >= 50 ? (
                <Target className="h-10 w-10 text-amber-400" />
              ) : (
                <RotateCcw className="h-10 w-10 text-red-400" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {accuracy >= 80 ? 'Excellent!' : accuracy >= 50 ? 'Good Effort!' : 'Keep Practicing'}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {surah?.englishName} - Ayahs {startAyah}-{endAyah}
            </p>

            {/* Accuracy ring */}
            <div className="relative mt-6 flex h-28 w-28 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#1f2937" strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={accuracy >= 80 ? '#10b981' : accuracy >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${accuracy}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute text-2xl font-bold ${
                accuracy >= 80 ? 'text-emerald-400' : accuracy >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {accuracy}%
              </span>
            </div>

            <div className="mt-4 flex gap-6">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{sessionCorrect}</p>
                <p className="text-[10px] text-gray-500">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-400">{sessionTotal - sessionCorrect}</p>
                <p className="text-[10px] text-gray-500">Need Practice</p>
              </div>
            </div>
          </div>

          {/* Ayah-by-ayah breakdown */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="border-b border-gray-800 px-4 py-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Breakdown</h3>
            </div>
            {sessionResults.map((r, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 ${i < sessionResults.length - 1 ? 'border-b border-gray-800/50' : ''}`}>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${r.correct ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  {r.correct ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                </div>
                <span className="text-sm text-gray-300">Ayah {r.ayah}</span>
                <span className={`ml-auto text-xs ${r.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                  {r.correct ? 'Memorized' : 'Review'}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setCurrentIdx(0)
                setRevealed(false)
                setSessionResults([])
                setPhase('practice')
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-800 py-3.5 text-sm font-medium text-gray-300 active:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
            <button
              onClick={() => setPhase('select')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3.5 text-sm font-medium text-white active:bg-indigo-600"
            >
              <Sparkles className="h-4 w-4" />
              New Session
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
