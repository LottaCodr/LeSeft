'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

declare global { interface Window { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean } }
export default function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const id = /^G-[A-Z0-9]+$/i.test(measurementId) ? measurementId : '';
  const [choice, setChoice] = useState<'accept' | 'reject' | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem('leseft-analytics-consent'); if (saved === 'accept' || saved === 'reject') setChoice(saved); } catch {}
    setReady(true);
    const open = () => setSettingsOpen(true);
    window.addEventListener('open-analytics-settings', open);
    return () => window.removeEventListener('open-analytics-settings', open);
  }, []);
  function choose(value: 'accept' | 'reject') {
    if (id) window[`ga-disable-${id}`] = value !== 'accept';
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: value === 'accept' ? 'granted' : 'denied' });
    try { localStorage.setItem('leseft-analytics-consent', value); } catch {}
    setChoice(value); setSettingsOpen(false);
  }
  if (!id || !ready) return null;
  return <>
    {choice === 'accept' && <Script id="google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" onLoad={() => { window[`ga-disable-${id}`] = false; window.dataLayer = window.dataLayer || []; window.gtag = (...args: unknown[]) => { window.dataLayer.push(args); }; window.gtag('js', new Date()); window.gtag('consent', 'default', { analytics_storage: 'granted' }); window.gtag('config', id, { anonymize_ip: true }); }} />}
    {(choice === null || settingsOpen) && (
      <section className="consent-banner" aria-label="Analytics consent">
        <div><strong>Your privacy choices</strong><p>With your permission, we use analytics to understand how this site is used. You can change this choice in the footer.</p></div>
        <div className="consent-actions">
          <Button variant="outline" size="sm" onClick={() => choose('reject')}>Decline</Button>
          <Button size="sm" onClick={() => choose('accept')}>Accept analytics</Button>
        </div>
      </section>
    )}
  </>;
}
