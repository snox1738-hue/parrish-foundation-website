#!/usr/bin/env node
/* Donation tracker — pulls the real raised total from Sam's SOS fundraiser
   page and writes it to donation-total.json. The site's hero counter reads
   that file. The auto-deploy daemon then commits + pushes it live.

   Does NOTHING until fundraiserUrl is set in scripts/tracker-config.json
   (that happens once SOS approves and publishes the campaign page).

   Runs every 30 min via launchd (com.parrish.tracker). */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CONFIG = join(ROOT, "scripts", "tracker-config.json");
const OUT = join(ROOT, "donation-total.json");

const { fundraiserUrl } = JSON.parse(readFileSync(CONFIG, "utf8"));
if (!fundraiserUrl) process.exit(0); // not wired up yet — silently do nothing

/* SOS's server sends an incomplete TLS chain that Node's fetch rejects;
   curl (system trust store + AIA) handles it, so fetch via curl. */
let html;
try {
  html = execFileSync(
    "curl",
    ["-sfL", "-A", "Mozilla/5.0 (ParrishFoundationTracker)", fundraiserUrl],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
  );
} catch (e) {
  console.error(`fetch failed: ${e.status ?? e.message}`);
  process.exit(1);
}

/* The campaign page shows the raised total as a dollar amount next to
   "donated" (same widget as the my-campaign overview: "$X donated").
   Grab dollar amounts that appear just before the word "donated". */
const m = html.match(/\$\s?([\d,]+(?:\.\d{1,2})?)\s*(?:<[^>]*>\s*)*donated/i)
       || html.match(/donated[^$]{0,80}\$\s?([\d,]+(?:\.\d{1,2})?)/i);
if (!m) {
  console.error("could not find raised amount on page — layout may have changed");
  process.exit(1);
}
const raised = Math.round(parseFloat(m[1].replace(/,/g, "")));

const prev = JSON.parse(readFileSync(OUT, "utf8"));
if (prev.raised === raised) process.exit(0); // no change, no commit churn

/* never overwrite a real total with a smaller scrape glitch */
if (typeof prev.raised === "number" && raised < prev.raised) {
  console.error(`scraped ${raised} < previous ${prev.raised} — refusing to write`);
  process.exit(1);
}

writeFileSync(
  OUT,
  JSON.stringify(
    {
      raised,
      updatedAt: new Date().toISOString(),
      source: "sos-fundraiser",
      note: prev.note,
    },
    null,
    2
  ) + "\n"
);
console.log(`updated raised total: $${raised}`);
