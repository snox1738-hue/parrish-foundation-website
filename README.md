# The Parrish Foundation — Built to Give

Static website for the Built to Give mission (theparrishfoundation.org).
We fundraise for **SOS Children's Villages USA** and track every dollar in public.

## Stack
Plain HTML/CSS/JS — no build step. Deployed on Netlify from this repo (`main` branch, publish dir = root).

## The two things you'll edit

1. **The give link** — `GIVE_URL` at the top of `ledger.js`. ⚠️ Currently a placeholder
   (`fundraise.sos-usa.org`). Replace it with Sam's personal fundraiser page URL once created.
   Never point it at the generic sos-usa.org donation form — untrackable.
2. **The ledger** — `LEDGER_ENTRIES` in `ledger.js`. Real entries only. NO fake data, ever.

## Hero video (two-layer, seamless)
- `assets/parrish-animation.mp4` — the intro. Plays ONCE on load, then holds its
  final frame underneath.
- `assets/parrish-loop.mp4` — a **boomerang** idle loop (the settled tail,
  forward + reversed) that fades in when the intro ends and loops forever. The
  forward+reverse construction means it has NO seam — it can't glitch. Rebuild it
  from a new clean intro with: extract the calm tail (`-ss 8.4 -t 1.55`), make a
  `-vf reverse` copy, and concat forward+reverse.
- Handoff + autoplay-nudge logic lives in `site.js`; crossfade + layering in
  `styles.css` (`.hero-loop.live`).

## Files
- `index.html` — the whole story (hero → story → how it works → public ledger → SOS)
- `styles.css` — the open-ledger aesthetic (paper/ink/green, Instrument Serif + Spline Sans Mono)
- `ledger.js` — GIVE_URL + ledger data + render
- `site.js` — give-button wiring, day counter, scroll reveal
- `privacy.html` / `terms.html` — honest wording: we fundraise FOR SOS; money never touches us
- `netlify.toml` — publish config + security headers
