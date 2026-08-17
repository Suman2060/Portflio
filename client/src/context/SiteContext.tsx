/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSiteSettings } from '../api/site';
import { DEFAULT_SITE, type SiteSettings } from '../types/site';

interface SiteContextValue {
  site: SiteSettings;
  siteLoaded: boolean;
  refetchSite: () => Promise<void>;
}

const SiteContext = createContext<SiteContextValue>({
  site: DEFAULT_SITE,
  siteLoaded: false,
  refetchSite: async () => {},
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteSettings>(DEFAULT_SITE);
  const [siteLoaded, setSiteLoaded] = useState(false);

  const refetchSite = useCallback(async () => {
    try {
      const settings = await getSiteSettings();
      setSite(settings);
    } catch (err) {
      console.error('Failed to load site settings', err);
    } finally {
      setSiteLoaded(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSiteSettings()
      .then((settings) => {
        if (!cancelled) setSite(settings);
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load site settings', err);
      })
      .finally(() => {
        if (!cancelled) setSiteLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteContext.Provider value={{ site, siteLoaded, refetchSite }}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return ctx;
}