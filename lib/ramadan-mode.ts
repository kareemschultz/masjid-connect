import { getItem, setItem } from './storage'

/**
 * Detect if today is in Ramadan.
 * Priority order:
 *   1. User-stored ramadan_start in localStorage
 *   2. Intl Hijri calendar (umm al-qura)
 *   3. Hardcoded 2026 Ramadan fallback (Feb 18 – Mar 19) — covers browser Intl failures
 *
 * NOTE: Always use getItem/setItem (not raw localStorage) so JSON-encoding is consistent.
 * setItem() stores "2026-02-19" as '"2026-02-19"' (JSON); raw localStorage.getItem would
 * return the quoted string and new Date('"2026-02-19"T00:00:00') is an Invalid Date.
 */

// Hardcoded Ramadan 1447 bounds (earliest possible start / latest possible end)
const RAMADAN_1447_EARLIEST = new Date('2026-02-18T00:00:00')
const RAMADAN_1447_LATEST   = new Date('2026-03-19T23:59:59')
// Default start when no localStorage and Intl fails — use CIOG date (Feb 19)
const RAMADAN_1447_DEFAULT_START = '2026-02-19'

export function getRamadanStatus() {
  const today = new Date()
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  // ── Intl Hijri calendar ──────────────────────────────────────────────────
  let hijriMonth = 0, hijriDay = 0, hijriYear = 0
  try {
    const parts = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      month: 'numeric', day: 'numeric', year: 'numeric',
    }).formatToParts(today)
    hijriMonth = parseInt(parts.find((p) => p.type === 'month')?.value || '0')
    hijriDay   = parseInt(parts.find((p) => p.type === 'day')?.value   || '0')
    hijriYear  = parseInt(parts.find((p) => p.type === 'year')?.value  || '0')
  } catch { /* Intl may fail in some environments */ }

  const isHijriRamadan = hijriMonth === 9

  // ── 1. User-stored start date ────────────────────────────────────────────
  // Use getItem() so JSON-encoded values are parsed correctly (setItem stores with JSON.stringify)
  const storedStart = getItem<string | null>('ramadan_start', null)

  if (storedStart) {
    const startDate = new Date(storedStart + 'T00:00:00')
    const endDate   = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30)

    // Safety: stored date is in the future but Hijri already says Ramadan → correct it
    if (startDate > today && isHijriRamadan) {
      const correctedStart = new Date(today)
      correctedStart.setDate(today.getDate() - (hijriDay - 1))
      const correctedStr = correctedStart.toISOString().split('T')[0]
      setItem('ramadan_start', correctedStr)
      const ramadanDay = hijriDay
      return { isRamadan: true, hijriMonth, hijriDay, hijriYear, ramadanDay }
    }

    const isRamadan = today >= startDate && today <= endDate
    const ramadanDay = isRamadan
      ? Math.floor((todayMidnight.getTime() - startDate.getTime()) / 86400000) + 1
      : null
    return { isRamadan, hijriMonth, hijriDay, hijriYear, ramadanDay }
  }

  // ── 2. Intl Hijri calendar (no stored date) ──────────────────────────────
  if (isHijriRamadan) {
    return { isRamadan: true, hijriMonth, hijriDay, hijriYear, ramadanDay: hijriDay }
  }

  // ── 3. Hardcoded 2026 fallback (Intl failed or returned non-Ramadan) ─────
  // If Intl API failed (hijriMonth=0) or returned wrong month, check Gregorian date range.
  const inFallbackWindow = today >= RAMADAN_1447_EARLIEST && today <= RAMADAN_1447_LATEST
  if (inFallbackWindow) {
    // Auto-set a default ramadan_start so subsequent renders are consistent
    setItem('ramadan_start', RAMADAN_1447_DEFAULT_START)
    const startDate = new Date(RAMADAN_1447_DEFAULT_START + 'T00:00:00')
    const ramadanDay = Math.floor((todayMidnight.getTime() - startDate.getTime()) / 86400000) + 1
    // hijriYear for 1447 if Intl failed
    const year = hijriYear || 1447
    const day  = hijriDay  || ramadanDay
    return { isRamadan: true, hijriMonth: 9, hijriDay: day, hijriYear: year, ramadanDay }
  }

  return { isRamadan: false, hijriMonth, hijriDay, hijriYear, ramadanDay: null }
}
