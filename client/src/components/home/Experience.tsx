import { useSite } from '../../context/SiteContext';
import { SectionHeading } from '../ui/Heading';
import type { Experience } from '../../types/experience';

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso.slice(0, 10);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function ExperienceSection({ experience }: { experience: Experience[] }) {
  const { site } = useSite();
  const labels = site.labels;

  return (
    <section id="experience" className="border-t border-slate-800/40 relative">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col mb-12">
          <div className="file-label mb-3 text-brand">
            ✦ {labels.experienceLabel || 'Track Record'}
          </div>
          <SectionHeading text={typeof labels.experienceHeading === 'string' ? labels.experienceHeading : 'Career & Experience'} />
        </div>

        <div className="flex flex-col gap-6">
          {experience.length === 0 && (
            <div className="panel p-8 text-center text-sm text-mid font-mono">
              {labels.experienceEmpty || 'Experience logs loading...'}
            </div>
          )}

          {experience.map((e, i) => {
            const start = formatDate(e.startDate);
            const end = e.endDate ? formatDate(e.endDate) : 'Present';
            const dateRange = start ? (e.endDate ? `${start} — ${end}` : `${start} — Present`) : '';

            return (
              <div 
                key={e.id ?? i} 
                className="panel p-6 md:p-8 transition-all hover:border-brand/40 group"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display uppercase font-bold text-xl md:text-2xl text-ink tracking-tight group-hover:text-brand transition-colors">
                      {e.title}
                    </h3>
                    {e.organization && (
                      <div className="text-sm md:text-base font-medium text-brand">
                        @ {e.organization}
                      </div>
                    )}
                  </div>
                  
                  {dateRange && (
                    <div className="file-chip self-start text-xs font-mono text-faint">
                      📅 {dateRange}
                    </div>
                  )}
                </div>

                {e.description && (
                  <p className="mt-4 text-sm md:text-base leading-relaxed text-mid">
                    {e.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}