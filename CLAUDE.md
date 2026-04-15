\# Parker Henderson Volleyball Recruiting Hub — Project Context



\## The Athlete

Parker Henderson, setter, Class of 2029, Brophy College Prep, Phoenix AZ, AZ Fear 17s club team.

Academic interests: Business, Aviation, Theology/Faith.



\## The Project

A React-based college volleyball recruiting dashboard tracking programs, featuring an AI-powered 

Discovery Engine (Claude API) and AZ Radar data for Arizona-connected players and programs. 



Goal: monetize as a passive income SaaS product for high school athletes, families, and club teams. 

Volleyball is the first vertical, other sports to follow. "The Parker story" is the core marketing 

differentiator. Tim's club coach network is the key sales channel.



\## Source of Truth

\- GitHub repo: `parkerhendersonsetter2028/parker-recruiting-hub`

\- Main file: `src/App.jsx` — always read this from GitHub before making any changes

\- Local path: `G:\\My Drive\\Recruiting Hub\\parker-recruiting-hub`

\- Live site: `parker-henderson-vb.netlify.app` — auto-deploys on push to main



\## Stack

\- React 18, Vite, Tailwind CSS, lucide-react

\- Anthropic Claude API (proxied server-side via Netlify Function `claude-discovery.js`)

\- Netlify hosting + serverless functions

\- Google Drive for school data storage



\## Backend / Netlify Functions

\- Functions live in `netlify/functions/` at repo root

\- Config via `netlify.toml`

\- ALWAYS use CommonJS syntax (`module.exports` / `exports.handler`) — never ES module syntax

\- Google Drive integration via `drive-load-schools.js` and `drive-save-schools.js`

\- Google Sheet file ID: `1bB2pYygg7ftn5HPJoZyNq2rWVdMjgeI3lQYsOCJH9g0`

\- Service account: `parker-recruiting-bot@vballclaudeconnect.iam.gserviceaccount.com`

\- Use `google-auth-library` — NOT `googleapis` (causes build failures in this Netlify/Vite context)



\## Environment Variables (set in Netlify dashboard — never in code)

\- `GOOGLE\_SERVICE\_ACCOUNT`

\- `PARKER\_SCHOOLS\_FILE\_ID`

\- `ANTHROPIC\_API\_KEY`



\## Critical Rules

\- NEVER put the Anthropic API key client-side — server-side via Netlify Function only

\- Always fetch `src/App.jsx` from GitHub before editing — local file may be stale

\- Make targeted, surgical edits — avoid wholesale rewrites that risk breaking existing functionality

\- When a Netlify Function returns HTML instead of JSON, the function file is missing entirely

\- Use `google-auth-library` not `googleapis`

\- Netlify Functions require CommonJS syntax — this applies to config files like `postcss.config.js` too



\## Monetization Plan

\- Tiers: $9/month (athlete), $15/month (family), $99/month (club team)

\- Payment: Lemon Squeezy

\- Landing page: Carrd



\## Anthropic Account

\- Max plan under `timmypop@gmail.com`

\- All API keys must be generated from this account only — not any free-tier account



\## Coach Photos (Sidearm CDN pattern)

https://images.sidearmdev.com/crop?url=https%3A%2F%2Fdxbhsrqyrr690.cloudfront.net%2Fsidearm.nextgen.sites%2F{domain}%2Fimages%2F{path}\&width=180\&height=270\&type=webp



\## Schedule Data

For schedule updates, fetch the `/schedule/text` page from each school's Sidearm athletics site.

