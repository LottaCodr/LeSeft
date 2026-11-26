import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site-url';
import { getPage, getSettings, getDefaultPage } from '@/lib/content';
import { CtaBand, Eyebrow, TextLink } from '@/components/Common';
import { Button } from '@/components/ui/button';

export const revalidate = 60;
export async function generateMetadata(): Promise<Metadata> { const page = await getPage('home'); return { title: page.seoTitle, description: page.seoDescription, robots: siteUrl() ? undefined : { index: false, follow: false } }; }

export default async function Home() {
  const [page, settings] = await Promise.all([getPage('home'), getSettings()]);
  const section = (key: string) => page.sections.find(s => s.key === key) || getDefaultPage('home').sections.find(s => s.key === key)!;
  const intro = section('intro'), capabilities = section('capabilities'), approach = section('approach'), partners = section('partners');
  return <>
    <section className="home-hero"><Image className="hero-image" src={page.hero.imagePath} alt={page.hero.imageAlt} fill sizes="100vw" priority /><div className="hero-shade" />
      <div className="wrap hero-content"><div className="hero-main"><Eyebrow light>{page.hero.eyebrow}</Eyebrow><h1>{page.hero.heading}</h1><p>{page.hero.subtitle}</p><div className="hero-actions"><Button asChild variant="light"><Link href="/about">Discover LeSeft <ArrowUpRight size={17} aria-hidden="true" /></Link></Button><Link href="/contact" className="hero-secondary">Start a conversation <ArrowUpRight size={16} /></Link></div></div>
        <div className="hero-bottom"><span><span className="online-dot" /> BASED IN ABUJA <b>/</b> CONNECTED GLOBALLY</span><span className="hero-scroll">SCROLL TO EXPLORE <ArrowDownRight size={16}/></span></div>
      </div>
    </section>
    <div className="hero-ribbon"><div className="wrap ribbon-inner"><span>INTERNATIONAL REACH</span><i>✳</i><span>LOCAL IMPLEMENTATION</span><i>✳</i><span>SHARED OPPORTUNITY</span><span className="ribbon-last">NIGERIA &nbsp; / &nbsp; WEST AFRICA</span></div></div>
    <section className="wrap intro-section"><div><Eyebrow>{intro.eyebrow}</Eyebrow><h2>{intro.title}</h2></div><div className="intro-right"><p>{intro.body}</p><TextLink href="/about">Get to know us</TextLink></div></section>
    <section className="capabilities-section"><div className="wrap"><div className="section-heading"><div><Eyebrow>{capabilities.eyebrow}</Eyebrow><h2>{capabilities.title}</h2></div><p>{capabilities.body}</p></div><div className="capability-grid">{page.cards?.map(card => <article className="capability-card" key={card.key}><Link href={card.href} className="capability-image" aria-label={`${card.number}: Explore ${card.title}`}><Image src={card.imagePath} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /><span className="card-number" aria-hidden="true">{card.number}</span><span className="card-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span></Link><div className="capability-body"><h3>{card.title}</h3><p>{card.description}</p><TextLink href={card.href}>Explore capability</TextLink></div></article>)}</div></div></section>
    <section className="network-section"><div className="wrap network-grid"><div className="network-copy"><Eyebrow light>{approach.eyebrow}</Eyebrow><h2>{approach.title}</h2><p>{approach.body}</p><ul>{approach.items.map(item => <li key={item}><span><Check size={13}/></span>{item}</li>)}</ul><Link href="/for-partners" className="network-link">How we work with partners <ArrowUpRight size={17}/></Link></div><div className="network-art" aria-label="Illustrative connections between Abuja, West Africa, Europe and Asia"><div className="network-art-label">CONNECTED BY POSSIBILITY <ArrowUpRight size={15}/></div><svg viewBox="0 0 600 470" role="img" aria-label="Abstract network connecting Abuja, West Africa, Europe and Asia"><defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#d6e3bc" opacity=".2"/></pattern></defs><rect width="600" height="470" fill="url(#dots)"/><circle cx="300" cy="236" r="175" fill="none" stroke="#d6e3bc" strokeOpacity=".13"/><circle cx="300" cy="236" r="115" fill="none" stroke="#d6e3bc" strokeOpacity=".13"/><path d="M130 283 Q270 130 320 150 T500 190 M130 283 Q300 300 500 190 M130 283 Q185 352 260 365" fill="none" stroke="#d6e3bc" strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="4 6"/><circle cx="130" cy="283" r="7" fill="#c8dbae"/><circle cx="130" cy="283" r="15" fill="none" stroke="#c8dbae" strokeOpacity=".5"/><circle cx="320" cy="150" r="5" fill="#c8dbae"/><circle cx="500" cy="190" r="5" fill="#c8dbae"/><circle cx="260" cy="365" r="5" fill="#c8dbae"/><g fill="#eff2e7" fontFamily="DM Sans, sans-serif" fontSize="11" letterSpacing="2"><text x="72" y="317">ABUJA</text><text x="288" y="128">EUROPE</text><text x="502" y="174">ASIA</text><text x="242" y="395">WEST AFRICA</text></g></svg><div className="network-art-foot"><span>ONE WORLD. MANY OPPORTUNITIES.</span><span>01 / 04</span></div></div></div></section>
    <section className="wrap partners-section"><div className="partners-intro"><Eyebrow>{partners.eyebrow}</Eyebrow><h2>{partners.title}</h2><p>{partners.body}</p><TextLink href="/for-partners">Explore partnerships</TextLink></div><div className="partner-list">{partners.items.map((item, index) => <Link href="/for-partners" className="partner-row" key={item}><span className="partner-index">0{index + 1}</span><span>{item}</span><ArrowRight size={19}/></Link>)}</div></section>
    <CtaBand settings={settings} />
  </>;
}
