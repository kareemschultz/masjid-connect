'use client'

import { useState } from 'react'
import { BookOpen, Copy, Check } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

const DUAS = [
  {
    title: 'Dua for a Righteous Spouse',
    arabic: '\u0631\u064E\u0628\u0651\u0650 \u0625\u0650\u0646\u0651\u0650\u064A \u0644\u0650\u0645\u064E\u0627 \u0623\u064E\u0646\u0632\u064E\u0644\u0652\u062A\u064E \u0625\u0650\u0644\u064E\u064A\u0651\u064E \u0645\u0650\u0646\u0652 \u062E\u064E\u064A\u0652\u0631\u064D \u0641\u064E\u0642\u0650\u064A\u0631\u064C',
    transliteration: 'Rabbi inni lima anzalta ilayya min khayrin faqeer',
    meaning: 'My Lord, indeed I am, for whatever good You would send down to me, in need.',
    source: "Quran 28:24 \u2014 Musa's dua, widely used as a dua for a good spouse",
  },
  {
    title: 'Dua During Pregnancy',
    arabic: '\u0631\u064E\u0628\u0651\u0650 \u0644\u064E\u0627 \u062A\u064E\u0630\u064E\u0631\u0652\u0646\u0650\u064A \u0641\u064E\u0631\u0652\u062F\u064B\u0627 \u0648\u064E\u0623\u064E\u0646\u062A\u064E \u062E\u064E\u064A\u0652\u0631\u064F \u0627\u0644\u0652\u0648\u064E\u0627\u0631\u0650\u062B\u0650\u064A\u0646\u064E',
    transliteration: 'Rabbi la tadharnee fardan wa anta khayrul waritheen',
    meaning: 'My Lord, do not leave me alone, and You are the best of inheritors.',
    source: 'Quran 21:89',
  },
  {
    title: 'Dua for Children',
    arabic: '\u0631\u064E\u0628\u0651\u0650 \u0647\u064E\u0628\u0652 \u0644\u0650\u064A \u0645\u0650\u0646 \u0644\u0651\u064E\u062F\u064F\u0646\u0643\u064E \u0630\u064F\u0631\u0651\u0650\u064A\u0651\u064E\u0629\u064B \u0637\u064E\u064A\u0651\u0650\u0628\u064E\u0629\u064B',
    transliteration: 'Rabbi hab li min ladunka dhurriyyatan tayyibah',
    meaning: 'My Lord, grant me from Yourself a good offspring.',
    source: 'Quran 3:38',
  },
  {
    title: 'Dua in Distress',
    arabic: '\u0644\u064E\u0627 \u0625\u0650\u0644\u064E\u0670\u0647\u064E \u0625\u0650\u0644\u0651\u064E\u0627 \u0623\u064E\u0646\u062A\u064E \u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E\u0643\u064E \u0625\u0650\u0646\u0651\u0650\u064A \u0643\u064F\u0646\u062A\u064F \u0645\u0650\u0646\u064E \u0627\u0644\u0638\u0651\u064E\u0627\u0644\u0650\u0645\u0650\u064A\u0646\u064E',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimeen',
    meaning: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    source: 'Quran 21:87 \u2014 Dua of Yunus. The dua of distress \u2014 for childbirth, hardship, or any difficulty',
  },
  {
    title: 'Dua for Protecting Children',
    arabic: '\u0623\u064F\u0639\u0650\u064A\u0630\u064F\u0643\u064E \u0628\u0650\u0643\u064E\u0644\u0650\u0645\u064E\u0627\u062A\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u062A\u0651\u064E\u0627\u0645\u0651\u064E\u0629\u0650 \u0645\u0650\u0646 \u0643\u064F\u0644\u0651\u0650 \u0634\u064E\u064A\u0652\u0637\u064E\u0627\u0646\u064D \u0648\u064E\u0647\u064E\u0627\u0645\u0651\u064E\u0629\u064D',
    transliteration: "U'eedhuka bi kalimatillahit-tammati min kulli shaytanin wa hammah",
    meaning: 'I seek refuge in the perfect words of Allah from every devil and every harmful thing.',
    source: 'Bukhari \u2014 said over children before sleep',
  },
  {
    title: 'Dua for Marriage',
    arabic: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0623\u064E\u0644\u0651\u0650\u0641\u0652 \u0628\u064E\u064A\u0652\u0646\u064E \u0642\u064F\u0644\u064F\u0648\u0628\u0650\u0646\u064E\u0627',
    transliteration: 'Allahumma allif bayna quloobina',
    meaning: 'O Allah, unite our hearts.',
    source: 'From the marriage dua',
  },
  {
    title: 'Dua in Grief',
    arabic: '\u0625\u0650\u0646\u0651\u064E\u0627 \u0644\u0650\u0644\u0651\u064E\u0647\u0650 \u0648\u064E\u0625\u0650\u0646\u0651\u064E\u0627 \u0625\u0650\u0644\u064E\u064A\u0652\u0647\u0650 \u0631\u064E\u0627\u062C\u0650\u0639\u064F\u0648\u0646\u064E',
    transliteration: "Inna lillahi wa inna ilayhi raji'oon",
    meaning: 'Surely to Allah we belong and to Him we return.',
    source: 'Quran 2:156 \u2014 said upon any loss or difficulty',
  },
  {
    title: 'Dua for Inner Beauty',
    arabic: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u062D\u064E\u0633\u0651\u0650\u0646\u0652 \u062E\u064F\u0644\u064F\u0642\u0650\u064A \u0643\u064E\u0645\u064E\u0627 \u062D\u064E\u0633\u0651\u064E\u0646\u0652\u062A\u064E \u062E\u064E\u0644\u0652\u0642\u0650\u064A',
    transliteration: 'Allahumma hassin khuluqi kama hassanta khalqi',
    meaning: 'O Allah, make my character beautiful as You made my appearance beautiful.',
    source: 'Musnad Ahmad',
  },
]

export default function WomensDuasPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (dua: (typeof DUAS)[number], index: number) => {
    const text = `${dua.arabic}\n${dua.transliteration}\n${dua.meaning}`
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={BookOpen}
        title="Women&apos;s Duas"
        subtitle="Supplications for Sisters"
        gradient="from-teal-950 to-cyan-900"
        showBack
        stars
        heroTheme="duas"
      />

      <div className="space-y-4 px-4 pt-5 animate-stagger">
        {/* Intro */}
        <p className="text-sm text-gray-400 leading-relaxed px-1">
          These are selected supplications from the Quran and Sunnah that hold special meaning for Muslim women &mdash; as mothers, wives, daughters, and servants of Allah.
        </p>

        {/* Dua Cards */}
        {DUAS.map((dua, i) => (
          <div key={i} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-400">{dua.title}</p>
            <p className="font-arabic text-2xl text-center text-teal-300 leading-relaxed py-2">{dua.arabic}</p>
            <p className="text-sm italic text-gray-300 text-center">{dua.transliteration}</p>
            <p className="text-sm text-[#f9fafb] text-center">{dua.meaning}</p>
            <p className="text-xs text-gray-500 text-center">{dua.source}</p>
            <div className="flex justify-end">
              <button
                onClick={() => handleCopy(dua, i)}
                className="flex items-center gap-1.5 rounded-lg bg-gray-800/60 px-3 py-1.5 text-xs text-gray-400 hover:text-teal-400 transition-colors"
              >
                {copiedIndex === i ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-teal-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Link to All Duas */}
        <Link href="/explore/duas" className="block rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 text-center">
          <span className="text-teal-400 font-medium">Explore All Duas &rarr;</span>
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
