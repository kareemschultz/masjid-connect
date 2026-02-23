'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Heart, CheckCircle, Home, Share2 } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { shareOrCopy } from '@/lib/share'
import Link from 'next/link'

function SuccessContent() {
  useSearchParams() // reads session_id if needed later

  const handleShare = () => {
    shareOrCopy({
      title: 'MasjidConnect GY',
      text: 'Check out MasjidConnect GY — a free Islamic app for the Guyanese Muslim community. Prayer times, Quran, Duas, and more! https://masjidconnectgy.com',
    })
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Heart}
        title="JazakAllah Khayran!"
        subtitle="May Allah accept your generosity"
        gradient="from-emerald-950 to-teal-900"
        heroTheme="zakat"
        showBack
      />

      <div className="space-y-6 px-4 pt-8 text-center">
        {/* Green checkmark */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">Your donation was received.</h2>
          <p className="mt-1 text-2xl text-amber-400/80" dir="rtl">بارك الله فيك</p>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Every dollar helps keep MasjidConnect GY free for the Guyanese Muslim community.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-sm font-bold text-foreground active:scale-[0.98] transition-transform"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-sm font-semibold text-muted-foreground active:scale-[0.98] transition-transform"
          >
            <Share2 className="h-4 w-4" />
            Tell a friend about MasjidConnect GY
          </button>
        </div>

        {/* Dua */}
        <div className="pb-4 pt-4">
          <p className="text-xs text-muted-foreground/60 italic">
            &ldquo;Whoever guides someone to goodness will have a reward like that of the one who does it.&rdquo;
          </p>
          <p className="mt-1 text-[10px] text-gray-700">— Sahih Muslim 1893</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default function SupportSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
