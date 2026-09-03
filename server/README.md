# ⚙️ Portfolio API Backend (Express 5 + Prisma)

High-speed, modular REST API powering the portfolio application with real-time content management, in-memory caching, compression, and JWT authentication.

---

## 🚀 Features

- **Express 5**: Latest Express framework with modern async/await error handling.
- **Prisma ORM & PostgreSQL**: Type-safe relational database queries with B-tree indexed fields.
- **In-Memory TTL Caching**: Millisecond response times for high-frequency reads (`/api/site`, `/api/projects`, `/api/skills`, `/api/experience`) with automatic invalidation on updates.
- **Gzip / Deflate Compression**: Responses compressed on the fly via `compression` middleware to eliminate latency.
- **Production CORS**: Dynamic multi-origin whitelist with 24-hour preflight caching (`maxAge: 86400`).
- **Media Uploads**: Built-in `multer` file uploader with extension whitelist and size caps.
- **JWT Auth**: Secure admin session tokens with BCrypt password hashing.

---

## 📦 Directory Structure

```text
server/
├── prisma/
│   ├── schema.prisma         # Database schema & index definitions
│   └── seed.js               # Seed script with default content & admin user
├── uploads/                  # Uploaded images / documents (served at /uploads/*)
├── src/
│   ├── config/
│   │   └── db.js             # PrismaClient singleton
│   ├── middleware/
│   │   └── authMiddleware.js # JWT Bearer authorization guard
│   ├── module/
│   │   ├── auth/             # /api/auth (Login & token verification)
│   │   ├── projects/         # /api/projects (CRUD & slug retrieval)
│   │   ├── skills/           # /api/skills (CRUD & reordering)
│   │   ├── experience/       # /api/experience (CRUD & timeline)
│   │   ├── messages/         # /api/messages (Contact submissions & inbox)
│   │   ├── uploads/          # /api/uploads (Media file upload)
│   │   └── site/             # /api/site (Global hero, about, socials, SEO settings)
│   ├── utils/
│   │   └── cache.js          # In-memory TTL cache with tag invalidation
│   └── server.js             # App entry, CORS, compression, health check
├── .env.example              # Environment variables template
└── package.json
```

---

## 🛠️ API Reference

### Public Endpoints

| Method | Endpoint | Description | Cache |
|---|---|---|---|
| `GET` | `/api/health` | Service health status & DB latency | No |
| `GET` | `/api/site` | Complete site settings & content bundle | 180s TTL |
| `GET` | `/api/projects` | List all projects ordered by displayOrder | 120s TTL |
| `GET` | `/api/projects/:slug` | Get single project by unique slug | 120s TTL |
| `GET` | `/api/skills` | List all skills grouped by category | 120s TTL |
| `GET` | `/api/experience` | List all career & education timeline entries | 120s TTL |
| `POST`| `/api/messages` | Submit a contact form message | No |
| `POST`| `/api/auth/login` | Authenticate admin user & receive JWT token | No |

### Protected Admin Endpoints (Require `Authorization: Bearer <token>`)

| Method | Endpoint | Description | Cache Invalidation |
|---|---|---|---|
| `GET` | `/api/auth/me` | Verify active admin session | None |
| `POST` | `/api/projects` | Create a new project | `projects` |
| `PUT` | `/api/projects/:id` | Update project details / display order | `projects` |
| `DELETE` | `/api/projects/:id` | Delete project | `projects` |
| `POST` | `/api/skills` | Create a new skill | `skills` |
| `PUT` | `/api/skills/:id` | Update skill proficiency / order | `skills` |
| `DELETE` | `/api/skills/:id` | Delete skill | `skills` |
| `POST` | `/api/experience` | Create experience entry | `experience` |
| `PUT` | `/api/experience/:id` | Update experience entry | `experience` |
| `DELETE` | `/api/experience/:id` | Delete experience entry | `experience` |
| `PUT` | `/api/site` | Update site settings (hero, about, seo, footer) | `site` |
| `GET` | `/api/messages` | View all submitted contact messages | None |
| `PUT` | `/api/messages/:id/read` | Mark contact message as read | None |
| `DELETE` | `/api/messages/:id` | Delete contact message | None |
| `POST` | `/api/uploads` | Upload media image/document (max 8MB) | None |

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Migrate and seed database:**
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

4. **Start in development:**
   ```bash
   npm run dev
   ```

5. **Start in production:**
   ```bash
   node src/server.js
   ```
