import https from 'https'
import http from 'http'

const NTFY_URL = process.env.NTFY_URL || 'http://172.20.0.12'
const NTFY_TOKEN = process.env.NTFY_TOKEN
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'masjidconnect-feedback'

export function sendNtfy({
  title,
  message,
  priority = 3,
  tags = [],
}: {
  title: string
  message: string
  priority?: number
  tags?: string[]
}) {
  if (!NTFY_TOKEN) return
  try {
    const body = Buffer.from(message)
    const url = new URL(`${NTFY_URL}/${NTFY_TOPIC}`)
    const isHttps = url.protocol === 'https:'
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NTFY_TOKEN}`,
        Title: title,
        Priority: String(priority),
        Tags: tags.join(','),
        'Content-Type': 'text/plain',
        'Content-Length': body.length,
      },
    }
    const req = (isHttps ? https : http).request(options, (res) => {
      if (res.statusCode !== 200) console.warn('ntfy response:', res.statusCode)
    })
    req.on('error', (e) => console.warn('ntfy error:', e.message))
    req.write(body)
    req.end()
  } catch (e: any) {
    console.warn('ntfy send failed:', e.message)
  }
}
