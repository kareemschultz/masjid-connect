#!/bin/bash
# MasjidConnect GY - Docker Deployment Setup
# Run this script before your first docker deployment to install DB dependencies

echo "Installing database dependencies..."
npm install drizzle-orm postgres bcryptjs
npm install -D drizzle-kit @types/bcryptjs

echo "Generating database migrations..."
npx drizzle-kit generate --config=docker/drizzle.config.ts

echo "Done! Now run: docker compose up -d --build"
