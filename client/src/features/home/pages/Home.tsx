import { useState } from 'react';
import { fillSkills } from '../../../utils/skills';
import { useSite } from '../../../store/siteStore';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Statement from '../components/Statement';
import Work from '../components/Work';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import LoadingScreen from '../../../shared/components/ui/LoadingScreen';

export default function Home() {
  const { projects, skills, experience, dataLoaded } = useSite();
  const [showPreloader, setShowPreloader] = useState(true);

  const filledSkills = fillSkills(skills);

  return (
    <div>
      {showPreloader && (
        <LoadingScreen ready={dataLoaded} onComplete={() => setShowPreloader(false)} />
      )}

      <Hero />
      <Marquee skills={filledSkills} />
      <Statement projectsCount={projects.length} experienceCount={experience.length} />
      <Work projects={projects} loading={!dataLoaded} />
      <Skills skills={filledSkills} />
      <Experience experience={experience} />
      <Contact />
    </div>
  );
}