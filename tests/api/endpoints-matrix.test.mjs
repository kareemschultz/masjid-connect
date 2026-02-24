import test from 'node:test'
import assert from 'node:assert/strict'

const base = process.env.TEST_BASE_URL

const getChecks = [
  ['/api/health', [200]],
  ['/api/config', [200]],
  ['/api/announcements', [200, 500]],
  ['/api/community/feed', [200, 500]],
  ['/api/community/dua-board', [200, 500]],
  ['/api/community/khatam', [200, 500]],
  ['/api/push/vapid-public-key', [200, 503]],
  ['/api/quran/page?page=1', [200, 502]],
  ['/api/quran/surah/1', [200, 502]],
  ['/api/quran/surah?surah=1', [200, 502]],
  ['/api/submissions', [200, 500]],
  ['/api/submissions?date=2026-02-20', [200, 500]],
  ['/api/tracking', [401, 500]],
  ['/api/tracking/2026-02-20', [401, 500]],
  ['/api/user/profile', [401, 500]],
  ['/api/user/role', [401, 500]],
  ['/api/friends', [401, 500]],
  ['/api/leaderboard', [401, 500]],
  ['/api/stripe/subscription-status', [401, 500]],
]


for (const [path, statuses] of getChecks) {
  test(`GET ${path}`, async () => {
    const res = await fetch(`${base}${path}`)
    assert.ok(statuses.includes(res.status), `${path} => ${res.status}`)
  })
}

const mutationChecks = [
  ['POST', '/api/community/feed', { message: '' }, [400, 429, 500]],
  ['POST', '/api/community/feed/like', {}, [400, 500]],
  ['POST', '/api/community/dua-board', { message: '' }, [400, 429, 500]],
  ['POST', '/api/community/dua-board/react', {}, [400, 500]],
  ['POST', '/api/community/khatam', {}, [400, 500]],
  ['POST', '/api/events/submit', {}, [400, 429, 500]],
  ['POST', '/api/feedback', {}, [400, 429, 500]],
  ['POST', '/api/friends', {}, [401, 400, 500]],
  ['POST', '/api/friends/request', {}, [401, 400, 500]],
  ['POST', '/api/friends/123/accept', {}, [401, 404, 500]],
  ['DELETE', '/api/friends/123', undefined, [401, 200, 500]],
  ['POST', '/api/push/subscribe', {}, [400, 429, 500]],
  ['PATCH', '/api/push/preferences', {}, [400, 500]],
  ['POST', '/api/push/unsubscribe', {}, [400, 500]],
  ['POST', '/api/submissions', {}, [400, 429, 500]],
  ['POST', '/api/submissions/1/react', {}, [401, 400, 429, 500]],
  ['POST', '/api/tracking', {}, [401, 400, 500]],
  ['PUT', '/api/tracking/2026-02-20', {}, [401, 500]],
  ['PATCH', '/api/user/preferences', {}, [401, 500]],
  ['POST', '/api/announcements', {}, [401, 403, 400, 500]],
  ['DELETE', '/api/announcements/1', undefined, [401, 403, 200, 500]],
  ['POST', '/api/stripe/checkout-session', {}, [401, 400, 500]],
  ['POST', '/api/stripe/customer-portal', {}, [401, 500]],
  ['POST', '/api/stripe/webhook', {}, [400, 503, 500]],
]


for (const [method, path, body, statuses] of mutationChecks) {
  test(`${method} ${path}`, async () => {
    const opts = { method, headers: { 'Content-Type': 'application/json' } }
    if (body !== undefined) opts.body = JSON.stringify(body)
    const res = await fetch(`${base}${path}`, opts)
    assert.ok(statuses.includes(res.status), `${method} ${path} => ${res.status}`)
  })
}
