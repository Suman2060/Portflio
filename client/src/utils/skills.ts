import type { Skill } from '../types/skill';

export interface CategorizedSkills {
  category: string;
  icon: string;
  color: string;
  items: { name: string; level: number }[];
}

export const DEFAULT_SKILL_CATEGORIES: CategorizedSkills[] = [
  {
    category: 'Frontend Engineering',
    icon: '⚡',
    color: '#00f2fe',
    items: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'Redux / Zustand', level: 85 },
      { name: 'HTML5 / CSS3', level: 95 },
    ],
  },
  {
    category: 'Backend & APIs',
    icon: '⚙️',
    color: '#38bdf8',
    items: [
      { name: 'Node.js', level: 90 },
      { name: 'Express.js', level: 92 },
      { name: 'REST APIs', level: 95 },
      { name: 'GraphQL', level: 78 },
      { name: 'Authentication / JWT', level: 90 },
      { name: 'Microservices', level: 80 },
    ],
  },
  {
    category: 'Databases & ORMs',
    icon: '🗄️',
    color: '#a855f7',
    items: [
      { name: 'PostgreSQL', level: 88 },
      { name: 'Prisma ORM', level: 92 },
      { name: 'MongoDB', level: 82 },
      { name: 'Redis', level: 75 },
      { name: 'SQL Optimization', level: 85 },
    ],
  },
  {
    category: 'DevOps & Tooling',
    icon: '🚀',
    color: '#10b981',
    items: [
      { name: 'Docker', level: 82 },
      { name: 'Git / GitHub', level: 92 },
      { name: 'CI / CD Pipelines', level: 80 },
      { name: 'Vercel / Render', level: 90 },
      { name: 'Nginx', level: 75 },
      { name: 'Linux / Bash', level: 85 },
    ],
  },
];

export function cleanSkillName(skill: Skill): string {
  const name = (skill.name || '').trim();
  // Fix common typo in existing database
  if (name.toLowerCase() === 'typesscript') return 'TypeScript';
  return name;
}

export function fillSkills(skills: Skill[]): Skill[] {
  const base = skills
    .filter((s) => s.name && s.name.trim())
    .map((s) => ({ ...s, name: cleanSkillName(s) }));

  const existingNames = new Set(base.map((s) => s.name.toLowerCase()));

  const defaultList = [
    'TypeScript',
    'React',
    'Node.js',
    'Next.js',
    'Express.js',
    'PostgreSQL',
    'Prisma',
    'Tailwind CSS',
    'Docker',
    'REST APIs',
    'MongoDB',
    'Git',
  ];

  const added: Skill[] = [];
  for (const name of defaultList) {
    if (!existingNames.has(name.toLowerCase())) {
      added.push({ id: Math.random(), name });
      existingNames.add(name.toLowerCase());
    }
  }

  return [...base, ...added];
}