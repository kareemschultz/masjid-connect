import { createAuthClient } from 'better-auth/react'

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
})
