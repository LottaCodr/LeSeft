import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Content management | LeSeft Nigeria', robots: { index: false, follow: false } };
export default function StudioPage() {
  const raw = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '';
  let url = '';
  try { if (new URL(raw).protocol === 'https:') url = new URL(raw).toString(); } catch {}
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-5 py-16">
      <div className="w-full max-w-xl rounded-lg border border-border bg-card p-8 shadow-sm sm:p-10">
        <Badge variant={url ? 'success' : 'outline'} className="mb-5">{url ? 'Studio configured' : 'Setup required'}</Badge>
        <h1 className="font-serif text-3xl leading-tight tracking-tight text-foreground">LeSeft content management</h1>
        {url
          ? <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">Open the company-controlled Sanity Studio. Sanity will require an authorised account.</p>
          : <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">Sanity Studio has not been deployed or connected. Set up a company-controlled Sanity project and follow the README to launch and configure the separate Studio. The preview is currently showing draft fallback content.</p>}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          {url && <Button asChild><a href={url} rel="noopener noreferrer">Open the Studio <ExternalLink size={16} aria-hidden="true" /></a></Button>}
          <Button asChild variant={url ? 'outline' : 'default'}><Link href="/"><ArrowLeft size={16} aria-hidden="true" /> Return to the website</Link></Button>
        </div>
      </div>
    </main>
  );
}
