# Prototype QA report

## Completed

- TypeScript typecheck: passed.
- Next.js production build: passed.
- Chromium responsive smoke test: all seven pages returned HTTP 200 at 1440, 768 and 390 pixel widths, with one H1 each, no detected horizontal overflow, no broken images and no page-level JavaScript errors.
- Automated axe-core WCAG 2 A/AA and 2.1 A/AA checks: no violations detected on all seven routes at desktop and mobile sizes. This does not replace manual accessibility testing.
- Mobile navigation to Commodities: passed.
- Contact category query prefill: passed for `Project & equipment` and `Commodity` during development.
- Unconfigured contact form: visibly disabled; the endpoint returned HTTP 503, not a false success.
- Enquiry endpoint: isolated mocked tests passed for missing config, origin, body size, rate limit, provider failure, validation, honeypot, challenge failure/hostname and a valid mocked send. No real message was sent.
- `/studio`: shows setup notice when no Studio URL is configured.
- `npm audit --omit=dev` reported zero known production dependency advisories on 26 November 2026. This is point-in-time only, not a security audit.
- Sanity CLI `--help` and schema types compiled locally. The live Studio and Content Lake were not tested because no company project/credentials were supplied.
- Figma plugin: JavaScript syntax checked and logic exercised against a mock API, generating 15 top-level frames. It has not been run in Figma desktop.


## Design system refactor verification (26 November 2026)

- Stack updated to Tailwind CSS v4 (CSS-first), shadcn/ui-style owned components (`components/ui/`), Radix primitives, semantic tokens with surface/foreground pairs and a `DESIGN_SYSTEM.md` research reference.
- TypeScript typecheck: passed. Next.js production build: passed.
- All seven routes returned HTTP 200 from the production server; the contact form renders the Radix-powered category select with a hidden native select (`name="category"`) that works with `FormData` and the endpoint's zod validation.
- Compiled CSS verified to contain the Tailwind utilities used by the new components, the design tokens and the sheet/overlay animations.
- Mocked enquiry endpoint suite: all 13 cases passed; no real provider, email or CMS was contacted.
- Repository-wide scan confirms zero em dashes and zero en dashes across code, content, docs and the Figma plugin (template regenerated `figma-import/code.js`).
- The pre-refactor Chromium responsive smoke test and axe-core WCAG checks were **not** re-run against the refactored component layer; they are required before any launch decision. Manual keyboard and screen-reader testing of the Sheet navigation, Radix Select, focus rings and `aria-current` state is also required.

## Required before launch

- Connect and test the company-controlled Sanity project, Studio, staff permissions, public/private dataset configuration and cache revalidation with a real edit.
- Connect and test Resend, Cloudflare Turnstile, Upstash and the real mailbox; test success and failure modes. Configure trusted forwarded headers at the chosen host.
- Verify domain/DNS and HTTPS, privacy notice, legal/analytics consent, backups and restore, monitoring and production security.
- Obtain official brand assets, approved public contact details and copy; replace all AI-generated illustrative images.
- Re-run the Chromium responsive smoke test and automated axe-core WCAG checks against the refactored components; perform full accessibility, keyboard and screen-reader checks (especially the Sheet navigation and Radix Select), cross-browser/device testing, performance measurement and user acceptance, then conduct CMS training and documented handover.
