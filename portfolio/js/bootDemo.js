/**
 * Standalone boot-particle demo (uniform grid, mock cards, restart).
 * Reuses portfolio/js/boot/* modules; does not drive the real portfolio scene.
 */

import { BOOT_CONFIG } from "./boot/config.js";
import { easeInOutCubic, easeOutQuad, pulseFunction } from "./boot/easing.js";
import { buildRingParticles } from "./boot/ringLayout.js";
import { assignNearestCells } from "./boot/gridLayout.js";
import {
  applyCollisions,
  applyDensityDrift,
  buildDensityField,
  delayFromDistance,
  densityEscapeForce,
  integrateParticle,
  lerp,
  springToward,
} from "./boot/physics.js";

/** Lab-only burst→grid knobs (not shipped on portfolio main). */
const cfg = {
  ...BOOT_CONFIG,
  badgeFadeMs: 280,
  gridSettleMs: 900,
  cardsRevealMs: 420,
  overlapGridToCardsMs: 160,
  burstStaggerMs: 180,
  physDamping: 1.05,
  physWallMargin: 10,
  physWallBounce: 0.7,
  physCollideRadius: 7,
  physCollideStrength: 170,
  physMaxSpeed: 480,
  gridStepFallback: 20,
  gridStaggerMs: 280,
  settleSpring: 6.8,
  settleDamp: 7.8,
  settleLockDist: 1.4,
  settleLockSpeed: 18,
  homingPull: 3.2,
  fillReadyRatio: 1,
  idleJitterAmp: 0.5,
  fillSpawnStartFrac: 0.1,
  fillSpawnEndFrac: 0.52,
  fillSpawnPerSec: 1100,
  fillSpawnNearPx: 5.5,
  fillFadeMs: 220,
  fillTargetRatio: 1,
  fillGraceMs: 600,
  fillSpawnMaxPerFrame: 96,
  densityDrift: 130,
  densityCellPx: 52,
  colorGrid: Object.freeze({ r: 200, g: 200, b: 200 }),
  bg: "#f6f5f8",
};

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
 * @param {number} width
 * @param {number} height
 */
function physOpts(width, height) {
  return {
    damping: cfg.physDamping,
    maxSpeed: cfg.physMaxSpeed,
    wallMargin: cfg.physWallMargin,
    wallBounce: cfg.physWallBounce,
    width,
    height,
  };
}

/**
 * Grid step that always tiles the current viewport (full width/height).
 * @param {number} width
 * @param {number} height
 * @param {number} preferred
 */
export function resolveGridStep(width, height, preferred = cfg.gridStepFallback) {
  const base = Math.max(12, preferred);
  const cols = Math.max(1, Math.round(width / base));
  const rows = Math.max(1, Math.round(height / base));
  // Exact spacing so first/last dots sit on the padded edges.
  const stepX = width / Math.max(1, cols);
  const stepY = height / Math.max(1, rows);
  return Math.max(10, Math.min(stepX, stepY));
}

/**
 * Uniform grid covering the full viewport (edge-to-edge, resolution-aware).
 * @param {number} width
 * @param {number} height
 * @param {number} step
 */
export function buildFullViewportGrid(width, height, step) {
  const s = Math.max(8, step);
  const cols = Math.max(1, Math.round(width / s));
  const rows = Math.max(1, Math.round(height / s));
  const gapX = width / cols;
  const gapY = height / rows;
  /** @type {{ x: number, y: number }[]} */
  const cells = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      cells.push({
        x: gapX * (i + 0.5),
        y: gapY * (j + 0.5),
      });
    }
  }
  return { cells, cols, rows, gapX, gapY };
}

/**
 * @param {ParentNode|null|undefined} root
 * @returns {{ l: number, t: number, r: number, b: number }[]}
 */
export function collectMockCardOccluders(root) {
  if (!root) return [];
  const nodes = root.querySelectorAll("[data-mock-card]");
  /** @type {{ l: number, t: number, r: number, b: number }[]} */
  const rects = [];
  const pad = 4;
  for (const el of nodes) {
    if (!(el instanceof HTMLElement)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    rects.push({
      l: r.left - pad,
      t: r.top - pad,
      r: r.right + pad,
      b: r.bottom + pad,
    });
  }
  return rects;
}

/**
 * @param {number} x
 * @param {number} y
 * @param {{ l: number, t: number, r: number, b: number }[]} rects
 */
function isUnderObject(x, y, rects) {
  for (let i = 0; i < rects.length; i++) {
    const box = rects[i];
    if (x >= box.l && x <= box.r && y >= box.t && y <= box.b) return true;
  }
  return false;
}

/**
 * Mount reverse-particle boot animation in demo mode (uniform grid).
 *
 * @param {HTMLElement} rootEl boot-loader host
 * @param {{
 *   demoRoot?: HTMLElement|null,
 *   cardsRoot?: HTMLElement|null,
 *   onStage?: (stage: string) => void,
 *   onProgress?: (pct: number) => void,
 *   onComplete?: () => void,
 *   gridStep?: number,
 * }} [options]
 */
export function mountBootDemo(rootEl, options = {}) {
  const demoRoot = options.demoRoot || null;
  const cardsRoot = options.cardsRoot || null;
  const onStage = typeof options.onStage === "function" ? options.onStage : () => {};
  const onProgress =
    typeof options.onProgress === "function" ? options.onProgress : () => {};
  const onComplete =
    typeof options.onComplete === "function" ? options.onComplete : () => {};
  const preferredStep = Math.max(
    8,
    Number(options.gridStep) || cfg.gridStepFallback
  );

  const canvas =
    /** @type {HTMLCanvasElement} */ (
      rootEl.querySelector(".boot-loader__canvas")
    ) || document.createElement("canvas");
  if (!canvas.classList.contains("boot-loader__canvas")) {
    canvas.className = "boot-loader__canvas";
    rootEl.prepend(canvas);
  }
  const badge =
    /** @type {HTMLElement} */ (rootEl.querySelector(".boot-loader__badge")) ||
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
    onStage("done");
    onComplete();
    return { restart() {}, destroy() {} };
  }

  /** @type {import('./boot/ringLayout.js').BootParticle[]} */
  let particles = [];
  let displayProgress = 0;
  let targetProgress = 0;
  let assetsReady = false;
  /** @type {'loading'|'burst'|'gridSettle'|'cardsReveal'|'done'} */
  let stage = "loading";
  let stageT0 = performance.now();
  let loadingStartedAt = performance.now();
  let raf = 0;
  let softTimer = 0;
  let dpr = 1;
  let w = 0;
  let h = 0;
  let cx = 0;
  let cy = 0;
  let waveTimeMs = 0;
  let gridEarly = false;
  let cardsEarly = false;
  let gridR = 2;
  /** Target particle count ≈ full uniform grid. */
  let fillTargetCount = 0;
  let spawnAcc = 0;
  let liveStep = preferredStep;
  /** @type {{ x: number, y: number }[]} */
  let gridCells = [];
  let colorBlend = 0;
  let homingAssigned = false;
  let physicsTick = 0;
  /** @type {{ l: number, t: number, r: number, b: number }[]} */
  let occluders = [];
  let occluderFrame = 0;
  let destroyed = false;
  let last = performance.now();

  /**
   * @param {'loading'|'burst'|'gridSettle'|'cardsReveal'|'done'} next
   */
  function setStage(next) {
    stage = next;
    onStage(next);
  }

  function resetCards() {
    if (demoRoot) demoRoot.classList.remove("is-cards-in");
    if (cardsRoot) cardsRoot.setAttribute("aria-hidden", "true");
  }

  function revealCards() {
    if (demoRoot) demoRoot.classList.add("is-cards-in");
    if (cardsRoot) cardsRoot.setAttribute("aria-hidden", "false");
    occluders = collectMockCardOccluders(cardsRoot || demoRoot);
  }

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

  function refreshGridLayout() {
    liveStep = resolveGridStep(w, h, preferredStep);
    const packed = buildFullViewportGrid(w, h, liveStep);
    gridCells = packed.cells;
    fillTargetCount = Math.max(
      particles.length,
      Math.round(gridCells.length * cfg.fillTargetRatio)
    );
    gridR = Math.max(1.15, Math.min(2.4, Math.min(packed.gapX, packed.gapY) * 0.12));
  }

  function beginBurst() {
    setStage("burst");
    stageT0 = performance.now();
    gridEarly = false;
    spawnAcc = 0;
    colorBlend = 0;
    homingAssigned = false;
    physicsTick = 0;
    rootEl.classList.add("is-fading-badge", "is-forming-grid");
    rootEl.style.backgroundColor = cfg.bg;
    refreshGridLayout();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.startX = p.x;
      p.startY = p.y;
      const dx = p.x - cx;
      const dy = p.y - cy;
      const len = Math.hypot(dx, dy) || 1;
      const nx = dx / len;
      const ny = dy / len;
      const tx = -ny;
      const ty = nx;
      const impulse =
        cfg.burstImpulseMin +
        Math.random() * (cfg.burstImpulseMax - cfg.burstImpulseMin);
      const tang = (Math.random() * 2 - 1) * cfg.burstTangentJitter;
      p.vx = nx * impulse + tx * tang;
      p.vy = ny * impulse + ty * tang;
      p.delay = Math.random() * cfg.burstStaggerMs;
      p.opacity = 0.72;
      p.scale = 1;
      p.heat = 0;
      p.burstX = p.x;
      p.burstY = p.y;
      /** @type {any} */ (p).fillBornAt = 0;
      /** @type {any} */ (p).hasHome = false;
      /** @type {any} */ (p).homeBlend = 0;
    }
  }

  /**
   * Mid-burst only: grow swarm while chaos is already happening.
   * @param {number} now
   * @param {number} dt
   * @param {number} elapsed
   * @param {{ field: Float32Array, cols: number, rows: number, cellSize: number }} dens
   */
  function spawnFillParticles(now, dt, elapsed, dens) {
    const startMs = cfg.burstMs * cfg.fillSpawnStartFrac;
    const endMs = cfg.burstMs * cfg.fillSpawnEndFrac;
    if (elapsed < startMs || elapsed > endMs) return;

    const deficit = fillTargetCount - particles.length;
    if (deficit <= 0 || !particles.length) return;

    const windowSec = Math.max(0.35, (endMs - startMs) / 1000);
    const adaptive = deficit / windowSec;
    const rate = Math.max(cfg.fillSpawnPerSec, Math.min(2200, adaptive));
    spawnAcc += dt * rate;
    const maxPerFrame = Math.min(
      cfg.fillSpawnMaxPerFrame,
      Math.max(1, deficit)
    );
    let spawned = 0;
    while (
      spawnAcc >= 1 &&
      spawned < maxPerFrame &&
      particles.length < fillTargetCount
    ) {
      spawnAcc -= 1;
      spawned += 1;

      const parent = particles[(Math.random() * particles.length) | 0];
      const escape = densityEscapeForce(parent.x, parent.y, dens);
      const ang =
        Math.atan2(escape.y, escape.x) + (Math.random() - 0.5) * 1.1;
      const near = 3 + Math.random() * cfg.fillSpawnNearPx;
      const x = Math.min(w - 8, Math.max(8, parent.x + Math.cos(ang) * near));
      const y = Math.min(h - 8, Math.max(8, parent.y + Math.sin(ang) * near));
      const bodyOpacity = Math.max(0.58, parent.opacity || 0.7);

      particles.push({
        ...parent,
        x,
        y,
        homeX: x,
        homeY: y,
        startX: x,
        startY: y,
        ctrlX: x,
        ctrlY: y,
        burstX: x,
        burstY: y,
        gridX: x,
        gridY: y,
        targetX: x,
        targetY: y,
        vx: parent.vx * 0.55 + escape.x * 110 + (Math.random() - 0.5) * 50,
        vy: parent.vy * 0.55 + escape.y * 110 + (Math.random() - 0.5) * 50,
        delay: 0,
        opacity: bodyOpacity * 0.9,
        heat: 0,
        scale: 1,
        r: parent.baseR,
        baseR: parent.baseR,
        fadeIn: false,
        fillBornAt: now,
        fillTargetOpacity: bodyOpacity,
        hasHome: false,
        homeBlend: 0,
      });
    }
  }

  /**
   * Assign seats from the mid-burst swarm only (no late cloning).
   */
  function beginGridSettle() {
    if (stage === "gridSettle" || stage === "cardsReveal" || stage === "done") {
      return;
    }
    setStage("gridSettle");
    stageT0 = performance.now();
    cardsEarly = false;
    rootEl.classList.add("is-aligning-grid");
    refreshGridLayout();

    const cells = gridCells;
    /** @type {{ x: number, y: number }[]} */
    const seeds = particles.map((p) => ({ x: p.x, y: p.y }));
    const map = assignNearestCells(seeds, cells);
    /** @type {import('./boot/ringLayout.js').BootParticle[]} */
    const next = [];
    const taken = new Set();

    for (let si = 0; si < particles.length; si++) {
      const ci = map[si];
      if (ci == null || taken.has(ci)) continue;
      taken.add(ci);
      const p = particles[si];
      const cell = cells[ci];
      const dist = Math.hypot(p.x - cell.x, p.y - cell.y);
      next.push({
        ...p,
        startX: p.x,
        startY: p.y,
        gridX: cell.x,
        gridY: cell.y,
        targetX: cell.x,
        targetY: cell.y,
        delay: delayFromDistance(dist, cfg.gridStaggerMs, 0.28),
        r: p.baseR,
        baseR: p.baseR,
        heat: 0,
        scale: 1,
        fadeIn: false,
        fillBornAt: 0,
        hasHome: true,
        homeBlend: 0,
        vx: p.vx * 0.55,
        vy: p.vy * 0.55,
        opacity: Math.max(0.62, p.opacity),
      });
    }

    particles = next;
  }

  /** Soft early seat assignment — once only (avoids frame stalls). */
  function assignHomingTargets() {
    if (homingAssigned) return;
    if (!gridCells.length) refreshGridLayout();
    const cells = gridCells;
    if (particles.length < cells.length * 0.92) return;
    const seeds = particles.map((p) => ({ x: p.x, y: p.y }));
    const map = assignNearestCells(seeds, cells);
    const taken = new Set();
    for (let si = 0; si < particles.length; si++) {
      const ci = map[si];
      if (ci == null || taken.has(ci)) continue;
      taken.add(ci);
      const p = particles[si];
      const cell = cells[ci];
      p.gridX = cell.x;
      p.gridY = cell.y;
      p.targetX = cell.x;
      p.targetY = cell.y;
      /** @type {any} */ (p).hasHome = true;
    }
    homingAssigned = true;
  }

  function beginCardsReveal() {
    if (stage === "cardsReveal" || stage === "done") return;
    setStage("cardsReveal");
    stageT0 = performance.now();
    colorBlend = 0;
    for (const p of particles) {
      p.x = p.gridX;
      p.y = p.gridY;
      p.vx = 0;
      p.vy = 0;
      p.opacity = Math.max(0.55, Math.min(0.78, p.opacity));
    }
    rootEl.style.backgroundColor = cfg.bg;
    requestAnimationFrame(() => {
      revealCards();
      occluders = collectMockCardOccluders(cardsRoot || demoRoot);
    });
  }

  function beginDone() {
    if (stage === "done") return;
    setStage("done");
    colorBlend = 1;
    rootEl.classList.add("is-done");
    rootEl.setAttribute("aria-busy", "false");
    onComplete();
  }

  /**
   * @param {number} now
   * @param {number} dt
   */
  function step(now, dt) {
    displayProgress = lerp(
      displayProgress,
      targetProgress,
      1 - Math.exp(-dt * 2.1)
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
      onProgress(clamped);

      for (const p of particles) {
        const phase =
          ((waveTimeMs - p.ringRadius / cfg.waveSpeedPxPerMs) %
            cfg.waveIntervalMs +
            cfg.waveIntervalMs) %
          cfg.waveIntervalMs;
        const crestDist =
          phase > cfg.waveIntervalMs * 0.5
            ? phase - cfg.waveIntervalMs
            : phase;
        const pulse = pulseFunction(crestDist, cfg.wavePulseWidthMs);
        p.x = p.homeX;
        p.y = p.homeY;
        p.vx = 0;
        p.vy = 0;
        p.heat = pulse;
        p.scale = 1 + 0.14 * pulse;
        p.r = p.baseR * p.scale;
        p.opacity = Math.min(
          1,
          (0.32 + 0.5 * (1 - p.ring / cfg.ringCount)) * (0.82 + 0.28 * pulse)
        );
      }

      const loadingElapsed = now - loadingStartedAt;
      if (
        assetsReady &&
        loadingElapsed >= cfg.loadingMinMs &&
        (displayProgress >= 99.2 || loadingElapsed >= cfg.loadingMaxMs)
      ) {
        if (pctEl) pctEl.textContent = "100%";
        onProgress(100);
        beginBurst();
      }
    } else if (stage === "burst") {
      const elapsed = now - stageT0;
      const opts = physOpts(w, h);
      physicsTick += 1;
      /** @type {typeof particles} */
      const active = [];

      for (const p of particles) {
        if (elapsed < p.delay) {
          p.x = p.startX;
          p.y = p.startY;
          continue;
        }
        const bornAt = /** @type {any} */ (p).fillBornAt || 0;
        if (bornAt > 0) {
          const ft = Math.min(1, (now - bornAt) / cfg.fillFadeMs);
          const target = /** @type {any} */ (p).fillTargetOpacity || 0.7;
          p.opacity = lerp(target * 0.9, target, easeOutQuad(ft));
        } else {
          p.opacity = 0.72;
        }
        p.heat = 0;
        p.scale = 1;
        p.r = p.baseR;
        active.push(p);
      }

      const dens = buildDensityField(active, w, h, cfg.densityCellPx);
      spawnFillParticles(now, dt, elapsed, dens);

      /** @type {typeof particles} */
      const moving = [];
      for (const p of particles) {
        if (elapsed < p.delay) continue;
        moving.push(p);
      }

      // Heavy physics every 2nd frame — keeps mid-swarm smooth on large grids.
      if (physicsTick % 2 === 0) {
        const densLive = buildDensityField(moving, w, h, cfg.densityCellPx);
        applyDensityDrift(moving, dt * 2, densLive, cfg.densityDrift);
        applyCollisions(moving, dt * 2, {
          radius: cfg.physCollideRadius,
          strength: cfg.physCollideStrength,
        });
      }

      const fillRatio =
        fillTargetCount > 0 ? particles.length / fillTargetCount : 0;
      const pastMid = elapsed > cfg.burstMs * cfg.fillSpawnEndFrac;
      if (fillRatio >= 0.92 && pastMid) {
        assignHomingTargets();
        if (homingAssigned) {
          const pullT = easeOutQuad(
            Math.min(
              1,
              (elapsed - cfg.burstMs * cfg.fillSpawnEndFrac) /
                Math.max(120, cfg.burstMs * 0.35)
            )
          );
          for (const p of moving) {
            if (!/** @type {any} */ (p).hasHome) continue;
            const blend = pullT * 0.6;
            p.vx += (p.gridX - p.x) * cfg.homingPull * blend * dt;
            p.vy += (p.gridY - p.y) * cfg.homingPull * blend * dt;
          }
        }
      }

      for (const p of moving) {
        integrateParticle(p, dt, opts);
      }

      const filled =
        fillTargetCount > 0 &&
        particles.length >= Math.ceil(fillTargetCount * cfg.fillReadyRatio);
      const minBurst = Math.max(0, cfg.burstMs - cfg.overlapBurstToGridMs);
      const maxBurst = cfg.burstMs + cfg.fillGraceMs;

      if (!gridEarly && elapsed >= minBurst && filled && pastMid) {
        gridEarly = true;
        beginGridSettle();
      } else if (!gridEarly && elapsed >= maxBurst && pastMid) {
        beginGridSettle();
      }
    }

    if (stage === "gridSettle") {
      const elapsed = now - stageT0;
      const opts = physOpts(w, h);
      let locked = 0;
      let movingN = 0;
      physicsTick += 1;

      // Skip collisions late — they cause the end stutter with thousands of dots.
      if (physicsTick % 3 === 0 && elapsed < cfg.gridSettleMs * 0.55) {
        applyCollisions(particles, dt * 3, {
          radius: cfg.physCollideRadius * 0.65,
          strength: cfg.physCollideStrength * 0.2,
        });
      }

      for (const p of particles) {
        const localT = Math.max(0, elapsed - p.delay);
        const dur = Math.max(1, cfg.gridSettleMs - p.delay);
        const u = easeInOutCubic(Math.min(1, localT / dur));

        if (localT <= 0) {
          integrateParticle(p, dt, {
            ...opts,
            damping: cfg.physDamping * 1.15,
          });
          movingN += 1;
          continue;
        }

        const guide = 0.35 + 0.65 * u;
        springToward(p, p.gridX, p.gridY, dt, {
          spring: cfg.settleSpring * guide,
          damp: cfg.settleDamp,
        });

        const pathX = lerp(p.startX, p.gridX, u);
        const pathY = lerp(p.startY, p.gridY, u);
        p.x = lerp(p.x, pathX, 0.22 * u);
        p.y = lerp(p.y, pathY, 0.22 * u);

        const m = cfg.physWallMargin;
        p.x = Math.min(w - m, Math.max(m, p.x));
        p.y = Math.min(h - m, Math.max(m, p.y));

        p.r = lerp(p.baseR, gridR, u);
        p.opacity = Math.max(0.62, p.opacity);
        p.heat = 0;

        const dist = Math.hypot(p.gridX - p.x, p.gridY - p.y);
        const speed = Math.hypot(p.vx, p.vy);
        if (u > 0.85 || (dist < cfg.settleLockDist && speed < cfg.settleLockSpeed)) {
          p.x = lerp(p.x, p.gridX, 0.45);
          p.y = lerp(p.y, p.gridY, 0.45);
          p.vx *= 0.55;
          p.vy *= 0.55;
          if (dist < 0.8 || u >= 0.98) {
            p.x = p.gridX;
            p.y = p.gridY;
            p.vx = 0;
            p.vy = 0;
            locked += 1;
          } else {
            movingN += 1;
          }
        } else {
          movingN += 1;
        }
      }

      if (
        !cardsEarly &&
        elapsed >= cfg.gridSettleMs - cfg.overlapGridToCardsMs
      ) {
        cardsEarly = true;
        beginCardsReveal();
      } else if (
        !cardsEarly &&
        ((locked >= particles.length * 0.9 && movingN < particles.length * 0.12) ||
          elapsed >= cfg.gridSettleMs + 120)
      ) {
        beginCardsReveal();
      }
    }

    if (stage === "cardsReveal") {
      const elapsed = now - stageT0;
      colorBlend = easeOutQuad(Math.min(1, elapsed / cfg.cardsRevealMs));
      if (++occluderFrame % 3 === 0) {
        occluders = collectMockCardOccluders(cardsRoot || demoRoot);
      }
      const amp = cfg.idleJitterAmp;
      for (const p of particles) {
        const under = occluders.length
          ? isUnderObject(p.gridX, p.gridY, occluders)
          : false;
        if (under) {
          p.opacity = Math.max(0, p.opacity - dt * 2.2);
          p.x = p.gridX;
          p.y = p.gridY;
        } else {
          p.opacity = Math.min(0.55, Math.max(0.35, p.opacity * 0.985 + 0.01));
          const jx = Math.sin(now * 0.0032 + p.gridX * 0.05) * amp;
          const jy = Math.cos(now * 0.0029 + p.gridY * 0.05) * amp;
          p.x = p.gridX + jx;
          p.y = p.gridY + jy;
        }
      }
      if (elapsed >= cfg.cardsRevealMs) {
        beginDone();
      }
    }

    if (stage === "done") {
      colorBlend = 1;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    rootEl.style.backgroundColor = cfg.bg;
    const hideUnder =
      (stage === "cardsReveal" || stage === "done") && occluders.length > 0;

    for (const p of particles) {
      const a = Math.max(0, Math.min(1, p.opacity));
      if (a <= 0.01) continue;
      if (hideUnder && isUnderObject(p.x, p.y, occluders)) continue;

      let col = cfg.colorHot;
      if (stage === "loading") {
        col = lerpColor(cfg.colorDim, cfg.colorHot, p.heat);
      } else if (stage === "cardsReveal" || stage === "done") {
        col = lerpColor(cfg.colorHot, cfg.colorGrid, colorBlend);
      } else {
        col = cfg.colorHot;
      }
      ctx.beginPath();
      ctx.fillStyle =
        "rgba(" +
        (col.r | 0) +
        "," +
        (col.g | 0) +
        "," +
        (col.b | 0) +
        "," +
        a +
        ")";
      ctx.arc(p.x, p.y, Math.max(0.4, p.r), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(now) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (stage !== "done") step(now, dt);
    draw();
    raf = requestAnimationFrame(frame);
  }

  function clearTimers() {
    if (softTimer) {
      clearInterval(softTimer);
      softTimer = 0;
    }
  }

  function startSoftProgress() {
    clearTimers();
    softTimer = window.setInterval(() => {
      if (stage !== "loading" || assetsReady) return;
      const t = (performance.now() - loadingStartedAt) / cfg.loadingMaxMs;
      targetProgress = Math.max(
        targetProgress,
        Math.min(
          cfg.progressCapWhileLoading,
          easeOutQuad(t) * cfg.progressCapWhileLoading
        )
      );
    }, 50);
  }

  function armReady() {
    // Simulated load: reach ~cap then mark ready after min loading window.
    const arm = window.setInterval(() => {
      if (destroyed) {
        clearInterval(arm);
        return;
      }
      if (stage !== "loading") {
        clearInterval(arm);
        return;
      }
      const elapsed = performance.now() - loadingStartedAt;
      if (elapsed >= cfg.loadingMinMs * 0.85) {
        targetProgress = 100;
        assetsReady = true;
        clearInterval(arm);
      }
    }, 40);
  }

  function resetVisualClasses() {
    rootEl.classList.remove(
      "is-fading-badge",
      "is-forming-grid",
      "is-aligning-grid",
      "is-done",
      "is-scene-front"
    );
    rootEl.classList.add("is-visible");
    rootEl.hidden = false;
    rootEl.removeAttribute("hidden");
    rootEl.setAttribute("aria-busy", "true");
    rootEl.style.backgroundColor = cfg.bg;
    rootEl.style.zIndex = "";
    if (pctEl) pctEl.textContent = "0%";
    resetCards();
  }

  function restart() {
    cancelAnimationFrame(raf);
    clearTimers();
    destroyed = false;
    particles = [];
    displayProgress = 0;
    targetProgress = 0;
    assetsReady = false;
    waveTimeMs = 0;
    gridEarly = false;
    cardsEarly = false;
    fillTargetCount = 0;
    spawnAcc = 0;
    colorBlend = 0;
    homingAssigned = false;
    physicsTick = 0;
    gridCells = [];
    occluders = [];
    occluderFrame = 0;
    last = performance.now();
    loadingStartedAt = performance.now();
    stageT0 = loadingStartedAt;
    resetVisualClasses();
    setStage("loading");
    onProgress(0);
    resize();
    rebuildRings();
    startSoftProgress();
    armReady();
    raf = requestAnimationFrame(frame);
  }

  function destroy() {
    destroyed = true;
    cancelAnimationFrame(raf);
    clearTimers();
    window.removeEventListener("resize", resize);
  }

  resetVisualClasses();
  setStage("loading");
  resize();
  window.addEventListener("resize", resize);
  startSoftProgress();
  armReady();
  raf = requestAnimationFrame(frame);

  return { restart, destroy };
}

function bootDemoPage() {
  const demoRoot = document.getElementById("boot-demo");
  const rootEl = document.getElementById("boot-loader");
  const cardsRoot = document.getElementById("boot-demo-cards");
  const stageEl = document.getElementById("boot-demo-stage");
  const progressEl = document.getElementById("boot-demo-progress");
  const statusEl = document.getElementById("boot-demo-status");
  const restartBtn = document.getElementById("boot-demo-restart");

  if (!(demoRoot instanceof HTMLElement) || !(rootEl instanceof HTMLElement)) {
    return;
  }

  const api = mountBootDemo(rootEl, {
    demoRoot,
    cardsRoot: cardsRoot instanceof HTMLElement ? cardsRoot : null,
    onStage(stage) {
      if (stageEl) stageEl.textContent = stage;
      if (statusEl && stage !== "done") statusEl.textContent = "running";
    },
    onProgress(pct) {
      if (progressEl) progressEl.textContent = `${pct}%`;
    },
    onComplete() {
      if (statusEl) statusEl.textContent = "complete";
    },
  });

  if (restartBtn instanceof HTMLButtonElement) {
    restartBtn.addEventListener("click", () => {
      if (statusEl) statusEl.textContent = "running";
      api.restart();
    });
  }
}

if (typeof document !== "undefined" && typeof document.getElementById === "function") {
  const hasDemoHost = Boolean(document.getElementById("boot-demo"));
  if (hasDemoHost) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bootDemoPage, { once: true });
    } else {
      bootDemoPage();
    }
  }
}
