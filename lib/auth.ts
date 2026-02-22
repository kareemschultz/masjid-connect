import { betterAuth } from 'better-auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { username } from 'better-auth/plugins/username'
import { getPool } from './db'

export const auth = betterAuth({
  database: getPool(),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'https://masjidconnectgy.com/api/auth',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  plugins: [
    username(),
  ],
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  } : {}),
  user: {
    additionalFields: {
      displayName: { type: 'string', required: false, defaultValue: '' },
      community: { type: 'string', required: false, defaultValue: '' },
      ramadanStart: { type: 'string', required: false, defaultValue: '2026-02-19' },
      asrMadhab: { type: 'string', required: false, defaultValue: 'shafi' },
      phoneNumber: { type: 'string', required: false },
    },
  },
  trustedOrigins: [
    'https://masjidconnectgy.com',
    'http://localhost:5173',
  ],
  advanced: {
    cookiePrefix: 'mcgy',
    crossSubDomainCookies: { enabled: false },
    cookies: {
      session_token: {
        attributes: {
          sameSite: 'lax' as const,
          secure: true,
          path: '/',
        },
      },
    },
  },
})

export const { GET: authGET, POST: authPOST } = toNextJsHandler(auth)
