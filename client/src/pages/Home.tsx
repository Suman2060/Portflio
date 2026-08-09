import React, { useEffect, useState } from 'react';
import { getProjects } from '../api/projects';
import type { Project } from '../types/project';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">Your Name — Web Developer</h1>
          <p className="text-zinc-600 mt-2">Showcase of selected projects and skills.</p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
          {loading ? (
            <p className="text-sm text-zinc-400">Loading…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <article key={p.id} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-lg">{p.title}</h3>
                    {p.isFeatured && <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 text-white">Featured</span>}
                  </div>
                  {p.shortDescription && <p className="text-sm text-zinc-500 dark:text-zinc-300 mt-2">{p.shortDescription}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.techStack.map((t) => (
                      <span key={t} className="text-xs font-mono px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200">{t}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
