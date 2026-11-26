import Image from 'next/image';
import Link from 'next/link';
import type { Settings } from '@/lib/content';
import { cn } from '@/lib/utils';

export function BrandMark() {
  return (
    <>
      <span className="brand-symbol" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <span className="brand-words">
        <strong>LeSeft</strong>
        <small>NIGERIA</small>
      </span>
    </>
  );
}

/**
 * Shared wordmark for header, footer and the mobile sheet. When the company uploads
 * an approved logo in Sanity settings, it replaces the provisional symbol everywhere.
 */
export default function Brand({ settings, className }: { settings: Settings; className?: string }) {
  return (
    <Link href="/" className={cn('brand', className)} aria-label="LeSeft Nigeria, home">
      {settings.logoPath ? (
        <span className="brand-upload">
          <Image src={settings.logoPath} alt={settings.logoAlt || ''} width={144} height={52} />
        </span>
      ) : (
        <BrandMark />
      )}
    </Link>
  );
}
