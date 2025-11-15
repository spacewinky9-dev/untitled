# Database Setup Guide

## Overview
The application automatically sets up the database on startup when running in Docker. The entrypoint script handles:
1. Generating Prisma Client
2. Running database migrations
3. Seeding initial data

## Environment Variables Required

### DATABASE_URL
PostgreSQL connection string in the format:
```
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

### NEXTAUTH_SECRET
A secure random string for NextAuth.js session encryption. Generate one using:
```bash
openssl rand -base64 32
```

### NEXTAUTH_URL
The full URL where your application is deployed:
```
NEXTAUTH_URL="https://yourdomain.com"
```

## Docker Deployment

The Docker image includes an entrypoint script that automatically:

1. **Validates DATABASE_URL** - Ensures the database connection string is set
2. **Generates Prisma Client** - Creates the database client for the current schema
3. **Runs Migrations** - Applies any pending database migrations
4. **Seeds Database** - Populates initial data (admin users, settings, etc.)
5. **Starts Application** - Launches the Next.js server

### Startup Process

When the container starts, you'll see:
```
🚀 Starting Damday application...
📦 Generating Prisma Client...
🔄 Running database migrations...
✅ Migrations applied successfully
🌱 Seeding database (if needed)...
✅ Database setup complete!
🎯 Starting Next.js server...
```

### Troubleshooting

#### "Table does not exist" errors
This occurs when:
- Database URL is incorrect
- Database is not accessible
- Migration/push failed during startup

**Solution**: Check container logs to see if the startup script completed successfully.

#### CSRF Token Errors
This occurs when:
- NEXTAUTH_SECRET is not set
- NEXTAUTH_URL doesn't match the actual deployment URL

**Solution**: Ensure both environment variables are properly set:
```bash
NEXTAUTH_SECRET="your-secure-random-string"
NEXTAUTH_URL="https://your-actual-domain.com"
```

#### Migration Failures
If migrations fail, the script will automatically fall back to `prisma db push` which synchronizes the schema directly.

## Default Admin Account

After seeding, you can log in with:
- **Email**: admin@damdayvillage.com
- **Password**: admin123

⚠️ **IMPORTANT**: Change this password immediately after first login in production!

## Manual Database Setup (Development)

For local development without Docker:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# OR push schema directly
npx prisma db push

# Seed database
npm run db:seed
```

## Database Schema Updates

When updating the Prisma schema:

1. Update `prisma/schema.prisma`
2. Create a migration:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```
3. The migration will be automatically applied on next deployment

## Health Check

The Docker container includes a health check that:
- Runs every 30 seconds
- Times out after 10 seconds
- Waits 40 seconds after startup (allows time for migrations)
- Retries 3 times before marking as unhealthy

This ensures the application is fully ready before receiving traffic.
