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

/* ------------------------------------------------------------------
   One-page scroll: each scroll gesture glides smoothly to exactly the
   next (or previous) full page. Not a hard snap, not free-scroll — a
   single eased page-to-page transition per gesture.
   ------------------------------------------------------------------ */
(function onePageScroll() {
  try {
    const sections = Array.prototype.slice.call(document.querySelectorAll(".page"));
    if (sections.length < 2) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;
    let animating = false;
    let unlock = null;

    // which section is currently closest to the top
    function syncIndex() {
      const y = window.scrollY;
      let best = 0, bestDist = Infinity;
      sections.forEach((s, i) => {
        const d = Math.abs(s.offsetTop - y);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      index = best;
    }
    syncIndex();

    function goTo(i) {
      i = Math.max(0, Math.min(sections.length - 1, i));
      const targetY = sections[i].offsetTop;
      index = i;
      if (reduce) { window.scrollTo(0, targetY); return; }
      animating = true;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      clearTimeout(unlock);
      unlock = setTimeout(() => { animating = false; }, 780);
    }

    // if the current section is taller than the viewport, let it scroll
    // naturally in that direction before paging on
    function canScrollWithin(dir) {
      const r = sections[index].getBoundingClientRect();
      if (dir > 0) return r.bottom > window.innerHeight + 2; // more below
      return r.top < -2;                                     // more above
    }

    // wheel / trackpad
    window.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) < 4) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (animating) { e.preventDefault(); return; }
      if (canScrollWithin(dir)) return; // tall section: allow native scroll
      e.preventDefault();
      goTo(index + dir);
    }, { passive: false });

    // keyboard
    window.addEventListener("keydown", (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (animating) { if (["ArrowDown","ArrowUp","PageDown","PageUp"," "].includes(e.key)) e.preventDefault(); return; }
      if (["ArrowDown","PageDown"," "].includes(e.key)) { e.preventDefault(); goTo(index + 1); }
      else if (["ArrowUp","PageUp"].includes(e.key)) { e.preventDefault(); goTo(index - 1); }
      else if (e.key === "Home") { e.preventDefault(); goTo(0); }
      else if (e.key === "End") { e.preventDefault(); goTo(sections.length - 1); }
    });

    // touch (mobile)
    let touchStartY = null;
    window.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener("touchend", (e) => {
      if (touchStartY === null || animating) { touchStartY = null; return; }
      const dy = touchStartY - (e.changedTouches[0] ? e.changedTouches[0].clientY : touchStartY);
      touchStartY = null;
      if (Math.abs(dy) < 45) return;
      const dir = dy > 0 ? 1 : -1;
      if (canScrollWithin(dir)) return;
      goTo(index + dir);
    }, { passive: true });

    // in-page anchor links (nav, wordmark) glide too
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href").slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        const page = target.closest(".page") || target;
        const i = sections.indexOf(page);
        if (i < 0) return;
        e.preventDefault();
        goTo(i);
      });
    });

    window.addEventListener("resize", () => { if (!animating) syncIndex(); });
  } catch (err) {
    /* if anything goes wrong, fall back to normal browser scrolling */
  }
})();
