#!/bin/bash
set -e

echo "🚀 Database Setup Script"
echo "========================"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set, using default: file:./prisma/dev.db"
  export DATABASE_URL="file:./prisma/dev.db"
fi

echo "📦 DATABASE_URL: $DATABASE_URL"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Push database schema
echo "📤 Pushing database schema..."
npx prisma db push --skip-generate

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "🎉 You can now start the application with: npm run dev"
echo ""
echo "📝 Admin credentials:"
echo "   Email: admin@damdayvillage.com"
echo "   Password: admin123"
