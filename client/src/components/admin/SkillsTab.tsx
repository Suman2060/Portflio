import { useEffect, useState } from 'react';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../../api/skills';
import type { Skill } from '../../types/skill';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Modal } from './ui';

export default function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [proficiency, setProficiency] = useState(0);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [editForm, setEditForm] = useState<Partial<Skill>>({});

  async function load() {
    try {
      const s = await getSkills();
      setSkills(s);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await getSkills();
        if (!cancelled) setSkills(s);
      } catch (err) {
        if (!cancelled) console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd() {
    if (!name.trim()) return;
    try {
      await createSkill({
        name,
        category: category || undefined,
        proficiency: proficiency || undefined,
        displayOrder: skills.length,
      });
      setName('');
      setCategory('');
      setProficiency(0);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  function openEdit(s: Skill) {
    setEditing(s);
    setEditForm({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      displayOrder: s.displayOrder,
    });
  }
  async function saveEdit() {
    if (!editing) return;
    try {
      await updateSkill(editing.id, editForm);
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="panel-soft p-5 flex flex-col gap-3">
        <span className="file-label">add skill</span>
        <div className="grid sm:grid-cols-[1fr_1fr_130px_auto] gap-3 items-end">
          <input className="field" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="field" placeholder="category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input className="field" type="number" placeholder="proficiency" value={proficiency} onChange={(e) => setProficiency(Number(e.target.value))} />
          <button className="btn btn-brand" style={{ padding: '9px 16px', fontSize: 13, color: '#fff' }} onClick={handleAdd}>
            + add
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <div key={s.id} className="tag-pill" style={{ gap: 6 }}>
            <span>{s.name}</span>
            {s.proficiency ? (
              <span className="text-[10px]" style={{ color: 'var(--mid)' }}>{s.proficiency}%</span>
            ) : null}
            <button className="hover:opacity-70" onClick={() => openEdit(s)} title="edit">
              <PencilSquareIcon className="w-3.5 h-3.5" />
            </button>
            <button
              className="hover:opacity-70"
              style={{ color: 'var(--brand)' }}
              onClick={async () => {
                await deleteSkill(s.id);
                await load();
              }}
              title="delete"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--mid)' }}>no skills yet.</p>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="edit skill">
        <div className="flex flex-col gap-3">
          <input
            className="field"
            value={editForm.name || ''}
            onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }) as Partial<Skill>)}
            placeholder="name"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="field"
              value={editForm.category || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }) as Partial<Skill>)}
              placeholder="category"
            />
            <input
              className="field"
              type="number"
              value={editForm.proficiency || 0}
              onChange={(e) => setEditForm((p) => ({ ...p, proficiency: Number(e.target.value) }) as Partial<Skill>)}
              placeholder="proficiency %"
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