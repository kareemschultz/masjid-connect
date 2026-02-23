'use client'

import { Heart } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

export default function HijabGuidePage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Heart}
        title="Hijab Guide"
        subtitle="Understanding Hijab"
        gradient="from-rose-950 to-pink-900"
        showBack
        stars
      />

      <div className="space-y-4 px-4 pt-5 animate-stagger">
        {/* What is Hijab */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 space-y-4">
          <h2 className="text-base font-bold text-[#f9fafb]">What is Hijab?</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            The word &lsquo;hijab&rsquo; literally means barrier or covering. In Islam, it refers to much more than just a headscarf — it encompasses modesty in dress, speech, gaze, and behaviour for both men and women.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            The obligation of hijab for women is established in the Quran: &ldquo;And tell the believing women to lower their gaze and guard their private parts and not expose their adornment except that which appears thereof and to wrap their headcovers over their chests.&rdquo; (Quran 24:31). And: &ldquo;O Prophet, tell your wives and your daughters and the women of the believers to bring down over themselves their outer garments.&rdquo; (Quran 33:59).
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Sisters wear hijab as an act of worship and obedience to Allah. It is a statement of identity, dignity, and a refusal to be valued by appearance alone. Far from being oppressive, many Muslim women describe it as liberating.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Common misconceptions: &ldquo;Muslim women are forced to wear hijab&rdquo; — in authentic Islamic practice, hijab is a personal commitment between a woman and her Creator. Compulsion contradicts the Quran itself: &ldquo;There is no compulsion in religion.&rdquo; (2:256).
          </p>
        </div>

        {/* Styles of Hijab */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 space-y-4">
          <h2 className="text-base font-bold text-[#f9fafb]">Styles of Hijab</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">1</span>
              <p className="text-sm leading-relaxed text-gray-400">
                <span className="font-semibold text-[#f9fafb]">Simple Hijab</span> — A square or rectangular scarf draped over the head and pinned. The most common and versatile style.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">2</span>
              <p className="text-sm leading-relaxed text-gray-400">
                <span className="font-semibold text-[#f9fafb]">Al-Amira</span> — A two-piece style with a fitted cap and matching tube scarf. Easy to wear, stays in place.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">3</span>
              <p className="text-sm leading-relaxed text-gray-400">
                <span className="font-semibold text-[#f9fafb]">Wrap Style</span> — A long rectangular scarf wrapped around the head. Popular for its elegant appearance.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            There is no single &lsquo;correct&rsquo; style — what matters is that the hair and chest are covered. Choose what works for you, your climate, and your daily life.
          </p>
        </div>

        {/* Encouragement Card */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
          <p className="text-sm leading-relaxed text-gray-400">
            Hijab is between you and Allah. Take your time, make your intention, and seek knowledge. Your hijab journey is yours — don&apos;t compare it to anyone else&apos;s.
          </p>
        </div>

        {/* Note for Reverts */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-[#f9fafb]">For New Muslims</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-400">
            Don&apos;t feel pressured to wear hijab immediately. Many reverts begin gradually. What matters most is your niyyah (intention) and your growing relationship with Allah. Focus on the fundamentals first.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
