# LeSeft Nigeria — corporate website concept

A brief-aligned, seven-page Next.js concept with Sanity content schemas, responsive layouts, a secure-form integration scaffold, and a separate editable Figma import plugin. This is a **proposal-stage prototype**, not a completed or approved production website.

## Current status — read before sharing or launch

- **Available now:** Seven responsive pages, draft copy, navigation, enquiry form UI, SEO metadata, image optimisation, accessibility basics, Sanity page/settings schemas, a separately deployable Sanity Studio, CMS read integration with draft fallback, optional consent-gated analytics, and server-side enquiry-delivery integration code.
- **Not connected or verified:** No company Sanity project, hosted Studio, email delivery, Turnstile or Upstash rate limiter is configured. In the preview, the form is disabled and `/api/enquiry` returns 503 rather than pretending to send. The Sanity fetch path, content editing and live email/spam services require real company-controlled accounts and end-to-end tests.
- **Not an official identity:** The wordmark, colours and copy are provisional. All four photos are AI-generated illustrations; they are not photographs of LeSeft offices, people, projects or locations. Obtain LeSeft's approved brand assets, copy, contact details and imagery before launch. Replace all fallback images, including homepage cards and hero images.
- **Not yet launched:** No domain, hosting, SSL, user accounts, backups, analytics approval or staff training have been set up. Cross-browser, accessibility, security and performance acceptance testing still requires completion in the chosen production environment.

## Pages

| Page | Route |
| --- | --- |
| Home | `/` |
| About us | `/about` |
| Commodities | `/commodities` |
| Equipment & technologies | `/equipment-and-technologies` |
| Projects & services | `/projects-and-services` |
| For partners | `/for-partners` |
| Contact | `/contact` |

`/studio` is a lightweight notice/link to the **separately hosted** Sanity Studio, not an embedded or live Studio until configured. Visitors cannot submit the contact form without the required services.

## Run locally

Use Node.js **22.12 or newer** and npm. Some transitive Sanity dependencies require Node 22. In a terminal:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Next.js. With no configuration, the site shows the draft fallback content from `content/defaults.json`. `npm run typecheck` checks types; `npm run test:enquiry:mock` exercises the form endpoint with mocked external services; `npm run build` creates an optimised build; `npm run start` serves that build. The app listens on `0.0.0.0` for deployment/preview compatibility.

## Architecture

- **Frontend:** Next.js App Router, React, TypeScript; locally bundled DM Sans and DM Serif Display fonts. No browser-facing call to localhost or hard-coded API host.
- **CMS:** Sanity Content Lake, a server-side read client in `lib/content.ts`, a page/sections/cards schema and site-settings schema in `sanity/schemaTypes`. Published content is requested with a 60-second revalidation setting. Missing fields/content use the local draft fallback. The authoring Studio is deployed separately using `sanity.config.ts`; staff authenticate with Sanity and receive permissions from the company-owned organisation. Sanity plan restrictions apply.
- **Enquiries:** The Next.js endpoint validates input and request origin, bounds request size, checks a honeypot, applies a Redis-backed rate limit, validates Cloudflare Turnstile server-side against the canonical hostname, and sends a plain-text email via Resend. It fails closed if configuration or a security/delivery service is missing. No message is stored by the app itself; the email service/provider and receiving mailbox may retain data. Rate-limit keys are HMACs of the forwarded IP, but remain pseudonymous personal data in some jurisdictions.
- **Analytics:** Disabled by default. Setting a valid Google Analytics 4 measurement ID enables an opt-in prompt; the tag loads only after acceptance. Review the consent and privacy implementation with LeSeft's legal/privacy team before enabling it.
- **SEO:** Page metadata, sitemap and robots route. Until a valid HTTPS `NEXT_PUBLIC_SITE_URL` is set at build time, pages are marked noindex and robots disallows crawling. Set the final HTTPS origin only after content approval.

## Connect a company-controlled Sanity project

1. Have LeSeft create/own the Sanity organisation and project and the `production` dataset. Invite the developer and designated staff with the least privileges required by the company's Sanity plan. Do not share passwords or API tokens in chat.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_STUDIO_PROJECT_ID` to the **same** real project ID, and both dataset values to the same dataset. These are public identifiers, not write secrets. A public dataset is the simplest read setup; for a private dataset set the server-only `SANITY_API_READ_TOKEN` and review asset access and caching.
3. Sign in to the Sanity CLI using the company-authorised account (`npx sanity login`). Create a temporary editor-scoped API token, put it in `SANITY_API_WRITE_TOKEN` in `.env.local`, and run `npm run seed`. This creates settings and seven page documents **only if they do not already exist**; it does not overwrite them and does not upload the illustrative images. Remove/revoke the temporary write token afterwards. The initial seeded text is draft material, not approved copy.
4. Run `npm run studio:dev` to use the standalone Studio locally, or `npm run studio:deploy` to deploy it under a company-controlled Sanity Studio hostname. Configure the allowed Studio origin(s) in Sanity's API/CORS settings and grant only the access needed. The website's server-side reads do not require exposing a write token.
5. Set `NEXT_PUBLIC_SANITY_STUDIO_URL` to the deployed Studio's HTTPS URL; `/studio` will link to it. Publish the seven pages and settings in Studio. Update copy, SEO and images, and add the approved company logo, public contact details and any approved social URL. Keep the four Home section keys (`intro`, `capabilities`, `approach`, `partners`) unchanged; they determine its layout.
6. Set all `NEXT_PUBLIC_*` variables in the website hosting provider **before building** and redeploy. Verify that a published Studio edit appears on the site after cache revalidation. Check image alt text and that no illustrative fallback images remain. For company-wide control, keep the repository, Sanity project and hosting under LeSeft's administrators from the start.

See `CMS_GUIDE.md` for the staff editing checklist and backup guidance.

## Enable actual enquiry delivery

Use company-controlled service accounts and configure the following in the hosting environment:

- `NEXT_PUBLIC_SITE_URL`: the exact canonical HTTPS origin, such as `https://www.example.com` (no path, query or trailing content). Set this only for an approved site because it enables indexing in `robots.txt`.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and server-only `TURNSTILE_SECRET_KEY`: a Cloudflare Turnstile widget configured for that exact hostname.
- `UPSTASH_REDIS_REST_URL` and server-only `UPSTASH_REDIS_REST_TOKEN`: an Upstash Redis instance for the 5-per-hour-per-IP rolling limiter.
- Server-only `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (a verified sender/domain accepted by Resend) and `CONTACT_TO_EMAIL` (the approved LeSeft inbox).

Rebuild/redeploy after setting public variables. Configure the hosting proxy to **strip client-supplied forwarding headers and set trusted client-IP headers**, and enforce sensible request-size limits at the edge. The application also checks the Origin header when present; these checks are not a substitute for a security review, WAF or proper host configuration. The Turnstile response's hostname must match `NEXT_PUBLIC_SITE_URL` exactly, so separate staging hostnames need their own configuration. Test a real enquiry, bad input, a rejected challenge, rate limiting, provider failure, mailbox routing and confirmation on the deployed HTTPS host before enabling public use. The preview has not run these live tests.

## Deployment, ownership and handover checklist

1. Obtain written approval of identity, content, images, privacy notice, exact scope and the target domain.
2. Transfer/commit source and the Figma file to LeSeft-controlled repositories and workspaces. Keep company administrators in control of GitHub, design, domain/DNS, hosting, Sanity and third-party services.
3. Configure hosting, DNS and HTTPS/SSL; restrict secrets to server-side environment variables. `NEXT_PUBLIC_*` values are public. Never commit `.env.local` or tokens.
4. Configure Sanity, authorised staff, approved forms and agreed third-party services. Confirm browser support, mobile use, keyboard navigation, screen-reader labels, page titles, descriptions, canonical domain, accessibility, speed and error states.
5. Set a backup schedule for Sanity datasets/assets, the source repository and configuration; store backups in company-controlled storage and **test restoration**. Establish monitoring, dependency updates, security-patch and incident procedures.
6. Run CMS training with authorised staff, provide this guide, agree post-launch defect support and optional maintenance terms, and complete formal acceptance and handover.

Domain, hosting, Sanity paid tiers, transactional email, rate-limit/spam services, analytics and licensed assets may have separate recurring charges. Obtain current quotes directly from providers; no recurring costs are included in this prototype.

## Design files

`figma-import/` is a local development plugin that creates seven desktop and seven mobile **editable native frames** and a draft design-system board when run inside a Figma Design file. The connected Figma API could not create those frames directly, so they do not exist in Figma until a person imports and runs the plugin in the Figma desktop app. See `figma-import/README.md`. Frames are static designs, not a linked interactive Figma prototype. Use a company-controlled file and replace the illustrative assets after approval.

## Tests performed

The production build and TypeScript check passed. `npm audit --omit=dev` reported zero known production dependency advisories on 26 November 2026; repeat the audit before launch. Seven page routes were checked in Chromium at desktop (1440), tablet (768) and mobile (390) widths; no horizontal overflow, missing images or JavaScript page errors were observed. Automated axe-core WCAG 2 A/AA and 2.1 A/AA checks reported no violations on the seven routes at desktop and mobile sizes. Mobile navigation, contact-category prefill, disabled unconfigured form and the 503 unconfigured API response were checked. Schema types were compiled locally. This is not a comprehensive accessibility, cross-browser, security, Sanity integration or email-delivery audit.

### Dependency overrides

`package.json` temporarily overrides vulnerable transitive CLI dependencies (`js-yaml`, `smol-toml`, and `@oclif/core`'s `minimatch`). The minimatch override crosses a major-version boundary; the Sanity CLI help command was smoke-tested, but the Studio build/deploy flow must be tested against a real project. Revisit and remove these overrides when upstream dependencies provide patched compatible versions.
