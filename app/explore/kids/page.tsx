'use client'

import { useState } from 'react'
import { Baby, ChevronDown, ChevronUp } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

interface KidsSection {
  id: string
  title: string
  icon: string
  content: React.ReactNode
}

const SECTIONS: KidsSection[] = [
  {
    id: 'pillars',
    title: '5 Pillars of Islam',
    icon: '🕌',
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-400 italic">These are the 5 things every Muslim must do:</p>
        {[
          { icon: '☝️', name: 'Shahada', desc: 'Say "There is no god but Allah, and Muhammad is His Messenger" — this is how you become Muslim!' },
          { icon: '🤲', name: 'Salah (Prayer)', desc: 'Pray 5 times a day — Fajr, Dhuhr, Asr, Maghrib, and Isha. It\'s like having a special meeting with Allah!' },
          { icon: '💰', name: 'Zakat (Charity)', desc: 'Give some of your money to people who need it. Allah loves those who share!' },
          { icon: '🌙', name: 'Sawm (Fasting)', desc: 'In Ramadan, we don\'t eat or drink from sunrise to sunset. It teaches us patience and to be thankful!' },
          { icon: '🕋', name: 'Hajj (Pilgrimage)', desc: 'Visit the Ka\'bah in Makkah at least once in your life if you can. Millions of Muslims go together!' },
        ].map((pillar) => (
          <div key={pillar.name} className="flex gap-3 rounded-xl border border-gray-800 bg-gray-800/50 p-3">
            <span className="text-xl shrink-0">{pillar.icon}</span>
            <div>
              <p className="text-sm font-bold text-white">{pillar.name}</p>
              <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{pillar.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'duas-kids',
    title: 'Duas for Kids',
    icon: '🤲',
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-400 italic">Short duas every Muslim child should know:</p>
        {[
          {
            when: 'Before Eating',
            arabic: 'بِسْمِ اللَّهِ',
            trans: 'Bismillah',
            meaning: 'In the name of Allah',
          },
          {
            when: 'After Eating',
            arabic: 'الْحَمْدُ لِلَّهِ',
            trans: 'Alhamdulillah',
            meaning: 'All praise is for Allah',
          },
          {
            when: 'Before Sleeping',
            arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
            trans: 'Bismika Allahumma amootu wa ahya',
            meaning: 'In Your name, O Allah, I die and I live',
          },
          {
            when: 'On Waking Up',
            arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
            trans: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
            meaning: 'Praise be to Allah who gave us life after death, and to Him we return',
          },
          {
            when: 'Dua for Parents',
            arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
            trans: 'Rabbir-hamhuma kama rabbayani sagheeran',
            meaning: 'My Lord, have mercy on them as they raised me when I was small',
          },
        ].map((dua) => (
          <div key={dua.when} className="rounded-xl border border-gray-800 bg-gray-900 p-3 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{dua.when}</p>
            <p className="font-arabic text-sm text-teal-300 leading-loose" dir="rtl">{dua.arabic}</p>
            <p className="text-[11px] italic text-purple-400">{dua.trans}</p>
            <p className="text-xs text-gray-300">{dua.meaning}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'prophets',
    title: 'Stories of the Prophets',
    icon: '📖',
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-400 italic">Allah sent 25 prophets mentioned in the Quran. Here are some of their amazing stories:</p>
        {[
          { name: 'Adam (AS)', desc: 'The very first human! Allah made him from clay and taught him the names of everything.' },
          { name: 'Nuh (AS)', desc: 'He built a huge ark (boat) and saved the believers and animals from a great flood.' },
          { name: 'Ibrahim (AS)', desc: 'The friend of Allah! He was thrown into a fire but Allah kept him safe. He built the Ka\'bah with his son Isma\'il.' },
          { name: 'Musa (AS)', desc: 'Allah split the sea for him! He was given the Torah and spoke directly to Allah on Mount Tur.' },
          { name: 'Isa (AS)', desc: 'He was born miraculously without a father. He could heal the sick and bring the dead back to life by Allah\'s permission.' },
          { name: 'Muhammad ﷺ', desc: 'The final prophet! He received the Quran and was sent as a mercy to all of creation.' },
        ].map((prophet) => (
          <div key={prophet.name} className="flex gap-3 rounded-xl border border-gray-800 bg-gray-800/50 p-3">
            <span className="text-lg shrink-0">⭐</span>
            <div>
              <p className="text-sm font-bold text-white">{prophet.name}</p>
              <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{prophet.desc}</p>
            </div>
          </div>
        ))}
        <Link
          href="/explore/madrasa/prophets"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/20 px-4 py-3 text-sm font-bold text-amber-400"
        >
          See All 25 Prophets →
        </Link>
      </div>
    ),
  },
  {
    id: 'learn-read',
    title: 'Learn to Read Arabic',
    icon: '📝',
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-400 leading-relaxed">
          The Noorani Qaida is the first book every Muslim child uses to learn how to read the Quran. Start with the Arabic letters, then learn how they connect!
        </p>
        <Link
          href="/explore/madrasa/arabic-typing"
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-500/20 px-4 py-3 text-sm font-bold text-teal-400"
        >
          Practice Arabic Letters →
        </Link>
      </div>
    ),
  },
  {
    id: 'iman',
    title: '6 Pillars of Iman (Faith)',
    icon: '💚',
    content: (
      <div className="space-y-3">
        <p className="text-xs text-gray-400 italic">Iman means to believe in your heart. A Muslim believes in these 6 things:</p>
        {[
          { icon: '☝️', name: 'Belief in Allah', desc: 'There is only ONE God — Allah. He created everything and knows everything!' },
          { icon: '👼', name: 'Belief in the Angels', desc: 'Angels are made of light. They obey Allah perfectly. Jibreel brought the Quran to Prophet Muhammad ﷺ.' },
          { icon: '📚', name: 'Belief in the Books', desc: 'Allah sent holy books: the Torah, Zabur, Injil, and the Quran. The Quran is the last and final book.' },
          { icon: '🌟', name: 'Belief in the Prophets', desc: 'Allah sent messengers to guide people. From Adam (AS) to Muhammad ﷺ — the final prophet.' },
          { icon: '⏳', name: 'Belief in the Last Day', desc: 'One day, this world will end. Everyone will be brought back to life and judged for their deeds.' },
          { icon: '🎯', name: 'Belief in Qadar (Destiny)', desc: 'Everything happens by Allah\'s will. Good and bad — we trust Allah\'s plan and do our best!' },
        ].map((pillar) => (
          <div key={pillar.name} className="flex gap-3 rounded-xl border border-gray-800 bg-gray-800/50 p-3">
            <span className="text-xl shrink-0">{pillar.icon}</span>
            <div>
              <p className="text-sm font-bold text-white">{pillar.name}</p>
              <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{pillar.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

export default function KidsPage() {
  const [openSection, setOpenSection] = useState<string | null>('pillars')

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Baby}
        title="Kids Corner"
        subtitle="Learn Islam the Fun Way"
        gradient="from-rose-950 to-pink-900"
        showBack
      />

      <div className="px-4 pt-4 space-y-2">
        {SECTIONS.map((section) => {
          const isOpen = openSection === section.id
          return (
            <div
              key={section.id}
              className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="flex w-full items-center gap-3 p-4 text-left active:bg-gray-800/50 transition-colors"
              >
                <span className="text-lg">{section.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#f9fafb]">{section.title}</h3>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-600" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  {section.content}
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
