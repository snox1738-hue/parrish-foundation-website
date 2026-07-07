# The Parrish Foundation — Build to Give

Static website for the Build to Give mission (theparrishfoundation.org).
We fundraise for **SOS Children's Villages USA** and track every dollar in public.

## Stack
Plain HTML/CSS/JS — no build step. Deployed on Netlify from this repo (`main` branch, publish dir = root).

## The two things you'll edit

1. **The give link** — `GIVE_URL` at the top of `ledger.js`. ⚠️ Currently a placeholder
   (`fundraise.sos-usa.org`). Replace it with Sam's personal fundraiser page URL once created.
   Never point it at the generic sos-usa.org donation form — untrackable.
2. **The ledger** — `LEDGER_ENTRIES` in `ledger.js`. Real entries only. NO fake data, ever.

## Files
- `index.html` — the whole story (hero → story → how it works → public ledger → SOS)
- `styles.css` — the open-ledger aesthetic (paper/ink/green, Instrument Serif + Spline Sans Mono)
- `ledger.js` — GIVE_URL + ledger data + render
- `site.js` — give-button wiring, day counter, scroll reveal
- `privacy.html` / `terms.html` — honest wording: we fundraise FOR SOS; money never touches us
- `netlify.toml` — publish config + security headers
