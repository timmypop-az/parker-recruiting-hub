# Changelog

All notable changes to the Parker Henderson Recruiting Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Inline Add-School result banner** in the Discovery Engine panel. Replaces
  the old blocking `alert()` calls with a styled banner that reports success,
  duplicate, "no men's volleyball", or error — and on success shows the
  school's division, conference, location, whether the head coach was verified
  against the school's own site, and which tab the school was placed in.
  Includes a **View it** button that jumps straight to the detail page (and
  auto-switches the active tab to match). Driven by a new `addResult` state
  on `AppContext`. Motivated by the silent-success case when Claude placed a
  newly-added school in a tab the user wasn't viewing (e.g. Concordia
  Wisconsin added but not visible because the user was on the Primary tab).
- **Active-tab auto-switch** after a successful add — the Schools view now
  flips to whichever section (Primary / Discovery) the new school landed in,
  so newly-added programs are always on screen without the user hunting.
- **Duplicate detection** on add. If a parsed school's id or name already
  exists in `allSchools`, the banner reports "already in your hub" with a
  View link instead of creating a second entry.
- **Re-verify Coach button** on the school detail view. Calls a new
  `/coach-verify` Netlify Function that re-runs the head-coach
  verification (shared helper in `_verifyHeadCoach.js`) against the
  school's own volleyball page, then overrides the stored head coach
  without touching notes, logs, or status. Verified records are kept
  in a new `coachOverrides` field in the Netlify Blobs `user-data`
  payload and merged into each school at render time. A small
  "Coach re-verified from …" banner appears on detail pages that have
  an override.
- **Delete School** action in the row ⋯ menu and at the top of the
  detail view. User-added schools are removed outright from
  `extraSchools`; seeded schools are tombstoned in a new
  `deletedIds` field so the filter in `allSchools` hides them. Deletion
  is confirmation-gated; status/logs/notes for the id are preserved so
  a re-add reconnects them automatically.
- **Delete interaction-log entries**. Each log row in the outreach
  console gets a (hover-revealed) trash button that calls a new
  `deleteLogEntry(schoolId, index)` helper. Logs continue to persist
  in the same Netlify Blobs `user-data` record they always have.
- **Manual / drag-and-drop school ordering** on the desktop table
  (@dnd-kit/sortable). A "Manual" toggle in the filter bar switches
  the sort to a new `custom` mode backed by a `schoolOrder` array
  (persisted in `user-data`). An 8-px activation distance keeps
  single clicks navigating to the detail view; drag only engages
  after the pointer moves. First time Manual is enabled, the order
  is seeded from the current `allSchools` list so nothing jumps.

### Changed

- **Discovery Engine prompt now resolves acronyms and nicknames explicitly.**
  Input like "UCLA", "UCSB", "BYU", "USC", "NYU", "LSU", "MIT", "CSUN", "CUW",
  "OSU", or "UCI" is expanded to the full official school name before the
  lookup; ambiguous inputs (e.g. bare "Concordia") are resolved to the campus
  with the most prominent men's volleyball program. The JSON schema gained an
  `inputInterpretation` field so the UI can show the user exactly what the
  typed text was resolved to (also surfaced in the Add-School banner).
- **Discovery Engine now verifies the head coach from the school's own
  volleyball page** instead of trusting the LLM's general-knowledge output.
  After Claude returns the JSON, the function fetches `{vbUrl}/coaches`
  (falling back through `/roster/coaches`, `/staff`, and the base `vbUrl`),
  extracts every `mailto:` anchor with a ±2 kB HTML context window, and
  picks the first one whose context contains "Head Coach" but NOT
  Associate / Assistant / Interim / Former / Emeritus / Volunteer /
  Director of Operations Head Coach. If no explicit Head Coach title is
  found, it falls back to the first mailto on the page (on Sidearm sites
  the head coach is typically listed first). The verified record
  overrides `parsed.coaches`, and new metadata fields
  (`_coachVerified`, `_coachVerifiedFrom`, `_coachTitleConfirmed`) are
  surfaced so the UI can flag unverified entries. Motivated by the
  Concordia Wisconsin add, where the LLM returned the wrong head coach.

### Removed

- **Cal Baptist (CBU) removed from the school list.** Their men's volleyball
  program has been discontinued — men's volleyball no longer appears in
  `cbulancers.com`'s sports navigation and the old coaches page renders
  empty. Historical schedule entries for matches other schools played vs
  Cal Baptist are retained as game records.

### Fixed

- **Head coach emails corrected for Ball State and Penn State** after
  verification against each school's official Sidearm coaches page. Ball
  State's Mike Iandolo is `michael.iandolo@bsu.edu` (was `miandolo@bsu.edu`);
  Penn State's Mark Pavlik is `mtp7@psu.edu` (was `map33@psu.edu`).
- **Four more head coach records corrected** after verifying against each
  school's own volleyball coaches page linked from the hub:
  - Vanguard: "Athletics Dept / athletics@vanguard.edu" → "Brian Rofer /
    brian.rofer@vanguard.edu" (head coach was a stub).
  - Lewis: Dan Friend's email `dfriend@lewisu.edu` → `friendda@lewisu.edu`.
  - Purdue Fort Wayne: Donny Gleason's email `dgleason@pfw.edu` →
    `donald.gleason@pfw.edu`.
  - Arizona Christian: "Chris Shearn / chris.shearn@arizonachristian.edu" →
    "Caden Toben / caden.toben@arizonachristian.edu" (new head coach).
- **Four schools had broken `vbUrl` links that have now been repaired**, and
  head-coach records re-verified against the corrected volleyball coaches
  pages:
  - Maryville: vbUrl `maryvilles.com` (non-existent) → `maryvillesaints.com`;
    HC "Nick Loewen / nloewen@maryville.edu" → "Mike Haston /
    mhaston@maryville.edu".
  - Orange Coast College: vbUrl `occsports.com` (parked domain for sale) →
    `occpirateathletics.com`; HC "Travis Turner / tturner@occ.cccd.edu"
    confirmed unchanged.
  - Benedictine Mesa: vbUrl `www.ben.edu/athletics/mens-volleyball` (404) →
    `benuredhawks.com/sports/mens-volleyball`; HC "Matt August /
    matthew.august@benedictine.edu" → "Grant DeGrasse / gdegrasse@ben.edu"
    (named HC May 2025).
  - Hope International: vbUrl `hopeinternational.edu/athletics` (non-routing)
    → `hiuroyals.com/sports/mens-volleyball`; HC "Jeremy McCall /
    jmccall@hiu.edu" → "Lisa Bangasser / labangasser@hiu.edu".
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
