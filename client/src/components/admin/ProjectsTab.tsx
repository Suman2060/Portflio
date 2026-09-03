import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../api/projects';
import { uploadFile } from '../../api/uploads';
import type { Project, CreateProjectInput } from '../../types/project';
import { resolveMediaUrl } from '../../utils/media';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Modal, Toggle, SortableItem } from './ui';

export default function ProjectsTab() {
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CreateProjectInput>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    techStack: [],
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
  const [reorderMode, setReorderMode] = useState(false);
  const [sortedIds, setSortedIds] = useState<number[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      setSortedIds(data.map((p) => p.id));
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProjects();
        if (cancelled) return;
        setProjects(data);
        setSortedIds(data.map((p) => p.id));
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError('Failed to load projects');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const resetAddForm = () => {
    setForm({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      techStack: [],
      isFeatured: false,
    });
    setTechStackInput('');
    setAddFile(null);
  };

  function handleAddForm(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(
        (prev) =>
          ({
            ...prev,
            [name]: (e.target as HTMLInputElement).checked,
          }) as CreateProjectInput,
      );
    } else {
      setForm((prev) => ({ ...prev, [name]: value }) as CreateProjectInput);
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
      resetAddForm();
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
      fullDescription: p.fullDescription || undefined,
      techStack: p.techStack,
      isFeatured: p.isFeatured,
      githubUrl: p.githubUrl || undefined,
      liveUrl: p.liveUrl || undefined,
      coverImageUrl: p.coverImageUrl || undefined,
      displayOrder: p.displayOrder,
    });
    setEditFile(null);
    setIsEditOpen(true);
  }

  function closeEditModal() {
    setIsEditOpen(false);
    setActiveProject(null);
    setEditForm({});
  }

  function folderEdit(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setEditForm(
        (prev) =>
          ({
            ...prev,
            [name]: (e.target as HTMLInputElement).checked,
          }) as Partial<CreateProjectInput>,
      );
    } else if (name === 'displayOrder') {
      setEditForm(
        (prev) =>
          ({
            ...prev,
            displayOrder: Number(value) || 0,
          }) as Partial<CreateProjectInput>,
      );
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }) as Partial<CreateProjectInput>);
    }
  }

  async function saveEditWithFile() {
    try {
      let payload: Partial<CreateProjectInput> = { ...editForm };
      if (editFile && activeProject) {
        const upl = await uploadFile(editFile);
        payload = { ...payload, coverImageUrl: upl.url };
      }
      if (typeof payload.techStack === 'string') {
        payload.techStack = (payload.techStack as string)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      await updateProject(activeProject!.id, payload);
      closeEditModal();
      await loadProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to upload or save');
    }
  }

  function openDeleteModal(p: Project) {
    setActiveProject(p);
    setIsDeleteOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteOpen(false);
    setActiveProject(null);
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sortedIds.indexOf(Number(active.id));
    const newIndex = sortedIds.indexOf(Number(over.id));
    const newOrder = arrayMove(sortedIds, oldIndex, newIndex);
    setSortedIds(newOrder);
    setProjects((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      return newOrder.map((id) => map.get(id)!).filter(Boolean) as Project[];
    });
  }

  async function saveOrder() {
    try {
      for (let i = 0; i < sortedIds.length; i++) {
        await updateProject(sortedIds[i], { displayOrder: i });
      }
      setReorderMode(false);
      await loadProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to save order');
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="file-label">{projects.length} projects</span>
        <div className="flex items-center gap-2">
          {error && <span className="file-label" style={{ color: 'var(--brand)' }}>{error}</span>}
          <button
            className="btn btn-ghost"
            style={{ padding: '8px 14px', fontSize: 13 }}
            onClick={() => setReorderMode((s) => !s)}
          >
            {reorderMode ? 'cancel reorder' : 'reorder'}
          </button>
          {reorderMode && (
            <button
              className="btn btn-brand"
              style={{ padding: '8px 14px', fontSize: 13, color: '#fff' }}
              onClick={saveOrder}
            >
              save order
            </button>
          )}
          <button
            className="btn btn-brand"
            style={{ padding: '8px 14px', fontSize: 13, color: '#fff' }}
            onClick={() => setIsAddOpen(true)}
          >
            + new project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="panel p-8 text-center text-sm font-mono text-mid">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="panel p-8 text-center text-sm font-mono text-mid">No projects created yet. Click "+ new project" to add one.</div>
      ) : reorderMode ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {projects.map((p) => (
                <SortableItem key={p.id} id={p.id}>
                  <div className="panel-soft px-4 py-3 flex items-center justify-between gap-3 overflow-hidden">
                    <span className="file-label font-bold truncate">{p.title}</span>
                    <span className="file-label shrink-0">drag ⇅</span>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        projects.map((p) => {
          const cover = resolveMediaUrl(p.coverImageUrl);
          return (
            <div key={p.id} className="panel-soft p-5 border transition-all hover:border-brand/40 overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 overflow-hidden space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display uppercase font-bold tracking-tight text-xl text-ink break-words max-w-full">
                      {p.title}
                    </h3>
                    <span className="file-label text-[10px] text-faint">/{p.slug}</span>
                    {p.isFeatured && (
                      <span className="tag-pill text-[10px] py-0.5 px-2.5 border-brand text-brand">
                        featured
                      </span>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="tag-pill text-[10px] py-0.5 px-2 hover:opacity-75">
                        live ↗
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noreferrer" className="tag-pill text-[10px] py-0.5 px-2 hover:opacity-75">
                        github ↗
                      </a>
                    )}
                  </div>

                  {p.shortDescription && (
                    <p className="text-sm text-mid break-words max-w-full leading-relaxed line-clamp-2">
                      {p.shortDescription}
                    </p>
                  )}

                  {cover && (
                    <div className="mt-2">
                      <img
                        src={cover}
                        alt={p.title}
                        className="h-16 w-28 object-cover rounded-lg border border-hairline-strong shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button title="Edit" onClick={() => openEditModal(p)} className="file-chip cursor-pointer hover:border-brand">
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => openDeleteModal(p)}
                    className="file-chip cursor-pointer hover:border-rose-500 hover:text-rose-400"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {p.techStack && p.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-hairline overflow-hidden">
                  {p.techStack.map((t) => (
                    <span key={t} className="file-chip text-[10px] py-0.5 px-2 max-w-[200px] truncate">{t}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Add Project Modal */}
      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Project" maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-full overflow-hidden">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="file-label text-[10px] mb-1.5 block">Project Title *</label>
              <input
                className="field"
                name="title"
                placeholder="e.g. Distributed Cloud Engine"
                value={form.title}
                onChange={(e) => {
                  handleAddForm(e);
                  if (!form.slug || form.slug === form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
                    setForm((prev) => ({
                      ...prev,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    }));
                  }
                }}
                required
              />
            </div>
            <div>
              <label className="file-label text-[10px] mb-1.5 block">URL Slug *</label>
              <input
                className="field"
                name="slug"
                placeholder="e.g. distributed-cloud-engine"
                value={form.slug}
                onChange={handleAddForm}
                required
              />
            </div>
          </div>

          <div>
            <label className="file-label text-[10px] mb-1.5 block">Short Summary (Shown on homepage card)</label>
            <textarea
              className="field"
              name="shortDescription"
              placeholder="High-level overview of the engineering accomplishments, tech stack, and metrics..."
              rows={2}
              value={form.shortDescription || ''}
              onChange={handleAddForm}
            />
          </div>

          <div>
            <label className="file-label text-[10px] mb-1.5 block">Detailed Case Study (Shown on project detail page)</label>
            <textarea
              className="field"
              name="fullDescription"
              placeholder="Deep architectural overview, database design, key technical challenges solved..."
              rows={4}
              value={form.fullDescription || ''}
              onChange={handleAddForm}
            />
          </div>

          <div>
            <label className="file-label text-[10px] mb-1.5 block">Technologies & Tools (Comma separated)</label>
            <input
              className="field"
              placeholder="TypeScript, React, Node.js, PostgreSQL, Docker, Redis"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="file-label text-[10px] mb-1.5 block">GitHub Repository URL</label>
              <input
                className="field"
                name="githubUrl"
                placeholder="https://github.com/username/project"
                value={(form.githubUrl as string) || ''}
                onChange={handleAddForm}
              />
            </div>
            <div>
              <label className="file-label text-[10px] mb-1.5 block">Live Demo / Production URL</label>
              <input
                className="field"
                name="liveUrl"
                placeholder="https://myproject.com"
                value={(form.liveUrl as string) || ''}
                onChange={handleAddForm}
              />
            </div>
          </div>

          {/* Image Upload with Preview */}
          <div className="panel-soft p-4 rounded-xl space-y-3">
            <span className="file-label text-[10px] block">Cover Media / Banner</span>
            <div className="flex flex-wrap items-center gap-4">
              <label
                htmlFor="cover-image-add"
                className="btn btn-ghost text-xs py-2 px-3 cursor-pointer"
              >
                📁 Choose File
              </label>
              <input
                id="cover-image-add"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setAddFile(f);
                }}
              />
              {addFile && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-brand truncate max-w-[200px]">{addFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setAddFile(null)}
                    className="text-xs text-faint hover:text-rose-400"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Toggle label="Pin as Featured Project" checked={Boolean(form.isFeatured)} onChange={(v) => setForm((prev) => ({ ...prev, isFeatured: v }))} />
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-ghost text-xs py-2 px-4"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-brand text-xs py-2 px-5" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal open={isEditOpen} onClose={closeEditModal} title={`Edit: ${activeProject?.title || ''}`} maxWidth="max-w-2xl">
        <div className="flex flex-col gap-4 max-w-full overflow-hidden">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="file-label text-[10px] mb-1.5 block">Title</label>
              <input className="field" name="title" value={(editForm.title as string) || ''} onChange={folderEdit} />
            </div>
            <div>
              <label className="file-label text-[10px] mb-1.5 block">Slug</label>
              <input className="field" name="slug" value={(editForm.slug as string) || ''} onChange={folderEdit} />
            </div>
          </div>

          <div>
            <label className="file-label text-[10px] mb-1.5 block">Short Summary</label>
            <textarea className="field" name="shortDescription" rows={2} value={(editForm.shortDescription as string) || ''} onChange={folderEdit} />
          </div>

          <div>
            <label className="file-label text-[10px] mb-1.5 block">Detailed Case Study</label>
            <textarea className="field" name="fullDescription" rows={4} placeholder="Full description" value={(editForm.fullDescription as string) || ''} onChange={folderEdit} />
          </div>

          <div>
            <label className="file-label text-[10px] mb-1.5 block">Tech Stack (comma separated)</label>
            <input
              className="field"
              name="techStack"
              value={Array.isArray(editForm.techStack) ? editForm.techStack.join(', ') : String(editForm.techStack || '')}
              onChange={folderEdit}
              placeholder="TypeScript, React, Node.js"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="file-label text-[10px] mb-1.5 block">GitHub URL</label>
              <input className="field" name="githubUrl" value={(editForm.githubUrl as string) || ''} onChange={folderEdit} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="file-label text-[10px] mb-1.5 block">Live URL</label>
              <input className="field" name="liveUrl" value={(editForm.liveUrl as string) || ''} onChange={folderEdit} placeholder="https://..." />
            </div>
          </div>

          <div className="panel-soft p-4 rounded-xl space-y-3">
            <span className="file-label text-[10px] block">Cover Image</span>
            {editForm.coverImageUrl && (
              <div className="flex items-center gap-3">
                <img
                  src={resolveMediaUrl(editForm.coverImageUrl as string)}
                  alt="cover"
                  className="h-14 w-24 object-cover rounded-lg border border-hairline-strong"
                />
                <span className="file-label text-xs">Current Cover Asset</span>
              </div>
            )}
            <label className="btn btn-ghost text-xs py-2 px-3 cursor-pointer w-fit inline-flex">
              📁 Replace Cover Image
              <input type="file" className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setEditFile(f); }} />
            </label>
            {editFile && <span className="text-xs font-mono text-brand ml-2">New: {editFile.name}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4 items-center pt-2">
            <div>
              <label className="file-label text-[10px] mb-1.5 block">Display Priority (Order)</label>
              <input className="field" name="displayOrder" type="number" value={(editForm.displayOrder as number) ?? 0} onChange={folderEdit} />
            </div>
            <div className="pt-4">
              <Toggle label="Featured Project" checked={Boolean(editForm.isFeatured)} onChange={(v) => setEditForm((prev) => ({ ...prev, isFeatured: v }))} />
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-hairline flex justify-end gap-2">
            <button type="button" className="btn btn-ghost text-xs py-2 px-4" onClick={closeEditModal}>
              Cancel
            </button>
            <button type="button" className="btn btn-brand text-xs py-2 px-5" onClick={saveEditWithFile}>
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteOpen} onClose={closeDeleteModal} title="Confirm Deletion" maxWidth="max-w-md">
        <p className="text-sm text-mid leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-ink break-words">"{activeProject?.title}"</strong>? This operation cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-ghost text-xs py-2 px-4" onClick={closeDeleteModal}>
            Cancel
          </button>
          <button className="btn btn-brand text-xs py-2 px-4 bg-rose-600 hover:bg-rose-500 border-rose-500 text-white" onClick={confirmDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}