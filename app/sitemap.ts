import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-url';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];
  return ['', '/about', '/commodities', '/equipment-and-technologies', '/projects-and-services', '/for-partners', '/contact'].map(path => ({ url: `${base}${path}` }));
}
