import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnalyticsConsent from '@/components/AnalyticsConsent';
import { getSettings, navigation } from '@/lib/content';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return <><a className="skip-link" href="#main">Skip to content</a><Header settings={settings} navigation={navigation} /><main id="main">{children}</main><Footer settings={settings} /><AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} /></>;
}
