import cron from 'node-cron'
import adhan from 'adhan'
import { sendPrayerPush, isRamadan } from './webpush'

const GEORGETOWN_COORDS = new adhan.Coordinates(6.8013, -58.1553)
const GUYANA_TZ_OFFSET = -4

let cachedPrayerDay = ''
let cachedPrayerTimes: Record<string, Date> | null = null

export function getTodayPrayerTimes(): Record<string, Date> | null {
  const now = new Date()
  const guyanaMs = now.getTime() + GUYANA_TZ_OFFSET * 3600000
  const guyanaDate = new Date(guyanaMs)
  const dayKey = guyanaDate.toISOString().slice(0, 10)

  if (cachedPrayerDay === dayKey && cachedPrayerTimes) return cachedPrayerTimes

  const params = adhan.CalculationMethod.MuslimWorldLeague()
  params.madhab = adhan.Madhab.Shafi

  const date = new Date(guyanaDate.getUTCFullYear(), guyanaDate.getUTCMonth(), guyanaDate.getUTCDate())
  const prayerTimes = new adhan.PrayerTimes(GEORGETOWN_COORDS, date, params)

  cachedPrayerTimes = {
    Fajr: prayerTimes.fajr,
    Sunrise: prayerTimes.sunrise,
    Dhuhr: prayerTimes.dhuhr,
    Asr: prayerTimes.asr,
    Maghrib: prayerTimes.maghrib,
    Isha: prayerTimes.isha,
  }
  cachedPrayerDay = dayKey
  console.log(`Prayer times computed for ${dayKey}:`, Object.fromEntries(
    Object.entries(cachedPrayerTimes).map(([k, v]) => [k, v.toISOString()])
  ))
  return cachedPrayerTimes
}

let sentToday = new Set<string>()
function resetSentTracker() {
  sentToday = new Set()
}

export function startPrayerScheduler() {
  // Reset sent tracker at midnight Guyana time (4:00 UTC)
  cron.schedule('0 4 * * *', resetSentTracker)

  cron.schedule('* * * * *', async () => {
    try {
      const times = getTodayPrayerTimes()
      if (!times) return
      const now = new Date()

      for (const prayer of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
        const prayerTime = times[prayer]
        if (!prayerTime) continue
        const diffMin = (prayerTime.getTime() - now.getTime()) / 60000
        if (diffMin >= -0.5 && diffMin < 0.5 && !sentToday.has(prayer)) {
          sentToday.add(prayer)
          await sendPrayerPush(prayer).catch(console.error)
        }
      }

      if (isRamadan() && times.Fajr) {
        const suhoorDiffMin = (times.Fajr.getTime() - now.getTime()) / 60000
        if (suhoorDiffMin >= 29.5 && suhoorDiffMin < 30.5 && !sentToday.has('suhoor')) {
          sentToday.add('suhoor')
          await sendPrayerPush('suhoor').catch(console.error)
        }
      }

      if (isRamadan() && times.Maghrib) {
        const iftaarDiffMin = (times.Maghrib.getTime() - now.getTime()) / 60000
        if (iftaarDiffMin >= -0.5 && iftaarDiffMin < 0.5 && !sentToday.has('iftaar')) {
          sentToday.add('iftaar')
          await sendPrayerPush('iftaar').catch(console.error)
        }
      }

      // ── Nawafil notifications ──────────────────────────────────────────
      // Ishraq = Sunrise + 20 minutes
      if (times.Sunrise && !sentToday.has('Ishraq')) {
        const ishraqTime = new Date(times.Sunrise.getTime() + 20 * 60000)
        const ishraqDiff = (ishraqTime.getTime() - now.getTime()) / 60000
        if (ishraqDiff >= -0.5 && ishraqDiff < 0.5) {
          sentToday.add('Ishraq')
          await sendPrayerPush('Ishraq').catch(console.error)
        }
      }

      // Duha = midpoint between Sunrise and Dhuhr
      if (times.Sunrise && times.Dhuhr && !sentToday.has('Duha')) {
        const duhaTime = new Date((times.Sunrise.getTime() + times.Dhuhr.getTime()) / 2)
        const duhaDiff = (duhaTime.getTime() - now.getTime()) / 60000
        if (duhaDiff >= -0.5 && duhaDiff < 0.5) {
          sentToday.add('Duha')
          await sendPrayerPush('Duha').catch(console.error)
        }
      }

      // Awabeen = Maghrib + 15 minutes
      if (times.Maghrib && !sentToday.has('Awabeen')) {
        const awabeenTime = new Date(times.Maghrib.getTime() + 15 * 60000)
        const awabeenDiff = (awabeenTime.getTime() - now.getTime()) / 60000
        if (awabeenDiff >= -0.5 && awabeenDiff < 0.5) {
          sentToday.add('Awabeen')
          await sendPrayerPush('Awabeen').catch(console.error)
        }
      }

      // Tahajjud = 2 hours before Fajr (last third of night)
      if (times.Fajr && !sentToday.has('Tahajjud')) {
        const tahajjudTime = new Date(times.Fajr.getTime() - 2 * 3600000)
        const tahajjudDiff = (tahajjudTime.getTime() - now.getTime()) / 60000
        if (tahajjudDiff >= -0.5 && tahajjudDiff < 0.5) {
          sentToday.add('Tahajjud')
          await sendPrayerPush('Tahajjud').catch(console.error)
        }
      }

      // Mon/Thu fasting reminder — sent evening BEFORE at Asr + 30 min
      // Monday fasting → notify Sunday; Thursday fasting → notify Wednesday
      if (times.Asr && !sentToday.has('FastingMonThu')) {
        const guyanaMs = now.getTime() + GUYANA_TZ_OFFSET * 3600000
        const guyanaDay = new Date(guyanaMs).getUTCDay() // 0=Sun..6=Sat
        // Sunday (0) → remind for Monday; Wednesday (3) → remind for Thursday
        if (guyanaDay === 0 || guyanaDay === 3) {
          const fastingReminderTime = new Date(times.Asr.getTime() + 30 * 60000)
          const fastingDiff = (fastingReminderTime.getTime() - now.getTime()) / 60000
          if (fastingDiff >= -0.5 && fastingDiff < 0.5) {
            sentToday.add('FastingMonThu')
            await sendPrayerPush('FastingMonThu').catch(console.error)
          }
        }
      }
    } catch (err: any) {
      console.error('Prayer notification cron error:', err.message)
    }
  })

  console.log('[PrayerScheduler] Cron jobs started')
}
