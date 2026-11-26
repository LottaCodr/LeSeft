import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Settings } from '@/lib/content';
import AnalyticsSettingsButton from './AnalyticsSettingsButton';

const safeLinkedIn = (s: string) => { try { const u = new URL(s); return u.protocol === 'https:' ? u.toString() : ''; } catch { return ''; } };
export default function Footer({ settings }: { settings: Settings }) {
  const linkedin = safeLinkedIn(settings.linkedin);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email) ? settings.email : '';
  const phone = /^[+()0-9\s.-]{5,30}$/.test(settings.phone) ? settings.phone : '';
  return <footer className="footer">
    <div className="wrap footer-top">
      <div className="footer-brand-col">
        <Link href="/" className="brand footer-brand">
          {settings.logoPath ? <span className="brand-upload"><Image src={settings.logoPath} alt={settings.logoAlt || ''} width={144} height={52} /></span> : <><span className="brand-symbol" aria-hidden="true"><span></span><span></span><span></span></span><span className="brand-words"><strong>{settings.brandName}</strong><small>{settings.brandQualifier}</small></span></>}
        </Link>
        <p>{settings.footerSummary}</p>
        <span className="footer-location"><span className="online-dot" /> ABUJA, NIGERIA <span className="footer-slash">/</span> CONNECTED GLOBALLY</span>
      </div>
      <div className="footer-col"><h3>EXPLORE</h3><Link href="/about">About us</Link><Link href="/commodities">Commodities</Link><Link href="/equipment-and-technologies">Equipment & technologies</Link><Link href="/projects-and-services">Projects & services</Link></div>
      <div className="footer-col"><h3>CONNECT</h3><Link href="/for-partners">For partners</Link><Link href="/contact">Contact us</Link>{linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={13}/></a>}{/^G-[A-Z0-9]+$/i.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '') && <AnalyticsSettingsButton />}</div>
      <div className="footer-col"><h3>FIND US</h3><span>{settings.officeCity}</span>{settings.address && <span>{settings.address}</span>}{email ? <a href={`mailto:${email}`}>{email}</a> : <span className="muted">Email to be confirmed</span>}{phone ? <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a> : <span className="muted">Phone to be confirmed</span>}</div>
    </div>
    <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} {settings.brandName} {settings.brandQualifier}. All rights reserved.</span><span>TRADING HOUSE &nbsp; / &nbsp; PROJECT OFFICE</span></div>
  </footer>;
}
