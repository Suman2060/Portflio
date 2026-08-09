import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api/projects';
import { getSkills } from '../api/skills';
import { getExperience } from '../api/experience';
import apiClient from '../api/client';
import type { Project } from '../types/project';
import type { Skill } from '../types/skill';
import type { Experience } from '../types/experience';

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display font-bold tracking-tight" style={{ fontSize: 'clamp(28px,4vw,44px)', lineHeight: 1 }}>
        {value}
      </span>
      <span className="file-label">{label}</span>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [data, s, ex] = await Promise.all([getProjects(), getSkills(), getExperience()]);
        setProjects(data);
        setSkills(s);
        setExperience(ex);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = projects.filter((p) => p.isFeatured).slice(0, 6);
  const workList = (featured.length > 0 ? featured : projects).slice(0, 6);

  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 md:pt-24">
          <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-end">
            <div className="flex flex-col gap-3 md:pb-2">
              <div className="flex items-start gap-2">
                <span className="cursor-tag" style={{ background: 'var(--tool)', transform: 'rotate(-2deg)' }}>
                  you
                </span>
              </div>
              <span className="font-display font-bold uppercase tracking-tight" style={{ fontSize: 22 }}>
                Suman Dangol
              </span>
              <span className="tag-pill">available for projects</span>
              <span className="tag-pill" style={{ width: 'fit-content' }}>open to 2027 · your timezone, handled</span>
            </div>

            <div>
              <h1 className="hero-heading">
                builds<br />worth<br />
                <span className="font-fraunces italic" style={{ fontStyle: 'italic', color: 'var(--brand)', textTransform: 'none' }}>
                  stopping for
                </span>
                <span style={{ color: 'var(--brand)' }}>.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base md:text-lg" style={{ color: 'var(--mid)' }}>
                we don't do forgettable
                <span style={{ color: 'var(--brand)' }}> ✦</span> most portfolios you can
                scroll right past — the stuff I build does this to your eyes.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <a className="btn btn-brand" href="#contact">
                  Book a call <span className="arrow">↗</span>
                </a>
                <a className="btn btn-ghost" href="#work">
                  See the work <span className="arrow">↓</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -right-10 bottom-4 hidden lg:block rotate-3">
          <div className="sticky-note">
            working worldwide<br />no office, on purpose
          </div>
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <section className="marquee py-3">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k} className="flex items-center font-display font-semibold uppercase tracking-wide" style={{ fontSize: 22, gap: 26, paddingRight: 26, minWidth: 'max-content' }}>
              {(skills.length > 0 ? skills : [
                { name: 'React' }, { name: 'TypeScript' }, { name: 'Node.js' }, { name: 'UI/UX' },
                { name: 'Prisma' }, { name: 'Tailwind' },
              ] as Skill[]).map((s, i) => (
                <span key={i} className="flex items-center" style={{ gap: 26 }}>
                  {s.name}
                  <span style={{ color: 'var(--brand)' }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ---------------- STATEMENT ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="file-label mb-4">statement.txt</div>
        <div className="grid md:grid-cols-[1fr_auto] gap-10 items-start">
          <div>
            <h2 className="section-heading">
              we make people<br />stop and ask —<br />
              <span className="hand-underline">
                who built that?
                <svg viewBox="0 0 200 10" preserveAspectRatio="none" fill="none">
                  <path d="M2 8 Q 60 2 120 6 T 198 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="mt-6 max-w-lg" style={{ color: 'var(--mid)' }}>
              That reaction is the whole job. One developer doing strategy, design, and code for builds
              that refuse to look ordinary. No templates, ever.
            </p>
          </div>

          <div className="panel p-6 max-w-xs w-full">
            <div className="file-label mb-4">metrics</div>
            <div className="flex flex-col gap-5">
              <Metric value={String(projects.length)} label="projects shipped" />
              <Metric value="15+" label="avg hr turnaround" />
              <Metric value={String(experience.length)} label="roles logged" />
              <Metric value="5.0" label="client rating" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- WORK ---------------- */}
      <section id="work" className="border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="file-label mb-3">index.html</div>
              <h2 className="section-heading">selected<br />work<span style={{ color: 'var(--brand)' }}>.</span></h2>
            </div>
            <span className="file-chip hidden sm:inline-flex">scroll ↓</span>
          </div>

          {loading ? (
            <p className="text-sm" style={{ color: 'var(--mid)' }}>loading…</p>
          ) : workList.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--mid)' }}>nothing shipped yet — check back soon.</p>
          ) : (
            <div>
              {workList.map((p, i) => (
                <Link key={p.id} to={`/projects/${p.slug}`} className="work-row">
                  <div className="flex items-start gap-5">
                    <span className="file-label mt-1 w-8 shrink-0">0{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display uppercase font-bold tracking-tight" style={{ fontSize: 'clamp(22px,3vw,34px)', lineHeight: 1 }}>
                        {p.title}
                      </h3>
                      {p.shortDescription && (
                        <p className="mt-2 text-sm" style={{ color: 'var(--mid)' }}>{p.shortDescription}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {p.techStack.slice(0, 5).map((t) => (
                          <span key={t} className="file-chip">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="row-arrow font-display font-bold" style={{ fontSize: 22 }}>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- SKILLS ---------------- */}
      <section id="skills" className="border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="file-label mb-4">capabilities</div>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="section-heading">build<br />bold<span style={{ color: 'var(--brand)' }}>.</span></h2>
              <p className="mt-5 text-sm" style={{ color: 'var(--mid)' }}>
                front to back, designed live. every line placed with intent —
                from first wireframe to pixel-final deploy.
              </p>
              <div className="file-chip mt-6" >start</div>
            </div>
            <div className="flex flex-wrap gap-2.5 content-start">
              {(skills.length > 0 ? skills : [
                { name: 'UI/UX' }, { name: 'Web Dev' }, { name: 'Full-stack' }, { name: 'Brand' },
                { name: 'Prototyping' }, { name: 'Motion Systems' },
              ] as Skill[]).map((s, i) => (
                <span key={i} className="tag-pill"
                  style={i % 3 === 1 ? { background: 'var(--tool)', color: '#fff', borderColor: 'transparent' } : undefined}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- EXPERIENCE ---------------- */}
      <section id="experience" className="border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="file-label mb-6">experience.tsx</div>
          <div className="flex flex-col">
            {experience.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--mid)' }}>experience builds up here.</p>
            )}
            {experience.map((e, i) => (
              <div key={e.id ?? i} className="work-row" style={{ cursor: 'default' }}>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <span className="file-label w-24 shrink-0">{e.startDate || ''}</span>
                  <span className="font-display uppercase tracking-tight font-bold" style={{ fontSize: 22 }}>
                    {e.title}
                    {e.organization && <span style={{ color: 'var(--brand)' }}> · {e.organization}</span>}
                  </span>
                </div>
                {e.description && <p className="mt-2 text-sm max-w-xl" style={{ color: 'var(--mid)' }}>{e.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="file-label mb-4">#contact</div>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-start">
            <div>
              <h2 className="section-heading">
                no forms.<br />no hoops.<br />
                <span className="hand-underline">
                  just this.
                  <svg viewBox="0 0 120 8" preserveAspectRatio="none" fill="none">
                    <path d="M2 6 Q 40 1 80 4 T 118 3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>
              <p className="mt-6 max-w-md" style={{ color: 'var(--mid)' }}>
                one message, zero chaos. drop a brief and i'll take it from there —
                first reply lands fast, always.
              </p>
            </div>

            <div className="panel overflow-hidden">
              <div className="py-3 px-5 flex items-center gap-2 border-b" style={{ borderColor: 'var(--hairline)', background: 'var(--paper-soft)' }}>
                <span className="cursor-tag" style={{ background: 'var(--tool)' }}># projects</span>
                <span className="file-label flex-1" style={{ textAlign: 'right' }}>you're in ✦</span>
              </div>
              <form
                className="flex flex-col gap-3 p-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setContactStatus('sending…');
                  try {
                    await apiClient.post('/messages', contact);
                    setContact({ name: '', email: '', message: '' });
                    setContactStatus('shipped — thank you.');
                  } catch (err) {
                    console.error(err);
                    setContactStatus('failed to send. try the email below?');
                  }
                }}
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="field" placeholder="your name" value={contact.name} onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))} required />
                  <input className="field" placeholder="your email" type="email" value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} required />
                </div>
                <textarea className="field" rows={4} placeholder="vision + links + your best idea" value={contact.message} onChange={(e) => setContact((p) => ({ ...p, message: e.target.value }))} required />
                <div className="flex items-center justify-between gap-3">
                  {contactStatus ? (
                    <span className="file-label">{contactStatus}</span>
                  ) : (
                    <span className="file-label">you: 10:02 — subscribed. let's build <span style={{ color: 'var(--brand)' }}>→</span></span>
                  )}
                  <button className="btn btn-brand" type="submit">send it <span className="arrow">→</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CLOSING ---------------- */}
      <section className="border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="file-chip mx-auto inline-flex">this button does absolutely nothing</div>
          <button
            className="btn btn-ghost mx-auto mt-5"
       
            onClick={() => {
              let c = 1;
              const el = document.getElementById('portal-guy');
              const t = setInterval(() => {
                if (!el) return clearInterval(t);
                el.style.transform = `translate(${c % 2 === 0 ? 0 : 6}px, -${c * 2}px)`;
                c++;
                if (c > 4) { clearInterval(t); el.style.transform = ''; }
              }, 120);
            }}
          >
            poke it anyway <span className="arrow">*</span>
          </button>
          <div id="portal-guy" className="mt-4 font-display font-bold" style={{ fontSize: 40, transition: 'all 0.12s' }}>
            ✦
          </div>
        </div>
      </section>
    </div>
  );
}