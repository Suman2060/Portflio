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
        <p className="text-sm" style={{ color: 'var(--mid)' }}>loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--mid)' }}>no projects yet.</p>
      ) : reorderMode ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {projects.map((p) => (
                <SortableItem key={p.id} id={p.id}>
                  <div className="panel-soft px-4 py-3 flex items-center justify-between gap-3">
                    <span className="file-label">{p.title}</span>
                    <span className="file-label">drag ⇅</span>
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
            <div key={p.id} className="panel-soft px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display uppercase font-bold tracking-tight" style={{ fontSize: 20 }}>
                      {p.title}
                    </h3>
                    {p.isFeatured && (
                      <span className="tag-pill" style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}>
                        featured
                      </span>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="tag-pill hover:opacity-70">
                        live ↗
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noreferrer" className="tag-pill hover:opacity-70">
                        github ↗
                      </a>
                    )}
                  </div>
                  {p.shortDescription && (
                    <p className="mt-1 text-sm" style={{ color: 'var(--mid)' }}>{p.shortDescription}</p>
                  )}
                  {cover && (
                    <img
                      src={cover}
                      alt={p.title}
                      className="mt-3 h-16 w-auto rounded-lg border"
                      style={{ borderColor: 'var(--hairline-strong)' }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button title="Edit" onClick={() => openEditModal(p)} className="file-chip cursor-pointer hover:opacity-70">
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => openDeleteModal(p)}
                    className="file-chip cursor-pointer hover:opacity-70"
                    style={{ color: 'var(--brand)' }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.techStack.map((t) => (
                  <span key={t} className="file-chip">{t}</span>
                ))}
              </div>
            </div>
          );
        })
      )}

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="new project">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="field"
              name="title"
              placeholder="title"
              value={form.title}
              onChange={handleAddForm}
              required
            />
            <input
              className="field"
              name="slug"
              placeholder="slug"
              value={form.slug}
              onChange={handleAddForm}
              required
            />
          </div>
          <textarea
            className="field"
            name="shortDescription"
            placeholder="short description"
            value={form.shortDescription || ''}
            onChange={handleAddForm}
          />
          <textarea
            className="field"
            name="fullDescription"
            placeholder="full description (one paragraph per line)"
            rows={4}
            value={form.fullDescription || ''}
            onChange={handleAddForm}
          />
          <input
            className="field"
            placeholder="tech stack (comma separated)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="field"
              name="githubUrl"
              placeholder="github url"
              value={(form.githubUrl as string) || ''}
              onChange={handleAddForm}
            />
            <input
              className="field"
              name="liveUrl"
              placeholder="live url"
              value={(form.liveUrl as string) || ''}
              onChange={handleAddForm}
            />
          </div>
          <label className="text-sm flex flex-col gap-2" style={{ color: 'var(--mid)' }}>
            <span>Cover Image</span>
            <label
              htmlFor="cover-image"
              className="w-fit cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition hover:opacity-80"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              Choose Image
            </label>
            <input
              id="cover-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setAddFile(f);
              }}
            />
          </label>
          <Toggle label="featured" checked={Boolean(form.isFeatured)} onChange={(v) => setForm((prev) => ({ ...prev, isFeatured: v }))} />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '8px 16px', fontSize: 13 }}
              onClick={() => setIsAddOpen(false)}
            >
              cancel
            </button>
            <button type="submit" className="btn btn-brand" style={{ padding: '8px 16px', fontSize: 13, color: '#fff' }} disabled={submitting}>
              {submitting ? 'creating…' : 'create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={isEditOpen} onClose={closeEditModal} title={`edit ${activeProject?.title || ''}`}>
        <div className="flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="field" name="title" value={(editForm.title as string) || ''} onChange={folderEdit} />
            <input className="field" name="slug" value={(editForm.slug as string) || ''} onChange={folderEdit} />
          </div>
          <textarea className="field" name="shortDescription" value={(editForm.shortDescription as string) || ''} onChange={folderEdit} />
          <textarea className="field" name="fullDescription" rows={4} placeholder="full description" value={(editForm.fullDescription as string) || ''} onChange={folderEdit} />
          <input
            className="field"
            name="techStack"
            value={Array.isArray(editForm.techStack) ? editForm.techStack.join(', ') : String(editForm.techStack || '')}
            onChange={folderEdit}
            placeholder="tech stack (comma separated)"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="field" name="githubUrl" value={(editForm.githubUrl as string) || ''} onChange={folderEdit} placeholder="github url" />
            <input className="field" name="liveUrl" value={(editForm.liveUrl as string) || ''} onChange={folderEdit} placeholder="live url" />
          </div>
          {editForm.coverImageUrl && (
            <div className="flex items-center gap-3">
              <img
                src={resolveMediaUrl(editForm.coverImageUrl as string)}
                alt="cover"
                className="h-14 w-20 object-cover rounded-lg border"
                style={{ borderColor: 'var(--hairline-strong)' }}
              />
              <span className="file-label">current cover</span>
            </div>
          )}
          <label className="text-sm" style={{ color: 'var(--mid)' }}>
            new cover image
            <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if (f) setEditFile(f); }} />
          </label>
          <div className="grid grid-cols-2 gap-3 items-center">
            <input className="field" name="displayOrder" type="number" value={(editForm.displayOrder as number) ?? ''} onChange={folderEdit} placeholder="order" />
            <Toggle label="featured" checked={Boolean(editForm.isFeatured)} onChange={(v) => setEditForm((prev) => ({ ...prev, isFeatured: v }))} />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }} onClick={closeEditModal}>
              cancel
            </button>
            <button type="button" className="btn btn-brand" style={{ padding: '8px 16px', fontSize: 13, color: '#fff' }} onClick={saveEditWithFile}>
              save
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={isDeleteOpen} onClose={closeDeleteModal} title="delete project">
        <p className="text-sm" style={{ color: 'var(--mid)' }}>
          Are you sure you want to delete "{activeProject?.title}"? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }} onClick={closeDeleteModal}>
            cancel
          </button>
          <button className="btn btn-brand" style={{ padding: '8px 16px', fontSize: 13, color: '#fff' }} onClick={confirmDelete}>
            delete
          </button>
        </div>
      </Modal>
    </div>
  );
}