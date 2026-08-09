import React, { useEffect, useState, Fragment } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects';
import { uploadFile } from '../api/uploads';
import type { Project, CreateProjectInput } from '../types/project';
import { useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateProjectInput>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: undefined,
    techStack: [],
    coverImageUrl: undefined,
    isFeatured: false,
  });
  const [techStackInput, setTechStackInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState<Partial<CreateProjectInput>>({});

  const [addFile, setAddFile] = useState<File | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);

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
      let coverUrl = form.coverImageUrl;
      if (addFile) {
        const upl = await uploadFile(addFile);
        coverUrl = upl.url;
      }

      const techStack = techStackInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await createProject({ ...form, techStack, coverImageUrl: coverUrl });

      setForm({ title: '', slug: '', shortDescription: '', techStack: [], isFeatured: false });
      setTechStackInput('');
      setAddFile(null);
      setIsAddOpen(false);
      await loadProjects();
    } catch (err) {
      setError('Failed to create project — check the console');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function openEditModal(p: Project) {
    setActiveProject(p);
    setEditForm({
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription || undefined,
      techStack: p.techStack,
      isFeatured: p.isFeatured,
    });
    setIsEditOpen(true);
  }

  function closeEditModal() {
    setIsEditOpen(false);
    setActiveProject(null);
    setEditForm({});
  }

  function openDeleteModal(p: Project) {
    setActiveProject(p);
    setIsDeleteOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteOpen(false);
    setActiveProject(null);
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleAddFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (f) setAddFile(f);
  }

  function handleEditFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (f) setEditFile(f);
  }

  async function saveEdit() {
    if (!activeProject) return;
    try {
      const payload: Partial<CreateProjectInput> = { ...editForm } as any;
      if (typeof payload.techStack === 'string') {
        payload.techStack = (payload.techStack as any).split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      await updateProject(activeProject.id, payload);
      closeEditModal();
      await loadProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to update project');
    }
  }

  async function confirmDelete() {
    if (!activeProject) return;
    try {
      await deleteProject(activeProject.id);
      closeDeleteModal();
      await loadProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to delete project');
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

        <div className="mb-6 flex justify-end">
          <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 rounded bg-zinc-900 text-white">Add Project</button>
        </div>

        {/* Existing project list */}
        

        {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

        {loading ? (
          <p className="text-sm text-zinc-400">Loading…</p>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.length === 0 && <p className="text-sm text-zinc-400">No projects yet.</p>}
            {projects.map((p) => (
              <div key={p.id} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-[15px]">{p.title}</h3>
                    {p.shortDescription && <p className="text-sm text-zinc-500 dark:text-zinc-300 mt-1.5">{p.shortDescription}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button title="Edit" onClick={() => openEditModal(p)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button title="Delete" onClick={() => openDeleteModal(p)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900">
                      <TrashIcon className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">{p.techStack.map((t) => (<span key={t} className="text-[11px] font-mono px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200">{t}</span>))}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Transition appear show={isAddOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsAddOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6">Add project</Dialog.Title>

                  <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
                    <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <input name="slug" placeholder="slug-like-this" value={form.slug} onChange={handleChange} required className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <textarea name="shortDescription" placeholder="Short description" value={form.shortDescription} onChange={handleChange} className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <textarea name="fullDescription" placeholder="Full description (markdown)" value={(form.fullDescription as string) || ''} onChange={handleChange} className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <input placeholder="Tech stack (comma separated)" value={techStackInput} onChange={(e) => setTechStackInput(e.target.value)} className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <input type="file" onChange={handleAddFileChange} />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured
                    </label>

                    <div className="flex justify-end gap-2 mt-4">
                      <button type="button" className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-800" onClick={() => setIsAddOpen(false)}>Cancel</button>
                      <button type="submit" className="px-4 py-2 rounded bg-zinc-900 text-white">Create</button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Modal */}
      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                    Edit project
                  </Dialog.Title>
                  <div className="mt-4 flex flex-col gap-3">
                    <input name="title" value={(editForm.title as string) || ''} onChange={handleEditChange} className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <input name="slug" value={(editForm.slug as string) || ''} onChange={handleEditChange} className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <textarea name="shortDescription" value={(editForm.shortDescription as string) || ''} onChange={handleEditChange} className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <textarea name="fullDescription" value={(editForm.fullDescription as string) || ''} onChange={handleEditChange} placeholder="Full description (supports markdown)" className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <input name="techStack" value={(editForm.techStack as any) ? (editForm.techStack as string[]).join(', ') : ''} onChange={handleEditChange} placeholder="Comma separated" className="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800" />
                    <input type="file" onChange={handleEditFileChange} className="w-full" />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="isFeatured" checked={Boolean(editForm.isFeatured)} onChange={handleEditChange} /> Is featured
                    </label>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button type="button" className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-800" onClick={closeEditModal}>
                      Cancel
                    </button>
                    <button type="button" className="px-4 py-2 rounded bg-zinc-900 text-white" onClick={async () => {
                      try {
                        if (editFile && activeProject) {
                          const upl = await uploadFile(editFile);
                          setEditForm((prev) => ({ ...prev, coverImageUrl: upl.url }));
                        }
                        await saveEdit();
                      } catch (err) {
                        console.error(err);
                        setError('Failed to upload or save');
                      }
                    }}>
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                    Delete project
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">Are you sure you want to delete "{activeProject?.title}"? This action cannot be undone.</p>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button type="button" className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-800" onClick={closeDeleteModal}>
                      Cancel
                    </button>
                    <button type="button" className="px-4 py-2 rounded bg-red-600 text-white" onClick={confirmDelete}>
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
