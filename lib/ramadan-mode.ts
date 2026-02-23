/**
 * Detect if today is in Ramadan using Hijri calendar (Intl API)
 * Priority: user-set date from localStorage > calculated Hijri date
 * Safety: if stored date is in the future but Hijri says it's Ramadan, trust Hijri
 */
export function getRamadanStatus() {
  const today = new Date()
  const hijriFormatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })
  const parts = hijriFormatter.formatToParts(today)
  const hijriMonth = parseInt(parts.find((p) => p.type === 'month')?.value || '0')
  const hijriDay = parseInt(parts.find((p) => p.type === 'day')?.value || '0')
  const hijriYear = parseInt(parts.find((p) => p.type === 'year')?.value || '0')

  const isHijriRamadan = hijriMonth === 9 // Ramadan is the 9th Hijri month

  // Priority: user-set date > calculated date
  const storedStart = typeof window !== 'undefined' ? localStorage.getItem('ramadan_start') : null

  if (storedStart) {
    const startDate = new Date(storedStart + 'T00:00:00')

    // Safety check: if stored start is in the FUTURE but Hijri says it's already Ramadan,
    // the stored date is wrong (e.g. set before the actual moon sighting was announced).
    // In this case, trust the Hijri calendar and correct the stored date.
    if (startDate > today && isHijriRamadan) {
      // Correct the stored date to today minus (hijriDay - 1) days to get day 1
      const correctedStart = new Date(today)
      correctedStart.setDate(today.getDate() - (hijriDay - 1))
      const correctedStr = correctedStart.toISOString().split('T')[0]
      if (typeof window !== 'undefined') {
        localStorage.setItem('ramadan_start', correctedStr)
      }
      return { isRamadan: true, hijriMonth, hijriDay, hijriYear, ramadanDay: hijriDay }
    }

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30) // Ramadan is 29–30 days
    const isRamadan = today >= startDate && today <= endDate
    const ramadanDay = isRamadan
      ? Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : null
    return { isRamadan, hijriMonth, hijriDay, hijriYear, ramadanDay }
  }

  // No stored date — use Hijri calendar
  const isRamadan = isHijriRamadan
  const ramadanDay = isRamadan ? hijriDay : null
  return { isRamadan, hijriMonth, hijriDay, hijriYear, ramadanDay }
}
