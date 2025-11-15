# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# ✅ FIX 1: Add OpenSSL compatibility for Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Install dependencies
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder

# ✅ FIX 2: Install OpenSSL in builder stage too
RUN apk add --no-cache openssl

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# ✅ FIX 3: Set a dummy DATABASE_URL for build time (Prisma needs it)
# Real DATABASE_URL will be used at runtime
ENV DATABASE_URL="file:./prisma/dev.db"

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

# ✅ FIX 4: Install OpenSSL in runtime stage
RUN apk add --no-cache openssl curl

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma files and dependencies needed for migrations
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create data directory for SQLite database
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check - add longer start period for database migration
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
