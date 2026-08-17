import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Initializing kernel...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const steps = [
      { at: 20, text: 'Mounting React & TypeScript client...' },
      { at: 55, text: 'Fetching backend services & schema...' },
      { at: 85, text: 'Hydrating design system...' },
      { at: 100, text: 'System ready.' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 15) + 12;
        if (next >= 100) {
          clearInterval(interval);
          setStepText('System ready.');
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 400);
          }, 300);
          return 100;
        }

        const match = steps.find((s) => next >= s.at);
        if (match) setStepText(match.text);

        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b12] text-slate-100 transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background cyber glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm px-6 relative z-10 flex flex-col items-center">
        {/* Glowing Logo / Terminal mark */}
        <div className="relative mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse">
            <span className="font-mono font-black text-2xl text-black">SD</span>
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#070b12]" />
        </div>

        {/* Developer Title */}
        <div className="text-center mb-6 space-y-1">
          <h2 className="font-display font-bold uppercase tracking-wider text-base text-white">
            Suman Dangol
          </h2>
          <p className="text-xs font-mono text-cyan-400">
            Full-Stack Software Engineer
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span className="truncate max-w-[220px]">{stepText}</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>

          <div className="h-1.5 w-full bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-150 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Terminal status badge */}
        <div className="mt-8 flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>PORTFOLIO_OS_V2.0 · INITIALIZING</span>
        </div>
      </div>
    </div>
  );
}
