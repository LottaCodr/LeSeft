import { defineArrayMember, defineField, defineType } from 'sanity';

const contentImage = defineType({
  name: 'contentImage', title: 'Image', type: 'image', options: { hotspot: true },
  fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: Rule => Rule.required().warning('Describe this image for accessibility.') })]
});
const contentSection = defineType({
  name: 'contentSection', title: 'Content section', type: 'object',
  fields: [
    defineField({ name: 'key', title: 'Section key', type: 'string', description: 'Keep the existing key unchanged on Home; it controls the layout.', validation: Rule => Rule.required() }),
    defineField({ name: 'eyebrow', title: 'Small label', type: 'string' }),
    defineField({ name: 'title', title: 'Heading', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'body', title: 'Text', type: 'text', rows: 4 }),
    defineField({ name: 'items', title: 'List items', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'image', title: 'Section image (optional)', type: 'contentImage' })
  ],
  preview: { select: { title: 'title', subtitle: 'eyebrow' } }
});
const capabilityCard = defineType({
  name: 'capabilityCard', title: 'Capability card', type: 'object',
  fields: [
    defineField({ name: 'key', title: 'Card key', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'number', title: 'Number', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'href', title: 'Internal link', type: 'string', description: 'Example: /commodities' }),
    defineField({ name: 'image', title: 'Image', type: 'contentImage' })
  ], preview: { select: { title: 'title', subtitle: 'number' } }
});
const page = defineType({
  name: 'page', title: 'Website page', type: 'document',
  fields: [
    defineField({ name: 'pageKey', title: 'Page', type: 'string', options: { list: [
      { title: 'Home', value: 'home' }, { title: 'About', value: 'about' }, { title: 'Commodities', value: 'commodities' },
      { title: 'Equipment & technologies', value: 'equipment' }, { title: 'Projects & services', value: 'projects' },
      { title: 'For partners', value: 'partners' }, { title: 'Contact', value: 'contact' }
    ] }, validation: Rule => Rule.required(), description: 'One document per page. Do not change this after setup.' }),
    defineField({ name: 'seoTitle', title: 'Search title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'Search description', type: 'text', rows: 2 }),
    defineField({ name: 'hero', title: 'Hero', type: 'object', fields: [
      defineField({ name: 'eyebrow', title: 'Small label', type: 'string' }),
      defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 2 }),
      defineField({ name: 'subtitle', title: 'Introduction', type: 'text', rows: 3 }),
      defineField({ name: 'image', title: 'Hero image', type: 'contentImage' })
    ] }),
    defineField({ name: 'sections', title: 'Page sections', type: 'array', of: [defineArrayMember({ type: 'contentSection' })] }),
    defineField({ name: 'cards', title: 'Home capability cards', type: 'array', description: 'Used on the Home page only.', of: [defineArrayMember({ type: 'capabilityCard' })] })
  ], preview: { select: { title: 'pageKey', subtitle: 'seoTitle' } }
});
const siteSettings = defineType({
  name: 'siteSettings', title: 'Company information & settings', type: 'document',
  fields: [
    defineField({ name: 'brandName', title: 'Brand name', type: 'string' }),
    defineField({ name: 'brandQualifier', title: 'Brand qualifier', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'logo', title: 'Approved company logo', type: 'contentImage' }),
    defineField({ name: 'officeCity', title: 'Office city', type: 'string' }),
    defineField({ name: 'address', title: 'Approved public office address', type: 'text', rows: 2 }),
    defineField({ name: 'email', title: 'Official business email', type: 'string', validation: Rule => Rule.email() }),
    defineField({ name: 'phone', title: 'Official business telephone', type: 'string' }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url', validation: Rule => Rule.uri({ scheme: ['https'] }) }),
    defineField({ name: 'footerSummary', title: 'Footer description', type: 'text', rows: 3 }),
    defineField({ name: 'ctaTitle', title: 'Call-to-action title', type: 'string' }),
    defineField({ name: 'ctaBody', title: 'Call-to-action description', type: 'text', rows: 3 })
  ], preview: { prepare: () => ({ title: 'Company information & settings' }) }
});
export const schemaTypes = [contentImage, contentSection, capabilityCard, siteSettings, page];
