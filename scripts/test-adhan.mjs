import * as adhan from 'adhan'

console.log('[v0] adhan keys:', Object.keys(adhan))
console.log('[v0] CalculationMethod keys:', Object.keys(adhan.CalculationMethod))

try {
  const coords = new adhan.Coordinates(6.8013, -58.1551)
  const params = adhan.CalculationMethod.Egyptian()
  const pt = new adhan.PrayerTimes(coords, new Date(), params)
  console.log('[v0] Fajr:', pt.fajr.toISOString())
  console.log('[v0] Dhuhr:', pt.dhuhr.toISOString())
  console.log('[v0] SUCCESS - adhan library works')
} catch (err) {
  console.error('[v0] ERROR:', err.message)
}
