import express from 'express';
import prisma from '../../config/db.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.experience.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { title, organization, description, startDate, endDate, displayOrder } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const item = await prisma.experience.create({
      data: {
        title: title.trim(),
        organization: organization ? organization.trim() : null,
        description: description || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
      },
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const { title, organization, description, startDate, endDate, displayOrder } = req.body;
    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (organization !== undefined) data.organization = organization ? organization.trim() : null;
    if (description !== undefined) data.description = description;
    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
    if (displayOrder !== undefined) data.displayOrder = Number(displayOrder);

    const item = await prisma.experience.update({
      where: { id },
      data,
    });
    res.json(item);
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ error: 'Experience not found' });
    next(err);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    await prisma.experience.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ error: 'Experience not found' });
    next(err);
  }
});

export default router;
