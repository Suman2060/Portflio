import express from 'express';
import prisma from '../../config/db.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import cache from '../../utils/cache.js';

const router = express.Router();

router.get('/admin', authMiddleware, async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET all projects (cached for 120s)
router.get('/', async (_req, res, next) => {
  try {
    const cacheKey = 'projects:all';
    const cached = cache.get(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    });

    cache.set(cacheKey, projects, 120);
    res.setHeader('X-Cache', 'MISS');
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET single project by slug (cached for 120s)
router.get('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug.trim().toLowerCase();
    const cacheKey = `projects:slug:${slug}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    const project = await prisma.project.findUnique({
      where: { slug },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    cache.set(cacheKey, project, 120);
    res.setHeader('X-Cache', 'MISS');
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// POST new project (Admin only)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      techStack,
      coverImageUrl,
      githubUrl,
      liveUrl,
      isFeatured,
      isPublished,
      displayOrder,
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        shortDescription: shortDescription || null,
        fullDescription: fullDescription || null,
        techStack: Array.isArray(techStack) ? techStack : [],
        coverImageUrl: coverImageUrl || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== false,
        displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
      },
    });

    cache.invalidate('projects');
    res.status(201).json(project);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'A project with that slug already exists' });
    }
    next(err);
  }
});

// PUT update project (Admin only)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const {
      title,
      slug,
      shortDescription,
      fullDescription,
      techStack,
      coverImageUrl,
      githubUrl,
      liveUrl,
      isFeatured,
      isPublished,
      displayOrder,
    } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (slug !== undefined) data.slug = slug.trim().toLowerCase();
    if (shortDescription !== undefined) data.shortDescription = shortDescription;
    if (fullDescription !== undefined) data.fullDescription = fullDescription;
    if (techStack !== undefined) data.techStack = Array.isArray(techStack) ? techStack : [];
    if (coverImageUrl !== undefined) data.coverImageUrl = coverImageUrl;
    if (githubUrl !== undefined) data.githubUrl = githubUrl;
    if (liveUrl !== undefined) data.liveUrl = liveUrl;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (isPublished !== undefined) data.isPublished = Boolean(isPublished);
    if (displayOrder !== undefined) data.displayOrder = Number(displayOrder);

    const project = await prisma.project.update({
      where: { id },
      data,
    });

    cache.invalidate('projects');
    res.json(project);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Slug is already in use by another project' });
    }
    next(err);
  }
});

// DELETE project (Admin only)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    await prisma.project.delete({
      where: { id },
    });

    cache.invalidate('projects');
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    next(err);
  }
});

export default router;
