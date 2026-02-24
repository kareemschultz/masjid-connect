import { spawn, execSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'

const testTarget = process.argv[2] || 'tests'
const files = execSync(`find ${testTarget} -name '*.test.mjs' | sort`).toString().trim().split('\n').filter(Boolean)
if (!files.length) throw new Error(`No test files found in ${testTarget}`)

const port = process.env.TEST_PORT || String(3200 + Math.floor(Math.random()*200))
try { rmSync('.next/dev/lock') } catch {}
const child = spawn('npm', ['run', 'dev', '--', '--port', port], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'test' },
})
let ready = false
child.stdout.on('data', (d) => {
  const s = d.toString(); process.stdout.write(s)
  if (s.includes('Ready') || s.includes('ready')) ready = true
})
child.stderr.on('data', (d) => process.stderr.write(d.toString()))
for (let i=0;i<120 && !ready;i++) await delay(500)
if (!ready) { child.kill('SIGTERM'); throw new Error('Next server did not start in time') }

const t = spawn('node', ['--test', ...files], {
  stdio: 'inherit',
  env: { ...process.env, TEST_BASE_URL: `http://127.0.0.1:${port}` },
})
const code = await new Promise((resolve) => t.on('close', resolve))
child.kill('SIGTERM')
process.exit(code ?? 1)
