'use client'

import { useState } from 'react'
import { Heart, Star, Sparkles, BookOpen, Users, Scale, Compass, ChevronDown } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const articles = [
  {
    number: 1,
    icon: Star,
    arabic: 'الله',
    title: 'Belief in Allah',
    iconColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
    explanation:
      'One God, no partners, not like creation. He is the Creator, Sustainer, and Master of everything. Nothing happens without His knowledge and permission. The purest understanding of God — no trinity, no incarnation, no idols.',
    reference:
      '"Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. And there is nothing comparable to Him."',
    source: 'Quran 112:1-4',
  },
  {
    number: 2,
    icon: Sparkles,
    arabic: 'الملائكة',
    title: 'Belief in Angels',
    iconColor: 'text-blue-400',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    explanation:
      'Created from light, they carry out Allah\u2019s commands without question. Jibreel (Gabriel) brought the revelation. Mikail manages rain and provisions. Israfil will blow the trumpet on the Day of Judgement. Izrail (Malak al-Mawt) is the angel of death.',
    reference: '"The Messenger has believed in what was revealed to him from his Lord, and so have the believers..."',
    source: 'Quran 2:285',
  },
  {
    number: 3,
    icon: BookOpen,
    arabic: 'الكتب',
    title: 'Belief in the Books',
    iconColor: 'text-purple-400',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    explanation:
      'Allah sent divine books: Torah (Tawrat) to Musa, Psalms (Zabur) to Dawud, Gospel (Injeel) to Isa, and the Quran to Muhammad \uFDFA. The Quran is the final revelation, preserved in its original Arabic without alteration.',
    reference: '"Say: We have believed in Allah and what has been revealed to us and what has been revealed to Abraham, Ishmael, Isaac, Jacob..."',
    source: 'Quran 2:136',
  },
  {
    number: 4,
    icon: Users,
    arabic: 'الأنبياء',
    title: 'Belief in the Prophets',
    iconColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/20 text-amber-400',
    explanation:
      '25 prophets are named in the Quran. Adam was the first. Nuh, Ibrahim, Musa, Isa, and Muhammad \uFDFA are among the greatest. Muhammad \uFDFA is the Seal of the Prophets — the last and final messenger.',
    reference: '"Muhammad is not the father of any of your men, but he is the Messenger of Allah and the Seal of the Prophets."',
    source: 'Quran 33:40',
  },
  {
    number: 5,
    icon: Scale,
    arabic: 'يوم القيامة',
    title: 'Belief in the Day of Judgement',
    iconColor: 'text-rose-400',
    badgeColor: 'bg-rose-500/20 text-rose-400',
    explanation:
      'This world is temporary. On the Day of Judgement, every soul will be resurrected and held accountable for their deeds. The scales of justice will be set up, and people will enter Paradise or Hellfire.',
    reference: '"So whoever does an atom\u2019s weight of good will see it. And whoever does an atom\u2019s weight of evil will see it."',
    source: 'Quran 99:7-8',
  },
  {
    number: 6,
    icon: Compass,
    arabic: 'القدر',
    title: 'Belief in Divine Decree',
    iconColor: 'text-teal-400',
    badgeColor: 'bg-teal-500/20 text-teal-400',
    explanation:
      'Allah knows all things past, present, and future. Everything that happens is by His will and wisdom. This does not negate free will — humans have choice, but Allah\u2019s knowledge encompasses everything.',
    reference: '"Indeed, all things We created with decree."',
    source: 'Quran 54:49',
  },
]

export default function BeliefsPage() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Heart}
        title="Articles of Faith"
        subtitle="What Muslims Believe"
        gradient="from-blue-950 to-indigo-900"
        showBack
        stars
        heroTheme="prayer"
      />

      <div className="space-y-3 px-4 pt-5 animate-stagger">
        {/* Intro */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <p className="text-sm leading-relaxed text-gray-400">
            Every Muslim believes in these six core articles of faith. They form the foundation of Islamic belief.
          </p>
        </div>

        {/* Expandable Cards */}
        {articles.map((article, index) => {
          const isOpen = openIndex === index
          const IconComp = article.icon

          return (
            <div
              key={article.number}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 cursor-pointer transition-all"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${article.badgeColor} text-xs font-bold`}>
                  {article.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <IconComp className={`h-4 w-4 shrink-0 ${article.iconColor}`} />
                    <h3 className="text-sm font-bold text-[#f9fafb]">{article.title}</h3>
                  </div>
                  <p className="font-arabic text-lg text-gray-400 mt-0.5">{article.arabic}</p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Expandable Content */}
              <div
                className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="text-sm leading-relaxed text-gray-400">{article.explanation}</p>
                  <div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/80 p-4">
                    <p className="text-sm italic text-blue-300">{article.reference}</p>
                    <p className="mt-1 text-xs text-gray-500">— {article.source}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
