import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug } from '../api/projects';
import type { Project } from '../types/project';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="p-6 max-w-3xl mx-auto text-sm" style={{ color: 'var(--mid)' }}>opening file…</p>;
  if (!project) return <p className="p-6 max-w-3xl mx-auto text-sm" style={{ color: 'var(--mid)' }}>404 — project not found.</p>;

  const paragraphs = (project.fullDescription || '').split(/\n+/).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link to="/" className="file-chip mb-8 hover:opacity-70">← back to work</Link>

      <div className="file-label mb-3">project/{project.slug}.fig</div>
      <h1 className="hero-heading" style={{ fontSize: 'clamp(36px,6vw,72px)' }}>
        {project.title}
      </h1>

      {project.isFeatured && (
        <span className="tag-pill mt-4" style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}>featured</span>
      )}

      {project.shortDescription && (
        <p className="mt-5 text-base max-w-2xl" style={{ color: 'var(--mid)' }}>{project.shortDescription}</p>
      )}

      {project.coverImageUrl && (
        <div className="mt-8 selection-frame">
          <img src={project.coverImageUrl} alt={project.title} className="w-full rounded-2xl border" style={{ borderColor: 'var(--hairline-strong)' }} />
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {project.techStack.map((t) => (
          <span key={t} className="tag-pill">{t}</span>
        ))}
      </div>

      {paragraphs.length > 0 && (
        <div className="mt-10 space-y-4">
          <div className="file-label mb-2">readme.md</div>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--mid)' }}>{p}</p>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
            View on GitHub <span className="arrow">↗</span>
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-brand">
            Live demo <span className="arrow">↗</span>
          </a>
        )}
      </div>
    </div>
  );
}