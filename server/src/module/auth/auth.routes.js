import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import authMiddleware from  '../../middleware/authMiddleware.js'



const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
    res.json({ message: 'You are authenticated', admin: req.admin });
});


router.post('/login', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing. Send JSON with Content-Type: application/json' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;