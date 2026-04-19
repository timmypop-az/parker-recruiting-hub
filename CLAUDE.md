# Parker's Recruiting Hub — Project Context

## What this is
Parker Henderson's personal college volleyball recruiting dashboard. Class of 2028 setter, Brophy College Prep (Phoenix, AZ), AZ Fear 17s. Academic interests: business, aviation, theology.

This is the **single-tenant personal tool** for Parker's actual recruiting use. It is NOT the commercial SaaS product. The commercial fork lives in a separate repo — do NOT add commercial-product features (auth, multi-tenancy, Stripe, paywall, onboarding flow) to this codebase. Those go in the commercial fork.

## Stack
- React 18 + Vite + Tailwind CSS + lucide-react
- @dnd-kit/core, @dnd-kit/sortable for drag-and-drop reordering
- Netlify hosting + serverless functions
- Netlify Blobs for storage (no database, no Google Drive, no auth)
- Anthropic Claude API for the Discovery Engine — proxied server-side via `claude-discovery.js`

## Storage — Netlify Blobs
Single shared blob holding all Parker's data. No `user_id`, no auth — single-tenant by design.

- Store name: `parker-recruiting-hub`
- Key: `user-data`
- Shape: `{ schools, statuses, logs, notes, hiddenIds, sectionOverrides, coachOverrides, deletedIds, schoolOrder }`

(Storage was previously Google Drive / Google Sheets but was migrated out — google-auth-library and the GOOGLE_SERVICE_ACCOUNT env var are no longer used.)

## Netlify Functions
Located in `netlify/functions/`:
- `schools-load.js` — load from Blobs
- `schools-save.js` — save to Blobs
- `claude-discovery.js` — server-side Claude API call for the Discovery Engine
- `coach-verify.js` — re-verify head coach from a school's own volleyball page
- `_verifyHeadCoach.js` — shared helper used by the two above (Sidearm-style sites)

Functions use ES module syntax (`export default`). Netlify's current runtime supports this.

## Environment Variables
Only one is needed, set in the Netlify dashboard (never committed):
- `ANTHROPIC_API_KEY` — generated from Anthropic Max plan under timmypop@gmail.com

## Source layout
- `src/App.jsx` — composition root (~27 lines, NOT a monolith)
- `src/components/` — AppShell, Sidebar, SchoolRow, CoachCard, ExecutiveSummary, MobileSchoolCard, SchoolLogo, Badges, FontStyle
- `src/views/` — MasterView, DetailView, EmailTemplatesView, GmailDraftsView, SettingsView
- `src/lib/` — api.js, helpers.js
- `src/data/` — schools.js (curated school database), emailTemplates.js, coachPhotos.js, constants.js
- `src/context/` — React context providers

## Critical rules
- **NEVER** put `ANTHROPIC_API_KEY` client-side. Server-side via `claude-discovery.js` only.
- Make targeted, surgical edits — avoid wholesale rewrites that risk breaking working features.
- When a Netlify Function returns HTML instead of JSON, the function file is missing entirely or failed to deploy. Check the Netlify deploy log.
- Do NOT add features that belong to the commercial product (auth, multi-tenancy, billing, Stripe, onboarding, RLS). Those live in the commercial fork.

## Deployment
- Live at `parker-henderson-vb.netlify.app`
- Auto-deploys on push to `main`
- GitHub: `parkerhendersonsetter2028/parker-recruiting-hub`
- Local clone on the Mac mini: `/Users/thenderson/Projects/parker-recruiting-hub/parker-recruiting-hub/`

## Coach photos (Sidearm CDN pattern)
```
https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2F{domain}%2Fimages%2F{path}&width=180&height=270&type=webp
```

## Schedule data
Fetch the `/schedule/text` page from each school's Sidearm athletics site.

## Bigger picture
Commercial product strategy, business plan, 90-day tracker, feature roadmap, and competitive analysis live in Tim's Google Drive `Business Plan/` folder — not in this repo. Cowork sessions with Drive access should start by reading `Recruiting_Hub_Context_Handoff.md` for the full picture.
