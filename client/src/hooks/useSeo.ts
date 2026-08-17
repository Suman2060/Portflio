import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSeo() {
  const { site } = useSite();
  const seo = site.seo;

  useEffect(() => {
    const title = seo.title || 'Suman Dangol — Full-Stack Developer & Software Architect';
    const description = seo.description || 'Full-Stack Developer crafting high-performance, scalable web systems and modern user interfaces.';
    
    document.title = title;
    
    upsertMeta('name', 'description', description);
    if (seo.author) upsertMeta('name', 'author', seo.author);
    
    // Open Graph
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', window.location.origin);
    
    // Twitter Card
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    if (seo.ogImage) {
      upsertMeta('property', 'og:image', seo.ogImage);
      upsertMeta('name', 'twitter:image', seo.ogImage);
    }
  }, [seo]);
}