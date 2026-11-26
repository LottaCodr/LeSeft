import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import type { PageContent, Settings } from '@/lib/content';
import { CtaBand, Eyebrow, PageHero } from './Common';

export default function InnerPage({ page, settings }: { page: PageContent; settings: Settings }) {
  return <><PageHero hero={page.hero} label={page.navLabel} /><div className="wrap content-sections">
    {page.sections.map((section, i) => <section className="content-section" key={section.key || i}>
      <div className="content-section-left"><Eyebrow>{section.eyebrow || `0${i + 1} / EXPLORE`}</Eyebrow><h2>{section.title}</h2></div>
      <div className="content-section-right"><p>{section.body}</p>{section.items.length > 0 && <ul className="feature-list">{section.items.map((item, index) => <li key={`${item}-${index}`}><Plus size={15} aria-hidden="true" /><span>{item}</span></li>)}</ul>}
        {section.imagePath && <div className="section-image"><Image src={section.imagePath} alt={section.imageAlt || ''} fill sizes="(max-width: 800px) 90vw, 50vw" /></div>}
        <Link href={`/contact?type=${page.pageKey === 'commodities' ? 'Commodity' : page.pageKey === 'partners' ? 'Partnership' : 'Project%20%26%20equipment'}`} className="inline-link">Discuss this with us <ArrowUpRight size={16}/></Link>
      </div>
    </section>)}
  </div><CtaBand settings={settings} /></>;
}
