'use client'

import { Users, Phone, MapPin, Globe, MessageCircle } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const ORGANISATIONS = [
  {
    name: "Jam'iyyatul Ulamaa Guyana",
    description: 'Fatwa services, Madrasa coordination, Alim welfare, arbitration, and Islamic guidance for the Muslim community in Guyana.',
    address: '79 Sandy Babb St, Kitty, Georgetown',
    phone: '592-685-7800',
    phoneLabel: 'WhatsApp',
    color: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    name: 'CIOG (Central Islamic Organisation of Guyana)',
    description: 'National Muslim body — Zakat distribution, fatwa, Eid announcements, halal certification, and coordination of Islamic affairs nationwide.',
    address: 'Woolford Ave, Georgetown',
    phone: '592-226-2510',
    phoneLabel: 'Call',
    url: 'https://cioggy.org',
    color: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    name: 'GIT (Guyana Islamic Trust)',
    description: 'Islamic education, Madrasa support, community development, and youth programmes.',
    color: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
]

export default function ScholarsPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Users}
        title="Local Scholars"
        subtitle="Guyanese Islamic Organisations"
        gradient="from-violet-950 to-purple-900"
        showBack
        heroTheme="lectures"
      />

      <div className="px-4 pt-4 space-y-3">
        {ORGANISATIONS.map((org) => (
          <div
            key={org.name}
            className="rounded-2xl border border-border bg-card p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${org.color}`}>
                <Users className={`h-5 w-5 ${org.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground">{org.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{org.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {org.address && (
                <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {org.address}
                </div>
              )}
              {org.phone && (
                <a
                  href={org.phoneLabel === 'WhatsApp' ? `https://wa.me/${org.phone.replace(/[^0-9]/g, '')}` : `tel:+${org.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-[10px] font-bold text-emerald-400"
                >
                  {org.phoneLabel === 'WhatsApp' ? <MessageCircle className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
                  {org.phone}
                </a>
              )}
              {org.url && (
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-blue-500/20 px-2.5 py-1.5 text-[10px] font-bold text-blue-400"
                >
                  <Globe className="h-3 w-3" />
                  Website
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Suggest card */}
        <div className="rounded-2xl border border-dashed border-border p-4 text-center">
          <p className="text-xs text-muted-foreground/80">
            To suggest a scholar or organisation for this page, use the <span className="text-muted-foreground font-semibold">Feedback</span> button in Settings.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
