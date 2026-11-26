'use client';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

declare global { interface Window { turnstile?: { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id: string) => void } } }
const types = ['General', 'Partnership', 'Commodity', 'Project & equipment'] as const;
export default function ContactForm({ configured, siteKey, initialType }: { configured: boolean; siteKey: string; initialType: string }) {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const slot = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  useEffect(() => {
    if (!configured || !siteKey) return;
    let cancelled = false;
    const mount = () => {
      if (!cancelled && slot.current && window.turnstile && !widget.current) widget.current = window.turnstile.render(slot.current, { sitekey: siteKey, callback: (value: string) => setToken(value), 'expired-callback': () => setToken(''), 'error-callback': () => { setToken(''); setStatus({ text: 'Security check could not load. Please try again later.', error: true }); } });
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-leseft-turnstile]');
    if (window.turnstile) mount();
    else {
      if (!script) { script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.defer = true; script.dataset.leseftTurnstile = 'true'; document.head.appendChild(script); }
      script.addEventListener('load', mount);
      script.addEventListener('error', () => setStatus({ text: 'Security check could not load. Please try again later.', error: true }), { once: true });
    }
    return () => { cancelled = true; script?.removeEventListener('load', mount); if (widget.current && window.turnstile) { window.turnstile.remove(widget.current); widget.current = null; } };
  }, [configured, siteKey]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || !token) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    setBusy(true); setStatus(null);
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, turnstileToken: token }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setStatus({ text: result.error || 'Your enquiry could not be sent. Please try again later.', error: true }); }
      else { form.reset(); setStatus({ text: 'Thank you. Your enquiry has been sent.', error: false }); }
    } catch { setStatus({ text: 'Your enquiry could not be sent. Please check your connection and try again.', error: true }); }
    finally { if (widget.current && window.turnstile) window.turnstile.reset(widget.current); setToken(''); setBusy(false); }
  }
  return <>
    {!configured && <p className="demo-notice"><strong>Preview only:</strong> Enquiry delivery and spam protection have not been configured. This form cannot send messages yet.</p>}
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field"><label htmlFor="name">Full name *</label><input id="name" name="name" autoComplete="name" maxLength={100} required /></div>
        <div className="field"><label htmlFor="organisation">Organisation <span>(optional)</span></label><input id="organisation" name="organisation" autoComplete="organization" maxLength={120} /></div>
        <div className="field"><label htmlFor="email">Email address *</label><input id="email" type="email" name="email" autoComplete="email" maxLength={254} required /></div>
        <div className="field"><label htmlFor="phone">Phone number <span>(optional)</span></label><input id="phone" type="tel" name="phone" autoComplete="tel" maxLength={40} /></div>
        <div className="field full"><label htmlFor="category">What is your enquiry about? *</label><select id="category" name="category" defaultValue={types.includes(initialType as typeof types[number]) ? initialType : 'General'} required>{types.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
        <div className="field full"><label htmlFor="subject">Subject <span>(optional)</span></label><input id="subject" name="subject" maxLength={150} /></div>
        <div className="field full"><label htmlFor="message">Your message *</label><textarea id="message" name="message" minLength={10} maxLength={5000} placeholder="Tell us about the opportunity or project…" required /></div>
        <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      </div>
      {configured && <div className="turnstile-slot" ref={slot} aria-label="Spam protection" />}
      <p className="form-footnote">Please do not include sensitive personal or financial information. Your details are used to respond to your enquiry.</p>
      <button className="btn form-button" disabled={!configured || !token || busy} type="submit">{busy ? 'Sending…' : 'Send enquiry'} <ArrowUpRight size={17}/></button>
      {status && <p className={`form-status ${status.error ? 'error' : ''}`} role="status">{status.text}</p>}
    </form>
  </>;
}
