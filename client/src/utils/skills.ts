import type { Skill } from '../types/skill';

export const KNOWN_SKILL_META: Record<string, { category: string; summary: string; defaultBadge: string }> = {
  'react': {
    category: 'Frontend',
    summary: 'Component-driven architecture, custom hooks, performance tuning, and SPA state management.',
    defaultBadge: 'Primary',
  },
  'react.js': {
    category: 'Frontend',
    summary: 'Component-driven architecture, custom hooks, performance tuning, and SPA state management.',
    defaultBadge: 'Primary',
  },
  'typescript': {
    category: 'Frontend',
    summary: 'End-to-end type safety, generics, interfaces, and clean maintainable codebases.',
    defaultBadge: 'Primary',
  },
  'javascript': {
    category: 'Frontend',
    summary: 'Modern ESNext syntax, asynchronous programming, DOM APIs, and functional patterns.',
    defaultBadge: 'Primary',
  },
  'next.js': {
    category: 'Frontend',
    summary: 'SSR, SSG, App Router, server actions, and SEO-optimized web applications.',
    defaultBadge: 'Daily Driver',
  },
  'tailwind css': {
    category: 'Frontend',
    summary: 'Design systems, modern responsive layouts, custom utility tokens, and dark mode themes.',
    defaultBadge: 'Daily Driver',
  },
  'tailwind': {
    category: 'Frontend',
    summary: 'Design systems, modern responsive layouts, custom utility tokens, and dark mode themes.',
    defaultBadge: 'Daily Driver',
  },
  'zustand': {
    category: 'Frontend',
    summary: 'Lightweight, hook-based client state management and persistent storage.',
    defaultBadge: 'Production',
  },
  'redux': {
    category: 'Frontend',
    summary: 'Predictable state container, middleware, and Redux Toolkit architecture.',
    defaultBadge: 'Production',
  },
  'html / css': {
    category: 'Frontend',
    summary: 'Semantic HTML5 markup, responsive CSS3 grids, flexbox, and accessible web standards.',
    defaultBadge: 'Daily Driver',
  },
  'node.js': {
    category: 'Backend',
    summary: 'Event-driven server runtimes, asynchronous processing, and microservice backends.',
    defaultBadge: 'Primary',
  },
  'node': {
    category: 'Backend',
    summary: 'Event-driven server runtimes, asynchronous processing, and microservice backends.',
    defaultBadge: 'Primary',
  },
  'express.js': {
    category: 'Backend',
    summary: 'RESTful API routing, centralized error handlers, security middleware, and file pipelines.',
    defaultBadge: 'Primary',
  },
  'express': {
    category: 'Backend',
    summary: 'RESTful API routing, centralized error handlers, security middleware, and file pipelines.',
    defaultBadge: 'Primary',
  },
  'rest apis': {
    category: 'Backend',
    summary: 'HTTP conventions, rate limiting, request validation with Zod, and clear endpoint contracts.',
    defaultBadge: 'Daily Driver',
  },
  'jwt & security': {
    category: 'Backend',
    summary: 'Stateless token authentication, bcrypt hashing, role-based access control (RBAC), and CORS.',
    defaultBadge: 'Production',
  },
  'graphql': {
    category: 'Backend',
    summary: 'Type-safe queries, mutations, resolvers, and efficient data aggregation.',
    defaultBadge: 'Proficient',
  },
  'postgresql': {
    category: 'Database',
    summary: 'Relational data modeling, foreign key constraints, indexing, and complex queries.',
    defaultBadge: 'Primary',
  },
  'postgres': {
    category: 'Database',
    summary: 'Relational data modeling, foreign key constraints, indexing, and complex queries.',
    defaultBadge: 'Primary',
  },
  'prisma orm': {
    category: 'Database',
    summary: 'Type-safe schema definitions, automated migrations, seeding, and efficient relations.',
    defaultBadge: 'Daily Driver',
  },
  'prisma': {
    category: 'Database',
    summary: 'Type-safe schema definitions, automated migrations, seeding, and efficient relations.',
    defaultBadge: 'Daily Driver',
  },
  'mongodb': {
    category: 'Database',
    summary: 'Document-oriented schemas, aggregation pipelines, and flexible prototyping.',
    defaultBadge: 'Production',
  },
  'redis': {
    category: 'Database',
    summary: 'In-memory caching, session storage, and rate-limit counters.',
    defaultBadge: 'Proficient',
  },
  'docker': {
    category: 'DevOps & Tools',
    summary: 'Containerizing full-stack microservices, multi-stage builds, and Docker Compose environments.',
    defaultBadge: 'Daily Driver',
  },
  'git & github': {
    category: 'DevOps & Tools',
    summary: 'Version control, feature branching, PR code reviews, and semantic commit history.',
    defaultBadge: 'Primary',
  },
  'git': {
    category: 'DevOps & Tools',
    summary: 'Version control, feature branching, PR code reviews, and semantic commit history.',
    defaultBadge: 'Primary',
  },
  'linux & nginx': {
    category: 'DevOps & Tools',
    summary: 'Bash scripting, reverse proxy setup, static asset hosting, and SSL configuration.',
    defaultBadge: 'Production',
  },
  'nginx': {
    category: 'DevOps & Tools',
    summary: 'Reverse proxying, load balancing, SSL termination, and static file serving.',
    defaultBadge: 'Production',
  },
  'ci / cd': {
    category: 'DevOps & Tools',
    summary: 'Automated build and test pipelines with GitHub Actions.',
    defaultBadge: 'Proficient',
  },
};

export function cleanSkillName(skill: Skill): string {
  const name = (skill.name || '').trim();
  if (name.toLowerCase() === 'typesscript') return 'TypeScript';
  return name;
}

export function getSkillCategory(skill: Skill): string {
  if (skill.category && skill.category.trim()) {
    return skill.category.trim();
  }
  const lookup = KNOWN_SKILL_META[cleanSkillName(skill).toLowerCase()];
  return lookup?.category || 'General';
}

export function getSkillSummary(skill: Skill): string {
  const lookup = KNOWN_SKILL_META[cleanSkillName(skill).toLowerCase()];
  if (lookup?.summary) return lookup.summary;
  return `Practical production experience with ${cleanSkillName(skill)} across modern applications.`;
}

export function getSkillBadge(skill: Skill): string {
  if (skill.proficiency) {
    if (skill.proficiency >= 90) return 'Primary';
    if (skill.proficiency >= 80) return 'Daily Driver';
    if (skill.proficiency >= 70) return 'Production';
    return 'Proficient';
  }
  const lookup = KNOWN_SKILL_META[cleanSkillName(skill).toLowerCase()];
  return lookup?.defaultBadge || 'Proficient';
}

export function fillSkills(skills: Skill[]): Skill[] {
  return skills
    .filter((s) => s.name && s.name.trim())
    .map((s) => ({ ...s, name: cleanSkillName(s) }));
}