# 🚀 Damday Village - Complete Deployment Guide

This guide provides complete instructions for deploying the Damday Village application to Caprover or any Docker-based hosting platform.

## 📋 Prerequisites

- Caprover server installed and configured
- PostgreSQL database (for production) or SQLite (for development)
- Domain name (optional but recommended)

## 🔧 Environment Variables

Set these environment variables in your Caprover app settings:

### Required Variables

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"

# For SQLite (development only)
# DATABASE_URL="file:./prisma/dev.db"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-random-secret-here"

# Generate a secure secret with:
# openssl rand -base64 32
```

### Optional Variables

```bash
# Node Environment
NODE_ENV="production"

# Disable Next.js telemetry
NEXT_TELEMETRY_DISABLED=1
```

## 🐳 Automatic Deployment with Caprover

### Option 1: One-Click Deploy (Recommended)

1. **Create a new app in Caprover**
   ```bash
   # From your local machine
   npm install -g caprover
   caprover login
   caprover deploy
   ```

2. **Set environment variables** in the Caprover dashboard:
   - Go to Apps → Your App → App Configs → Environment Variables
   - Add all required variables listed above

3. **Enable HTTPS** (recommended):
   - Go to Apps → Your App → HTTP Settings
   - Enable HTTPS and add your domain

4. **Deploy!** The app will:
   - ✅ Build the Docker image
   - ✅ Generate Prisma client
   - ✅ Run database migrations automatically
   - ✅ Seed the database with initial data
   - ✅ Start the Next.js server

### Option 2: Manual Docker Deployment

```bash
# Build the image
docker build -t damday-village .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_URL="https://your-domain.com" \
  -e NEXTAUTH_SECRET="your-secret" \
  --name damday-village \
  damday-village
```

## 🗄️ Database Setup

### Automatic (Default)

The application automatically handles database setup on first deployment:

1. **Generates Prisma Client** - Creates the database client
2. **Runs Migrations** - Creates all tables and schema
3. **Seeds Data** - Populates with initial data including:
   - Admin user (admin@damdayvillage.com / admin123)
   - Product categories (6 categories)
   - Sample products (26 products)
   - Homestays (5 homestays)
   - Tours (4 tours)
   - Blog posts (6 posts)

### Manual Database Management

If you need to manually manage the database:

```bash
# Generate Prisma client
npm run prisma generate

# Push schema to database
npx prisma db push

# Seed database
npm run db:seed

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 🎯 Post-Deployment Checklist

- [ ] Application is accessible at your domain
- [ ] Admin login works (admin@damdayvillage.com / admin123)
- [ ] Homepage loads with all sections
- [ ] Marketplace displays products with filters
- [ ] Database is seeded with initial data
- [ ] HTTPS is enabled
- [ ] Environment variables are set correctly

## 🔐 Security Checklist

- [ ] Change default admin password immediately
- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS
- [ ] Set appropriate CORS policies
- [ ] Keep DATABASE_URL secret
- [ ] Regularly update dependencies

## 📊 Monitoring & Health Checks

The application includes built-in health monitoring:

- **Health Check Endpoint**: `https://your-domain.com/api/health`
- **Docker Health Check**: Automatic every 30 seconds
- **Start Period**: 40 seconds for database migration

### View Logs

In Caprover:
1. Go to Apps → Your App
2. Click on "App Logs" button
3. Monitor for any errors

### Common Issues

#### Database Connection Errors
```
❌ ERROR: DATABASE_URL environment variable is not set
```
**Solution**: Set DATABASE_URL in environment variables

#### Migration Failures
```
⚠️ Migrations failed, pushing schema directly...
```
**Solution**: This is normal for first deployment. The app will push schema directly.

#### Seeding Errors
```
⚠️ Seeding skipped or already done
```
**Solution**: This is normal if database is already seeded.

## 🔄 Updates & Redeployment

To deploy updates:

```bash
# Using Caprover CLI
caprover deploy

# Or push to your git repository if connected
git push origin main
```

The application will automatically:
1. Rebuild the Docker image
2. Run any new migrations
3. Restart the server

## 🎨 Features Included

### Homepage
- ✅ Modern responsive design with glass morphism
- ✅ Animated hero section with particles
- ✅ Interactive widgets (Quick Access, Recent Activity, Impact Counter)
- ✅ Testimonials section
- ✅ DamChain blockchain showcase
- ✅ Leadership section
- ✅ Full footer with links

### Marketplace
- ✅ Category filters
- ✅ Price range filters
- ✅ Availability filters
- ✅ Search functionality
- ✅ Sort options
- ✅ Product cards with discounts
- ✅ Sidebar widgets
- ✅ Statistics display

### Admin Panel
- ✅ Dashboard with statistics
- ✅ User management
- ✅ Product management (CRUD)
- ✅ Homestay management (CRUD)
- ✅ Tour management (CRUD)
- ✅ Blog management (CRUD)
- ✅ Settings management
- ✅ Secure authentication

### Authentication
- ✅ NextAuth.js integration
- ✅ Admin login working
- ✅ Session management
- ✅ Role-based access control

## 🌟 Default Admin Credentials

**Email**: admin@damdayvillage.com  
**Password**: admin123

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

## 📞 Support

For issues or questions:
- Check the logs in Caprover dashboard
- Review the deployment documentation
- Ensure all environment variables are set correctly

## 🎉 Success!

Your Damday Village application should now be:
- 🚀 Deployed and running
- 🗄️ Database configured and seeded
- 🔐 Admin panel accessible
- 🛒 Marketplace functional
- 🏡 Homestays and tours available
- 📝 Blog ready for content

Visit your domain and start exploring!
