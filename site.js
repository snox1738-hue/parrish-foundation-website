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

  // hero video: play the full animation ONCE on load (the wordmark assembles +
  // the light sweep), then gently LOOP just the calm tail — the "THE PARRISH
  // FOUNDATION" wordmark holds while the gold particles keep drifting, so it
  // stays alive instead of dead-freezing. A CSS "breathing" pulse (styles.css)
  // adds the heartbeat.
  const vid = document.querySelector(".hero-video");
  if (vid) {
    const LOOP_START = 8.6; // wordmark fully formed, past the glint — just particles
    const seekToLoop = () => {
      try { vid.currentTime = LOOP_START; } catch (e) {}
      vid.play().catch(() => {});
    };
    // when the clip reaches the end, drop back into the calm tail (not the top)
    vid.addEventListener("timeupdate", () => {
      if (vid.duration && vid.currentTime >= vid.duration - 0.06) seekToLoop();
    });
    vid.addEventListener("ended", seekToLoop); // safety net if timeupdate misses it

    // nudge play in case autoplay is blocked until first interaction
    const nudge = () => vid.play().catch(() => {});
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
