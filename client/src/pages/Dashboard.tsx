import React, { useEffect, useState } from 'react';
import { getProjects, createProject } from '../api/projects';
import type { Project, CreateProjectInput } from '../types/project';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateProjectInput>({
    title: '',
    slug: '',
    shortDescription: '',
    techStack: [],
    isFeatured: false,
  });
  const [techStackInput, setTechStackInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked } as any));
    } else {
      setForm((prev) => ({ ...prev, [name]: value } as any));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const techStack = techStackInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await createProject({ ...form, techStack });

      setForm({ title: '', slug: '', shortDescription: '', techStack: [], isFeatured: false });
      setTechStackInput('');
      await loadProjects();
    } catch (err) {
      setError('Failed to create project — check the console');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800">Logout</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6 rounded-xl border border-zinc-200 mb-8 bg-zinc-50/50 dark:bg-zinc-900 dark:border-zinc-700">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="px-3 py-2.5 rounded-lg border bg-white dark:bg-zinc-800" />
          <input name="slug" placeholder="slug-like-this" value={form.slug} onChange={handleChange} required className="px-3 py-2.5 rounded-lg border bg-white dark:bg-zinc-800" />
          <textarea name="shortDescription" placeholder="Short description" value={form.shortDescription} onChange={handleChange} className="px-3 py-2.5 rounded-lg border bg-white dark:bg-zinc-800" />
          <input placeholder="Tech stack (comma separated)" value={techStackInput} onChange={(e) => setTechStackInput(e.target.value)} className="px-3 py-2.5 rounded-lg border bg-white dark:bg-zinc-800" />
          <label className="flex items-center gap-2 text-sm px-1">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="rounded border-zinc-300" />
            Featured
          </label>
          <button type="submit" disabled={submitting} className="mt-1 px-4 py-2.5 rounded-lg bg-zinc-900 text-white">
            {submitting ? 'Saving…' : 'Add project'}
          </button>
        </form>

        {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

        {loading ? (
          <p className="text-sm text-zinc-400">Loading…</p>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.length === 0 && <p className="text-sm text-zinc-400">No projects yet.</p>}
            {projects.map((p) => (
              <div key={p.id} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-[15px]">{p.title}</h3>
                  {p.isFeatured && <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-white">featured</span>}
                </div>
                {p.shortDescription && <p className="text-sm text-zinc-500 dark:text-zinc-300 mt-1.5">{p.shortDescription}</p>}
                <div className="flex flex-wrap gap-1.5 mt-3">{p.techStack.map((t) => (<span key={t} className="text-[11px] font-mono px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200">{t}</span>))}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
