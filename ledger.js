/* ============================================================
   THE PUBLIC LEDGER — real entries only. NO fake data, ever.
   Every dollar this mission generates gets a row here, forever.

   To add an entry, append to LEDGER_ENTRIES:
   { date: "2026-07-20", what: "First fundraiser donation", amount: 25 }
   ============================================================ */

// Sam's approved SOS fundraiser page (approved 2026-07-20). Must stay the
// FUNDRAISER PAGE — never the generic sos-usa.org donation form (untrackable).
const GIVE_URL = "https://fundraise.sos-usa.org/campaign/the-parrish-foundation";

const LEDGER_ENTRIES = [
  // empty by design — we just started. Real entries only.
];

(function renderLedger() {
  const tbody = document.querySelector("#ledger-table tbody");
  const totalEl = document.getElementById("ledger-total");
  const heroTotalEl = document.getElementById("hero-ledger-total");

  const fmt = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const total = LEDGER_ENTRIES.reduce((sum, e) => sum + e.amount, 0);
  if (heroTotalEl) heroTotalEl.textContent = fmt(total); // top-of-home total

  // progress toward the $1,000,000 goal
  const GOAL = 1000000;
  const fillEl = document.getElementById("hero-goal-fill");
  const pctEl = document.getElementById("hero-goal-pct");
  const pctVal = Math.min(100, (total / GOAL) * 100);
  if (fillEl) fillEl.style.width = pctVal + "%";
  if (pctEl) pctEl.textContent = (pctVal > 0 && pctVal < 1 ? pctVal.toFixed(2) : Math.round(pctVal)) + "%";

  if (!tbody || !totalEl) return; // hero exists without the full ledger table

  if (LEDGER_ENTRIES.length === 0) {
    tbody.innerHTML =
      '<tr class="empty"><td colspan="4">Nothing yet — we just started. The first dollar we generate goes right here, and it never comes down.</td></tr>';
    totalEl.textContent = "$0";
    return;
  }

  let running = 0;
  tbody.innerHTML = LEDGER_ENTRIES
    .map((e) => {
      running += e.amount;
      return `<tr>
        <td>${e.date}</td>
        <td>${e.what}</td>
        <td class="num">${fmt(e.amount)}</td>
        <td class="num">${fmt(running)}</td>
      </tr>`;
    })
    .join("");
  totalEl.textContent = fmt(running);
})();

/* Live total from the SOS fundraiser — donation-total.json is kept current
   by scripts/update-total.mjs (real scraped number, never hand-set).
   If the fetch fails or the tracker isn't wired yet, the manual ledger
   total above simply stands. */
(function liveTotal() {
  fetch("donation-total.json?t=" + Date.now())
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || typeof data.raised !== "number" || data.raised <= 0) return;
      const fmt = (n) =>
        n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
      const heroTotalEl = document.getElementById("hero-ledger-total");
      if (heroTotalEl) heroTotalEl.textContent = fmt(data.raised);
      const GOAL = 1000000;
      const fillEl = document.getElementById("hero-goal-fill");
      const pctEl = document.getElementById("hero-goal-pct");
      const pctVal = Math.min(100, (data.raised / GOAL) * 100);
      if (fillEl) fillEl.style.width = pctVal + "%";
      if (pctEl) pctEl.textContent = (pctVal > 0 && pctVal < 1 ? pctVal.toFixed(2) : Math.round(pctVal)) + "%";
    })
    .catch(() => {});
})();
