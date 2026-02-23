'use client'

import { Heart, BookOpen, HandHeart, Mic2, Ear, GraduationCap, Lightbulb, Coins } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const ACTIONS = [
  {
    num: 1,
    title: 'Dua (Supplication)',
    icon: HandHeart,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    text: "Ramadan is a blessed month for seeking Allah Ta'ala's mercy and forgiveness. Make heartfelt duas for yourself, your family, the Ummah, for both worldly and spiritual needs. Make 40 Rabeana and any duas with the intention of Dua.",
  },
  {
    num: 2,
    title: 'Dhikr (Remembrance of Allah)',
    icon: BookOpen,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    text: 'Can recite tasbih, tahleel, takbeer, and istighfar. SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illallah, Astaghfirullah.',
  },
  {
    num: 3,
    title: 'Seeking Forgiveness (Istighfar)',
    icon: Heart,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    text: 'Repeating Astaghfirullah and sincerely repenting for past sins. Istighfar is one of the most powerful acts of worship.',
  },
  {
    num: 4,
    title: 'Sending Salawat (Durood)',
    icon: Mic2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    text: 'Can recite any form of Durood Sharif, sending blessings upon Rasulullah \uFDFA. This brings immense rewards.',
  },
  {
    num: 5,
    title: 'Listening to the Quran',
    icon: Ear,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    text: 'While she cannot recite the Quran from memory or a physical Mushaf, she can listen to its recitation for spiritual benefit.',
  },
  {
    num: 6,
    title: 'Gaining Knowledge',
    icon: GraduationCap,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    text: "Can read Islamic books, tafseer, hadith, or listen to beneficial lectures as a way to increase with Allah Ta'ala and deen.",
  },
  {
    num: 7,
    title: 'Making Intentions for Good Deeds',
    icon: Lightbulb,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    text: 'Plan good actions she wishes to implement in her life, such as improving her character, increasing her worship, or helping others.',
  },
  {
    num: 8,
    title: 'Charity (Sadaqah)',
    icon: Coins,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    text: "Giving charity, even if small, as a simple, easy way to earn rewards from Allah Ta'ala.",
  },
]

export default function SistersRamadanPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Heart}
        title="Ramadan for Sisters"
        subtitle="Worship during your cycle"
        gradient="from-rose-900 to-pink-900"
        showBack
        heroTheme="ramadan"
      />

      <div className="px-4 pt-5 space-y-4">

        <div className="rounded-2xl border border-rose-800/30 bg-rose-950/20 p-4">
          <p className="text-sm text-rose-200 leading-relaxed">
            A menstruating woman can still engage in various acts of worship during Ramadan even though she cannot pray or fast during these days. Here are <strong>8 beneficial actions</strong> she can do:
          </p>
        </div>

        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <div key={action.num} className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${action.bg}`}>
                  <Icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Action {action.num}</span>
                  <h3 className={`text-sm font-bold ${action.color}`}>{action.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed pl-11">{action.text}</p>
            </div>
          )
        })}

        <div className="rounded-2xl border border-rose-800/20 bg-rose-950/10 p-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Even though menstruation prevents certain acts of worship, a woman can still engage in immense devotion and earn rewards through these acts. The key is to connect with Allah Ta&apos;ala sincerely and seek His mercy and guidance.
          </p>
          <p className="mt-2 text-[10px] text-gray-600">
            Source: Darul Uloom/Masjid Islamic & Academic Institute Inc., East Street, Georgetown.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
