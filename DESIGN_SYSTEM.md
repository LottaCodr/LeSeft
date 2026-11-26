# LeSeft Nigeria design system

This document records (1) the deep research into Figma Community design kits and industry design engineering principles that informed this update, and (2) how those findings are applied in this codebase. It is the reference for engineers and designers working on the LeSeft Nigeria website.

## Part 1: Research synthesis (Figma Community and industry sources)

### What the Figma Community ecosystem converges on

A review of the leading kits on Figma Community and their code counterparts shows near-total consensus on architecture, even where aesthetics differ:

- **shadcn/ui Figma Community kit** (and the shadcndesign ecosystem): treats shadcn/ui as the design-to-code bridge for React and Tailwind teams. Every component uses semantic tokens (background, foreground, primary, muted, accent, border, ring), native Auto Layout, and Figma Variables so class names copied from the kit map one-to-one onto code. Notable because it closes the design-to-code loop the way nothing else on Community does. ([shadcndesign](https://www.shadcndesign.com/blog/best-figma-design-system-kits-for-development-teams-2026), [SkillCharged libraries roundup](https://www.skillcharged.net/figma/resources/libraries/best-figma-libraries-design-systems), [Line25 kit index](https://line25.com/articles/free-figma-templates-ui-kits-2026/))
- **Radix Themes / Radix Colors community kits**: no official first-party kit exists; the maintained community files mirror Radix Themes and the 30 Radix Color scales as Figma Variables with automatic dark mode. The lesson is to bind components to primitives that are unstyled and accessible, and layer styling on top. ([shadcndesign](https://www.shadcndesign.com/blog/best-figma-design-system-kits-for-development-teams-2026), [Line25](https://line25.com/articles/free-figma-templates-ui-kits-2026/))
- **Untitled UI** (free starter, 10k+ variants Pro): the community standard for variable-driven kits. 900+ global color/typography/effects styles, light and dark variable modes, and page examples across desktop and mobile. Lesson: tokens must be exhaustive and modes must resolve before first paint. ([Untitled UI kit index](https://www.untitledui.com/blog/figma-ui-kits))
- **Material Design 3 kit and Apple iOS/macOS kits**: official vendor kits; authoritative for their platforms. Lessons adopted: elevation only for overlays, large touch targets, and dynamic color expressed as tonal roles rather than raw hues. ([Untitled UI](https://www.untitledui.com/blog/figma-ui-kits), [Pegasus comparison](https://www.pegasusdesignsystem.com/blog/best-design-systems-2026))
- **GitHub Primer and IBM Carbon**: enterprise-grade, token-first systems. Lessons adopted: 1000+ tokens out of the box is overkill for a seven-page marketing site; a minimal semantic set plus a small brand primitive palette is the right balance. ([Line25](https://line25.com/articles/free-figma-templates-ui-kits-2026/))

### Engineering principles adopted from industry practice

1. **Single source of truth for tokens.** Tokens live as CSS custom properties on `:root` and are exposed to utilities through Tailwind v4's `@theme inline` (`--color-*`, `--font-*`, `--radius-*`). Never hard-code a hex value inside a component; always reference a semantic token. This is the token architecture recommended across current shadcn/ui practice ([thecodeforge](https://thecodeforge.io/javascript/build-design-system-shadcn-tailwind-radix/), [themes.dev](https://www.themes.dev/blog/shadcn-ui/), [llmbestpractices](https://llmbestpractices.com/frontend/shadcn)).
2. **Surface/foreground pairing.** Every surface token ships with a foreground partner (`--card`/`--card-foreground`, `--primary`/`--primary-foreground`, and so on). This is the pairing convention shadcn/ui uses so contrast is designed in, not verified after the fact ([themes.dev](https://www.themes.dev/blog/shadcn-ui/)).
3. **Own the source.** shadcn/ui components are copied into the repository (`components/ui/`), composed with Radix primitives for behaviour and accessibility, and varied with `class-variance-authority`. The application owns and can fork them; they are not a black-box dependency ([llmbestpractices](https://llmbestpractices.com/frontend/shadcn)).
4. **Accessibility comes from Radix; do not break it.** Dialog traps focus, restores it on close, locks scroll, and closes on Escape. Label associates with controls. Separator is decorative by default. Select is fully keyboard operable. Components must keep `sr-only` titles, `aria-current`, and visible focus rings ([llmbestpractices](https://llmbestpractices.com/frontend/shadcn)).
5. **Semantic color, never arbitrary utilities.** Utilities such as `bg-red-500` or raw hex in JSX are prohibited; components reference `bg-primary`, `text-muted-foreground`, `border-input`, `ring-ring` ([thecodeforge](https://thecodeforge.io/javascript/build-design-system-shadcn-tailwind-radix/)).
6. **Radius discipline.** One radius scale (`--radius`, plus sm/lg derivatives) applied consistently to interactive elements, cards and overlays. Fully round is reserved for circular affordances (status dots, check discs).
7. **Motion with intent and consent.** Transitions are short (150 to 450 ms) and ease-out; the `prefers-reduced-motion` media query disables them. Overlay surfaces animate via `data-state` keyframes defined next to their component.
8. **Touch targets and focus.** Interactive controls are at least 44px tall (icon buttons 44x44). `:focus-visible` renders a 3px gold ring (`--ring`) with a 3px offset; components additionally expose `ring-ring` halos.
9. **Type scale and measure.** Fluid `clamp()` display sizes for marketing headings; body text held to a comfortable measure; uppercase tracking reserved for eyebrows and micro-labels; DM Serif Display for display, DM Sans for UI/body.
10. **Responsive by content, not device.** Three custom breakpoints (1120px, 900px, 700px) collapse the editorial grid, replace the inline nav with the accessible sheet below 900px, and stack forms below 700px.
11. **Print is a first-class output.** A `@media print` block strips chrome (header, ribbon, CTA, consent, turnstile) and sets legible black on white.
12. **Performance is a feature.** Self-hosted fonts, no CSS-in-JS runtime, Tailwind utilities compiled away at build time, sticky header without scroll listeners, and fail-closed integrations that do not ship unconfigured code paths.

## Part 2: What changed in this codebase

### Stack additions

- `tailwindcss` v4 + `@tailwindcss/postcss` (CSS-first configuration via `postcss.config.mjs`; no `tailwind.config.js`).
- `class-variance-authority`, `clsx`, `tailwind-merge` (the shadcn `cn()` pattern, `lib/utils.ts`).
- Radix primitives: `react-slot` (Button `asChild`), `react-dialog` (Sheet), `react-label`, `react-select`, `react-separator`.
- `components.json` present so the shadcn CLI can add further components consistently (`style: new-york`, `cssVariables: true`, `iconLibrary: lucide`).

### Token architecture (`app/globals.css`)

Brand primitives are kept (`--forest`, `--deep`, `--lime`, `--cream`, `--paper`, `--gold`) and a semantic layer is defined on `:root`, then exposed through `@theme inline`:

| Token | Value | Role |
| --- | --- | --- |
| `--background` / `--foreground` | `#fffefa` / `#15352e` | page surface and text |
| `--card` / `--card-foreground` | `#fffefa` / `#15352e` | cards |
| `--popover` / `--popover-foreground` | `#fffefa` / `#15352e` | menus, sheet |
| `--primary` / `--primary-foreground` | `#123b31` / `#f2f7e9` | buttons, links |
| `--secondary` / `--secondary-foreground` | `#eef2ea` / `#173f33` | secondary surfaces |
| `--muted` / `--muted-foreground` | `#f1f4ed` / `#5b6f64` | quiet backgrounds, helper text |
| `--accent` / `--accent-foreground` | `#e0ebce` / `#163c2f` | hover fills, light CTAs |
| `--destructive` / `--destructive-foreground` | `#b3261e` / `#ffffff` | errors |
| `--success` / `--success-foreground` | `#e0ebd7` / `#254b34` | success states |
| `--warning` / `--warning-foreground` | `#fff8e8` / `#6b542c` | preview banners |
| `--border` / `--input` / `--ring` | `#d9e1d7` / `#cfd9cd` / `#dbab57` | lines, field borders, focus |
| `--radius` | `0.375rem` | single radius scale (sm = minus 2px, lg = plus 4px) |
| `--shadow-overlay` | `0 12px 40px rgba(11,45,37,0.18)` | overlays only |

The pre-existing editorial layout CSS was kept intentionally (hero, ribbon, network art, capability cards) but migrated onto tokens where applicable, given a radius scale, 44px link targets, a sticky header, and joined by the `@media print` block.

### Component inventory (`components/ui/`)

| Component | Built on | Used in |
| --- | --- | --- |
| `Button` (7 variants: default, light, secondary, outline, ghost, link, destructive; 4 sizes; `asChild`) | Radix Slot + CVA | header CTA, hero CTA, CTA band, form submit, consent banner, sheet footer, studio notice, footer analytics link |
| `Sheet` (overlay, content, header, body, footer, sr-only title/description) | Radix Dialog | mobile navigation (replaces the manual `is-open` dropdown, gaining focus trap, scroll lock, Escape handling, and route-change close) |
| `Select` (trigger, content, item with indicator, name-based hidden native select for FormData) | Radix Select | contact form "What is your enquiry about?" |
| `Label` (with `optional` affordance) | Radix Label | all contact form fields |
| `Input` / `Textarea` | native + token styles | contact form |
| `Separator` (horizontal/vertical, decorative) | Radix Separator | footer divider |
| `Badge` (success/outline/secondary/default) | CVA | studio notice status |
| `Alert` (warning/success/destructive/default, correct `role`) | CVA | contact preview notice, form status messages |

`components/Brand.tsx` de-duplicates the wordmark between header, footer and sheet; when LeSeft uploads an approved logo in Sanity settings, all entry points update together.

### Typography and separator rules

- No em dash (U+2014), en dash or any dash variant anywhere in copy, code, comments, documents or generated Figma frames. Use a colon, comma, full stop or the brand slash separator instead. Enforced by a scripted scan in the QA process and retained in the Figma plugin template (`scripts/figma-plugin-template.js`, which regenerates `figma-import/code.js`).
- The brand slash separator is set with single spaces (`TRADING HOUSE / PROJECT OFFICE`). The previous double-spaced form and the decorative eight-spoked asterisk ornaments are prohibited.
- Apostrophes in prose are typographic (`’`), never straight quotes.
- SVG connectors use dotted round-cap strokes, never dashed lines.

### UX and button system pass (26 November 2026, second review)

After design review, the button layer and interaction feedback were rebuilt:

- `Button` variants now carry a clear CTA hierarchy: `default` (forest, shadow lift), `light` (accent lime on dark imagery, hover darkens), `ondark` (translucent white for photographic surfaces), `outline` (1.5px border, filled hover), `secondary`, `ghost`, `link`, `destructive`. Corners are near-sharp (`3px`), matching the editorial brand; sizes are 40/48/54px; icon glyphs scale with font size; `active:translate-y-[1px]` press feedback; disabled states read as disabled instead of merely translucent.
- Hero CTA pair is now `light` + `ondark`, both `size="lg"`, so the hero has one obvious primary action and a legible secondary action on the photographic background.
- The header CTA is a filled primary button; the sticky header gains a scroll shadow; the top-strip separator uses the brand slash.
- Form fields are 48px high on white with 3px focus halo; the submit button is full-width, centered and gap-consistent.
- Cards lift on hover, partner rows wash with background and nudge their arrow, text links move their arrow diagonally instead of growing their gap.
- Redundant middle-dot separators were replaced with the brand slash; copy uses curly apostrophes.

### Button contrast pass (26 November 2026, third review)

User-reported illegible green button text led to a full variant-by-variant contrast rebuild:

- `default` is now near-black green `#0f362c` with pure white 15px `font-extrabold` text (13.25:1); hover lightens to `#1c4f40` (9.37:1). Hover on the old `light`/`default` variants no longer washes out.
- `light` (hero primary) is `#e9f2d9` on text `#0e281f` (13.54:1) with a darker hover `#d3e4b5` (11.58:1).
- `ondark` (hero secondary on photography) is a solid near-opaque `#0c2b21/90` with white text and a pale-lime border (15.18:1), replacing the effectively invisible translucent white/10 over bright sky regions.
- `secondary`, `outline`, `ghost`, `link`, `destructive` all use dark text on light surfaces or white on dark surfaces with ≥ 6.5:1; disabled states sit at ~3.5:1 which is intentional.
- Semantic tokens `--primary-foreground` is now `#ffffff`, `--accent-foreground` `#0e281f`, `--accent` `#e9f2d9`; the DM Sans 800 weight is bundled (`font-extrabold` is genuine, not synthesised).
- Icons inherit the same high-contrast color, scale at 1.1em with a 2.25 stroke.

### Deliberate non-adoptions

- No dark mode yet: the approved brand dossier is a single light editorial theme; the token pairing convention leaves `.dark` a clean future addition.
- No charts, tables or command menus: the site has no product UI; adding unused primitives would be dead code.
- The marketing grid layout (hero, ribbon, network art) is hand-authored CSS rather than Tailwind utilities: bespoke editorial typography is clearer this way, and utilities govern the component layer. This is consistent with how mature shadcn projects mix the two.
- Inline SVG artwork retained; iconography everywhere else is Lucide (the shadcn default set).

## Part 3: Verification

See `QA_REPORT.md` for the latest checks (typecheck, production build, seven-route smoke test, mocked enquiry endpoint tests, repo-wide em/en dash scan) and what must be re-tested before launch (full axe-core pass and cross-browser review were run on the pre-refactor build and must be repeated).
