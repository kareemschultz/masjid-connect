'use client'

import { useState } from 'react'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

interface AdabCategory {
  title: string
  arabic?: string
  transliteration?: string
  details: string[]
  ruling: string
  rulingType: 'wajib' | 'sunnah' | 'mustahabb' | 'mixed'
  source?: string
}

const categories: AdabCategory[] = [
  {
    title: 'Greetings',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
    transliteration: 'As-Salamu Alaykum wa Rahmatullahi wa Barakatuh',
    details: [
      'The Prophet \uFDFA said: "Spread the salam among you."',
      'It is Sunnah to initiate the greeting and Wajib to return it.',
      'The younger greets the elder, the walking greets the sitting, and the smaller group greets the larger.',
    ],
    ruling: 'Wajib (to return), Sunnah (to initiate)',
    rulingType: 'mixed',
  },
  {
    title: 'Eating & Drinking',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    details: [
      'Say Bismillah before eating.',
      'Eat with your right hand.',
      'Sit while eating and drinking.',
      'Do not blow on hot food.',
      'Drink water in 3 sips, pausing to breathe between each.',
    ],
    ruling: 'Sunnah',
    rulingType: 'sunnah',
  },
  {
    title: 'Entering Home',
    arabic: 'السَّلَامُ عَلَيْكُمْ',
    transliteration: 'As-Salamu Alaykum',
    details: [
      'Knock up to 3 times before entering.',
      'Say salam when entering.',
      'Ask permission before entering someone else\'s home.',
      'Respect the privacy of the household.',
    ],
    ruling: 'Sunnah',
    rulingType: 'sunnah',
    source: 'Respect for privacy',
  },
  {
    title: 'Entering Masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahummaftah li abwaba rahmatik',
    details: [
      'Enter with the right foot first, leave with the left foot first.',
      'Recite the dua for entering the masjid.',
      'Do not speak loudly inside the masjid.',
      'Keep your phone on silent.',
      'Pray two rak\'ah Tahiyyat al-Masjid upon entering.',
    ],
    ruling: 'Sunnah',
    rulingType: 'sunnah',
  },
  {
    title: 'Sneezing & Yawning',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    details: [
      'Say Alhamdulillah after sneezing.',
      'The one who hears replies: يَرْحَمُكَ اللَّهُ (Yarhamukallah — May Allah have mercy on you).',
      'The sneezer then responds: يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ (Yahdikumullah — May Allah guide you).',
      'Cover your mouth when yawning and try to suppress it.',
    ],
    ruling: 'Sunnah',
    rulingType: 'sunnah',
  },
  {
    title: 'Speaking',
    details: [
      'Always speak the truth.',
      'Avoid backbiting (gheebah) — it is a major sin.',
      'Do not mock or ridicule others.',
      'Lower your voice; do not raise it unnecessarily.',
    ],
    ruling: 'Wajib (avoiding gheebah)',
    rulingType: 'wajib',
    source: 'Quran 49:12 — "O you who believe, avoid much suspicion..."',
  },
  {
    title: 'Dealing with Parents',
    arabic: 'وَلَا تَقُل لَّهُمَا أُفٍّ',
    details: [
      'Never say "uff" (أُفٍّ) to your parents — an expression of annoyance.',
      'Lower your voice when speaking to them.',
      'Obey them in all matters within Islamic limits.',
      'Make dua for them regularly.',
    ],
    ruling: 'Wajib',
    rulingType: 'wajib',
    source: 'Quran 17:23',
  },
  {
    title: 'Dealing with Neighbours',
    details: [
      'Do not harm your neighbour in any way.',
      'Share food with your neighbours.',
      'Check on them regularly, especially the elderly.',
      'The Prophet \uFDFA said: "He is not a believer whose neighbour does not feel safe from his harm."',
    ],
    ruling: 'Wajib (not harming), Mustahabb (sharing)',
    rulingType: 'mixed',
  },
  {
    title: 'Bathroom Etiquettes',
    arabic: 'أعوذ بالله من الخبث والخبائث',
    transliteration: "A'udhu billahi min al-khubthi wal-khaba'ith",
    details: [
      'Enter the bathroom with the left foot first, and exit with the right foot.',
      "Recite: أعوذ بالله من الخبث والخبائث (A'udhu billahi min al-khubthi wal-khaba'ith) — I seek refuge in Allah from filth and impure things — before entering.",
      "Upon exiting, recite: الحمد لله الذي أذهب عني الأذى وعافاني (Alhamdulillahil-ladhi adhhaba 'anni al-adha wa 'afani) — Praise be to Allah who removed harm from me and healed me.",
      'Do not take anything with the name of Allah (e.g. books, tasbih) into the bathroom.',
      'Do not face or turn your back to Qiblah while relieving yourself in an open area (in a building it is permitted with a barrier).',
      'Sit while urinating; never urinate while standing unless necessary.',
      'Maintain complete privacy and avoid exposing yourself unnecessarily.',
      'Do not speak or answer greetings inside the bathroom.',
      'Do not read Quran or make dhikr inside the bathroom.',
      'Do not enter with a bare minimum of clothing; cover the awrah.',
      'Perform istinja (cleansing with water) or istijmar (3 dry stones/tissue) after relieving oneself.',
      'The minimum in istinja is to remove the filth; it is preferable to use water until clean.',
      'Do not do istinja with the right hand; use the left hand.',
      'Do not use bones, food, or sacred objects for istijmar.',
      'Wash both hands after istinja.',
      'Avoid urinating in holes, standing water, under fruit trees, or on pathways.',
      'Be careful of splashes (especially droplets of urine on clothing — many are heedless of this).',
      'Do not linger unnecessarily in the bathroom.',
    ],
    ruling: 'Sunnah / Adab',
    rulingType: 'sunnah',
    source: 'Al Fiqh-ul Muyassar, Hanafi',
  },
]

function getRulingBadges(ruling: string, rulingType: string) {
  if (rulingType === 'wajib') {
    return <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-red-400">{ruling}</span>
  }
  if (rulingType === 'sunnah') {
    return <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">{ruling}</span>
  }
  if (rulingType === 'mustahabb') {
    return <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400">{ruling}</span>
  }
  // mixed
  const parts = ruling.split(', ')
  return (
    <div className="flex flex-wrap gap-1.5">
      {parts.map((part, i) => {
        const lower = part.toLowerCase()
        let color = 'bg-gray-500/20 text-gray-400'
        if (lower.includes('wajib')) color = 'bg-red-500/20 text-red-400'
        else if (lower.includes('sunnah')) color = 'bg-emerald-500/20 text-emerald-400'
        else if (lower.includes('mustahabb')) color = 'bg-blue-500/20 text-blue-400'
        return (
          <span key={i} className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${color}`}>
            {part}
          </span>
        )
      })}
    </div>
  )
}

export default function AdabPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Star}
        title="Islamic Adab"
        subtitle="Manners of the Muslim"
        gradient="from-amber-900 to-orange-900"
        showBack
      />

      <div className="mx-auto max-w-2xl space-y-3 px-4 pt-6 pb-6">
        {categories.map((cat, index) => {
          const isExpanded = expandedIndex === index
          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all duration-300"
            >
              {/* Header */}
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-white">{cat.title}</h3>
                  {!isExpanded && (
                    <div className="mt-1.5">
                      {getRulingBadges(cat.ruling, cat.rulingType)}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/5">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-800 px-4 pt-4 pb-5 animate-fade-up">
                  {/* Arabic */}
                  {cat.arabic && (
                    <div className="mb-4 rounded-xl bg-white/[0.03] px-4 py-3 text-center">
                      <p className="font-arabic text-xl leading-loose text-amber-400">
                        {cat.arabic}
                      </p>
                      {cat.transliteration && (
                        <p className="mt-1 text-[13px] italic text-gray-400">
                          {cat.transliteration}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Details */}
                  <ul className="space-y-2.5">
                    {cat.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-gray-300">
                        <Star className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-500/60" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Source */}
                  {cat.source && (
                    <p className="mt-3 text-[12px] italic text-gray-500">
                      {cat.source}
                    </p>
                  )}

                  {/* Ruling badge */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Ruling:</span>
                    {getRulingBadges(cat.ruling, cat.rulingType)}
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
