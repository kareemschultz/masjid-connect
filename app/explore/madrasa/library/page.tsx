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
  category: 'Aqeedah' | 'Seerah' | 'Fiqh' | 'Tafseer' | 'Hadith' | 'Adab' | 'Arabic' | 'Dawah' | 'History'
  pages: number
  description: string
  accessKey: string   // from embed code: access_key=...
  color: string       // gradient for card
  icon: string        // emoji
  available: boolean  // false = coming soon (no embed key yet)
  scribdUrl?: string  // fallback direct link
}

const GII_BOOKS: GIIBook[] = [
  // ── Confirmed with embed access keys ──────────────────────────────────────
  {
    id: 228105475,
    title: 'Commentary on Aqeedah Tahawiyyah',
    subtitle: 'By Imam Abu Jafar Al-Tahawi',
    category: 'Aqeedah',
    pages: 151,
    description: 'A classical foundational text on Islamic creed with commentary. Essential reading for understanding the core beliefs of Ahl al-Sunnah wal-Jama\'ah — tawheed, prophethood, the hereafter, and divine decree.',
    accessKey: 'key-55vSmeJbyVmwMye3atWH',
    color: 'from-emerald-800 to-teal-900',
    icon: '📖',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/228105475/Aqeedah-Tahawiyyah',
  },
  {
    id: 213312968,
    title: 'Adab — Islamic Mannerism',
    subtitle: 'By Sh. Abdul-Fattah Abu-Ghuddah',
    category: 'Adab',
    pages: 45,
    description: 'An authoritative exposition on Islamic manners and etiquette by Shaykh Abdul-Fattah Abu-Ghuddah. Covers the adab of speech, gatherings, seeking knowledge, and dealings with others.',
    accessKey: 'key-1r4d1wkisdu4hhm72zjt',
    color: 'from-amber-800 to-orange-900',
    icon: '🤝',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/213312968/Adab',
  },
  // ── All remaining GII documents (embed without access key) ────────────────
  {
    id: 205398282,
    title: 'Fiqh-us-Seerah',
    subtitle: 'Lessons from the Life of Prophet Muhammad ﷺ',
    category: 'Seerah',
    pages: 185,
    description: 'A comprehensive study of the Seerah of the Prophet ﷺ with fiqh-based lessons. Draws out practical guidance and rulings from the events of the Prophet\'s blessed life for the modern Muslim.',
    accessKey: '',
    color: 'from-blue-800 to-indigo-900',
    icon: '🌙',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/205398282',
  },
  {
    id: 206921362,
    title: "Tafsir Ibn Kathir — Juz' Amma",
    subtitle: "Tafsir of the 30th Part of the Quran",
    category: 'Tafseer',
    pages: 291,
    description: "Detailed exegesis of Juz' Amma (the 30th part of the Quran) drawn from the classic tafsir of Imam Ibn Kathir. Covers all surahs from An-Naba to An-Nas with authentic narrations and explanations.",
    accessKey: 'key-29k82oaahqsumjdanolp',
    color: 'from-purple-800 to-violet-900',
    icon: '📜',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/206921362/Tafseer-Ibn-Kathir',
  },
  {
    id: 228087653,
    title: 'Practical Essentials for Muslim Students',
    subtitle: 'A GII Student Resource',
    category: 'Fiqh',
    pages: 0,
    description: 'A practical guide covering the essential knowledge every Muslim student needs — purification, prayer, fasting, and everyday Islamic practice. Compiled by the Guyana Islamic Institute for local students.',
    accessKey: 'key-63DSgbtSjzLdB6gYQUlJ',
    color: 'from-cyan-800 to-sky-900',
    icon: '🎓',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/228087653/Practical-Essentials-for-Muslim-Students',
  },
  {
    id: 227185213,
    title: 'Explanation of 40 Hadith of Imam Nawawi',
    subtitle: 'Al-Arba\'een An-Nawawiyyah with Commentary',
    category: 'Hadith',
    pages: 76,
    description: 'Detailed explanation of the famous 40 Hadith collection of Imam an-Nawawi — one of the most important collections in Islamic literature, covering the foundations of the religion.',
    accessKey: '',
    color: 'from-teal-800 to-cyan-900',
    icon: '📿',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/227185213',
  },
  {
    id: 197764480,
    title: 'Islamic Jurisprudence 1',
    subtitle: 'Introduction to Fiqh — Fasting, Hajj & More',
    category: 'Fiqh',
    pages: 169,
    description: 'A foundational text covering core chapters of Islamic jurisprudence including fasting (Sawm), Hajj, and related rulings. Structured for students of Islamic knowledge.',
    accessKey: '',
    color: 'from-indigo-800 to-blue-900',
    icon: '⚖️',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/197764480',
  },
  {
    id: 227182496,
    title: 'Maintenance Rights in Islam',
    subtitle: 'Nafaqah — Financial Rights of the Spouse',
    category: 'Fiqh',
    pages: 86,
    description: 'A detailed study of maintenance rights (Nafaqah) in Islamic law — covering the financial obligations of the husband, rights of the wife, children, and related family law rulings.',
    accessKey: '',
    color: 'from-rose-800 to-pink-900',
    icon: '🏠',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/227182496',
  },
  {
    id: 206911102,
    title: 'Introduction to Usool-ul-Hadith',
    subtitle: 'Science of Hadith — Principles & Methodology',
    category: 'Hadith',
    pages: 68,
    description: 'An accessible introduction to the sciences of Hadith — how hadith are classified, authenticated, and used as a source of Islamic law. Covers key terminology and methodology.',
    accessKey: '',
    color: 'from-cyan-800 to-sky-900',
    icon: '🔍',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/206911102',
  },
  {
    id: 213352181,
    title: 'Qasas-un-Nabeyeen',
    subtitle: 'Stories of the Prophets — Overview',
    category: 'Seerah',
    pages: 154,
    description: 'Stories of the Prophets from the Quran and authentic hadith. A beloved text used in Islamic schools worldwide — accessible, narrated, and spiritually enriching.',
    accessKey: '',
    color: 'from-sky-800 to-blue-900',
    icon: '⭐',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/213352181',
  },
  {
    id: 227179462,
    title: 'Understanding World Religions',
    subtitle: 'Comparative Religion from an Islamic Perspective',
    category: 'Dawah',
    pages: 136,
    description: 'An overview of major world religions — Judaism, Christianity, Hinduism, Buddhism — from an Islamic and comparative perspective. Valuable for Muslims engaged in interfaith dialogue and dawah.',
    accessKey: '',
    color: 'from-fuchsia-800 to-purple-900',
    icon: '🌍',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/227179462',
  },
  {
    id: 227180537,
    title: 'Introduction to Dawah Methodology',
    subtitle: 'How to Call to Islam with Wisdom',
    category: 'Dawah',
    pages: 103,
    description: 'A practical guide to Islamic dawah — its importance, principles, and methodology. Covers the Prophetic approach, common misconceptions, and how to engage non-Muslims with wisdom and good conduct.',
    accessKey: '',
    color: 'from-lime-800 to-green-900',
    icon: '💬',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/227180537',
  },
  {
    id: 227194052,
    title: "Understanding Uloom-ul-Quran",
    subtitle: "Sciences of the Quran",
    category: 'Tafseer',
    pages: 29,
    description: "An introduction to the sciences of the Quran — revelation, compilation, abrogation, and the principles of Quranic interpretation. A concise primer for students of Islamic knowledge.",
    accessKey: '',
    color: 'from-violet-800 to-purple-900',
    icon: '🕌',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/227194052',
  },
  {
    id: 213686714,
    title: 'Basic Arabic Grammar',
    subtitle: 'Foundation Resources for Arabic Learners',
    category: 'Arabic',
    pages: 119,
    description: 'Comprehensive Arabic grammar resources for beginners — nouns, verbs, particles, sentence structure, and more. Essential for those seeking to read the Quran and Islamic texts in the original Arabic.',
    accessKey: '',
    color: 'from-yellow-800 to-amber-900',
    icon: '🔤',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/213686714',
  },
  {
    id: 213697806,
    title: 'Kitab-ul-Assasi',
    subtitle: 'Foundational Arabic Language Textbook',
    category: 'Arabic',
    pages: 226,
    description: 'The foundational Arabic language textbook used in GII classes. Covers reading, writing, vocabulary, and grammar progressively. A structured curriculum for Arabic language acquisition.',
    accessKey: '',
    color: 'from-orange-800 to-amber-900',
    icon: '📝',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/213697806',
  },
  {
    id: 213355133,
    title: 'Arabic Phrasebook',
    subtitle: 'Everyday Arabic for Muslims',
    category: 'Arabic',
    pages: 30,
    description: 'Practical Arabic phrases for everyday use — greetings, Islamic expressions, common conversations, and useful vocabulary. Perfect for Muslims wanting to incorporate Arabic into daily life.',
    accessKey: '',
    color: 'from-amber-800 to-yellow-900',
    icon: '💬',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/213355133',
  },
  {
    id: 213350181,
    title: 'Overview of Islamic Schools & Sects',
    subtitle: 'Understanding the Different Schools of Thought',
    category: 'Aqeedah',
    pages: 37,
    description: 'A balanced overview of the major Islamic schools of thought and sects — their origins, core beliefs, and key differences. Helps Muslims understand the diversity within the Ummah.',
    accessKey: '',
    color: 'from-emerald-700 to-green-900',
    icon: '🕌',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/213350181',
  },
  {
    id: 223603526,
    title: 'Methods of Learning in Islam',
    subtitle: 'The Islamic Approach to Seeking Knowledge',
    category: 'Adab',
    pages: 18,
    description: 'A concise guide to the Islamic etiquette and methodology of seeking knowledge — the virtues of learning, the manners of the student, and the responsibilities of the teacher.',
    accessKey: '',
    color: 'from-teal-700 to-emerald-900',
    icon: '📚',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/223603526',
  },
  {
    id: 227184070,
    title: "Zad Ut-Talibin — Hadiths 1–60",
    subtitle: "Provisions for the Seekers — Selected Hadith",
    category: 'Hadith',
    pages: 10,
    description: "Selected hadith from Zad Ut-Talibin (Provisions for the Seekers) — a collection of authentic hadith important for the serious student of Islamic knowledge.",
    accessKey: '',
    color: 'from-sky-700 to-cyan-900',
    icon: '📿',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/227184070',
  },
  {
    id: 213707781,
    title: 'Islam in the Caribbean — Historical Context',
    subtitle: 'Muslim Heritage in the Caribbean Region',
    category: 'History',
    pages: 107,
    description: 'The history of Islam and Muslims in the Caribbean — covering the arrival of Muslim enslaved Africans, indentured workers from South Asia, and the development of Muslim communities in the region including Guyana.',
    accessKey: '',
    color: 'from-blue-700 to-indigo-900',
    icon: '🌊',
    available: true,
    scribdUrl: 'https://www.scribd.com/document/213707781',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Aqeedah: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Seerah:  'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Fiqh:    'bg-purple-500/15 text-purple-400 border-purple-500/25',
  Tafseer: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  Hadith:  'bg-teal-500/15 text-teal-400 border-teal-500/25',
  Adab:    'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Arabic:  'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  Dawah:   'bg-lime-500/15 text-lime-400 border-lime-500/25',
  History: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
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
    ? activeBook.accessKey
      ? `https://www.scribd.com/embeds/${activeBook.id}/content?start_page=1&view_mode=scroll&access_key=${activeBook.accessKey}`
      : `https://www.scribd.com/embeds/${activeBook.id}/content?start_page=1&view_mode=scroll`
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
          {/* Reader header — safe-area-inset-top so status bar never covers buttons */}
          <div
            className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-[#0a0b14] px-4 pb-3"
            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
          >
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
