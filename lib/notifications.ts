/**
 * Push notification helpers for salah reminders,
 * Ramadan/iftaar reminders, and general alerts.
 *
 * This uses the browser Notification API and service workers
 * for PWA push notifications.
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (!('Notification' in window)) return false

  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'Notification' in window
}

export function getNotificationPermission(): string {
  if (typeof window === 'undefined') return 'default'
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

interface ScheduledNotification {
  title: string
  body: string
  icon?: string
  tag: string
  scheduledTime: Date
}

// In-memory scheduled notifications (for current session)
const scheduledTimers: Map<string, ReturnType<typeof setTimeout>> = new Map()

export function scheduleNotification(notification: ScheduledNotification): void {
  const now = new Date()
  const delay = notification.scheduledTime.getTime() - now.getTime()

  if (delay <= 0) return // Already past

  // Clear existing timer for this tag
  const existing = scheduledTimers.get(notification.tag)
  if (existing) clearTimeout(existing)

  const timer = setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/images/logo.jpg',
        tag: notification.tag,
        badge: '/images/logo.jpg',
      })
    }
    scheduledTimers.delete(notification.tag)
  }, delay)

  scheduledTimers.set(notification.tag, timer)
}

export function cancelNotification(tag: string): void {
  const timer = scheduledTimers.get(tag)
  if (timer) {
    clearTimeout(timer)
    scheduledTimers.delete(tag)
  }
}

export function cancelAllNotifications(): void {
  scheduledTimers.forEach((timer) => clearTimeout(timer))
  scheduledTimers.clear()
}

interface PrayerNotificationConfig {
  prayerName: string
  prayerTime: Date
  minutesBefore?: number
}

export function schedulePrayerNotification(config: PrayerNotificationConfig): void {
  const { prayerName, prayerTime, minutesBefore = 10 } = config

  // Schedule "upcoming" notification
  const reminderTime = new Date(prayerTime.getTime() - minutesBefore * 60 * 1000)
  scheduleNotification({
    title: `${prayerName} in ${minutesBefore} minutes`,
    body: `Prepare for ${prayerName} prayer. May Allah accept your worship.`,
    tag: `prayer-reminder-${prayerName.toLowerCase()}`,
    scheduledTime: reminderTime,
  })

  // Schedule "adhan" notification at exact time
  scheduleNotification({
    title: `${prayerName} Time`,
    body: `It's time for ${prayerName} prayer. Allahu Akbar.`,
    tag: `prayer-adhan-${prayerName.toLowerCase()}`,
    scheduledTime: prayerTime,
  })
}

export function scheduleIftaarNotification(iftaarTime: Date): void {
  // 15 minutes before iftaar
  const reminderTime = new Date(iftaarTime.getTime() - 15 * 60 * 1000)
  scheduleNotification({
    title: 'Iftaar in 15 minutes',
    body: 'Prepare your iftaar. The fast is almost complete. Alhamdulillah.',
    tag: 'iftaar-reminder',
    scheduledTime: reminderTime,
  })

  // At iftaar time
  scheduleNotification({
    title: 'Iftaar Time',
    body: 'Bismillah! It\'s time to break your fast. Allahumma inni laka sumtu wa bika aamantu wa ala rizqika aftartu.',
    tag: 'iftaar-time',
    scheduledTime: iftaarTime,
  })
}

export function scheduleSuhoorNotification(fajrTime: Date): void {
  // 45 minutes before Fajr for suhoor reminder
  const suhoorEnd = new Date(fajrTime.getTime() - 45 * 60 * 1000)
  scheduleNotification({
    title: 'Suhoor Reminder',
    body: 'Wake up for suhoor! Fajr is in 45 minutes. Eating suhoor is a blessed act.',
    tag: 'suhoor-reminder',
    scheduledTime: suhoorEnd,
  })
}
