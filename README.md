# Damday Village - Smart Carbon-Free Village WebApp

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

> A pioneering Smart Carbon-Free Village located in the Himalayan Devbhumi region of India. This web application serves as the digital platform for sustainable development, rural employment, carbon neutrality, and cultural preservation.

---

## 🌟 Overview

**Damday Village** is a comprehensive digital platform that integrates sustainable development, e-commerce, tourism, and blockchain technology to create a self-sufficient smart village ecosystem.

### Key Features

- 🛒 **Organic Marketplace** - 26+ verified local organic products
- 🏡 **Homestay Booking** - 5 properties with authentic village experiences
- 🌳 **Carbon Credits** - Blockchain-based tree planting verification (DamChain)
- 📝 **Village Blog** - News, stories, and community updates
- 🎯 **Community Hub** - Village initiatives and projects
- 👥 **Leadership** - Gram Pradhan and village council information
- 🔐 **Secure Admin Panel** - Comprehensive management system

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x LTS or higher
- PostgreSQL 15.x or higher
- npm 9.x or higher

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/gityhub99-max/untitled-1.git
cd untitled-1

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
npm run db:setup
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

---

## 🔒 Security Features

- **Authentication**: JWT-based with NextAuth.js v5
- **Password Security**: bcrypt hashing (10 rounds)
- **Role-Based Access Control**: Admin, User, Vendor roles
- **API Protection**: Server-side authentication checks
- **Database Security**: Prisma ORM prevents SQL injection
- **Environment Variables**: Sensitive data in .env files
- **HTTPS**: Production deployment with SSL/TLS
- **Backend Protection**: All backend logic secured server-side
- **No Public Backend Access**: API routes require authentication

---

## 🌍 About Damday Village

Damday Village is a pioneering smart village initiative in the Himalayan region, focusing on:

- **Sustainable Development** - Eco-friendly practices and renewable energy
- **Carbon Neutrality** - Target of 25,000 trees in 5 years
- **Rural Employment** - Creating opportunities for local residents
- **Cultural Preservation** - Maintaining traditional Himalayan culture
- **Organic Agriculture** - Promoting chemical-free farming
- **Community Tourism** - Authentic village experiences

---

## 📞 Contact & Support

- **Website**: [damdayvillage.com](https://damdayvillage.com)
- **Email**: info@damdayvillage.com
- **Location**: Himalayan Devbhumi Region, India

---

<div align="center">

**Made with ❤️ for Damday Village**

Preserving Culture | Embracing Technology | Building Sustainability

</div>
