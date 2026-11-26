import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

// Standalone, separately deployed Sanity Studio. Set the SANITY_STUDIO_* values
// before running `npm run studio:dev` or `npm run studio:deploy`.
export default defineConfig({
  name: 'leseft-nigeria', title: 'LeSeft Nigeria',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'notconfigured',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({ structure: S => S.list().title('Website content').items([
    S.listItem().title('Company information').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    S.listItem().title('Pages').child(S.documentTypeList('page').title('Pages'))
  ]) })],
  schema: { types: schemaTypes }
});
