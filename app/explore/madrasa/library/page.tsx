'use client'

import { useState } from 'react'
import { BookOpen, Download, X, ExternalLink, ChevronRight, BookMarked } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

// ─── GII Book Catalogue ───────────────────────────────────────────────────────
// To add a new book: get the Scribd embed code from the document page,
// extract the document ID and access_key from the iframe src URL.
// Scribd embed src format: https://www.scribd.com/embeds/{docId}/content?...&access_key={key}

interface GIIBook {
  id: number          // Scribd document ID
  title: string
  subtitle?: string
  category: string
  pages: number
  description: string
  accessKey: string   // from embed code: access_key=...
  color: string       // gradient for card
  icon: string        // emoji
  available: boolean  // false = coming soon (no embed key yet)
  scribdUrl?: string  // fallback direct link
}

const GII_BOOKS: GIIBook[] = [
  {
    id: 228105475,
    title: 'Commentary on Aqeedah Tahawiyyah',
    subtitle: 'Basic Commentary of Aqeedah Tahawiyyah',
    category: 'Aqeedah',
    pages: 151,
    description:
      'A classical foundational text on Islamic creed by Imam Abu Jafar Al-Tahawi, with commentary. Essential reading for understanding core beliefs of Ahl al-Sunnah wal-Jama\'ah.',
    accessKey: 'key-55vSmeJbyVmwMye3atWH',
    color: 'from-emerald-800 to-teal-900',
    icon: '📖',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/228105475/Aqeedah-Tahawiyyah',
  },
  {
    id: 0,
    title: 'Fiqh-us-Seerah',
    subtitle: 'Lessons from the Life of Prophet Muhammad ﷺ',
    category: 'Seerah',
    pages: 185,
    description:
      'A comprehensive study of the Seerah (biography) of the Prophet Muhammad ﷺ with fiqh-based lessons and practical guidance for modern Muslims.',
    accessKey: '',
    color: 'from-blue-800 to-indigo-900',
    icon: '🌙',
    available: false,
    scribdUrl: 'https://www.scribd.com/user/195972181/guyii86',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Aqeedah: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Seerah: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Fiqh: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  Tafseer: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Hadith: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
}

export default function GIILibraryPage() {
  const [activeBook, setActiveBook] = useState<GIIBook | null>(null)
  const [readerLoaded, setReaderLoaded] = useState(false)

  function openBook(book: GIIBook) {
    if (!book.available) return
    setReaderLoaded(false)
    setActiveBook(book)
  }

  function closeBook() {
    setActiveBook(null)
    setReaderLoaded(false)
  }

  const scribdSrc = activeBook?.available
    ? `https://www.scribd.com/embeds/${activeBook.id}/content?start_page=1&view_mode=scroll&access_key=${activeBook.accessKey}`
    : ''

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={BookMarked}
        title="GII Islamic Library"
        subtitle="Guyana Islamic Institute — Knowledge for the Ummah"
        gradient="from-emerald-950 to-teal-900"
        showBack
      />

      {/* About GII */}
      <div className="mx-4 mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
            <BookOpen className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-300">Guyana Islamic Institute (GII)</p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
              Lot 1 Jesburg, West Coast Demerara · Tel: (592) 277-0064
              · giipc.com · Books uploaded by GII for community benefit.
            </p>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      <div className="space-y-3 px-4 pt-4">
        {GII_BOOKS.map((book) => {
          const catStyle = CATEGORY_COLORS[book.category] || 'bg-gray-700/20 text-gray-400 border-gray-700/30'
          return (
            <button
              key={book.id || book.title}
              onClick={() => openBook(book)}
              disabled={!book.available}
              className={`w-full overflow-hidden rounded-2xl border text-left transition-all active:scale-[0.98] ${
                book.available
                  ? 'border-gray-800 bg-gray-900 active:bg-gray-800'
                  : 'border-gray-800/60 bg-gray-900/50 opacity-60'
              }`}
            >
              {/* Colour bar top */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${book.color}`} />

              <div className="flex items-start gap-4 p-4">
                {/* Icon */}
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${book.color} text-2xl shadow-lg`}>
                  {book.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground leading-snug">{book.title}</p>
                      {book.subtitle && (
                        <p className="mt-0.5 text-[11px] text-gray-500 truncate">{book.subtitle}</p>
                      )}
                    </div>
                    {book.available
                      ? <ChevronRight className="h-4 w-4 shrink-0 text-gray-600 mt-0.5" />
                      : <span className="shrink-0 rounded-md bg-gray-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-500">Coming Soon</span>
                    }
                  </div>

                  <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${catStyle}`}>
                      {book.category}
                    </span>
                    <span className="text-[10px] text-gray-600">{book.pages} pages</span>
                    {book.available && (
                      <span className="text-[10px] text-emerald-500">Read &amp; Download</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Attribution */}
      <div className="mx-4 mt-4 rounded-xl bg-gray-900/60 px-4 py-3 text-center">
        <p className="text-[11px] text-gray-500">
          Books provided by <span className="text-gray-400">Guyana Islamic Institute</span> for educational purposes.
          Download available within the reader. JazakAllahu Khayran to GII.
        </p>
      </div>

      {/* ── Full-screen Book Reader ──────────────────────────────────────── */}
      {activeBook && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0b14]">
          {/* Reader header */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-[#0a0b14] px-4 py-3">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">GII Library</p>
              <h2 className="truncate text-sm font-bold text-foreground">{activeBook.title}</h2>
              <p className="text-[10px] text-gray-500">{activeBook.pages} pages · {activeBook.category}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {/* Download — opens Scribd page where download button is available */}
              {activeBook.scribdUrl && (
                <a
                  href={activeBook.scribdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-400 active:bg-emerald-500/25"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              )}
              <button
                onClick={closeBook}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 active:scale-90 transition-transform"
                aria-label="Close reader"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scribd iframe */}
          <div className="relative flex-1 bg-gray-100">
            {!readerLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0b14]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-emerald-500" />
                <p className="text-xs text-gray-500">Loading {activeBook.title}…</p>
              </div>
            )}
            <iframe
              className="scribd_iframe_embed h-full w-full"
              title={activeBook.title}
              src={scribdSrc}
              data-auto-height="true"
              scrolling="yes"
              allowFullScreen
              onLoad={() => setReaderLoaded(true)}
              style={{ border: 'none', display: readerLoaded ? 'block' : 'none' }}
            />
          </div>

          {/* Bottom bar — open on Scribd */}
          <div className="flex shrink-0 items-center justify-center border-t border-gray-800 bg-[#0a0b14] py-3">
            <a
              href={activeBook.scribdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 active:text-gray-300"
            >
              <ExternalLink className="h-3 w-3" />
              Open on Scribd
            </a>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
