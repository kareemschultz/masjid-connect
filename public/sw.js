// MasjidConnect GY — Service Worker for push notifications & offline

const CACHE_NAME = 'masjidconnect-v6'
const OFFLINE_URLS = ['/', '/quran', '/tracker', '/masjids', '/explore']

// Install — cache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Allow clients to force-activate an updated worker immediately.
self.addEventListener('message', (event) => {
  if (event?.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Fetch — network-first with cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request) || caches.match('/'))
    )
  }
})

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}

  const options = {
    body: data.body || 'Time for prayer',
    icon: '/images/logo.jpg',
    badge: '/images/logo.jpg',
    tag: data.tag || 'prayer-notification',
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
    actions: data.actions || [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title || 'MasjidConnect GY', options))
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin))
      if (existing) {
        existing.focus()
        if (event.notification.data?.url) existing.navigate(event.notification.data.url)
      } else {
        self.clients.openWindow(event.notification.data?.url || '/')
      }
    })
  )
})
