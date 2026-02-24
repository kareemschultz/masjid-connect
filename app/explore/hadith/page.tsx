'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { BookMarked, BookOpen, ChevronDown, ChevronUp, ExternalLink, Search, X } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { PremiumAtmosphere } from '@/components/premium-atmosphere'
import { NAWAWI_HADITH, HADITH_CATEGORIES } from '@/lib/hadith-nawawi'

interface StudyModule {
  id: string
  title: string
  focus: string
  practical: string[]
  source: string
}

const GII_MODULES: StudyModule[] = [
  {
    id: 'masjid-flow',
    title: 'Masjid Flow: Entry, Exit, and Azan Response',
    focus: 'Build one consistent Sunnah flow for every masjid visit.',
    practical: [
      'Before leaving home: say the house-exit dua and tawakkul formula.',
      'At masjid entry: prioritize the mercy-gate dua and calm intention.',
      'After azan: complete the salawat + intercession dua before iqamah.',
      'Upon exit: close with the masjid-exit supplication and gratitude.',
    ],
    source: 'GII Practical Essentials (Masjid + Azan sections)',
  },
  {
    id: 'salah-adhkar',
    title: 'Salah Adhkar Spine',
    focus: 'Connect pre-salah, intra-salah, and post-salah adhkar as one unit.',
    practical: [
      'Memorize opening dua + ruku/sujud tasbihat in sequence.',
      'After tashahhud, keep the protection supplication before salam.',
      'Post-salah: istighfar x3, then السلام ومنك السلام, then tasbih cycle.',
      'Anchor with Ayat al-Kursi and the three Quls in prescribed timings.',
    ],
    source: 'GII Practical Essentials (Salah invocations, pp. early chapters)',
  },
  {
    id: 'daily-adhkar',
    title: 'Morning and Evening Fortress',
    focus: 'Apply the full morning/evening remembrance matrix with repetition counts.',
    practical: [
      'Run witness formula, niamah formula, and protection formula daily.',
      'Track mandatory counts: 3x, 4x, 7x, 10x, and 100x sets.',
      'Include Sayyidul Istighfar at dawn and sunset windows.',
      'Close each set with salawat and tawakkul declarations.',
    ],
    source: 'GII Practical Essentials (Morning/Evening wordings and counts)',
  },
  {
    id: 'home-food-social',
    title: 'Home, Food, and Social Adab',
    focus: 'Carry Sunnah adab into ordinary moments so worship is continuous.',
    practical: [
      'Home entry/exit dhikr before and after daily movement.',
      'Meal opening and meal-closing supplications without skipping.',
      'Sneezing etiquette as a 3-step response chain.',
      'Assembly expiation dua before leaving gatherings.',
    ],
    source: 'GII Practical Essentials (daily life invocation sections)',
  },
  {
    id: 'hardship-healing',
    title: 'Hardship and Healing Protocol',
    focus: 'Use the Sunnah language of resilience in anxiety, pain, and calamity.',
    practical: [
      'Pain protocol: Bismillah x3 + refuge formula x7.',
      'Anxiety protocol: supplication against grief, debt, and helplessness.',
      'Calamity protocol: Inna lillahi... + ask for better replacement.',
      'Patient visit protocol: healing dua repetition with intention.',
    ],
    source: 'GII Practical Essentials (sickness, pain, and distress chapters)',
  },
  {
    id: 'janazah-module',
    title: 'Janazah and End-of-Life Readiness',
    focus: 'Move beyond theory by learning the exact janazah invocation sequence.',
    practical: [
      'Memorize what is recited after each janazah takbeer.',
      'Review washing and shrouding sequence in proper order.',
      'Know the practical rulings around family handling and tayammum cases.',
      'Maintain dua etiquette for the deceased and the living.',
    ],
    source: 'GII Practical Essentials (Janazah, washing, shrouding chapters)',
  },
]

const GII_BOOK_TRACKS = [
  {
    title: 'Practical Essentials for Muslim Students',
    subtitle: 'Supplications, rituals, and applied Muslim adab',
    href: 'https://www.scribd.com/document/228087653/Practical-Essentials-for-Muslim-Students',
  },
  {
    title: 'Explanation of 40 Hadith of Imam Nawawi',
    subtitle: 'Expanded commentary path for the 40 hadith core',
    href: 'https://www.scribd.com/document/227185213',
  },
  {
    title: 'Introduction to Usool-ul-Hadith',
    subtitle: 'Methodology of verification, grading, and usage',
    href: 'https://www.scribd.com/document/206911102',
  },
]

export default function HadithPage() {
  const [view, setView] = useState<'nawawi' | 'gii'>('nawawi')
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [openHadith, setOpenHadith] = useState<number | null>(null)
  const [openModule, setOpenModule] = useState<string | null>(null)

  const filteredHadith = useMemo(() => {
    let list = NAWAWI_HADITH
    if (filter !== 'all') {
      list = list.filter((h) => h.category === filter || (filter === 'faith' && h.category === 'intention'))
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.translation.toLowerCase().includes(q) ||
          h.commentary.toLowerCase().includes(q)
      )
    }
    return list
  }, [filter, query])

  const filteredModules = useMemo(() => {
    if (!query.trim()) return GII_MODULES
    const q = query.toLowerCase()
    return GII_MODULES.filter(
      (module) =>
        module.title.toLowerCase().includes(q) ||
        module.focus.toLowerCase().includes(q) ||
        module.practical.some((item) => item.toLowerCase().includes(q))
    )
  }, [query])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-nav">
      <PremiumAtmosphere tone="community" />

      <PageHero
        icon={BookOpen}
        title="Hadith"
        subtitle="Nawawi Core + GII Study Tracks"
        gradient="from-amber-950 via-orange-950 to-emerald-950"
        showBack
        heroTheme="hadith"
      />

      <div className="sticky top-0 z-20 border-b border-border/50 bg-background/95 px-4 py-2.5 backdrop-blur space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setView('nawawi')}
            className={`rounded-xl py-2 text-xs font-semibold transition-all ${
              view === 'nawawi'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            40 Nawawi
          </button>
          <button
            onClick={() => setView('gii')}
            className={`rounded-xl py-2 text-xs font-semibold transition-all ${
              view === 'gii'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            GII Practical Tracks
          </button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={view === 'nawawi' ? 'Search hadith...' : 'Search practical modules...'}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-9 text-sm text-foreground/80 placeholder-gray-600 outline-none focus:border-emerald-500/50"
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

        {view === 'nawawi' && (
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {HADITH_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  filter === cat.key
                    ? 'bg-amber-600 text-foreground'
                    : 'bg-secondary text-muted-foreground/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === 'gii' && (
        <div className="relative z-10 px-4 pt-4 space-y-2">
          <div className="grid gap-2">
            {GII_BOOK_TRACKS.map((track) => (
              <Link
                key={track.title}
                href={track.href}
                target="_blank"
                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/6 p-3 transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-emerald-200">{track.title}</p>
                    <p className="mt-1 text-[11px] text-emerald-100/75">{track.subtitle}</p>
                  </div>
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10 px-4 pt-4 space-y-2">
        {view === 'nawawi' && (
          <>
            {filteredHadith.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border py-12 text-center">
                <p className="text-sm text-muted-foreground/80">No hadith match your search</p>
              </div>
            )}

            {filteredHadith.map((hadith) => {
              const isOpen = openHadith === hadith.number
              return (
                <div key={hadith.number} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    onClick={() => setOpenHadith(isOpen ? null : hadith.number)}
                    className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-secondary/50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-bold text-amber-300">
                      {hadith.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{hadith.title}</h3>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/80">{hadith.source}</p>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="space-y-3 px-4 pb-4">
                      <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3">
                        <p className="font-arabic text-base leading-[2.2] text-teal-300" dir="rtl">
                          {hadith.arabic}
                        </p>
                      </div>

                      <p className="text-[11px] italic leading-relaxed text-amber-300/90">{hadith.transliteration}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{hadith.translation}</p>

                      <div className="rounded-xl border border-border/70 bg-secondary/35 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Commentary</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hadith.commentary}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}

        {view === 'gii' && (
          <>
            {filteredModules.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border py-12 text-center">
                <p className="text-sm text-muted-foreground/80">No modules match your search</p>
              </div>
            )}

            {filteredModules.map((module) => {
              const isOpen = openModule === module.id
              return (
                <div key={module.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    onClick={() => setOpenModule(isOpen ? null : module.id)}
                    className="flex w-full items-start gap-3 p-4 text-left transition-colors active:bg-secondary/50"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                      <BookMarked className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{module.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{module.focus}</p>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" />
                    ) : (
                      <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="space-y-3 px-4 pb-4">
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/6 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/90">Applied Checklist</p>
                        <div className="mt-2 space-y-2">
                          {module.practical.map((item) => (
                            <div key={item} className="flex gap-2">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                              <p className="text-xs leading-relaxed text-emerald-100/85">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground/80">{module.source}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
