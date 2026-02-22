import { readdir } from 'fs/promises'
import { resolve } from 'path'

async function check() {
  try {
    const dir = resolve(process.cwd(), 'node_modules/adhan')
    const files = await readdir(dir)
    console.log('adhan package found, files:', files.slice(0, 10))
  } catch (e) {
    console.log('adhan NOT FOUND in node_modules:', e.message)
  }
  
  try {
    const adhan = await import('adhan')
    console.log('adhan exports:', Object.keys(adhan).join(', '))
    const coords = new adhan.Coordinates(6.8013, -58.1551)
    const params = adhan.CalculationMethod.Egyptian()
    const pt = new adhan.PrayerTimes(coords, new Date(), params)
    console.log('Fajr:', pt.fajr.toISOString())
    console.log('Dhuhr:', pt.dhuhr.toISOString())
  } catch (e) {
    console.log('adhan import ERROR:', e.message)
  }
}

check()
