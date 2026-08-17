import { useSite } from '../../context/SiteContext';

export default function Footer() {
  const { site } = useSite();
  const footer = site.footer;
  const socials = site.socials;

  return (
    <footer className="border-t border-slate-800/40 relative z-20 bg-canvas">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 justify-between items-start mb-12">
          
          {/* Left: Tagline & CTA */}
          <div className="space-y-4">
            <h3 className="font-display uppercase font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl text-ink">
              Ready to ship high-impact software?
            </h3>
            <p className="text-sm md:text-base text-mid max-w-md">
              Available for full-time full-stack engineering roles, technical consulting, and greenfield projects.
            </p>
            <div className="pt-2">
              <a 
                href={`mailto:${footer.email || socials.email}`} 
                className="btn btn-brand text-xs sm:text-sm"
              >
                {footer.email || socials.email} <span className="arrow">↗</span>
              </a>
            </div>
          </div>

          {/* Right: Social Connections & Meta */}
          <div className="flex flex-col md:items-end gap-4 text-sm text-mid">
            <span className="file-label">Connect & Socials</span>
            
            <div className="flex flex-wrap gap-2">
              {socials.github && (
                <a 
                  className="file-chip hover:text-brand transition-colors" 
                  href={socials.github} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              )}
              {socials.linkedin && (
                <a 
                  className="file-chip hover:text-brand transition-colors" 
                  href={socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
              )}
              {socials.twitter && (
                <a 
                  className="file-chip hover:text-brand transition-colors" 
                  href={socials.twitter} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  Twitter / X ↗
                </a>
              )}
              <a 
                className="file-chip hover:text-brand transition-colors" 
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Back to Top ↑
              </a>
            </div>

            <div className="text-xs font-mono text-faint mt-2 md:text-right space-y-1">
              <div>© {new Date().getFullYear()} {footer.copyrightName || 'Suman Dangol'}. All rights reserved.</div>
              <div>{footer.madeWith || 'Engineered with React 19, TypeScript & Tailwind CSS'}</div>
            </div>
          </div>

        </div>

        {/* Bottom Status Bar */}
        <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-faint">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>All systems operational</span>
          </div>
          <span>Production Build · High Performance</span>
        </div>
      </div>
    </footer>
  );
}