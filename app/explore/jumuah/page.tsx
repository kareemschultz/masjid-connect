'use client'

import { useState, useEffect } from 'react'
import { Sun, Check, BookOpen, ChevronRight, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'

const CHECKLIST_ITEMS = [
  'Made ghusl (full bath) before Jumu\'ah',
  'Wore clean clothes / best appearance',
  'Applied attar/perfume (men)',
  'Read Surah Al-Kahf',
  'Went early to masjid',
  'Made dua between Asr and Maghrib',
  'Sent extra salawat on the Prophet \uFDFA',
]

interface KhutbahNote {
  date: string
  note: string
}

const FRIDAY_DUAS = [
  {
    arabic: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u062C\u0652\u0639\u064E\u0644\u0652\u0646\u0650\u064A \u0645\u0650\u0646\u064E \u0627\u0644\u062A\u0651\u064E\u0648\u0651\u064E\u0627\u0628\u0650\u064A\u0646\u064E \u0648\u064E\u0627\u062C\u0652\u0639\u064E\u0644\u0652\u0646\u0650\u064A \u0645\u0650\u0646\u064E \u0627\u0644\u0652\u0645\u064F\u062A\u064E\u0637\u064E\u0647\u0651\u0650\u0631\u0650\u064A\u0646\u064E',
    transliteration: "Allahumma-j'alni minat-tawwabeen waj'alni minal-mutatahhireen",
    meaning: 'O Allah, make me among those who repent and those who purify themselves.',
  },
  {
    arabic: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0625\u0650\u0646\u0651\u0650\u064A \u0623\u064E\u0633\u0652\u0623\u064E\u0644\u064F\u0643\u064E \u0645\u0650\u0646\u0652 \u062E\u064E\u064A\u0652\u0631\u0650 \u0647\u064E\u0630\u064E\u0627 \u0627\u0644\u0652\u064A\u064E\u0648\u0652\u0645\u0650 \u0648\u064E\u062E\u064E\u064A\u0652\u0631\u0650 \u0645\u064E\u0627 \u0628\u064E\u0639\u0652\u062F\u064E\u0647\u064F',
    transliteration: "Allahumma inni as'aluka min khayri hadhal-yawm wa khayri ma ba'dah",
    meaning: 'O Allah, I ask You for the good of this day and what comes after it.',
  },
  {
    arabic: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0635\u064E\u0644\u0651\u0650 \u0639\u064E\u0644\u064E\u0649 \u0645\u064F\u062D\u064E\u0645\u0651\u064E\u062F\u064D \u0648\u064E\u0639\u064E\u0644\u064E\u0649 \u0622\u0644\u0650 \u0645\u064F\u062D\u064E\u0645\u0651\u064E\u062F\u064D',
    transliteration: "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad",
    meaning: 'O Allah, send blessings upon Muhammad and the family of Muhammad.',
  },
]

function getTodayKey() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `jumuah_checklist_${yyyy}-${mm}-${dd}`
}

export default function JumuahPage() {
  const [checklist, setChecklist] = useState<boolean[]>(Array(7).fill(false))
  const [khutbahText, setKhutbahText] = useState('')
  const [notes, setNotes] = useState<KhutbahNote[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = getItem<boolean[]>(getTodayKey(), Array(7).fill(false))
    setChecklist(saved)
    const savedNotes = getItem<KhutbahNote[]>('jumuah_notes', [])
    setNotes(savedNotes)
  }, [])

  function toggleItem(index: number) {
    const next = [...checklist]
    next[index] = !next[index]
    setChecklist(next)
    setItem(getTodayKey(), next)
  }

  const completedCount = checklist.filter(Boolean).length
  const progress = completedCount / 7

  function saveNote() {
    if (!khutbahText.trim()) return
    const d = new Date()
    const dateStr = d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const updated = [{ date: dateStr, note: khutbahText.trim() }, ...notes]
    setNotes(updated)
    setItem('jumuah_notes', updated)
    setKhutbahText('')
  }

  function deleteNote(index: number) {
    const updated = notes.filter((_, i) => i !== index)
    setNotes(updated)
    setItem('jumuah_notes', updated)
  }

  // SVG progress ring
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progress * circumference

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <PageHero icon={Sun} title="Jumu'ah" subtitle="Friday Prayer Preparation" gradient="from-emerald-900 to-teal-900" showBack  heroTheme="prayer" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero icon={Sun} title="Jumu'ah" subtitle="Friday Prayer Preparation" gradient="from-emerald-900 to-teal-900" showBack  heroTheme="prayer" />

      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">

        {/* ── SECTION 1: Preparation Checklist ── */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-foreground">Preparation Checklist</h2>

          <div className="rounded-2xl border border-border bg-card p-5">
            {/* Progress ring */}
            <div className="mb-5 flex flex-col items-center">
              <div className="relative h-24 w-24">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-gray-800"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="text-emerald-500 transition-all duration-500"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-foreground">{completedCount}<span className="text-sm text-muted-foreground">/7</span></span>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {completedCount === 7 ? 'All done! May Allah accept.' : 'Tap to mark completed'}
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleItem(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                    checklist[i]
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-secondary/50 border border-border/50 active:scale-[0.98]'
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                      checklist[i] ? 'bg-emerald-500 text-foreground' : 'border-2 border-gray-600'
                    }`}
                  >
                    {checklist[i] && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <span className={`text-sm ${checklist[i] ? 'text-emerald-300 line-through' : 'text-foreground/80'}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 2: Surah Al-Kahf ── */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-foreground">Surah Al-Kahf</h2>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <p className="text-sm leading-relaxed text-emerald-200/90">
                &ldquo;Whoever reads Surah Al-Kahf on Friday will have a light between the two Fridays.&rdquo;
              </p>
              <p className="mt-2 text-xs text-emerald-400/60">Sahih al-Jaami</p>
            </div>

            <Link
              href="/quran/18"
              className="mb-5 flex items-center justify-between rounded-xl bg-secondary/50 border border-border/50 px-4 py-3 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">Open in Quran</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
              <p className="font-arabic text-right text-lg leading-[2] text-gray-100" dir="rtl">
                {'\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650'}
              </p>
              <p className="font-arabic mt-3 text-right text-lg leading-[2] text-gray-100" dir="rtl">
                {'\u0627\u0644\u0652\u062D\u064E\u0645\u0652\u062F\u064F \u0644\u0650\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0651\u064E\u0630\u0650\u064A \u0623\u064E\u0646\u0632\u064E\u0644\u064E \u0639\u064E\u0644\u064E\u0649\u0670 \u0639\u064E\u0628\u0652\u062F\u0650\u0647\u0650 \u0627\u0644\u0652\u0643\u0650\u062A\u064E\u0627\u0628\u064E \u0648\u064E\u0644\u064E\u0645\u0652 \u064A\u064E\u062C\u0652\u0639\u064E\u0644 \u0644\u0651\u064E\u0647\u064F \u0639\u0650\u0648\u064E\u062C\u064B\u0627 \u06DC'}
              </p>
              <p className="font-arabic mt-3 text-right text-lg leading-[2] text-gray-100" dir="rtl">
                {'\u0642\u064E\u064A\u0651\u0650\u0645\u064B\u0627 \u0644\u0651\u0650\u064A\u064F\u0646\u0630\u0650\u0631\u064E \u0628\u064E\u0623\u0652\u0633\u064B\u0627 \u0634\u064E\u062F\u0650\u064A\u062F\u064B\u0627 \u0645\u0651\u0650\u0646 \u0644\u0651\u064E\u062F\u064F\u0646\u0652\u0647\u064F \u0648\u064E\u064A\u064F\u0628\u064E\u0634\u0651\u0650\u0631\u064E \u0627\u0644\u0652\u0645\u064F\u0624\u0652\u0645\u0650\u0646\u0650\u064A\u0646\u064E \u0627\u0644\u0651\u064E\u0630\u0650\u064A\u0646\u064E \u064A\u064E\u0639\u0652\u0645\u064E\u0644\u064F\u0648\u0646\u064E \u0627\u0644\u0635\u0651\u064E\u0627\u0644\u0650\u062D\u064E\u0627\u062A\u0650 \u0623\u064E\u0646\u0651\u064E \u0644\u064E\u0647\u064F\u0645\u0652 \u0623\u064E\u062C\u0652\u0631\u064B\u0627 \u062D\u064E\u0633\u064E\u0646\u064B\u0627'}
              </p>
              <p className="font-arabic mt-3 text-right text-lg leading-[2] text-gray-100" dir="rtl">
                {'\u0645\u0651\u064E\u0627\u0643\u0650\u062B\u0650\u064A\u0646\u064E \u0641\u0650\u064A\u0647\u0650 \u0623\u064E\u0628\u064E\u062F\u064B\u0627'}
              </p>
              <p className="font-arabic mt-3 text-right text-lg leading-[2] text-gray-100" dir="rtl">
                {'\u0648\u064E\u064A\u064F\u0646\u0630\u0650\u0631\u064E \u0627\u0644\u0651\u064E\u0630\u0650\u064A\u0646\u064E \u0642\u064E\u0627\u0644\u064F\u0648\u0627 \u0627\u062A\u0651\u064E\u062E\u064E\u0630\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0648\u064E\u0644\u064E\u062F\u064B\u0627'}
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: Khutbah Log ── */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-foreground">Khutbah Log</h2>

          <div className="rounded-2xl border border-border bg-card p-5">
            <textarea
              value={khutbahText}
              onChange={(e) => setKhutbahText(e.target.value)}
              placeholder="What was today's khutbah about?"
              rows={3}
              className="w-full resize-none rounded-xl border border-border/50 bg-secondary/50 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
            />
            <button
              onClick={saveNote}
              disabled={!khutbahText.trim()}
              className="mt-3 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-foreground transition-all active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
            >
              Save Note
            </button>

            {/* Past notes */}
            {notes.length > 0 && (
              <div className="mt-5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Past Notes</h3>
                {notes.slice(0, 4).map((entry, i) => (
                  <div
                    key={`${entry.date}-${i}`}
                    className="rounded-xl bg-secondary/50 border border-border/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-emerald-400/70">{entry.date}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{entry.note}</p>
                      </div>
                      <button
                        onClick={() => deleteNote(i)}
                        className="shrink-0 rounded-lg p-1.5 text-muted-foreground/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── SECTION 4: Friday Duas ── */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-foreground">Friday Duas</h2>

          <div className="space-y-4">
            {FRIDAY_DUAS.map((dua, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-arabic text-right text-lg leading-[2] text-gray-100" dir="rtl">
                  {dua.arabic}
                </p>
                <p className="mt-3 text-sm italic text-emerald-300/80">{dua.transliteration}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{dua.meaning}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <BottomNav />
    </div>
  )
}
