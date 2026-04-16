# Changelog

All notable changes to the Parker Henderson Recruiting Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Discovery Engine** returning "Claude returned non-JSON" for well-known
  schools (e.g. "Ohio State"). The code-fence-stripping regex in
  `claude-discovery.js` was matching the entire fenced block including its
  contents, so when Claude wrapped its reply in ` ```json ... ``` ` the
  JSON body was deleted and `JSON.parse("")` threw. Regex now strips only
  the fence markers, plus a fallback that extracts the outermost `{...}`
  block so stray prose before/after the JSON no longer breaks parsing.
  Raw response (first 500 chars) is returned in the error payload for
  future diagnosis.

## [0.2.0] — 2026-04-15

Major UI overhaul pushing the dashboard toward a production SaaS feel:
cleaner information hierarchy, consistent chrome across every view, and
the navigation and data-density controls a subscriber would expect.

### Added

- **Persistent sidebar navigation** (`AppShell` + `Sidebar`) with Schools,
  Email Templates, Gmail Drafts, and Settings. Discovery Engine promoted
  to a primary CTA. Mobile hamburger with backdrop overlay.
- **Stats strip** on the Schools page — Total / Primary / Discovery / Camps
  Attended / Emails Sent surfaced at the top of the content area.
- **Sortable table headers** on the Schools list: name, division,
  conference, location, setter need, and status. Asc/desc indicator on
  the active column.
- **Density toggle** (comfortable / compact) for power users tracking
  long lists of schools.
- **Mobile card layout** (`MobileSchoolCard`) replaces horizontal-scrolling
  tables below the `md` breakpoint.
- **Unified Primary / Discovery / Hidden tabs** — one table, three
  sections, with a per-tab count.
- **Pipeline stepper** on the school detail view — full-width card with a
  progress bar and numbered/checked stage badges.
- **Settings view** placeholder surfacing athlete profile (from `PARKER`
  constants), data export, and privacy sections.

### Changed

- Dark gradient hero banners removed from `MasterView`, `EmailTemplatesView`,
  and `GmailDraftsView` — all three now share the consistent in-content
  page header used by the rest of the app.
- Discovery Engine converted from a mid-page block to a compact,
  collapsible panel triggered from the page header or sidebar.
- `AppContext` extended with `activeSection`, `sortBy`/`sortDir`,
  `density`, and `openDiscovery` state plus a `toggleSort` helper. Legacy
  `filteredPrimary` / `filteredDiscovery` selectors retained for
  backwards compatibility.
- `SchoolRow` is now density-aware (padding, logo size) and supports a
  Restore action when rendered under the Hidden tab.

### Fixed

- `GmailDraftsView` crashed in its error/empty states due to a missing
  `X` import from `lucide-react`. Import added.

### Notes

- `vite build` passes cleanly (1521 modules, ~300 kB bundle).
- No dependency changes.
- Commit: [`ffcbdc7`](https://github.com/parkerhendersonsetter2028/parker-recruiting-hub/commit/ffcbdc7b7ba7d1faa29a4ecb01d0619b366fa068)

## [0.1.0] — earlier

Initial modular split of `App.jsx` into `src/` (components, context,
views, lib, data). Baseline Vite + React 18 + Tailwind dashboard
deployed at parker-henderson-vb.netlify.app.

[Unreleased]: https://github.com/parkerhendersonsetter2028/parker-recruiting-hub/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/parkerhendersonsetter2028/parker-recruiting-hub/releases/tag/v0.2.0
