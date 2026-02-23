'use client'

import { Moon } from 'lucide-react'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const duas = [
  {
    title: 'Dua for Guidance',
    arabic: '\u0627\u0647\u0652\u062F\u0650\u0646\u064E\u0627 \u0627\u0644\u0635\u0651\u0650\u0631\u064E\u0627\u0637\u064E \u0627\u0644\u0652\u0645\u064F\u0633\u0652\u062A\u064E\u0642\u0650\u064A\u0645\u064E',
    transliteration: 'Ihdinas-siratal-mustaqeem',
    meaning: 'Guide us to the straight path',
    source: 'Quran 1:6 \u2014 from Surah Al-Fatiha, recited in every prayer',
  },
  {
    title: 'Dua for Firm Faith',
    arabic: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u062B\u064E\u0628\u0651\u0650\u062A\u0652 \u0642\u064E\u0644\u0652\u0628\u0650\u064A \u0639\u064E\u0644\u0649\u0670 \u062F\u0650\u064A\u0646\u0650\u0643\u064E',
    transliteration: "Allahumma thabbit qalbi 'ala deenik",
    meaning: 'O Allah, make my heart firm upon Your religion',
    source: "Tirmidhi \u2014 one of the Prophet\u2019s \uFDFA most frequent duas",
  },
  {
    title: 'Dua for Ease',
    arabic: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0644\u064E\u0627 \u0633\u064E\u0647\u0652\u0644\u064E \u0625\u0650\u0644\u0651\u064E\u0627 \u0645\u064E\u0627 \u062C\u064E\u0639\u064E\u0644\u0652\u062A\u064E\u0647\u064F \u0633\u064E\u0647\u0652\u0644\u064B\u0627',
    transliteration: "Allahumma la sahla illa ma ja'altahu sahla",
    meaning: 'O Allah, nothing is easy except what You make easy',
    source: 'Ibn Hibban',
  },
  {
    title: 'Dua When Feeling Overwhelmed',
    arabic: '\u062D\u064E\u0633\u0652\u0628\u064F\u0646\u064E\u0627 \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0648\u064E\u0646\u0650\u0639\u0652\u0645\u064E \u0627\u0644\u0652\u0648\u064E\u0643\u0650\u064A\u0644\u064F',
    transliteration: "Hasbunallahu wa ni'mal wakeel",
    meaning: 'Allah is sufficient for us and He is the best disposer of affairs',
    source: 'Quran 3:173 \u2014 said by Ibrahim when thrown into the fire',
  },
  {
    title: 'Morning Dhikr',
    arabic: '\u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0648\u064E\u0628\u0650\u062D\u064E\u0645\u0652\u062F\u0650\u0647\u0650',
    transliteration: 'SubhanAllahi wa bihamdihi',
    meaning: 'Glory be to Allah and praise Him',
    source: 'Bukhari \u2014 say 100 times in the morning and evening, and your sins are forgiven',
  },
]

export default function NewMuslimDuasPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Moon}
        title="Duas for New Muslims"
        subtitle="Supplications for Your Journey"
        gradient="from-indigo-950 to-violet-900"
        showBack
        stars
        heroTheme="duas"
      />

      <div className="space-y-4 px-4 pt-5">
        {/* Intro */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          These are selected duas (supplications) that are especially meaningful for those beginning
          their journey in Islam. Memorize them gradually &mdash; even one dua said with sincerity is
          powerful.
        </p>

        {/* Dua Cards */}
        {duas.map((dua, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card/50 p-5 space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
              {dua.title}
            </p>
            <p className="font-arabic text-2xl text-center text-indigo-300 leading-relaxed py-2" dir="rtl">
              {dua.arabic}
            </p>
            <p className="text-sm italic text-muted-foreground text-center">
              {dua.transliteration}
            </p>
            <p className="text-sm text-foreground text-center">
              {dua.meaning}
            </p>
            <p className="text-xs text-muted-foreground/80 text-center">
              {dua.source}
            </p>
          </div>
        ))}

        {/* Explore All Duas Link */}
        <Link
          href="/explore/duas"
          className="block rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center"
        >
          <span className="text-indigo-400 font-medium">Explore All Duas &rarr;</span>
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
