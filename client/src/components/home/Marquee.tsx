import type { Skill } from '../../types/skill';
import { cleanSkillName } from '../../utils/skills';

export default function Marquee({ skills }: { skills: Skill[] }) {
  const displaySkills = skills.length > 0 ? skills : [
    { id: 1, name: 'React' },
    { id: 2, name: 'Node.js' },
    { id: 3, name: 'TypeScript' },
    { id: 4, name: 'PostgreSQL' },
    { id: 5, name: 'Prisma' },
    { id: 6, name: 'Next.js' },
    { id: 7, name: 'Docker' },
    { id: 8, name: 'REST APIs' },
    { id: 9, name: 'Tailwind CSS' },
  ];

  return (
    <section className="marquee py-4 border-y border-slate-800/40 relative z-20">
      <div className="marquee-track">
        {[0, 1, 2].map((k) => (
          <span
            key={k}
            className="flex items-center font-mono font-semibold uppercase tracking-widest text-xs sm:text-sm text-mid"
            style={{ gap: 32, paddingRight: 32, minWidth: 'max-content' }}
          >
            {displaySkills.map((s, i) => (
              <span key={`${s.name}-${i}`} className="flex items-center gap-6 hover:text-brand transition-colors">
                <span>{cleanSkillName(s)}</span>
                <span className="text-brand text-xs opacity-70">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}