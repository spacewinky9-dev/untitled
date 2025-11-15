# Damday Village - Smart Carbon-Free Village Platform

🌱 **India's First Smart Carbon-Free Village Management Platform**

A comprehensive web application for managing Damday Village - a carbon-neutral smart village in the Himalayan Devbhumi region. This platform integrates organic marketplace, homestay booking, tourism management, and community engagement features.

## ✨ Features

- 🛒 **Organic Marketplace** - Buy organic products directly from local farmers
- 🏡 **Homestay Booking** - Book authentic Himalayan homestays
- 🗺️ **Tour Management** - Explore village tours and experiences
- 📝 **Blog & News** - Stay updated with village activities
- 👥 **User Management** - Secure authentication and profiles
- 📊 **Admin Dashboard** - Complete management interface
- 🌍 **Carbon Tracking** - Monitor village sustainability
- 🔐 **Secure & Fast** - Built with Next.js 14 and TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd untitled
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   ```

3. **Setup Database**
   ```bash
   npm run db:setup
   ```
   
   This will:
   - Generate Prisma Client
   - Create SQLite database
   - Seed with initial data

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin/login
   
   **Default Admin Credentials:**
   - Email: `admin@damdayvillage.com`
   - Password: `admin123`

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:setup     # Complete database setup (generate + push + seed)
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with initial data
```

## 🐳 Docker Deployment

### Quick Deploy with Docker

```bash
# Build image
docker build -t damday-village .

# Run container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="file:/app/data/production.db" \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  -e NEXTAUTH_SECRET="your-secret-here" \
  -v damday-data:/app/data \
  --name damday-app \
  damday-village
```

### Docker Compose (Recommended)

```bash
docker-compose up -d
```

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

## 📚 Documentation

- [Deployment Guide](./DEPLOY.md) - Comprehensive deployment instructions
- [Production Checklist](./PRODUCTION-DEPLOY.md) - Production deployment checklist
- [Database Setup](./DATABASE-SETUP.md) - Database configuration guide

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM (SQLite/PostgreSQL)
- **Authentication:** NextAuth.js v5
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

## 🗂️ Project Structure

```
untitled/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── homestays/         # Homestay pages
│   └── marketplace/       # Marketplace pages
├── components/            # React components
│   ├── admin/            # Admin components
│   └── ui/               # UI components
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seed data
├── public/               # Static files
└── scripts/              # Utility scripts
```

## 🔧 Configuration

### Environment Variables

Required environment variables:

```env
DATABASE_URL="file:./prisma/dev.db"  # Database connection
NEXTAUTH_URL="http://localhost:3000"  # Application URL
NEXTAUTH_SECRET="your-secret-here"    # Auth secret key
NODE_ENV="development"                 # Environment
```

Generate secure secret:
```bash
openssl rand -base64 32
```

### Database Options

**SQLite (Default - Development)**
```env
DATABASE_URL="file:./prisma/dev.db"
```

**PostgreSQL (Production)**
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

Update `prisma/schema.prisma` accordingly.

## 🚨 Troubleshooting

### Common Issues

1. **Database URL Error**
   - Ensure SQLite URL starts with `file:`
   - Example: `file:./prisma/dev.db`

2. **CSRF Token Error**
   - Ensure `NEXTAUTH_SECRET` is set
   - Ensure `NEXTAUTH_URL` matches your domain

3. **Build Errors**
   - Run `npm install` to update dependencies
   - Clear `.next` folder: `rm -rf .next`
   - Regenerate Prisma Client: `npm run db:generate`

4. **Seed Data Issues**
   - Delete database: `rm prisma/dev.db`
   - Re-run setup: `npm run db:setup`

See [DEPLOY.md](./DEPLOY.md) for more troubleshooting tips.

## 🌐 Deployment Platforms

Tested and working on:
- ✅ Railway
- ✅ Render
- ✅ DigitalOcean App Platform
- ✅ AWS EC2
- ✅ Docker/Docker Compose
- ⚠️ Vercel (requires PostgreSQL, not SQLite)

## 📊 Database Schema

The application includes:
- Users & Authentication
- Products & Categories
- Orders & Bookings
- Homestays & Tours
- Blog Posts & Comments
- Settings & Navigation

See `prisma/schema.prisma` for complete schema.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for Damday Village, Uttarakhand, India
- Supporting sustainable rural development
- Promoting organic farming and eco-tourism
- Contributing to India's carbon neutrality goals

## 📞 Support

For issues or questions:
- 📧 Open an issue on GitHub
- 📚 Check documentation in `/docs`
- 💬 Contact the development team

---

**Made with ❤️ for Damday Village - India's First Smart Carbon-Free Village**
