#!/bin/sh
set -e

echo "🚀 Starting Damday application..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

echo "📦 Generating Prisma Client..."
node /app/node_modules/prisma/build/index.js generate

echo "🔄 Running database migrations..."
# Try to run migrations, if they fail, push the schema
if node /app/node_modules/prisma/build/index.js migrate deploy 2>/dev/null; then
  echo "✅ Migrations applied successfully"
else
  echo "⚠️  Migrations failed, pushing schema directly..."
  node /app/node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss
  echo "✅ Schema pushed successfully"
fi

echo "🌱 Seeding database (if needed)..."
# Only seed if needed, ignore errors if already seeded
node /app/node_modules/prisma/build/index.js db seed 2>/dev/null || echo "⚠️  Seeding skipped or already done"

echo "✅ Database setup complete!"
echo "🎯 Starting Next.js server..."

# Start the Next.js application
exec node server.js
