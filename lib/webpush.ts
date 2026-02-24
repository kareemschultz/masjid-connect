import webpush from 'web-push'
import { getPool } from './db'

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@masjidconnectgy.com'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
  console.log('Web Push VAPID keys configured')
} else {
  console.warn('VAPID keys not set — push notifications disabled')
}

const GUYANA_TZ_OFFSET = -4

const RAMADAN_START = new Date('2026-02-18')
const RAMADAN_END = new Date('2026-03-21')

export function isRamadan() {
  const now = new Date(Date.now() + GUYANA_TZ_OFFSET * 3600000)
  return now >= RAMADAN_START && now <= RAMADAN_END
}

export const PRAYER_NOTIF_CONFIG: Record<string, { title: string; body: string; tag: string }> = {
  Fajr: { title: '🌅 Fajr Adhan', body: 'Time for Fajr prayer.\nAllahu Akbar — rise and shine!', tag: 'prayer-fajr' },
  Dhuhr: { title: '☀️ Dhuhr Adhan', body: 'Time for Dhuhr prayer.\nTake a break and pray.', tag: 'prayer-dhuhr' },
  Asr: { title: '🌤️ Asr Adhan', body: "Time for Asr prayer.\nDon't let the afternoon pass without salah.", tag: 'prayer-asr' },
  Maghrib: { title: '🌇 Maghrib Adhan', body: 'Time for Maghrib prayer.', tag: 'prayer-maghrib' },
  Isha: { title: '🌙 Isha Adhan', body: 'Time for Isha prayer.\nEnd your day with salah.', tag: 'prayer-isha' },
  suhoor: { title: '🍽️ Suhoor Reminder', body: 'Fajr is in 30 minutes!\nEat and drink before the fast begins.\nاللَّهُمَّ إِنِّي لَكَ صُمْتُ', tag: 'suhoor-reminder' },
  iftaar: { title: '🎉 Iftaar Time!', body: 'Break your fast!\nاللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ\nDates · Water · Maghrib prayer', tag: 'iftaar-now' },
  Ishraq: { title: '🌅 Ishraq Time', body: 'The sun has fully risen. Pray 2 rak\'ah Ishraq now for the reward of Hajj & Umrah! (Sunrise + 20 min)', tag: 'nawafil-ishraq' },
  Duha: { title: '☀️ Duha Prayer', body: 'Time for Duha prayer (Chaste prayer). 2–8 rak\'ah. Best time: mid-morning.', tag: 'nawafil-duha' },
  Awabeen: { title: '🌅 Awabeen Prayer', body: 'Time for Awabeen (6 rak\'ah after Maghrib). Pray with humility and ask Allah for forgiveness and mercy.', tag: 'nawafil-awabeen' },
  Tahajjud: { title: '🌙 Last Third of Night', body: 'Allah descends to the lowest heaven: "Who calls upon Me that I may answer?" Rise for Tahajjud!', tag: 'nawafil-tahajjud' },
  FastingMonThu: { title: '📅 Fasting Tomorrow', body: "Tomorrow is Monday. The Prophet ﷺ fasted on Mondays. Consider fasting today's intention tonight.", tag: 'fasting-mon-thu' },
}

export function parseNotifPrefs(sub: any): Record<string, boolean> {
  if (!sub.notification_prefs) return {}
  if (typeof sub.notification_prefs === 'object') return sub.notification_prefs
  try { return JSON.parse(sub.notification_prefs) } catch { return {} }
}

export async function sendPrayerPush(prayerKey: string) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return

  const config = PRAYER_NOTIF_CONFIG[prayerKey]
  if (!config) return

  let { title, body, tag } = config
  if (prayerKey === 'Maghrib' && isRamadan()) {
    title = '🌇 Maghrib — Iftaar Time!'
    body = "Break your fast!\nاللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ\nAllahumma laka sumtu wa 'ala rizqika aftartu"
  }

  const payload = JSON.stringify({
    title, body, tag,
    url: prayerKey === 'iftaar' ? '/duas' : '/ramadan',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [200, 100, 200],
  })

  const pool = getPool()
  let subs: any[]
  try {
    const result = await pool.query('SELECT * FROM push_subscriptions WHERE active = true')
    subs = result.rows
  } catch (err: any) {
    console.error('Failed to fetch push subscriptions:', err.message)
    return
  }

  const filtered = subs.filter((sub) => {
    const prefs = parseNotifPrefs(sub)
    if (!Object.keys(prefs).length) return true
    return prefs[prayerKey] !== false
  })

  if (!filtered.length) return
  console.log(`Sending ${prayerKey} push to ${filtered.length}/${subs.length} subscribers`)

  const sendPromises = filtered.map(async (sub) => {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
        { TTL: 1800 }
      )
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await pool.query('UPDATE push_subscriptions SET active = false WHERE id = $1', [sub.id])
      } else {
        console.error(`Push failed for sub ${sub.id}:`, err.message)
      }
    }
  })

  await Promise.allSettled(sendPromises)
}
