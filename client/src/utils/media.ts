const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5500/api').replace(/\/api\/?$/, '');

export function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^\/uploads\//i.test(url)) return `${API_ORIGIN}${url}`;
  return url;
}