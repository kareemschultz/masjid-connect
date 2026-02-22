'use client'

import Link from 'next/link'
import { GraduationCap, BookOpen, Star, Moon, Heart, Users, Lock, ChevronRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const FUTURE_MODULES = [
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
    title: "Prophet's Biography",
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
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero
        icon={GraduationCap}
        title="Madrasa"
        subtitle="Islamic Learning"
        gradient="from-indigo-900 to-blue-900"
        showBack
      />

      <div className="space-y-3 px-4 pt-5 animate-stagger">
        {/* ── Noorani Qaida — primary CTA ─────────────────────────────── */}
        <Link href="/explore/madrasa/qaida" className="block">
          <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-teal-500/5 p-5 transition-transform active:scale-[0.98]">
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-500/20">
                <BookOpen className="h-6 w-6 text-teal-400" />
              </div>

              <div className="flex-1">
                <p className="font-arabic text-lg text-teal-300 leading-relaxed">
                  القاعدة النورانية
                </p>
                <h3 className="text-base font-bold text-[#f9fafb]">Noorani Qaida</h3>
                <p className="mt-1 text-xs text-gray-400">
                  Learn Arabic Letters &amp; Tajweed Rules
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-teal-400">
                    12 Lessons
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* ── Learn to Pray ────────────────────────────────────────────── */}
        <Link href="/explore/madrasa/salah" className="relative block overflow-hidden rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 active:bg-purple-500/10 transition-colors">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20">
              <GraduationCap className="h-6 w-6 text-purple-400" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-base font-bold text-[#f9fafb]">Learn to Pray</h3>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-400">NEW</span>
              </div>
              <p className="text-xs text-gray-400">
                Wudu steps + complete Salah guide with Arabic, transliteration & prayer position icons
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-purple-400 font-semibold">
                Start learning <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </Link>

        {/* ── Section label ──────────────────────────────────────────── */}
        <div className="pt-2 pb-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
            More Modules
          </h2>
        </div>

        {/* ── Future modules (locked) ────────────────────────────────── */}
        {FUTURE_MODULES.map((mod, i) => (
          <div
            key={i}
            className="relative flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 opacity-60"
          >
            {/* Lock overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-end rounded-2xl pr-4">
              <Lock className="h-4 w-4 text-gray-600" />
            </div>

            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${mod.color}`}>
              <mod.icon className={`h-5 w-5 ${mod.iconColor}`} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#f9fafb]">{mod.title}</h3>
                <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[9px] font-semibold text-gray-500">
                  Coming Soon
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-400">{mod.description}</p>
              <p className="mt-1 text-[10px] text-gray-500">{mod.lessons} lessons</p>
            </div>
          </div>
        ))}

        {/* ── Footer note ────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 text-center">
          <p className="text-xs text-gray-400">More learning modules coming soon, InshaAllah</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
