# Damday Village - Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd untitled
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```
   
   Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```
   
   Or manually:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin/login
   
   **Default Admin Credentials:**
   - Email: `admin@damdayvillage.com`
   - Password: `admin123`

## Docker Deployment

### Build and Run with Docker

1. **Build the Docker image**
   ```bash
   docker build -t damday-village .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e DATABASE_URL="file:/app/data/production.db" \
     -e NEXTAUTH_URL="https://yourdomain.com" \
     -e NEXTAUTH_SECRET="your-production-secret" \
     -v damday-data:/app/data \
     --name damday-app \
     damday-village
   ```

3. **Check logs**
   ```bash
   docker logs -f damday-app
   ```

### Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:/app/data/production.db
      - NEXTAUTH_URL=https://yourdomain.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NODE_ENV=production
    volumes:
      - damday-data:/app/data
    restart: unless-stopped

volumes:
  damday-data:
```

Run with:
```bash
docker-compose up -d
```

## Production Deployment (Cloud Platforms)

### Environment Variables Required

- `DATABASE_URL` - Database connection string (SQLite: `file:/path/to/db.db`)
- `NEXTAUTH_URL` - Your application URL (e.g., `https://yourdomain.com`)
- `NEXTAUTH_SECRET` - Random secret key (generate with `openssl rand -base64 32`)
- `NODE_ENV` - Set to `production`

### Platform-Specific Guides

#### Railway
1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Railway will auto-detect the Dockerfile and deploy

#### Render
1. Create new Web Service
2. Connect repository
3. Select Docker as environment
4. Add environment variables
5. Deploy

#### DigitalOcean App Platform
1. Create new App
2. Select repository
3. Choose Dockerfile as source
4. Configure environment variables
5. Deploy

#### Vercel (Alternative without Docker)
```bash
npm install -g vercel
vercel
```

Note: For Vercel, you'll need to use a different database (PostgreSQL, MySQL, etc.) as SQLite doesn't work well with serverless.

## Database Configuration

### SQLite (Default - Development & Small Deployments)
```env
DATABASE_URL="file:./prisma/dev.db"
```

### PostgreSQL (Recommended for Production)
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // change from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

## Troubleshooting

### Issue: "DATABASE_URL must start with file:"
**Solution:** Ensure your DATABASE_URL for SQLite starts with `file:`, e.g., `file:./prisma/dev.db`

### Issue: "CSRF token missing"
**Solution:** Ensure NEXTAUTH_SECRET is set and NEXTAUTH_URL matches your domain

### Issue: JSON.parse errors in blog/homestay pages
**Solution:** This has been fixed in the latest version. Make sure you're running the latest code.

### Issue: Image 404 errors from WikiMedia
**Solution:** Images are configured to fail gracefully. You can replace placeholder images in the seed data.

### Issue: Database not seeding
**Solution:** Run manually:
```bash
npm run db:seed
```

Or check logs:
```bash
docker logs damday-app
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:setup` - Complete database setup (generate + push + seed)
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:migrate` - Run database migrations

## Features

- 🌱 100% Carbon-Free Village Management
- 🛒 Organic Marketplace
- 🏡 Homestay Booking System
- 🗺️ Tour Management
- 📝 Blog & Content Management
- 👥 User Management
- 📊 Admin Dashboard
- 🔐 Secure Authentication
- 📱 Responsive Design

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

## License

This project is licensed under the MIT License.
