'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Search, Sparkles, X } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { PremiumAtmosphere } from '@/components/premium-atmosphere'

interface TafseerNote {
  surahNumber: number
  surahArabic: string
  surahEnglish: string
  theme: 'Tawhid' | 'Akhirah' | 'Character' | 'Worship' | 'Hope'
  focusAyat: string[]
  overview: string
  practical: string[]
  giiLens: string
}

const THEMES = ['All', 'Tawhid', 'Akhirah', 'Character', 'Worship', 'Hope'] as const

const GII_TAFSEER_TRACKS = [
  {
    title: "Tafsir Ibn Kathir - Juz' Amma",
    subtitle: 'Primary GII tafseer track for short surahs and creed formation',
    href: 'https://www.scribd.com/document/206921362/Tafseer-Ibn-Kathir',
  },
  {
    title: 'Understanding Uloom-ul-Quran',
    subtitle: 'How to approach tafseer with method, context, and discipline',
    href: 'https://www.scribd.com/document/227194052',
  },
]

const TAFSEER_NOTES: TafseerNote[] = [
  {
    surahNumber: 78,
    surahArabic: 'النبأ',
    surahEnglish: 'An-Naba',
    theme: 'Akhirah',
    focusAyat: ['78:1-5', '78:17-30', '78:31-40'],
    overview: 'This surah shocks the listener into certainty: resurrection, judgment, and accountability are not theoretical ideas but an imminent reality.',
    practical: [
      'Review your daily deeds against the Day of Decision frame.',
      'Treat prayer and repentance as preparation, not occasional extras.',
      'Use akhirah certainty to reduce attachment to petty conflicts.',
    ],
    giiLens: 'GII track emphasizes this surah as a mindset reset for discipline and accountability.',
  },
  {
    surahNumber: 79,
    surahArabic: 'النازعات',
    surahEnglish: 'An-Naziat',
    theme: 'Akhirah',
    focusAyat: ['79:6-14', '79:34-41'],
    overview: 'The surah contrasts arrogance with fear of standing before Allah, showing that true success belongs to those who restrain the soul.',
    practical: [
      'Pair ambition with taqwa checks before major decisions.',
      'Use temptation moments to remember the standing before Allah.',
      'Build one restraint habit weekly (speech, scrolling, anger).',
    ],
    giiLens: 'Used in study circles to connect nafs-discipline with akhirah awareness.',
  },
  {
    surahNumber: 80,
    surahArabic: 'عبس',
    surahEnglish: 'Abasa',
    theme: 'Character',
    focusAyat: ['80:1-10', '80:33-42'],
    overview: 'Surah Abasa teaches dignity, equity, and sincerity in dawah priorities, correcting social-status bias and restoring prophetic etiquette.',
    practical: [
      'Do not ignore sincere seekers in favor of status audiences.',
      'Audit your community manners for hidden class bias.',
      'Give first attention to those actively seeking guidance.',
    ],
    giiLens: 'Highlighted in GII adab lessons as a blueprint for leadership humility.',
  },
  {
    surahNumber: 81,
    surahArabic: 'التكوير',
    surahEnglish: 'At-Takwir',
    theme: 'Akhirah',
    focusAyat: ['81:1-14', '81:26-29'],
    overview: 'Cosmic scenes collapse worldly illusions and force the question: where are you heading with revelation in hand?',
    practical: [
      'Use this surah for weekly self-audit journaling.',
      'Tie Quran recitation to action commitments, not inspiration only.',
      'Memorize one akhirah ayah and revisit it before sleep.',
    ],
    giiLens: 'Presented as a surah of urgency: revelation demands directional change.',
  },
  {
    surahNumber: 83,
    surahArabic: 'المطففين',
    surahEnglish: 'Al-Mutaffifin',
    theme: 'Character',
    focusAyat: ['83:1-6', '83:29-36'],
    overview: 'Cheating, manipulation, and moral double-standards are exposed as spiritual corruption long before they are legal violations.',
    practical: [
      'Clean up measurement ethics in business, school, and relationships.',
      'Avoid selective justice where your mistakes are excused but others are not.',
      'Track hidden dishonesty habits and remove one each week.',
    ],
    giiLens: 'Connected to halal income and integrity themes in the GII fiqh-hadith path.',
  },
  {
    surahNumber: 87,
    surahArabic: 'الأعلى',
    surahEnglish: 'Al-Ala',
    theme: 'Worship',
    focusAyat: ['87:1-8', '87:14-19'],
    overview: 'The surah combines tazkiyah, remembrance, and salah into a practical model for inner purification and consistency.',
    practical: [
      'Make tasbih meaningful by linking it to obedience.',
      'Anchor your day around salah windows, not random productivity cycles.',
      'Recite this surah with reflection before Jumuah and Eid preparations.',
    ],
    giiLens: 'Used to show how worship reforms the inner self and daily routine.',
  },
  {
    surahNumber: 89,
    surahArabic: 'الفجر',
    surahEnglish: 'Al-Fajr',
    theme: 'Character',
    focusAyat: ['89:15-20', '89:27-30'],
    overview: 'Material expansion and restriction are tests, not verdicts of honor. Real nobility is obedience, mercy, and truthful faith.',
    practical: [
      'Do not treat wealth as proof of divine approval.',
      'Serve vulnerable people as a direct Quranic obligation.',
      'End each day asking whether your heart is becoming mutmainnah.',
    ],
    giiLens: 'Frequently tied to social justice and nafs reform in classroom reminders.',
  },
  {
    surahNumber: 93,
    surahArabic: 'الضحى',
    surahEnglish: 'Ad-Duha',
    theme: 'Hope',
    focusAyat: ['93:1-11'],
    overview: 'A surah of emotional restoration: apparent delay is not abandonment, and gratitude must flow into service to others.',
    practical: [
      "When spiritually low, recite Ad-Duha and list Allah's favors.",
      'Translate gratitude into care for the orphan, needy, and seeker.',
      'Build hope through obedience, not through passive optimism.',
    ],
    giiLens: 'Used in counseling contexts to reconnect believers to divine care and mission.',
  },
  {
    surahNumber: 94,
    surahArabic: 'الشرح',
    surahEnglish: 'Ash-Sharh',
    theme: 'Hope',
    focusAyat: ['94:1-8'],
    overview: 'Hardship and relief are paired in divine wisdom; perseverance, worship, and redirection to Allah are the way through pressure.',
    practical: [
      'Respond to pressure with focused ibadah, not only panic fixes.',
      'Treat repeated trials as invitations to deeper dependence on Allah.',
      'After each task, redirect energy to the next act of obedience.',
    ],
    giiLens: 'A core resilience text in youth and mentorship sessions.',
  },
  {
    surahNumber: 96,
    surahArabic: 'العلق',
    surahEnglish: 'Al-Alaq',
    theme: 'Worship',
    focusAyat: ['96:1-5', '96:19'],
    overview: 'First revelation ties knowledge to servitude. Real learning begins with humility before the One who taught by the pen.',
    practical: [
      'Start study and work with sincere intention, not ego validation.',
      'Use knowledge to increase khushu and action.',
      'When pride appears, return to sujud immediately.',
    ],
    giiLens: 'Framed as the foundation for Islamic education ethics and adab.',
  },
  {
    surahNumber: 103,
    surahArabic: 'العصر',
    surahEnglish: 'Al-Asr',
    theme: 'Character',
    focusAyat: ['103:1-3'],
    overview: 'A complete survival model in three ayat: faith, righteous action, truth, and patience.',
    practical: [
      'Measure your week against all four pillars, not one.',
      'Build circles of sincere advice and mutual patience.',
      'Protect time as a trust that will be accounted for.',
    ],
    giiLens: 'Often taught as a full life framework, not just a short memorization surah.',
  },
  {
    surahNumber: 107,
    surahArabic: 'الماعون',
    surahEnglish: 'Al-Maun',
    theme: 'Character',
    focusAyat: ['107:1-7'],
    overview: 'Ritual without mercy is rejected. The surah links prayer sincerity with social care and practical generosity.',
    practical: [
      'Audit whether your worship softens your dealings with people.',
      'Serve small needs; Islam values practical help, not performative religiosity.',
      'Guard salah from heedlessness and social hypocrisy.',
    ],
    giiLens: 'Integrated into service projects to connect ibadah with community benefit.',
  },
  {
    surahNumber: 109,
    surahArabic: 'الكافرون',
    surahEnglish: 'Al-Kafirun',
    theme: 'Tawhid',
    focusAyat: ['109:1-6'],
    overview: 'This surah establishes uncompromised creed with principled coexistence: no theological blending, no hostility without cause.',
    practical: [
      'Protect aqidah boundaries in speech, celebrations, and compromises.',
      'Practice respectful firmness without arrogance.',
      'Use this surah to renew intention and creed clarity.',
    ],
    giiLens: 'Used in aqidah sessions to train conviction with wisdom.',
  },
  {
    surahNumber: 112,
    surahArabic: 'الإخلاص',
    surahEnglish: 'Al-Ikhlas',
    theme: 'Tawhid',
    focusAyat: ['112:1-4'],
    overview: "A precise definition of Allah's absolute oneness, sufficiency, and uniqueness that purifies creed and worship.",
    practical: [
      'Use Al-Ikhlas to refine intention in every act of worship.',
      'Reject all forms of dependence that rival trust in Allah.',
      'Pair its recitation with gratitude and tawakkul routines.',
    ],
    giiLens: 'Repeated in GII teaching as the shortest complete creed map.',
  },
  {
    surahNumber: 113,
    surahArabic: 'الفلق',
    surahEnglish: 'Al-Falaq',
    theme: 'Worship',
    focusAyat: ['113:1-5'],
    overview: 'The believer is taught to seek active protection from external harms, envy, darkness, and hidden hostility.',
    practical: [
      'Recite in morning/evening routines as a non-negotiable shield.',
      'Do not trivialize envy and spiritual harm; seek refuge consistently.',
      'Combine ruqyah adhkar with lawful practical precautions.',
    ],
    giiLens: 'Taught alongside Adhkar modules as protective daily doctrine.',
  },
  {
    surahNumber: 114,
    surahArabic: 'الناس',
    surahEnglish: 'An-Nas',
    theme: 'Worship',
    focusAyat: ['114:1-6'],
    overview: 'Internal warfare against whispering is real. Victory requires constant refuge in Allah as Lord, King, and God of mankind.',
    practical: [
      'Watch inner narratives and interrupt waswas early.',
      'Increase dhikr when thoughts spiral toward sin or despair.',
      'Use this surah as part of bedtime and morning safeguarding.',
    ],
    giiLens: 'Positioned as a core anti-waswas practice in youth mentoring.',
  },
]

export default function TafseerPage() {
  const [query, setQuery] = useState('')
  const [themeFilter, setThemeFilter] = useState<(typeof THEMES)[number]>('All')
  const [openSurah, setOpenSurah] = useState<number | null>(null)

  const filtered = useMemo(() => {
    let list = TAFSEER_NOTES
    if (themeFilter !== 'All') {
      list = list.filter((item) => item.theme === themeFilter)
    }

    if (!query.trim()) return list

    const q = query.toLowerCase()
    return list.filter(
      (item) =>
        item.surahEnglish.toLowerCase().includes(q) ||
        item.surahArabic.includes(query.trim()) ||
        item.overview.toLowerCase().includes(q) ||
        item.giiLens.toLowerCase().includes(q)
    )
  }, [query, themeFilter])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-nav">
      <PremiumAtmosphere tone="masjid" />

      <PageHero
        icon={BookOpen}
        title="Tafseer"
        subtitle="Juz Amma Study Hub"
        gradient="from-cyan-950 via-teal-950 to-emerald-950"
        showBack
        heroTheme="tafseer"
      />

      <div className="relative z-10 px-4 pt-4 space-y-2">
        {GII_TAFSEER_TRACKS.map((track) => (
          <Link
            key={track.title}
            href={track.href}
            target="_blank"
            className="block rounded-2xl border border-cyan-500/20 bg-cyan-500/6 p-3 transition-all active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-cyan-200">{track.title}</p>
                <p className="mt-1 text-[11px] text-cyan-100/80">{track.subtitle}</p>
              </div>
              <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
            </div>
          </Link>
        ))}
      </div>

      <div className="sticky top-0 z-20 mt-4 border-y border-border/50 bg-background/95 px-4 py-2.5 backdrop-blur space-y-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search surah or tafseer note..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-9 text-sm text-foreground/80 placeholder-gray-600 outline-none focus:border-cyan-500/50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/80"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => setThemeFilter(theme)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                themeFilter === theme
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-4 pt-4 space-y-2">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center">
            <p className="text-sm text-muted-foreground/80">No tafseer notes found for this filter.</p>
          </div>
        )}

        {filtered.map((note) => {
          const isOpen = openSurah === note.surahNumber
          return (
            <div key={note.surahNumber} className="overflow-hidden rounded-2xl border border-border bg-card">
              <button
                onClick={() => setOpenSurah(isOpen ? null : note.surahNumber)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors active:bg-secondary/50"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-300">
                  {note.surahNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {note.surahEnglish} <span className="font-arabic text-cyan-200">{note.surahArabic}</span>
                  </h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/80">Theme: {note.theme}</p>
                </div>
                {isOpen ? (
                  <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" />
                ) : (
                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" />
                )}
              </button>

              {isOpen && (
                <div className="space-y-3 px-4 pb-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">{note.overview}</p>

                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/6 p-3">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                      <Sparkles className="h-3.5 w-3.5" />
                      Focus Ayat
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {note.focusAyat.map((ayah) => (
                        <span
                          key={ayah}
                          className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-100"
                        >
                          {ayah}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl border border-border/70 bg-secondary/35 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Practical Application</p>
                    {note.practical.map((item) => (
                      <div key={item} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                        <p className="text-xs leading-relaxed text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/6 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">GII Lens</p>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-100/85">{note.giiLens}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
