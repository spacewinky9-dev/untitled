#!/bin/bash
# Deployment Verification Script
# Run this script after deployment to verify everything is working

echo "🔍 Damday Village Deployment Verification"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check status
check_status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
    ERRORS=$((ERRORS + 1))
  fi
}

check_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
  WARNINGS=$((WARNINGS + 1))
}

# 1. Check Environment Variables
echo "1. Checking Environment Variables..."
if [ -z "$DATABASE_URL" ]; then
  check_warning "DATABASE_URL not set - will use default"
else
  check_status 0 "DATABASE_URL is set"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  check_warning "NEXTAUTH_SECRET not set - authentication may fail"
else
  check_status 0 "NEXTAUTH_SECRET is set"
fi

if [ -z "$NEXTAUTH_URL" ]; then
  check_warning "NEXTAUTH_URL not set - will use default"
else
  check_status 0 "NEXTAUTH_URL is set"
fi
echo ""

# 2. Check Database
echo "2. Checking Database..."
if [ -f "./prisma/dev.db" ] || [ -f "/app/data/production.db" ]; then
  check_status 0 "Database file exists"
else
  check_warning "Database file not found - may need initialization"
fi
echo ""

# 3. Check Node Modules
echo "3. Checking Dependencies..."
if [ -d "./node_modules" ]; then
  check_status 0 "node_modules directory exists"
else
  check_status 1 "node_modules not found - run npm install"
fi
echo ""

# 4. Check Prisma Client
echo "4. Checking Prisma Client..."
if [ -d "./node_modules/.prisma" ] || [ -d "./node_modules/@prisma/client" ]; then
  check_status 0 "Prisma Client generated"
else
  check_warning "Prisma Client not found - run npm run db:generate"
fi
echo ""

# 5. Check Build Output
echo "5. Checking Build Output..."
if [ -d "./.next" ]; then
  check_status 0 "Next.js build output exists"
else
  check_status 1 "Build not found - run npm run build"
fi
echo ""

# 6. Check Configuration Files
echo "6. Checking Configuration Files..."
[ -f "./next.config.js" ] && check_status 0 "next.config.js exists" || check_status 1 "next.config.js missing"
[ -f "./prisma/schema.prisma" ] && check_status 0 "schema.prisma exists" || check_status 1 "schema.prisma missing"
[ -f "./package.json" ] && check_status 0 "package.json exists" || check_status 1 "package.json missing"
echo ""

# 7. Test Database Connection (if possible)
echo "7. Testing Database Connection..."
if command -v npx &> /dev/null; then
  if npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
    check_status 0 "Database connection successful"
  else
    check_warning "Could not connect to database - may need initialization"
  fi
else
  check_warning "npx not available - skipping database test"
fi
echo ""

# 8. Check for Common Issues
echo "8. Checking for Common Issues..."

# Check if DATABASE_URL has correct format for SQLite
if [[ ! -z "$DATABASE_URL" ]] && [[ "$DATABASE_URL" == *"sqlite"* ]] && [[ "$DATABASE_URL" != file:* ]]; then
  check_status 1 "DATABASE_URL format incorrect - must start with 'file:' for SQLite"
else
  check_status 0 "DATABASE_URL format is correct"
fi

# Check if running in Docker
if [ -f "/.dockerenv" ]; then
  echo -e "${GREEN}ℹ${NC} Running in Docker container"
  
  # Check data directory in Docker
  if [ -d "/app/data" ]; then
    check_status 0 "Docker data directory exists"
  else
    check_warning "Docker data directory missing - database may not persist"
  fi
fi
echo ""

# Summary
echo "=========================================="
echo "Verification Summary:"
echo ""
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed! Deployment looks good.${NC}"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠ $WARNINGS warning(s) found. Review above.${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Review warnings above"
  echo "  2. Set missing environment variables if needed"
  echo "  3. Run database setup if needed: npm run db:setup"
  exit 0
else
  echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
  echo ""
  echo "Fix these issues before deployment:"
  echo "  1. Install dependencies: npm install"
  echo "  2. Generate Prisma Client: npm run db:generate"
  echo "  3. Build application: npm run build"
  echo "  4. Setup database: npm run db:setup"
  exit 1
fi
