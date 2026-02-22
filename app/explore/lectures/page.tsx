'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Headphones, Play, Pause, SkipBack, SkipForward, ChevronRight, Loader2 } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'

// ─── Data ────────────────────────────────────────────────────────────────────

interface Lecture {
  title: string
  file: string   // exact filename on archive.org
}

interface Series {
  id: string
  title: string
  subtitle: string
  archiveId: string
  color: string
  accent: string
  lectures: Lecture[]
}

const SERIES: Series[] = [
  {
    id: 'makkah',
    title: 'Life of the Prophet',
    subtitle: 'Makkan Period',
    archiveId: 'lifeofmuhammadmakkah',
    color: 'from-emerald-900 to-teal-900',
    accent: 'emerald',
    lectures: [
      { title: 'Introduction', file: 'CD1Introduction.mp3' },
      { title: 'Background History', file: 'CD2BackgroundHistory.mp3' },
      { title: 'The Religious Situation of Pre-Islamic Arabia', file: 'CD3TheReligiousSitautionOfPreIslamicArabia.mp3' },
      { title: 'Early Life', file: 'CD4EarlyLife.mp3' },
      { title: 'Important Events', file: 'CD5ImportantEvents.mp3' },
      { title: 'In Pursuit of the Truth', file: 'CD6InPursuitOfTheTruth.mp3' },
      { title: 'The Glad Tidings', file: 'CD7TheGladTidings.mp3' },
      { title: 'The Revelation', file: 'CD8TheRevelation.mp3' },
      { title: 'The Reaction — Part 1', file: 'CD9TheReactionPart1.mp3' },
      { title: 'The Reaction — Part 2', file: 'CD10TheReactionPart2.mp3' },
      { title: 'The Early Immigrants — Part I', file: 'CD11TheEarlyImmigrantsPartI.mp3' },
      { title: 'The Early Immigrants — Part II', file: 'CD12TheEarlyImmigrantsPartII.mp3' },
      { title: 'Major Events', file: 'CD13MajorEvents.mp3' },
      { title: 'The Later Years of Makkah', file: 'CD14TheLaterYearsOfMakkah.mp3' },
      { title: 'In Search of a Base', file: 'CD15InSearchOfABase.mp3' },
      { title: 'The Road to Madinah', file: 'CD16TheRoadToMadinah.mp3' },
    ],
  },
  {
    id: 'medina',
    title: 'Life of the Prophet',
    subtitle: 'Madinan Period',
    archiveId: 'TheLifeOfTheProphetMuhammadMedinahPeriod-Part1ByImamAnwarAl-Awlaki',
    color: 'from-blue-900 to-indigo-900',
    accent: 'blue',
    lectures: [
      { title: 'Introduction & Hijrah', file: '01 - Introduction and Hijarah.mp3' },
      { title: 'Establishment of the State — Part 1', file: '02 - Establishment Of The State 1.mp3' },
      { title: 'Establishment of the State — Part 2', file: '03 - Establishment Of The State 2.mp3' },
      { title: 'Establishment of the State — Part 3', file: '04 - Establishment Of The State 3.mp3' },
      { title: 'Battle of Badr — Part 1', file: '05 - Battle Of Badr 1.mp3' },
      { title: 'Battle of Badr — Part 2', file: '06 - Battle Of Badr 2.mp3' },
      { title: 'Battle of Badr — Part 3', file: '07 - Battle Of Badr 3.mp3' },
      { title: 'Events Between Badr and Uhud', file: '08 - Events Between Badr and Uhud.mp3' },
      { title: 'Battle of Uhud — Part 1', file: '09 - Battle Of Uhud 1.mp3' },
      { title: 'Battle of Uhud — Part 2', file: '10 - Battle Of Uhud 2.mp3' },
      { title: 'Battle of Uhud — Part 3', file: '11 - Battle Of Uhud 3.mp3' },
      { title: 'Battle of Uhud — Part 4', file: '12 - Battle Of Uhud 4.mp3' },
      { title: 'Battle of Uhud — Part 5', file: '13 - Battle Of Uhud 5.mp3' },
      { title: 'Events Between Battles — Part 1', file: '14 - Events Between ... 1.mp3' },
      { title: 'Events Between Battles — Part 2', file: '15 - Events Between ... 2.mp3' },
      { title: 'Banu Al-Mustalaq & Battle of the Trench', file: '16 - Banu Al-Mustalaq - Battle Of The Trench.mp3' },
      { title: 'Battle of the Trench', file: '17 - Battle Of The Trench.mp3' },
      { title: 'Banu Quraydah', file: '18 - Banu Quraydah.mp3' },
    ],
  },
  {
    id: 'prophets',
    title: 'Lives of the Prophets',
    subtitle: 'From Adam to Isa (AS)',
    archiveId: 'TheLivesOfTheProphetsByAnwarAl-Awlaki',
    color: 'from-amber-900 to-orange-900',
    accent: 'amber',
    lectures: [
      { title: 'Introduction — Story of Creation', file: '01 - Introduction - Story Of Creation.mp3' },
      { title: 'Adam (AS) cont. — Idris, Sheeth, Hud (AS)', file: '02 - Adam (Cont.) - Idris - Sheeth - Hud A.S..mp3' },
      { title: 'Hud (AS) cont. — Saleh, Ibrahim (AS)', file: '03 - Hud (cont.) - Saleh - Ibrahim A.S..mp3' },
      { title: "The Da'wah of Ibrahim — His Hijrah", file: '04 - The Dawah Of Ibrahim - Hijrah Of Ibrahim A.S..mp3' },
      { title: "Al-Ka'bah — Virtues of Ibrahim — Lut (AS)", file: '05 - Al-Kabah - Virtues Of Ibrahim - Lut A.S..mp3' },
      { title: "Shu'aib — Yusuf (AS)", file: '06 - Shuaib - Yusuf A.S..mp3' },
      { title: 'Yusuf (AS) — Part 2', file: '07 - Yusuf A.S. (Cont.).mp3' },
      { title: 'Yusuf (AS) — Part 3', file: '08 - Yusuf A.S. (Cont.).mp3' },
      { title: 'Yusuf (AS) cont. — Ayyub, Yunus (AS)', file: '09 - Yusuf (Cont.) - Ayub - Yunus A.S..mp3' },
      { title: 'Musa (AS) and Pharaoh — Part 1', file: '10 - Musa A.S. And Pharaoh.mp3' },
      { title: 'Musa (AS) and Pharaoh — Part 2', file: '11 - Musa A.S. And Pharaoh 2.mp3' },
      { title: 'Musa (AS) and Pharaoh — Part 3', file: '12 - Musa A.S. And Pharaoh 3.mp3' },
      { title: 'Musa (AS) and Bani Israeel', file: '13 - Musa A.S. And Bani Israeel.mp3' },
      { title: 'Musa (AS) and Bani Israeel — Part 2', file: '14 - Musa A.S. And Bani Israeel (Cont.).mp3' },
      { title: 'Musa (AS) and Bani Israeel — Part 3', file: '15 - Musa A.S. And Bani Israeel (Cont.).mp3' },
      { title: 'Yusha (AS) and Dawud (AS)', file: '16 - Yusha And Dawood A.S..mp3' },
      { title: 'Dawud (AS) cont. — Sulaiman (AS)', file: '17 - Dawood (Cont.) - Sulaiman A.S..mp3' },
      { title: 'Sulaiman (AS) cont. — Kingdom of Sheba', file: '18 - Sulaiman (Cont.) - Kingdom Of Sheba.mp3' },
      { title: 'The Family of Imran — Part 1', file: '19 - The Family Of Imran.mp3' },
      { title: 'The Family of Imran — Part 2', file: '20 - The Family Of Imran 2.mp3' },
      { title: 'The Family of Imran — Part 3', file: '21 - The Family Of Imran 3.mp3' },
    ],
  },
  {
    id: 'jabbar',
    title: 'Muhammad Abdul Jabbar',
    subtitle: 'Standalone Lectures',
    archiveId: 'BewareHesYourEnemy',
    color: 'from-rose-900 to-pink-900',
    accent: 'rose',
    lectures: [
      { title: "Beware — He's Your Enemy", file: "Beware He's Your Enemy.mp3" },
      { title: 'Death', file: 'Death.mp3' },
      { title: 'Fitna of Ad-Dajjal', file: 'FitnaOfAd-dajjal.mp3' },
      { title: 'Legacy of Khalid Ibn Al Walid (RA)', file: 'LegacyOfKhalidIbnAlWalidRa.mp3' },
      { title: 'Power and Greatness of Allah (SWT)', file: 'PowerAndGreatnessOfAllahSwt.mp3' },
      { title: 'Soul of a Believer', file: 'SoulOfABeliever.mp3' },
      { title: 'The King of All Kings', file: 'TheKingOfAllKings.mp3' },
      { title: 'The Reckoning', file: 'TheReckoning.mp3' },
      { title: 'The Seal of All the Prophets — Muhammad (PBUH)', file: 'TheSealOfAllTheProphetsMuhammadPbuh.mp3' },
      { title: 'This Is the Day of Reckoning', file: 'ThisIsTheDayOfReckoning.mp3' },
    ],
  },
  {
    id: 'hereafter',
    title: 'The Hereafter',
    subtitle: 'Death, Day of Judgement & Beyond',
    archiveId: 'hereafter-anwar-al-awlaki_202505',
    color: 'from-purple-900 to-violet-900',
    accent: 'purple',
    lectures: [
      { title: 'Introduction — The Importance of the Afterlife & Death', file: '01. Introduction, The Importance of After Life, Death.mp3' },
      { title: "Death (cont'd) — Reasons of Evil Ending", file: "02. Death (cont'd), Reasons of Evil Ending.mp3" },
      { title: 'The Journey of the Soul, The Grave & Its Trials', file: '03. The Journey of the Soul, The Grave, The trials of the Grave.mp3' },
      { title: 'Minor Signs of the Day of Judgement — Signs 1–7', file: '04. The Minor Signs of the Day of Judgement - Signs 1-7.mp3' },
      { title: 'Minor Signs of the Day of Judgement — Signs 8–18', file: '05. The Minor Signs of the Day of Judgement - Signs 8-18.mp3' },
      { title: 'Minor Signs of the Day of Judgement — Signs 19–38', file: '06. The Minor Signs of the Day of Judgement - Signs 19-38.mp3' },
      { title: 'Minor Signs of the Day of Judgement — Signs 39–52', file: '07. The Minor Signs of the Day of Judgement - Signs 39-52.mp3' },
      { title: 'Major Signs — Al-Dajjal', file: '08. The Major Signs of the Day of Judgement - First Sign - Al-Dajjal.mp3' },
      { title: "Al-Dajjal (cont'd) — The Second Coming of Isa (AS)", file: "09. The Major Signs of the Day of Judgement - Al-Dajjal (cont'd), Second Sign - The Second Comin.mp3" },
      { title: 'Major Signs — Signs 3–10 & Closing Comments', file: '10. The Major Signs of the Day of Judgement - Signs 3-10, Closing Comments.mp3' },
      { title: 'The Resurrection, The Assembly & The Horrors', file: '11. The Resurrection, Assembly Land, The Horrors, Universe Dismantling.mp3' },
      { title: 'The Non-Believers, Voiding of Deeds & The Disputes', file: '12. The Non-Believers, The Voiding of Deeds, The Disputes, Allah and Jesus Conversation.mp3' },
      { title: 'The Sins of Believers & The Seven Under the Shade', file: '13. The Sins of the Believers, The Righteous on the Hereafter, The Seven under the Shade of Alla.mp3' },
      { title: "The Righteous (cont'd) & Intercession", file: "14. The Righteous (cont'd), Intercession.mp3" },
      { title: 'Names of the Hereafter — Questioning & Interrogation', file: '15. Names of the Hereafter, Rules of the Hereafter, Questoining and Interrogation.mp3' },
      { title: 'Accountability, The Scale (Al-Mizan) & The Pool', file: '16. Accountability, Book of Deeds, Settlement of the Accounts, The Scale (Al-Mizan), The Pool.mp3' },
      { title: 'Hellfire — May Allah Save Us', file: '17. Hellfire and its life (may Allah save us from it).mp3' },
      { title: 'Actions Leading to Hellfire — First to Enter Paradise', file: '18. Actions that lead to Hellfire, First to enter Paradise, Gates of Paradise.mp3' },
      { title: 'A Tour of Paradise — The Levels', file: '19. A Tour of Paradise - The Levels of Paradise.mp3' },
      { title: "A Tour of Paradise (cont'd)", file: "20. A Tour of Paradise (cont'd), Issues pertaining to the Muslim Sisters.mp3" },
      { title: 'Socialization in Paradise', file: '21. Socialization In Paradise.mp3' },
      { title: 'The People of Paradise', file: '22. The People Of Paradise.mp3' },
    ],
  },
]

const ACCENT_COLORS: Record<string, { tab: string; ring: string; text: string; dot: string; bg: string }> = {
  emerald: { tab: 'bg-emerald-500 text-white', ring: 'ring-emerald-500/30 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
  blue:    { tab: 'bg-blue-500 text-white',    ring: 'ring-blue-500/30 border-blue-500/30',    text: 'text-blue-400',    dot: 'bg-blue-500',    bg: 'bg-blue-500/10' },
  amber:   { tab: 'bg-amber-500 text-white',   ring: 'ring-amber-500/30 border-amber-500/30',   text: 'text-amber-400',   dot: 'bg-amber-500',   bg: 'bg-amber-500/10' },
  purple:  { tab: 'bg-purple-500 text-white',  ring: 'ring-purple-500/30 border-purple-500/30',  text: 'text-purple-400',  dot: 'bg-purple-500',  bg: 'bg-purple-500/10' },
  rose:    { tab: 'bg-rose-500 text-white',    ring: 'ring-rose-500/30 border-rose-500/30',    text: 'text-rose-400',    dot: 'bg-rose-500',    bg: 'bg-rose-500/10' },
}

function fmt(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function audioUrl(archiveId: string, file: string): string {
  return `https://archive.org/download/${archiveId}/${encodeURIComponent(file)}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LecturesPage() {
  const [activeSeries, setActiveSeries] = useState<string>('makkah')
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null)
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSeries = SERIES.find(s => s.id === currentSeriesId) ?? null
  const currentLecture = currentSeries ? currentSeries.lectures[currentIdx] : null
  const activeSer = SERIES.find(s => s.id === activeSeries)!

  // Restore last played from localStorage
  useEffect(() => {
    const saved = getItem<{ seriesId: string; idx: number } | null>('last_lecture', null)
    if (saved) {
      setCurrentSeriesId(saved.seriesId)
      setCurrentIdx(saved.idx)
    }
  }, [])

  // Audio element setup
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
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
    audio.onended = () => {
      // Auto-advance
      if (currentSeries && currentIdx < currentSeries.lectures.length - 1) {
        playLecture(currentSeriesId!, currentIdx + 1)
      } else {
        setIsPlaying(false)
      }
    }

    return () => { audio.pause(); audio.src = '' }
  }, []) // eslint-disable-line

  const playLecture = useCallback((seriesId: string, idx: number) => {
    const series = SERIES.find(s => s.id === seriesId)
    if (!series || !audioRef.current) return
    const lecture = series.lectures[idx]
    if (!lecture) return

    audioRef.current.pause()
    audioRef.current.src = audioUrl(series.archiveId, lecture.file)
    audioRef.current.playbackRate = speed
    audioRef.current.load()
    audioRef.current.play().catch(() => {})

    setCurrentSeriesId(seriesId)
    setCurrentIdx(idx)
    setIsLoading(true)
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(true)

    setItem('last_lecture', { seriesId, idx })
  }, [speed])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else if (currentLecture) {
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        playLecture(currentSeriesId!, currentIdx)
      } else {
        audioRef.current.play().catch(() => {})
      }
    }
  }

  const seekTo = (pct: number) => {
    if (!audioRef.current || !duration) return
    audioRef.current.currentTime = (pct / 100) * duration
  }

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75]
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length]
    setSpeed(next)
    if (audioRef.current) audioRef.current.playbackRate = next
  }

  const accent = ACCENT_COLORS[activeSer.accent]
  const playingAccent = currentSeries ? ACCENT_COLORS[currentSeries.accent] : null

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-40">
      <PageHero
        icon={Headphones}
        title="Lectures"
        subtitle="Anwar al-Awlaki"
        gradient="from-teal-900 to-emerald-900"
        showBack
      />

      {/* Series Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SERIES.map(s => {
            const a = ACCENT_COLORS[s.accent]
            const isActive = activeSeries === s.id
            return (
              <button
                key={s.id}
                onClick={() => setActiveSeries(s.id)}
                className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isActive ? a.tab : 'bg-gray-800 text-gray-400'
                }`}
              >
                <div className="text-left leading-tight">
                  <div>{s.title}</div>
                  <div className={`text-[10px] font-normal ${isActive ? 'opacity-80' : 'text-gray-500'}`}>{s.subtitle}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Series Info */}
        <div className={`mt-3 rounded-2xl bg-gradient-to-r ${activeSer.color} px-4 py-3 flex items-center justify-between`}>
          <div>
            <p className="text-xs font-bold text-white">{activeSer.title}</p>
            <p className="text-[11px] text-white/70">{activeSer.subtitle}</p>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-black/20 ${accent.text}`}>
            {activeSer.lectures.length} lectures
          </span>
        </div>

        {/* Lecture List */}
        <div className="mt-3 space-y-1.5">
          {activeSer.lectures.map((lec, i) => {
            const isCurrentlyPlaying = currentSeriesId === activeSeries && currentIdx === i
            return (
              <button
                key={i}
                onClick={() => playLecture(activeSeries, i)}
                className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all active:scale-[0.99] ${
                  isCurrentlyPlaying
                    ? `${accent.bg} ${accent.ring} border`
                    : 'border-gray-800 bg-gray-900/50'
                }`}
              >
                {/* Number / Play Indicator */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isCurrentlyPlaying ? accent.bg : 'bg-gray-800'
                }`}>
                  {isCurrentlyPlaying && isPlaying ? (
                    <span className={`text-[10px] font-black tracking-widest ${accent.text}`}>▶</span>
                  ) : (
                    <span className={isCurrentlyPlaying ? accent.text : 'text-gray-500'}>{i + 1}</span>
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${
                    isCurrentlyPlaying ? accent.text : 'text-gray-200'
                  }`}>
                    {lec.title}
                  </p>
                </div>

                {isCurrentlyPlaying && isLoading && (
                  <Loader2 className={`h-3.5 w-3.5 animate-spin shrink-0 ${accent.text}`} />
                )}
                {!isCurrentlyPlaying && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-600" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Player Bar (fixed above BottomNav) ─── */}
      {currentLecture && (
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur border-t border-gray-800 px-4 py-3">
          {/* Progress Bar */}
          <div
            className="w-full h-1 bg-gray-800 rounded-full mb-3 cursor-pointer"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              seekTo(((e.clientX - rect.left) / rect.width) * 100)
            }}
          >
            <div
              className={`h-full rounded-full transition-all ${playingAccent?.dot ?? 'bg-emerald-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">{currentLecture.title}</p>
              <p className="text-[10px] text-gray-500 truncate">
                {currentSeries?.subtitle} • {fmt(currentTime)} / {fmt(duration)}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Speed */}
              <button
                onClick={changeSpeed}
                className="text-[10px] font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded-lg min-w-[36px] text-center"
              >
                {speed}x
              </button>

              {/* Prev */}
              <button
                onClick={() => currentIdx > 0 && playLecture(currentSeriesId!, currentIdx - 1)}
                disabled={currentIdx === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 disabled:opacity-30"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className={`flex h-10 w-10 items-center justify-center rounded-full ${playingAccent?.bg ?? 'bg-emerald-500/20'}`}
              >
                {isLoading ? (
                  <Loader2 className={`h-5 w-5 animate-spin ${playingAccent?.text ?? 'text-emerald-400'}`} />
                ) : isPlaying ? (
                  <Pause className={`h-5 w-5 ${playingAccent?.text ?? 'text-emerald-400'}`} />
                ) : (
                  <Play className={`h-5 w-5 ${playingAccent?.text ?? 'text-emerald-400'}`} />
                )}
              </button>

              {/* Next */}
              <button
                onClick={() => currentSeries && currentIdx < currentSeries.lectures.length - 1 && playLecture(currentSeriesId!, currentIdx + 1)}
                disabled={!currentSeries || currentIdx === currentSeries.lectures.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 disabled:opacity-30"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
