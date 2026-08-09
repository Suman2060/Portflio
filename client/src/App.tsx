import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DarkModeToggle from './components/DarkModeToggle';
import React, { useEffect, useState } from 'react';
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return <>{hh}:{mm}:{ss}</>;
}

function Chrome() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40 }}>
      <div className="ruler relative">
        <span className="flex items-center gap-1.5">
          <span className="status-dot" style={{ width: 6, height: 6 }} />

        </span>
        <span className="ticks" style={{ height: 20 }} />
        <span className="flex items-center gap-1.5">
          {/* <span className="cursor-tag" style={{ background: 'var(--brand)' }}>● You</span>
          <span className="cursor-tag" style={{ background: 'var(--tool)' }}>● Guest</span> */}
        </span>
        <span className="flex items-center gap-1.5" style={{ color: 'var(--live)', fontWeight: 700 }}>
          LIVE · <LiveClock />
        </span>
      </div>
      <nav
        className="border-b glass"
        style={{
          borderColor: 'var(--hairline)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-6" style={{ height: 62 }}>
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-display uppercase font-bold tracking-tight" style={{ fontSize: 17 }}>
              <span className="inline-block" style={{ width: 12, height: 12, background: 'var(--brand)', borderRadius: 3, transform: 'rotate(8deg)' }} />
              Suman<span style={{ color: 'var(--brand)' }}>Dangol</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {isHome && (
                <>
                  <a href="#work" className="text-sm font-medium hover:underline">Work</a>
                  <a href="#skills" className="text-sm font-medium hover:underline">Skills</a>
                  <a href="#experience" className="text-sm font-medium hover:underline">Experience</a>
                  <a href="#contact" className="text-sm font-medium hover:underline">Contact</a>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin" className="file-chip">admin.tsx</Link>
            <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>Login</Link>
            <a href="#contact" className="btn btn-brand hidden sm:inline-flex" style={{ padding: '8px 16px', fontSize: 13 }}>
              available for projects <span className="status-dot" style={{ width: 7, height: 7 }} />
            </a>
            <DarkModeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-10 justify-between">
        <div>
          <div className="file-label mb-3">footer.frame</div>
          <p className="font-display uppercase font-bold tracking-tight" style={{ fontSize: 'clamp(24px,3.5vw,40px)', lineHeight: 0.96 }}>
            have an idea<br />worth building?
          </p>
          <a href="mailto:hello@yourname.dev" className="btn btn-brand mt-5" style={{ color: '#fff' }}>
            hello@yourname.dev <span className="arrow">↗</span>
          </a>
        </div>
        <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--mid)' }}>
          <span className="file-label mb-1">© {new Date().getFullYear()} · yourname.fig</span>
          <span className="flex items-center gap-2">
            <span className="status-dot" style={{ width: 6, height: 6 }} /> 1 cursor online · <LiveClock />
          </span>
          <span className="mt-2">made with nothing but react + tailwind</span>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Chrome />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/projects/:slug" element={<React.Suspense fallback={<div className="p-6">Loading…</div>}><ProjectDetail /></React.Suspense>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;