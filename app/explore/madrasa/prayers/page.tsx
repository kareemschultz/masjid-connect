'use client'

import { useState } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { BookOpen, ChevronDown, ChevronUp, Star, Clock, Moon, Sun } from 'lucide-react'
import { SUNNAH_PRAYERS, NAWAFIL_PRAYERS } from '@/lib/prayer-types'

// ─── Data ─────────────────────────────────────────────────────────────────────

const FARD_PRAYERS = [
  { name: 'Fajr', arabic: 'الفجر', rakat: 2, timing: 'Dawn to sunrise' },
  { name: 'Dhuhr', arabic: 'الظهر', rakat: 4, timing: 'After midday' },
  { name: 'Asr', arabic: 'العصر', rakat: 4, timing: 'Late afternoon' },
  { name: 'Maghrib', arabic: 'المغرب', rakat: 3, timing: 'After sunset' },
  { name: 'Isha', arabic: 'العشاء', rakat: 4, timing: 'Night' },
]

const sunnahMuakkadah = SUNNAH_PRAYERS.filter(p => p.category === 'sunnah_muakkadah')
const witrPrayer = SUNNAH_PRAYERS.find(p => p.category === 'wajib')
const specialNawafil = NAWAFIL_PRAYERS.filter(p => !p.ramadanOnly)
const ramadanNawafil = NAWAFIL_PRAYERS.filter(p => p.ramadanOnly)

// ─── Collapsible Section ──────────────────────────────────────────────────────

function Section({
  title,
  accent,
  children,
  defaultOpen = true,
}: {
  title: string
  accent: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  const accentBorder =
    accent === 'amber' ? 'border-amber-500/20' :
    accent === 'emerald' ? 'border-emerald-500/20' :
    accent === 'indigo' ? 'border-indigo-500/20' :
    'border-border'

  const accentBg =
    accent === 'amber' ? 'bg-amber-500/10' :
    accent === 'emerald' ? 'bg-emerald-500/10' :
    accent === 'indigo' ? 'bg-indigo-500/10' :
    'bg-secondary/50'

  const accentText =
    accent === 'amber' ? 'text-amber-400' :
    accent === 'emerald' ? 'text-emerald-400' :
    accent === 'indigo' ? 'text-indigo-400' :
    'text-muted-foreground'

  return (
    <div className={`rounded-2xl border ${accentBorder} bg-card overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 transition-colors active:bg-secondary`}
      >
        <h2 className={`text-base font-bold ${accentText}`}>{title}</h2>
        {open
          ? <ChevronUp className={`h-5 w-5 shrink-0 ${accentText}`} />
          : <ChevronDown className={`h-5 w-5 shrink-0 ${accentText}`} />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Category Badge ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const styles =
    category === 'Fard' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
    category === 'Wajib' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
    category === 'Sunnah' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
    'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'

  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles}`}>
      {category}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AllIslamicPrayersPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={BookOpen}
        title="All Islamic Prayers"
        subtitle="Fard, Wajib, Sunnah & Nawafil"
        gradient="from-amber-950 via-yellow-950 to-gray-900"
        showBack
        heroTheme="prayer"
      />

      <div className="px-4 py-5 space-y-5">

        {/* ── 1. The 5 Fard Prayers ──────────────────────────────────────── */}
        <Section title="The 5 Fard Prayers" accent="amber">
          <p className="text-xs text-muted-foreground">
            The five daily obligatory prayers are the second pillar of Islam. Every sane adult Muslim must pray them.
          </p>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-500/20">
                  <th className="py-2 px-2 text-left text-[11px] font-bold uppercase tracking-wider text-amber-400">Name</th>
                  <th className="py-2 px-2 text-center text-[11px] font-bold uppercase tracking-wider text-amber-400">Arabic</th>
                  <th className="py-2 px-2 text-center text-[11px] font-bold uppercase tracking-wider text-amber-400">Rakat</th>
                  <th className="py-2 px-2 text-right text-[11px] font-bold uppercase tracking-wider text-amber-400">Timing</th>
                </tr>
              </thead>
              <tbody>
                {FARD_PRAYERS.map(p => (
                  <tr key={p.name} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-2 font-semibold text-foreground">{p.name}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-arabic text-lg text-amber-300">{p.arabic}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-xs font-bold text-amber-400">
                        {p.rakat}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-xs text-muted-foreground">{p.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
            <p className="text-xs text-amber-300 italic">
              &quot;Between a man and shirk and kufr, there stands his giving up prayer.&quot; — Sahih Muslim
            </p>
          </div>
        </Section>

        {/* ── 2. Sunnah Mu'akkadah ───────────────────────────────────────── */}
        <Section title="Sunnah Mu'akkadah" accent="emerald">
          <p className="text-xs text-muted-foreground">
            Strongly emphasized prayers the Prophet (peace be upon him) consistently performed and rarely missed.
          </p>
          <div className="space-y-3">
            {sunnahMuakkadah.map(p => (
              <div key={p.key} className="rounded-xl border border-emerald-500/15 bg-secondary/50 p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{p.label}</p>
                    <p className="font-arabic text-lg text-emerald-300 mt-0.5">{p.arabic}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-400">
                      {p.rakat}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80">rakat</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-muted-foreground/80 shrink-0" />
                  <p className="text-xs text-muted-foreground">{p.timing}</p>
                </div>
                {p.importance === 'highest' && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-yellow-500 shrink-0" />
                    <p className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider">Highest importance</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground/80 italic leading-relaxed">{p.reward}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
            <p className="text-xs text-emerald-300 italic">
              &quot;Whoever prays 12 voluntary rak&apos;ahs in a day, a house will be built for him in Paradise.&quot; — Sahih Muslim
            </p>
          </div>
        </Section>

        {/* ── 3. Wajib: Witr Prayer ─────────────────────────────────────── */}
        {witrPrayer && (
          <Section title="Wajib: Witr Prayer" accent="amber">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-foreground">{witrPrayer.label}</p>
                  <p className="font-arabic text-2xl text-amber-300 mt-1">{witrPrayer.arabic}</p>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-lg font-bold text-amber-400">
                    {witrPrayer.rakat}
                  </span>
                  <span className="text-[10px] text-muted-foreground/80">rakat</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <p className="text-sm text-muted-foreground">{witrPrayer.timing}</p>
              </div>

              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
                <p className="text-xs text-amber-200 font-semibold mb-1">Scholarly Note</p>
                <p className="text-xs text-amber-300/80">
                  In the <span className="font-semibold text-amber-300">Hanafi school</span>, Witr is classified as <span className="font-semibold text-amber-300">Wajib</span> (obligatory).
                  According to the <span className="font-semibold text-amber-300">Shafi&apos;i, Maliki, and Hanbali</span> schools, it is <span className="font-semibold text-amber-300">Sunnah Mu&apos;akkadah</span> (strongly emphasized).
                </p>
              </div>

              <p className="text-xs text-muted-foreground/80 italic leading-relaxed">{witrPrayer.reward}</p>
            </div>
          </Section>
        )}

        {/* ── 4. Special Nawafil ─────────────────────────────────────────── */}
        <Section title="Special Nawafil" accent="indigo">
          <p className="text-xs text-muted-foreground">
            Voluntary prayers that carry immense reward. These are ways to draw closer to Allah beyond the obligatory acts.
          </p>
          <div className="space-y-3">
            {specialNawafil.map(p => (
              <div key={p.key} className="rounded-xl border border-indigo-500/15 bg-secondary/50 p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-xl">
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{p.label}</p>
                    <p className="font-arabic text-lg text-indigo-300 mt-0.5">{p.arabic}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-indigo-500/15 px-2 text-sm font-bold text-indigo-400">
                      {p.rakat}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80">rakat</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-muted-foreground/80 shrink-0" />
                  <p className="text-xs text-muted-foreground">{p.timing}</p>
                </div>
                <p className="text-xs text-muted-foreground/80 italic leading-relaxed">{p.reward}</p>
                <p className="text-[10px] text-muted-foreground/60">Source: {p.source}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 5. Ramadan Nawafil ─────────────────────────────────────────── */}
        <Section title="Ramadan Nawafil" accent="indigo">
          {ramadanNawafil.map(p => (
            <div key={p.key} className="rounded-xl border border-indigo-500/15 bg-secondary/50 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-xl">
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-foreground">{p.label}</p>
                  <p className="font-arabic text-xl text-indigo-300 mt-0.5">{p.arabic}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Moon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <p className="text-sm text-muted-foreground">{p.timing}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-indigo-400">8</p>
                  <p className="text-[10px] text-muted-foreground">rakat (Sunnah)</p>
                </div>
                <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-indigo-400">20</p>
                  <p className="text-[10px] text-muted-foreground">rakat (Hanafi)</p>
                </div>
              </div>

              <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 space-y-1">
                <p className="text-xs text-indigo-200 font-semibold">About Tarawih</p>
                <p className="text-xs text-indigo-300/80">
                  Tarawih is the night prayer performed during Ramadan. Scholars differ on the rakat count:
                  <span className="font-semibold text-indigo-300"> 8 rakat</span> is narrated in hadith, while
                  <span className="font-semibold text-indigo-300"> 20 rakat</span> was the practice established by Umar (RA).
                  Both are valid.
                </p>
                <p className="text-xs text-indigo-300/80 mt-1">
                  Tarawih is a form of <span className="font-semibold text-indigo-300">Qiyam al-Layl</span> (night standing prayer)
                  specifically associated with the blessed nights of Ramadan.
                </p>
              </div>

              <p className="text-xs text-muted-foreground/80 italic leading-relaxed">{p.reward}</p>
              <p className="text-[10px] text-muted-foreground/60">Source: {p.source}</p>
            </div>
          ))}
        </Section>

        {/* ── 6. Quick Reference Card ────────────────────────────────────── */}
        <Section title="Quick Reference Card" accent="gray">
          <p className="text-xs text-muted-foreground mb-2">
            A compact overview of every prayer — Fard, Wajib, Sunnah, and Nafl — at a glance.
          </p>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 px-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Prayer</th>
                  <th className="py-2 px-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Rakat</th>
                  <th className="py-2 px-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="py-2 px-2 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Timing</th>
                </tr>
              </thead>
              <tbody>
                {/* Fard prayers */}
                {FARD_PRAYERS.map(p => (
                  <tr key={`fard-${p.name}`} className="border-b border-border/40">
                    <td className="py-2 px-2 text-xs font-semibold text-foreground">{p.name}</td>
                    <td className="py-2 px-2 text-center text-xs text-muted-foreground">{p.rakat}</td>
                    <td className="py-2 px-2 text-center"><CategoryBadge category="Fard" /></td>
                    <td className="py-2 px-2 text-right text-[10px] text-muted-foreground/80">{p.timing}</td>
                  </tr>
                ))}
                {/* Witr (wajib) */}
                {witrPrayer && (
                  <tr className="border-b border-border/40">
                    <td className="py-2 px-2 text-xs font-semibold text-foreground">{witrPrayer.label}</td>
                    <td className="py-2 px-2 text-center text-xs text-muted-foreground">{witrPrayer.rakat}</td>
                    <td className="py-2 px-2 text-center"><CategoryBadge category="Wajib" /></td>
                    <td className="py-2 px-2 text-right text-[10px] text-muted-foreground/80">{witrPrayer.timing}</td>
                  </tr>
                )}
                {/* Sunnah mu'akkadah */}
                {sunnahMuakkadah.map(p => (
                  <tr key={`sunnah-${p.key}`} className="border-b border-border/40">
                    <td className="py-2 px-2 text-xs font-semibold text-foreground">{p.label}</td>
                    <td className="py-2 px-2 text-center text-xs text-muted-foreground">{p.rakat}</td>
                    <td className="py-2 px-2 text-center"><CategoryBadge category="Sunnah" /></td>
                    <td className="py-2 px-2 text-right text-[10px] text-muted-foreground/80">{p.timing}</td>
                  </tr>
                ))}
                {/* Nawafil (non-Ramadan) */}
                {specialNawafil.map(p => (
                  <tr key={`nafl-${p.key}`} className="border-b border-border/40">
                    <td className="py-2 px-2 text-xs font-semibold text-foreground">{p.label}</td>
                    <td className="py-2 px-2 text-center text-xs text-muted-foreground">{p.rakat}</td>
                    <td className="py-2 px-2 text-center"><CategoryBadge category="Nafl" /></td>
                    <td className="py-2 px-2 text-right text-[10px] text-muted-foreground/80">{p.timing}</td>
                  </tr>
                ))}
                {/* Ramadan nawafil */}
                {ramadanNawafil.map(p => (
                  <tr key={`ramadan-${p.key}`} className="border-b border-border/40 last:border-0">
                    <td className="py-2 px-2 text-xs font-semibold text-foreground">{p.label}</td>
                    <td className="py-2 px-2 text-center text-xs text-muted-foreground">{p.rakat}</td>
                    <td className="py-2 px-2 text-center"><CategoryBadge category="Nafl" /></td>
                    <td className="py-2 px-2 text-right text-[10px] text-muted-foreground/80">{p.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 pt-2">
            <CategoryBadge category="Fard" />
            <CategoryBadge category="Wajib" />
            <CategoryBadge category="Sunnah" />
            <CategoryBadge category="Nafl" />
          </div>
        </Section>

      </div>

      <BottomNav />
    </div>
  )
}
