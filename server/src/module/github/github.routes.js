import express from 'express';
import prisma from '../../config/db.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import cache from '../../utils/cache.js';

const router = express.Router();
const GITHUB_API_URL = 'https://api.github.com';

router.post('/sync', authMiddleware, async (_req, res, next) => {
  try {
    const username = process.env.GITHUB_USERNAME?.trim();
    if (!username) {
      return res.status(503).json({ error: 'GitHub integration is not configured' });
    }

    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-site',
    };
    const githubToken = process.env.GITHUB_TOKEN?.trim();
    if (githubToken) headers.Authorization = `Bearer ${githubToken}`;

    const response = await fetch(
      `${GITHUB_API_URL}/users/${encodeURIComponent(username)}/repos?type=public&sort=updated&per_page=100`,
      { headers }
    );
    if (!response.ok) {
      const error = new Error(`GitHub API request failed with status ${response.status}`);
      error.status = response.status === 404 ? 404 : 502;
      throw error;
    }

    const repositories = (await response.json()).filter((repository) => !repository.fork);
    for (const [index, repository] of repositories.entries()) {
      await prisma.project.upsert({
        where: { githubId: String(repository.id) },
        update: {
          title: repository.name,
          shortDescription: repository.description,
          fullDescription: repository.description,
          techStack: repository.language ? [repository.language] : [],
          githubUrl: repository.html_url,
          liveUrl: repository.homepage || null,
          displayOrder: index,
        },
        create: {
          githubId: String(repository.id),
          title: repository.name,
          slug: `github-${repository.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          shortDescription: repository.description,
          fullDescription: repository.description,
          techStack: repository.language ? [repository.language] : [],
          githubUrl: repository.html_url,
          liveUrl: repository.homepage || null,
          isPublished: false,
          displayOrder: index,
        },
      });
    }

    cache.invalidate('projects');
    res.json({ synced: repositories.length });
  } catch (err) {
    next(err);
  }
});

export default router;
