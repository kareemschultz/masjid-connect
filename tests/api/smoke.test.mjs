import test from 'node:test'
import assert from 'node:assert/strict'
const base = process.env.TEST_BASE_URL
const checks = [
  ['/api/config', [200]],
  ['/api/push/vapid-public-key', [200, 503]],
  ['/api/announcements', [200, 500]],
  ['/api/community/feed', [200, 500]],
  ['/api/community/dua-board', [200, 500]],
  ['/api/community/khatam', [200, 500]],
  ['/api/quran/page?page=1', [200, 502]],
  ['/api/quran/surah/1', [200, 502]],
  ['/api/tracking', [401, 500]],
  ['/api/user/profile', [401, 500]],
  ['/api/user/role', [401, 500]],
  ['/api/friends', [401, 500]],
  ['/api/leaderboard', [401, 500]],
]
for (const [path, allowed] of checks) {
  test(`GET ${path} smoke`, async () => {
    const res = await fetch(`${base}${path}`)
    assert.ok(allowed.includes(res.status), `Unexpected ${res.status} for ${path}`)
  })
}
