import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://masjidconnectgy.com',
  'http://localhost:5173',
  'http://localhost:3000',
]

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const origin = request.headers.get('origin') || ''
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : (process.env.NODE_ENV === 'production' ? 'https://masjidconnectgy.com' : 'http://localhost:3000')

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,Cookie',
      },
    })
  }

  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie')
  return response
}

export const config = {
  matcher: '/api/:path*',
}
