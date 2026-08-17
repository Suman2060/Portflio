export function GoldLine({ text }: { text: string }) {
  const clean = (text || '').trim();
  if (!clean) return null;

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    const raw = words[0].replace(/\.$/, '');
    return (
      <span className="line">
        {raw}
        <span style={{ color: 'var(--brand)' }}>.</span>
      </span>
    );
  }

  const lastWord = words[words.length - 1].replace(/\.$/, '');
  const prefix = words.slice(0, words.length - 1).join(' ');

  return (
    <span className="inline-block">
      <span>{prefix} </span>
      <span style={{ color: 'var(--brand)' }}>
        {lastWord}
        <span>.</span>
      </span>
    </span>
  );
}

export function SectionHeading({ text, className = '' }: { text: string; className?: string }) {
  return (
    <h2 className={`section-heading text-ink ${className}`}>
      <GoldLine text={text} />
    </h2>
  );
}