import { useEffect, useMemo, useState } from 'react';
import { useSite } from '../context/SiteContext';
import { updateSiteSettings } from '../api/site';
import type { SiteSettings } from '../types/site';

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="file-label">{label}</span>
      {textarea ? (
        <textarea className="field" rows={2} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="field" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function LinesField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const text = useMemo(() => (value ?? []).join('\n'), [value]);
  return (
    <Field
      label={label}
      textarea
      value={text}
      onChange={(v) => onChange(v.split('\n'))}
      placeholder="one line per row"
    />
  );
}

export default function SiteSettingsManager() {
  const { site, refetchSite } = useSite();
  const [draft, setDraft] = useState<SiteSettings>(() => JSON.parse(JSON.stringify(site)));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!saved) setDraft(JSON.parse(JSON.stringify(site)));
  }, [site, saved]);

  const patch = (section: keyof SiteSettings, key: string, value: unknown) => {
    setDraft((d) => {
      const copy = JSON.parse(JSON.stringify(d)) as SiteSettings;
      (copy[section] as Record<string, unknown>)[key] = value;
      return copy;
    });
  };

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(site), [draft, site]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateSiteSettings(draft);
      setSaved(true);
      await refetchSite();
      setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      console.error(err);
      alert('Failed to save site settings');
    } finally {
      setSaving(false);
    }
  }

  const input = (section: keyof SiteSettings, key: string, opts?: { textarea?: boolean; placeholder?: string }) => {
    const value = String((draft[section] as Record<string, unknown>)[key] ?? '');
    return (
      <Field
        label={key}
        textarea={opts?.textarea}
        placeholder={opts?.placeholder}
        value={value}
        onChange={(v) => patch(section, key, v)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <span className="file-label">Site appearance — what visitors see on the portfolio</span>
        <div className="flex items-center gap-2">
          {saved && <span className="file-label" style={{ color: 'var(--live)' }}>saved ✓</span>}
          <button className="btn btn-brand" style={{ padding: '9px 16px', fontSize: 13 }} onClick={handleSave} disabled={saving}>
            {saving ? 'saving…' : dirty ? 'save changes' : 'saved'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="panel-soft p-5 flex flex-col gap-3">
        <span className="file-label mb-1">hero</span>
        <div className="grid md:grid-cols-2 gap-3">
          {input('hero', 'name')}
          {input('hero', 'displayName')}
          {input('hero', 'availability')}
          {input('hero', 'openTo')}
        </div>
        {input('hero', 'heroImage', { placeholder: '/uploads/your-portrait.jpg or https://…' })}
        <LinesField label="lines (hero heading, one per line)" value={draft.hero.lines} onChange={(v) => patch('hero', 'lines', v)} />
        <div className="grid md:grid-cols-2 gap-3">
          {input('hero', 'emphasisLine')}
          {input('hero', 'stickyNote', { placeholder: 'working worldwide\nno office, on purpose' })}
        </div>
        {input('hero', 'subline', { textarea: true })}
        <div className="grid md:grid-cols-2 gap-3">
          {input('hero', 'primaryCtaLabel')}
          {input('hero', 'primaryCtaHref')}
          {input('hero', 'secondaryCtaLabel')}
          {input('hero', 'secondaryCtaHref')}
        </div>
      </section>

      {/* About / statement */}
      <section className="panel-soft p-5 flex flex-col gap-3">
        <span className="file-label mb-1">about</span>
        <div className="grid md:grid-cols-2 gap-3">
          {input('about', 'label')}
          {input('about', 'metricsLabel')}
        </div>
        <LinesField label="statement heading lines" value={draft.about.lines} onChange={(v) => patch('about', 'lines', v)} />
        {input('about', 'emphasis')}
        {input('about', 'paragraph', { textarea: true })}
        <div className="flex flex-col gap-2">
          <span className="file-label">metrics (use {'{projects}'} / {'{roles}'} for live counts)</span>
          {(draft.about.metrics ?? []).map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <input className="field" value={m.value} placeholder="value" onChange={(e) => {
                const metrics = draft.about.metrics.map((x, j) => (j === i ? { ...x, value: e.target.value } : x));
                patch('about', 'metrics', metrics);
              }} />
              <input className="field" value={m.label} placeholder="label" onChange={(e) => {
                const metrics = draft.about.metrics.map((x, j) => (j === i ? { ...x, label: e.target.value } : x));
                patch('about', 'metrics', metrics);
              }} />
              <button className="file-chip" type="button" onClick={() => patch('about', 'metrics', draft.about.metrics.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          <button className="file-chip" type="button" style={{ width: 'fit-content' }} onClick={() => patch('about', 'metrics', [...(draft.about.metrics ?? []), { value: '', label: '' }])}>
            + add metric
          </button>
        </div>
      </section>

      {/* Labels */}
      <section className="panel-soft p-5 flex flex-col gap-3">
        <span className="file-label mb-1">labels — section headings</span>
        <div className="grid md:grid-cols-2 gap-3">
          {input('labels', 'work')}
          {input('labels', 'workHeading')}
          {input('labels', 'workEmpty', { textarea: true })}
          {input('labels', 'skillsLabel')}
          {input('labels', 'skillsHeading')}
          {input('labels', 'skillsStartChip')}
          {input('labels', 'experienceLabel')}
          {input('labels', 'experienceEmpty')}
          {input('labels', 'contactLabel')}
          {input('labels', 'contactEmphasis')}
          {input('labels', 'footerFrame')}
        </div>
        {input('labels', 'skillsDesc', { textarea: true })}
        <LinesField label="contact heading lines" value={draft.labels.contactLines} onChange={(v) => patch('labels', 'contactLines', v)} />
        {input('labels', 'contactSub', { textarea: true })}
      </section>

      {/* Socials */}
      <section className="panel-soft p-5 flex flex-col gap-3">
        <span className="file-label mb-1">socials</span>
        <div className="grid md:grid-cols-2 gap-3">
          {input('socials', 'email')}
          {input('socials', 'github')}
          {input('socials', 'linkedin')}
          {input('socials', 'twitter')}
        </div>
      </section>

      {/* Footer */}
      <section className="panel-soft p-5 flex flex-col gap-3">
        <span className="file-label mb-1">footer</span>
        {input('footer', 'tagline', { textarea: true })}
        <div className="grid md:grid-cols-2 gap-3">
          {input('footer', 'email')}
          {input('footer', 'copyrightName')}
        </div>
        {input('footer', 'madeWith')}
      </section>

      {/* SEO */}
      <section className="panel-soft p-5 flex flex-col gap-3">
        <span className="file-label mb-1">seo</span>
        {input('seo', 'title')}
        {input('seo', 'description', { textarea: true })}
        <div className="grid md:grid-cols-2 gap-3">
          {input('seo', 'author')}
          {input('seo', 'ogImage')}
        </div>
      </section>
    </div>
  );
}