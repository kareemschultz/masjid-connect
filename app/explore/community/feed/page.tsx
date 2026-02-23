'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Heart, Send } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { getItem, setItem } from '@/lib/storage'

interface FeedPost {
  id: string | number
  name: string
  message: string
  type: 'Reminder' | 'Question' | 'Announcement' | 'General'
  likes: number
  createdAt: number
}

const POST_TYPES = ['Reminder', 'Question', 'Announcement', 'General'] as const

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Reminder: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  Question: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  Announcement: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  General: { bg: 'bg-gray-500/15', text: 'text-muted-foreground' },
}

const SAMPLE_POSTS: FeedPost[] = [
  { id: 'sample-1', name: 'Brother Ibrahim', message: "Don't forget to read Surah Al-Kahf every Friday. The Prophet (SAW) said it brings light between two Fridays.", type: 'Reminder', likes: 24, createdAt: Date.now() - 3600000 * 1 },
  { id: 'sample-2', name: 'CIOG Admin', message: 'Taraweeh prayers at CIOG Masjid starting 8:00 PM during Ramadan. All welcome!', type: 'Announcement', likes: 41, createdAt: Date.now() - 3600000 * 4 },
  { id: 'sample-3', name: 'Sister Fatimah', message: "Does anyone know if there's a sisters-only Quran circle in Georgetown?", type: 'Question', likes: 12, createdAt: Date.now() - 3600000 * 7 },
  { id: 'sample-4', name: 'Ahmad K.', message: 'Alhamdulillah for this community app! Great to see Muslims in GY connecting.', type: 'General', likes: 35, createdAt: Date.now() - 3600000 * 10 },
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

function normalizeRow(row: any): FeedPost {
  return {
    id: row.id,
    name: row.name || 'Anonymous',
    message: row.message || '',
    type: row.type || 'General',
    likes: row.like_count ?? row.likes ?? 0,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : (row.createdAt || Date.now()),
  }
}

export default function CommunityFeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [likes, setLikes] = useState<Record<string, boolean>>({})
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [postType, setPostType] = useState<FeedPost['type']>('General')

  useEffect(() => {
    fetch('/api/community/feed')
      .then((res) => (res.ok ? res.json() : null))
      .then((rows) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setPosts(rows.map(normalizeRow))
        } else {
          const stored = getItem<FeedPost[]>('community_feed', [])
          setPosts(stored.length > 0 ? stored : SAMPLE_POSTS)
        }
      })
      .catch(() => {
        const stored = getItem<FeedPost[]>('community_feed', [])
        setPosts(stored.length > 0 ? stored : SAMPLE_POSTS)
      })
    setLikes(getItem<Record<string, boolean>>('feed_likes', {}))
  }, [])

  const submitPost = () => {
    if (!message.trim()) return
    const newPost: FeedPost = {
      id: Date.now().toString(),
      name: name.trim() || 'Anonymous',
      message: message.trim(),
      type: postType,
      likes: 0,
      createdAt: Date.now(),
    }
    const updated = [newPost, ...posts]
    setPosts(updated)
    setItem('community_feed', updated)
    setMessage('')
    setName('')

    fetch('/api/community/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() || 'Anonymous', message: message.trim(), type: postType }),
    }).catch(() => {})
  }

  const toggleLike = (id: string | number) => {
    const key = String(id)
    const alreadyLiked = likes[key]
    const newLikes = { ...likes, [key]: !alreadyLiked }
    setLikes(newLikes)
    setItem('feed_likes', newLikes)

    setPosts((prev) => {
      const updated = prev.map((p) =>
        String(p.id) === key ? { ...p, likes: p.likes + (alreadyLiked ? -1 : 1) } : p
      )
      setItem('community_feed', updated)
      return updated
    })

    if (!alreadyLiked) {
      fetch('/api/community/feed/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: id }),
      }).catch(() => {})
    }
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero icon={MessageCircle} title="Community Feed" subtitle="Muslims in GY" gradient="from-blue-900 to-indigo-900" showBack heroTheme="community" />

      <div className="px-4 pt-5 -mt-2 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <input type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-blue-500/50" />
          <div className="relative">
            <textarea placeholder="Share something with the community..." value={message} onChange={(e) => setMessage(e.target.value.slice(0, 300))} rows={3} className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-blue-500/50" />
            <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/60">{message.length}/300</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {POST_TYPES.map((t) => {
              const colors = TYPE_COLORS[t]
              return (
                <button key={t} onClick={() => setPostType(t)} className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${postType === t ? `${colors.bg} ${colors.text}` : 'bg-secondary/50 text-muted-foreground/80'}`}>
                  {t}
                </button>
              )
            })}
          </div>

          <button onClick={submitPost} disabled={!message.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-foreground transition-all active:scale-95 disabled:opacity-40">
            <Send className="h-4 w-4" />
            Post
          </button>
        </div>

        <div className="space-y-3 animate-stagger">
          {posts.map((post) => {
            const colors = TYPE_COLORS[post.type] || TYPE_COLORS.General
            const initial = post.name === 'Anonymous' ? '?' : post.name[0].toUpperCase()

            return (
              <div key={post.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-400">{initial}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}>{post.type}</span>
                      <span className="text-sm font-semibold text-foreground">{post.name}</span>
                      <span className="text-[10px] text-muted-foreground/60">{timeAgo(post.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.message}</p>
                    <div className="mt-3">
                      <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all active:scale-95 ${likes[String(post.id)] ? 'bg-red-500/15 text-red-400' : 'bg-secondary text-muted-foreground'}`}>
                        <Heart className={`h-4 w-4 ${likes[String(post.id)] ? 'fill-red-400' : ''}`} />
                        <span className="text-xs">{post.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
