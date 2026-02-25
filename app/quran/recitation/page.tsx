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
  const playAyahRef = useRef<(ayah: number) => void>(() => {})

  const surah = SURAHS[selectedSurah - 1]
  const reciterData = RECITERS.find(r => r.id === reciter) || RECITERS[0]
  const REPEAT_OPTIONS: (1 | 2 | 3 | 0)[] = [1, 2, 3, 0]

  const updateMediaPositionState = useCallback((audio: HTMLAudioElement | null) => {
    if (!audio || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return

    try {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        position: Math.min(audio.currentTime, audio.duration),
        playbackRate: audio.playbackRate || 1,
      })
    } catch {
      // Not all Media Session implementations support position state.
    }
  }, [])

  // ── Audio setup ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audioRef.current = audio

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
      updateMediaPositionState(audio)
    }
    audio.ondurationchange = () => {
      setDuration(audio.duration)
      updateMediaPositionState(audio)
    }
    audio.onplay = () => { setIsPlaying(true); setIsLoading(false) }
    audio.onpause = () => setIsPlaying(false)
    audio.onwaiting = () => setIsLoading(true)
    audio.oncanplay = () => setIsLoading(false)

    return () => { audio.pause(); audio.src = '' }
  }, [updateMediaPositionState])

  // Fetch surah text when surah changes
  useEffect(() => {
    if (step !== 'player') return
    fetch(`/api/quran/surah/${selectedSurah}`)
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
          setTimeout(() => playAyahRef.current(prevAyah + 1), 300)
          return prevAyah + 1
        }
        return prevAyah
      })
      return 0
    })
  }, [repeatMode, continuousPlay, surah]) // eslint-disable-line

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.onended = handleAyahEnd
  }, [handleAyahEnd])

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

  useEffect(() => {
    playAyahRef.current = playAyah
  }, [playAyah])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else if (!audioRef.current.src || audioRef.current.src === window.location.href) playAyah(currentAyah)
    else audioRef.current.play().catch(() => {})
  }, [isPlaying, playAyah, currentAyah])

  const skipPrevious = useCallback(() => {
    if (currentAyah <= 1) {
      playAyah(1)
      return
    }
    playAyah(currentAyah - 1)
  }, [currentAyah, playAyah])

  const skipNext = useCallback(() => {
    if (currentAyah < surah.numberOfAyahs) {
      playAyah(currentAyah + 1)
    }
  }, [currentAyah, surah, playAyah])

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

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return

    if (typeof MediaMetadata !== 'undefined') {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Surah ${surah.englishName} - Ayah ${currentAyah}`,
        artist: reciterData.name,
        album: 'MasjidConnect Quran Recitation',
        artwork: [
          { src: '/images/logo.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: '/images/logo.jpg', sizes: '512x512', type: 'image/jpeg' },
        ],
      })
    }

    navigator.mediaSession.playbackState = step === 'player' && isPlaying ? 'playing' : 'paused'
  }, [currentAyah, reciterData.name, step, surah.englishName, isPlaying])

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    const mediaSession = navigator.mediaSession

    const setHandler = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        mediaSession.setActionHandler(action, handler)
      } catch {
        // Ignore unsupported media actions in some browsers.
      }
    }

    setHandler('play', () => {
      if (step !== 'player') return
      togglePlay()
    })
    setHandler('pause', () => audioRef.current?.pause())
    setHandler('previoustrack', () => {
      if (step !== 'player') return
      skipPrevious()
    })
    setHandler('nexttrack', () => {
      if (step !== 'player') return
      skipNext()
    })
    setHandler('seekbackward', () => {
      if (!audioRef.current) return
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
      updateMediaPositionState(audioRef.current)
    })
    setHandler('seekforward', () => {
      if (!audioRef.current) return
      const maxTime = Number.isFinite(audioRef.current.duration) ? audioRef.current.duration : Infinity
      audioRef.current.currentTime = Math.min(maxTime, audioRef.current.currentTime + 10)
      updateMediaPositionState(audioRef.current)
    })
    setHandler('seekto', details => {
      if (!audioRef.current || typeof details.seekTime !== 'number') return
      audioRef.current.currentTime = details.seekTime
      updateMediaPositionState(audioRef.current)
    })
    setHandler('stop', () => {
      if (!audioRef.current) return
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    })

    return () => {
      setHandler('play', null)
      setHandler('pause', null)
      setHandler('previoustrack', null)
      setHandler('nexttrack', null)
      setHandler('seekbackward', null)
      setHandler('seekforward', null)
      setHandler('seekto', null)
      setHandler('stop', null)
    }
  }, [step, togglePlay, skipPrevious, skipNext, updateMediaPositionState])

  const filteredSurahs = SURAHS.filter(s =>
    !surahSearch ||
    s.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
    String(s.number) === surahSearch
  )

  // ── STEP: Reciter Selection ───────────────────────────────────────────────────
  if (step === 'reciter') {
    return (
      <div className="min-h-screen bg-background pb-nav">
        <PageHero icon={Headphones} title="Recitation" subtitle="Choose a Reciter" gradient="from-teal-900 to-emerald-900" showBack  heroTheme="quran" />

        <div className="px-4 pt-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Select Reciter</p>

          {['Murattal', 'Mujawwad'].map(style => (
            <div key={style} className="mb-4">
              <p className="mb-2 text-[11px] font-semibold text-muted-foreground/60">{style}</p>
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
                        : 'border-border bg-card/50 active:bg-secondary'
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      reciter === r.id ? 'bg-teal-500/20 text-teal-400' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {r.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${reciter === r.id ? 'text-teal-400' : 'text-foreground/80'}`}>{r.name}</p>
                      <p className="text-[11px] text-muted-foreground/80">{r.style}</p>
                    </div>
                    {reciter === r.id && <Check className="h-4 w-4 shrink-0 text-teal-400" />}
                    {reciter !== r.id && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />}
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
      <div className="min-h-screen bg-background pb-nav">
        <PageHero icon={Headphones} title="Recitation" subtitle={reciterData.name} gradient="from-teal-900 to-emerald-900" showBack  heroTheme="quran" />

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
              <p className="text-[11px] text-muted-foreground/80">Tap to change reciter</p>
            </div>
            <ChevronDown className="h-4 w-4 text-teal-400/50" />
          </button>

          {/* Search */}
          <input
            type="text"
            placeholder="Search surah..."
            value={surahSearch}
            onChange={e => setSurahSearch(e.target.value)}
            className="mb-3 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder-gray-600 outline-none focus:border-teal-500/50"
          />

          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Select Surah</p>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {filteredSurahs.map((s, i) => (
              <button
                key={s.number}
                onClick={() => { setSelectedSurah(s.number); startRecitation() }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all active:bg-white/5 ${
                  i < filteredSurahs.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-xs font-bold text-purple-400">
                  {s.number}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground/80">{s.englishName}</p>
                  <p className="text-[11px] text-muted-foreground/80">{s.numberOfAyahs} ayahs · {s.revelationType}</p>
                </div>
                <p className="font-arabic text-base text-muted-foreground">{s.name}</p>
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
    <div className="min-h-screen bg-background pb-48">
      <PageHero icon={Headphones} title={surah.englishName} subtitle={reciterData.name} gradient="from-teal-900 to-emerald-900" showBack  heroTheme="quran" />

      {/* Header info */}
      <div className="flex items-center gap-2 px-4 pt-3">
        <button
          onClick={() => { audioRef.current?.pause(); setStep('surah') }}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground active:bg-secondary"
        >
          <ChevronDown className="h-3.5 w-3.5 rotate-90" /> Change
        </button>
        <span className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-teal-400">
          {reciterData.name}
        </span>
        <span className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground/80">
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
                  : 'border-border bg-card/50 active:bg-card'
              }`}
              dir="rtl"
            >
              <div className="flex items-start gap-3">
                <p
                  className={`flex-1 leading-[2.4] ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}
                  style={{ fontFamily: '"Amiri Quran", "Amiri", serif', fontSize: '1.1rem' }}
                >
                  {ay.text}
                </p>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                  isCurrent ? 'border-teal-500/40 bg-teal-500/20 text-teal-400' : 'border-border bg-secondary text-muted-foreground/80'
                }`}>
                  {ayahNum}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Fixed Player ─────────────────────────────────────────── */}
      <div className="fixed bottom-16 left-0 right-0 z-[65] bg-background/98 backdrop-blur border-t border-border px-4 py-3">
        {/* Seek bar */}
        <div
          className="mb-3 h-1 w-full cursor-pointer rounded-full bg-secondary"
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
            <p className="text-[11px] font-bold text-foreground">
              Ayah {currentAyah} / {surah.numberOfAyahs}
            </p>
            <p className="text-[10px] text-muted-foreground/80">{fmt(currentTime)} / {fmt(duration)}</p>
          </div>
          <div className="flex gap-2">
            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className={`flex h-8 items-center gap-1 rounded-lg px-2 text-[10px] font-bold transition-all ${
                repeatMode !== 1 ? 'bg-teal-500/20 text-teal-400' : 'bg-secondary text-muted-foreground/80'
              }`}
            >
              <Repeat className="h-3 w-3" />
              {repeatMode === 0 ? '∞' : `×${repeatMode}`}
            </button>
            {/* Continuous */}
            <button
              onClick={() => setContinuousPlay(!continuousPlay)}
              className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
                continuousPlay ? 'bg-teal-500/20 text-teal-400' : 'bg-secondary text-muted-foreground/80'
              }`}
            >
              Auto
            </button>
            {/* Speed */}
            <button onClick={cycleSpeed} className="rounded-lg bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground min-w-[34px]">
              {speed}x
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => playAyah(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground active:bg-muted"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => currentAyah > 1 && playAyah(currentAyah - 1)}
            disabled={currentAyah <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground disabled:opacity-30"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500"
          >
            {isLoading
              ? <Loader2 className="h-6 w-6 animate-spin text-foreground" />
              : isPlaying
              ? <Pause className="h-6 w-6 text-foreground" />
              : <Play className="h-6 w-6 text-foreground" />
            }
          </button>
          <button
            onClick={() => currentAyah < surah.numberOfAyahs && playAyah(currentAyah + 1)}
            disabled={currentAyah >= surah.numberOfAyahs}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground disabled:opacity-30"
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            onClick={() => { const s2 = selectedSurah < 114 ? selectedSurah + 1 : selectedSurah; setSelectedSurah(s2); setTimeout(() => playAyah(1), 200) }}
            disabled={selectedSurah >= 114}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
