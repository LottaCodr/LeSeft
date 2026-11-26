'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Settings } from '@/lib/content';

type NavItem = { pageKey: string; navLabel: string; path: string };
export default function Header({ settings, navigation }: { settings: Settings; navigation: NavItem[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);
  return <>
    <div className="top-strip"><div className="wrap top-strip-inner"><span>TRADING HOUSE <span className="top-separator">/</span> PROJECT OFFICE</span><span className="top-right">{process.env.NEXT_PUBLIC_DRAFT_MODE !== 'false' ? <>CONCEPT PREVIEW <span className="top-separator">•</span> CONTENT SUBJECT TO APPROVAL</> : <>NIGERIA <span className="top-separator">/</span> WEST AFRICA</>}</span></div></div>
    <header className="site-header">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          {settings.logoPath ? <span className="brand-upload"><Image src={settings.logoPath} alt={settings.logoAlt || ''} width={144} height={52} /></span> : <><span className="brand-symbol" aria-hidden="true"><span></span><span></span><span></span></span><span className="brand-words"><strong>{settings.brandName}</strong><small>{settings.brandQualifier}</small></span></>}
        </Link>
        <nav aria-label="Main navigation" className={`nav-links ${open ? 'is-open' : ''}`} id="main-navigation">
          {navigation.filter(item => item.pageKey !== 'contact').map(item => <Link key={item.pageKey} href={item.path} onClick={() => setOpen(false)}>{item.navLabel}</Link>)}
          <Link href="/contact" className="mobile-contact" onClick={() => setOpen(false)}>Get in touch <ArrowUpRight size={16} /></Link>
        </nav>
        <Link className="nav-cta" href="/contact">Get in touch <ArrowUpRight size={16} strokeWidth={1.8} /></Link>
        <button type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
    </header>
  </>;
}
