import express from 'express';
import prisma from '../../config/db.js';

const router = express.Router();

// Public endpoint to create a message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required' });
    const msg = await prisma.message.create({ data: { name, email, message } });
    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Admin endpoints
import authMiddleware from '../../middleware/authMiddleware.js';

router.get('/', authMiddleware, async (req, res) => {
  try {
    const msgs = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const msg = await prisma.message.update({ where: { id: Number(req.params.id) }, data: { isRead: true } });
    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

export default router;
