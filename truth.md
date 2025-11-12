# TRUTH.MD — SMART VILLAGE DAMDAY SYSTEM DOCUMENTATION
# ══════════════════════════════════════════════════════════════════════════════
# Single Source of Truth for Damday Village WebApp Project
# Production Deployment: https://damdayvillage.com
# Last Updated: 2025-11-12
# Status: Foundation Phase - PR #1
# ══════════════════════════════════════════════════════════════════════════════

## 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [System Modules](#system-modules)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Component Hierarchy](#component-hierarchy)
8. [Blockchain Integration](#blockchain-integration)
9. [Admin Panel Structure](#admin-panel-structure)
10. [Development Roadmap](#development-roadmap)
11. [Testing & Verification](#testing-verification)
12. [Deployment Guide](#deployment-guide)

---

## 🏔️ PROJECT OVERVIEW

### Vision
Damday Village is a pioneering **Smart Carbon-Free Village** located in the Himalayan Devbhumi region of India. This web application serves as the digital twin of the physical village, integrating sustainable development, rural employment, carbon neutrality, and cultural preservation through cutting-edge technology.

### Core Objectives
- 🌱 Promote local organic products marketplace (22+ verified products)
- 🏡 Enable homestay and cultural tourism booking
- 🌳 Track carbon credits via blockchain (25,000 trees in 5 years goal)
- 💬 Foster community engagement and knowledge sharing
- 🧠 Provide intelligent admin system (no-code management)
- 🖥️ Deliver government-grade UI with Indian Digital India aesthetic

### Key Statistics
- **Target Trees**: 25,000 planted over 5 years
- **Products**: 22+ organic local products
- **Homestays**: Multiple properties with cultural experiences
- **Technology**: Web3-enabled carbon credit economy
- **Accessibility**: WCAG 2.1 AA compliant

---

## 🏗️ ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │  Admin Panel │  │  Mobile PWA  │         │
│  │  (Next.js)   │  │  (React CMS) │  │  (Optional)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  REST APIs   │  │  GraphQL API │  │  WebSocket   │         │
│  │              │  │              │  │  (Real-time) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Auth Service │  │ Marketplace  │  │  Homestay    │         │
│  │   (JWT)      │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Carbon Credit│  │  Community   │  │   Analytics  │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │  Blockchain  │  │  File Storage│         │
│  │  (Prisma)    │  │  (Polygon)   │  │  (S3/Local)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure (Planned)

```
damday-village/
├── apps/
│   ├── web/                    # Main Next.js frontend
│   │   ├── app/               # Next.js 14 App Router
│   │   ├── components/        # React components
│   │   ├── lib/              # Utilities & helpers
│   │   └── public/           # Static assets
│   ├── admin/                 # Admin Panel CMS
│   └── api/                   # Backend API
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── database/              # Prisma schema & migrations
│   ├── blockchain/            # Smart contracts
│   └── config/                # Shared configurations
├── contracts/                 # Solidity smart contracts
│   ├── CarbonToken.sol
│   ├── TreeNFT.sol
│   └── CarbonExchange.sol
├── docs/
│   ├── truth.md              # This file
│   ├── screenshots.md        # Visual documentation
│   ├── api/                  # API documentation
│   └── guides/               # User & developer guides
└── scripts/
    ├── deploy/               # Deployment scripts
    ├── seed/                 # Database seeding
    └── backup/               # Backup utilities
```

---

## 🛠️ TECHNOLOGY STACK

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | React framework with App Router |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **TailwindCSS** | 3.x | Styling framework |
| **Three.js** | Latest | 3D visualizations |
| **Framer Motion** | Latest | Animations |
| **Shadcn/ui** | Latest | Component library |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x LTS | Runtime environment |
| **Express** | 4.x | Web framework |
| **Prisma** | 5.x | ORM & database toolkit |
| **PostgreSQL** | 15.x | Primary database |
| **GraphQL** | Latest | API query language |
| **NextAuth.js** | 5.x | Authentication |

### Blockchain Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Solidity** | 0.8.x | Smart contract language |
| **Hardhat** | Latest | Development framework |
| **Ethers.js** | 6.x | Web3 library |
| **Polygon** | Testnet/Mainnet | Blockchain network |
| **Web3Modal** | Latest | Wallet connection |

### DevOps & Infrastructure
| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | Latest | Containerization |
| **CapRover** | Latest | PaaS deployment |
| **Nginx** | Latest | Reverse proxy |
| **GitHub Actions** | - | CI/CD pipeline |
| **Playwright** | Latest | E2E testing & screenshots |

---

## 🧩 SYSTEM MODULES

### Module Status Overview

| # | Module Name | Status | Priority | Dependencies | Admin Control |
|---|------------|--------|----------|--------------|---------------|
| 1 | Core Platform | ⏳ Planned | Critical | - | ✅ Full |
| 2 | Admin Panel | ⏳ Planned | Critical | Core Platform | ✅ Full |
| 3 | User Panel | ⏳ Planned | High | Core Platform, Auth | ✅ Full |
| 4 | Marketplace | ⏳ Planned | High | Core, Payments | ✅ Full |
| 5 | Homestay & Tours | ⏳ Planned | High | Core, Payments | ✅ Full |
| 6 | Blog & News | ⏳ Planned | Medium | Core, CMS | ✅ Full |
| 7 | Carbon Credits (Blockchain) | ⏳ Planned | Critical | Core, Web3 | ✅ Full |
| 8 | Carbon Marketplace | ⏳ Planned | High | Carbon Credits | ✅ Full |
| 9 | Sustainability Tracker | ⏳ Planned | High | Carbon Credits | ✅ Full |
| 10 | Community Hub | ⏳ Planned | Medium | Core, User Panel | ✅ Full |
| 11 | Analytics Dashboard | ⏳ Planned | Medium | All Modules | ✅ Full |
| 12 | System Intelligence | ⏳ Planned | Low | All Modules | ✅ Partial |

**Status Legend:**
- ✅ Complete
- 🔄 In Progress
- ⏳ Planned
- ⚠️ Blocked
- ❌ Not Started

### Module Details

#### 1. Core Platform
**Purpose**: Foundation layer providing authentication, user roles, permissions, and API gateway.

**Features**:
- JWT-based authentication
- Role-based access control (RBAC)
- OAuth2 integration
- API rate limiting
- CSRF protection
- Centralized error handling
- Health monitoring endpoint

**Tech Stack**: NextAuth.js, Prisma, PostgreSQL

**Admin Controls**:
- User management (CRUD)
- Role assignment
- Permission configuration
- API key management
- System settings

---

#### 2. Admin Panel (CMS)
**Purpose**: Centralized control center for all system operations.

**Features**:
- Visual page builder
- WYSIWYG content editor
- Module enable/disable toggles
- Theme customization
- Menu & navigation builder
- Widget management
- SEO settings
- Analytics overview

**Tech Stack**: React, Next.js, Prisma, GraphQL

**Admin Controls**:
- ✅ Full system control (no coding required)

---

#### 3. User Panel
**Purpose**: Personal dashboard for users, tourists, and villagers.

**Features**:
- Profile management
- Wallet integration
- Order history
- Booking management
- Carbon credit tracking
- Notification center
- Wishlist & favorites

**Tech Stack**: Next.js, React, Web3Modal

**Admin Controls**:
- User role assignment
- Profile field customization
- Wallet settings

---

#### 4. Marketplace Module
**Purpose**: E-commerce platform for local organic products.

**Features**:
- Product catalog (22+ products)
- Inventory management
- Shopping cart
- Checkout & payments (Razorpay/Stripe)
- Order tracking
- Delivery management
- Product reviews
- Environmental impact scores

**Products Categories**:
- Organic vegetables
- Himalayan herbs
- Handmade crafts
- Traditional foods
- Natural honey
- Herbal teas

**Tech Stack**: Next.js, Prisma, Razorpay/Stripe API

**Admin Controls**:
- Product CRUD
- Category management
- Inventory updates
- Order processing
- Pricing configuration

---

#### 5. Homestay & Tour Module
**Purpose**: Tourism booking system for cultural experiences.

**Features**:
- Homestay property listings
- Room availability calendar
- Booking engine
- Tour package creation
- Payment gateway integration
- Itinerary management
- Guest reviews
- Local guide assignments

**Tech Stack**: Next.js, Prisma, Calendar API

**Admin Controls**:
- Property management
- Availability settings
- Pricing & packages
- Booking approvals
- Review moderation

---

#### 6. Blog & News Hub
**Purpose**: Content management for articles, news, and stories.

**Features**:
- Markdown/WYSIWYG editor
- Categories & tags
- Comment system
- Social sharing
- SEO optimization
- Sitemap generation
- Newsletter integration

**Tech Stack**: Next.js, MDX, Prisma

**Admin Controls**:
- Post CRUD
- Category management
- Comment moderation
- SEO settings

---

#### 7. Carbon Credit System (Blockchain)
**Purpose**: Decentralized carbon credit tracking and trading.

**Features**:
- Smart contract integration
- Tree NFT minting
- Carbon token creation
- Wallet connection (MetaMask/WalletConnect)
- Plantation verification
- Token minting/burning
- Blockchain explorer integration

**Smart Contracts**:
1. **TreeNFT.sol**: Each tree as unique NFT with metadata
2. **CarbonToken.sol**: ERC-1155 carbon credits
3. **CarbonExchange.sol**: P2P trading platform

**Tech Stack**: Solidity, Hardhat, Ethers.js, Polygon

**Admin Controls**:
- Plantation registration
- Token minting approval
- Transaction verification
- Wallet monitoring

---

#### 8. Carbon Credit Marketplace
**Purpose**: Trading platform for carbon credits.

**Features**:
- Token swap interface
- Order book
- Price charts
- Transaction history
- Decentralized exchange integration
- Liquidity pools

**Tech Stack**: Next.js, Ethers.js, DEX APIs

**Admin Controls**:
- Transaction monitoring
- Fraud detection
- Listing approvals

---

#### 9. Sustainability Tracker
**Purpose**: Real-time dashboard for environmental impact.

**Features**:
- Tree planting progress (target: 25,000)
- CO₂ offset calculations
- Milestone tracking
- Interactive charts (Chart.js/ECharts)
- Leaderboard system
- Impact reports

**Metrics Tracked**:
- Total trees planted
- Carbon offset (tons)
- Water saved (liters)
- Soil improved (sq meters)
- Community participation

**Tech Stack**: Next.js, Chart.js, Prisma

**Admin Controls**:
- Data verification
- Milestone updates
- Report generation

---

#### 10. Community Hub
**Purpose**: Engagement platform for initiatives and projects.

**Features**:
- Project listings
- Volunteer programs
- Voting system
- Discussion forums
- Donation integration
- Event calendar

**Tech Stack**: Next.js, Prisma, WebSocket

**Admin Controls**:
- Project approval
- Forum moderation
- Event management

---

#### 11. Analytics Dashboard
**Purpose**: Comprehensive metrics and insights.

**Features**:
- User analytics
- Sales metrics
- Booking statistics
- Carbon credit trends
- Custom reports
- Export functionality (CSV/PDF)

**Tech Stack**: Next.js, Chart.js, Prisma

**Admin Controls**:
- ✅ Full access to all metrics

---

#### 12. System Intelligence
**Purpose**: AI-powered recommendations and automation.

**Features**:
- Smart product recommendations
- Auto content layout
- Chatbot assistance
- Predictive analytics
- Content suggestions

**Tech Stack**: Next.js, AI APIs (future integration)

**Admin Controls**:
- AI model configuration
- Training data management

---

## 💾 DATABASE SCHEMA

### Prisma Schema Overview (Planned)

```prisma
// User Management
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  name          String
  role          Role     @default(USER)
  walletAddress String?  @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  profile       Profile?
  orders        Order[]
  bookings      Booking[]
  carbonWallet  CarbonWallet?
  posts         Post[]
  comments      Comment[]
}

model Profile {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  bio         String?
  phone       String?
  address     String?
  avatar      String?
  preferences Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role {
  ADMIN
  VENDOR
  TOURIST
  VILLAGER
  USER
}

// Marketplace
model Product {
  id                 String   @id @default(uuid())
  name               String
  description        String
  price              Float
  inventory          Int
  category           String
  images             String[]
  environmentalScore Float?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  // Relations
  orderItems         OrderItem[]
}

model Order {
  id          String      @id @default(uuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  total       Float
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // Relations
  items       OrderItem[]
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

// Homestay & Tourism
model Homestay {
  id          String    @id @default(uuid())
  name        String
  description String
  location    String
  amenities   String[]
  images      String[]
  pricePerNight Float
  maxGuests   Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  rooms       Room[]
  bookings    Booking[]
}

model Room {
  id          String   @id @default(uuid())
  homestayId  String
  homestay    Homestay @relation(fields: [homestayId], references: [id])
  name        String
  type        String
  capacity    Int
  pricePerNight Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Booking {
  id          String        @id @default(uuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  homestayId  String
  homestay    Homestay      @relation(fields: [homestayId], references: [id])
  checkIn     DateTime
  checkOut    DateTime
  guests      Int
  status      BookingStatus @default(PENDING)
  total       Float
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

// Carbon Credits & Blockchain
model CarbonWallet {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  walletAddress  String   @unique
  balance        Float    @default(0)
  totalEarned    Float    @default(0)
  totalSpent     Float    @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // Relations
  transactions   CarbonTransaction[]
}

model TreePlantation {
  id              String   @id @default(uuid())
  species         String
  plantedDate     DateTime
  location        Json     // Geo-coordinates
  verifier        String
  carbonOffset    Float
  nftTokenId      String?  @unique
  status          String   @default("verified")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model CarbonTransaction {
  id              String       @id @default(uuid())
  walletId        String
  wallet          CarbonWallet @relation(fields: [walletId], references: [id])
  type            String       // mint, burn, transfer
  amount          Float
  txHash          String       @unique
  blockchainData  Json?
  createdAt       DateTime     @default(now())
}

// Blog & Content
model Post {
  id          String    @id @default(uuid())
  title       String
  content     String
  excerpt     String?
  slug        String    @unique
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  published   Boolean   @default(false)
  categories  String[]
  tags        String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  comments    Comment[]
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  postId    String
  post      Post     @relation(fields: [postId], references: [id])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Admin & CMS
model Page {
  id        String   @id @default(uuid())
  title     String
  slug      String   @unique
  content   Json     // Structured content
  layout    String?
  published Boolean  @default(false)
  seo       Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Settings {
  id    String @id @default(uuid())
  key   String @unique
  value Json
}
```

---

## 🔌 API DOCUMENTATION

### REST API Endpoints (Planned)

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh
```

#### Users
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

#### Marketplace
```
GET    /api/products
GET    /api/products/:id
POST   /api/products         [Admin]
PUT    /api/products/:id     [Admin]
DELETE /api/products/:id     [Admin]

POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status [Admin]
```

#### Homestay
```
GET    /api/homestays
GET    /api/homestays/:id
POST   /api/homestays        [Admin]
PUT    /api/homestays/:id    [Admin]
DELETE /api/homestays/:id    [Admin]

POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id/status [Admin]
```

#### Carbon Credits
```
GET    /api/carbon/wallet/:userId
GET    /api/carbon/transactions
POST   /api/carbon/mint      [Admin]
POST   /api/carbon/transfer
GET    /api/carbon/plantations
POST   /api/carbon/plantations [Admin]
```

#### Blog
```
GET    /api/posts
GET    /api/posts/:slug
POST   /api/posts            [Admin]
PUT    /api/posts/:id        [Admin]
DELETE /api/posts/:id        [Admin]

POST   /api/posts/:id/comments
GET    /api/posts/:id/comments
```

#### Admin
```
GET    /api/admin/dashboard
GET    /api/admin/analytics
PUT    /api/admin/settings
GET    /api/admin/pages
POST   /api/admin/pages      [Admin]
PUT    /api/admin/pages/:id  [Admin]
```

### GraphQL Schema (Planned)

```graphql
type Query {
  users: [User!]!
  user(id: ID!): User
  products: [Product!]!
  product(id: ID!): Product
  homestays: [Homestay!]!
  homestay(id: ID!): Homestay
  posts: [Post!]!
  post(slug: String!): Post
  carbonWallet(userId: ID!): CarbonWallet
}

type Mutation {
  createProduct(input: ProductInput!): Product!
  updateProduct(id: ID!, input: ProductInput!): Product!
  deleteProduct(id: ID!): Boolean!
  
  createOrder(input: OrderInput!): Order!
  updateOrderStatus(id: ID!, status: OrderStatus!): Order!
  
  createBooking(input: BookingInput!): Booking!
  
  mintCarbonTokens(userId: ID!, amount: Float!): CarbonTransaction!
  transferCarbonTokens(from: ID!, to: ID!, amount: Float!): CarbonTransaction!
}
```

---

## 🧱 COMPONENT HIERARCHY

### Frontend Component Structure (Planned)

```
/app
├── (marketing)
│   ├── page.tsx                 # Homepage
│   ├── about/page.tsx
│   └── layout.tsx
├── marketplace/
│   ├── page.tsx                 # Product listing
│   ├── [id]/page.tsx            # Product detail
│   └── cart/page.tsx
├── homestay/
│   ├── page.tsx                 # Homestay listing
│   ├── [id]/page.tsx            # Homestay detail
│   └── booking/page.tsx
├── carbon-credit/
│   ├── page.tsx                 # Dashboard
│   ├── wallet/page.tsx
│   └── marketplace/page.tsx
├── community/
│   ├── page.tsx
│   ├── projects/page.tsx
│   └── blog/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── dashboard/
│   ├── page.tsx                 # User dashboard
│   └── layout.tsx
├── admin/
│   ├── page.tsx                 # Admin dashboard
│   ├── products/page.tsx
│   ├── orders/page.tsx
│   ├── bookings/page.tsx
│   ├── users/page.tsx
│   ├── carbon/page.tsx
│   ├── content/page.tsx
│   ├── settings/page.tsx
│   └── layout.tsx
└── api/
    └── [...routes]/route.ts
```

### Reusable Components

```
/components
├── ui/                          # Base UI components (Shadcn)
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Navigation.tsx
├── marketplace/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CartDrawer.tsx
│   └── CheckoutForm.tsx
├── homestay/
│   ├── HomestayCard.tsx
│   ├── BookingCalendar.tsx
│   └── BookingForm.tsx
├── carbon/
│   ├── WalletConnect.tsx
│   ├── TokenBalance.tsx
│   ├── TransactionList.tsx
│   └── PlantationMap.tsx
├── community/
│   ├── BlogCard.tsx
│   ├── CommentSection.tsx
│   └── ProjectCard.tsx
├── admin/
│   ├── DataTable.tsx
│   ├── StatsCard.tsx
│   ├── ChartWidget.tsx
│   └── FormBuilder.tsx
└── shared/
    ├── ParticleBackground.tsx
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── SEOHead.tsx
```

---

## 🔗 BLOCKCHAIN INTEGRATION

### Smart Contract Architecture

#### 1. TreeNFT.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreeNFT is ERC721, Ownable {
    struct TreeMetadata {
        string species;
        uint256 plantedDate;
        string location; // GPS coordinates
        address verifier;
        uint256 carbonOffset;
    }
    
    mapping(uint256 => TreeMetadata) public trees;
    uint256 public tokenIdCounter;
    
    constructor() ERC721("DamdayTree", "DTREE") {}
    
    function mintTree(
        address to,
        string memory species,
        string memory location,
        uint256 carbonOffset
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = tokenIdCounter++;
        _mint(to, tokenId);
        
        trees[tokenId] = TreeMetadata({
            species: species,
            plantedDate: block.timestamp,
            location: location,
            verifier: msg.sender,
            carbonOffset: carbonOffset
        });
        
        return tokenId;
    }
}
```

#### 2. CarbonToken.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonToken is ERC1155, Ownable {
    uint256 public constant CARBON_CREDIT = 0;
    
    mapping(address => uint256) public totalMinted;
    mapping(address => uint256) public totalBurned;
    
    event CarbonMinted(address indexed to, uint256 amount);
    event CarbonBurned(address indexed from, uint256 amount);
    
    constructor() ERC1155("https://damdayvillage.com/api/carbon/{id}.json") {}
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, CARBON_CREDIT, amount, "");
        totalMinted[to] += amount;
        emit CarbonMinted(to, amount);
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, CARBON_CREDIT, amount);
        totalBurned[msg.sender] += amount;
        emit CarbonBurned(msg.sender, amount);
    }
    
    function balanceOfCarbon(address account) public view returns (uint256) {
        return balanceOf(account, CARBON_CREDIT);
    }
}
```

#### 3. CarbonExchange.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CarbonExchange is ReentrancyGuard {
    IERC1155 public carbonToken;
    
    struct Order {
        address seller;
        uint256 amount;
        uint256 pricePerToken;
        bool active;
    }
    
    mapping(uint256 => Order) public orders;
    uint256 public orderIdCounter;
    
    event OrderCreated(uint256 indexed orderId, address seller, uint256 amount, uint256 price);
    event OrderFilled(uint256 indexed orderId, address buyer, uint256 amount);
    event OrderCancelled(uint256 indexed orderId);
    
    constructor(address _carbonToken) {
        carbonToken = IERC1155(_carbonToken);
    }
    
    function createOrder(uint256 amount, uint256 pricePerToken) public returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(pricePerToken > 0, "Price must be greater than 0");
        
        uint256 orderId = orderIdCounter++;
        orders[orderId] = Order({
            seller: msg.sender,
            amount: amount,
            pricePerToken: pricePerToken,
            active: true
        });
        
        carbonToken.safeTransferFrom(msg.sender, address(this), 0, amount, "");
        
        emit OrderCreated(orderId, msg.sender, amount, pricePerToken);
        return orderId;
    }
    
    function fillOrder(uint256 orderId) public payable nonReentrant {
        Order storage order = orders[orderId];
        require(order.active, "Order not active");
        
        uint256 totalPrice = order.amount * order.pricePerToken;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        order.active = false;
        
        carbonToken.safeTransferFrom(address(this), msg.sender, 0, order.amount, "");
        payable(order.seller).transfer(totalPrice);
        
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit OrderFilled(orderId, msg.sender, order.amount);
    }
    
    function cancelOrder(uint256 orderId) public {
        Order storage order = orders[orderId];
        require(order.seller == msg.sender, "Not order owner");
        require(order.active, "Order not active");
        
        order.active = false;
        carbonToken.safeTransferFrom(address(this), msg.sender, 0, order.amount, "");
        
        emit OrderCancelled(orderId);
    }
}
```

### Web3 Integration Flow

```
User Wallet (MetaMask)
       ↓
Web3Modal Connection
       ↓
Ethers.js Provider
       ↓
Smart Contract Interaction
       ↓
Backend Verification (Prisma)
       ↓
Database Update
```

---

## 🎨 ADMIN PANEL STRUCTURE

### Admin Dashboard Sections

1. **Overview**
   - Key metrics cards
   - Recent activity feed
   - Quick actions

2. **Content Management**
   - Pages
   - Blog posts
   - Media library

3. **E-commerce**
   - Products
   - Orders
   - Inventory

4. **Bookings**
   - Homestays
   - Reservations
   - Calendar view

5. **Carbon Credits**
   - Plantation registry
   - Token minting
   - Transaction log

6. **Users**
   - User list
   - Roles & permissions
   - Activity log

7. **Appearance**
   - Theme settings
   - Menu builder
   - Widget areas

8. **Settings**
   - General
   - SEO
   - Integrations
   - API keys

### Admin Features Matrix

| Feature | Description | Status |
|---------|-------------|--------|
| Visual Page Builder | Drag-and-drop layout editor | ⏳ Planned |
| WYSIWYG Editor | Rich text editing | ⏳ Planned |
| Media Manager | Upload & organize files | ⏳ Planned |
| Theme Customizer | Colors, fonts, logos | ⏳ Planned |
| Menu Builder | Navigation management | ⏳ Planned |
| Widget System | Reusable content blocks | ⏳ Planned |
| SEO Tools | Meta tags, sitemaps | ⏳ Planned |
| Analytics | Charts & reports | ⏳ Planned |
| Export/Import | Data portability | ⏳ Planned |
| Backup & Restore | System backups | ⏳ Planned |

---

## 🎨 UI/UX DESIGN SYSTEM

### Color Palette (Indian Government Style)

```css
:root {
  /* Primary Colors */
  --saffron: #FF9933;
  --white: #FFFFFF;
  --green: #138808;
  --navy-blue: #002D62;
  
  /* Secondary Colors */
  --teal: #00A8A8;
  --gold: #FFD700;
  --earth: #8B4513;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #FF9933 0%, #FFD700 100%);
  --gradient-blue: linear-gradient(135deg, #002D62 0%, #00A8A8 100%);
  --gradient-green: linear-gradient(135deg, #138808 0%, #00A8A8 100%);
  
  /* Text */
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-light: #999999;
  
  /* Background */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-accent: #FFF9F0;
}
```

### Typography

```css
/* Fonts */
font-family: 'Inter', 'Poppins', 'Noto Sans', sans-serif;

/* Scale */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
--text-5xl: 3rem;     /* 48px */
```

### Component Styles

**Button Variants**:
- Primary: Saffron gradient with white text
- Secondary: Navy blue with white text
- Outline: Border with transparent background
- Ghost: Minimal styling

**Cards**:
- White background
- Subtle shadow
- Rounded corners (8px)
- Hover elevation

**Forms**:
- Clean input fields
- Inline validation
- Accessible labels
- Error states

---

## 🚀 DEVELOPMENT ROADMAP

### 12 PR Development Strategy

| PR # | Title | Phase | Status | Description |
|------|-------|-------|--------|-------------|
| 1 | Documentation Foundation | Foundation | 🔄 In Progress | Create truth.md, screenshots.md, analyze codebase |
| 2 | Admin Panel Core | Backend | ⏳ Planned | Build CMS admin interface |
| 3 | User Panel & Auth | Backend | ⏳ Planned | Authentication & user management |
| 4 | Marketplace Module | Feature | ⏳ Planned | E-commerce system |
| 5 | Homestay & Tours | Feature | ⏳ Planned | Booking system |
| 6 | Blog & News Hub | Feature | ⏳ Planned | Content management |
| 7 | Blockchain Carbon Credits | Web3 | ⏳ Planned | Smart contracts & wallet |
| 8 | Carbon Marketplace | Web3 | ⏳ Planned | Trading platform |
| 9 | Sustainability Tracker | Analytics | ⏳ Planned | Impact dashboard |
| 10 | Community Hub | Feature | ⏳ Planned | Engagement platform |
| 11 | UI/UX Enhancement | Frontend | ⏳ Planned | Design polish & animation |
| 12 | Final Documentation | Release | ⏳ Planned | Complete docs & deployment |

### Current Progress: PR #1

**Objectives**:
- ✅ Create truth.md structure
- ⏳ Create screenshots.md template
- ⏳ Analyze existing codebase
- ⏳ Document all dependencies
- ⏳ Set up development environment
- ⏳ Initialize project structure

---

## ✅ TESTING & VERIFICATION

### Testing Strategy

#### Unit Tests
- Component testing with Jest & React Testing Library
- API endpoint testing
- Smart contract testing with Hardhat

#### Integration Tests
- End-to-end user flows
- Payment gateway integration
- Blockchain transaction flows

#### E2E Tests
- Playwright automated testing
- Screenshot capture for documentation
- Accessibility testing

### Verification Checklist

| Component | Implemented | Tested | Screenshot | Notes |
|-----------|-------------|--------|------------|-------|
| Homepage | ❌ | ❌ | ❌ | Not yet created |
| Admin Login | ❌ | ❌ | ❌ | Not yet created |
| Product Listing | ❌ | ❌ | ❌ | Not yet created |
| Checkout Flow | ❌ | ❌ | ❌ | Not yet created |
| Booking System | ❌ | ❌ | ❌ | Not yet created |
| Wallet Connect | ❌ | ❌ | ❌ | Not yet created |
| Token Minting | ❌ | ❌ | ❌ | Not yet created |

---

## 🚀 DEPLOYMENT GUIDE

### Prerequisites
- Node.js 20.x LTS
- PostgreSQL 15.x
- Docker & Docker Compose
- MetaMask wallet for testing

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/damday"

# NextAuth
NEXTAUTH_URL="https://damdayvillage.com"
NEXTAUTH_SECRET="your-secret-key"

# Payment Gateways
RAZORPAY_KEY_ID="your-key"
RAZORPAY_KEY_SECRET="your-secret"

# Blockchain
POLYGON_RPC_URL="https://polygon-rpc.com"
PRIVATE_KEY="your-deployer-private-key"
CONTRACT_ADDRESS_TREE_NFT="0x..."
CONTRACT_ADDRESS_CARBON_TOKEN="0x..."
CONTRACT_ADDRESS_EXCHANGE="0x..."

# Storage
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET="damday-assets"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

### Deployment Steps

```bash
# 1. Clone repository
git clone https://github.com/spacewinky9-dev/untitled.git
cd untitled

# 2. Install dependencies
npm install

# 3. Set up database
npx prisma migrate deploy
npx prisma db seed

# 4. Build application
npm run build

# 5. Deploy with Docker
docker-compose up -d

# 6. Deploy smart contracts (Polygon)
cd contracts
npx hardhat run scripts/deploy.js --network polygon
```

### CapRover Deployment

```bash
# Install CapRover CLI
npm install -g caprover

# Login to CapRover
caprover login

# Deploy app
caprover deploy
```

---

## 📊 METRICS & KPIs

### Success Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Trees Planted | 0 | 25,000 | ⏳ |
| CO₂ Offset (tons) | 0 | 500 | ⏳ |
| Active Users | 0 | 10,000 | ⏳ |
| Products Listed | 0 | 22+ | ⏳ |
| Homestays | 0 | 10+ | ⏳ |
| Carbon Token Holders | 0 | 5,000 | ⏳ |
| Community Projects | 0 | 50+ | ⏳ |

---

## 🔐 SECURITY CONSIDERATIONS

### Security Measures
1. **Authentication**: JWT with refresh tokens
2. **Authorization**: Role-based access control
3. **Data Protection**: Encryption at rest and in transit
4. **API Security**: Rate limiting, CORS, CSRF protection
5. **Smart Contracts**: Audited by OpenZeppelin
6. **Input Validation**: Sanitization on all inputs
7. **Dependency Scanning**: Automated vulnerability checks
8. **Backup**: Daily automated backups

### Compliance
- GDPR compliant
- WCAG 2.1 AA accessibility
- PCI DSS for payments
- Environmental data verification standards

---

## 📚 REFERENCES & RESOURCES

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Polygon Documentation](https://docs.polygon.technology/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### Inspiration
- [MyGov Portal](https://www.mygov.in/)
- [Digital India](https://digitalindia.gov.in)
- [Government of India](https://www.india.gov.in)

### Community
- GitHub: [spacewinky9-dev/untitled](https://github.com/spacewinky9-dev/untitled)
- Website: [damdayvillage.com](https://damdayvillage.com)

---

## 📝 CHANGELOG

### Version 0.1.0 (Current)
- Initial truth.md creation
- Project structure defined
- Architecture documented
- Technology stack selected

---

## 🎯 NEXT STEPS

1. ✅ Complete truth.md documentation
2. ⏳ Create screenshots.md template
3. ⏳ Initialize Next.js project
4. ⏳ Set up Prisma schema
5. ⏳ Create admin panel foundation
6. ⏳ Implement authentication system
7. ⏳ Deploy smart contracts to testnet

---

## 👥 CONTRIBUTORS

- **Project Lead**: Autonomous Development Agent
- **Client**: Damday Village Community
- **Repository**: spacewinky9-dev/untitled

---

**Last Updated**: 2025-11-12  
**Version**: 0.1.0  
**Status**: Foundation Phase  
**Next PR**: #2 - Admin Panel Core System

---

*This document serves as the single source of truth for the Damday Village Smart Village WebApp project. It will be continuously updated as development progresses through the 12 PR cycle.*

═══════════════════════════════════════════════════════════════════════════════
END OF TRUTH.MD
═══════════════════════════════════════════════════════════════════════════════
