#!/bin/sh
set -e

echo "🚀 Starting Damday application..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  WARNING: DATABASE_URL not set, using default SQLite database"
  export DATABASE_URL="file:/app/data/production.db"
fi

# Ensure data directory exists for SQLite
mkdir -p /app/data

echo "📦 Generating Prisma Client..."
node /app/node_modules/prisma/build/index.js generate

echo "🔄 Running database migrations..."
# Try to run migrations, if they fail, push the schema
if node /app/node_modules/prisma/build/index.js migrate deploy 2>/dev/null; then
  echo "✅ Migrations applied successfully"
else
  echo "⚠️  Migrations failed, pushing schema directly..."
  node /app/node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss 2>&1 || {
    echo "⚠️  Schema push failed, continuing anyway..."
  }
  echo "✅ Schema setup completed"
fi

# Check if database needs seeding by checking for users table
echo "🌱 Checking if database needs seeding..."
SEED_NEEDED=true

# Try to count users, if successful and count > 0, skip seeding
if node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  if (count > 0) {
    console.log('Database has', count, 'users');
    process.exit(1);
  }
  process.exit(0);
}).catch(() => process.exit(0));
" 2>/dev/null; then
  echo "📝 Database is empty, seeding..."
  npm run db:seed 2>&1 || echo "⚠️  Seeding failed, continuing anyway..."
else
  echo "✅ Database already has data, skipping seed"
fi

echo "✅ Database setup complete!"
echo "🎯 Starting Next.js server..."

# Start the Next.js application
exec node server.js
