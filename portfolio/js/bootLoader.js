/**
 * Boot loader:
 * loading rings (held while assets load) → 100% → particles fly aside → scene.
 *
 * Stages: 'loading' | 'bursting' | 'done'
 */

import { BOOT_CONFIG } from "./boot/config.js";
import {
  easeOutCubic,
  easeOutQuad,
  pulseFunction,
} from "./boot/easing.js";
import { buildRingParticles } from "./boot/ringLayout.js";

export { BOOT_CONFIG };

const cfg = BOOT_CONFIG;

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * @param {{r:number,g:number,b:number}} a
 * @param {{r:number,g:number,b:number}} b
 * @param {number} t
 */
function lerpColor(a, b, t) {
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  };
}

/**
 * @returns {boolean}
 */
function prefersReducedMotion() {
  try {
    return (
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

/**
 * @returns {boolean}
 */
function isEnterCrossfade() {
  try {
    return (
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("portfolio-page-enter") === "crossfade"
    );
  } catch {
    return false;
  }
}

/**
 * Compat export for tests — concentric rings clearing the badge hole.
 * @param {number} cx
 * @param {number} cy
 * @param {number} maxR
 */
export function buildRadialDots(cx, cy, maxR) {
  return buildRingParticles(cx, cy, maxR, cfg).map((d) => ({
    ...d,
    alpha: d.opacity,
    phase: "radial",
    tx: d.x,
    ty: d.y,
  }));
}

const CRITICAL_SLOTS = new Set(["card", "avatar", "macbook.lid", "me"]);

/**
 * @param {ParentNode|null|undefined} root
 * @param {(snap: { done: number, total: number }) => void} [onProgress]
 * @param {{ criticalOnly?: boolean, timeoutMs?: number }} [options]
 * @returns {Promise<{ done: number, total: number }>}
 */
export function watchPortfolioAssets(root, onProgress, options = {}) {
  if (!root || typeof document === "undefined") {
    return Promise.resolve({ done: 1, total: 1 });
  }
  /** @type {HTMLImageElement[]} */
  const all = Array.from(root.querySelectorAll("img")).filter(
    (el) => el instanceof HTMLImageElement
  );
  const critical = all.filter((img) =>
    CRITICAL_SLOTS.has(img.getAttribute("data-media-slot") || "")
  );
  const imgs =
    options.criticalOnly && critical.length > 0 ? critical : all;
  const total = Math.max(1, imgs.length);
  const timeoutMs =
    Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 12000;
  const tick = () => {
    const snap = {
      done: imgs.filter((img) => img.complete).length,
      total,
    };
    if (typeof onProgress === "function") onProgress(snap);
    return snap;
  };

  /**
   * @param {HTMLImageElement} img
   */
  function waitImg(img) {
    try {
      img.decoding = "async";
    } catch {
      /* ignore */
    }
    const slot = img.getAttribute("data-media-slot");
    if (slot === "card" || slot === "avatar") {
      try {
        img.fetchPriority = "high";
      } catch {
        /* ignore */
      }
    }
    const decoded =
      typeof img.decode === "function"
        ? img.decode().catch(() => {})
        : Promise.resolve();
    if (img.complete) {
      return decoded.then(tick);
    }
    return new Promise((resolve) => {
      const done = () => resolve(decoded.then(tick));
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  }

  tick();
  if (imgs.length === 0 || imgs.every((img) => img.complete)) {
    return Promise.all(imgs.map(waitImg)).then(() => tick());
  }
  return Promise.race([
    Promise.all(imgs.map(waitImg)).then(() => tick()),
    new Promise((resolve) => setTimeout(() => resolve(tick()), timeoutMs)),
  ]);
}

/**
 * @param {HTMLElement|null} rootEl
 */
export function mountBootLoader(rootEl) {
  const noop = {
    setProgress() {},
    markReady() {},
    whenFinished: Promise.resolve(),
    skip() {},
  };

  if (!rootEl || typeof document === "undefined") return noop;
  if (prefersReducedMotion() || isEnterCrossfade()) {
    rootEl.hidden = true;
    rootEl.setAttribute("hidden", "");
    document.documentElement?.classList?.remove?.("is-booting");
    return noop;
  }

  const canvas =
    rootEl.querySelector(".boot-loader__canvas") ||
    document.createElement("canvas");
  if (!canvas.classList.contains("boot-loader__canvas")) {
    canvas.className = "boot-loader__canvas";
    rootEl.prepend(canvas);
  }
  const badge =
    rootEl.querySelector(".boot-loader__badge") ||
    (() => {
      const el = document.createElement("div");
      el.className = "boot-loader__badge";
      const pct = document.createElement("span");
      pct.className = "boot-loader__pct";
      pct.textContent = "0%";
      el.appendChild(pct);
      rootEl.appendChild(el);
      return el;
    })();
  const pctEl =
    /** @type {HTMLElement|null} */ (
      rootEl.querySelector(".boot-loader__pct")
    ) || badge.querySelector(".boot-loader__pct");

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    rootEl.hidden = true;
    document.documentElement?.classList?.remove?.("is-booting");
    return noop;
  }

  document.documentElement?.classList?.add?.("is-booting");
  rootEl.hidden = false;
  rootEl.removeAttribute("hidden");
  rootEl.setAttribute("aria-busy", "true");

  /** @type {import('./boot/ringLayout.js').BootParticle[]} */
  let particles = [];
  let displayProgress = 0;
  let targetProgress = 0;
  let assetsReady = false;
  let readyAt = 0;
  let slowShown = false;
  let slowShownAt = 0;
  let slowTimer = 0;
  let softTimer = 0;
  /** @type {'loading'|'bursting'|'done'} */
  let stage = "loading";
  let stageT0 = performance.now();
  let loadingStartedAt = performance.now();
  let raf = 0;
  let settleTimer = 0;
  let dpr = 1;
  let w = 0;
  let h = 0;
  let cx = 0;
  let cy = 0;
  let waveTimeMs = 0;

  /** @type {(v?: void) => void} */
  let resolveFinished = () => {};
  const whenFinished = new Promise((resolve) => {
    resolveFinished = resolve;
  });

  function rebuildRings() {
    const maxR = Math.min(w, h) * 0.48;
    particles = buildRingParticles(cx, cy, maxR, cfg);
  }

  function resize() {
    const rect = rootEl.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h / 2;
    if (stage === "loading") rebuildRings();
  }

  function beginBurst() {
    if (stage === "bursting" || stage === "done") return;
    stage = "bursting";
    stageT0 = performance.now();
    rootEl.classList.add("is-fading-badge");

    const side = cfg.burstSideBias || 1.4;
    const vert = cfg.burstVerticalBias || 0.42;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const nx = Math.cos(p.ringAngle);
      const ny = Math.sin(p.ringAngle);
      const tx = -ny;
      const ty = nx;
      const jitter = (Math.random() * 2 - 1) * cfg.burstTangentJitter;
      const speed = lerp(cfg.burstImpulseMin, cfg.burstImpulseMax, Math.random());
      p.vx = nx * speed * side + tx * jitter;
      p.vy = ny * speed * vert + ty * jitter * 0.35;
      p.startOpacity = p.opacity;
      p.heat = 0;
      p.scale = 1;
      p.r = p.baseR;
    }

    settleTimer = window.setTimeout(() => {
      rootEl.classList.add("is-forming-grid");
      document.documentElement?.classList?.add?.("is-boot-reveal");
    }, Math.max(0, cfg.overlapBurstToGridMs));
  }

  function beginDone() {
    if (stage === "done") return;
    stage = "done";
    rootEl.classList.add("is-done", "is-forming-grid");
    document.documentElement?.classList?.add?.(
      "is-boot-scene-in",
      "is-boot-reveal"
    );
    settleTimer = window.setTimeout(finish, 220);
  }

  function finish() {
    cancelAnimationFrame(raf);
    raf = 0;
    if (settleTimer) {
      clearTimeout(settleTimer);
      settleTimer = 0;
    }
    if (slowTimer) {
      clearTimeout(slowTimer);
      slowTimer = 0;
    }
    if (softTimer) {
      clearInterval(softTimer);
      softTimer = 0;
    }
    window.removeEventListener("resize", resize);
    rootEl.classList.add("is-done");
    rootEl.classList.remove("is-visible");
    rootEl.setAttribute("aria-busy", "false");
    rootEl.hidden = true;
    rootEl.setAttribute("hidden", "");
    document.documentElement?.classList?.add?.("is-boot-reveal");
    document.documentElement?.classList?.remove?.(
      "is-booting",
      "is-boot-slow",
      "is-boot-scene-in"
    );
    requestAnimationFrame(() => {
      document.documentElement?.classList?.remove?.("is-boot-reveal");
    });
    resolveFinished();
  }

  function skip() {
    if (stage === "done") return;
    assetsReady = true;
    targetProgress = 100;
    displayProgress = 100;
    if (settleTimer) {
      clearTimeout(settleTimer);
      settleTimer = 0;
    }
    finish();
  }

  /**
   * @param {number} n
   */
  function setProgress(n) {
    if (!Number.isFinite(n)) return;
    targetProgress = Math.max(
      targetProgress,
      Math.min(cfg.progressCapWhileLoading, n)
    );
  }

  function markReady() {
    if (assetsReady) return;
    assetsReady = true;
    readyAt = performance.now();
    targetProgress = 100;
    if (!slowShown) {
      skip();
    }
  }

  /**
   * @param {number} now
   * @param {number} dt
   */
  function step(now, dt) {
    displayProgress = lerp(
      displayProgress,
      targetProgress,
      1 - Math.exp(-dt * 4.2)
    );

    if (stage === "loading") {
      waveTimeMs += dt * 1000;
      const shown = Math.round(
        assetsReady ? Math.max(displayProgress, 99) : displayProgress
      );
      const clamped = Math.min(
        assetsReady ? 100 : cfg.progressCapWhileLoading,
        Math.max(0, shown)
      );
      if (pctEl) pctEl.textContent = `${clamped}%`;

      // Radius-based sonar: crest travels outward.
      for (const p of particles) {
        const phase =
          ((waveTimeMs - p.ringRadius / cfg.waveSpeedPxPerMs) %
            cfg.waveIntervalMs +
            cfg.waveIntervalMs) %
          cfg.waveIntervalMs;
        // Center phase at 0 crest: map [0, interval] → signed distance to nearest crest
        const crestDist =
          phase > cfg.waveIntervalMs * 0.5
            ? phase - cfg.waveIntervalMs
            : phase;
        const pulse = pulseFunction(crestDist, cfg.wavePulseWidthMs);
        p.x = p.homeX;
        p.y = p.homeY;
        p.heat = pulse;
        p.scale = 1 + 0.28 * pulse;
        p.r = p.baseR * p.scale;
        const ringFade = 0.38 + 0.62 * (1 - p.ring / Math.max(1, cfg.ringCount));
        p.opacity = Math.min(1, ringFade * (0.42 + 0.58 * pulse));
      }

      const pulseHeld = slowShownAt
        ? now - slowShownAt >= cfg.slowPulseMinMs
        : false;
      const readyElapsed = assetsReady ? now - readyAt : 0;
      if (
        slowShown &&
        assetsReady &&
        pulseHeld &&
        (displayProgress >= 99.2 || readyElapsed >= 480)
      ) {
        if (pctEl) pctEl.textContent = "100%";
        beginBurst();
      }
    }

    if (stage === "bursting") {
      const elapsed = now - stageT0;
      const u = easeOutCubic(Math.min(1, elapsed / Math.max(1, cfg.burstMs)));
      const damp = Math.exp(-0.48 * dt);
      for (const p of particles) {
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.opacity = lerp(p.startOpacity ?? 0.5, 0, u);
        p.r = p.baseR * (1 - 0.25 * u);
        p.heat = 0;
      }
      if (elapsed >= cfg.burstMs) {
        beginDone();
      }
    }
  }

  /**
   * @param {number} now
   */
  function draw(now) {
    if (stage === "done") return;
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      const a = Math.max(0, Math.min(1, p.opacity));
      if (a <= 0.01) continue;
      const col =
        stage === "loading"
          ? lerpColor(cfg.colorDim, cfg.colorHot, p.heat)
          : cfg.colorDim;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${col.r | 0},${col.g | 0},${col.b | 0},${a})`;
      ctx.arc(p.x, p.y, Math.max(0.4, p.r), 0, Math.PI * 2);
      ctx.fill();
    }
    void now;
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (stage === "done") return;
    step(now, dt);
    draw(now);
    if (stage !== "done") raf = requestAnimationFrame(frame);
  }

  function revealSlowLoader() {
    if (slowShown || stage === "done") return;
    if (assetsReady) {
      skip();
      return;
    }
    slowShown = true;
    slowShownAt = performance.now();
    document.documentElement?.classList?.add?.("is-boot-slow");
    rootEl.classList.add("is-visible");
    resize();
    window.addEventListener("resize", resize);
    last = performance.now();
    if (!raf) raf = requestAnimationFrame(frame);
    if (!softTimer) {
      softTimer = setInterval(() => {
        if (stage !== "loading" || assetsReady) return;
        const t = (performance.now() - loadingStartedAt) / cfg.loadingMaxMs;
        targetProgress = Math.max(
          targetProgress,
          Math.min(
            cfg.progressCapWhileLoading,
            easeOutQuad(t) * cfg.progressCapWhileLoading
          )
        );
      }, 80);
    }
  }

  const waitSlow = Math.max(0, cfg.slowLoadMs - performance.now());
  slowTimer = window.setTimeout(revealSlowLoader, waitSlow);

  return {
    setProgress,
    markReady,
    whenFinished,
    skip() {
      skip();
    },
  };
}

/**
 * @param {HTMLElement|null} viewportEl
 * @param {HTMLElement|null} [loaderEl]
 */
export async function runPortfolioBoot(viewportEl, loaderEl) {
  const root =
    loaderEl ||
    (typeof document !== "undefined"
      ? document.getElementById("boot-loader")
      : null);
  const loader = mountBootLoader(/** @type {HTMLElement|null} */ (root));

  const t0 = performance.now();
  let lastSnap = { done: 0, total: 1 };
  const report = (done, total) => {
    lastSnap = { done, total };
    const elapsed = performance.now() - t0;
    const timeSoft = Math.min(
      cfg.progressCapWhileLoading,
      easeOutQuad(elapsed / cfg.loadingMaxMs) * cfg.progressCapWhileLoading
    );
    const assetPct =
      total > 0 ? (done / total) * cfg.progressCapWhileLoading : 0;
    loader.setProgress(Math.max(timeSoft, assetPct));
  };
  const pulse = setInterval(() => {
    report(lastSnap.done, lastSnap.total);
  }, 80);

  try {
    const images = watchPortfolioAssets(
      viewportEl,
      (snap) => {
        report(snap.done, snap.total);
      },
      { criticalOnly: true, timeoutMs: 12000 }
    );

    await Promise.race([
      images,
      new Promise((r) => setTimeout(r, 12000)),
    ]);
    loader.markReady();
    await loader.whenFinished;
  } catch {
    loader.markReady();
    await loader.whenFinished;
  } finally {
    clearInterval(pulse);
  }
}
