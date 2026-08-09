import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./module/auth/auth.routes.js";
import projectRoutes from "./module/projects/projects.routes.js";
import skillRoutes from "./module/skills/skills.routes.js";
import experienceRoutes from "./module/experience/experience.routes.js";
import messageRoutes from "./module/messages/messages.routes.js";
import uploadRoutes from "./module/uploads/uploads.routes.js";

const PORT = process.env.PORT || 5500;
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    Status: "Ok",
    message: "Server Running"
  });
});
app.get('/api/test', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/uploads', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on localhost ${PORT}`);
});
