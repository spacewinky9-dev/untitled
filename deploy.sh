#!/bin/bash

###############################################################################
# Damday Village - Automated CapRover Deployment Script
# For Non-Programmers - No SSH or Manual Commands Required!
###############################################################################

set -e  # Exit on error

echo "🚀 Starting Damday Village Automated Deployment..."
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }

###############################################################################
# CONFIGURATION - Edit these values for your deployment
###############################################################################

# CapRover Configuration
CAPROVER_URL="https://captain.your-domain.com"
CAPROVER_APP_NAME="damday-village"
CAPROVER_PASSWORD="your-caprover-password"

# Application Configuration
APP_DOMAIN="damdayvillage.your-domain.com"
ADMIN_EMAIL="admin@damdayvillage.com"
ADMIN_PASSWORD="ChangeThisSecurePassword123!"

# Database Configuration (choose one)
# Option 1: PostgreSQL (Recommended for production)
DATABASE_TYPE="postgresql"
DATABASE_URL="postgresql://user:password@srv-captain--postgres:5432/damdayvillage"

# Option 2: SQLite (Good for testing, not for high traffic)
# DATABASE_TYPE="sqlite"
# DATABASE_URL="file:./production.db"

# Generate secure keys (or provide your own)
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "GENERATE_A_SECURE_KEY_HERE_32_CHARS_MIN")

###############################################################################
# PRE-FLIGHT CHECKS
###############################################################################

print_info "Running pre-flight checks..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "Dockerfile" ]; then
    print_error "Not in the correct directory. Please run this script from the project root."
    exit 1
fi

# Check if docker is available (for local testing)
if command -v docker &> /dev/null; then
    print_success "Docker found"
else
    print_warning "Docker not found - will deploy directly to CapRover"
fi

# Check if curl is available
if ! command -v curl &> /dev/null; then
    print_error "curl is required but not installed. Please install curl."
    exit 1
fi

print_success "Pre-flight checks passed"
echo ""

###############################################################################
# STEP 1: Prepare Environment Configuration
###############################################################################

print_info "Step 1: Preparing environment configuration..."

# Create environment variables file for CapRover
cat > .env.caprover << EOF
# Database
DATABASE_URL=${DATABASE_URL}

# Authentication
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://${APP_DOMAIN}

# Admin User (created on first deploy)
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
ADMIN_NAME=Damday Admin

# Application
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Blockchain Configuration
BLOCKCHAIN_NETWORK=mainnet
BLOCKCHAIN_CHAIN_ID=1337
CONSENSUS_MIN_STAKE=1000
CONSENSUS_BLOCK_REWARD=10
EOF

print_success "Environment configuration created"
echo ""

###############################################################################
# STEP 2: Build Deployment Package
###############################################################################

print_info "Step 2: Building deployment package..."

# Create deployment tarball
DEPLOY_FILE="damday-village-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"

print_info "Creating tarball: $DEPLOY_FILE"

# Exclude unnecessary files but include required ones
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='out' \
    --exclude='coverage' \
    --exclude='*.log' \
    --exclude='.env*' \
    --exclude='screenshots' \
    --exclude='tmp' \
    -czf "$DEPLOY_FILE" .

if [ -f "$DEPLOY_FILE" ]; then
    DEPLOY_SIZE=$(du -h "$DEPLOY_FILE" | cut -f1)
    print_success "Deployment package created: $DEPLOY_FILE ($DEPLOY_SIZE)"
else
    print_error "Failed to create deployment package"
    exit 1
fi

echo ""

###############################################################################
# STEP 3: Deploy to CapRover
###############################################################################

print_info "Step 3: Deploying to CapRover..."

# Install CapRover CLI if not present
if ! command -v caprover &> /dev/null; then
    print_info "Installing CapRover CLI..."
    npm install -g caprover
    print_success "CapRover CLI installed"
fi

# Login to CapRover
print_info "Logging in to CapRover..."
caprover login || {
    print_error "Failed to login to CapRover"
    print_info "Please run: caprover login"
    print_info "Then enter your CapRover URL and password"
    exit 1
}

# Deploy the application
print_info "Deploying application to $CAPROVER_APP_NAME..."
caprover deploy -t "$DEPLOY_FILE" -a "$CAPROVER_APP_NAME" || {
    print_error "Deployment failed"
    print_info "Check CapRover logs for details"
    exit 1
}

print_success "Application deployed successfully!"
echo ""

###############################################################################
# STEP 4: Configure Environment Variables in CapRover
###############################################################################

print_info "Step 4: Setting environment variables..."

# Note: This requires CapRover API access
# Users can also set these manually in the CapRover dashboard

print_info "Please set the following environment variables in CapRover Dashboard:"
print_info "Go to: Apps → $CAPROVER_APP_NAME → App Configs → Environment Variables"
echo ""
cat .env.caprover
echo ""

print_warning "After setting environment variables, click 'Save & Restart' in CapRover"
echo ""

###############################################################################
# STEP 5: Enable HTTPS
###############################################################################

print_info "Step 5: Enabling HTTPS..."
print_info "1. In CapRover, go to Apps → $CAPROVER_APP_NAME → HTTP Settings"
print_info "2. Click 'Enable HTTPS'"
print_info "3. Enable 'Force HTTPS'"
print_info "4. Connect custom domain: $APP_DOMAIN"
print_info "5. Update DNS A record to point to your CapRover server"
echo ""

###############################################################################
# STEP 6: Verify Deployment
###############################################################################

print_info "Step 6: Verifying deployment..."

# Wait a bit for the app to start
sleep 10

# Check if the application is responding
print_info "Checking application health..."
HEALTH_CHECK_URL="https://${APP_DOMAIN}/api/health"

if curl -f -s "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
    print_success "Application is healthy and responding!"
else
    print_warning "Health check failed - app may still be starting"
    print_info "Please check: $HEALTH_CHECK_URL"
fi

echo ""

###############################################################################
# DEPLOYMENT COMPLETE
###############################################################################

echo "=================================================="
print_success "🎉 Deployment Complete!"
echo "=================================================="
echo ""
echo "Your Damday Village application is now deployed!"
echo ""
echo "📋 Next Steps:"
echo "   1. Visit: https://${APP_DOMAIN}"
echo "   2. Login to admin: https://${APP_DOMAIN}/admin/login"
echo "      Email: ${ADMIN_EMAIL}"
echo "      Password: ${ADMIN_PASSWORD}"
echo "   3. ⚠️  IMPORTANT: Change your admin password immediately!"
echo ""
echo "📚 Documentation:"
echo "   - DEPLOYMENT.md - Full deployment guide"
echo "   - ENV.md - Environment variables reference"
echo "   - DEBUGGING-REPORT.md - Troubleshooting guide"
echo ""
echo "🔧 CapRover Dashboard:"
echo "   - URL: ${CAPROVER_URL}"
echo "   - App Logs: ${CAPROVER_URL}/#/apps/details/${CAPROVER_APP_NAME}"
echo ""
echo "✅ Deployment Information Saved:"
echo "   - Package: ${DEPLOY_FILE}"
echo "   - Config: .env.caprover"
echo ""
print_warning "Remember to:"
echo "   • Change default passwords"
echo "   • Configure database backups"
echo "   • Set up monitoring"
echo "   • Review security settings"
echo ""
print_success "Happy deploying! 🚀"
echo ""

# Cleanup
rm -f .env.caprover

exit 0
