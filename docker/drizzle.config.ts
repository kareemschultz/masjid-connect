import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './docker/db/schema.ts',
  out: './docker/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
