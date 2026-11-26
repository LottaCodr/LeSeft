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

## Required before launch

- Connect and test the company-controlled Sanity project, Studio, staff permissions, public/private dataset configuration and cache revalidation with a real edit.
- Connect and test Resend, Cloudflare Turnstile, Upstash and the real mailbox; test success and failure modes. Configure trusted forwarded headers at the chosen host.
- Verify domain/DNS and HTTPS, privacy notice, legal/analytics consent, backups and restore, monitoring and production security.
- Obtain official brand assets, approved public contact details and copy; replace all AI-generated illustrative images.
- Perform full accessibility, keyboard and screen-reader checks, cross-browser/device testing, performance measurement and user acceptance, then conduct CMS training and documented handover.
