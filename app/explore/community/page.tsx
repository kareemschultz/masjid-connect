'use client'

import { Users2, Heart, BookOpen, MapPin, Store, MessageCircle, ChevronRight, Building2, Phone, Mail, Globe } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

const FEATURES = [
  {
    icon: Heart,
    label: 'Community Dua Board',
    description: 'Ask, share & say Ameen together',
    href: '/explore/community/dua-board',
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15',
  },
  {
    icon: BookOpen,
    label: 'Quran Khatam Collective',
    description: 'Complete the Quran together',
    href: '/explore/community/khatam',
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
  },
  {
    icon: MapPin,
    label: 'Masjid Check-in',
    description: 'Find masjids near you',
    href: '/masjids',
    color: 'from-teal-500/20 to-teal-600/10',
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/15',
  },
  {
    icon: Store,
    label: 'Halal Business Directory',
    description: 'Halal businesses in Guyana',
    href: '/explore/community/halal',
    color: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
  },
  {
    icon: MessageCircle,
    label: 'Community Feed',
    description: 'Connect with Muslims in GY',
    href: '/explore/community/feed',
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/15',
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Users2}
        title="Community"
        subtitle="Connect with Muslims in GY"
        gradient="from-violet-900 to-purple-900"
        showBack
        heroTheme="community"
      />

      <div data-tour="community-features" className="px-4 pt-5 -mt-2 space-y-3 animate-stagger">
        {FEATURES.map((feature) => (
          <Link
            key={feature.label}
            href={feature.href}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all active:scale-[0.98]"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${feature.iconBg}`}>
              <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground">{feature.label}</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{feature.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/60" />
          </Link>
        ))}
      </div>

      {/* ── Local Islamic Organisations ── */}
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 mb-3 px-1">
          Local Islamic Organisations
        </h2>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15">
              <Building2 className="h-6 w-6 text-violet-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground leading-tight">
                Jam&apos;iyyatul &apos;Ulamaa
              </h3>
              <p className="text-[11px] text-violet-400 font-medium">Guyana Muslim Scholars Association</p>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                Serving the Muslim community through Fatwa &amp; Irshad, Madrassah development, Alim welfare, and family mediation.
                Founded on the principles of Ahlus Sunnah wal Jamaa&apos;ah.
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span>79 Sandy Babb Street, Georgetown, Guyana</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <a href="tel:+5926857800" className="hover:text-foreground transition-colors">592-685-7800</a>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <a href="mailto:jamiyyatulamaa@gmail.com" className="hover:text-foreground transition-colors">jamiyyatulamaa@gmail.com</a>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span>Guyana Muslim Scholars Association on Facebook</span>
            </div>
          </div>

          {/* Departments */}
          <div className="pt-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80 mb-2">Departments</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Fatwa & Irshad', desc: 'Islamic rulings & guidance' },
                { name: 'Makaatib', desc: 'Madrassah development' },
                { name: 'Alim Welfare', desc: 'Scholar support & training' },
                { name: 'Tahkim', desc: 'Mediation & counseling' },
              ].map((dept) => (
                <div key={dept.name} className="rounded-xl bg-secondary/50 px-3 py-2">
                  <p className="text-[11px] font-semibold text-muted-foreground">{dept.name}</p>
                  <p className="text-[10px] text-muted-foreground/80">{dept.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
