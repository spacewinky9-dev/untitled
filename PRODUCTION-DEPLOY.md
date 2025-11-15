# Production Deployment Checklist

## Pre-Deployment Steps

### 1. Environment Variables Setup
Create these environment variables in your deployment platform:

```bash
# Required Variables
DATABASE_URL="file:/app/data/production.db"  # For SQLite
# OR for PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

NEXTAUTH_URL="https://yourdomain.com"  # Your actual domain
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
NODE_ENV="production"
```

### 2. Generate Secure Secret
```bash
openssl rand -base64 32
```
Use the output as your `NEXTAUTH_SECRET`

### 3. Database Configuration

#### For SQLite (Simple deployments)
- Ensure `/app/data` directory is persistent (use volume mount)
- DATABASE_URL format: `file:/app/data/production.db`

#### For PostgreSQL (Recommended for production)
1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Remove SQLite-specific configurations if any

3. Run migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

## Docker Deployment

### Using Docker Compose (Recommended)

1. Create `docker-compose.prod.yml`:
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
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  damday-data:
    driver: local
```

2. Create `.env` file (DO NOT commit this):
```bash
NEXTAUTH_SECRET=your-secure-secret-here
```

3. Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Docker Commands

```bash
# Build
docker build -t damday-village:latest .

# Run
docker run -d \
  --name damday-app \
  -p 3000:3000 \
  -e DATABASE_URL="file:/app/data/production.db" \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  -e NEXTAUTH_SECRET="your-secret-here" \
  -e NODE_ENV="production" \
  -v damday-data:/app/data \
  --restart unless-stopped \
  damday-village:latest

# View logs
docker logs -f damday-app

# Check health
docker ps
curl http://localhost:3000/
```

## Cloud Platform Deployments

### Railway

1. **Connect Repository**
   - Go to Railway.app
   - Create new project
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Environment Variables**
   - Add `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
   - Railway will auto-detect Dockerfile

3. **Deploy**
   - Railway will automatically build and deploy
   - Access your app at the provided Railway domain
   - Set custom domain in settings

### Render

1. **Create Web Service**
   - Go to Render.com
   - New > Web Service
   - Connect your GitHub repository

2. **Configure**
   - Environment: Docker
   - Add environment variables
   - Set health check path: `/`

3. **Deploy**
   - Render will build and deploy automatically
   - Configure custom domain in settings

### DigitalOcean App Platform

1. **Create New App**
   - Go to DigitalOcean App Platform
   - Create App from GitHub

2. **Configure**
   - Detect Dockerfile automatically
   - Add environment variables
   - Set instance size (Basic $5/month minimum)

3. **Deploy**
   - Deploy from dashboard
   - Add custom domain in settings

### AWS (EC2)

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.small or larger
   - Open port 3000 (or 80/443 with reverse proxy)

2. **Install Docker**
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

3. **Deploy Application**
```bash
git clone <your-repo>
cd untitled
# Create .env with production values
docker-compose -f docker-compose.prod.yml up -d
```

4. **Setup Nginx (Optional)**
```bash
sudo apt install nginx
# Configure reverse proxy to forward 80/443 to 3000
```

## Post-Deployment Verification

### 1. Health Check
```bash
curl https://yourdomain.com/
```
Should return the homepage HTML

### 2. Admin Login
- Visit: `https://yourdomain.com/admin/login`
- Email: `admin@damdayvillage.com`
- Password: `admin123`
- **IMPORTANT:** Change this password immediately!

### 3. Test Features
- [ ] Homepage loads
- [ ] Blog page works
- [ ] Homestays page works
- [ ] Marketplace page works
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Can create/edit content

### 4. Monitor Logs
```bash
# Docker
docker logs -f damday-app

# Check for errors
docker logs damday-app 2>&1 | grep -i error
```

## Troubleshooting

### Issue: Container keeps restarting
```bash
docker logs damday-app
# Look for error messages
# Common issues:
# - Missing environment variables
# - Database connection problems
# - Port already in use
```

### Issue: Database errors
```bash
# Check if data directory exists
docker exec damday-app ls -la /app/data

# If empty, database wasn't seeded
docker exec -it damday-app npm run db:seed
```

### Issue: CSRF token errors
- Ensure `NEXTAUTH_URL` matches your actual domain
- Ensure `NEXTAUTH_SECRET` is set
- Check browser console for errors

### Issue: 502 Bad Gateway
- Container might still be starting (wait 30-40s)
- Check container health: `docker ps`
- Check logs: `docker logs damday-app`

## Security Recommendations

1. **Change Default Admin Password**
   - Login immediately and change password
   - Or update seed.ts and re-seed

2. **Use Strong NEXTAUTH_SECRET**
   - Generate with: `openssl rand -base64 32`
   - Never commit to repository

3. **Enable HTTPS**
   - Use Let's Encrypt with Nginx/Caddy
   - Or use platform SSL (Railway/Render provide free SSL)

4. **Regular Backups**
   - Backup `/app/data` directory (for SQLite)
   - Or setup automated PostgreSQL backups

5. **Update Dependencies**
   ```bash
   npm audit
   npm update
   ```

## Monitoring

### Setup Health Checks
Most platforms support health check endpoints:
- Path: `/`
- Expected: 200 OK
- Interval: 30s
- Timeout: 10s

### Log Monitoring
```bash
# Docker
docker logs -f damday-app

# Filter errors
docker logs damday-app 2>&1 | grep ERROR
```

### Resource Monitoring
```bash
# Docker stats
docker stats damday-app

# Container inspect
docker inspect damday-app
```

## Scaling

### Horizontal Scaling
- Use PostgreSQL instead of SQLite
- Deploy multiple containers behind load balancer
- Share session store (Redis)

### Vertical Scaling
- Increase container resources
- Upgrade server tier

## Backup & Restore

### SQLite Database
```bash
# Backup
docker cp damday-app:/app/data/production.db ./backup-$(date +%Y%m%d).db

# Restore
docker cp backup-20240101.db damday-app:/app/data/production.db
docker restart damday-app
```

### PostgreSQL Database
```bash
# Backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20240101.sql
```

## Support

For issues, check:
1. Application logs
2. Container/server health
3. Environment variables
4. Database connectivity
5. GitHub Issues

## Quick Reference

```bash
# View logs
docker logs -f damday-app

# Restart container
docker restart damday-app

# Stop container
docker stop damday-app

# Start container
docker start damday-app

# Remove container
docker rm -f damday-app

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Access container shell
docker exec -it damday-app sh
```
