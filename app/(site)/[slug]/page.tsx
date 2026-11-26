import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site-url';
import { notFound } from 'next/navigation';
import { getPage, getSettings, type PageKey } from '@/lib/content';
import InnerPage from '@/components/InnerPage';
import ContactPage from '@/components/ContactPage';

const keys: Record<string, PageKey> = { about: 'about', commodities: 'commodities', 'equipment-and-technologies': 'equipment', 'projects-and-services': 'projects', 'for-partners': 'partners', contact: 'contact' };
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ type?: string }> };
export const revalidate = 60;
export function generateStaticParams() { return Object.keys(keys).map(slug => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = keys[(await params).slug]; if (!key) return {};
  const p = await getPage(key); return { title: p.seoTitle, description: p.seoDescription, robots: siteUrl() ? undefined : { index: false, follow: false } };
}
export default async function Page({ params, searchParams }: Props) {
  const key = keys[(await params).slug]; if (!key) notFound();
  const [page, settings, query] = await Promise.all([getPage(key), getSettings(), searchParams]);
  if (key === 'contact') return <ContactPage page={page} settings={settings} initialType={query.type || ''} />;
  return <InnerPage page={page} settings={settings} />;
}
