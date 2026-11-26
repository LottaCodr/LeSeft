import Link from 'next/link';

export const metadata = { title: 'Content management | LeSeft Nigeria', robots: { index: false, follow: false } };
export default function StudioPage() {
  const raw = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '';
  let url = '';
  try { if (new URL(raw).protocol === 'https:') url = new URL(raw).toString(); } catch {}
  return <main style={{ maxWidth: 700, margin: '10vh auto', padding: 32, fontFamily: 'sans-serif', lineHeight: 1.7 }}><h1>LeSeft content management</h1>{url ? <p><a href={url}>Open the company-controlled Sanity Studio</a>. Sanity will require an authorised account.</p> : <p>Sanity Studio has not been deployed or connected. Set up a company-controlled Sanity project and follow the README to launch and configure the separate Studio. The preview is currently showing draft fallback content.</p>}<p><Link href="/">Return to the website</Link></p></main>;
}
