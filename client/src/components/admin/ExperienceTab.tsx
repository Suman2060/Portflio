import { useEffect, useState } from 'react';
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../../api/experience';
import type { Experience } from '../../types/experience';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Modal } from './ui';

const toIso = (v?: string) => (v ? new Date(v).toISOString() : undefined);

export default function ExperienceTab() {
  const [items, setItems] = useState<Experience[]>([]);
  const [form, setForm] = useState<Partial<Experience>>({});
  const [editing, setEditing] = useState<Experience | null>(null);
  const [editForm, setEditForm] = useState<Partial<Experience>>({});

  async function load() {
    try {
      setItems(await getExperience());
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getExperience();
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd() {
    if (!form.title) return;
    try {
      await createExperience({
        ...form,
        startDate: toIso(form.startDate),
        endDate: toIso(form.endDate),
        displayOrder: items.length,
      });
      setForm({});
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  function openEdit(e: Experience) {
    setEditing(e);
    setEditForm({
      title: e.title,
      organization: e.organization,
      description: e.description,
      startDate: e.startDate ? e.startDate.slice(0, 10) : '',
      endDate: e.endDate ? e.endDate.slice(0, 10) : '',
      displayOrder: e.displayOrder,
    });
  }
  async function saveEdit() {
    if (!editing) return;
    try {
      await updateExperience(editing.id, {
        ...editForm,
        startDate: editForm.startDate ? toIso(editForm.startDate) : undefined,
        endDate: editForm.endDate ? toIso(editForm.endDate) : undefined,
      });
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  const expInput = (
    key: string,
    value: string,
    placeholder?: string,
    type: 'text' | 'date' = 'text',
  ) => (
    <input
      className="field"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }) as Partial<Experience>)}
    />
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="panel-soft p-5 flex flex-col gap-3">
        <span className="file-label">add experience</span>
        <div className="grid sm:grid-cols-2 gap-3">
          {expInput('title', form.title || '', 'title')}
          {expInput('organization', form.organization || '', 'organization')}
          {expInput('startDate', form.startDate || '', undefined, 'date')}
          {expInput('endDate', form.endDate || '', undefined, 'date')}
        </div>
        <textarea
          className="field"
          rows={2}
          placeholder="description"
          value={form.description || ''}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }) as Partial<Experience>)}
        />
        <div className="flex justify-end">
          <button className="btn btn-brand" style={{ padding: '9px 16px', fontSize: 13, color: '#fff' }} onClick={handleAdd}>
            + add
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        {items.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--mid)' }}>no experience yet.</p>
        )}
        {items.map((e) => (
          <div key={e.id} className="work-row">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display uppercase font-bold tracking-tight" style={{ fontSize: 20 }}>
                    {e.title}
                  </span>
                  {e.organization && <span className="file-label">{e.organization}</span>}
                </div>
                {e.description && (
                  <p className="mt-1 text-sm" style={{ color: 'var(--mid)' }}>{e.description}</p>
                )}
                {(e.startDate || e.endDate) && (
                  <div className="file-label mt-2">
                    {e.startDate ? e.startDate.slice(0, 10) : '?'} → {e.endDate ? e.endDate.slice(0, 10) : 'present'}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="file-chip" onClick={() => openEdit(e)}>
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  className="file-chip"
                  style={{ color: 'var(--brand)' }}
                  onClick={async () => {
                    await deleteExperience(e.id);
                    await load();
                  }}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="edit experience">
        <div className="flex flex-col gap-3">
          <input
            className="field"
            value={editForm.title || ''}
            onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }) as Partial<Experience>)}
            placeholder="title"
          />
          <input
            className="field"
            value={editForm.organization || ''}
            onChange={(e) => setEditForm((p) => ({ ...p, organization: e.target.value }) as Partial<Experience>)}
            placeholder="organization"
          />
          <textarea
            className="field"
            rows={2}
            value={editForm.description || ''}
            onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }) as Partial<Experience>)}
            placeholder="description"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="field"
              type="date"
              value={(editForm.startDate as string) || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, startDate: e.target.value }) as Partial<Experience>)}
            />
            <input
              className="field"
              type="date"
              value={(editForm.endDate as string) || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, endDate: e.target.value }) as Partial<Experience>)}
            />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setEditing(null)}>
              cancel
            </button>
            <button className="btn btn-brand" style={{ padding: '8px 16px', fontSize: 13, color: '#fff' }} onClick={saveEdit}>
              save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}