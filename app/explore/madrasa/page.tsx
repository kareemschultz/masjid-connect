'use client'

import { GraduationCap, BookOpen, Star, Moon, Heart, Users } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const MODULES = [
  {
    icon: Star,
    title: 'Five Pillars of Islam',
    description: 'Shahada, Salah, Zakat, Sawm, and Hajj',
    lessons: 5,
    color: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: BookOpen,
    title: 'Six Articles of Faith',
    description: 'Core beliefs every Muslim should know',
    lessons: 6,
    color: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Moon,
    title: '99 Names of Allah',
    description: 'Al-Asma ul-Husna - The Beautiful Names',
    lessons: 10,
    color: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Heart,
    title: 'Prophet\'s Biography',
    description: 'The life of Prophet Muhammad (PBUH)',
    lessons: 12,
    color: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
  },
  {
    icon: Users,
    title: 'Stories of the Prophets',
    description: 'From Adam to Muhammad (PBUT)',
    lessons: 25,
    color: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
]

export default function MadrasaPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={GraduationCap}
        title="Madrasa"
        subtitle="Islamic Learning"
        gradient="from-indigo-900 to-blue-900"
        showBack
      />

      <div className="space-y-3 px-4 pt-5 animate-stagger">
        {MODULES.map((mod, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${mod.color}`}>
              <mod.icon className={`h-5 w-5 ${mod.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">{mod.title}</h3>
              <p className="mt-0.5 text-xs text-gray-400">{mod.description}</p>
              <p className="mt-1 text-[10px] text-emerald-400">{mod.lessons} lessons</p>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 text-center">
          <p className="text-xs text-gray-400">More learning modules coming soon, InshaAllah</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
