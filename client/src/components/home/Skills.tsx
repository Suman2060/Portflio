import { useSite } from '../../context/SiteContext';
import { SectionHeading } from '../ui/Heading';
import { DEFAULT_SKILL_CATEGORIES } from '../../utils/skills';
import type { Skill } from '../../types/skill';

export default function Skills({ skills: _skills }: { skills: Skill[] }) {
  const { site } = useSite();
  const labels = site.labels;

  return (
    <section id="skills" className="border-t border-slate-800/40 relative">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="file-label mb-3 text-brand">
              ✦ {labels.skillsLabel || 'Technical Arsenal'}
            </div>
            <SectionHeading text={labels.skillsHeading || 'Full-Stack Proficiency'} />
          </div>
          <p className="text-sm md:text-base text-mid max-w-md">
            {labels.skillsDesc ||
              'From front-end architecture and state management to high-throughput backend APIs and database modeling.'}
          </p>
        </div>

        {/* Categorized Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {DEFAULT_SKILL_CATEGORIES.map((cat) => (
            <div key={cat.category} className="skill-card group">
              <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-hairline">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    {cat.icon}
                  </span>
                  <h3 className="font-display font-bold text-lg md:text-xl text-ink">
                    {cat.category}
                  </h3>
                </div>
                <span className="text-xs font-mono text-faint">production-ready</span>
              </div>

              {/* Skill Bars */}
              <div className="space-y-4">
                {cat.items.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-ink font-medium">{skill.name}</span>
                      <span className="text-brand">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${skill.level}%`,
                          background: `linear-gradient(90deg, var(--brand-deep), var(--brand))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architectural summary banner */}
        <div className="mt-8 panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-sm font-bold text-ink">Modern Development Workflow</div>
              <div className="text-xs text-mid">Strict TypeScript · Test-Driven · Git Flow · Dockerized Deployments</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="file-chip text-xs">CI/CD Ready</span>
            <span className="file-chip text-xs text-brand">Clean Code</span>
          </div>
        </div>

      </div>
    </section>
  );
}