'use client'

import { useState } from 'react'
import { Calculator, Users, Heart, Info } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

const NISAB_GYD = 1_500_000
const ZAKAT_FITR_DEFAULT = 500

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

  const totalAssets =
    (Number(cash) || 0) +
    (Number(savings) || 0) +
    (Number(gold) || 0) +
    (Number(silver) || 0) +
    (Number(investments) || 0)

  const totalDebts = Number(debts) || 0
  const zakatableWealth = Math.max(0, totalAssets - totalDebts)
  const zakatDue = zakatableWealth >= NISAB_GYD ? zakatableWealth * 0.025 : 0

  const members = Math.max(1, Number(familyMembers) || 1)
  const fitr = Number(fitrAmount) || ZAKAT_FITR_DEFAULT
  const totalFitr = members * fitr

  const fields = [
    { label: 'Cash in Hand', value: cash, set: setCash },
    { label: 'Bank Savings', value: savings, set: setSavings },
    { label: 'Gold Value', value: gold, set: setGold },
    { label: 'Silver Value', value: silver, set: setSilver },
    { label: 'Investments', value: investments, set: setInvestments },
    { label: 'Outstanding Debts', value: debts, set: setDebts },
  ]

  return (
    <div className="min-h-screen bg-[#0a0b14] pb-24">
      <PageHero
        icon={Calculator}
        title="Zakat Calculator"
        subtitle="In Guyanese Dollars (GYD)"
        gradient="from-teal-900 to-green-900"
        showBack
      />

      <div className="space-y-4 px-4 pt-5">
        {/* Nisab info */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs font-medium text-amber-400">Current Nisab Threshold</p>
          <p className="mt-1 text-lg font-bold text-[#f9fafb]">{fmtGYD(NISAB_GYD)}</p>
          <p className="mt-1 text-[11px] text-gray-400">
            Nisab based on ~85g gold. Update based on current gold prices.
          </p>
        </div>

        {/* Input fields */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Zakat al-Mal (Wealth)</h3>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.label}>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  {field.label}
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#0a0b14] px-4 py-3">
                  <span className="text-xs text-gray-500">GYD</span>
                  <input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm text-[#f9fafb] placeholder-gray-600 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Total Assets</span>
              <span className="text-sm font-medium text-[#f9fafb]">{fmtGYD(totalAssets)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Less Debts</span>
              <span className="text-sm font-medium text-red-400">- {fmtGYD(totalDebts)}</span>
            </div>
            <div className="border-t border-gray-800 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Zakatable Wealth</span>
                <span className="text-sm font-bold text-[#f9fafb]">{fmtGYD(zakatableWealth)}</span>
              </div>
            </div>
            <div className={`rounded-xl p-4 ${zakatDue > 0 ? 'bg-emerald-500/10' : 'bg-gray-800'}`}>
              <p className="text-xs text-gray-400">Zakat Due (2.5%)</p>
              <p className={`mt-1 text-2xl font-bold ${zakatDue > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                {fmtGYD(zakatDue)}
              </p>
              {zakatableWealth < NISAB_GYD && zakatableWealth > 0 && (
                <p className="mt-1 text-[11px] text-gray-400">
                  Your wealth is below the Nisab threshold. No Zakat is due.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Zakat al-Fitr */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Zakat al-Fitr</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Per-head charity due before Eid al-Fitr prayer (end of Ramadan).
          </p>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">Amount per person</label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#0a0b14] px-4 py-3">
                <span className="text-xs text-gray-500">GYD</span>
                <input
                  type="number"
                  value={fitrAmount}
                  onChange={(e) => setFitrAmount(e.target.value)}
                  placeholder={String(ZAKAT_FITR_DEFAULT)}
                  className="w-full bg-transparent text-sm text-[#f9fafb] placeholder-gray-600 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">Number of family members</label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#0a0b14] px-4 py-3">
                <input
                  type="number"
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(e.target.value)}
                  min="1"
                  placeholder="1"
                  className="w-full bg-transparent text-sm text-[#f9fafb] placeholder-gray-600 outline-none"
                />
              </div>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-4">
              <p className="text-xs text-gray-400">Total Zakat al-Fitr Due</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{fmtGYD(totalFitr)}</p>
              <p className="mt-1 text-[11px] text-gray-500">
                {fmtGYD(fitr)} x {members} {members === 1 ? 'person' : 'persons'}
              </p>
            </div>
          </div>
        </div>

        {/* Who receives Zakat */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Who Receives Zakat?</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">The 8 categories (Asnaf) mentioned in the Quran (At-Tawbah 9:60):</p>
          <div className="space-y-2">
            {ASNAF.map((cat, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-gray-800/50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-[10px] font-bold text-rose-400">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#f9fafb]">{cat.name}</p>
                  <p className="text-[11px] text-gray-400">{cat.desc}</p>
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
              <p className="mt-1 text-[11px] text-gray-400">
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
