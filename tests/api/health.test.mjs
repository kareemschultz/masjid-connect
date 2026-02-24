import test from 'node:test'
import assert from 'node:assert/strict'
const base = process.env.TEST_BASE_URL

test('health endpoint returns ok', async () => {
  const res = await fetch(`${base}/api/health`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.status, 'ok')
})
