import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { SiteProvider } from './context/SiteContext';
import { useSeo } from './hooks/useSeo';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));

function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-sm font-mono text-mid">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-3" />
      <span>{message}</span>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="text-6xl font-mono font-bold text-brand mb-4">404</div>
      <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase mb-2">
        Page Not Found
      </h1>
      <p className="text-mid max-w-md mb-8">
        The route you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-brand">
        Return to Home <span className="arrow">→</span>
      </Link>
    </div>
  );
}

function Shell() {
  useSeo();
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <SiteProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </SiteProvider>
  );
}

export default App;