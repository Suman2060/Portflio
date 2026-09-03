# 💻 Portfolio Frontend Client (React 19 + Vite + Tailwind CSS)

High-performance, cyber-minimalist portfolio frontend with an integrated Admin Studio, featuring route-level code splitting, theme switching, smooth animations, and optimized asset chunking.

---

## ⚡ Tech Stack & Libraries

- **React 19**: Latest React features with Server-ready abstractions and React Hooks.
- **TypeScript**: Strict type checking and type safety across all components and API layers.
- **Vite 8 & @tailwindcss/vite**: Next-gen development bundling with ultra-fast HMR and Tailwind CSS v4.
- **React Router 7**: Client-side routing with lazy-loaded code-splitting for subroutes.
- **@dnd-kit**: Drag-and-drop toolkit for reordering projects and skills in the Admin Studio.
- **Axios**: HTTP client with request interceptors for automatic JWT authorization injection.

---

## 📂 Frontend Directory Structure

```text
client/
├── public/                   # Static assets (favicons, robots.txt)
├── src/
│   ├── api/                  # Typed API request services (Axios client)
│   │   ├── client.ts         # Axios base client with Bearer token interceptor
│   │   ├── experience.ts     # Experience CRUD API calls
│   │   ├── messages.ts       # Contact messages API calls
│   │   ├── projects.ts       # Projects CRUD API calls
│   │   ├── site.ts           # Site settings API calls
│   │   ├── skills.ts         # Skills CRUD API calls
│   │   └── uploads.ts        # Image upload API calls
│   │
│   ├── components/           # Reusable UI & section components
│   │   ├── DarkModeToggle.tsx # Theme toggle switch
│   │   ├── SiteSettingsManager.tsx # Admin site content editor
│   │   ├── admin/            # Admin Studio tabs (Projects, Skills, Experience, Messages)
│   │   ├── home/             # Landing page sections (Hero, Statement, Work, Skills, Experience, Contact)
│   │   ├── layout/           # Header, Footer, Navigation, Container
│   │   └── ui/               # Custom cursor, modals, chips, buttons
│   │
│   ├── context/              # React Context (SiteContext for live settings)
│   ├── hooks/                # Custom hooks (useSeo, etc.)
│   ├── pages/                # Route pages
│   │   ├── Home.tsx          # Main portfolio showcase
│   │   ├── Login.tsx         # Admin authentication login
│   │   ├── Dashboard.tsx     # Content Studio Admin Dashboard
│   │   └── ProjectDetail.tsx # Deep-dive project case study page
│   │
│   ├── types/                # TypeScript interface and type declarations
│   ├── utils/                # Utility helpers
│   ├── App.tsx               # Root application router with Suspense lazy loading
│   ├── index.css             # Design system tokens, typography, and dark mode theme
│   └── main.tsx              # React entry point
│
├── .env.example              # Environment variables template
├── index.html                # Entry HTML with Google Fonts preconnections
├── nginx.conf                # Nginx production reverse proxy config
├── package.json
└── vite.config.ts            # Vite bundler & Rollup manualChunks configuration
```

---

## 🚀 Bundle & Performance Optimizations

### 1. Code Splitting & Lazy Loading
- The Admin Studio (`Dashboard.tsx`), `Login.tsx`, and `ProjectDetail.tsx` are lazy-loaded via `React.lazy()` and `Suspense`.
- Regular portfolio visitors do not download the heavy `@dnd-kit` library or admin editor modules on the landing page.

### 2. Rollup Manual Chunks
`vite.config.ts` partitions vendor packages into dedicated, long-term cached bundles:
- `vendor-react`: React, React-DOM, React-Router-DOM
- `vendor-dnd`: @dnd-kit/core, @dnd-kit/sortable
- `vendor-ui`: Headless UI & Heroicons
- `vendor-http`: Axios

### 3. Build Results
- Initial landing page bundle (`index.js`): **~13.28 kB** (4.87 kB gzip)
- Build time: **~2.8s**

---

## 🛠️ Development & Build Scripts

```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:5173)
npm run dev

# Run TypeScript check & production build
npm run build

# Preview production build locally
npm run preview

# Run ESLint linter
npm run lint
```
