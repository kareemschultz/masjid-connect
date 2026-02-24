const requests = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(ip: string, max: number, windowMs: number): boolean {
  if (process.env.NODE_ENV === 'test' || process.env.DISABLE_RATE_LIMIT === '1') {
    return true
  }
  const now = Date.now()
  const entry = requests.get(ip)
  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count++
  return true
}

export function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1'
}

export function rateLimitResponse() {
  return Response.json(
    { error: 'Too many requests, please try again later.' },
    { status: 429 }
  )
}
