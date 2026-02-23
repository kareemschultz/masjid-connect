'use client'

import { Scale, Banknote, Heart, User, Home, GraduationCap, ShieldCheck, Gift } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const RIGHTS = [
  {
    title: 'Right to Inheritance',
    icon: Banknote,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    text: 'Women have a guaranteed share of inheritance. "For men is a share of what the parents and close relatives leave, and for women is a share of what the parents and close relatives leave." Islam was the first system to legislate women\'s inheritance rights.',
    ref: 'Quran 4:7, 4:11',
  },
  {
    title: 'Right to Marry by Choice',
    icon: Heart,
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
    text: "A woman's consent is absolutely required for a valid marriage. The wali (guardian) assists with the process but cannot force her into marriage. The Prophet \uFDFA annulled marriages where women were forced.",
    ref: 'Bukhari, Ibn Majah',
  },
  {
    title: 'Right to Divorce',
    icon: Scale,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    text: "Khul' (wife-initiated divorce) is valid in Islam. A woman may seek dissolution of her marriage through proper channels. The Prophet \uFDFA granted khul' to women who requested it.",
    ref: 'Bukhari \u2014 Hadith of Habibah bint Sahl',
  },
  {
    title: 'Right to Keep Her Name',
    icon: User,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    text: 'A woman does not change her family name upon marriage in Islamic tradition. Her lineage and identity remain her own. This was established 1,400 years ago.',
    ref: 'Islamic tradition \u2014 based on nasab (lineage) system',
  },
  {
    title: 'Right to Own Property',
    icon: Home,
    color: 'text-teal-400',
    bg: 'bg-teal-500/20',
    text: "A woman's wealth, earnings, and property are entirely her own. Her husband has no legal claim to her money. Whatever she earns, inherits, or is gifted belongs solely to her.",
    ref: 'Quran 4:32',
  },
  {
    title: 'Right to Education',
    icon: GraduationCap,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    text: '"Seeking knowledge is an obligation upon every Muslim" \u2014 this hadith makes no distinction between men and women. Aisha (RA) was one of the greatest scholars of Islam.',
    ref: 'Ibn Majah',
  },
  {
    title: 'Right to Refuse a Marriage',
    icon: ShieldCheck,
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    text: "A woman has the right to explicitly refuse a marriage proposal. Her objection invalidates the nikah (marriage contract). No one \u2014 not a father, brother, or anyone else \u2014 can override her refusal.",
    ref: 'Bukhari, Muslim',
  },
  {
    title: 'Right to Mahr (Dowry)',
    icon: Gift,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    text: 'The groom gives a mahr (gift/dowry) directly to the bride \u2014 not to her family. This gift is hers alone and cannot be taken away. It can be money, property, or anything of value she agrees to.',
    ref: 'Quran 4:4',
  },
  {
    title: 'Right to Maintenance',
    icon: Home,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    text: 'The husband is obligated to provide food, clothing, and shelter to his wife. This is not optional or dependent on her own wealth \u2014 even if she is wealthy, his obligation remains.',
    ref: 'Quran 65:6-7',
  },
  {
    title: 'Right to Kind Treatment',
    icon: Heart,
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
    text: '"The best of you are those who are best to their wives." The Prophet \uFDFA set the highest example in his treatment of his wives \u2014 he helped at home, consulted them, and never raised his hand.',
    ref: 'Tirmidhi',
  },
]

export default function RightsOfWomenPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero
        icon={Scale}
        title="Rights of Women"
        subtitle="What Islam Gives You — Clearly"
        gradient="from-blue-950 to-indigo-900"
        showBack
        stars
      />

      <div className="space-y-4 px-4 pt-5 animate-stagger">
        {/* Intro */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
          <p className="text-sm text-gray-400 leading-relaxed">
            Islam granted women rights over 1,400 years ago that the modern world only began recognizing in recent centuries. These are not favours &mdash; they are divine obligations.
          </p>
        </div>

        {/* Rights Cards */}
        {RIGHTS.map((right, i) => {
          const Icon = right.icon
          return (
            <div key={i} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${right.bg}`}>
                  <Icon className={`h-5 w-5 ${right.color}`} />
                </div>
                <h2 className="text-base font-bold text-[#f9fafb]">{right.title}</h2>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mt-3">{right.text}</p>
              <p className="text-xs text-gray-500 mt-2">{right.ref}</p>
            </div>
          )
        })}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 italic px-4">
            These rights are from the Quran and Sunnah &mdash; they are not favours, they are obligations upon others and entitlements for you.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
