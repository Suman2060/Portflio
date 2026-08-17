import express from 'express';
import prisma from '../../config/db.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoint to create a contact message
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'All fields (name, email, message) are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const msg = await prisma.message.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      },
    });
    res.status(201).json({ success: true, message: 'Message delivered successfully', id: msg.id });
  } catch (err) {
    next(err);
  }
});

// Admin endpoints
router.get('/', authMiddleware, async (_req, res, next) => {
  try {
    const msgs = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(msgs);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/read', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const msg = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
    res.json(msg);
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ error: 'Message not found' });
    next(err);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    await prisma.message.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ error: 'Message not found' });
    next(err);
  }
});

export default router;
