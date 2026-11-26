// Creates draft copy in the configured company's dataset without overwriting existing documents.
// Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and a temporary SANITY_API_WRITE_TOKEN.
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Load .env.local for local use without adding dotenv as a dependency.
try {
  for (const line of readFileSync(resolve('.env.local'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch {}
const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, SANITY_API_WRITE_TOKEN: token } = process.env;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
if (!projectId || !token) { console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.'); process.exit(1); }
const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false });
const defaults = JSON.parse(readFileSync(new URL('../content/defaults.json', import.meta.url), 'utf8'));
const settings = { _id: 'siteSettings', _type: 'siteSettings', ...defaults.settings };
const docs = defaults.pages.map(p => ({
  _id: `page-${p.pageKey}`, _type: 'page', pageKey: p.pageKey, seoTitle: p.seoTitle, seoDescription: p.seoDescription,
  hero: { eyebrow: p.hero.eyebrow, heading: p.hero.heading, subtitle: p.hero.subtitle },
  sections: p.sections.map(s => ({ _key: s.key, _type: 'contentSection', key: s.key, eyebrow: s.eyebrow, title: s.title, body: s.body, items: s.items })),
  ...(p.cards ? { cards: p.cards.map(c => ({ _key: c.key, _type: 'capabilityCard', key: c.key, number: c.number, title: c.title, description: c.description, href: c.href })) } : {})
}));
for (const doc of [settings, ...docs]) {
  await client.createIfNotExists(doc);
  console.log(`Created or already exists: ${doc._id}`);
}
console.log('Done. Draft copy is seeded; upload approved images in Studio and review all copy. Remove the temporary write token afterwards.');
