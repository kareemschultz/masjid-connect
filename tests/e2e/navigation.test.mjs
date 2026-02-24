import test from 'node:test'
import assert from 'node:assert/strict'
const base = process.env.TEST_BASE_URL

test('home page loads', async () => {
  const res = await fetch(base)
  assert.equal(res.status, 200)
  const text = await res.text()
  assert.match(text, /MasjidConnect|Islamic|Prayer/i)
})
