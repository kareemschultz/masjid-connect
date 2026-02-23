'use client'

import { useState, useEffect } from 'react'
import { Heart, Send } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'

interface DuaRequest {
  id: string | number
  name: string
  text: string
  anonymous: boolean
  ameen: number
  createdAt: number
}

const SAMPLE_DUAS: DuaRequest[] = [
  { id: 'sample-1', name: 'Brother Yusuf', text: 'Please make dua for the ummah in Gaza. May Allah grant them patience and victory.', anonymous: false, ameen: 47, createdAt: Date.now() - 3600000 * 2 },
  { id: 'sample-2', name: '', text: 'My mother is unwell, please remember her in your duas.', anonymous: true, ameen: 32, createdAt: Date.now() - 3600000 * 5 },
  { id: 'sample-3', name: 'Sister Aisha', text: 'Pray that Allah makes this Ramadan our best yet, and accepts our fasting.', anonymous: false, ameen: 61, createdAt: Date.now() - 3600000 * 8 },
  { id: 'sample-4', name: '', text: 'Make dua for the youth of Guyana to stay on the straight path.', anonymous: true, ameen: 28, createdAt: Date.now() - 3600000 * 12 },
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

function normalizeRow(row: any): DuaRequest {
  return {
    id: row.id,
    name: row.name || '',
    text: row.message || row.text || '',
    anonymous: row.anonymous || false,
    ameen: row.ameen_count ?? row.ameen ?? 0,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : (row.createdAt || Date.now()),
  }
}

export default function DuaBoardPage() {
  const [duas, setDuas] = useState<DuaRequest[]>([])
  const [reactions, setReactions] = useState<Record<string, boolean>>({})
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  useEffect(() => {
    fetch('/api/community/dua-board')
      .then((res) => (res.ok ? res.json() : null))
      .then((rows) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setDuas(rows.map(normalizeRow))
        } else {
          const stored = getItem<DuaRequest[]>('dua_board', [])
          setDuas(stored.length > 0 ? stored : SAMPLE_DUAS)
        }
      })
      .catch(() => {
        const stored = getItem<DuaRequest[]>('dua_board', [])
        setDuas(stored.length > 0 ? stored : SAMPLE_DUAS)
      })
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

    fetch('/api/community/dua-board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: anonymous ? '' : name.trim(), message: text.trim(), anonymous }),
    }).catch(() => {})
  }

  const toggleAmeen = (id: string | number) => {
    const key = String(id)
    const alreadyReacted = reactions[key]
    const newReactions = { ...reactions, [key]: !alreadyReacted }
    setReactions(newReactions)
    setItem('dua_reactions', newReactions)

    setDuas((prev) => {
      const updated = prev.map((d) =>
        String(d.id) === key ? { ...d, ameen: d.ameen + (alreadyReacted ? -1 : 1) } : d
      )
      setItem('dua_board', updated)
      return updated
    })

    if (!alreadyReacted) {
      fetch('/api/community/dua-board/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id }),
      }).catch(() => {})
    }
  }

  const getInitials = (dua: DuaRequest) => {
    if (dua.anonymous || !dua.name) return '?'
    return dua.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero icon={Heart} title="Dua Board" subtitle="Ask, Share, Say Ameen" gradient="from-purple-900 to-violet-900" showBack heroTheme="duas" />

      <div className="px-4 pt-5 -mt-2 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <input type="text" placeholder="Your name or Anonymous" value={name} onChange={(e) => setName(e.target.value)} disabled={anonymous} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-purple-500/50 disabled:opacity-40" />
          <div className="relative">
            <textarea placeholder="Share your dua request..." value={text} onChange={(e) => setText(e.target.value.slice(0, 200))} rows={3} className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-purple-500/50" />
            <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/60">{text.length}/200</span>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="h-4 w-4 rounded border-border bg-secondary accent-purple-500" />
              Post anonymously
            </label>
            <button onClick={submitDua} disabled={!text.trim()} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-foreground transition-all active:scale-95 disabled:opacity-40">
              <Send className="h-4 w-4" />
              Submit
            </button>
          </div>
        </div>

        <div className="space-y-3 animate-stagger">
          {duas.map((dua) => (
            <div key={dua.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-sm font-bold text-purple-400">{getInitials(dua)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{dua.anonymous || !dua.name ? 'Anonymous' : dua.name}</span>
                    <span className="text-[10px] text-muted-foreground/60">{timeAgo(dua.createdAt)}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{dua.text}</p>
                  <div className="mt-3 flex items-center">
                    <button onClick={() => toggleAmeen(dua.id)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${reactions[String(dua.id)] ? 'bg-purple-500/20 text-purple-400' : 'bg-secondary text-muted-foreground'}`}>
                      <span className="text-base">{'\u0622\u0645\u064A\u0646'}</span>
                      <span className="text-xs text-muted-foreground/80">{dua.ameen}</span>
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
