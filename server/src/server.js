import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import compression from "compression";
import path from "path";
import prisma from "./config/db.js";

import authRoutes from "./module/auth/auth.routes.js";
import projectRoutes from "./module/projects/projects.routes.js";
import skillRoutes from "./module/skills/skills.routes.js";
import experienceRoutes from "./module/experience/experience.routes.js";
import messageRoutes from "./module/messages/messages.routes.js";
import uploadRoutes from "./module/uploads/uploads.routes.js";
import siteRoutes from "./module/site/site.routes.js";
import githubRoutes from "./module/github/github.routes.js";

const PORT = process.env.PORT || 5500;
const app = express();

// Enable HTTP ETag for client-side caching & 304 Not Modified
app.set("etag", "strong");

// Compress HTTP responses with Gzip/Deflate
app.use(
  compression({
    level: 6,
    threshold: 1024, // only compress responses > 1KB
  })
);

// Advanced CORS configuration
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const defaultDevOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      
      const isAllowed =
        allowedOrigins.length === 0 ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        defaultDevOrigins.includes(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    maxAge: 86400, // 24 hours preflight cache
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files with cache headers
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    maxAge: "7d",
    immutable: true,
  })
);

// Health & Status check with DB connection latency
app.get("/api/health", async (_req, res) => {
  const startTime = Date.now();
  let dbStatus = "disconnected";
  let dbLatency = null;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
    dbLatency = `${Date.now() - startTime}ms`;
  } catch (err) {
    dbStatus = "error: " + (err.message || "database unreachable");
  }

  const isHealthy = dbStatus === "connected";
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "healthy" : "degraded",
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStatus,
      latency: dbLatency,
    },
    timestamp: new Date().toISOString(),
  });
});

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/github", githubRoutes);

// Global Error Handler Middleware
app.use((err, _req, res, _next) => {
  console.error("Unhandled Server Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio API running on port ${PORT}`);
});
