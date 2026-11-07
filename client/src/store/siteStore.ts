import { create } from 'zustand';
import { getExperience } from '../api/experience';
import { getProjects } from '../api/projects';
import { getSiteSettings } from '../api/site';
import { getSkills } from '../api/skills';
import { DEFAULT_SITE, type SiteSettings } from '../types/site';
import type { Experience } from '../types/experience';
import type { Project } from '../types/project';
import type { Skill } from '../types/skill';

interface SiteStore {
  site: SiteSettings;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  siteLoaded: boolean;
  dataLoaded: boolean;
  isLoading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  refetchSite: () => Promise<void>;
}

export const useSiteStore = create<SiteStore>((set, get) => ({
  site: DEFAULT_SITE,
  projects: [],
  skills: [],
  experience: [],
  siteLoaded: false,
  dataLoaded: false,
  isLoading: false,
  initialized: false,

  initialize: async () => {
    if (get().initialized || get().isLoading) return;

    set({ isLoading: true });
    const [siteResult, projectsResult, skillsResult, experienceResult] = await Promise.allSettled([
      getSiteSettings(),
      getProjects(),
      getSkills(),
      getExperience(),
    ]);

    if (siteResult.status === 'fulfilled') {
      set({ site: siteResult.value });
    } else {
      console.error('Failed to load site settings', siteResult.reason);
    }

    if (projectsResult.status === 'fulfilled') {
      set({ projects: projectsResult.value });
    } else {
      console.error('Failed to load projects', projectsResult.reason);
    }

    if (skillsResult.status === 'fulfilled') {
      set({ skills: skillsResult.value });
    } else {
      console.error('Failed to load skills', skillsResult.reason);
    }

    if (experienceResult.status === 'fulfilled') {
      set({ experience: experienceResult.value });
    } else {
      console.error('Failed to load experience', experienceResult.reason);
    }

    set({
      siteLoaded: siteResult.status === 'fulfilled',
      dataLoaded: true,
      isLoading: false,
      initialized: true,
    });
  },

  refetchSite: async () => {
    try {
      const site = await getSiteSettings();
      set({ site, siteLoaded: true });
    } catch (error) {
      console.error('Failed to reload site settings', error);
      set({ siteLoaded: true });
      throw error;
    }
  },
}));

export const useSite = useSiteStore;
