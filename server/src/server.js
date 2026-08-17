import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./module/auth/auth.routes.js";
import projectRoutes from "./module/projects/projects.routes.js";
import skillRoutes from "./module/skills/skills.routes.js";
import experienceRoutes from "./module/experience/experience.routes.js";
import messageRoutes from "./module/messages/messages.routes.js";
import uploadRoutes from "./module/uploads/uploads.routes.js";
import siteRoutes from "./module/site/site.routes.js";

const PORT = process.env.PORT || 5500;
const app = express();

// Security / CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"] : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health & Status check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/site', siteRoutes);

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
