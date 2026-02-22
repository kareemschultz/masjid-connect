'use client'

import { useState } from 'react'
import { Calculator } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { BottomNav } from '@/components/bottom-nav'

// Nisab threshold in GYD (approximately 85g gold equivalent)
const NISAB_GYD = 1_500_000

export default function ZakatPage() {
  const [cash, setCash] = useState('')
  const [savings, setSavings] = useState('')
  const [gold, setGold] = useState('')
  const [silver, setSilver] = useState('')
  const [investments, setInvestments] = useState('')
  const [debts, setDebts] = useState('')

  const totalAssets =
    (Number(cash) || 0) +
    (Number(savings) || 0) +
    (Number(gold) || 0) +
    (Number(silver) || 0) +
    (Number(investments) || 0)

  const totalDebts = Number(debts) || 0
  const zakatableWealth = Math.max(0, totalAssets - totalDebts)
  const zakatDue = zakatableWealth >= NISAB_GYD ? zakatableWealth * 0.025 : 0

  const fields = [
    { label: 'Cash in Hand', value: cash, set: setCash },
    { label: 'Bank Savings', value: savings, set: setSavings },
    { label: 'Gold Value', value: gold, set: setGold },
    { label: 'Silver Value', value: silver, set: setSilver },
    { label: 'Investments', value: investments, set: setInvestments },
    { label: 'Outstanding Debts', value: debts, set: setDebts },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
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
          <p className="mt-1 text-lg font-bold text-foreground">
            GYD {NISAB_GYD.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">Based on 85g gold equivalent</p>
        </div>

        {/* Input fields */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.label}>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  {field.label}
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3">
                  <span className="text-xs text-gray-500">GYD</span>
                  <input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-sm text-foreground placeholder-gray-600 outline-none"
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
              <span className="text-sm font-medium text-foreground">
                GYD {totalAssets.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Less Debts</span>
              <span className="text-sm font-medium text-red-400">
                - GYD {totalDebts.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gray-800 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Zakatable Wealth</span>
                <span className="text-sm font-bold text-foreground">
                  GYD {zakatableWealth.toLocaleString()}
                </span>
              </div>
            </div>
            <div className={`rounded-xl p-4 ${zakatDue > 0 ? 'bg-emerald-500/10' : 'bg-gray-800'}`}>
              <p className="text-xs text-gray-400">Zakat Due (2.5%)</p>
              <p className={`mt-1 text-2xl font-bold ${zakatDue > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                GYD {zakatDue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              {zakatableWealth < NISAB_GYD && zakatableWealth > 0 && (
                <p className="mt-1 text-[11px] text-gray-400">
                  Your wealth is below the Nisab threshold. No Zakat is due.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
