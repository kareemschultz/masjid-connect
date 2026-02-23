/**
 * Detect if today is in Ramadan using Hijri calendar (Intl API)
 * Priority: user-set date from localStorage > calculated Hijri date
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

  // Priority: user-set date > calculated date
  const storedStart = typeof window !== 'undefined' ? localStorage.getItem('ramadan_start') : null
  if (storedStart) {
    const startDate = new Date(storedStart + 'T00:00:00')
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30) // Ramadan is 29–30 days
    const isRamadan = today >= startDate && today <= endDate
    const ramadanDay = isRamadan ? Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : null
    return { isRamadan, hijriMonth, hijriDay, hijriYear, ramadanDay }
  }

  const isRamadan = hijriMonth === 9 // Ramadan is the 9th month
  const ramadanDay = isRamadan ? hijriDay : null

  return { isRamadan, hijriMonth, hijriDay, hijriYear, ramadanDay }
}
