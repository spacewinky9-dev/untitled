# Environment Variables for CapRover Deployment

This document lists all required environment variables for deploying Damday Village to CapRover.

## 🔐 Required Environment Variables

### Database Configuration
```env
# Database URL for Prisma ORM (SQLite for development, PostgreSQL for production)
DATABASE_URL="postgresql://username:password@host:5432/damdayvillage?schema=public"

# Alternative for PostgreSQL connection pool
# DATABASE_URL="postgresql://username:password@host:5432/damdayvillage?schema=public&connection_limit=10&pool_timeout=20"
```

### NextAuth Authentication
```env
# NextAuth Secret - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-super-secret-key-here-minimum-32-characters-long"

# Application URL (replace with your actual domain)
NEXTAUTH_URL="https://damdayvillage.yourdomain.com"

# Optional: Auth debugging
# NEXTAUTH_DEBUG=true
```

### Admin Credentials (Initial Setup)
```env
# Default admin user (created on first deployment)
ADMIN_EMAIL="admin@damdayvillage.com"
ADMIN_PASSWORD="change-this-secure-password-123"
ADMIN_NAME="Damday Admin"
```

### Blockchain Configuration
```env
# DamChain Network Configuration
BLOCKCHAIN_NETWORK="mainnet"
BLOCKCHAIN_RPC_URL="https://damchain-rpc.yourdomain.com"
BLOCKCHAIN_CHAIN_ID="1337"

# Consensus Settings
CONSENSUS_MIN_STAKE="1000"
CONSENSUS_BLOCK_REWARD="10"
CONSENSUS_PROOF_DIFFICULTY="1"

# Gas Price Optimization
AI_GAS_OPTIMIZATION_ENABLED="true"
AI_MODEL_CONFIDENCE_THRESHOLD="0.95"

# MEV Protection
MEV_PROTECTION_ENABLED="true"
MEV_ENCRYPTED_MEMPOOL="true"
```

### Carbon Credit Integration
```env
# Carbon Credit API Configuration
CARBON_CREDIT_API_URL="https://api.carboncredits.com"
CARBON_CREDIT_API_KEY="your-carbon-credit-api-key"
CARBON_CREDIT_VERIFICATION_ENABLED="true"

# Ledger Integration
CARBON_LEDGER_URL="https://ledger.damdayvillage.com"
CARBON_LEDGER_API_KEY="your-ledger-api-key"
```

### File Upload Configuration
```env
# Image upload settings
UPLOAD_MAX_SIZE="10485760"  # 10MB in bytes
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/webp"
UPLOAD_DIR="/app/public/uploads"

# Optional: Use external storage (S3/MinIO)
# S3_BUCKET="damday-uploads"
# S3_REGION="us-east-1"
# S3_ACCESS_KEY="your-access-key"
# S3_SECRET_KEY="your-secret-key"
# S3_ENDPOINT="https://s3.amazonaws.com"
```

### Email Configuration (Optional)
```env
# SMTP Configuration for notifications
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@damdayvillage.com"
SMTP_PASS="your-email-password"
SMTP_FROM="Damday Village <noreply@damdayvillage.com>"
```

### Payment Gateway (Optional)
```env
# Razorpay Integration
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

### Analytics & Monitoring
```env
# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Application Monitoring
SENTRY_DSN="https://xxx@sentry.io/xxx"
SENTRY_ENVIRONMENT="production"
```

### Application Settings
```env
# Node Environment
NODE_ENV="production"

# Application Port (CapRover handles this automatically)
PORT="3000"

# Feature Flags
ENABLE_REGISTRATION="true"
ENABLE_MARKETPLACE="true"
ENABLE_HOMESTAYS="true"
ENABLE_BLOCKCHAIN="true"
ENABLE_CARBON_CREDITS="true"

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="60000"
```

### Security Configuration
```env
# CORS Origins (comma-separated)
CORS_ORIGINS="https://damdayvillage.com,https://www.damdayvillage.com"

# Security Headers
SECURITY_CSP_ENABLED="true"
SECURITY_HSTS_ENABLED="true"

# API Rate Limiting
API_RATE_LIMIT="100"
API_RATE_WINDOW="15"  # minutes
```

### Blockchain Swap & Exchange Features
```env
# DEX Configuration
DEX_ENABLED="true"
DEX_ROUTER_ADDRESS="0x..."
DEX_FACTORY_ADDRESS="0x..."

# Supported Token Pairs
SWAP_PAIRS="DAM/USDT,DAM/ETH,DAM/BTC"
SWAP_MIN_AMOUNT="1"
SWAP_MAX_SLIPPAGE="0.5"

# Liquidity Pool
LIQUIDITY_POOL_ENABLED="true"
LIQUIDITY_MIN_DEPOSIT="100"
```

---

## 📋 CapRover Setup Instructions

### 1. Create New Application
```bash
# Login to CapRover
# Create new app: "damdayvillage"
# Enable HTTPS with Let's Encrypt
```

### 2. Set Environment Variables
Go to your app → **App Configs** → **Environment Variables**

Copy all required variables from above sections and paste them.

### 3. Database Setup
```bash
# Create PostgreSQL database in CapRover
# Or use external database service (recommended for production)
# Update DATABASE_URL with actual connection string
```

### 4. Deploy Application
```bash
# Method 1: Via GitHub (Recommended)
# Connect your GitHub repository
# Enable automatic deployments on push

# Method 2: Via Captain Definition
# Create captain-definition file in repository root
```

### 5. Run Initial Setup
After first deployment, the application will automatically:
- Initialize database schema (Prisma migrations)
- Create admin user with ADMIN_EMAIL and ADMIN_PASSWORD
- Set up blockchain network
- Configure default settings

---

## 🔒 Security Best Practices

1. **Change Default Passwords**: Update ADMIN_PASSWORD immediately after first login
2. **Use Strong Secrets**: Generate NEXTAUTH_SECRET with minimum 32 characters
3. **Enable HTTPS**: Always use SSL certificates (Let's Encrypt via CapRover)
4. **Restrict CORS**: Set CORS_ORIGINS to your actual domain only
5. **Regular Backups**: Set up automatic database backups
6. **Monitor Logs**: Enable Sentry or similar monitoring
7. **Update Dependencies**: Keep packages up to date
8. **API Keys**: Store sensitive keys securely, never commit to Git

---

## 🚀 Production Checklist

- [ ] All environment variables configured
- [ ] Database connected and migrated
- [ ] Admin user created and password changed
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Custom domain configured
- [ ] Email notifications working
- [ ] Blockchain network initialized
- [ ] Carbon credit API connected
- [ ] Payment gateway tested (if applicable)
- [ ] Backup strategy configured
- [ ] Monitoring and logging enabled
- [ ] Rate limiting configured
- [ ] Security headers enabled

---

## 📞 Support

For deployment issues or questions:
- Check CapRover logs: `captain-logs damdayvillage`
- Review application logs in CapRover dashboard
- Verify all environment variables are set correctly
- Ensure database is accessible

---

## 🔄 Updating Environment Variables

To update environment variables after deployment:
1. Go to CapRover Dashboard
2. Select your app (damdayvillage)
3. Click "App Configs" tab
4. Update "Environment Variables" section
5. Click "Save & Restart"

The application will restart with new configuration automatically.
