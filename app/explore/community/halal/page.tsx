'use client'

import { useState, useMemo } from 'react'
import { Store, Search, MapPin, ExternalLink } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

interface Business {
  id: string
  name: string
  category: 'Restaurant' | 'Grocery' | 'Meat' | 'Bakery' | 'Other'
  address: string
  description: string
}

const BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Oasis Cafe',
    category: 'Restaurant',
    address: 'Camp St, Georgetown',
    description: 'Caribbean & Middle Eastern cuisine',
  },
  {
    id: '2',
    name: 'Kaieteur Halal Meats',
    category: 'Meat',
    address: 'Regent St, Georgetown',
    description: 'Fresh halal-certified meats',
  },
  {
    id: '3',
    name: 'Al-Noor Grocery',
    category: 'Grocery',
    address: 'Main St, Georgetown',
    description: 'Halal groceries and imports',
  },
  {
    id: '4',
    name: 'Bismillah Bakery',
    category: 'Bakery',
    address: 'Robb St, Georgetown',
    description: 'Fresh bread and pastries',
  },
  {
    id: '5',
    name: 'Madina Restaurant',
    category: 'Restaurant',
    address: 'Sheriff St, Georgetown',
    description: 'Indian & Guyanese halal food',
  },
  {
    id: '6',
    name: 'Tawakkal Mini Mart',
    category: 'Grocery',
    address: 'Vlissengen Rd, Georgetown',
    description: 'Daily essentials and halal snacks',
  },
]

const FILTERS = ['All', 'Restaurant', 'Grocery', 'Meat', 'Bakery', 'Other'] as const

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Restaurant: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  Grocery: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  Meat: { bg: 'bg-red-500/15', text: 'text-red-400' },
  Bakery: { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  Other: { bg: 'bg-gray-500/15', text: 'text-gray-400' },
}

export default function HalalDirectoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('All')

  const filtered = useMemo(() => {
    return BUSINESSES.filter((b) => {
      const matchesFilter = filter === 'All' || b.category === filter
      const matchesSearch =
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()) ||
        b.address.toLowerCase().includes(search.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [search, filter])

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-nav">
      <PageHero
        icon={Store}
        title="Halal Directory"
        subtitle="Halal in Guyana"
        gradient="from-amber-900 to-orange-900"
        showBack
      />

      <div className="px-4 pt-5 -mt-2 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-800 bg-gray-900 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-gray-900 text-gray-500 border border-gray-800'
              }`}
            >
              {f === 'All' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Business Cards */}
        <div className="space-y-3 animate-stagger">
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Store className="mx-auto h-10 w-10 text-gray-700" />
              <p className="mt-3 text-sm text-gray-500">No businesses found</p>
            </div>
          )}

          {filtered.map((biz) => {
            const cat = CATEGORY_COLORS[biz.category] || CATEGORY_COLORS.Other
            return (
              <div
                key={biz.id}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">
                        {biz.name}
                      </h3>
                      <span
                        className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-semibold ${cat.bg} ${cat.text}`}
                      >
                        {biz.category}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-gray-500">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="text-xs">{biz.address}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
                      {biz.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Submit Business */}
        <Link
          href="/feedback"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-semibold text-white transition-all active:scale-[0.98]"
        >
          <ExternalLink className="h-4 w-4" />
          Submit a Business
        </Link>

        <p className="text-center text-[11px] leading-relaxed text-gray-600 px-4">
          This directory is community-curated. Submit a business to have it reviewed and added.
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
