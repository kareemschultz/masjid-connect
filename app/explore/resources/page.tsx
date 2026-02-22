'use client'

import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { Library, BookOpen, BookText, Languages, Landmark, HandHeart, Baby, MapPin, ExternalLink } from 'lucide-react'

const CATEGORIES = [
  {
    title: 'Online Quran',
    icon: BookOpen,
    color: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    items: [
      { title: 'Quran.com', desc: 'Read, listen, and study the Quran', url: 'https://quran.com' },
      { title: 'Tanzil.net', desc: 'Quran navigator and search engine', url: 'https://tanzil.net' },
      { title: 'QuranReflect', desc: 'Community reflections on Quran', url: 'https://quranreflect.com' },
    ],
  },
  {
    title: 'Hadith Collections',
    icon: BookText,
    color: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    items: [
      { title: 'Sunnah.com', desc: 'Searchable hadith database', url: 'https://sunnah.com' },
      { title: 'Hadith of the Day', desc: 'Daily hadith reminders', url: 'https://ahadith.co.uk' },
    ],
  },
  {
    title: 'Learn Arabic',
    icon: Languages,
    color: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    items: [
      { title: 'Bayyinah TV', desc: 'Arabic and Quran courses by Nouman Ali Khan', url: 'https://bayyinahtv.com' },
      { title: 'Arabic101', desc: 'Free Arabic language courses', url: 'https://arabic101.org' },
    ],
  },
  {
    title: 'Islamic Finance',
    icon: Landmark,
    color: 'bg-teal-500/20',
    iconColor: 'text-teal-400',
    items: [
      { title: 'IslamicFinanceGuru', desc: 'Halal investing guidance', url: 'https://www.islamicfinanceguru.com' },
      { title: 'Manzil', desc: 'Halal mortgage alternative (info)', url: 'https://www.manzil.ca' },
    ],
  },
  {
    title: 'Dua Collections',
    icon: HandHeart,
    color: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    items: [
      { title: 'MyDuaa', desc: 'Curated duas for every occasion', url: 'https://myduaa.com' },
      { title: 'Fortress of the Muslim', desc: 'Hisn al-Muslim full collection', url: 'https://hisnmuslim.com' },
    ],
  },
  {
    title: 'Kids & Family',
    icon: Baby,
    color: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
    items: [
      { title: 'Pillars of Islam Game', desc: 'Interactive learning for children', url: 'https://iqranetwork.com' },
      { title: 'Muslim Kids TV', desc: 'Islamic cartoons and stories', url: 'https://muslimkids.tv' },
    ],
  },
  {
    title: 'Guyana-Specific',
    icon: MapPin,
    color: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
    items: [
      { title: 'CIOG Website', desc: 'Central Islamic Organisation of Guyana', url: 'https://ciog.org.gy' },
      { title: 'Guyana Islamic Trust', desc: 'GIT community information', url: 'https://www.facebook.com/guyanaislamictrust' },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero icon={Library} title="Resources" subtitle="Islamic Learning" gradient="from-sky-900 to-blue-900" showBack />

      <div className="space-y-5 px-4 -mt-2">
        {CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-emerald-500" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{cat.title}</h2>
            </div>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3.5 transition-all active:scale-[0.98] hover:border-gray-700"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cat.color}`}>
                    <cat.icon className={`h-4 w-4 ${cat.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#f9fafb]">{item.title}</div>
                    <div className="text-xs text-gray-400 truncate">{item.desc}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-gray-600" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
