import { useSite } from '../../context/SiteContext';
import { resolveMetricValue } from '../../types/site';
import { SectionHeading } from '../ui/Heading';

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-800/20 border border-slate-700/30">
      <span className="font-display font-extrabold tracking-tight text-3xl sm:text-4xl text-brand">
        {value}
      </span>
      <span className="file-label text-faint text-[10px]">{label}</span>
    </div>
  );
}

export default function Statement({ projectsCount, experienceCount }: { projectsCount: number; experienceCount: number }) {
  const { site } = useSite();
  const about = site.about;

  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative">
      <div className="file-label mb-3 text-brand">✦ {about.label || 'About the Engineer'}</div>
      
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
        
        {/* Main Bio */}
        <div className="space-y-6">
          <SectionHeading text={about.lines?.join(' ') || 'Engineering scalable systems'} />

          <p className="text-base md:text-lg leading-relaxed text-mid">
            {about.paragraph ||
              'I am a full-stack engineer passionate about creating resilient backend services, scalable databases, and intuitive frontend experiences. With expertise across the entire JavaScript/TypeScript ecosystem, I build fast, reliable, and production-ready applications.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="panel p-4 flex items-start gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="text-sm font-bold text-ink">High Performance</h4>
                <p className="text-xs text-mid mt-0.5">Optimized database queries, caching strategies, and snappy client bundles.</p>
              </div>
            </div>
            <div className="panel p-4 flex items-start gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <h4 className="text-sm font-bold text-ink">Robust Security</h4>
                <p className="text-xs text-mid mt-0.5">JWT auth, parameterized Prisma queries, rate limits, and secure headers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid Panel */}
        <div className="panel p-6 sm:p-8 w-full border-brand/20">
          <div className="flex items-center justify-between gap-2 mb-6 pb-3 border-b border-hairline">
            <span className="file-label text-xs">system_metrics.json</span>
            <span className="text-xs font-mono text-emerald-400">● live</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(about.metrics || []).map((m, i) => (
              <Metric 
                key={i} 
                value={resolveMetricValue(m.value, projectsCount, experienceCount)} 
                label={m.label} 
              />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-faint">
            <span>Location: Global / Remote</span>
            <span className="text-brand">⚡ 100% Commitment</span>
          </div>
        </div>

      </div>
    </section>
  );
}