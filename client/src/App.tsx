import { useEffect, useState } from 'react';
import { getProjects, createProject } from './api/projects';
import type { Project, CreateProjectInput } from './types/project';
import { TEMP_ADMIN_TOKEN } from './api/tempToken';

function App() {
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

  useEffect(() => {
    loadProjects();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
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

      await createProject({ ...form, techStack }, TEMP_ADMIN_TOKEN);

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

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-[Inter]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex items-baseline gap-3 mb-10">
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <span className="font-[JetBrains_Mono] text-xs text-zinc-400">
            /api/projects
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-6 rounded-xl border border-zinc-200 mb-12 bg-zinc-50/50"
        >
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="px-3 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
          />
          <input
            name="slug"
            placeholder="slug-like-this"
            value={form.slug}
            onChange={handleChange}
            required
            className="px-3 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm font-[JetBrains_Mono] placeholder:text-zinc-400 placeholder:font-[Inter] focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
          />
          <textarea
            name="shortDescription"
            placeholder="Short description"
            value={form.shortDescription}
            onChange={handleChange}
            className="px-3 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm min-h-[70px] resize-y placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
          />
          <input
            placeholder="Tech stack (comma separated)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm font-[JetBrains_Mono] placeholder:text-zinc-400 placeholder:font-[Inter] focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
          />
          <label className="flex items-center gap-2 text-sm text-zinc-600 px-1">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="rounded border-zinc-300"
            />
            Featured
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 px-4 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Saving…' : 'Add project'}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-600 mb-6 font-[JetBrains_Mono]">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-zinc-400">Loading…</p>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.length === 0 && (
              <p className="text-sm text-zinc-400">No projects yet.</p>
            )}
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-[15px]">{p.title}</h3>
                  {p.isFeatured && (
                    <span className="text-[11px] font-[JetBrains_Mono] px-2 py-0.5 rounded-full bg-zinc-900 text-white">
                      featured
                    </span>
                  )}
                </div>
                {p.shortDescription && (
                  <p className="text-sm text-zinc-500 mt-1.5">{p.shortDescription}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.techStack.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-[JetBrains_Mono] px-2 py-1 rounded-md bg-zinc-100 text-zinc-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;