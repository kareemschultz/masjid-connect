'use client'

import { Info, Heart, MapPin, Globe, Mail } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        icon={Info}
        title="About"
        subtitle="MasjidConnect GY"
        gradient="from-emerald-900 to-teal-900"
        showBack
      />

      <div className="px-4 pt-5 space-y-5">
        {/* Logo and description */}
        <div className="flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <Image
            src="/images/logo.jpg"
            alt="MasjidConnect GY"
            width={80}
            height={80}
            className="rounded-2xl"
          />
          <h2 className="mt-4 text-xl font-bold text-foreground">MasjidConnect GY</h2>
          <p className="mt-1 text-sm text-emerald-400">Linking Faith and Community</p>
          <p className="mt-1 text-xs text-gray-500">Version 1.0.0</p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-foreground">Our Mission</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            MasjidConnect GY is dedicated to serving the Muslim community of Georgetown, Guyana. 
            We aim to make daily Islamic practices more accessible, help connect community members 
            with local masjids, and provide tools that strengthen faith and knowledge.
          </p>
        </div>

        {/* Features */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-foreground">Built for Georgetown</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Prayer times are calculated specifically for Georgetown, Guyana (6.8013N, 58.1551W). 
            The masjid directory features local mosques, and the Qibla compass is calibrated 
            for our geographic location. The Zakat calculator uses Guyanese Dollars (GYD).
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
            MasjidConnect GY is a community-driven project built with love for the ummah.
          </p>
        </div>

        {/* Credits */}
        <div className="py-4 text-center">
          <p className="text-xs text-gray-500">
            Built with faith, for the community
          </p>
          <p className="mt-1 text-[10px] text-gray-600">
            Quran API: alquran.cloud | Audio: Islamic Network CDN
          </p>
          <p className="mt-0.5 text-[10px] text-gray-600">
            Prayer Times: Adhan.js Library
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
