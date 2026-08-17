import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug } from '../api/projects';
import { resolveMediaUrl } from '../utils/media';
import type { Project } from '../types/project';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true);
        const p = await getProjectBySlug(slug);
        setProject(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-sm font-mono text-mid">
        Loading project specifications...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-display font-bold uppercase mb-2">Project Not Found</h2>
        <p className="text-mid mb-6 text-sm">The project you requested does not exist or has been removed.</p>
        <Link to="/#work" className="btn btn-brand text-xs">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const paragraphs = (project.fullDescription || '').split(/\n+/).filter(Boolean);
  const cover = !imageFailed ? resolveMediaUrl(project.coverImageUrl) : undefined;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      
      {/* Navigation Breadcrumb */}
      <div className="mb-8">
        <Link to="/#work" className="file-chip text-xs hover:border-brand transition-colors">
          ← Back to All Projects
        </Link>
      </div>

      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="file-label text-brand">Case Study</span>
          {project.isFeatured && (
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-brand/40 text-brand bg-brand/10">
              Featured Project
            </span>
          )}
        </div>

        <h1 className="font-display font-extrabold uppercase text-3xl sm:text-5xl md:text-6xl text-ink tracking-tight">
          {project.title}
        </h1>

        {project.shortDescription && (
          <p className="text-lg md:text-xl text-mid leading-relaxed max-w-2xl">
            {project.shortDescription}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-4">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-ghost text-xs sm:text-sm">
            Source Code (GitHub) <span className="arrow">↗</span>
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-brand text-xs sm:text-sm">
            Live Deployment <span className="arrow">↗</span>
          </a>
        )}
      </div>

      {/* Project Cover Image */}
      {cover && (
        <div className="mt-10 panel overflow-hidden border-brand/30">
          <img
            src={cover}
            alt={project.title}
            onError={() => setImageFailed(true)}
            loading="lazy"
            className="w-full object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Tech Stack Chips */}
      <div className="mt-10 panel p-6">
        <span className="file-label text-xs mb-3 block">Technologies & Architecture</span>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <span key={t} className="file-chip text-xs py-1 px-3">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Detailed Description */}
      {paragraphs.length > 0 && (
        <div className="mt-10 panel p-6 sm:p-8 space-y-4">
          <span className="file-label text-xs block">Engineering Overview</span>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base sm:text-lg leading-relaxed text-mid">
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 pt-8 border-t border-hairline flex items-center justify-between">
        <Link to="/#work" className="btn btn-ghost text-xs">
          ← Back to Projects
        </Link>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs font-mono text-faint hover:text-brand">
          Top ↑
        </a>
      </div>

    </div>
  );
}