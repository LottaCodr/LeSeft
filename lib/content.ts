import 'server-only';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { cache } from 'react';
import defaults from '@/content/defaults.json';

export type PageKey = 'home' | 'about' | 'commodities' | 'equipment' | 'projects' | 'partners' | 'contact';
export type ContentImage = { _type?: string; asset?: { _ref?: string }; alt?: string };
export type Hero = { eyebrow: string; heading: string; subtitle: string; imagePath: string; imageAlt: string; image?: ContentImage };
export type Section = { key: string; eyebrow: string; title: string; body: string; items: string[]; imagePath?: string; imageAlt?: string; image?: ContentImage };
export type Card = { key: string; number: string; title: string; description: string; href: string; imagePath: string; imageAlt: string; image?: ContentImage };
export type PageContent = { pageKey: PageKey; navLabel: string; path: string; seoTitle: string; seoDescription: string; hero: Hero; sections: Section[]; cards?: Card[] };
export type Settings = typeof defaults.settings & { logoPath?: string; logoAlt?: string };

type CmsPage = { seoTitle?: string; seoDescription?: string; hero?: Partial<Hero>; sections?: Partial<Section>[]; cards?: Partial<Card>[] };
type CmsSettings = Partial<Settings> & { logo?: ContentImage };
const pages = defaults.pages as PageContent[];
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const validIdentifier = (value?: string) => !!value && /^[a-z0-9_-]+$/i.test(value);
const client = validIdentifier(projectId) && validIdentifier(dataset) ? createClient({
  projectId: projectId!, dataset, apiVersion: '2025-02-19',
  useCdn: !process.env.SANITY_API_READ_TOKEN, token: process.env.SANITY_API_READ_TOKEN || undefined
}) : null;

function imagePath(image?: ContentImage): string | undefined {
  if (!client || !image?.asset?._ref) return undefined;
  try { return imageUrlBuilder(client).image(image as any).width(1800).quality(82).auto('format').url(); }
  catch { return undefined; }
}
function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}
function strings(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && !!v.trim()) : fallback;
}
function safeInternalPath(value: unknown, fallback: string): string {
  return typeof value === 'string' && /^\/(?!\/)[a-z0-9\-/]*$/i.test(value) ? value : fallback;
}
function mergeSection(value: Partial<Section>, fallback?: Section): Section {
  const f = fallback || { key: '', eyebrow: '', title: '', body: '', items: [] };
  return {
    key: text(value.key, f.key), eyebrow: text(value.eyebrow, f.eyebrow), title: text(value.title, f.title),
    body: text(value.body, f.body), items: strings(value.items, f.items),
    imagePath: imagePath(value.image) || f.imagePath,
    imageAlt: text(value.image?.alt, f.imageAlt || '')
  };
}
function mergeCard(value: Partial<Card>, fallback?: Card): Card {
  const f = fallback || { key: '', number: '', title: '', description: '', href: '/contact', imagePath: '/images/hero-africa.jpg', imageAlt: 'Illustrative AI-generated image' };
  return {
    key: text(value.key, f.key), number: text(value.number, f.number), title: text(value.title, f.title),
    description: text(value.description, f.description), href: safeInternalPath(value.href, f.href),
    imagePath: imagePath(value.image) || f.imagePath, imageAlt: text(value.image?.alt, f.imageAlt)
  };
}

export const getPage = cache(async (key: PageKey): Promise<PageContent> => {
  const base = pages.find(p => p.pageKey === key);
  if (!base) throw new Error(`Unknown page ${key}`);
  if (!client) return base;
  try {
    const doc = await client.fetch<CmsPage | null>(`*[_type == "page" && pageKey == $key][0]{seoTitle,seoDescription,hero{eyebrow,heading,subtitle,image},sections[]{key,eyebrow,title,body,items,image},cards[]{key,number,title,description,href,image}}`, { key }, { next: { revalidate: 60 } });
    if (!doc) return base;
    const h = doc.hero || {};
    return {
      ...base, seoTitle: text(doc.seoTitle, base.seoTitle), seoDescription: text(doc.seoDescription, base.seoDescription),
      hero: { eyebrow: text(h.eyebrow, base.hero.eyebrow), heading: text(h.heading, base.hero.heading), subtitle: text(h.subtitle, base.hero.subtitle), imagePath: imagePath(h.image) || base.hero.imagePath, imageAlt: text(h.image?.alt, base.hero.imageAlt) },
      sections: doc.sections?.length ? doc.sections.map(s => mergeSection(s, base.sections.find(b => b.key === s.key))) : base.sections,
      cards: doc.cards?.length ? doc.cards.map(c => mergeCard(c, base.cards?.find(b => b.key === c.key))) : base.cards
    };
  } catch (error) { console.error('Sanity page fetch failed; using draft content:', error); return base; }
});

export const getSettings = cache(async (): Promise<Settings> => {
  const base = defaults.settings;
  if (!client) return base;
  try {
    const doc = await client.fetch<CmsSettings | null>(`*[_type == "siteSettings"][0]{brandName,brandQualifier,tagline,officeCity,address,email,phone,linkedin,footerSummary,ctaTitle,ctaBody,logo}`, {}, { next: { revalidate: 60 } });
    if (!doc) return base;
    const result: Settings = { ...base };
    for (const key of Object.keys(base) as (keyof typeof base)[]) {
      result[key] = text(doc[key], base[key]);
    }
    result.logoPath = imagePath(doc.logo);
    result.logoAlt = doc.logo?.alt || `${result.brandName} ${result.brandQualifier}`;
    return result;
  } catch (error) { console.error('Sanity settings fetch failed; using draft content:', error); return base; }
});

export const navigation = pages.map(({ pageKey, navLabel, path }) => ({ pageKey, navLabel, path }));
export const getDefaultPage = (key: PageKey) => pages.find(p => p.pageKey === key)!;
