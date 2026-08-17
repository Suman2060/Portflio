export interface HeroSettings {
  name: string;
  displayName: string;
  availability: string;
  openTo: string;
  lines: string[];
  emphasisLine: string;
  subline: string;
  stickyNote: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroImage: string;
  [key: string]: unknown;
}

export interface Metric {
  value: string;
  label: string;
}

export interface AboutSettings {
  label: string;
  lines: string[];
  emphasis: string;
  paragraph: string;
  metricsLabel: string;
  metrics: Metric[];
  [key: string]: unknown;
}

export interface LabelsSettings {
  work: string;
  workHeading: string;
  workEmpty: string;
  skillsLabel: string;
  skillsHeading: string;
  skillsDesc: string;
  skillsStartChip: string;
  experienceLabel: string;
  experienceEmpty: string;
  contactLabel: string;
  contactLines: string[];
  contactEmphasis: string;
  contactSub: string;
  footerFrame: string;
  [key: string]: unknown;
}

export interface SocialsSettings {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  [key: string]: unknown;
}

export interface FooterSettings {
  tagline: string;
  email: string;
  copyrightName: string;
  madeWith: string;
  [key: string]: unknown;
}

export interface SeoSettings {
  title: string;
  description: string;
  author: string;
  ogImage: string;
  [key: string]: unknown;
}

export interface SiteSettings {
  hero: HeroSettings;
  about: AboutSettings;
  labels: LabelsSettings;
  socials: SocialsSettings;
  footer: FooterSettings;
  seo: SeoSettings;
}

export type SiteSection = keyof SiteSettings;

export const DEFAULT_SITE: SiteSettings = {
  hero: {
    name: 'Suman Dangol',
    displayName: 'Suman Dangol',
    availability: 'available for opportunities',
    openTo: 'Open to Full-Time Roles & High-Impact Contracts',
    lines: ['FULL-STACK', 'ENGINEER'],
    emphasisLine: '& ARCHITECT',
    subline:
      'Designing and shipping end-to-end web applications with React, Node.js, TypeScript, PostgreSQL, and modern cloud infrastructure.',
    stickyNote: 'Full-Stack · Scalable Systems · Clean Code',
    primaryCtaLabel: 'Get in Touch',
    primaryCtaHref: '#contact',
    secondaryCtaLabel: 'Explore Projects',
    secondaryCtaHref: '#work',
    heroImage: '',
  },
  about: {
    label: 'about',
    lines: ['architecting scalable', 'solutions from'],
    emphasis: 'database to UI',
    paragraph:
      'I am a full-stack engineer passionate about creating resilient backend services, scalable databases, and intuitive frontend experiences. With expertise across the entire JavaScript/TypeScript ecosystem, I build fast, reliable, and production-ready applications.',
    metricsLabel: 'impact',
    metrics: [
      { value: '{projects}', label: 'projects deployed' },
      { value: '99.9%', label: 'uptime focus' },
      { value: '{roles}', label: 'roles logged' },
      { value: '100%', label: 'clean architecture' },
    ],
  },
  labels: {
    work: 'featured work',
    workHeading: 'engineered projects',
    workEmpty: 'No projects logged yet — check back soon.',
    skillsLabel: 'technical arsenal',
    skillsHeading: 'full-stack proficiency',
    skillsDesc:
      'Hands-on expertise across modern client frameworks, server runtimes, relational & NoSQL databases, and DevOps tooling.',
    skillsStartChip: 'capabilities',
    experienceLabel: 'track record',
    experienceEmpty: 'Experience logs loading...',
    contactLabel: 'get in touch',
    contactLines: ['let\u2019s build something', 'extraordinary'],
    contactEmphasis: 'together',
    contactSub: 'Whether you have a new venture, an open full-stack role, or an architecture challenge — I\u2019d love to connect.',
    footerFrame: 'footer',
  },
  socials: {
    email: 'sumandangol2060@gmail.com',
    github: 'https://github.com/Suman2060',
    linkedin: '',
    twitter: '',
  },
  footer: {
    tagline: 'Ready to build high-performance\nfull-stack software?',
    email: 'sumandangol2060@gmail.com',
    copyrightName: 'Suman Dangol',
    madeWith: 'Engineered with React 19, TypeScript, Node.js & Tailwind CSS',
  },
  seo: {
    title: 'Suman Dangol — Full-Stack Developer & Software Architect',
    description:
      'Suman Dangol is a full-stack developer specializing in scalable web systems, React, Node.js, PostgreSQL, and cloud deployments.',
    author: 'Suman Dangol',
    ogImage: '',
  },
};

export function resolveMetricValue(value: string, projects: number, roles: number): string {
  if (value === '{projects}') return String(projects);
  if (value === '{roles}') return String(roles);
  return value;
}