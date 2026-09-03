import express from 'express';
import prisma from '../../config/db.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import cache from '../../utils/cache.js';

const router = express.Router();

// GET all skills (cached for 120s)
router.get('/', async (_req, res, next) => {
  try {
    const cacheKey = 'skills:all';
    const cached = cache.get(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const skills = await prisma.skill.findMany({
      orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
    });

    cache.set(cacheKey, skills, 120);
    res.setHeader('X-Cache', 'MISS');
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

// POST create a new skill (Admin only)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name, category, proficiency, displayOrder } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    const skill = await prisma.skill.create({
      data: {
        name: name.trim(),
        category: category ? category.trim() : 'General',
        proficiency: typeof proficiency === 'number' ? proficiency : null,
        displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
      },
    });

    cache.invalidate('skills');
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
});

// PUT update skill (Admin only)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid skill ID' });
    }

    const { name, category, proficiency, displayOrder } = req.body;
    const data = {};

    if (name !== undefined) data.name = name.trim();
    if (category !== undefined) data.category = category ? category.trim() : null;
    if (proficiency !== undefined) data.proficiency = typeof proficiency === 'number' ? proficiency : null;
    if (displayOrder !== undefined) data.displayOrder = Number(displayOrder);

    const skill = await prisma.skill.update({
      where: { id },
      data,
    });

    cache.invalidate('skills');
    res.json(skill);
  } catch (err) {
    if (err?.code === 'P2025') {
      return res.status(404).json({ error: 'Skill not found' });
    }
    next(err);
  }
});

// DELETE skill (Admin only)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid skill ID' });
    }

    await prisma.skill.delete({
      where: { id },
    });

    cache.invalidate('skills');
    res.status(204).send();
  } catch (err) {
    if (err?.code === 'P2025') {
      return res.status(404).json({ error: 'Skill not found' });
    }
    next(err);
  }
});

export default router;
