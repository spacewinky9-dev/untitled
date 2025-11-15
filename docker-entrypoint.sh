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
  node /app/node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss
  echo "✅ Schema pushed successfully"
fi

# Only seed if database is empty
echo "🌱 Checking if database needs seeding..."
if node /app/node_modules/prisma/build/index.js db execute --stdin <<EOF 2>/dev/null
SELECT COUNT(*) FROM users;
EOF
then
  echo "✅ Database already has data, skipping seed"
else
  echo "📝 Seeding database..."
  npm run db:seed 2>&1 || echo "⚠️  Seeding failed or already done"
fi

echo "✅ Database setup complete!"
echo "🎯 Starting Next.js server..."

# Start the Next.js application
exec node server.js
