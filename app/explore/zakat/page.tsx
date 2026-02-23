'use client'

import { useState } from 'react'
import { Calculator, Users, Heart, Info } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

// Nisab 2026 — per Maulana Badrudeen Khan & Mufti Irfan Qasmi (Darul Uloom East Street, Feb 2026)
// Based on 19.687 silver (tola) equivalent in GYD
const NISAB_GYD = 547_298
const SADAQATUL_FITR_GYD = 2_000      // per person
const FIDYA_GYD = 60_000               // per fast missed
const ZAKAT_FITR_DEFAULT = SADAQATUL_FITR_GYD  // $2,000 GYD — official 2026 value (Darul Uloom)

const GOLD_PRICE_GYD = 800  // per gram — approximate
const GOLD_NISAB_GRAMS = 85
const SILVER_NISAB_GRAMS = 595
const GOLD_NISAB_GYD = GOLD_NISAB_GRAMS * GOLD_PRICE_GYD

const ASNAF = [
  { name: 'Al-Fuqara (The Poor)', desc: 'Those with very little or no income' },
  { name: 'Al-Masakin (The Needy)', desc: 'Those who cannot meet basic needs' },
  { name: 'Amil Zakat (Collectors)', desc: 'Those employed to collect Zakat' },
  { name: "Mu'allafatul Qulub", desc: 'Those whose hearts are to be reconciled' },
  { name: 'Ar-Riqab (Freeing Captives)', desc: 'For the liberation of those in bondage' },
  { name: 'Al-Gharimin (Debtors)', desc: 'Those burdened with overwhelming debt' },
  { name: "Fi Sabilillah (In Allah's Cause)", desc: 'Those striving in the way of Allah' },
  { name: 'Ibn as-Sabil (Travellers)', desc: 'Stranded or needy travellers' },
]

function fmtGYD(n: number): string {
  return `GYD ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

export default function ZakatPage() {
  const [cash, setCash] = useState('')
  const [savings, setSavings] = useState('')
  const [gold, setGold] = useState('')
  const [silver, setSilver] = useState('')
  const [investments, setInvestments] = useState('')
  const [debts, setDebts] = useState('')
  const [familyMembers, setFamilyMembers] = useState('1')
  const [fitrAmount, setFitrAmount] = useState(String(ZAKAT_FITR_DEFAULT))
  const [businessAssets, setBusinessAssets] = useState('')
  const [receivables, setReceivables] = useState('')
  const [goldGrams, setGoldGrams] = useState('')
  const [silverGrams, setSilverGrams] = useState('')
  const [activeTab, setActiveTab] = useState('cash')

  const goldValue = (Number(goldGrams) || 0) * GOLD_PRICE_GYD + (Number(gold) || 0)
  const silverValue = (Number(silverGrams) || 0) * 10 + (Number(silver) || 0)
  const totalAssets =
    (Number(cash) || 0) +
    (Number(savings) || 0) +
    goldValue +
    silverValue +
    (Number(investments) || 0) +
    (Number(businessAssets) || 0) +
    (Number(receivables) || 0)

  const totalDebts = Number(debts) || 0
  const zakatableWealth = Math.max(0, totalAssets - totalDebts)
  const zakatDue = zakatableWealth >= NISAB_GYD ? zakatableWealth * 0.025 : 0

  const members = Math.max(1, Number(familyMembers) || 1)
  const fitr = Number(fitrAmount) || ZAKAT_FITR_DEFAULT
  const totalFitr = members * fitr

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHero
        icon={Calculator}
        title="Zakat Calculator"
        subtitle="In Guyanese Dollars (GYD)"
        gradient="from-teal-900 to-green-900"
        showBack
      
        heroTheme="zakat"
      />

      <div className="space-y-4 px-4 pt-5">
        {/* Nisab info */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs font-medium text-amber-400">Nisab 2026 — Zakat Threshold</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{fmtGYD(NISAB_GYD)}</p>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            <span className="text-muted-foreground/80">Sadaqatul Fitr</span><span className="text-right font-semibold text-emerald-400">{fmtGYD(SADAQATUL_FITR_GYD)}/person</span>
            <span className="text-muted-foreground/80">Fidya per fast</span><span className="text-right font-semibold text-orange-400">{fmtGYD(FIDYA_GYD)}</span>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground/60">Based on 19.687 silver — set by Maulana Badrudeen Khan & Mufti Irfan Qasmi (Darul Uloom East St., Feb 2026)</p>
        </div>

        {/* Asset Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {[
            { key: 'cash', label: 'Cash & Savings' },
            { key: 'gold', label: 'Gold' },
            { key: 'silver', label: 'Silver' },
            { key: 'business', label: 'Business' },
            { key: 'other', label: 'Other' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                activeTab === tab.key ? 'bg-emerald-600 text-foreground' : 'bg-secondary text-muted-foreground/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
          {activeTab === 'cash' && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Cash & Savings</h3>
              {[
                { label: 'Cash in Hand', value: cash, set: setCash },
                { label: 'Bank Savings', value: savings, set: setSavings },
                { label: 'Investments', value: investments, set: setInvestments },
              ].map(field => (
                <div key={field.label}>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{field.label}</label>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                    <span className="text-xs text-muted-foreground/80">GYD</span>
                    <input type="number" value={field.value} onChange={(e) => field.set(e.target.value)} placeholder="0" className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none" />
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'gold' && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Gold</h3>
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                <p className="text-[11px] text-amber-400">Gold Nisab: {GOLD_NISAB_GRAMS}g × GYD {GOLD_PRICE_GYD}/g = {fmtGYD(GOLD_NISAB_GYD)}</p>
                <p className="text-[10px] text-muted-foreground/80 mt-1">Gold price varies — verify with current rate</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Gold Weight (grams)</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                  <span className="text-xs text-muted-foreground/80">g</span>
                  <input type="number" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} placeholder="0" className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none" />
                </div>
                {Number(goldGrams) > 0 && <p className="mt-1 text-[11px] text-muted-foreground/80">Value: {fmtGYD((Number(goldGrams) || 0) * GOLD_PRICE_GYD)}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Gold Value (if known, GYD)</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                  <span className="text-xs text-muted-foreground/80">GYD</span>
                  <input type="number" value={gold} onChange={(e) => setGold(e.target.value)} placeholder="0" className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'silver' && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Silver</h3>
              <div className="rounded-xl bg-gray-500/5 border border-gray-500/20 p-3">
                <p className="text-[11px] text-muted-foreground">Silver Nisab: {SILVER_NISAB_GRAMS}g of silver</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Silver Weight (grams)</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                  <span className="text-xs text-muted-foreground/80">g</span>
                  <input type="number" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value)} placeholder="0" className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Silver Value (if known, GYD)</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                  <span className="text-xs text-muted-foreground/80">GYD</span>
                  <input type="number" value={silver} onChange={(e) => setSilver(e.target.value)} placeholder="0" className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'business' && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Business Assets</h3>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Total Stock/Merchandise Value</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                  <span className="text-xs text-muted-foreground/80">GYD</span>
                  <input type="number" value={businessAssets} onChange={(e) => setBusinessAssets(e.target.value)} placeholder="0" className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'other' && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Receivables & Debts</h3>
              <p className="text-xs text-muted-foreground/80">Money owed to you that you expect to receive. Exclude doubtful debts.</p>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Money Owed to You</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                  <span className="text-xs text-muted-foreground/80">GYD</span>
                  <input type="number" value={receivables} onChange={(e) => setReceivables(e.target.value)} placeholder="0" className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none" />
                </div>
              </div>
            </>
          )}

          {/* Debts - always shown */}
          <div className="pt-4 border-t border-border">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Outstanding Debts (deducted)</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
              <span className="text-xs text-muted-foreground/80">GYD</span>
              <input type="number" value={debts} onChange={(e) => setDebts(e.target.value)} placeholder="0" className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-secondary/50 border border-border/50 p-3">
          <p className="text-[10px] text-muted-foreground/80 leading-relaxed">
            This calculator provides an estimate. Consult a scholar for complex situations including business partnerships, agricultural produce, or cryptocurrency.
          </p>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total Assets</span>
              <span className="text-sm font-medium text-foreground">{fmtGYD(totalAssets)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Less Debts</span>
              <span className="text-sm font-medium text-red-400">- {fmtGYD(totalDebts)}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Zakatable Wealth</span>
                <span className="text-sm font-bold text-foreground">{fmtGYD(zakatableWealth)}</span>
              </div>
            </div>
            <div className={`rounded-xl p-4 ${zakatDue > 0 ? 'bg-emerald-500/10' : 'bg-secondary'}`}>
              <p className="text-xs text-muted-foreground">Zakat Due (2.5%)</p>
              <p className={`mt-1 text-2xl font-bold ${zakatDue > 0 ? 'text-emerald-400' : 'text-muted-foreground/80'}`}>
                {fmtGYD(zakatDue)}
              </p>
              {zakatableWealth < NISAB_GYD && zakatableWealth > 0 && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Your wealth is below the Nisab threshold. No Zakat is due.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Zakat al-Fitr */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Zakat al-Fitr</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Per-head charity due before Eid al-Fitr prayer (end of Ramadan).
          </p>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Amount per person</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                <span className="text-xs text-muted-foreground/80">GYD</span>
                <input
                  type="number"
                  value={fitrAmount}
                  onChange={(e) => setFitrAmount(e.target.value)}
                  placeholder={String(ZAKAT_FITR_DEFAULT)}
                  className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Number of family members</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                <input
                  type="number"
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(e.target.value)}
                  min="1"
                  placeholder="1"
                  className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none"
                />
              </div>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-4">
              <p className="text-xs text-muted-foreground">Total Zakat al-Fitr Due</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{fmtGYD(totalFitr)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground/80">
                {fmtGYD(fitr)} x {members} {members === 1 ? 'person' : 'persons'}
              </p>
            </div>
          </div>
        </div>

        {/* Who receives Zakat */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Who Receives Zakat?</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">The 8 categories (Asnaf) mentioned in the Quran (At-Tawbah 9:60):</p>
          <div className="space-y-2">
            {ASNAF.map((cat, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-[10px] font-bold text-rose-400">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">{cat.name}</p>
                  <p className="text-[11px] text-muted-foreground">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pay Zakat note */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-400">Pay Zakat in Guyana</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                To pay Zakat in Guyana, contact CIOG (Central Islamic Organisation of Guyana) or your local masjid.
                They can guide you on proper distribution to those in need.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
