import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import type { Hero, Settings } from '@/lib/content';
import { Button } from '@/components/ui/button';

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-line" />{children}</p>;
}
export function PageHero({ hero, label }: { hero: Hero; label: string }) {
  return <section className="page-hero"><div className="wrap page-hero-grid"><div className="page-hero-copy"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">HOME</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">{label.toUpperCase()}</span></nav><Eyebrow>{hero.eyebrow}</Eyebrow><h1>{hero.heading}</h1><p className="page-hero-intro">{hero.subtitle}</p><div className="page-hero-index"><span className="circle-arrow"><ArrowRight size={17} aria-hidden="true" /></span><span>LESEFT NIGERIA <b>/</b> OUR WORLD</span></div></div><div className="page-hero-image"><Image src={hero.imagePath} alt={hero.imageAlt} fill sizes="(max-width: 800px) 100vw, 50vw" priority /><span className="image-corner">LESEFT <span aria-hidden="true">↗</span></span></div></div></section>;
}
export function CtaBand({ settings }: { settings: Settings }) {
  return <section className="cta-band"><div className="wrap cta-grid"><div><Eyebrow light>LET'S CONNECT</Eyebrow><h2>{settings.ctaTitle}</h2><p>{settings.ctaBody}</p></div><Button asChild className="shrink-0"><Link href="/contact">Start a conversation <ArrowUpRight size={17} aria-hidden="true" /></Link></Button></div></section>;
}
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="text-link" href={href}>{children}<ArrowUpRight size={16} aria-hidden="true" /></Link>;
}
