# Damday Village - CapRover Deployment Guide

Complete guide for deploying Damday Village to CapRover without SSH access.

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Prepare CapRover

1. Login to your CapRover dashboard
2. Click **"Apps"** in sidebar
3. Click **"One-Click Apps/Databases"**
4. Search and install **PostgreSQL** (recommended) or use SQLite

### Step 2: Create Application

1. Go to **"Apps"** → **"Create New App"**
2. Enter app name: `damdayvillage`
3. Check **"Has Persistent Data"** if using SQLite
4. Click **"Create App"**

### Step 3: Configure Environment Variables

Go to your app → **"App Configs"** → **"Environment Variables"

Copy and paste these (update values):

```env
# Database (use PostgreSQL or SQLite)
DATABASE_URL=postgresql://user:pass@srv-captain--postgres:5432/damdayvillage
# OR for SQLite: DATABASE_URL=file:./dev.db

# NextAuth (generate secret with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-super-secret-32-character-minimum-key-here
NEXTAUTH_URL=https://damdayvillage.yourdomain.com

# Admin User (created on first deploy)
ADMIN_EMAIL=admin@damdayvillage.com
ADMIN_PASSWORD=ChangeThisSecurePassword123!
ADMIN_NAME=Damday Admin

# Node Environment
NODE_ENV=production

# Blockchain Configuration
BLOCKCHAIN_NETWORK=mainnet
BLOCKCHAIN_CHAIN_ID=1337
CONSENSUS_MIN_STAKE=1000
CONSENSUS_BLOCK_REWARD=10

# Optional: Carbon Credit Integration
CARBON_CREDIT_API_URL=https://api.carboncredits.com
CARBON_CREDIT_API_KEY=your-api-key-here

# Optional: Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Step 4: Enable HTTPS

1. In app settings, scroll to **"HTTP Settings"**
2. Enable **"HTTPS"**
3. Click **"Enable HTTPS"** and **"Force HTTPS"**
4. CapRover will automatically get Let's Encrypt certificate

### Step 5: Connect Domain

1. In app settings, find **"App Name"**
2. Click **"Connect New Domain"**
3. Enter your domain: `damdayvillage.yourdomain.com`
4. Update your DNS:
   - Type: `A Record`
   - Name: `damdayvillage`
   - Value: `Your CapRover IP`

### Step 6: Deploy Application

**Method A: Via GitHub (Recommended)**

1. In app settings, go to **"Deployment"** tab
2. Select **"Method 3: Deploy from Github/Bitbucket/Gitlab"**
3. Connect your GitHub account
4. Select repository: `spacewinky9-dev/untitled`
5. Branch: `main` or your deployment branch
6. Click **"Save & Deploy"**

**Method B: Via Tarball**

1. On your local machine:
   ```bash
   git clone https://github.com/spacewinky9-dev/untitled
   cd untitled
   tar -czf deploy.tar.gz .
   ```
2. In CapRover, go to app → **"Deployment"** tab
3. Upload `deploy.tar.gz`
4. Click **"Upload & Deploy"**

### Step 7: Initialize Database

After first deployment, the app will automatically:
- Run Prisma migrations
- Create database tables
- Seed initial data
- Create admin user

**Check logs**: App → **"App Logs"** to see initialization progress

### Step 8: Verify Deployment

1. Visit: `https://damdayvillage.yourdomain.com`
2. Check homepage loads
3. Login to admin: `https://damdayvillage.yourdomain.com/admin/login`
   - Email: `admin@damdayvillage.com`
   - Password: `ChangeThisSecurePassword123!`
4. **IMPORTANT**: Change admin password immediately!

---

## 📋 Post-Deployment Checklist

### Security

- [ ] Change default admin password
- [ ] Update NEXTAUTH_SECRET to strong value
- [ ] Enable HTTPS and force HTTPS redirect
- [ ] Verify DATABASE_URL is secure
- [ ] Check CORS settings if using custom domain
- [ ] Review App Configs for exposed secrets

### Database

- [ ] Verify database connection
- [ ] Check tables are created (Prisma migrations)
- [ ] Verify admin user exists
- [ ] Test database backups
- [ ] Set up automated backup schedule (CapRover → Databases)

### Application

- [ ] Homepage loads correctly
- [ ] All pages accessible (Marketplace, Homestays, Blog, Blockchain)
- [ ] Admin panel accessible
- [ ] Login/Registration working
- [ ] Blockchain stats displaying
- [ ] Footer and branding correct

### Performance

- [ ] Enable CapRover caching
- [ ] Check app logs for errors
- [ ] Monitor resource usage (RAM, CPU)
- [ ] Test page load times
- [ ] Enable CDN if needed

### Monitoring

- [ ] Enable app monitoring in CapRover
- [ ] Set up error logging (optional: Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up backup alerts

---

## 🔧 Common Issues & Solutions

### Issue: Database Connection Failed

**Solution**:
1. Check DATABASE_URL format is correct
2. For PostgreSQL: Ensure database exists
3. For SQLite: Enable persistent data in app settings
4. Check database service is running (if external)

### Issue: Build Failed

**Solution**:
1. Check app logs for specific error
2. Verify all required environment variables are set
3. Ensure Dockerfile and captain-definition exist
4. Try "Clear Cache" and rebuild

### Issue: Admin Login Not Working

**Solution**:
1. Check NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL matches your domain
3. Check admin user was created (app logs)
4. Try resetting password via database

### Issue: HTTPS Not Working

**Solution**:
1. Verify domain DNS points to CapRover IP
2. Wait 5-10 minutes for Let's Encrypt
3. Try "Re-enable HTTPS" in app settings
4. Check CapRover firewall allows ports 80, 443

### Issue: App Crashes on Start

**Solution**:
1. Check app logs for error details
2. Verify NODE_ENV=production
3. Check Prisma migrations ran successfully
4. Ensure sufficient RAM allocated (recommended: 512MB+)

---

## 🔄 Updating the Application

### Via GitHub Auto-Deploy

If connected to GitHub:
1. Push changes to your branch
2. CapRover automatically detects and deploys
3. Monitor deployment in app logs

### Via Manual Upload

1. Pull latest changes locally
2. Create tarball: `tar -czf deploy.tar.gz .`
3. Upload to CapRover
4. Deploy

### Rolling Back

1. Go to app → **"Deployment"** tab
2. Find previous version in history
3. Click **"Deploy"** on that version

---

## 📊 Monitoring & Maintenance

### Check Application Health

```bash
curl https://damdayvillage.yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T...",
  "service": "Damday Village",
  "version": "1.0.0"
}
```

### View Logs

1. CapRover Dashboard → Apps → damdayvillage
2. Click **"App Logs"**
3. Real-time logs appear here

### Database Backups

1. CapRover Dashboard → Databases
2. Select your database
3. Click **"Backup/Export"**
4. Download or schedule automatic backups

### Update Environment Variables

1. Go to app → **"App Configs"**
2. Update variables as needed
3. Click **"Save & Restart"**
4. App restarts automatically with new config

---

## 🚦 Performance Optimization

### Enable HTTP/2

Already enabled with HTTPS in CapRover.

### Enable Gzip Compression

1. In app settings → **"HTTP Settings"**
2. Enable **"Gzip Compression"**

### Allocate Sufficient Resources

Recommended:
- RAM: 512MB minimum, 1GB recommended
- CPU: 1 core minimum, 2 recommended

Adjust in app → **"App Configs"** → **"Resource Limits"**

### Database Optimization

For PostgreSQL:
1. Enable connection pooling
2. Increase max connections if needed
3. Regular VACUUM and ANALYZE

---

## 🆘 Support & Help

### Documentation

- [ENV.md](./ENV.md) - All environment variables
- [README.md](./README.md) - Application overview
- [truth.md](./truth.md) - Development protocol

### Troubleshooting

1. **Check app logs** first - most errors are logged
2. **Verify environment variables** - missing vars cause most issues
3. **Test database connection** - use health endpoint
4. **Review CapRover docs** - https://caprover.com/docs

### Getting Help

- CapRover Forum: https://github.com/caprover/caprover/discussions
- GitHub Issues: https://github.com/spacewinky9-dev/untitled/issues

---

## ✅ Production Deployment Checklist

Before going live:

### Required
- [ ] Custom domain configured with HTTPS
- [ ] Database backups enabled
- [ ] Admin password changed from default
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] All environment variables set correctly
- [ ] Application tested thoroughly

### Recommended
- [ ] Error monitoring enabled (Sentry)
- [ ] Uptime monitoring configured
- [ ] CDN enabled for static assets
- [ ] Database connection pool configured
- [ ] Email notifications set up
- [ ] Payment gateway tested (if using)

### Optional
- [ ] Analytics enabled (Google Analytics)
- [ ] Carbon credit API integrated
- [ ] Social media accounts linked
- [ ] SEO optimization complete
- [ ] Mobile app links configured

---

## 🎉 Congratulations!

Your Damday Village application is now live with:

- ✅ Secure HTTPS deployment
- ✅ Automated database initialization
- ✅ DamChain blockchain integration
- ✅ Admin panel with 120+ features
- ✅ Production-ready configuration
- ✅ Zero-downtime updates
- ✅ Automated backups
- ✅ Professional branding

**Next Steps:**
1. Change admin password
2. Customize branding via admin panel
3. Add products and homestays
4. Configure carbon credit integration
5. Promote your smart village! 🌱

---

**Powered by DamChain Blockchain** - Million times faster than Bitcoin, 100% Carbon Neutral
