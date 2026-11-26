export function siteUrl(): string | undefined {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || '');
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return undefined;
    return url.origin;
  } catch { return undefined; }
}
