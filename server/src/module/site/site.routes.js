import express from 'express';
import { ZodError } from 'zod';
import prisma from '../../config/db.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import { DEFAULTS, SETTING_KEYS } from './defaults.js';
import { validateSettings } from './site.schema.js';

const router = express.Router();

function mergeSettings(stored, defaults) {
  const out = { ...defaults };
  if (!stored || typeof stored !== 'object') return out;
  for (const [key, val] of Object.entries(stored)) {
    if (val && typeof val === 'object' && !Array.isArray(val) && out[key] && typeof out[key] === 'object') {
      out[key] = { ...out[key], ...val };
    } else if (Array.isArray(val) && Array.isArray(out[key])) {
      out[key] = val.length ? val : out[key];
    } else {
      out[key] = val;
    }
  }
  return out;
}

async function loadSettings() {
  const rows = await prisma.siteSetting.findMany();
  const stored = {};
  for (const row of rows) {
    try {
      stored[row.key] = JSON.parse(row.value);
    } catch {
      stored[row.key] = row.value;
    }
  }
  const settings = {};
  for (const key of SETTING_KEYS) {
    settings[key] = mergeSettings(stored[key], DEFAULTS[key]);
  }
  return settings;
}

async function saveSettings(settings) {
  for (const [key, value] of Object.entries(settings)) {
    if (typeof value === 'object') {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: { key, value: JSON.stringify(value) },
      });
    }
  }
}

// Public — full front-end content bundle for the site
router.get('/', async (_req, res) => {
  try {
    const settings = await loadSettings();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

// Admin — partial update of any section (hero, about, labels, socials, footer, seo)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const clean = validateSettings(req.body);
    const existing = await loadSettings();
    for (const [key, val] of Object.entries(clean)) {
      if (val && typeof val === 'object') existing[key] = { ...existing[key], ...val };
    }
    await saveSettings(existing);
    res.json(existing);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.issues });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

export default router;