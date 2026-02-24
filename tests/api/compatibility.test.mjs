import test from 'node:test'
import assert from 'node:assert/strict'
const base = process.env.TEST_BASE_URL

test('quran surah query compatibility route exists', async () => {
  const res = await fetch(`${base}/api/quran/surah?surah=1`)
  assert.notEqual(res.status, 404)
})

test('friends request compatibility route exists', async () => {
  const res = await fetch(`${base}/api/friends/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com' }),
  })
  assert.notEqual(res.status, 404)
})
