import express from 'express';
import prisma from '../../config/db.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await prisma.experience.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    const item = await prisma.experience.create({ data });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await prisma.experience.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

export default router;
