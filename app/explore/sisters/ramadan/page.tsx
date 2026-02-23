'use client'

import { Star } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

export default function RamadanForSistersPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero
        icon={Star}
        title="Ramadan for Sisters"
        subtitle="Fasting, Exemptions & Worship"
        gradient="from-amber-950 to-orange-900"
        showBack
        stars
      />

      <div className="space-y-4 px-4 pt-5 animate-stagger">
        {/* Fasting in Ramadan */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
          <h2 className="text-lg font-bold text-[#f9fafb] mb-3">Fasting in Ramadan</h2>
          <ul className="space-y-2 text-sm text-gray-400 leading-relaxed list-disc list-inside">
            <li>Fasting from dawn (Fajr) to sunset (Maghrib) &mdash; no food, drink, or intimate relations</li>
            <li>Exemptions from fasting: pregnancy, breastfeeding, illness, travel, menstruation, elderly/chronic illness</li>
            <li>Making up missed fasts (Qadha): missed days must be made up before the next Ramadan</li>
            <li>Fidyah: for those permanently unable to fast (e.g., chronic illness, elderly), they feed one poor person per missed day instead</li>
          </ul>
        </div>

        {/* Menstruation During Ramadan */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
          <h2 className="text-lg font-bold text-[#f9fafb] mb-3">Menstruation During Ramadan</h2>
          <ul className="space-y-2 text-sm text-gray-400 leading-relaxed list-disc list-inside">
            <li>During haid (menstruation), fasting is not permitted &mdash; missed days must be made up after Ramadan</li>
            <li>She does not pray Salah during this time &mdash; and there is no makeup prayer required. This is a mercy from Allah.</li>
            <li>What she CAN do during haid: make dhikr (remembrance), make dua (supplication), read Quran (most scholars allow it, especially from a device/app), listen to Quran, give charity, cook for others, make istighfar</li>
            <li>On Eid: She fully participates even if she is on her period &mdash; dress up, attend the Eid prayer gathering (without praying), make takbir, give Zakat al-Fitr, celebrate with the community</li>
          </ul>
        </div>

        {/* Tips for Sisters in Ramadan */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
          <h2 className="text-lg font-bold text-[#f9fafb] mb-3">Tips for Sisters in Ramadan</h2>
          <ul className="space-y-2 text-sm text-gray-400 leading-relaxed list-disc list-inside">
            <li>Prepare suhoor (pre-dawn meal) ahead of time &mdash; overnight oats, prepared ingredients, easy options</li>
            <li>Use haid days for extra dua, reflection, and Quran listening &mdash; they are not wasted days</li>
            <li>Make a Ramadan plan: set a Quran reading goal, a charity target, and a daily dhikr schedule</li>
            <li>Rest is ibadah &mdash; do not exhaust yourself. Allah does not burden a soul beyond its capacity (Quran 2:286)</li>
            <li>Involve your children in Ramadan activities &mdash; it builds lasting memories</li>
          </ul>
        </div>

        {/* Laylatul Qadr While in Haid */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h2 className="text-lg font-bold text-[#f9fafb] mb-3">Laylatul Qadr While in Haid</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            A sister who is menstruating during the last ten nights of Ramadan can absolutely still worship and seek Laylatul Qadr (the Night of Decree &mdash; better than 1,000 months).
          </p>
          <p className="text-sm text-gray-400 leading-relaxed mt-2">
            She can make dua, dhikr, read Quran (from a device), make istighfar, give charity, and remember Allah abundantly.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed mt-2">
            Missing the Salah of that night is not a loss &mdash; the exemption is from Allah Himself. He knows your heart and your intention.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
