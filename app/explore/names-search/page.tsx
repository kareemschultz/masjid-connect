'use client'

import { useState, useMemo } from 'react'
import { Heart, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import { ISLAMIC_NAMES, type IslamicName } from '@/lib/islamic-names'

type GenderFilter = 'All' | 'Male' | 'Female'
type OriginFilter = 'All' | 'Arabic' | 'Quranic' | 'Persian'

export default function NamesSearchPage() {
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<GenderFilter>('All')
  const [origin, setOrigin] = useState<OriginFilter>('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return ISLAMIC_NAMES.filter(n => {
      const matchSearch = !search ||
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.meaning.toLowerCase().includes(search.toLowerCase()) ||
        n.arabic.includes(search)
      const matchGender = gender === 'All' || n.gender === gender || n.gender === 'Unisex'
      const matchOrigin = origin === 'All' || n.origin === origin
      return matchSearch && matchGender && matchOrigin
    })
  }, [search, gender, origin])

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Heart}
        title="Islamic Names"
        subtitle="Names with meaning and origin"
        gradient="from-rose-900 to-pink-900"
        showBack
      />

      <div className="px-4 pt-4 space-y-3">
        {/* Search */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
          />
        </div>

        {/* Gender filter */}
        <div className="flex gap-2">
          {(['All', 'Male', 'Female'] as GenderFilter[]).map(g => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                gender === g ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Origin filter */}
        <div className="flex gap-2">
          {(['All', 'Arabic', 'Quranic', 'Persian'] as OriginFilter[]).map(o => (
            <button
              key={o}
              onClick={() => setOrigin(o)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                origin === o ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-[11px] text-gray-500">{filtered.length} names found</p>

        {/* Names list */}
        <div className="space-y-2">
          {filtered.map((name) => {
            const isExpanded = expanded === name.name
            return (
              <button
                key={name.name}
                onClick={() => setExpanded(isExpanded ? null : name.name)}
                className="w-full rounded-2xl border border-gray-800 bg-gray-900 p-4 text-left transition-all active:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15">
                    <span className={`text-xs font-bold ${name.gender === 'Male' ? 'text-blue-400' : name.gender === 'Female' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {name.gender === 'Male' ? '♂' : name.gender === 'Female' ? '♀' : '⚥'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{name.name}</span>
                      <span className="rounded-md bg-gray-800 px-1.5 py-0.5 text-[9px] font-medium text-gray-400">{name.origin}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{name.meaning}</p>
                  </div>
                  <span className="font-arabic text-lg text-white/80">{name.arabic}</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-600 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-600 shrink-0" />}
                </div>
                {isExpanded && (
                  <div className="mt-3 border-t border-gray-800 pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Meaning</span>
                      <span className="text-xs text-gray-300">{name.meaning}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Origin</span>
                      <span className="text-xs text-gray-300">{name.origin}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Gender</span>
                      <span className="text-xs text-gray-300">{name.gender}</span>
                    </div>
                    {name.root && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-500">Arabic Root</span>
                        <span className="font-arabic text-sm text-amber-400">{name.root}</span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
