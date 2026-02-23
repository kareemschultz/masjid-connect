'use client'

import { useState } from 'react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem, KEYS } from '@/lib/storage'
import { MessageSquarePlus, Star, Send, CheckCircle2 } from 'lucide-react'

const CATEGORIES = ['Request New Masjid', 'Report Masjid Error', 'Bug Report', 'Feature Request', 'General Feedback', 'Community Suggestion']

export default function FeedbackPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(() => getItem(KEYS.APP_RATING, 0))
  const [submitted, setSubmitted] = useState(false)
  const [masjidName, setMasjidName] = useState('')
  const [masjidLocation, setMasjidLocation] = useState('')
  const [masjidContact, setMasjidContact] = useState('')
  const [whichMasjid, setWhichMasjid] = useState('')
  const [correction, setCorrection] = useState('')

  const isDisabled = category === 'Request New Masjid'
    ? !masjidName.trim()
    : category === 'Report Masjid Error'
    ? (!whichMasjid.trim() || !correction.trim())
    : !message.trim()

  const handleSubmit = () => {
    if (isDisabled) return
    const entry = {
      name, email, category, message, rating,
      ...(category === 'Request New Masjid' ? { masjidName, masjidLocation, masjidContact } : {}),
      ...(category === 'Report Masjid Error' ? { whichMasjid, correction } : {}),
      date: new Date().toISOString(),
    }
    const existing = getItem<Array<typeof entry>>(KEYS.FEEDBACK_LOG, [])
    setItem(KEYS.FEEDBACK_LOG, [...existing, entry])
    setItem(KEYS.APP_RATING, rating)
    // TODO: POST to /api/feedback when backend is ready
    setSubmitted(true)
  }

  const handleRating = (star: number) => {
    setRating(star)
    setItem(KEYS.APP_RATING, star)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0b14] pb-nav">
        <PageHero icon={MessageSquarePlus} title="Feedback" subtitle="Your Voice Matters" gradient="from-rose-900 to-pink-900" showBack />
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-[#f9fafb]">Jazakallahu Khairan!</h2>
          <p className="mt-2 text-sm text-gray-400">Your feedback has been recorded. May Allah reward you for helping improve the app for the community.</p>
          <button onClick={() => { setSubmitted(false); setMessage(''); setMasjidName(''); setWhichMasjid(''); setCorrection('') }} className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white active:scale-95 transition-transform">
            Send More Feedback
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero icon={MessageSquarePlus} title="Send Feedback" subtitle="Your Voice Matters" gradient="from-rose-900 to-pink-900" showBack />

      <div className="space-y-4 px-4 -mt-2">
        {/* Rating */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Rate the App</div>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => handleRating(s)} className="transition-transform active:scale-90" aria-label={`Rate ${s} stars`}>
                <Star className={`h-8 w-8 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-700'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Helper note */}
        <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 px-4 py-3">
          <p className="text-xs text-teal-300">To request a masjid or report an error, select the appropriate category below.</p>
        </div>

        {/* Form */}
        <div className="space-y-3 rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Name (optional)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Email (optional)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${category === c ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>{c}</button>
              ))}
            </div>
          </div>

          {/* Request New Masjid fields */}
          {category === 'Request New Masjid' && (
            <div className="space-y-3 rounded-xl border border-gray-800 bg-gray-800/30 p-3">
              <div>
                <label className="mb-1 block text-xs text-gray-400">Masjid Name *</label>
                <input value={masjidName} onChange={(e) => setMasjidName(e.target.value)} placeholder="Name of the masjid" className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Approximate Location / Area</label>
                <input value={masjidLocation} onChange={(e) => setMasjidLocation(e.target.value)} placeholder="e.g. Queenstown, Georgetown" className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Contact (optional)</label>
                <input value={masjidContact} onChange={(e) => setMasjidContact(e.target.value)} placeholder="Phone or email" className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50" />
              </div>
            </div>
          )}

          {/* Report Masjid Error fields */}
          {category === 'Report Masjid Error' && (
            <div className="space-y-3 rounded-xl border border-gray-800 bg-gray-800/30 p-3">
              <div>
                <label className="mb-1 block text-xs text-gray-400">Which Masjid? *</label>
                <input value={whichMasjid} onChange={(e) => setWhichMasjid(e.target.value)} placeholder="Name of the masjid" className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">What needs correcting? *</label>
                <textarea value={correction} onChange={(e) => setCorrection(e.target.value)} placeholder="Describe the error..." rows={3} className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50 resize-none" />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs text-gray-400">
              {category === 'Request New Masjid' || category === 'Report Masjid Error' ? 'Additional Notes (optional)' : 'Message *'}
            </label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you think..." rows={4} className="w-full rounded-xl border border-gray-800 bg-gray-800/50 px-3 py-2.5 text-sm text-[#f9fafb] placeholder-gray-600 outline-none focus:border-emerald-500/50 resize-none" />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={isDisabled} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100">
          <Send className="h-4 w-4" /> Submit Feedback
        </button>
      </div>
      <BottomNav />
    </div>
  )
}
