import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./module/auth/auth.routes.js";
import projectRoutes from "./module/projects/projects.routes.js";


const PORT = process.env.PORT || 5500;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    Status: "Ok",
    message: "Server Running"
  });
});
app.get('/api/test', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on localhost ${PORT}`);
});
