import { useState, useMemo } from 'react';
import { useSite } from '../../context/SiteContext';
import { SectionHeading } from '../ui/Heading';
import {
  cleanSkillName,
  getSkillCategory,
  getSkillSummary,
  getSkillBadge,
} from '../../utils/skills';
import type { Skill } from '../../types/skill';

export default function Skills({ skills }: { skills: Skill[] }) {
  const { site } = useSite();
  const labels = site.labels;
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Dynamically compute unique categories from database skills
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const s of skills) {
      set.add(getSkillCategory(s));
    }
    const catList = Array.from(set);
    // Sort logically if standard categories are present
    const order = ['Frontend', 'Backend', 'Database', 'DevOps & Tools', 'General'];
    catList.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
    return ['All', ...catList];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skills;
    return skills.filter((s) => getSkillCategory(s) === activeCategory);
  }, [skills, activeCategory]);

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Primary':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Daily Driver':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Production':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <section id="skills" className="border-t border-slate-800/40 relative">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="file-label mb-3 text-brand">
              ✦ {labels.skillsLabel || 'Technical Arsenal'}
            </div>
            <SectionHeading text={labels.skillsHeading || 'Skills & Capabilities'} />
          </div>
          <p className="text-sm md:text-base text-mid max-w-md">
            {labels.skillsDesc ||
              'A practical, battle-tested full-stack toolkit focused on performance, clean architecture, and rapid shipping.'}
          </p>
        </div>

        {/* Dynamic Category Filter Pills */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-8" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`file-chip cursor-pointer transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Skills Cards Grid */}
        {filteredSkills.length === 0 ? (
          <div className="panel p-12 text-center text-sm font-mono text-mid">
            No skills found in this category. Manage and add skills from the Admin Dashboard.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredSkills.map((skill) => {
              const name = cleanSkillName(skill);
              const category = getSkillCategory(skill);
              const badge = getSkillBadge(skill);
              const summary = getSkillSummary(skill);

              return (
                <div
                  key={skill.id || skill.name}
                  className="panel p-5 sm:p-6 transition-all duration-200 hover:border-cyan-500/40 hover:-translate-y-1 group flex flex-col justify-between overflow-hidden"
                >
                  <div className="overflow-hidden space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display font-bold text-lg text-ink group-hover:text-cyan-400 transition-colors break-words max-w-full">
                        {name}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {skill.proficiency ? (
                          <span className="text-[10px] font-mono text-cyan-400">
                            {skill.proficiency}%
                          </span>
                        ) : null}
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${getBadgeStyle(
                            badge
                          )}`}
                        >
                          {badge}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-mid leading-relaxed break-words max-w-full">
                      {summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-faint">
                    <span className="truncate max-w-[150px]">{category}</span>
                    <span className="text-cyan-400/80 shrink-0">✦ Production</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Architecture Philosophy Footer Card */}
        <div className="mt-10 panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-cyan-500/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ⚡
            </span>
            <div>
              <h4 className="text-sm font-bold text-ink">Engineering Standard</h4>
              <p className="text-xs text-mid">
                Strict TypeScript · Clean REST Contracts · Relational Integrity · Containerized Deployments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="file-chip text-xs">Zero Bloat</span>
            <span className="file-chip text-xs text-emerald-400 border-emerald-500/30">100% Type-Safe</span>
          </div>
        </div>

      </div>
    </section>
  );
}