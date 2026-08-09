import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DarkModeToggle from './components/DarkModeToggle';
import React from 'react';
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <nav className="border-b border-zinc-200 dark:border-zinc-700">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-semibold">Portfolio</Link>
              <Link to="/admin" className="text-sm text-zinc-500">Admin</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-zinc-500">Login</Link>
              <DarkModeToggle />
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/projects/:slug" element={/* lazy load detail */ <React.Suspense fallback={<div className="p-6">Loading…</div>}><ProjectDetail /></React.Suspense>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;