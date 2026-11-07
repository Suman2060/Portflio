import { useSite } from '../../../store/siteStore';
import { SectionHeading } from '../../../shared/components/ui/Heading';
import type { Experience } from '../../../types/experience';

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
    <section id="experience" className="border-t border-slate-800/40 relative" data-aos="fade-up">
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
                data-aos="fade-up"
                data-aos-delay={Math.min(i * 90, 300)}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 overflow-hidden">
                  <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
                    <h3 className="font-display uppercase font-bold text-xl md:text-2xl text-ink tracking-tight group-hover:text-brand transition-colors break-words max-w-full">
                      {e.title}
                    </h3>
                    {e.organization && (
                      <div className="text-sm md:text-base font-medium text-brand break-words max-w-full">
                        @ {e.organization}
                      </div>
                    )}
                  </div>
                  
                  {dateRange && (
                    <div className="file-chip self-start text-xs font-mono text-faint shrink-0">
                      📅 {dateRange}
                    </div>
                  )}
                </div>

                {e.description && (
                  <p className="mt-4 text-sm md:text-base leading-relaxed text-mid break-words max-w-full whitespace-pre-line">
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