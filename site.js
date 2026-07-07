/* Wire every give button to the fundraiser URL (defined in ledger.js),
   day counter, and scroll-reveal. */

(function () {
  // give buttons
  document.querySelectorAll("[data-give]").forEach((a) => {
    a.href = GIVE_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // day counter — days since the mission went public
  const START = new Date("2026-07-20T00:00:00-07:00"); // launch day
  const dayEl = document.getElementById("day-count");
  if (dayEl) {
    const days = Math.max(1, Math.floor((Date.now() - START.getTime()) / 86400000) + 1);
    dayEl.textContent = days;
  }

  // scroll reveal
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in-view");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll("section:not(.hero) .reveal").forEach((el) => io.observe(el));
})();
