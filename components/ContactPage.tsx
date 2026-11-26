import { getDefaultPage, type PageContent, type Settings } from '@/lib/content';
import { Eyebrow, PageHero } from './Common';
import ContactForm from './ContactForm';

export default function ContactPage({ page, settings, initialType }: { page: PageContent; settings: Settings; initialType: string }) {
  const intro = page.sections.find(s => s.key === 'contact-intro') || getDefaultPage('contact').sections[0];
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email) ? settings.email : '';
  const phone = /^[+()0-9\s.-]{5,30}$/.test(settings.phone) ? settings.phone : '';
  const configured = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL && process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && process.env.NEXT_PUBLIC_SITE_URL);
  return <><PageHero hero={page.hero} label={page.navLabel} /><section className="wrap contact-layout"><div className="contact-copy"><Eyebrow>{intro.eyebrow}</Eyebrow><h2>{intro.title}</h2><p>{intro.body}</p><div className="contact-detail"><strong>OUR PRESENCE</strong><p>{settings.officeCity}</p>{settings.address ? <p>{settings.address}</p> : <p>Office address to be confirmed for publication.</p>}</div><div className="contact-detail"><strong>CONTACT DETAILS</strong>{email ? <p><a href={`mailto:${email}`}>{email}</a></p> : <p>Official email to be confirmed.</p>}{phone ? <p><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></p> : <p>Official phone number to be confirmed.</p>}</div></div><div className="contact-form-card"><h2>Send an enquiry</h2><p>Tell us a little about your opportunity. Fields marked * are required.</p><ContactForm configured={configured} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''} initialType={initialType} /></div></section></>;
}
