'use client'

import { useState, useEffect } from 'react'
import { Heart, Send } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'

interface DuaRequest {
  id: string
  name: string
  text: string
  anonymous: boolean
  ameen: number
  createdAt: number
}

const SAMPLE_DUAS: DuaRequest[] = [
  {
    id: 'sample-1',
    name: 'Brother Yusuf',
    text: 'Please make dua for the ummah in Gaza. May Allah grant them patience and victory.',
    anonymous: false,
    ameen: 47,
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'sample-2',
    name: '',
    text: 'My mother is unwell, please remember her in your duas.',
    anonymous: true,
    ameen: 32,
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'sample-3',
    name: 'Sister Aisha',
    text: 'Pray that Allah makes this Ramadan our best yet, and accepts our fasting.',
    anonymous: false,
    ameen: 61,
    createdAt: Date.now() - 3600000 * 8,
  },
  {
    id: 'sample-4',
    name: '',
    text: 'Make dua for the youth of Guyana to stay on the straight path.',
    anonymous: true,
    ameen: 28,
    createdAt: Date.now() - 3600000 * 12,
  },
]

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function DuaBoardPage() {
  const [duas, setDuas] = useState<DuaRequest[]>([])
  const [reactions, setReactions] = useState<Record<string, boolean>>({})
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  useEffect(() => {
    const stored = getItem<DuaRequest[]>('dua_board', [])
    setDuas(stored.length > 0 ? stored : SAMPLE_DUAS)
    setReactions(getItem<Record<string, boolean>>('dua_reactions', {}))
  }, [])

  const submitDua = () => {
    if (!text.trim()) return
    const newDua: DuaRequest = {
      id: Date.now().toString(),
      name: anonymous ? '' : name.trim(),
      text: text.trim(),
      anonymous,
      ameen: 0,
      createdAt: Date.now(),
    }
    const updated = [newDua, ...duas]
    setDuas(updated)
    setItem('dua_board', updated)
    setText('')
    setName('')
  }

  const toggleAmeen = (id: string) => {
    const alreadyReacted = reactions[id]
    const newReactions = { ...reactions, [id]: !alreadyReacted }
    setReactions(newReactions)
    setItem('dua_reactions', newReactions)

    setDuas((prev) => {
      const updated = prev.map((d) =>
        d.id === id
          ? { ...d, ameen: d.ameen + (alreadyReacted ? -1 : 1) }
          : d
      )
      setItem('dua_board', updated)
      return updated
    })
  }

  const getInitials = (dua: DuaRequest) => {
    if (dua.anonymous || !dua.name) return '?'
    return dua.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero
        icon={Heart}
        title="Dua Board"
        subtitle="Ask, Share, Say Ameen"
        gradient="from-purple-900 to-violet-900"
        showBack
      />

      <div className="px-4 pt-5 -mt-2 space-y-4">
        {/* Submit Form */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-3">
          <input
            type="text"
            placeholder="Your name or Anonymous"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={anonymous}
            className="w-full rounded-xl border border-gray-800 bg-[#0a0b14] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50 disabled:opacity-40"
          />
          <div className="relative">
            <textarea
              placeholder="Share your dua request..."
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 200))}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-800 bg-[#0a0b14] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50"
            />
            <span className="absolute bottom-2 right-3 text-[10px] text-gray-600">
              {text.length}/200
            </span>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-gray-700 bg-gray-800 accent-purple-500"
              />
              Post anonymously
            </label>
            <button
              onClick={submitDua}
              disabled={!text.trim()}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              Submit
            </button>
          </div>
        </div>

        {/* Dua Requests */}
        <div className="space-y-3 animate-stagger">
          {duas.map((dua) => (
            <div
              key={dua.id}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-4"
            >
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-sm font-bold text-purple-400">
                  {getInitials(dua)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {dua.anonymous || !dua.name ? 'Anonymous' : dua.name}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {timeAgo(dua.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-300">
                    {dua.text}
                  </p>
                  <div className="mt-3 flex items-center">
                    <button
                      onClick={() => toggleAmeen(dua.id)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                        reactions[dua.id]
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      <span className="text-base">{'\u0622\u0645\u064A\u0646'}</span>
                      <span className="text-xs text-gray-500">{dua.ameen}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
