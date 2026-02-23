'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, ShieldCheck, Search, ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Haram', 'Doubtful', 'E-Numbers', 'Rules'] as const
type Category = typeof CATEGORIES[number]

interface HalalItem {
  name: string
  status: 'halal' | 'haram' | 'doubtful'
  category: string
  detail: string
  authority?: string
}

const ITEMS: HalalItem[] = [
  // ── Haram ────────────────────────────────────────────────────────────────
  { name: 'Pork and all pork products', status: 'haram', category: 'Haram', detail: 'Pork, bacon, ham, lard, pork gelatin — strictly forbidden in Islam. Always check ingredient labels for "lard," "porcine," or "pig-derived" ingredients.' },
  { name: 'Alcohol and alcoholic beverages', status: 'haram', category: 'Haram', detail: 'All intoxicating beverages — beer, rum, wine, spirits — are haram. This includes Banks Beer, El Dorado Rum, and similar local products. Non-alcoholic variants may be acceptable.' },
  { name: 'Non-Zabiha land animals', status: 'haram', category: 'Haram', detail: 'Chicken, beef, lamb or goat that was NOT slaughtered according to Islamic rites (Zabiha/Dhabihah) — including most supermarket chicken and processed meat in Guyana.' },
  { name: 'Blood and blood products', status: 'haram', category: 'Haram', detail: 'Flowing blood (dam masfuh) is haram. This includes blood sausage (black pudding) and products listing "blood" as an ingredient.' },
  { name: 'Carrion (dead animals)', status: 'haram', category: 'Haram', detail: 'Animals that died of themselves (disease, accident, strangulation) without proper Islamic slaughter.' },
  { name: 'Predatory animals and birds of prey', status: 'haram', category: 'Haram', detail: 'Carnivorous animals (dogs, cats, lions, eagles, vultures) — haram for consumption.' },
  { name: 'Insects (most)', status: 'haram', category: 'Haram', detail: 'Most insects are haram. Exception: locusts are halal. Note: Cochineal dye (E120) from beetles is haram — common in red-coloured sweets and drinks.' },
  { name: 'Gelatin (pork or unknown source)', status: 'haram', category: 'Haram', detail: 'Common in jellies, gummy sweets, marshmallows, and some yogurts. Must verify source — beef gelatin from zabiha source is acceptable.' },

  // ── Doubtful / Mushbooh ───────────────────────────────────────────────────
  { name: 'Shellfish (shrimp, crab, lobster)', status: 'doubtful', category: 'Doubtful', detail: 'Halal per Shafi\'i and Hanbali schools. Makruh to haram per Hanafi school. Many Guyanese Muslims are Hanafi — consult your imam.' },
  { name: 'Natural flavours on labels', status: 'doubtful', category: 'Doubtful', detail: '"Natural flavours" can include pork or alcohol derivatives. When in doubt, contact the manufacturer for clarification.' },
  { name: 'Cheese with animal rennet', status: 'doubtful', category: 'Doubtful', detail: 'Rennet from non-zabiha animals — opinion differs. Hanafi school: may be permissible due to transformation. To be safe, choose cheese labeled "microbial" or "vegetarian" rennet.' },
  { name: 'Vanilla extract', status: 'doubtful', category: 'Doubtful', detail: 'Contains alcohol as solvent. Most scholars hold small amounts in flavouring are permissible; others prefer vanilla powder or non-alcohol alternatives.' },
  { name: 'Wines/beer in cooking', status: 'doubtful', category: 'Doubtful', detail: 'Using wine or beer in cooking does NOT make it halal — alcohol does not fully evaporate during cooking. Avoid.' },
  { name: 'L-Cysteine (E920)', status: 'doubtful', category: 'Doubtful', detail: 'Often derived from hair (human or animal). Commonly found in commercial breads and baked goods. Check if source is stated.' },

  // ── Key E-Numbers ─────────────────────────────────────────────────────────
  { name: 'E120 — Cochineal / Carmine', status: 'haram', category: 'E-Numbers', detail: 'Red dye derived from crushed beetles (insects). Found in red and pink sweets, fruit drinks, yogurt, cosmetics. Haram.' },
  { name: 'E441 — Gelatin', status: 'haram', category: 'E-Numbers', detail: 'May be from pork or non-zabiha beef. Common in confectionery, capsules, cream-based products. Avoid unless source confirmed.' },
  { name: 'E422 — Glycerol', status: 'doubtful', category: 'E-Numbers', detail: 'Can be animal or vegetable derived. Vegetable glycerol is halal.' },
  { name: 'E471 — Mono- and Diglycerides', status: 'doubtful', category: 'E-Numbers', detail: 'Can be derived from animal fat (pork or non-zabiha). Common in baked goods, margarine, ice cream.' },
  { name: 'E631 / E627 / E635 — Nucleotides', status: 'doubtful', category: 'E-Numbers', detail: 'Flavour enhancers potentially derived from pork. Common in savoury snacks, noodles, instant soups.' },
  { name: 'E904 — Shellac', status: 'doubtful', category: 'E-Numbers', detail: 'Resin secreted by lac beetles — used as a coating on sweets and apples. Insect-derived, haram for many scholars.' },
  { name: 'E322 — Lecithin (soy)', status: 'halal', category: 'E-Numbers', detail: 'When derived from soy, lecithin is halal. When from egg, it is halal from permissible eggs. Only problematic if animal-derived without zabiha.' },
  { name: 'E471 from vegetable sources', status: 'halal', category: 'E-Numbers', detail: 'When explicitly stated as "vegetable mono- and diglycerides" — halal.' },
]

const GUYANA_AUTHORITIES = [
  {
    name: 'CIOG (Central Islamic Organisation of Guyana)',
    description: 'One of Guyana\'s main Islamic bodies. The CIOG certifies and monitors halal compliance for food businesses, butchers, and restaurants in Guyana. Headquartered at Woolford Avenue, Thomas Lands, Georgetown.',
    contact: '592-225-6167',
    logo: '☪️',
  },
  {
    name: 'D.E.H.C. — Darul Uloom East Street Halaal Committee',
    description: 'The official halal certification committee of Darul Uloom East Street, headed by Maulana Badrudeen Khan. D.E.H.C. certifies restaurants, fast food chains (including Church\'s Chicken), and food businesses in Guyana. 2026 Ramadan Values: Nisab $547,298 GYD (19.687 silver), Sadaqatul Fitr $2,000 GYD/person, Fidya $60,000 GYD/fast.',
    contact: 'Maulana Badrudeen Khan: 623-2780 | Darul Uloom Office: 223-0579 | darululoomgt@gmail.com | 310 East Street, South Cummingsburg, Georgetown',
    logo: '🎓',
  },
  {
    name: 'GIT (Guyana Islamic Trust)',
    description: 'The Guyana Islamic Trust publishes official Islamic calendars, prayer timetables, and educational content. Also involved in halal awareness in the community.',
    contact: 'N½ Lot 321 East Street, N/Cummingsburg, Georgetown | 227-0115 / 225-5934',
    logo: '🏛️',
  },
  {
    name: 'Important Note on Guyana\'s Halal Landscape',
    description: 'Unlike some countries, Guyana does not have a single unified halal authority. Certification is issued by multiple organisations — CIOG, individual scholars (like Maulana Badruddeen), and imported products carry international halal logos. Always verify with the specific certifying body or your local imam when in doubt.',
    contact: '',
    logo: 'ℹ️',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: HalalItem['status'] }) {
  if (status === 'halal') return (
    <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
      <CheckCircle2 className="h-3 w-3" /> Halal
    </span>
  )
  if (status === 'haram') return (
    <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[10px] font-bold text-red-400">
      <XCircle className="h-3 w-3" /> Haram
    </span>
  )
  return (
    <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold text-amber-400">
      <AlertCircle className="h-3 w-3" /> Doubtful
    </span>
  )
}

export default function HalalGuidePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [expandedAuth, setExpandedAuth] = useState<string | null>(null)

  const filtered = ITEMS.filter(item => {
    const catMatch = activeCategory === 'All' || item.category === activeCategory
    const searchMatch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.detail.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={ShieldCheck}
        title="Halal Guide"
        subtitle="Foods, Ingredients & E-Numbers Reference"
        gradient="from-emerald-900 to-teal-900"
        showBack
      
        heroTheme="fiqh"
      />

      <div className="px-4 pt-5 space-y-4">

        {/* Guyana Halal Authorities */}
        <div className="rounded-2xl border border-emerald-800/30 bg-emerald-950/20 p-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400">Halal Authorities in Guyana</h3>
          <div className="space-y-2">
            {GUYANA_AUTHORITIES.map(auth => (
              <div key={auth.name}>
                <button
                  onClick={() => setExpandedAuth(expandedAuth === auth.name ? null : auth.name)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl bg-card px-4 py-3 text-left active:bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{auth.logo}</span>
                    <span className="text-sm font-semibold text-foreground">{auth.name}</span>
                  </div>
                  {expandedAuth === auth.name ? <ChevronUp className="h-4 w-4 text-muted-foreground/80" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/80" />}
                </button>
                {expandedAuth === auth.name && (
                  <div className="rounded-b-xl border border-t-0 border-border bg-card/60 px-4 pb-3 pt-2">
                    <p className="text-xs text-muted-foreground">{auth.description}</p>
                    <p className="mt-1.5 text-xs text-emerald-400">{auth.contact}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Directory cross-link */}
        <Link
          href="/explore/halal-directory"
          className="flex items-center justify-between gap-3 rounded-xl border-l-4 border-emerald-500 bg-emerald-950/30 px-4 py-3"
        >
          <span className="text-xs text-muted-foreground">Looking for halal restaurants &amp; food outlets?</span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-foreground">
            View Halal Directory <ArrowRight className="h-3 w-3" />
          </span>
        </Link>

        {/* Search */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground/80" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, ingredients, E-numbers..."
            className="w-full bg-transparent text-sm text-foreground placeholder-gray-500 outline-none"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-foreground'
                  : 'bg-secondary text-muted-foreground active:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Halal — permissible</span>
          <span className="flex items-center gap-1 text-red-400"><XCircle className="h-3 w-3" /> Haram — forbidden</span>
          <span className="flex items-center gap-1 text-amber-400"><AlertCircle className="h-3 w-3" /> Doubtful — consult scholar</span>
        </div>

        {/* Items list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground/80 py-8">No results found</p>
          )}
          {filtered.map(item => (
            <div key={item.name} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpandedItem(expandedItem === item.name ? null : item.name)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left active:bg-secondary/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground/60 bg-secondary rounded px-2 py-0.5">{item.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={item.status} />
                  {expandedItem === item.name ? <ChevronUp className="h-4 w-4 text-muted-foreground/60" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/60" />}
                </div>
              </button>
              {expandedItem === item.name && (
                <div className="border-t border-border px-4 pb-4 pt-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                  {item.authority && (
                    <p className="mt-2 text-[10px] text-emerald-500">Certification: {item.authority}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
            <span className="text-amber-400 font-semibold">Important:</span> This guide is for general reference and education. For specific rulings, always consult a qualified Islamic scholar. Halal status can vary by school of thought (madhab). When in doubt, leave it out.
          </p>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}
