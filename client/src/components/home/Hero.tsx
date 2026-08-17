import { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext';

const ROLES = [
  'Full-Stack Developer',
  'Node.js & React Architect',
  'PostgreSQL & API Engineer',
  'Cloud & DevOps Enthusiast',
];

export default function Hero() {
  const { site } = useSite();
  const hero = site.hero;
  
  // Interactive role cycling animation
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetRole = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < targetRole.length) {
          setCurrentText(targetRole.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(targetRole.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex]);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Glow highlight behind hero */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand/10 rounded-full blur-[120px] pointer-events-none -z-10" 
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Headline & Bio */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                <span className="status-dot" />
                <span>{hero.availability || 'AVAILABLE FOR HIRE'}</span>
              </div>
              <span className="text-xs font-mono text-mid uppercase tracking-widest hidden sm:inline-block">
                ✦ Full-Stack Engineering
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-base md:text-lg font-mono text-brand font-medium tracking-wide">
                Hi, my name is
              </p>
              <h1 className="font-display font-extrabold uppercase text-4xl sm:text-6xl md:text-7xl tracking-tight text-ink">
                {hero.name || 'Suman Dangol'}
              </h1>
              
              <div className="h-10 sm:h-12 flex items-center font-display text-2xl sm:text-3xl md:text-4xl font-bold">
                <span className="gradient-text">{currentText}</span>
                <span className="terminal-cursor" />
              </div>
            </div>

            <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-mid">
              {hero.subline ||
                'I build scalable end-to-end web applications, robust REST APIs, distributed backends, and sleek modern user experiences.'}
            </p>

            {/* Quick Tech Highlights */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-faint uppercase mr-1">Core Stack:</span>
              {['TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind', 'Docker'].map((tech) => (
                <span key={tech} className="file-chip text-[11px] py-1 px-2.5">
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a className="btn btn-brand" href={hero.primaryCtaHref || '#contact'}>
                {hero.primaryCtaLabel || 'Get in Touch'} <span className="arrow">↗</span>
              </a>
              <a className="btn btn-ghost" href={hero.secondaryCtaHref || '#work'}>
                {hero.secondaryCtaLabel || 'View Projects'} <span className="arrow">↓</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Code Terminal & Portrait */}
          <div className="flex flex-col gap-5 mx-auto lg:mx-0 w-full max-w-md">
            {/* Terminal Window Card */}
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                </div>
                <span className="text-[11px] text-faint font-mono">developer.ts</span>
                <span className="text-[11px] text-emerald-400 font-mono">● active</span>
              </div>
              
              <div className="p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed space-y-2 overflow-x-auto text-slate-300">
                <div>
                  <span className="text-purple">const</span> <span className="text-brand">developer</span> = &#123;
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">name:</span> <span className="text-emerald-400">'{hero.name || "Suman Dangol"}'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">role:</span> <span className="text-emerald-400">'Full-Stack Software Engineer'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">expertise:</span> [
                  <span className="text-amber-300">'Frontend'</span>, <span className="text-amber-300">'Backend'</span>, <span className="text-amber-300">'DBs'</span>, <span className="text-amber-300">'DevOps'</span>
                  ],
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">status:</span> <span className="text-cyan-400">'Ready for high-impact roles'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">craft:</span> () =&gt; <span className="text-purple">new</span> <span className="text-brand">FullStackApp</span>().deploy()
                </div>
                <div>&#125;;</div>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="panel p-4 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-brand">⚡</span>
                <span className="text-ink font-medium">Full-Stack Architecture</span>
              </div>
              <span className="text-faint">Clean Code · High Performance</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}