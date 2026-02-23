'use client'

import { useState, useCallback, useEffect } from 'react'
import { Keyboard } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

// ─── Data ───────────────────────────────────────────────────────────────────

const ARABIC_LETTERS = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
]

const ARABIC_WORDS = [
  'الله',
  'الرحمن',
  'بسم',
  'محمد',
  'إسلام',
  'قرآن',
  'صلاة',
  'زكاة',
  'صوم',
  'حج',
]

type Mode = 'letters' | 'words'
type Flash = 'correct' | 'wrong' | null

// ─── Component ──────────────────────────────────────────────────────────────

export default function ArabicTypingPage() {
  const [mode, setMode] = useState<Mode>('letters')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [flash, setFlash] = useState<Flash>(null)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)

  // Reset state when mode changes
  useEffect(() => {
    setCurrentIndex(0)
    setCharIndex(0)
    setTyped('')
    setFlash(null)
    setCorrect(0)
    setTotal(0)
  }, [mode])

  // Current target data
  const items = mode === 'letters' ? ARABIC_LETTERS : ARABIC_WORDS
  const currentItem = items[currentIndex % items.length]
  const targetChar =
    mode === 'letters'
      ? currentItem
      : currentItem[charIndex]

  // Flash helper
  const triggerFlash = useCallback((type: 'correct' | 'wrong') => {
    setFlash(type)
    const id = setTimeout(() => setFlash(null), 300)
    return () => clearTimeout(id)
  }, [])

  // Handle key press from on-screen keyboard
  function handleKeyPress(letter: string) {
    setTotal((prev) => prev + 1)

    if (letter === targetChar) {
      // Correct
      setCorrect((prev) => prev + 1)
      triggerFlash('correct')

      if (mode === 'letters') {
        // Move to next letter
        setCurrentIndex((prev) => (prev + 1) % items.length)
        setTyped('')
      } else {
        // Words mode — advance character within word
        const newTyped = typed + letter
        setTyped(newTyped)

        if (charIndex + 1 >= currentItem.length) {
          // Word complete — move to next word
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length)
            setCharIndex(0)
            setTyped('')
          }, 400)
        } else {
          setCharIndex((prev) => prev + 1)
        }
      }
    } else {
      // Wrong
      triggerFlash('wrong')
    }
  }

  // Accuracy calculation
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  // Flash background class for target area
  const flashBg =
    flash === 'correct'
      ? 'bg-emerald-500/20'
      : flash === 'wrong'
        ? 'bg-red-500/20'
        : 'bg-card'

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Keyboard}
        title="Arabic Practice"
        subtitle="Learn to write Arabic letters"
        gradient="from-emerald-900 to-teal-900"
        showBack
        heroTheme="quran"
      />

      {/* ── Mode toggle ──────────────────────────────────────────────── */}
      <div className="flex gap-2 px-4 pt-5">
        <button
          onClick={() => setMode('letters')}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            mode === 'letters'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-card text-muted-foreground border border-border'
          }`}
        >
          Letters
        </button>
        <button
          onClick={() => setMode('words')}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            mode === 'words'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-card text-muted-foreground border border-border'
          }`}
        >
          Words
        </button>
      </div>

      {/* ── Accuracy display ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-4">
        <p className="text-xs text-muted-foreground">
          {correct} / {total} correct
        </p>
        <p className="text-xs font-semibold text-emerald-400">
          {accuracy}% accuracy
        </p>
      </div>

      {/* ── Target display area ──────────────────────────────────────── */}
      <div className="px-4 pt-4">
        <div
          className={`flex flex-col items-center justify-center rounded-2xl border border-border p-8 transition-colors duration-200 ${flashBg}`}
        >
          {mode === 'letters' ? (
            <span className="text-6xl text-amber-400 font-arabic leading-none">
              {currentItem}
            </span>
          ) : (
            <div className="flex flex-row-reverse gap-1" dir="rtl">
              {currentItem.split('').map((char, i) => (
                <span
                  key={i}
                  className={`text-5xl font-arabic leading-none transition-colors duration-150 ${
                    i === charIndex
                      ? 'text-amber-400'
                      : i < charIndex
                        ? 'text-emerald-400'
                        : 'text-muted-foreground/60'
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>
          )}

          <p className="mt-2 text-xs text-muted-foreground/80">
            {mode === 'letters'
              ? `Letter ${(currentIndex % items.length) + 1} of ${items.length}`
              : `Word ${(currentIndex % items.length) + 1} of ${items.length}`}
          </p>
        </div>
      </div>

      {/* ── Typed display (Words mode) ───────────────────────────────── */}
      {mode === 'words' && (
        <div className="px-4 pt-3">
          <div className="rounded-xl border border-border bg-card px-4 py-3 min-h-[3rem] flex items-center justify-end">
            <span className="text-xl font-arabic text-foreground" dir="rtl">
              {typed || <span className="text-muted-foreground/60">...</span>}
            </span>
          </div>
        </div>
      )}

      {/* ── On-screen Arabic keyboard ────────────────────────────────── */}
      <div className="px-4 pt-4 pb-6">
        <div className="grid grid-cols-7 gap-2">
          {ARABIC_LETTERS.map((letter) => (
            <button
              key={letter}
              onClick={() => handleKeyPress(letter)}
              className="rounded-xl border border-border bg-secondary py-3 text-lg font-arabic text-foreground transition-all active:bg-muted active:scale-95"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
