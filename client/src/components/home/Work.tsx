import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { resolveMediaUrl } from '../../utils/media';
import { SectionHeading } from '../ui/Heading';
import type { Project } from '../../types/project';

export default function Work({ projects, loading }: { projects: Project[]; loading: boolean }) {
  const { site } = useSite();
  const labels = site.labels;

  const featured = projects.filter((p) => p.isFeatured);
  const workList = featured.length > 0 ? featured : projects;

  return (
    <section id="work" className="border-t border-slate-800/40 relative">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="file-label mb-3 text-brand">
              ✦ {labels.work || 'Featured Engineering'}
            </div>
            <SectionHeading text={labels.workHeading || 'Engineered Projects'} />
          </div>
          <span className="file-chip hidden sm:inline-flex text-xs">
            {workList.length} {workList.length === 1 ? 'Project' : 'Projects'} Logged ↓
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="panel p-6 animate-pulse flex items-center gap-6">
                <div className="w-12 h-12 rounded bg-slate-800" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-1/3 bg-slate-800 rounded" />
                  <div className="h-4 w-2/3 bg-slate-800/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : workList.length === 0 ? (
          <div className="panel p-12 text-center text-sm font-mono text-mid">
            {labels.workEmpty || 'No projects currently published. Add your projects from the admin panel.'}
          </div>
        ) : (
          <div className="space-y-4">
            {workList.map((p, i) => {
              const cover = resolveMediaUrl(p.coverImageUrl);
              return (
                <div
                  key={p.id}
                  className="panel p-6 md:p-8 hover:border-brand/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left: Index & Details */}
                    <div className="flex items-start gap-4 md:gap-6 flex-1 min-w-0">
                      <span className="font-mono text-xs md:text-sm font-bold text-brand py-1">
                        0{i + 1}
                      </span>

                      {cover && (
                        <img
                          src={cover}
                          alt={p.title}
                          loading="lazy"
                          className="hidden sm:block w-28 h-20 object-cover rounded-lg border border-slate-700/60 shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <Link 
                            to={`/projects/${p.slug}`}
                            className="font-display font-bold uppercase text-2xl md:text-3xl text-ink hover:text-brand transition-colors tracking-tight"
                          >
                            {p.title}
                          </Link>
                          {p.isFeatured && (
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-brand/40 text-brand bg-brand/10">
                              Featured
                            </span>
                          )}
                        </div>

                        {p.shortDescription && (
                          <p className="text-sm md:text-base text-mid line-clamp-2 max-w-2xl">
                            {p.shortDescription}
                          </p>
                        )}

                        {/* Tech Stack Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.techStack.map((t) => (
                            <span key={t} className="file-chip text-[10px] py-0.5 px-2">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Action Links */}
                    <div className="flex items-center gap-3 shrink-0 self-end lg:self-center pt-2 lg:pt-0">
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-ghost text-xs py-2 px-3.5"
                          title="View Source Code"
                        >
                          GitHub ↗
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-brand text-xs py-2 px-3.5"
                          title="View Live Demo"
                        >
                          Live Demo ↗
                        </a>
                      )}
                      <Link
                        to={`/projects/${p.slug}`}
                        className="btn btn-ghost text-xs py-2 px-3"
                        title="Read Case Study"
                      >
                        Details →
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}