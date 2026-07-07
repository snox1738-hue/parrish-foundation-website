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

  // hero: play the intro ONCE, then crossfade into a seamless boomerang idle
  // loop (parrish-loop.mp4 = the settled tail forward+reversed, so it never
  // has a seam). The wordmark gently breathes forever instead of dead-freezing.
  const vid = document.querySelector(".hero-video");
  const loop = document.querySelector(".hero-loop");
  if (vid) {
    let ended = false;
    vid.addEventListener("ended", () => {
      ended = true;
      vid.pause(); // hold the intro's final frame underneath
      if (loop) { loop.play().catch(() => {}); loop.classList.add("live"); }
    });
    const nudge = () => {
      if (!ended) vid.play().catch(() => {});
      if (loop) loop.play().catch(() => {}); // keep the idle loop warm/decoding
    };
    nudge();
    ["click", "touchstart", "scroll", "keydown"].forEach((ev) =>
      addEventListener(ev, nudge, { once: true, passive: true })
    );
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
