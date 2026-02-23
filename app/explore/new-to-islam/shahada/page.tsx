'use client'

import { Star } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

export default function ShahadaPage() {
  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Star}
        title="The Shahada"
        subtitle="Declaration of Faith"
        gradient="from-emerald-950 to-teal-900"
        showBack
        stars
        heroTheme="prayer"
      />

      <div className="space-y-4 px-4 pt-5 animate-stagger">
        {/* Main Shahada Card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <p className="font-arabic text-3xl text-center leading-relaxed text-emerald-300" dir="rtl">
            أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ
          </p>
          <p className="mt-4 text-sm italic text-muted-foreground text-center">
            Ash-hadu an l&#257; il&#257;ha ill&#257;-ll&#257;hu wa ash-hadu anna Mu&#7717;ammadan ras&#363;lu-ll&#257;h
          </p>
          <p className="mt-3 text-sm text-foreground text-center">
            &ldquo;I bear witness that there is no god but Allah, and I bear witness that Muhammad is the messenger of Allah.&rdquo;
          </p>
        </div>

        {/* What It Means */}
        <div className="rounded-2xl border border-border bg-card/50 p-5 space-y-4">
          <h2 className="text-base font-bold text-foreground">What It Means</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The Shahada is built on two core beliefs: <span className="text-emerald-400 font-semibold">Tawheed</span> — the absolute oneness of Allah. There is no god worthy of worship except Him. He has no partners, no children, and nothing is like Him.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            And second, accepting Muhammad &#xFDFA; as the final messenger sent to all of humanity, completing the line of prophets from Adam to Jesus (Isa) peace be upon them all.
          </p>
        </div>

        {/* How to Take Your Shahada */}
        <div className="rounded-2xl border border-border bg-card/50 p-5 space-y-4">
          <h2 className="text-base font-bold text-foreground">How to Take Your Shahada</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">1</span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Believe it sincerely in your heart</span> — this is the most important part.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">2</span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Say the words with intention (niyyah)</span> — in Arabic if possible, though understanding matters most.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">3</span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">It is recommended (not required) to take your Shahada in the presence of witnesses at a masjid.</span> Contact any imam in Georgetown — they will be honoured to assist you.
              </p>
            </div>
          </div>
        </div>

        {/* What Changes After Shahada */}
        <div className="rounded-2xl border border-border bg-card/50 p-5 space-y-4">
          <h2 className="text-base font-bold text-foreground">What Changes After Shahada</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The moment you take your Shahada, you are Muslim. All of your previous sins are completely forgiven. You begin with a clean slate — as pure as the day you were born.
          </p>

          {/* Hadith Card */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-sm italic text-emerald-300">
              &ldquo;Islam wipes out whatever came before it.&rdquo;
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80">— The Prophet &#xFDFA;, Sahih Muslim</p>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            There is no baptism, no ceremony, and no waiting period. The Shahada is between you and Allah.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
