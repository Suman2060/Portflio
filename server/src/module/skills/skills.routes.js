import express from 'express';
import prisma from '../../config/db.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, category, proficiency, displayOrder } = req.body;
    const skill = await prisma.skill.create({ data: { name, category, proficiency, displayOrder: displayOrder ?? 0 } });
    res.status(201).json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const skill = await prisma.skill.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router;
