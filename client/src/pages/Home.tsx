import { useEffect, useState } from 'react';
import { getProjects } from '../api/projects';
import { getSkills } from '../api/skills';
import { getExperience } from '../api/experience';
import { fillSkills } from '../utils/skills';
import type { Project } from '../types/project';
import type { Skill } from '../types/skill';
import type { Experience as ExperienceType } from '../types/experience';
import Hero from '../components/home/Hero';
import Marquee from '../components/home/Marquee';
import Statement from '../components/home/Statement';
import Work from '../components/home/Work';
import Skills from '../components/home/Skills';
import Experience from '../components/home/Experience';
import Contact from '../components/home/Contact';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, s, ex] = await Promise.allSettled([getProjects(), getSkills(), getExperience()]);
      if (cancelled) return;
      if (p.status === 'fulfilled') setProjects(p.value);
      if (s.status === 'fulfilled') setSkills(s.value);
      if (ex.status === 'fulfilled') setExperience(ex.value);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filledSkills = fillSkills(skills);

  return (
    <div>
      <Hero />
      <Marquee skills={filledSkills} />
      <Statement projectsCount={projects.length} experienceCount={experience.length} />
      <Work projects={projects} loading={loading} />
      <Skills skills={filledSkills} />
      <Experience experience={experience} />
      <Contact />
    </div>
  );
}