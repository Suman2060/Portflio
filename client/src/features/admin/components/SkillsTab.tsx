import { useEffect, useState, useMemo } from 'react';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../../../api/skills';
import type { Skill } from '../../../types/skill';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Modal } from './ui';
import { cleanSkillName, getSkillCategory, getSkillBadge } from '../../../utils/skills';

const PRESET_CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps & Tools', 'General'];

const POPULAR_SKILLS = [
  { name: 'React.js', category: 'Frontend', proficiency: 95 },
  { name: 'TypeScript', category: 'Frontend', proficiency: 90 },
  { name: 'Next.js', category: 'Frontend', proficiency: 88 },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 95 },
  { name: 'Node.js', category: 'Backend', proficiency: 90 },
  { name: 'Express.js', category: 'Backend', proficiency: 92 },
  { name: 'REST APIs', category: 'Backend', proficiency: 95 },
  { name: 'PostgreSQL', category: 'Database', proficiency: 88 },
  { name: 'Prisma ORM', category: 'Database', proficiency: 90 },
  { name: 'MongoDB', category: 'Database', proficiency: 85 },
  { name: 'Docker', category: 'DevOps & Tools', proficiency: 82 },
  { name: 'Git & GitHub', category: 'DevOps & Tools', proficiency: 92 },
];

export default function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [customCategory, setCustomCategory] = useState('');
  const [proficiency, setProficiency] = useState<number>(85);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [editForm, setEditForm] = useState<Partial<Skill>>({});
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const s = await getSkills();
      setSkills(s);
    } catch (err) {
      console.error('Failed to load skills', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function notify(msg: string) {
    setActionStatus(msg);
    setTimeout(() => setActionStatus(null), 3000);
  }

  async function handleAdd(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const finalCat = category === 'Custom' ? (customCategory.trim() || 'General') : category;

    try {
      await createSkill({
        name: name.trim(),
        category: finalCat,
        proficiency: proficiency > 0 ? proficiency : undefined,
        displayOrder: skills.length,
      });
      setName('');
      if (category === 'Custom') setCustomCategory('');
      notify(`✓ Added ${name.trim()} to ${finalCat}`);
      await load();
    } catch (err) {
      console.error(err);
      notify('Failed to add skill');
    }
  }

  async function handleQuickAdd(skill: { name: string; category: string; proficiency: number }) {
    try {
      await createSkill({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        displayOrder: skills.length,
      });
      notify(`✓ Added ${skill.name}`);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: number, skillName: string) {
    if (!window.confirm(`Delete skill "${skillName}"?`)) return;
    try {
      await deleteSkill(id);
      notify(`✓ Removed ${skillName}`);
      await load();
    } catch (err) {
      console.error(err);
      notify('Failed to delete skill');
    }
  }

  function openEdit(s: Skill) {
    setEditing(s);
    setEditForm({
      name: s.name,
      category: s.category || 'General',
      proficiency: s.proficiency || 80,
      displayOrder: s.displayOrder,
    });
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      await updateSkill(editing.id, editForm);
      setEditing(null);
      notify(`✓ Updated ${editForm.name}`);
      await load();
    } catch (err) {
      console.error(err);
      notify('Failed to update skill');
    }
  }

  // Calculate existing categories
  const existingCategories = useMemo(() => {
    const set = new Set<string>();
    for (const s of skills) {
      set.add(getSkillCategory(s));
    }
    return ['All', ...Array.from(set)];
  }, [skills]);

  const displayedSkills = useMemo(() => {
    if (filterCategory === 'All') return skills;
    return skills.filter((s) => getSkillCategory(s) === filterCategory);
  }, [skills, filterCategory]);

  const existingSkillNames = useMemo(() => {
    return new Set(skills.map((s) => s.name.toLowerCase().trim()));
  }, [skills]);

  const unaddedPresets = POPULAR_SKILLS.filter(
    (p) => !existingSkillNames.has(p.name.toLowerCase().trim())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="file-label text-brand">Skills Management</span>
          <h2 className="text-xl font-display font-bold uppercase text-ink">
            Add & Remove Technical Skills
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {actionStatus && (
            <span className="file-chip text-xs text-emerald-400 border-emerald-500/40">
              {actionStatus}
            </span>
          )}
          <span className="file-chip text-xs">
            {skills.length} Total {skills.length === 1 ? 'Skill' : 'Skills'}
          </span>
        </div>
      </div>

      {/* Add New Skill Form */}
      <div className="panel p-6 border-brand/30">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline">
          <span className="file-label text-xs">New Skill Entry</span>
          <span className="text-xs font-mono text-faint">Saved directly to live database</span>
        </div>

        <form onSubmit={handleAdd} className="grid md:grid-cols-[1.5fr_1fr_120px_auto] gap-4 items-end">
          <div>
            <label className="file-label text-[10px] mb-1.5 block">Skill Name</label>
            <input
              className="field font-body"
              placeholder="e.g. React.js, GraphQL, Docker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="file-label text-[10px] mb-1.5 block">Category</label>
            <select
              className="field font-body"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {PRESET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="Custom">+ Custom Category</option>
            </select>
          </div>

          {category === 'Custom' && (
            <div className="md:col-span-2">
              <label className="file-label text-[10px] mb-1.5 block">Custom Category Name</label>
              <input
                className="field font-body"
                placeholder="e.g. Mobile, Testing, Cloud"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="file-label text-[10px] mb-1.5 block">Proficiency %</label>
            <input
              className="field font-body"
              type="number"
              min="0"
              max="100"
              placeholder="85"
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
            />
          </div>

          <button
            type="submit"
            className="btn btn-brand"
            style={{ padding: '12px 20px', fontSize: 13 }}
            disabled={!name.trim()}
          >
            <PlusIcon className="w-4 h-4 mr-1 inline" /> Add Skill
          </button>
        </form>
      </div>

      {/* Quick Add Presets if any are missing */}
      {unaddedPresets.length > 0 && (
        <div className="panel-soft p-5 space-y-3">
          <span className="file-label text-xs">Quick Add Recommended Full-Stack Skills:</span>
          <div className="flex flex-wrap gap-2">
            {unaddedPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleQuickAdd(preset)}
                className="file-chip hover:border-brand hover:text-brand cursor-pointer text-xs transition-colors"
                title={`Click to quickly add ${preset.name} to ${preset.category}`}
              >
                + {preset.name} <span className="text-faint text-[10px]">({preset.category})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Existing Skills List & Management */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="file-label text-xs mr-2">Filter:</span>
            {existingCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`file-chip text-xs cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-cyan-500 text-black font-bold border-cyan-400'
                    : 'hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={load}
            className="file-chip text-xs hover:text-brand"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh List'}
          </button>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedSkills.map((s) => {
            const cat = getSkillCategory(s);
            const badge = getSkillBadge(s);

            return (
              <div
                key={s.id}
                className="panel p-4 flex items-center justify-between gap-3 hover:border-brand/40 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-ink truncate">
                      {cleanSkillName(s)}
                    </span>
                    {s.proficiency ? (
                      <span className="text-[10px] font-mono text-cyan-400">
                        {s.proficiency}%
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-faint">
                    <span>{cat}</span>
                    <span>·</span>
                    <span className="text-cyan-400/80">{badge}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded hover:bg-slate-800 text-mid hover:text-brand transition-colors"
                    title="Edit skill"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id, s.name)}
                    className="p-1.5 rounded hover:bg-rose-500/20 text-mid hover:text-rose-400 transition-colors"
                    title="Delete skill"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {displayedSkills.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 panel p-8 text-center text-sm font-mono text-mid">
              No skills in this category. Add a skill above to see it live on the portfolio.
            </div>
          )}
        </div>
      </div>

      {/* Edit Skill Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit Skill: ${editing?.name || ''}`} maxWidth="max-w-xl">
        <div className="flex flex-col gap-4 max-w-full overflow-hidden">
          <div>
            <label className="file-label text-[10px] mb-1 block">Skill Name</label>
            <input
              className="field font-body"
              value={editForm.name || ''}
              onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Skill Name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="file-label text-[10px] mb-1 block">Category</label>
              <input
                className="field font-body"
                value={editForm.category || ''}
                onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                placeholder="Frontend, Backend, etc."
              />
            </div>
            <div>
              <label className="file-label text-[10px] mb-1 block">Proficiency %</label>
              <input
                className="field font-body"
                type="number"
                min="0"
                max="100"
                value={editForm.proficiency || 0}
                onChange={(e) => setEditForm((p) => ({ ...p, proficiency: Number(e.target.value) }))}
                placeholder="Proficiency %"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-hairline flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost text-xs py-2 px-4"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-brand text-xs py-2 px-5"
              onClick={saveEdit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}