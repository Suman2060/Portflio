import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  if (loading) return <p className="p-6">Loading…</p>;
  if (!project) return <p className="p-6">Project not found.</p>;

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        {project.shortDescription && <p className="text-zinc-600 dark:text-zinc-300">{project.shortDescription}</p>}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Tech stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <span key={t} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm">{t}</span>
            ))}
          </div>
        </div>

        {project.fullDescription && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <p className="text-zinc-700 dark:text-zinc-300">{project.fullDescription}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-zinc-900 text-white rounded">View on GitHub</a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded">Live demo</a>
          )}
        </div>
      </div>
    </div>
  );
}
