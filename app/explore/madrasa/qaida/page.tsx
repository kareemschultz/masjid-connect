'use client'

import { useState, useEffect } from 'react'
import { BookOpen, ChevronRight, X, ArrowLeft, Volume2 } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import {
  qaidaLessons,
  LETTER_FORMS,
  type QaidaLesson,
  type AlphabetContent,
  type CompoundContent,
  type HarakatSection,
  type TajweedSection,
} from '@/lib/qaida-data'
import { getItem, setItem } from '@/lib/storage'
import { speakArabic, stopSpeech, isSpeechSupported } from '@/lib/arabic-speech'

// ─── Constants ──────────────────────────────────────────────────────────────

const PROGRESS_KEY = 'qaida_progress'

// ─── Helpers ────────────────────────────────────────────────────────────────

function contentCount(lesson: QaidaLesson): string {
  if (lesson.type === 'alphabet') return `${lesson.content.length} letters`
  if (lesson.type === 'compounds') return `${lesson.content.length} pairs`
  if (lesson.type === 'tajweed') return `${(lesson.content as TajweedSection[]).length} rules`
  // harakat / maddah
  return `${(lesson.content as HarakatSection[]).length} sections`
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function QaidaPage() {
  const [started, setStarted] = useState<string[]>([])
  const [activeLesson, setActiveLesson] = useState<QaidaLesson | null>(null)
  const [selectedLetter, setSelectedLetter] = useState<AlphabetContent | null>(null)
  const [speaking, setSpeaking] = useState<string | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    setStarted(getItem<string[]>(PROGRESS_KEY, []))
  }, [])

  // Detect speech support
  useEffect(() => {
    setSpeechSupported(isSpeechSupported())
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        setSpeechSupported(true)
      })
    }
  }, [])

  const playArabic = (text: string, id: string) => {
    if (speaking === id) {
      stopSpeech()
      setSpeaking(null)
      return
    }
    setSpeaking(id)
    speakArabic(text, () => setSpeaking(null))
  }

  const playAllLetters = (letters: AlphabetContent[]) => {
    let i = 0
    const playNext = () => {
      if (i >= letters.length) { setSpeaking(null); return }
      const letter = letters[i++]
      setSpeaking(`letter-${letter.name}`)
      speakArabic(letter.arabic, () => {
        setTimeout(playNext, 600)
      })
    }
    playNext()
  }

  const SpeakerBtn = ({ text, id }: { text: string; id: string }) => {
    if (!speechSupported) return null
    const isPlaying = speaking === id
    return (
      <button
        onClick={(e) => { e.stopPropagation(); playArabic(text, id) }}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
          isPlaying
            ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
            : 'bg-gray-800 text-gray-400 active:bg-gray-700 active:text-white'
        }`}
        aria-label={isPlaying ? 'Stop' : 'Play pronunciation'}
      >
        <Volume2 className="h-4 w-4" />
      </button>
    )
  }

  // Lock body scroll when sheet is open — save/restore position to avoid jump on close
  useEffect(() => {
    if (activeLesson) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      const top = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (top) window.scrollTo(0, -parseInt(top, 10))
    }
    return () => {
      const top = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (top) window.scrollTo(0, -parseInt(top, 10))
    }
  }, [activeLesson])

  // ── Open a lesson ──────────────────────────────────────────────────────────
  function openLesson(lesson: QaidaLesson) {
    setActiveLesson(lesson)
    setSelectedLetter(null)

    // Mark as started
    const id = String(lesson.id)
    setStarted((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      setItem(PROGRESS_KEY, next)
      return next
    })
  }

  function closeLesson() {
    setActiveLesson(null)
    setSelectedLetter(null)
  }

  // ── Progress ───────────────────────────────────────────────────────────────
  const total = qaidaLessons.length
  const progressPct = total > 0 ? Math.round((started.length / total) * 100) : 0

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={BookOpen}
        title="Noorani Qaida"
        subtitle="Learn Arabic Letters & Tajweed"
        gradient="from-teal-900 to-cyan-900"
        showBack
        heroTheme="quran"
      />

      {/* ── Progress bar ─────────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-2">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{started.length} of {total} lessons started</span>
          <span className="text-emerald-400 font-semibold">{progressPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Lesson list ──────────────────────────────────────────────── */}
      <div className="space-y-3 px-4 pt-3 animate-stagger">
        {qaidaLessons.map((lesson) => {
          const isStarted = started.includes(String(lesson.id))
          return (
            <button
              key={lesson.id}
              onClick={() => openLesson(lesson)}
              className="flex w-full items-center gap-3.5 rounded-2xl border border-gray-800 bg-gray-900 p-4 text-left transition-transform active:scale-[0.98]"
            >
              {/* Lesson number circle */}
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-sm font-bold text-teal-400">
                {lesson.id}
                {isStarted && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-gray-900 bg-emerald-400" />
                )}
              </div>

              {/* Icon */}
              <span className="text-xl leading-none">{lesson.icon}</span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-arabic text-lg text-[#f9fafb] leading-relaxed truncate">
                  {lesson.arabicTitle}
                </p>
                <p className="text-sm font-semibold text-[#f9fafb] truncate">{lesson.title}</p>
                <p className="text-xs text-gray-400 truncate">{lesson.description}</p>
              </div>

              {/* Content count pill + chevron */}
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-400">
                  {contentCount(lesson)}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Bottom-sheet overlay ──────────────────────────────────────── */}
      {activeLesson && (
        <div className="fixed inset-0 z-[70] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeLesson}
          />

          {/* Sheet */}
          <div
            className="relative flex flex-col rounded-t-3xl border-t border-gray-800 bg-[#0a0b14] animate-scale-in"
            style={{ maxHeight: '90dvh', height: '90dvh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="h-1 w-10 rounded-full bg-gray-700" />
            </div>

            {/* Header — fixed inside sheet, doesn't scroll */}
            <div className="shrink-0 flex items-center justify-between bg-[#0a0b14] px-5 pt-2 pb-3 border-b border-gray-800/60">
              <div className="flex-1 min-w-0">
                <p className="font-arabic text-xl text-teal-300 leading-relaxed truncate">
                  {activeLesson.arabicTitle}
                </p>
                <h2 className="text-lg font-bold text-[#f9fafb] truncate">
                  {activeLesson.title}
                </h2>
                <p className="text-xs text-gray-400">{activeLesson.subtitle}</p>
              </div>
              <button
                onClick={closeLesson}
                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-transform active:scale-90"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Audio not supported notice */}
            {!speechSupported && (
              <div className="mx-4 mb-3 rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center shrink-0">
                <p className="text-xs text-gray-500">Audio not supported on this device</p>
              </div>
            )}

            {/* Content area — this is the ONLY thing that scrolls */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-16">
              {/* ── Alphabet ───────────────────────────────────────────── */}
              {activeLesson.type === 'alphabet' && (
                <>
                  {speechSupported && (
                    <button
                      onClick={() => {
                        if (speaking) { stopSpeech(); setSpeaking(null) }
                        else playAllLetters(activeLesson.content as AlphabetContent[])
                      }}
                      className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                        speaking
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-emerald-500/15 text-emerald-400'
                      }`}
                    >
                      <Volume2 className="h-4 w-4" />
                      {speaking ? 'Stop' : 'Play All Letters'}
                    </button>
                  )}
                  <AlphabetView
                    content={activeLesson.content as AlphabetContent[]}
                    selectedLetter={selectedLetter}
                    onSelect={setSelectedLetter}
                    SpeakerBtn={SpeakerBtn}
                    speaking={speaking}
                  />
                </>
              )}

              {/* ── Compounds ──────────────────────────────────────────── */}
              {activeLesson.type === 'compounds' && (
                <CompoundsView content={activeLesson.content as CompoundContent[]} SpeakerBtn={SpeakerBtn} />
              )}

              {/* ── Harakat / Maddah ───────────────────────────────────── */}
              {(activeLesson.type === 'harakat' || activeLesson.type === 'maddah') && (
                <HarakatView content={activeLesson.content as HarakatSection[]} SpeakerBtn={SpeakerBtn} />
              )}

              {/* ── Tajweed ────────────────────────────────────────────── */}
              {activeLesson.type === 'tajweed' && (
                <TajweedView content={activeLesson.content as TajweedSection[]} SpeakerBtn={SpeakerBtn} />
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

function AlphabetView({
  content,
  selectedLetter,
  onSelect,
  SpeakerBtn,
  speaking,
}: {
  content: AlphabetContent[]
  selectedLetter: AlphabetContent | null
  onSelect: (l: AlphabetContent | null) => void
  SpeakerBtn: React.ComponentType<{ text: string; id: string }>
  speaking: string | null
}) {
  const forms = selectedLetter ? LETTER_FORMS[selectedLetter.arabic] : null

  return (
    <>
      {/* Letter grid — RTL: alif on the right, letters flow right→left */}
      <div className="grid grid-cols-4 gap-3" dir="rtl">
        {content.map((letter) => {
          const isActive = selectedLetter?.arabic === letter.arabic
          const isSpeaking = speaking === `letter-${letter.name}`
          return (
            <button
              key={letter.arabic}
              onClick={() => onSelect(isActive ? null : letter)}
              className={`relative flex flex-col items-center justify-center rounded-2xl border p-3 transition-all active:scale-95 ${
                isActive
                  ? 'border-teal-500/50 bg-teal-500/10'
                  : isSpeaking
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-gray-800 bg-gray-900'
              }`}
            >
              <span className="font-arabic text-4xl text-[#f9fafb] leading-none">
                {letter.arabic}
              </span>
              <span className="mt-1.5 text-xs text-teal-400">{letter.trans}</span>
              <span className="text-[10px] text-gray-500">{letter.name}</span>
              <div className="absolute top-1 right-1 scale-75">
                <SpeakerBtn text={letter.arabic} id={`letter-${letter.name}`} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected letter detail panel */}
      {selectedLetter && forms && (
        <div className="mt-5 rounded-2xl border border-teal-500/30 bg-teal-500/5 p-4 animate-scale-in">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => onSelect(null)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-gray-400"
              aria-label="Deselect letter"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <h3 className="flex-1 text-sm font-bold text-teal-300">
              {forms.name} &mdash; Letter Forms
            </h3>
            <SpeakerBtn text={selectedLetter.arabic} id={`detail-${selectedLetter.name}`} />
          </div>

          {/* Large letter display with pronunciation */}
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="font-arabic text-6xl text-[#f9fafb] leading-none">
              {selectedLetter.arabic}
            </span>
          </div>

          {/* Forms grid RTL: initial on right (reading start), final on left (reading end) */}
          <div className="grid grid-cols-3 gap-3" dir="rtl">
            {(['initial', 'medial', 'final'] as const).map((pos) => (
              <div
                key={pos}
                className="flex flex-col items-center rounded-xl border border-gray-800 bg-gray-900 p-3"
              >
                <span className="font-arabic text-3xl text-[#f9fafb] leading-none">
                  {forms[pos]}
                </span>
                <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {pos}
                </span>
                <div className="mt-1 scale-75">
                  <SpeakerBtn text={forms[pos]} id={`form-${selectedLetter.name}-${pos}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Makhraj */}
          <div className="mt-3 rounded-xl bg-gray-900 border border-gray-800 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
              Makhraj (Articulation Point)
            </p>
            <p className="text-xs text-gray-300">{selectedLetter.makhraj}</p>
          </div>
        </div>
      )}
    </>
  )
}

function CompoundsView({
  content,
  SpeakerBtn,
}: {
  content: CompoundContent[]
  SpeakerBtn: React.ComponentType<{ text: string; id: string }>
}) {
  return (
    <div className="grid grid-cols-3 gap-3" dir="rtl">
      {content.map((pair, i) => (
        <div
          key={i}
          className="relative flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900 p-4"
        >
          <span className="font-arabic text-3xl text-[#f9fafb] leading-none">
            {pair.arabic}
          </span>
          <span className="mt-2 text-xs font-semibold text-teal-400">{pair.name}</span>
          <span className="mt-0.5 text-[10px] text-gray-500 text-center">{pair.note}</span>
          <div className="mt-1.5 scale-75">
            <SpeakerBtn text={pair.arabic} id={`compound-${i}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

function HarakatView({
  content,
  SpeakerBtn,
}: {
  content: HarakatSection[]
  SpeakerBtn: React.ComponentType<{ text: string; id: string }>
}) {
  return (
    <div className="space-y-6">
      {content.map((section, si) => (
        <div key={si}>
          <h3 className="text-sm font-bold text-teal-300 mb-1">{section.section}</h3>
          <p className="text-xs text-gray-400 mb-3">{section.desc}</p>

          <div className="grid grid-cols-4 gap-2.5" dir="rtl">
            {section.examples.map((ex, ei) => (
              <div
                key={ei}
                className="flex flex-col items-center rounded-xl border border-gray-800 bg-gray-900 px-2 py-3"
              >
                <span className="font-arabic text-2xl text-[#f9fafb] leading-none">
                  {ex.arabic}
                </span>
                <span className="mt-1.5 text-[10px] text-gray-400">{ex.trans}</span>
                <div className="mt-1 scale-75">
                  <SpeakerBtn text={ex.arabic} id={`harakat-${si}-${ei}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TajweedView({
  content,
  SpeakerBtn,
}: {
  content: TajweedSection[]
  SpeakerBtn: React.ComponentType<{ text: string; id: string }>
}) {
  return (
    <div className="space-y-6">
      {content.map((section, si) => (
        <div key={si}>
          <h3 className="text-sm font-bold text-teal-300 mb-1">{section.section}</h3>
          <p className="text-xs text-gray-400 mb-3">{section.desc}</p>

          <div className="space-y-2">
            {section.examples.map((ex, ei) => (
              <div
                key={ei}
                className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 px-4 py-3"
              >
                {/* Transliteration on the left (LTR English) */}
                <span className="text-xs text-gray-400 flex-1">{ex.trans}</span>
                {/* Arabic + speaker on the right */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-arabic text-xl text-[#f9fafb] leading-none">
                    {ex.arabic}
                  </span>
                  <SpeakerBtn text={ex.arabic} id={`tajweed-${si}-${ei}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
