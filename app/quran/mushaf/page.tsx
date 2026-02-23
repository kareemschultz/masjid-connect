'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Menu, X, Loader2, Share2, Copy, MessageCircle } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'

// ─── Surah → Starting Page (Madinah Mushaf) ──────────────────────────────────

const SURAH_PAGES: Record<number, number> = {
  1:1,2:2,3:50,4:77,5:106,6:128,7:151,8:177,9:187,10:208,
  11:221,12:235,13:249,14:255,15:262,16:267,17:282,18:293,19:305,20:312,
  21:322,22:332,23:342,24:350,25:359,26:367,27:377,28:385,29:396,30:404,
  31:411,32:415,33:418,34:428,35:434,36:440,37:446,38:453,39:458,40:467,
  41:477,42:483,43:489,44:496,45:499,46:502,47:507,48:511,49:515,50:518,
  51:520,52:523,53:526,54:528,55:531,56:534,57:537,58:542,59:545,60:549,
  61:551,62:553,63:554,64:556,65:558,66:560,67:562,68:564,69:566,70:568,
  71:570,72:572,73:574,74:575,75:577,76:578,77:580,78:582,79:583,80:585,
  81:586,82:587,83:587,84:589,85:590,86:591,87:591,88:592,89:593,90:594,
  91:595,92:595,93:596,94:596,95:597,96:597,97:598,98:598,99:599,100:599,
  101:600,102:600,103:601,104:601,105:601,106:602,107:602,108:602,109:603,
  110:603,111:603,112:604,113:604,114:604,
}

// Surah names (English)
const SURAH_NAMES: Record<number, string> = {
  1:'Al-Fatihah',2:'Al-Baqarah',3:'Ali \'Imran',4:'An-Nisa\'',5:'Al-Ma\'idah',
  6:'Al-An\'am',7:'Al-A\'raf',8:'Al-Anfal',9:'At-Tawbah',10:'Yunus',
  11:'Hud',12:'Yusuf',13:'Ar-Ra\'d',14:'Ibrahim',15:'Al-Hijr',16:'An-Nahl',
  17:'Al-Isra\'',18:'Al-Kahf',19:'Maryam',20:'Ta-Ha',21:'Al-Anbiya\'',
  22:'Al-Hajj',23:'Al-Mu\'minun',24:'An-Nur',25:'Al-Furqan',26:'Ash-Shu\'ara\'',
  27:'An-Naml',28:'Al-Qasas',29:'Al-\'Ankabut',30:'Ar-Rum',31:'Luqman',
  32:'As-Sajdah',33:'Al-Ahzab',34:'Saba\'',35:'Fatir',36:'Ya-Sin',
  37:'As-Saffat',38:'Sad',39:'Az-Zumar',40:'Ghafir',41:'Fussilat',
  42:'Ash-Shura',43:'Az-Zukhruf',44:'Ad-Dukhan',45:'Al-Jathiyah',46:'Al-Ahqaf',
  47:'Muhammad',48:'Al-Fath',49:'Al-Hujurat',50:'Qaf',51:'Adh-Dhariyat',
  52:'At-Tur',53:'An-Najm',54:'Al-Qamar',55:'Ar-Rahman',56:'Al-Waqi\'ah',
  57:'Al-Hadid',58:'Al-Mujadila',59:'Al-Hashr',60:'Al-Mumtahanah',61:'As-Saf',
  62:'Al-Jumu\'ah',63:'Al-Munafiqun',64:'At-Taghabun',65:'At-Talaq',66:'At-Tahrim',
  67:'Al-Mulk',68:'Al-Qalam',69:'Al-Haqqah',70:'Al-Ma\'arij',71:'Nuh',
  72:'Al-Jinn',73:'Al-Muzzammil',74:'Al-Muddaththir',75:'Al-Qiyamah',76:'Al-Insan',
  77:'Al-Mursalat',78:'An-Naba\'',79:'An-Nazi\'at',80:'\'Abasa',81:'At-Takwir',
  82:'Al-Infitar',83:'Al-Mutaffifin',84:'Al-Inshiqaq',85:'Al-Buruj',86:'At-Tariq',
  87:'Al-A\'la',88:'Al-Ghashiyah',89:'Al-Fajr',90:'Al-Balad',91:'Ash-Shams',
  92:'Al-Layl',93:'Ad-Duha',94:'Ash-Sharh',95:'At-Tin',96:'Al-\'Alaq',
  97:'Al-Qadr',98:'Al-Bayyinah',99:'Az-Zalzalah',100:'Al-\'Adiyat',101:'Al-Qari\'ah',
  102:'At-Takathur',103:'Al-\'Asr',104:'Al-Humazah',105:'Al-Fil',106:'Quraysh',
  107:'Al-Ma\'un',108:'Al-Kawthar',109:'Al-Kafirun',110:'An-Nasr',111:'Al-Masad',
  112:'Al-Ikhlas',113:'Al-Falaq',114:'An-Nas',
}

// ─── API Types ────────────────────────────────────────────────────────────────

interface Word {
  id: number
  text_uthmani: string
  char_type_name: string
  line_number: number
  page_number: number
}

interface Verse {
  id: number
  verse_key: string
  verse_number: number
  page_number: number
  juz_number: number
  words: Word[]
}

interface PageData {
  verses: Verse[]
  page: number
  chapter?: { id: number; name_arabic: string }
}

// ─── Page Data Cache ──────────────────────────────────────────────────────────
const cache: Record<number, PageData | null> = {}

async function fetchPage(page: number): Promise<PageData | null> {
  if (cache[page] !== undefined) return cache[page]
  try {
    const res = await fetch(
      `/api/quran/page?page=${page}`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    cache[page] = data
    return data
  } catch {
    cache[page] = null
    return null
  }
}

// ─── Common Verse Translations (for sharing) ─────────────────────────────────
const VERSE_TRANSLATIONS: Record<string, string> = {
  '1:1': 'In the name of Allah, the Most Gracious, the Most Merciful.',
  '1:2': 'All praise is due to Allah, Lord of the worlds.',
  '2:152': 'So remember Me; I will remember you.',
  '2:153': 'Indeed, Allah is with the patient.',
  '2:186': 'I am near. I respond to the invocation of the supplicant when he calls upon Me.',
  '2:255': 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.',
  '2:286': 'Allah does not burden a soul beyond that it can bear.',
  '3:139': 'Do not weaken and do not grieve, for you will be superior if you are believers.',
  '12:87': 'Do not despair of the mercy of Allah.',
  '13:28': 'Verily, in the remembrance of Allah do hearts find rest.',
  '40:60': 'Call upon Me; I will respond to you.',
  '55:13': 'So which of the favors of your Lord would you deny?',
  '93:5': 'And your Lord is going to give you, and you will be satisfied.',
  '94:6': 'Indeed, with hardship comes ease.',
  '112:1': 'Say: He is Allah, the One.',
}

interface SelectedVerse {
  verseKey: string
  arabicText: string
  surahName: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MushafPage() {
  const [currentPage, setCurrentPage] = useState(() => {
    const urlPage = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('page') : null
    if (urlPage) return Math.max(1, Math.min(604, parseInt(urlPage) || 1))
    return getItem<number>('mushaf_page', 1)
  })
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNav, setShowNav] = useState(false)
  const [jumpTo, setJumpTo] = useState('')
  const [surahFilter, setSurahFilter] = useState('')
  const [selectedVerse, setSelectedVerse] = useState<SelectedVerse | null>(null)
  const [copied, setCopied] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const loadPage = useCallback(async (page: number) => {
    setLoading(true)
    const data = await fetchPage(page)
    setPageData(data)
    setLoading(false)
    setItem('mushaf_page', page)
    localStorage.setItem('quran_last_page', String(page))
  }, [])

  useEffect(() => { loadPage(currentPage) }, [currentPage, loadPage])

  // Prefetch adjacent pages
  useEffect(() => {
    if (currentPage > 1) fetchPage(currentPage - 1)
    if (currentPage < 604) fetchPage(currentPage + 1)
  }, [currentPage])

  const goTo = (page: number) => {
    const p = Math.max(1, Math.min(604, page))
    setCurrentPage(p)
  }

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 60) diff > 0 ? goTo(currentPage + 1) : goTo(currentPage - 1)
    touchStartX.current = null
  }

  // Group verses by line for Mus'haf layout
  const renderPageText = () => {
    if (!pageData || pageData.verses.length === 0) return null

    // Collect all words with line numbers
    const allWords: (Word & { verseKey: string; isEnd?: boolean })[] = []
    let prevChapterId = -1

    for (const verse of pageData.verses) {
      const chapterId = parseInt(verse.verse_key.split(':')[0])
      // Surah header placeholder
      if (chapterId !== prevChapterId && chapterId > 1) {
        // marker
      }
      prevChapterId = chapterId
      for (const word of verse.words) {
        allWords.push({ ...word, verseKey: verse.verse_key, isEnd: word.char_type_name === 'end' })
      }
    }

    // Group by line_number
    const lines: Record<number, typeof allWords> = {}
    for (const w of allWords) {
      if (!lines[w.line_number]) lines[w.line_number] = []
      lines[w.line_number].push(w)
    }

    // Detect surah starts
    const surahStarts = new Set<number>()
    let prev = -1
    for (const verse of pageData.verses) {
      const ch = parseInt(verse.verse_key.split(':')[0])
      if (ch !== prev) { surahStarts.add(ch); prev = ch }
    }

    const sortedLines = Object.entries(lines)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, words]) => words)

    const juz = pageData.verses[0]?.juz_number

    return (
      <div className="flex flex-col gap-0">
        {/* Page meta */}
        <div className="flex items-center justify-between px-4 py-2 text-[10px] text-gray-500">
          <span>Juz {juz}</span>
          <span>Page {currentPage}</span>
        </div>

        {/* Surah banners */}
        {Array.from(surahStarts).map(ch => {
          if (ch === 1 || ch === 9) return null // Al-Fatihah and At-Tawbah have no Basmala
          return (
            <div key={ch} className="mx-4 mb-3 rounded-xl border border-amber-500/20 bg-amber-500/5 py-2 text-center">
              <p className="font-arabic text-base text-amber-300">{SURAH_NAMES[ch]}</p>
              {ch !== 9 && (
                <p className="mt-1 font-arabic text-xs text-amber-400/60">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}
            </div>
          )
        })}

        {/* Text lines */}
        <div
          className="px-4 py-2 space-y-3"
          dir="rtl"
        >
          {sortedLines.map((words, li) => (
            <p
              key={li}
              className="text-center leading-[2.2] text-white"
              style={{ fontFamily: '"Amiri Quran", "Amiri", serif', fontSize: '1.25rem' }}
            >
              {words.map((w, wi) => {
                if (w.char_type_name === 'end') {
                  return (
                    <span
                      key={wi}
                      className="text-amber-400/80 cursor-pointer active:bg-amber-500/20 rounded px-0.5"
                      onClick={() => {
                        // Collect all words for this verse
                        const verseWords = allWords
                          .filter(aw => aw.verseKey === w.verseKey && aw.char_type_name !== 'end')
                          .map(aw => aw.text_uthmani)
                          .join(' ')
                        const chId = parseInt(w.verseKey.split(':')[0])
                        setSelectedVerse({
                          verseKey: w.verseKey,
                          arabicText: verseWords,
                          surahName: SURAH_NAMES[chId] || `Surah ${chId}`,
                        })
                      }}
                    >
                      {w.text_uthmani}{' '}
                    </span>
                  )
                }
                return (
                  <span key={wi}>
                    {w.text_uthmani}{' '}
                  </span>
                )
              })}
            </p>
          ))}
        </div>
      </div>
    )
  }

  const filteredSurahs = Object.entries(SURAH_NAMES).filter(([, name]) =>
    !surahFilter || name.toLowerCase().includes(surahFilter.toLowerCase())
  )

  return (
    <div
      className="min-h-screen bg-[#0a0b14] pb-28"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <PageHero
        icon={BookOpen}
        title="Mus'haf"
        subtitle="Page-by-page Quran"
        gradient="from-amber-900 to-orange-900"
        showBack
      
        heroTheme="quran"
      />

      {/* Controls */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-[#0a0b14]/95 backdrop-blur border-b border-gray-800/50 px-4 py-2.5">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-300 disabled:opacity-30 active:bg-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Page indicator + jump */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Page</span>
          <input
            type="number"
            value={jumpTo || currentPage}
            onChange={e => setJumpTo(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const p = parseInt((e.target as HTMLInputElement).value)
                if (!isNaN(p)) { goTo(p); setJumpTo('') }
              }
            }}
            className="w-14 rounded-lg border border-gray-700 bg-gray-900 px-2 py-1 text-center text-sm text-white outline-none focus:border-amber-500/50"
            min={1}
            max={604}
          />
          <span className="text-xs text-gray-500">/ 604</span>
        </div>

        <div className="flex gap-2">
          {/* Surah Nav */}
          <button
            onClick={() => setShowNav(!showNav)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${showNav ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-300 active:bg-gray-700'}`}
          >
            {showNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage >= 604}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-300 disabled:opacity-30 active:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Surah Navigation Drawer */}
      {showNav && (
        <div className="absolute left-0 right-0 z-30 border-b border-gray-800 bg-gray-950 shadow-2xl">
          <div className="px-4 pt-3 pb-2">
            <input
              type="text"
              placeholder="Search surah..."
              value={surahFilter}
              onChange={e => setSurahFilter(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-amber-500/50"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredSurahs.map(([num, name]) => (
              <button
                key={num}
                onClick={() => {
                  goTo(SURAH_PAGES[parseInt(num)])
                  setShowNav(false)
                  setSurahFilter('')
                }}
                className="flex w-full items-center gap-3 border-b border-gray-800/30 px-4 py-2.5 text-left active:bg-white/5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-[11px] font-bold text-amber-400">
                  {num}
                </span>
                <span className="text-sm text-gray-300">{name}</span>
                <span className="ml-auto text-xs text-gray-600">p. {SURAH_PAGES[parseInt(num)]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Page Content ─────────────────────────────────── */}
      <div className="mx-4 mt-4 min-h-[60vh] rounded-2xl border border-gray-800 bg-gray-900/60">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
          </div>
        ) : pageData === null ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center px-8">
            <p className="text-gray-500 text-sm">Could not load page. Check your connection.</p>
            <button onClick={() => loadPage(currentPage)} className="text-xs text-amber-400 underline underline-offset-4">
              Retry
            </button>
          </div>
        ) : renderPageText()}
      </div>

      {/* Swipe hint */}
      <p className="mt-3 text-center text-[10px] text-gray-700">Swipe left/right to turn pages</p>

      {/* Page progress bar */}
      <div className="mx-4 mt-3 h-1 rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-amber-500/50"
          style={{ width: `${(currentPage / 604) * 100}%` }}
        />
      </div>

      {/* ── Verse Share Bottom Sheet ─────────────────────── */}
      {selectedVerse && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center" onClick={() => setSelectedVerse(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg rounded-t-3xl border-t border-gray-700 bg-gray-900 px-5 pb-8 pt-5 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-700" />

            {/* Arabic text */}
            <p
              className="mb-3 text-center text-xl leading-[2.2] text-white"
              dir="rtl"
              style={{ fontFamily: '"Amiri Quran", "Amiri", serif' }}
            >
              {selectedVerse.arabicText}
            </p>

            {/* Translation (if available) */}
            {VERSE_TRANSLATIONS[selectedVerse.verseKey] && (
              <p className="mb-3 text-center text-sm italic text-gray-300">
                &ldquo;{VERSE_TRANSLATIONS[selectedVerse.verseKey]}&rdquo;
              </p>
            )}

            {/* Reference */}
            <p className="mb-5 text-center text-xs text-amber-400/70">
              {selectedVerse.surahName} — {selectedVerse.verseKey}
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={async () => {
                  const translation = VERSE_TRANSLATIONS[selectedVerse.verseKey]
                  const text = `${selectedVerse.arabicText}${translation ? `\n\n"${translation}"` : ''}\n— Quran ${selectedVerse.verseKey}\n\nvia MasjidConnect GY`
                  if (navigator.share) {
                    await navigator.share({ text }).catch(() => {})
                  } else {
                    await navigator.clipboard.writeText(text).catch(() => {})
                  }
                }}
                className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-3.5 text-emerald-400 active:bg-emerald-500/20"
              >
                <Share2 className="h-5 w-5" />
                <span className="text-[11px] font-semibold">Share</span>
              </button>

              <button
                onClick={async () => {
                  const translation = VERSE_TRANSLATIONS[selectedVerse.verseKey]
                  const text = `${selectedVerse.arabicText}${translation ? `\n\n"${translation}"` : ''}\n— Quran ${selectedVerse.verseKey}`
                  await navigator.clipboard.writeText(text).catch(() => {})
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1500)
                }}
                className="flex flex-col items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 py-3.5 text-blue-400 active:bg-blue-500/20"
              >
                <Copy className="h-5 w-5" />
                <span className="text-[11px] font-semibold">{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={() => {
                  const translation = VERSE_TRANSLATIONS[selectedVerse.verseKey]
                  const text = `${selectedVerse.arabicText}${translation ? `\n\n"${translation}"` : ''}\n— Quran ${selectedVerse.verseKey}\n\nvia MasjidConnect GY`
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                }}
                className="flex flex-col items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 py-3.5 text-green-400 active:bg-green-500/20"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-[11px] font-semibold">WhatsApp</span>
              </button>
            </div>

            {/* Close */}
            <button
              onClick={() => setSelectedVerse(null)}
              className="mt-4 w-full rounded-2xl border border-gray-800 bg-gray-800/50 py-3 text-sm font-medium text-gray-400 active:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
