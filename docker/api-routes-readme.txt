MasjidConnect GY - API Routes for Docker/PostgreSQL Deployment
================================================================

When deploying with Docker + PostgreSQL, run these steps:

1. Install database dependencies:
   npm install drizzle-orm postgres bcryptjs
   npm install -D drizzle-kit @types/bcryptjs

2. Copy database files to the app:
   cp -r docker/db lib/db

3. Create API routes by copying from docker/api-routes/ to app/api/

4. Set the DATABASE_URL environment variable:
   export DATABASE_URL=postgresql://masjidconnect:masjidconnect_secure_pw@localhost:5432/masjidconnect

5. Push the schema to the database:
   npx drizzle-kit push --config=docker/drizzle.config.ts

6. Start Docker:
   docker compose up -d --build

The app will work in offline-first mode without PostgreSQL.
When PostgreSQL is available, data syncs to the database for durability.
