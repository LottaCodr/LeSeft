import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-url';
export default function robots(): MetadataRoute.Robots {
  const url = siteUrl();
  return url ? { rules: { userAgent: '*', allow: '/', disallow: ['/studio/', '/api/'] }, sitemap: `${url}/sitemap.xml` } : { rules: { userAgent: '*', disallow: '/' } };
}
