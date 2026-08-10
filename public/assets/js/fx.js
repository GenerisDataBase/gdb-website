/* ==========================================================================
   Generis Data Base — interaction layer
   Plain script, no dependencies. Everything degrades gracefully and respects
   prefers-reduced-motion.
   ========================================================================== */
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Theme ------------------------------------------------------ */
  const THEME_KEY = "gdb-theme";
  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t;
    $$("[data-crest]").forEach((img) => {
      img.src = img.dataset[t === "light" ? "light" : "dark"];
    });
  };
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-toggle");
    if (!btn) return;
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  /* ---------- Header ----------------------------------------------------- */
  const head = $(".site-head");
  if (head) {
    const onScroll = () => head.classList.toggle("is-stuck", scrollY > 24);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }

  const burger = $(".burger");
  const nav = $(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName !== "A") return;
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  }

  /* ---------- Toasts ----------------------------------------------------- */
  const toastHost = document.createElement("div");
  toastHost.className = "toast-host";
  document.body.appendChild(toastHost);

  window.toast = (msg, kind = "") => {
    const el = document.createElement("div");
    el.className = `toast ${kind}`.trim();
    el.setAttribute("role", "status");
    el.textContent = msg;
    toastHost.appendChild(el);
    setTimeout(() => {
      el.classList.add("out");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }, 4200);
  };

  /* ---------- Ripple ----------------------------------------------------- */
  document.addEventListener("pointerdown", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn || reduced) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const ink = document.createElement("span");
    ink.className = "ripple";
    ink.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(ink);
    ink.addEventListener("animationend", () => ink.remove(), { once: true });
  });

  /* ---------- Tilt cards ------------------------------------------------- */
  if (fine && !reduced) {
    $$(".tilt").forEach((card) => {
      if (!card.querySelector(".glare")) {
        const g = document.createElement("span");
        g.className = "glare";
        card.appendChild(g);
      }
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        card.style.transform =
          `perspective(1100px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 7}deg) translateY(-5px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Scroll reveal ---------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

  const observeReveals = (root = document) => {
    $$("[data-reveal]:not(.is-in)", root).forEach((el) => io.observe(el));
    $$(".reveal-words:not(.is-in)", root).forEach((el) => {
      if (!el.dataset.split) {
        el.dataset.split = "1";
        const words = el.textContent.trim().split(/\s+/);
        el.textContent = "";
        words.forEach((w, i) => {
          const outer = document.createElement("span");
          outer.className = "word";
          const inner = document.createElement("span");
          inner.style.setProperty("--i", i);
          inner.textContent = w;
          outer.appendChild(inner);
          el.appendChild(outer);
          if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
        });
      }
      io.observe(el);
    });
  };
  window.gdbObserve = observeReveals;
  observeReveals();

  /* ---------- Count up --------------------------------------------------- */
  const counters = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      counters.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      if (reduced) { el.textContent = target.toLocaleString("en-US") + suffix; return; }
      const dur = 1500;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-US") + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counters.observe(el));

  /* ---------- Hero particle field ---------------------------------------- */
  const canvas = $("#field");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, pts = [], raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const r = canvas.getBoundingClientRect();
      // A hidden or not-yet-laid-out hero measures 0 — bail out and wait for the
      // ResizeObserver below rather than building an empty field.
      if (r.width < 1 || r.height < 1) { w = h = 0; pts = []; return; }
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 700 ? 46 : 38;
      pts = [];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          pts.push({ x, y, ox: x, oy: y, ph: Math.random() * Math.PI * 2 });
        }
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const light = document.documentElement.dataset.theme === "light";
      const base = light ? "13,13,16" : "255,255,255";
      for (const p of pts) {
        const drift = Math.sin(t / 2600 + p.ph) * 2.4;
        const dx = p.ox - mouse.x, dy = p.oy + drift - mouse.y;
        const d = Math.hypot(dx, dy);
        const near = Math.max(0, 1 - d / 190);
        const push = near * 16;
        const x = p.ox + (d ? (dx / d) * push : 0);
        const y = p.oy + drift + (d ? (dy / d) * push : 0);
        const rad = 0.9 + near * 1.9;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fillStyle = near > 0.05
          ? `rgba(211,178,113,${0.22 + near * 0.68})`
          : `rgba(${base},${light ? 0.13 : 0.16})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    // The browser already pauses requestAnimationFrame in a hidden tab, so the
    // loop only needs to care about whether the hero is on screen.
    let onScreen = true;
    const start = () => { if (!raf && onScreen && pts.length) raf = requestAnimationFrame(draw); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    // The canvas scrolls with the hero, so its offset has to be refreshed —
    // but reading it on every pointermove would be a layout read per frame.
    let rect = null;
    const invalidate = () => { rect = null; };
    addEventListener("scroll", invalidate, { passive: true });

    addEventListener("pointermove", (e) => {
      if (!rect) rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    const rebuild = () => { invalidate(); build(); start(); };

    // Two safety nets, because neither alone covers every case:
    //   - resize fires even while the tab is in the background,
    //   - ResizeObserver also catches a hero that had no layout yet on load
    //     (background tab) or that changes size without the window changing.
    addEventListener("resize", rebuild, { passive: true });
    new ResizeObserver(rebuild).observe(canvas);

    new IntersectionObserver(([en]) => {
      onScreen = en.isIntersecting;
      invalidate();
      onScreen ? start() : stop();
    }).observe(canvas);

    build();
    start();
  }

  /* ---------- Copy-to-clipboard ------------------------------------------ */
  document.addEventListener("click", async (e) => {
    const el = e.target.closest("[data-copy]");
    if (!el) return;
    try {
      await navigator.clipboard.writeText(el.dataset.copy);
      window.toast("Copied to clipboard.", "ok");
    } catch { window.toast("Could not copy — please select it manually.", "err"); }
  });

  /* ---------- Year ------------------------------------------------------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
