'use client'

import { Info, Heart, MapPin, Globe, Mail, Shield } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero icon={Info} title="About" subtitle="MasjidConnect GY" gradient="from-emerald-900 to-teal-900" showBack />

      <div className="px-4 pt-5 space-y-5">
        {/* Logo and description */}
        <div className="flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <Image src="/images/logo.jpg" alt="MasjidConnect GY" width={80} height={80} className="rounded-2xl" />
          <h2 className="mt-4 text-xl font-bold text-foreground">MasjidConnect GY</h2>
          <p className="mt-1 text-sm text-emerald-400">Linking Faith and Community</p>
          <p className="mt-0.5 text-[11px] text-gray-400">Georgetown, Guyana</p>
          <span className="mt-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400">v1.0.0</span>
        </div>

        {/* Independence Statement */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-foreground">Independent & Community-Driven</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            MasjidConnect GY is a free, independent Islamic companion app built by the Muslim community of Georgetown, Guyana. No ads. No data collection. No affiliations. Just faith.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-500">
            This app is not affiliated with, endorsed by, or connected to any Islamic organization in Guyana (including CIOG, GIT, or any masjid board). It is built by the community, for the community.
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-foreground">Our Mission</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Free Islamic companion for every Muslim in Guyana. We aim to make daily Islamic practices more accessible, help connect community members with local masjids, and provide tools that strengthen faith and knowledge.
          </p>
        </div>

        {/* Built for Georgetown */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-foreground">Built for Georgetown</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Prayer times are calculated specifically for Georgetown, Guyana (6.8013N, 58.1551W). The masjid directory features local mosques, and the Qibla compass is calibrated for our geographic location. The Zakat calculator uses Guyanese Dollars (GYD).
          </p>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-foreground">Get in Touch</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Have feedback, suggestions, or want to contribute? We would love to hear from you.
          </p>
          <Link href="/feedback" className="mt-3 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white active:scale-95 transition-transform">
            Send Feedback
          </Link>
        </div>

        {/* Credits */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-foreground">Credits</h3>
          </div>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Quran API: alquran.cloud</p>
            <p>Audio: Islamic Network CDN</p>
            <p>Prayer Times: Adhan.js Library</p>
          </div>
        </div>

        <div className="py-4 text-center">
          <p className="text-[10px] text-gray-600">Built with faith, for the community</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
