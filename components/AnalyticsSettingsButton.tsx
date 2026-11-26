'use client';
export default function AnalyticsSettingsButton() {
  return <button type="button" className="footer-text-button" onClick={() => window.dispatchEvent(new Event('open-analytics-settings'))}>Analytics choices</button>;
}
