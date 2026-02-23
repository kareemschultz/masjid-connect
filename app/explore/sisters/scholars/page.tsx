'use client'

import { GraduationCap } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const SCHOLARS = [
  {
    name: 'Aisha bint Abi Bakr',
    honorific: 'رضي الله عنها',
    era: 'Companion',
    description:
      'One of the greatest scholars in Islamic history. She narrated over 2,210 hadith and was a leading authority in Islamic jurisprudence, medicine, and poetry. Companions and scholars of Madinah regularly sought her knowledge. She corrected misunderstandings and provided clarity on the Prophet\u2019s \uFDFA teachings.',
    quote:
      'The companions used to come to Aisha to ask about the matters of the religion that they could not find answers to elsewhere.',
  },
  {
    name: 'Khadijah bint Khuwaylid',
    honorific: 'رضي الله عنها',
    era: 'Companion',
    description:
      'The first person to accept Islam. A successful and respected businesswoman in Makkah. She supported the Prophet \uFDFA emotionally, financially, and spiritually from the very beginning of revelation. She is the Mother of the Believers and one of the four greatest women in Paradise.',
    quote:
      '\u201CBy Allah, Allah will never disgrace you. You keep good relations with your relatives, you bear the burden of the weak, you help the poor, you entertain guests, and you assist those in calamity.\u201D',
  },
  {
    name: 'Fatimah al-Zahra',
    honorific: 'رضي الله عنها',
    era: 'Companion',
    description:
      'The beloved daughter of the Prophet \uFDFA and Khadijah. Known for her extraordinary piety, patience, and devotion. She lived a life of simplicity despite her noble lineage. The Prophet \uFDFA declared her as the leader of the women of Paradise.',
    quote:
      'The Prophet \uFDFA said: \u201CFatimah is the leader of the women of Paradise.\u201D \u2014 Bukhari',
  },
  {
    name: 'Maryam',
    honorific: 'عليها السلام',
    era: "Prophet's Mother",
    description:
      'The only woman mentioned by name in the Quran. An entire surah (Surah Maryam, Chapter 19) is named after her \u2014 the only surah named after a woman. She exemplified complete trust in Allah, devotion, and chastity. She is honoured as one of the greatest women in all of human history.',
    quote:
      '\u201CAnd mention Maryam in the Book, when she withdrew from her family to a place facing east.\u201D \u2014 Quran 19:16',
  },
  {
    name: 'Yasmin Mogahed',
    honorific: '',
    era: 'Contemporary',
    description:
      'Author of \u201CReclaim Your Heart\u201D, one of the most widely-read contemporary Islamic books. She is a speaker, educator, and instructor who makes Islamic spirituality accessible to modern audiences. Her podcast \u201CSoul Food\u201D and lectures have inspired millions of Muslims worldwide.',
    quote: '',
  },
  {
    name: 'Umm Salamah',
    honorific: 'رضي الله عنها',
    era: 'Companion',
    description:
      'Wife of the Prophet \uFDFA, known for her wisdom, courage, and bold advocacy for women. She asked the Prophet \uFDFA why the Quran did not address women directly \u2014 after which Allah revealed Quran 33:35, explicitly addressing believing men AND believing women. Her question changed revelation.',
    quote:
      '\u201CWhy are men mentioned and not women?\u201D \u2014 Her question to the Prophet \uFDFA that led to the revelation of Quran 33:35',
  },
  {
    name: "Halima as-Sa'diyya",
    honorific: 'رضي الله عنها',
    era: 'Companion',
    description:
      "The Prophet\u2019s \uFDFA wet nurse who cared for him during his early years in the desert. Despite initial hesitation (she almost passed on taking him because his family was not wealthy), she accepted him \u2014 and her life was blessed from that day. The Prophet \uFDFA honoured her throughout his life, standing for her and spreading his cloak for her to sit on.",
    quote: '',
  },
]

export default function ScholarsPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={GraduationCap}
        title="Inspiring Sisters"
        subtitle="Female Scholars & Role Models"
        gradient="from-violet-950 to-purple-900"
        showBack
        stars
        heroTheme="lectures"
      />

      <div className="space-y-3 px-4 pt-5">
        {/* Intro */}
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Islam has a rich history of remarkable women &mdash; scholars, leaders, and mothers of the Ummah. Their legacy continues to inspire Muslim women across the world.
          </p>
        </div>

        {/* Scholar Cards */}
        {SCHOLARS.map((scholar) => (
          <div
            key={scholar.name}
            className="rounded-2xl border border-border bg-card/50 p-5 space-y-3"
          >
            {/* Name + Honorific */}
            <div>
              <span className="text-lg font-bold text-foreground">{scholar.name}</span>
              {scholar.honorific && (
                <span className="font-arabic text-sm text-violet-400 ml-2">{scholar.honorific}</span>
              )}
            </div>

            {/* Era Badge */}
            <div>
              <span className="inline-block rounded-full px-2.5 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-wider">
                {scholar.era}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">{scholar.description}</p>

            {/* Quote */}
            {scholar.quote && (
              <div className="mt-3 border-l-2 border-violet-500/30 pl-3">
                <p className="text-sm italic text-muted-foreground">{scholar.quote}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
