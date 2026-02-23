'use client'

import { useState } from 'react'
import { Heart, Loader2, Shield } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const PRESETS = [5, 10, 25, 50, 100]

export default function SupportPage() {
  const [selected, setSelected] = useState<number | null>(10)
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCustom = selected === null
  const amountCents = selected !== null
    ? selected * 100
    : custom ? Math.round(parseFloat(custom) * 100) : 0
  const displayAmount = selected !== null
    ? `$${selected}`
    : custom ? `$${parseFloat(custom).toFixed(2)}` : '$0'

  const handleDonate = async () => {
    if (amountCents < 100) {
      setError('Minimum donation is $1')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountCents }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Heart}
        title="Support the App"
        subtitle="Built fisabilillah — for the sake of Allah"
        gradient="from-amber-950 to-yellow-900"
        heroTheme="zakat"
        showBack
      />

      <div className="space-y-5 px-4 pt-5">
        {/* Mission card */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-sm leading-relaxed text-gray-300">
            MasjidConnect GY is a free community app built for the Guyanese Muslim community.
            There are no ads, no subscriptions, no paywalls. Your donation helps cover server
            hosting and keeps the app free for everyone.
          </p>
        </div>

        {/* Amount selector */}
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
            Select Amount
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {PRESETS.map(amt => (
              <button
                key={amt}
                onClick={() => { setSelected(amt); setCustom(''); setError(null) }}
                className={`rounded-2xl border py-4 text-center text-sm font-bold transition-all active:scale-95 ${
                  selected === amt
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                    : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700'
                }`}
              >
                ${amt}
              </button>
            ))}
            <button
              onClick={() => { setSelected(null); setError(null) }}
              className={`rounded-2xl border py-4 text-center text-sm font-bold transition-all active:scale-95 ${
                isCustom
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                  : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom amount input */}
          {isCustom && (
            <div className="mt-3 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-emerald-400">$</span>
              <input
                type="number"
                min="1"
                max="10000"
                step="0.01"
                value={custom}
                onChange={e => { setCustom(e.target.value); setError(null) }}
                placeholder="Enter amount"
                autoFocus
                className="w-full rounded-2xl border border-gray-700 bg-gray-900 py-4 pl-10 pr-4 text-lg font-bold text-white placeholder-gray-600 outline-none focus:border-emerald-500/50"
              />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Donate button */}
        <button
          onClick={handleDonate}
          disabled={loading || amountCents < 100}
          className="w-full rounded-2xl bg-emerald-500 py-4 text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Redirecting to Stripe…
            </span>
          ) : (
            `Donate ${displayAmount} — JazakAllah Khayran`
          )}
        </button>

        {/* Stripe note */}
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Shield className="h-3.5 w-3.5" />
          <span className="text-xs">Secure payment by Stripe</span>
        </div>

        {/* Transparency */}
        <p className="text-center text-[11px] leading-relaxed text-gray-600">
          100% of donations go toward server hosting costs. MasjidConnect GY is a non-profit
          community project. No salaries are paid from donations.
        </p>

        {/* Dua */}
        <div className="pb-4 text-center">
          <p className="text-2xl leading-loose text-amber-400/80" dir="rtl">
            بارك الله فيك
          </p>
          <p className="mt-1 text-xs text-gray-500 italic">
            &ldquo;May Allah bless you.&rdquo;
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
