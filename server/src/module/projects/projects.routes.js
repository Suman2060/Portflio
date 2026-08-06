import express from 'express';
console.log('projects.routes.js loaded');
import prisma from '../../config/db.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { displayOrder: 'asc' },
        });
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to fetch projects"
        });
    }
});

router.get('/:slug', async (req, res) => {
    try {
        const project = await prisma.project.findUnique({
            where: { slug: req.params.slug },
        });
        if (!project) {
            return res.status(404).json({
                error: "Project Not found"
            });
        }
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch Projects'
        });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, slug, shortDescription, fullDescription, techStack, coverImageUrl, githubUrl, liveUrl, isFeatured, displayOrder } = req.body;

        // Basic validation
        if (!title || !slug) {
            return res.status(400).json({
                error: "Title and slug are required"
            });
        }

        console.log('Creating project with slug:', slug);
        const project = await prisma.project.create({
            data: {
                title,
                slug,
                shortDescription,
                fullDescription,
                techStack: techStack || [],
                coverImageUrl,
                githubUrl,
                liveUrl,
                isFeatured: isFeatured ?? false,
                displayOrder: displayOrder ?? 0,
            },
        });
        res.status(201).json(project);
    } catch (err) {
        console.error('Error creating project:', err);
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'A project with that slug already exists' });
        }
        // Provide more context for troubleshooting
        return res.status(500).json({
            error: 'Failed to create project',
            details: err.message
        });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await prisma.project.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.json(project);
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') {
            return res.status(404).json({
                error: 'Project not found'
            });
        }
        res.status(500).json({ error: 'Failed to update project' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.project.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(204).send();
    } catch (err) {
        console.error(err);
        if (err.code === 'P2025') {
            return res.status(404).json({
                error: 'Project Not Found'
            });
        }
        res.status(500).json({ error: "Failed to delete project" });
    }
});

export default router;
