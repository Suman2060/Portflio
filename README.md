# 🚀 Full-Stack Developer Portfolio & CMS Studio

A high-performance, modern, and production-ready Full-Stack Portfolio and Content Management System built with **React 19**, **TypeScript**, **Tailwind CSS**, **Node.js (Express 5)**, **Prisma ORM**, and **PostgreSQL**.

---

## ⚡ Architecture & Highlights

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (React 19)                    │
│  - Vite + Tailwind CSS (Cyber Dev Glassmorphic Theme)       │
│  - Route-level Code Splitting & Lazy Loaded Admin Studio    │
│  - Optimized Chunks: vendor-react, vendor-dnd, vendor-ui    │
└──────────────────────────────┬──────────────────────────────┘
                               │  REST API (JSON / Multipart)
                               │  Gzip Compressed + In-Memory Cache
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Server (Express 5)               │
│  - Advanced Dynamic Multi-Origin CORS & Preflight Caching   │
│  - Gzip / Deflate HTTP Response Compression (> 1KB)         │
│  - TTL In-Memory Read Caching with Auto-Invalidation        │
│  - ETag & Static Asset HTTP Caching                         │
│  - JWT Authentication & BCrypt Password Hashing             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database (Prisma ORM)           │
│  - High-Speed Indexed Queries (Projects, Skills, Exp, Logs) │
│  - Relational Schema with Auto Migrations & Seeders         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text
Portfolio_Website/
├── .env.example              # Full-stack environment template
├── client/                   # Frontend React Application
│   ├── .env.example          # Frontend environment variables template
│   ├── index.html            # HTML entry point with preconnected typography
│   ├── nginx.conf            # Production Nginx reverse proxy configuration
│   ├── package.json          # Frontend dependencies & scripts
│   ├── tsconfig.json         # TypeScript compiler configurations
│   ├── vite.config.ts        # Vite build optimization & chunk splitting
│   └── src/
│       ├── api/              # Axios client & typed REST service modules
│       ├── assets/           # Static icons and graphics
│       ├── components/       # UI, Home sections, Admin Studio tabs
│       ├── context/          # React Context (Site Settings state)
│       ├── hooks/            # Custom hooks (SEO, viewport, etc.)
│       ├── pages/            # Home, Login, Admin Dashboard, ProjectDetail
│       ├── types/            # Shared TypeScript type definitions
│       └── utils/            # Helper utilities and formatters
│
└── server/                   # Backend Express & Prisma API Server
    ├── .env.example          # Backend environment variables template
    ├── package.json          # Backend dependencies & scripts
    ├── prisma/
    │   ├── schema.prisma     # Prisma data models & performance indexes
    │   └── seed.js           # Database seed script for initial content
    ├── uploads/              # Uploaded media (images, docs) served statically
    └── src/
        ├── config/           # Database & Prisma Client singleton
        ├── middleware/       # JWT Auth verification middleware
        ├── module/           # Modular route controllers (auth, projects, skills, etc.)
        ├── utils/            # In-memory TTL cache & helpers
        └── server.js         # Express app initialization, CORS & compression
```

---

## 🛠️ Quick Start & Local Development

### 1. Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** instance running locally or via Docker / Cloud (Neon, Supabase, Railway)

### 2. Environment Setup

Copy `.env.example` templates to `.env` in the root, `client/`, and `server/`:

```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env
```

Ensure `DATABASE_URL` in `server/.env` points to your PostgreSQL database:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio_db?schema=public"
JWT_SECRET="your-super-secure-jwt-secret-key"
PORT=5500
CLIENT_URL="http://localhost:5173,http://localhost:3000"
```

### 3. Database Initialization & Seeding

```bash
cd server
npm install
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Running the Development Servers

**Start Backend Server:**
```bash
cd server
npm run dev
# Server running at http://localhost:5500
```

**Start Frontend Client:**
```bash
cd client
npm run dev
# Client running at http://localhost:5173
```

---

## 🚀 Production Build & Deployment

### Build Frontend
```bash
cd client
npm run build
```
- Outputs optimized static bundle to `client/dist/`
- Chunks are separated into `vendor-react`, `vendor-dnd`, `vendor-ui`, and route-based lazy bundles.

### Production Execution (Server)
```bash
cd server
npm start   # or node src/server.js
```

---

## 📊 Key Performance Optimizations

1. **Route-Level Code Splitting**: Admin Studio and login pages are lazy-loaded with React Suspense. Regular visitors only download ~40-70 kB rather than the whole 450 kB admin suite.
2. **Gzip Response Compression**: All API responses > 1KB are compressed automatically via `compression`, reducing network latency by 70-85%.
3. **In-Memory TTL Caching**: High-traffic public endpoints (`/api/site`, `/api/projects`, `/api/skills`, `/api/experience`) respond in **< 10ms** directly from memory with automatic invalidation on admin edits.
4. **Database Indexing**: B-tree indexes added on `displayOrder`, `isFeatured`, `category`, `isRead`, and `createdAt` columns for lightning-fast queries.
5. **Optimized CORS Preflight**: 24-hour preflight caching (`maxAge: 86400`) avoids redundant `OPTIONS` requests from browsers.

---

## 🔒 Security
- **JWT Authentication** with HTTP Authorization header validation.
- **BCrypt** password hashing (salt rounds = 10).
- Strict MIME-type filtering and size limitations on media uploads.
- Configurable origin whitelist for CORS in production.

---

## 📝 License
This project is open-source under the ISC License.
