import { useState, type FormEvent } from 'react';
import { useSite } from '../../context/SiteContext';
import apiClient from '../../api/client';
import { SectionHeading } from '../ui/Heading';

export default function Contact() {
  const { site } = useSite();
  const labels = site.labels;
  const socials = site.socials;
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setStatusText('Delivering message...');
    try {
      await apiClient.post('/messages', contact);
      setContact({ name: '', email: '', message: '' });
      setStatus('success');
      setStatusText('✓ Message sent successfully! I will reply soon.');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setStatusText('Failed to send message. Please email me directly.');
    }
  }

  function handleCopyEmail() {
    if (socials.email) {
      navigator.clipboard.writeText(socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section id="contact" className="border-t border-slate-800/40 relative">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        
        <div className="file-label mb-3 text-brand">
          ✦ {labels.contactLabel || 'Initiate Contact'}
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          
          {/* Left: Contact Info */}
          <div className="space-y-6">
            <SectionHeading text={labels.contactLines?.join(' ') || "Let's build something extraordinary"} />

            <p className="text-base md:text-lg text-mid max-w-lg leading-relaxed">
              {labels.contactSub ||
                "Whether you are looking to hire a full-stack engineer, build a new product, or discuss technical architecture — my inbox is always open."}
            </p>

            {/* Direct Email Card */}
            {socials.email && (
              <div className="panel p-5 inline-flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <span className="file-label text-[10px] text-faint">Direct Email</span>
                  <div className="text-sm sm:text-base font-mono font-medium text-ink">
                    {socials.email}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={`mailto:${socials.email}`} 
                    className="btn btn-brand text-xs py-2 px-3"
                  >
                    Email Me ↗
                  </a>
                  <button 
                    onClick={handleCopyEmail}
                    className="btn btn-ghost text-xs py-2 px-3"
                    title="Copy to clipboard"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* Availability note */}
            <div className="flex items-center gap-2 text-xs font-mono text-faint">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Typical response time: within 24 hours</span>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="panel p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 mb-6 pb-3 border-b border-hairline">
              <span className="file-label text-xs">send_message.sh</span>
              <span className="text-xs font-mono text-brand">Secure Transmission</span>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="file-label text-[10px] mb-1.5 block">Your Name</label>
                  <input
                    className="field font-body"
                    placeholder="e.g. Jane Doe"
                    value={contact.name}
                    onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="file-label text-[10px] mb-1.5 block">Your Email</label>
                  <input
                    className="field font-body"
                    placeholder="jane@company.com"
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="file-label text-[10px] mb-1.5 block">Message / Project Brief</label>
                <textarea
                  className="field font-body"
                  rows={4}
                  placeholder="Tell me about the role, project, or timeline..."
                  value={contact.message}
                  onChange={(e) => setContact((p) => ({ ...p, message: e.target.value }))}
                  required
                />
              </div>

              {/* Status Message */}
              {statusText && (
                <div className={`text-xs font-mono p-3 rounded-lg ${
                  status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  status === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                  'bg-slate-800 text-mid'
                }`}>
                  {statusText}
                </div>
              )}

              <button 
                className="btn btn-brand justify-center w-full mt-2" 
                type="submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Transmitting...' : 'Send Message'} <span className="arrow">→</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}