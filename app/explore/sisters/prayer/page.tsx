'use client'

import { useState } from 'react'
import { Moon, ChevronDown } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

const sections = [
  {
    title: 'Clothing & Awrah',
    content:
      'Women must cover their entire body during prayer except for the face and hands. This includes loose clothing that does not reveal the shape of the body. A prayer garment (khimar or prayer dress) is commonly used.',
  },
  {
    title: 'Voice in Prayer',
    content:
      'When praying alone, women pray quietly — they do not recite aloud during Fajr, Maghrib, or Isha as men do. However, when leading other women in prayer, a woman may recite aloud.',
  },
  {
    title: 'Position in Ruku (Bowing)',
    content:
      'Women bring their arms closer to the body during ruku, rather than spreading them wide. The hands are placed on the knees, and the back is straight.',
  },
  {
    title: 'Position in Sujood (Prostration)',
    content:
      'Women keep the body more compact during prostration — arms close to the sides and the stomach closer to the thighs. This differs from men who spread their arms away from the body.',
  },
  {
    title: 'Leading Prayer (Imamah)',
    content:
      'Women can lead other women in prayer. When she does, she stands in the middle of the first row (not in front of the row as a male imam would). She does not need to stand in front.',
  },
  {
    title: 'Friday Prayer (Jumu\'ah)',
    content:
      'Jumu\'ah (Friday congregational prayer) is not obligatory for women, though they are welcome and encouraged to attend. If a woman attends, she prays with the congregation and listens to the khutbah.',
  },
  {
    title: 'Menstruation (Haid)',
    content:
      'During menstruation, a woman does not pray Salah and does not fast. This is a mercy — there is no sin and no makeup prayer required. She may continue all other ibadah: making dhikr, dua, reading/listening to Quran, and giving charity.',
  },
  {
    title: 'Praying at Home',
    content:
      'Women receive the full reward for praying at home. The Prophet \uFDFA said the best prayer for a woman is in her home. Attending the masjid is permissible and encouraged, but it is entirely her choice.',
  },
]

export default function WomenPrayerPage() {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Moon}
        title="Women in Prayer"
        subtitle="How Salah Differs for Sisters"
        gradient="from-purple-950 to-violet-900"
        showBack
        stars
      />

      <div className="space-y-3 px-4 pt-5 animate-stagger">
        {/* Intro Card */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4">
          <p className="text-sm leading-relaxed text-gray-400">
            The core of Salah is the same for men and women. The differences below are based on the majority scholarly position. For the full step-by-step guide:
          </p>
          <Link href="/explore/madrasa/salah" className="mt-2 inline-block text-sm font-medium text-purple-400">
            View Full Prayer Guide &rarr;
          </Link>
        </div>

        {/* Expandable Cards */}
        {sections.map((section, index) => {
          const isOpen = openIndex === index

          return (
            <div
              key={section.title}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="rounded-2xl border border-gray-800 bg-gray-900/50 cursor-pointer transition-all"
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-[#f9fafb] ml-3">{section.title}</h3>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Expandable Content */}
              <div
                className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 text-sm text-gray-400 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          )
        })}

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          These rulings are based on the majority scholarly position across the four madhahib (Shafi&apos;i, Hanbali, Hanafi, Maliki).
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
