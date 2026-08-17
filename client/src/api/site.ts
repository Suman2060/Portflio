import apiClient from './client';
import type { SiteSettings } from '../types/site';

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await apiClient.get<SiteSettings>('/site');
  return res.data;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await apiClient.put<SiteSettings>('/site', data);
  return res.data;
}