'use client'

import { ShieldAlert, CheckCircle2, XCircle } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const INVALIDATES = [
  'Blood Tests',
  'Injections (Intravenous, Intramuscular, Insulin, Glucose)',
  'Intravenous Drips',
  'Inhalers — Nebuliser (Nasal and Oral)',
  'Steaming (Intentionally)',
  'Lying, Backbiting, Swearing (these are Haraam and diminish reward)',
  'Nose Drops',
  'Smoking',
  'Acupuncture',
  'Ear Drops (when eardrum is perforated)',
  'Suppositories',
  'Masturbation / Ejaculation via physical stimulation',
  'Vomiting intentionally, then swallowing it voluntarily',
  'Tasting food without swallowing (if done unnecessarily)',
]

const DOES_NOT_INVALIDATE = [
  'Inhaling Vicks (no perceptible body), topical application of Vicks',
  'Inhaling smoke or dust unintentionally, smelling food',
  'Eye drops / Surma / Contact lenses',
  'Nose bleed',
  'Cupping, donating blood, or blood transfusion intravenously',
  'Cutting hair, clipping nails',
  'Miswak, dental treatment without swallowing',
  'Toothpaste, mouthwash without swallowing (though Makruh)',
  'Swallowing phlegm',
  'Hand sanitizers, body cream and lotions',
  'Wet dream',
  'Concentrated oxygen without mass-based substances',
  'Covid test (dry object) and vaccine',
  'Forgetfully eating or drinking — stop immediately, fast remains valid',
  'Kissing or touching one\'s spouse (without discharge)',
  'Swallowing own saliva and wetness remaining after washing',
  'Hand and nails treatment (external only)',
]

export default function FactorsAffectingFastPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={ShieldAlert}
        title="Factors Affecting the Fast"
        subtitle="Darul Uloom Masjid East Street"
        gradient="from-red-900 to-orange-900"
        showBack
        heroTheme="ramadan"
      />

      <div className="px-4 pt-5 space-y-4">

        <div className="rounded-2xl border border-orange-800/30 bg-orange-950/20 p-4 text-xs text-orange-300">
          This is a general reference prepared by Darul Uloom/Masjid East Street, Georgetown. For specific situations, consult a reliable Aalim (Islamic scholar). In some instances, a Qadha and Kaffarah will be necessary.
        </div>

        {/* Invalidates */}
        <div className="rounded-2xl border border-red-800/30 bg-card overflow-hidden">
          <div className="flex items-center gap-2 bg-red-950/40 px-5 py-3.5 border-b border-red-800/30">
            <XCircle className="h-4 w-4 text-red-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-400">Invalidates the Fast</h2>
          </div>
          <div className="divide-y divide-border/60">
            {INVALIDATES.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Does NOT Invalidate */}
        <div className="rounded-2xl border border-emerald-800/30 bg-card overflow-hidden">
          <div className="flex items-center gap-2 bg-emerald-950/40 px-5 py-3.5 border-b border-emerald-800/30">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Does NOT Invalidate the Fast</h2>
          </div>
          <div className="divide-y divide-border/60">
            {DOES_NOT_INVALIDATE.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
            Source: Darul Uloom/Masjid Islamic & Academic Institute Inc., 310 East Street, Georgetown. Tel: (592) 223-0579 | darululoomgt@gmail.com. Always consult a qualified Aalim for personal rulings.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
