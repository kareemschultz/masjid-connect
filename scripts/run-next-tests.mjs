import { spawn, execSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'
import { createServer } from 'node:net'

const testTarget = process.argv[2] || 'tests'
const files = execSync(`find ${testTarget} -name '*.test.mjs' | sort`).toString().trim().split('\n').filter(Boolean)
if (!files.length) throw new Error(`No test files found in ${testTarget}`)

async function getAvailablePort() {
  if (process.env.TEST_PORT) return Number(process.env.TEST_PORT)
  return await new Promise((resolve, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close()
        reject(new Error('Unable to resolve available port'))
        return
      }
      const { port } = address
      server.close((err) => (err ? reject(err) : resolve(port)))
    })
  })
}

async function stopProcess(child) {
  if (child.exitCode !== null) return
  child.kill('SIGTERM')
  for (let i = 0; i < 30; i++) {
    if (child.exitCode !== null) return
    await delay(100)
  }
  if (child.exitCode === null) child.kill('SIGKILL')
}

const port = String(await getAvailablePort())
try { rmSync('.next/dev/lock') } catch {}
const child = spawn('npm', ['run', 'dev', '--', '--port', port], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'test', DISABLE_RATE_LIMIT: '1' },
})
let ready = false
child.stdout.on('data', (d) => {
  const s = d.toString(); process.stdout.write(s)
  if (s.includes('Ready') || s.includes('ready')) ready = true
})
child.stderr.on('data', (d) => process.stderr.write(d.toString()))
try {
  for (let i = 0; i < 120 && !ready; i++) await delay(500)
  if (!ready) throw new Error('Next server did not start in time')

  const t = spawn('node', ['--test', ...files], {
    stdio: 'inherit',
    env: { ...process.env, TEST_BASE_URL: `http://127.0.0.1:${port}` },
  })
  const code = await new Promise((resolve) => t.on('close', resolve))
  process.exit(code ?? 1)
} finally {
  await stopProcess(child)
}
