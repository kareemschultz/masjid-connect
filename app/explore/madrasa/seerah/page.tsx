'use client'

import { useState } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const ERAS = [
  {
    id: 1,
    title: 'Birth & Early Life',
    years: '570–610 CE',
    accent: 'teal',
    events: [
      'Born in Makkah, Year of the Elephant (570 CE)',
      'Father Abdullah died before his birth; mother Aminah died when he was 6',
      'Raised by grandfather Abd al-Muttalib, then uncle Abu Talib',
      'Known as Al-Amin (The Trustworthy) by all Makkah',
      'Married Khadijah (رضي الله عنها) at age 25; she was 40',
      'Had 6 children: Qasim, Abdullah, Zainab, Ruqayyah, Umm Kulthum, Fatimah',
    ],
  },
  {
    id: 2,
    title: 'Revelation & Makkah Period',
    years: '610–622 CE',
    accent: 'purple',
    events: [
      'First revelation in Cave Hira (Surah Al-Alaq): "Read in the name of your Lord..."',
      '13 years in Makkah, facing severe persecution',
      'Night Journey (Isra wal Mi\'raj): Jerusalem \u2192 7 heavens \u2192 meeting Allah',
      '5 daily prayers made obligatory during Isra wal Mi\'raj',
      'Key companions: Khadijah, Abu Bakr, Ali, Bilal (first muezzin)',
      'Year of Sadness: death of Khadijah and Abu Talib in the same year',
    ],
  },
  {
    id: 3,
    title: 'Hijra & Madinah Period',
    years: '622–632 CE',
    accent: 'emerald',
    events: [
      'Hijra (migration) to Madinah in 622 CE \u2014 Year 1 of Islamic calendar',
      'Brotherhood between Muhajireen and Ansar',
      'Constitution of Madinah: first written multicultural civic agreement',
      'Key battles: Badr (victory), Uhud (test), Khandaq (Trench)',
      'Conquest of Makkah (630 CE): entered peacefully, idol-free Ka\'bah',
      'Farewell Pilgrimage (632 CE): 124,000 companions; famous sermon',
    ],
  },
  {
    id: 4,
    title: 'Final Days & Legacy',
    years: '',
    accent: 'amber',
    events: [
      'Passed away Monday 12 Rabi al-Awwal, 11 AH (632 CE), aged 63',
      'Buried in Madinah in Masjid an-Nabawi',
      'Final revelation: "Today I have perfected your religion..." (Quran 5:3)',
      'Left: Quran and Sunnah; no worldly inheritance',
      'Legacy: 1.8 billion followers today, the most influential human in history',
    ],
  },
] as const

// ─── Accent helpers ──────────────────────────────────────────────────────────

function accentClasses(accent: string) {
  switch (accent) {
    case 'teal':
      return {
        circle: 'bg-teal-500/20 text-teal-400',
        border: 'border-teal-500/30',
        text: 'text-teal-400',
        timeline: 'border-teal-500/30',
        dot: 'bg-teal-400',
        yearBg: 'bg-teal-500/10 text-teal-300',
      }
    case 'purple':
      return {
        circle: 'bg-purple-500/20 text-purple-400',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        timeline: 'border-purple-500/30',
        dot: 'bg-purple-400',
        yearBg: 'bg-purple-500/10 text-purple-300',
      }
    case 'emerald':
      return {
        circle: 'bg-emerald-500/20 text-emerald-400',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        timeline: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
        yearBg: 'bg-emerald-500/10 text-emerald-300',
      }
    case 'amber':
      return {
        circle: 'bg-amber-500/20 text-amber-400',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        timeline: 'border-amber-500/30',
        dot: 'bg-amber-400',
        yearBg: 'bg-amber-500/10 text-amber-300',
      }
    default:
      return {
        circle: 'bg-gray-500/20 text-muted-foreground',
        border: 'border-gray-500/30',
        text: 'text-muted-foreground',
        timeline: 'border-gray-500/30',
        dot: 'bg-gray-400',
        yearBg: 'bg-gray-500/10 text-muted-foreground',
      }
  }
}

// ─── Era Card Component ──────────────────────────────────────────────────────

function EraCard({
  era,
  expanded,
  onToggle,
}: {
  era: (typeof ERAS)[number]
  expanded: boolean
  onToggle: () => void
}) {
  const c = accentClasses(era.accent)

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors active:bg-secondary/60"
      >
        {/* Era number circle */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${c.circle}`}
        >
          {era.id}
        </div>

        {/* Title + year range */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{era.title}</p>
          {era.years && (
            <span className={`inline-block mt-0.5 rounded-md px-2 py-0.5 text-[10px] font-semibold ${c.yearBg}`}>
              {era.years}
            </span>
          )}
        </div>

        {/* Chevron */}
        {expanded ? (
          <ChevronUp className={`h-4 w-4 shrink-0 ${c.text}`} />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/80" />
        )}
      </button>

      {/* Expanded content — timeline-style bullet list */}
      {expanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-border pt-3" />
          <div className={`ml-[18px] border-l-2 ${c.timeline} pl-5 space-y-3`}>
            {era.events.map((event, i) => (
              <div key={i} className="relative">
                {/* Timeline dot */}
                <span
                  className={`absolute -left-[25px] top-[7px] h-2.5 w-2.5 rounded-full ${c.dot} ring-2 ring-gray-900`}
                />
                <p className="text-sm leading-relaxed text-muted-foreground">{event}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SeerahPage() {
  const [expandedEra, setExpandedEra] = useState<number | null>(null)

  function toggleEra(id: number) {
    setExpandedEra(prev => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Calendar}
        title="Seerah"
        subtitle="Life of the Prophet Muhammad \uFDFA"
        gradient="from-teal-900 to-cyan-900"
        showBack
        heroTheme="hadith"
      />

      <div className="px-4 py-4 space-y-3">
        {ERAS.map(era => (
          <EraCard
            key={era.id}
            era={era}
            expanded={expandedEra === era.id}
            onToggle={() => toggleEra(era.id)}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
