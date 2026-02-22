/**
 * Detect if today is in Ramadan using Hijri calendar (Intl API)
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

  const isRamadan = hijriMonth === 9 // Ramadan is the 9th month
  const ramadanDay = isRamadan ? hijriDay : null

  return { isRamadan, hijriMonth, hijriDay, hijriYear, ramadanDay }
}
