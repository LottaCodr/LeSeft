import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import type { Hero, Settings } from '@/lib/content';

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-line" />{children}</p>;
}
export function PageHero({ hero, label }: { hero: Hero; label: string }) {
  return <section className="page-hero"><div className="wrap page-hero-grid"><div className="page-hero-copy"><div className="breadcrumb"><Link href="/">HOME</Link><ChevronRight size={12} /><span>{label.toUpperCase()}</span></div><Eyebrow>{hero.eyebrow}</Eyebrow><h1>{hero.heading}</h1><p className="page-hero-intro">{hero.subtitle}</p><div className="page-hero-index"><span className="circle-arrow"><ArrowRight size={17}/></span><span>LESEFT NIGERIA <b>/</b> OUR WORLD</span></div></div><div className="page-hero-image"><Image src={hero.imagePath} alt={hero.imageAlt} fill sizes="(max-width: 800px) 100vw, 50vw" priority /><span className="image-corner">LESEFT <span>↗</span></span></div></div></section>;
}
export function CtaBand({ settings }: { settings: Settings }) {
  return <section className="cta-band"><div className="wrap cta-grid"><div><Eyebrow light>LET'S CONNECT</Eyebrow><h2>{settings.ctaTitle}</h2><p>{settings.ctaBody}</p></div><Link href="/contact" className="btn btn-light">Start a conversation <ArrowUpRight size={17} /></Link></div></section>;
}
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="text-link" href={href}>{children}<ArrowUpRight size={16} /></Link>;
}
