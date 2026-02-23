'use client'

import { HelpCircle, AlertCircle, CheckCircle2, Coins } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const fmtGYD = (n: number) => `$${n.toLocaleString()} GYD`

const FIDYA_GYD = 60_000
const SADAQATUL_FITR_GYD = 2_000

export default function FidyaGuidePage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={HelpCircle}
        title="Fidya & Missed Fasts"
        subtitle="Darul Uloom Masjid East Street"
        gradient="from-amber-900 to-orange-900"
        showBack
        heroTheme="zakat"
      />

      <div className="px-4 pt-5 space-y-4">

        {/* 2026 values */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-800/30 bg-amber-950/20 p-4 text-center">
            <p className="text-[10px] text-amber-400/70 uppercase tracking-widest">Fidya per Fast</p>
            <p className="mt-1 text-xl font-bold text-amber-400">{fmtGYD(FIDYA_GYD)}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/80">2026 — Darul Uloom</p>
          </div>
          <div className="rounded-2xl border border-emerald-800/30 bg-emerald-950/20 p-4 text-center">
            <p className="text-[10px] text-emerald-400/70 uppercase tracking-widest">Sadaqatul Fitr</p>
            <p className="mt-1 text-xl font-bold text-emerald-400">{fmtGYD(SADAQATUL_FITR_GYD)}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/80">per person — 2026</p>
          </div>
        </div>

        {/* Who is exempt */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/40">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Who May Be Exempt from Fasting</h2>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Old Age / Chronic Illness (no recovery expected)</p>
                <p className="text-muted-foreground text-xs mt-1">If genuinely unable to fast and there is no hope of recovery, pay Fidya for each fast missed. No Qadha is required.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Illness (expected to recover)</p>
                <p className="text-muted-foreground text-xs mt-1">Must make Qadha (make-up fasts) when recovered. Fidya is NOT sufficient. If able, make Qadha during winter when days are shorter.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Pregnant / Breastfeeding Women</p>
                <p className="text-muted-foreground text-xs mt-1">Exempt only if fasting is harmful to the child. Must make Qadha later — NOT Fidya. Fidya is only for those who permanently cannot fast.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fidya rules */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">Rules of Fidya</h2>
          <div className="space-y-2.5 text-sm text-muted-foreground">
            {[
              'Fidya = same as Sadaqatul Fitr: 1.75 kg wheat OR 3.5 kg barley, or their cash equivalent',
              'Can be given in cash or in kind',
              'Can only be given to Muslims who are eligible for Zakah',
              'It is permissible to give Fidya for multiple fasts to one person',
              'It is permissible to divide the Fidya amount among multiple people',
              'NOT permissible to give Fidya before Ramadan commences',
              'Fidya for the entire month may be given after Ramadan has started',
              'Fidya for past years is calculated at the current year\'s value',
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                <p>{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sadaqatul Fitr */}
        <div className="rounded-2xl border border-emerald-800/30 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="h-4 w-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Sadaqatul Fitr (Zakat al-Fitr)</h2>
          </div>
          <div className="space-y-2.5 text-sm text-muted-foreground">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Amount per person (2026)</span>
              <span className="font-bold text-emerald-400">{fmtGYD(SADAQATUL_FITR_GYD)}</span>
            </div>
            {[
              'Obligatory on every Muslim who can afford it',
              'Given on behalf of every member of the household',
              'Must be paid BEFORE Eid prayer — ideally 1-2 days before Eid',
              'Can be given in cash or food equivalent',
              'Given to Muslims eligible for Zakah',
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <p>{rule}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
            Values and rulings prepared by Maulana Badrudeen Khan & Mufti Irfan Qasmi — Darul Uloom/Masjid East Street, Georgetown (Feb 2026). For personal rulings, consult your local Aalim.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
