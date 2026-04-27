# Parker's Recruiting Hub — Project Context

## What this is

Parker Henderson's personal college volleyball recruiting dashboard. Class of 2028 setter, Brophy College Prep (Phoenix, AZ), AZ Fear 17s. Academic interests: business, aviation, theology.

This is the **single-tenant personal tool** for Parker's actual recruiting use, deployed to `parker-henderson-vb.netlify.app`. It is NOT the commercial SaaS fork. The commercial fork lives at `~/Projects/Campus Commit/campus-commit-hub` (private GitHub: `timmypop-az/campus-commit-hub`) — do NOT add commercial-product features (multi-tenant auth, Stripe, paywall, RLS, onboarding flow) to this codebase. Those go in the commercial fork.

On 2026-04-27 the **visual layer was rebranded to the Campus Commit design system** — same colors, typography, component styling, dark-mode toggle as the commercial fork. The data, routes, business logic, and Netlify Functions are unchanged. Per Tim's strategy, Parker IS the first Campus Commit user, so the visible brand here matches the commercial product.

## Stack

- React 18 + Vite + Tailwind CSS 3.4 (with `darkMode: ['class', '[data-theme="dark"]']`)
- @dnd-kit/core, @dnd-kit/sortable for drag-and-drop reordering
- Netlify hosting + serverless functions
- Netlify Blobs for storage (no database, no Google Drive, no auth)
- Anthropic Claude API for the Discovery Engine — proxied server-side via `claude-discovery.js`

## Storage — Netlify Blobs

Single shared blob holding all Parker's data. No `user_id`, no auth — single-tenant by design.

- Store name: `parker-recruiting-hub`
- Key: `user-data`
- Shape: `{ schools, statuses, logs, notes, hiddenIds, sectionOverrides, coachOverrides, deletedIds, schoolOrder }`

(Storage was previously Google Drive / Google Sheets but was migrated out — `google-auth-library` and the `GOOGLE_SERVICE_ACCOUNT` env var are no longer used.)

## Netlify Functions

Located in `netlify/functions/`:
- `schools-load.js` — load from Blobs
- `schools-save.js` — save to Blobs
- `claude-discovery.js` — server-side Claude API call for the Discovery Engine
- `coach-verify.js` — re-verify head coach from a school's own volleyball page
- `_verifyHeadCoach.js` — shared helper used by the two above (Sidearm-style sites)
- `gmail-auth-start.js`, `gmail-auth-callback.js`, `gmail-disconnect.js` — server-side Gmail OAuth for the Gmail Drafts feature

Functions use ES module syntax (`export default`). Netlify's current runtime supports this.

## Environment Variables

Set in the Netlify dashboard (never committed):
- `ANTHROPIC_API_KEY` — generated from Anthropic Max plan under timmypop@gmail.com
- Gmail OAuth client id/secret (for the Gmail Drafts feature)

## Design system

Vendored at `handoff/` — drop-in kit from the upstream `My Drive/Campus Commit/03_Product/design_system/handoff/`. Treat it as immutable; don't edit `handoff/` files casually.

- `handoff/CLAUDE.md` + `handoff/README.md` — the rebrand instructions (full color/type/spacing rules)
- `handoff/tokens/colors_and_type.css` — CSS variables for both light and dark modes; imported in `src/index.css` before Tailwind
- `handoff/tailwind.preset.js` — extended via `tailwind.config.js` (gives `bg-cc-*`, `text-cc-*`, `font-display`, `rounded-cc-lg`, etc.)
- `handoff/components/` — reference React components — patterns to mirror, not a library to import
- `public/brand/` — Campus Commit brand marks; `public/favicon.ico` etc. are the cc favicons

### Token cheatsheet

- **Primary (interactive):** `bg-cc-accent` / `text-cc-accent` — flips light↔dark via CSS var. Use for CTAs, active states, badges.
- **Pure navy (literal hex):** `bg-cc-navy` / `cc-navy-700` — only for the deep-navy gradient hero panels (`bg-cc-grad-navy`) and their borders. Stays navy in both themes.
- **Surfaces:** `bg-cc-surface` (cards), `bg-cc-bg` (canvas), `bg-cc-surface-alt` (subtle), `border-cc-border`
- **Text:** `text-cc-fg` / `cc-muted` / `cc-subtle` / `cc-faint`
- **Tagging accents (personalization):** `cc-forest`, `cc-maroon`, `cc-purple`, `cc-orange`, `cc-light-blue` — never use these as primary brand color
- **Achievement only:** `cc-gold` — stars, AVCA rankings, brand crest accents
- **Type:** `font-display` (Oswald, ALL CAPS, +0.04em tracking) for headings, eyebrows, buttons, badges. `font-body` (Inter) is the default body font.
- **Radii:** `rounded-cc-sm` (6px buttons/badges), `rounded-cc-md` (12px inputs/tags), `rounded-cc-lg` (16px cards), `rounded-cc-xl` (24px hero cards)

### Dark mode

A toggle (sun/moon icon in the sidebar header) flips the theme.

- `src/lib/useTheme.js` — hook that reads localStorage (`cc-theme` key), falls back to `prefers-color-scheme`, persists on change, sets `document.documentElement.dataset.theme`
- `tailwind.config.js` has `darkMode: ['class', '[data-theme="dark"]']` — `dark:` variants resolve against the data attribute, not media query
- `src/index.css` has a CSS block that brightens the cc tagging text colors in dark mode (text-cc-forest → emerald-300, etc.)
- Colored badge backgrounds use `bg-X-50 dark:bg-X-500/15` style pairs

## Source layout

- `src/App.jsx` — composition root (~27 lines, NOT a monolith)
- `src/components/` — AppShell, Sidebar (with theme toggle), SchoolRow, CoachCard, ExecutiveSummary, MobileSchoolCard, SchoolLogo, Badges, FontStyle (now a no-op — tokens own type)
- `src/views/` — MasterView, DetailView, EmailTemplatesView, GmailDraftsView, SettingsView
- `src/lib/` — api.js, helpers.js, useTheme.js
- `src/data/` — schools.js (curated school database), emailTemplates.js, coachPhotos.js, constants.js
- `src/context/` — React context providers
- `handoff/` — vendored Campus Commit design-system kit

## Critical rules

- **NEVER** put `ANTHROPIC_API_KEY` client-side. Server-side via `claude-discovery.js` only.
- Make targeted, surgical edits — avoid wholesale rewrites that risk breaking working features.
- When a Netlify Function returns HTML instead of JSON, the function file is missing entirely or failed to deploy. Check the Netlify deploy log.
- Do NOT add features that belong to the commercial product (auth, multi-tenancy, billing, Stripe, onboarding, RLS). Those live in the commercial fork at `~/Projects/Campus Commit/campus-commit-hub`.
- Don't edit files inside `handoff/` casually — that's the vendored design system. If you need to change tokens, do it in the upstream Drive folder and re-vendor in both repos.
- When restyling, sweep against the design system token cheatsheet above. Don't introduce raw Tailwind colors when a `cc-*` token exists.

## Coach photos (Sidearm CDN pattern)

```
https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2F{domain}%2Fimages%2F{path}&width=180&height=270&type=webp
```

## Schedule data

Fetch the `/schedule/text` page from each school's Sidearm athletics site.

## Deployment

- Live at `parker-henderson-vb.netlify.app`
- Auto-deploys on push to `main`
- GitHub: `timmypop-az/parker-recruiting-hub`
- Local clone: `~/Projects/Campus Commit/parker-recruiting-hub/`

## Bigger picture

Commercial product strategy, business plan, 90-day tracker, feature roadmap, architecture spec, and competitive analysis live in Tim's Google Drive `My Drive/Campus Commit/` folder — not in this repo. Cowork sessions with Drive access should start by reading `01_Strategy/Campus_Commit_Doc_Index.md` for the corpus map.
