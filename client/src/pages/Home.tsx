import React, { useEffect, useState } from 'react';
import { getProjects } from '../api/projects';
import { getSkills } from '../api/skills';
import apiClient from '../api/client';
import type { Project } from '../types/project';
import type { Skill } from '../types/skill';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        const s = await getSkills();
        setSkills(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">Your Name — Web Developer</h1>
          <p className="text-zinc-600 mt-2">Showcase of selected projects and skills.</p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-zinc-600 dark:text-zinc-300">Passionate web developer building modern, accessible, and performant applications. Specializing in frontend development with React and TypeScript, plus full-stack experience with Node.js and Prisma.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-sm">{s.name}</span>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          {contactStatus && <p className="text-sm mb-2">{contactStatus}</p>}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setContactStatus('Sending...');
            try {
              await apiClient.post('/messages', contact);
              setContact({ name: '', email: '', message: '' });
              setContactStatus('Message sent — thank you!');
            } catch (err) {
              console.error(err);
              setContactStatus('Failed to send message');
            }
          }} className="flex flex-col gap-2 max-w-xl">
            <input placeholder="Your name" value={contact.name} onChange={(e)=>setContact(prev=>({...prev,name:e.target.value}))} className="px-3 py-2 rounded border bg-white dark:bg-zinc-800" required />
            <input placeholder="Your email" value={contact.email} onChange={(e)=>setContact(prev=>({...prev,email:e.target.value}))} className="px-3 py-2 rounded border bg-white dark:bg-zinc-800" type="email" required />
            <textarea placeholder="Message" value={contact.message} onChange={(e)=>setContact(prev=>({...prev,message:e.target.value}))} className="px-3 py-2 rounded border bg-white dark:bg-zinc-800" required />
            <button className="px-4 py-2 rounded bg-zinc-900 text-white">Send message</button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
          {loading ? (
            <p className="text-sm text-zinc-400">Loading…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <article key={p.id} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-lg"><a href={`/projects/${p.slug}`} className="hover:underline">{p.title}</a></h3>
                    {p.isFeatured && <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 text-white">Featured</span>}
                  </div>
                  {p.shortDescription && <p className="text-sm text-zinc-500 dark:text-zinc-300 mt-2">{p.shortDescription}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.techStack.map((t) => (
                      <span key={t} className="text-xs font-mono px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200">{t}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
