'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Headphones, Play, Pause, SkipBack, SkipForward, Loader2,
  ChevronRight, ChevronDown, RotateCcw, Repeat, Check
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { SURAHS } from '@/lib/quran-data'
import { getItem, setItem, KEYS } from '@/lib/storage'

// ─── Reciters ─────────────────────────────────────────────────────────────────

const RECITERS = [
  { id: 'ar.alafasy',           name: 'Mishary Alafasy',     style: 'Murattal' },
  { id: 'ar.abdurrahmaansudais',name: 'Sudais',              style: 'Murattal' },
  { id: 'ar.mahermuaiqly',      name: 'Maher Al-Muaiqly',   style: 'Murattal' },
  { id: 'ar.saoodshuraym',      name: 'Saud Al-Shuraym',    style: 'Murattal' },
  { id: 'ar.husary',            name: 'Husary',              style: 'Murattal' },
  { id: 'ar.husarymujawwad',    name: 'Husary (Mujawwad)',  style: 'Mujawwad' },
  { id: 'ar.minshawi',          name: 'Minshawi',            style: 'Murattal' },
  { id: 'ar.minshawimujawwad',  name: 'Minshawi (Mujawwad)',style: 'Mujawwad' },
  { id: 'ar.muhammadayyoub',    name: 'Muhammad Ayyoub',    style: 'Murattal' },
  { id: 'ar.muhammadjibreel',   name: 'Muhammad Jibreel',   style: 'Murattal' },
  { id: 'ar.shaatree',          name: 'Abu Bakr Ash-Shaatree', style: 'Murattal' },
  { id: 'ar.abdullahbasfar',    name: 'Abdullah Basfar',    style: 'Murattal' },
]

// Cumulative ayah offset per surah (global ayah number = offset[surah] + localAyah)
const SURAH_OFFSETS: number[] = (() => {
  const offsets: number[] = [0, 0]
  for (let i = 0; i < SURAHS.length; i++) {
    offsets.push((offsets[i + 1] || 0) + SURAHS[i].numberOfAyahs)
  }
  return offsets
})()

function globalAyah(surah: number, ayah: number) {
  return SURAH_OFFSETS[surah] + ayah
}

function audioUrl(reciterId: string, surah: number, ayah: number) {
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalAyah(surah, ayah)}.mp3`
}

function fmt(s: number) {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RecitationPage() {
  const [step, setStep] = useState<'reciter' | 'surah' | 'player'>('reciter')
  const [reciter, setReciter] = useState(() => getItem(KEYS.RECITER, 'ar.alafasy'))
  const [selectedSurah, setSelectedSurah] = useState(1)
  const [currentAyah, setCurrentAyah] = useState(1)
  const [surahSearch, setSurahSearch] = useState('')
  const [repeatMode, setRepeatMode] = useState<1 | 2 | 3 | 0>(1) // 0 = ∞
  const [repeatCount, setRepeatCount] = useState(0)
  const [continuousPlay, setContinuousPlay] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [ayahTexts, setAyahTexts] = useState<{ key: string; text: string }[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ayahListRef = useRef<HTMLDivElement>(null)

  const surah = SURAHS[selectedSurah - 1]
  const reciterData = RECITERS.find(r => r.id === reciter) || RECITERS[0]
  const REPEAT_OPTIONS: (1 | 2 | 3 | 0)[] = [1, 2, 3, 0]

  // ── Audio setup ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audioRef.current = audio

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    }
    audio.ondurationchange = () => setDuration(audio.duration)
    audio.onplay = () => { setIsPlaying(true); setIsLoading(false) }
    audio.onpause = () => setIsPlaying(false)
    audio.onwaiting = () => setIsLoading(true)
    audio.oncanplay = () => setIsLoading(false)
    audio.onended = () => handleAyahEnd()

    return () => { audio.pause(); audio.src = '' }
  }, []) // eslint-disable-line

  // Fetch surah text when surah changes
  useEffect(() => {
    if (step !== 'player') return
    fetch(`/api/quran/surah?surah=${selectedSurah}&reciter=${reciter}`)
      .then(r => r.json())
      .then(data => {
        const texts = (data?.data?.ayahs || []).map((a: any) => ({
          key: `${selectedSurah}:${a.numberInSurah}`,
          text: a.text,
        }))
        setAyahTexts(texts)
      })
      .catch(() => {})
  }, [selectedSurah, step, reciter])

  // Scroll current ayah into view
  useEffect(() => {
    if (!ayahListRef.current) return
    const el = ayahListRef.current.querySelector(`[data-ayah="${currentAyah}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [currentAyah])

  const handleAyahEnd = useCallback(() => {
    setRepeatCount(prev => {
      const mode = repeatMode
      const next = prev + 1
      if (mode !== 0 && mode !== 1 && next < mode) {
        // Repeat again
        audioRef.current?.play().catch(() => {})
        return next
      }
      // Move to next ayah or stop
      setCurrentAyah(prevAyah => {
        if (continuousPlay && prevAyah < surah.numberOfAyahs) {
          setTimeout(() => playAyah(prevAyah + 1), 300)
          return prevAyah + 1
        }
        return prevAyah
      })
      return 0
    })
  }, [repeatMode, continuousPlay, surah]) // eslint-disable-line

  const playAyah = useCallback((ayah: number) => {
    if (!audioRef.current || !surah) return
    const a = Math.max(1, Math.min(surah.numberOfAyahs, ayah))
    audioRef.current.pause()
    audioRef.current.src = audioUrl(reciter, selectedSurah, a)
    audioRef.current.playbackRate = speed
    audioRef.current.load()
    audioRef.current.play().catch(() => {})
    setCurrentAyah(a)
    setIsLoading(true)
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
    setRepeatCount(0)
    setIsPlaying(true)
  }, [reciter, selectedSurah, surah, speed])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else if (!audioRef.current.src || audioRef.current.src === window.location.href) playAyah(currentAyah)
    else audioRef.current.play().catch(() => {})
  }

  const cycleRepeat = () => {
    const idx = REPEAT_OPTIONS.indexOf(repeatMode)
    setRepeatMode(REPEAT_OPTIONS[(idx + 1) % REPEAT_OPTIONS.length])
    setRepeatCount(0)
  }

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75]
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length]
    setSpeed(next)
    if (audioRef.current) audioRef.current.playbackRate = next
  }

  const startRecitation = () => {
    setCurrentAyah(1)
    setRepeatCount(0)
    setStep('player')
    setTimeout(() => playAyah(1), 300)
  }

  const filteredSurahs = SURAHS.filter(s =>
    !surahSearch ||
    s.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
    String(s.number) === surahSearch
  )

  // ── STEP: Reciter Selection ───────────────────────────────────────────────────
  if (step === 'reciter') {
    return (
      <div className="min-h-screen bg-[#0a0b14] pb-nav">
        <PageHero icon={Headphones} title="Recitation" subtitle="Choose a Reciter" gradient="from-teal-900 to-emerald-900" showBack />

        <div className="px-4 pt-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Reciter</p>

          {['Murattal', 'Mujawwad'].map(style => (
            <div key={style} className="mb-4">
              <p className="mb-2 text-[11px] font-semibold text-gray-600">{style}</p>
              <div className="space-y-2">
                {RECITERS.filter(r => r.style === style).map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setReciter(r.id)
                      setItem(KEYS.RECITER, r.id)
                      setStep('surah')
                    }}
                    className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all ${
                      reciter === r.id
                        ? 'border-teal-500/30 bg-teal-500/10'
                        : 'border-gray-800 bg-gray-900/50 active:bg-gray-800'
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      reciter === r.id ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {r.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${reciter === r.id ? 'text-teal-400' : 'text-gray-200'}`}>{r.name}</p>
                      <p className="text-[11px] text-gray-500">{r.style}</p>
                    </div>
                    {reciter === r.id && <Check className="h-4 w-4 shrink-0 text-teal-400" />}
                    {reciter !== r.id && <ChevronRight className="h-4 w-4 shrink-0 text-gray-600" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <BottomNav />
      </div>
    )
  }

  // ── STEP: Surah Selection ──────────────────────────────────────────────────────
  if (step === 'surah') {
    return (
      <div className="min-h-screen bg-[#0a0b14] pb-nav">
        <PageHero icon={Headphones} title="Recitation" subtitle={reciterData.name} gradient="from-teal-900 to-emerald-900" showBack />

        <div className="px-4 pt-4">
          {/* Selected reciter banner */}
          <button
            onClick={() => setStep('reciter')}
            className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-teal-500/20 bg-teal-500/10 px-4 py-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-sm font-bold text-teal-400">
              {reciterData.name.charAt(0)}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-teal-400">{reciterData.name}</p>
              <p className="text-[11px] text-gray-500">Tap to change reciter</p>
            </div>
            <ChevronDown className="h-4 w-4 text-teal-400/50" />
          </button>

          {/* Search */}
          <input
            type="text"
            placeholder="Search surah..."
            value={surahSearch}
            onChange={e => setSurahSearch(e.target.value)}
            className="mb-3 w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-teal-500/50"
          />

          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Surah</p>
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            {filteredSurahs.map((s, i) => (
              <button
                key={s.number}
                onClick={() => { setSelectedSurah(s.number); startRecitation() }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all active:bg-white/5 ${
                  i < filteredSurahs.length - 1 ? 'border-b border-gray-800/50' : ''
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-xs font-bold text-purple-400">
                  {s.number}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-200">{s.englishName}</p>
                  <p className="text-[11px] text-gray-500">{s.numberOfAyahs} ayahs · {s.revelationType}</p>
                </div>
                <p className="font-arabic text-base text-gray-300">{s.name}</p>
              </button>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  // ── STEP: Player ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-48">
      <PageHero icon={Headphones} title={surah.englishName} subtitle={reciterData.name} gradient="from-teal-900 to-emerald-900" showBack />

      {/* Header info */}
      <div className="flex items-center gap-2 px-4 pt-3">
        <button
          onClick={() => { audioRef.current?.pause(); setStep('surah') }}
          className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-400 active:bg-gray-800"
        >
          <ChevronDown className="h-3.5 w-3.5 rotate-90" /> Change
        </button>
        <span className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs font-bold text-teal-400">
          {reciterData.name}
        </span>
        <span className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-gray-500">
          {surah.numberOfAyahs} ayahs
        </span>
      </div>

      {/* Ayah List */}
      <div ref={ayahListRef} className="px-4 pt-3 space-y-1.5">
        {ayahTexts.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
          </div>
        ) : ayahTexts.map((ay, i) => {
          const ayahNum = i + 1
          const isCurrent = ayahNum === currentAyah
          return (
            <button
              key={ay.key}
              data-ayah={ayahNum}
              onClick={() => playAyah(ayahNum)}
              className={`w-full rounded-2xl border p-4 text-right transition-all active:scale-[0.99] ${
                isCurrent
                  ? 'border-teal-500/30 bg-teal-500/10'
                  : 'border-gray-800 bg-gray-900/50 active:bg-gray-900'
              }`}
              dir="rtl"
            >
              <div className="flex items-start gap-3">
                <p
                  className={`flex-1 leading-[2.4] ${isCurrent ? 'text-white' : 'text-gray-300'}`}
                  style={{ fontFamily: '"Amiri Quran", "Amiri", serif', fontSize: '1.1rem' }}
                >
                  {ay.text}
                </p>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                  isCurrent ? 'border-teal-500/40 bg-teal-500/20 text-teal-400' : 'border-gray-700 bg-gray-800 text-gray-500'
                }`}>
                  {ayahNum}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Fixed Player ─────────────────────────────────────────── */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-gray-950/98 backdrop-blur border-t border-gray-800 px-4 py-3">
        {/* Seek bar */}
        <div
          className="mb-3 h-1 w-full cursor-pointer rounded-full bg-gray-800"
          onClick={e => {
            if (!audioRef.current || !duration) return
            const rect = e.currentTarget.getBoundingClientRect()
            audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration
          }}
        >
          <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Track info row */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-white">
              Ayah {currentAyah} / {surah.numberOfAyahs}
            </p>
            <p className="text-[10px] text-gray-500">{fmt(currentTime)} / {fmt(duration)}</p>
          </div>
          <div className="flex gap-2">
            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className={`flex h-8 items-center gap-1 rounded-lg px-2 text-[10px] font-bold transition-all ${
                repeatMode !== 1 ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-800 text-gray-500'
              }`}
            >
              <Repeat className="h-3 w-3" />
              {repeatMode === 0 ? '∞' : `×${repeatMode}`}
            </button>
            {/* Continuous */}
            <button
              onClick={() => setContinuousPlay(!continuousPlay)}
              className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
                continuousPlay ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-800 text-gray-500'
              }`}
            >
              Auto
            </button>
            {/* Speed */}
            <button onClick={cycleSpeed} className="rounded-lg bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-400 min-w-[34px]">
              {speed}x
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => playAyah(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 active:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => currentAyah > 1 && playAyah(currentAyah - 1)}
            disabled={currentAyah <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 disabled:opacity-30"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500"
          >
            {isLoading
              ? <Loader2 className="h-6 w-6 animate-spin text-white" />
              : isPlaying
              ? <Pause className="h-6 w-6 text-white" />
              : <Play className="h-6 w-6 text-white" />
            }
          </button>
          <button
            onClick={() => currentAyah < surah.numberOfAyahs && playAyah(currentAyah + 1)}
            disabled={currentAyah >= surah.numberOfAyahs}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 disabled:opacity-30"
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            onClick={() => { const s2 = selectedSurah < 114 ? selectedSurah + 1 : selectedSurah; setSelectedSurah(s2); setTimeout(() => playAyah(1), 200) }}
            disabled={selectedSurah >= 114}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
