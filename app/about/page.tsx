'use client'

import { Info, Heart, MapPin, Globe, Mail, Shield } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero icon={Info} title="About" subtitle="MasjidConnect GY" gradient="from-emerald-900 to-teal-900" showBack heroTheme="masjid" />

      <div className="px-4 pt-5 space-y-5">
        {/* Logo and description */}
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8">
          <Image src="/images/logo.jpg" alt="MasjidConnect GY" width={80} height={80} className="rounded-2xl" />
          <h2 className="mt-4 text-xl font-bold text-foreground">MasjidConnect GY</h2>
          <p className="mt-1 text-sm text-emerald-400">Linking Faith and Community</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Georgetown, Guyana</p>
          <span className="mt-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400">v2.20.0</span>
        </div>

        {/* Fisabilillah */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 to-teal-950/60 p-5 text-center">
          <p className="font-arabic text-3xl text-emerald-300 leading-loose">فِي سَبِيلِ اللَّهِ</p>
          <p className="mt-1 text-sm font-semibold text-emerald-400">Fisabilillah — For the sake of Allah</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This app is built as an act of worship and sadaqah — free, forever, with no ads, no subscriptions, and no profit motive. Every line of code is an intention to serve the Guyanese Muslim community for the pleasure of Allah alone.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80 font-arabic">
            مَنْ كَانَ يُرِيدُ حَرْثَ الْآخِرَةِ نَزِدْ لَهُ فِي حَرْثِهِ
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground/60 italic">
            "Whoever desires the harvest of the Hereafter — We increase for him his harvest." — Quran 42:20
          </p>
        </div>

        {/* Independence Statement */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-foreground">Independent & Community-Driven</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            MasjidConnect GY is a free, independent Islamic companion app built by the Muslim community of Georgetown, Guyana. No ads. No data collection. No affiliations. Just faith.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
            This app is not affiliated with, endorsed by, or connected to any Islamic organization in Guyana (including CIOG, GIT, or any masjid board). It is built by the community, for the community.
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-foreground">Our Mission</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Free Islamic companion for every Muslim in Guyana. We aim to make daily Islamic practices more accessible, help connect community members with local masjids, and provide tools that strengthen faith and knowledge.
          </p>
        </div>

        {/* Built for Georgetown */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-foreground">Built for Georgetown</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Prayer times are calculated specifically for Georgetown, Guyana (6.8013N, 58.1551W). The masjid directory features local mosques, and the Qibla compass is calibrated for our geographic location. The Zakat calculator uses Guyanese Dollars (GYD).
          </p>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-foreground">Get in Touch</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Have feedback, suggestions, or want to contribute? We would love to hear from you.
          </p>
          <Link href="/feedback" className="mt-3 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-foreground active:scale-95 transition-transform">
            Send Feedback
          </Link>
        </div>

        {/* Credits */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-foreground">Credits</h3>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground/80">
            <p>Quran API: alquran.cloud</p>
            <p>Audio: Islamic Network CDN</p>
            <p>Prayer Times: Adhan.js Library</p>
          </div>
        </div>

        <div className="py-4 text-center space-y-1">
          <p className="text-[11px] text-emerald-600 font-medium">بُنِيَ فِي سَبِيلِ اللَّهِ</p>
          <p className="text-[10px] text-muted-foreground/60">Built fisabilillah — for the sake of Allah</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
