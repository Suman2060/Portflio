import { z } from 'zod';

const metricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const siteSettingsSchema = z.object({
  hero: z
    .object({
      name: z.string().optional(),
      displayName: z.string().optional(),
      availability: z.string().optional(),
      openTo: z.string().optional(),
      lines: z.array(z.string()).optional(),
      emphasisLine: z.string().optional(),
      subline: z.string().optional(),
      stickyNote: z.string().optional(),
      primaryCtaLabel: z.string().optional(),
      primaryCtaHref: z.string().optional(),
      secondaryCtaLabel: z.string().optional(),
      secondaryCtaHref: z.string().optional(),
    })
    .passthrough()
    .optional(),
  about: z
    .object({
      label: z.string().optional(),
      lines: z.array(z.string()).optional(),
      emphasis: z.string().optional(),
      paragraph: z.string().optional(),
      metricsLabel: z.string().optional(),
      metrics: z.array(metricSchema).optional(),
    })
    .passthrough()
    .optional(),
  labels: z
    .object({
      work: z.string().optional(),
      workHeading: z.string().optional(),
      workEmpty: z.string().optional(),
      skillsLabel: z.string().optional(),
      skillsHeading: z.string().optional(),
      skillsDesc: z.string().optional(),
      skillsStartChip: z.string().optional(),
      experienceLabel: z.string().optional(),
      experienceEmpty: z.string().optional(),
      contactLabel: z.string().optional(),
      contactLines: z.array(z.string()).optional(),
      contactEmphasis: z.string().optional(),
      contactSub: z.string().optional(),
      footerFrame: z.string().optional(),
    })
    .passthrough()
    .optional(),
  socials: z
    .object({
      email: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
    })
    .passthrough()
    .optional(),
  footer: z
    .object({
      tagline: z.string().optional(),
      email: z.string().optional(),
      copyrightName: z.string().optional(),
      madeWith: z.string().optional(),
    })
    .passthrough()
    .optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      author: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .passthrough()
    .optional(),
});

const SECTION_SCHEMAS = {
  hero: siteSettingsSchema.shape.hero,
  about: siteSettingsSchema.shape.about,
  labels: siteSettingsSchema.shape.labels,
  socials: siteSettingsSchema.shape.socials,
  footer: siteSettingsSchema.shape.footer,
  seo: siteSettingsSchema.shape.seo,
};

export function validateSettings(body) {
  const parsed = siteSettingsSchema.parse(body);
  const clean = {};
  for (const key of Object.keys(SECTION_SCHEMAS)) {
    if (parsed[key] && typeof parsed[key] === 'object') clean[key] = SECTION_SCHEMAS[key].parse(parsed[key]);
  }
  return clean;
}