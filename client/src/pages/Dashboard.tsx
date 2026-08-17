import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsTab from '../components/admin/ProjectsTab';
import SkillsTab from '../components/admin/SkillsTab';
import ExperienceTab from '../components/admin/ExperienceTab';
import MessagesTab from '../components/admin/MessagesTab';
import SiteSettingsManager from '../components/SiteSettingsManager';

type Tab = 'projects' | 'skills' | 'experience' | 'messages' | 'site';

const TABS: { id: Tab; label: string }[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'messages', label: 'Messages' },
  { id: 'site', label: 'Site' },
];

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('projects');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="file-label mb-2">Dashboard</div>
          <h1 className="font-display uppercase font-bold tracking-tight" style={{ fontSize: 'clamp(28px,4vw,42px)', lineHeight: 1 }}>
            content<span style={{ color: 'var(--brand)' }}>.</span>studio
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" className="btn btn-ghost" style={{ padding: '9px 16px', fontSize: 13, color: 'var(--ink)' }}>
            view site ↗
          </a>
          <button className="btn btn-brand" style={{ padding: '9px 16px', fontSize: 13, color: '#fff' }} onClick={handleLogout}>
            logout
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="file-chip cursor-pointer"
            style={
              tab === t.id
                ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }
                : undefined
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'projects' && <ProjectsTab />}
      {tab === 'skills' && <SkillsTab />}
      {tab === 'experience' && <ExperienceTab />}
      {tab === 'messages' && <MessagesTab />}
      {tab === 'site' && <SiteSettingsManager />}
    </div>
  );
}