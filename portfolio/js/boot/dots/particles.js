/**
 * Particle state and per-frame drawing for the dots boot animation.
 *
 * A particle is always a dot: the blast only moves it, resizes it and recolors
 * it. State lives in flat Float32Arrays and is drawn in one pass.
 */
import { DOTS_CONFIG } from "./config.js";
import { buildGrid, buildRings, orderNodes, ringCapacity } from "./layout.js";

const TAU = Math.PI * 2;

// Gray strings are cached: building them per dot per frame would mean thousands
// of concatenations every 16ms.
const GRAY = Array.from({ length: 256 }, (_, v) => `rgb(${v},${v},${v})`);

/** Blast: instant launch, long settle. */
const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
/** Peak: 0 at both ends, crest in the first third — drives overshoot and flare. */
const bump = (t) => Math.sin(Math.PI * Math.pow(t, 0.55));

/**
 * Builds particle state: ring start position and grid node target.
 *
 * @param {number} width
 * @param {number} height
 * @param {typeof DOTS_CONFIG} [cfg]
 */
export function buildParticles(width, height, cfg = DOTS_CONFIG) {
  const cx = width / 2;
  const cy = height / 2;
  const grid = buildGrid(width, height, cfg.cell, cfg.gridOffsetX, cfg.gridOffsetY);
  const count = grid.nodes.length / 2;

  const inner = Math.min(cfg.ringsInnerRadius, Math.min(width, height) * 0.4);
  const maxRadius = Math.max(inner + cfg.cell, Math.min(width, height) * cfg.ringsRadiusRatio);

  // There may be fewer ring dots than grid nodes: ring density is set on its own,
  // otherwise a dense grid would demand indistinguishably dense rings. The missing
  // dots are born during the blast, each out of its parent in the rings.
  const ringTotal =
    cfg.ringStep > 0
      ? Math.max(1, Math.min(count, ringCapacity(inner, maxRadius, cfg.ringStep)))
      : count;

  const { points } = buildRings(ringTotal, maxRadius, inner);
  const order = orderNodes(grid.nodes, cx, cy, grid.cell);

  const x0 = new Float32Array(count);
  const y0 = new Float32Array(count);
  const tx = new Float32Array(count);
  const ty = new Float32Array(count);
  const radius = new Float32Array(count);
  const rNorm = new Float32Array(count);
  const born = new Uint8Array(count);

  for (let i = 0; i < count; i++) {
    // Ring source for this target. Both sets are sorted by radius then angle, so
    // neighbouring grid nodes share a parent.
    const src = Math.floor((i * ringTotal) / count);
    born[i] = i > 0 && Math.floor(((i - 1) * ringTotal) / count) === src ? 1 : 0;

    x0[i] = cx + points[src * 3];
    y0[i] = cy + points[src * 3 + 1];
    radius[i] = points[src * 3 + 2];
    // 0 at the inner ring edge, 1 at the outer one, so the wave front does not
    // depend on whether the middle is empty.
    rNorm[i] = maxRadius > inner ? (radius[i] - inner) / (maxRadius - inner) : 0;

    const n = order[i] * 2;
    tx[i] = grid.nodes[n];
    ty[i] = grid.nodes[n + 1];
  }

  const scale = Math.min(width, height) / 900;

  return {
    count, x0, y0, tx, ty, radius, rNorm, born,
    cx, cy, scale, grid, maxRadius, inner, ringTotal,
  };
}

/**
 * Full blast duration including the radial stagger.
 *
 * @param {typeof DOTS_CONFIG} [cfg]
 * @returns {number}
 */
export const morphTotal = (cfg = DOTS_CONFIG) => cfg.morphDuration + cfg.morphStagger;

/**
 * Draws one frame.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {ReturnType<typeof buildParticles>} p
 * @param {{ time: number, progress: number, morphT: number }} state
 *        time — ms since scene start (wave phase); progress — 0..1 (wave amplitude
 *        and speed); morphT — ms since the blast started, 0 while loading.
 * @param {typeof DOTS_CONFIG} [cfg]
 */
export function drawParticles(ctx, p, { time, progress, morphT }, cfg = DOTS_CONFIG) {
  const {
    dotRadius, dotRadiusEdgeRatio, gridDotRadius, waveLength,
    waveSpeedMin, waveSpeedMax, waveAmpMin, waveAmpMax,
    colorDark, colorLight, colorGrid, morphDuration, morphStagger,
    explodePush, explodeFlare, explodeFlash, sizeSnap,
    dotAlphaCenter, dotAlphaEdge, dotAlphaStart,
  } = cfg;

  // Dots fade towards the edges and glow up as loading advances.
  const alphaScale = dotAlphaStart + (1 - dotAlphaStart) * progress;

  const speed = waveSpeedMin + (waveSpeedMax - waveSpeedMin) * progress;
  const amp = waveAmpMin + (waveAmpMax - waveAmpMin) * progress;
  const phase = (time / 1000) * speed;

  const push = explodePush * p.scale;

  for (let i = 0; i < p.count; i++) {
    const local =
      morphT > 0 ? clamp01((morphT - p.rNorm[i] * morphStagger) / morphDuration) : 0;
    const m = easeOutQuint(local);
    const blast = local > 0 && local < 1 ? bump(local) : 0;

    // Lightness wave travels outwards from the centre.
    const wave = 0.5 + 0.5 * Math.sin(((p.radius[i] - p.inner) / waveLength - phase) * TAU);
    const shaped = 0.5 + (wave - 0.5) * amp;
    let gray = colorDark + (colorLight - colorDark) * shaped;
    gray += (colorGrid - gray) * m;
    gray -= explodeFlash * blast; // peak flare; negative flash brightens instead

    let x = p.x0[i] + (p.tx[i] - p.x0[i]) * m;
    let y = p.y0[i] + (p.ty[i] - p.y0[i]) * m;

    // Overshoot strictly outwards, measured from the current position rather than
    // the starting one: mid-flight a particle already sits at a different angle.
    if (blast > 0) {
      const dx = x - p.cx;
      const dy = y - p.cy;
      const len = Math.hypot(dx, dy);
      if (len > 1e-6) {
        const k = (push * blast) / len;
        x += dx * k;
        y += dy * k;
      }
    }

    // Dots get smaller towards the ring edges; with the fade this reads as decay.
    const start = dotRadius * (1 + (dotRadiusEdgeRatio - 1) * p.rNorm[i]);

    // Size reaches its final value ahead of position: dots fly already sized as
    // they will land, so nothing "arrives late" at the end.
    const sized = sizeSnap >= 1 ? m : easeOutQuint(clamp01(local / sizeSnap));
    const r = start + (gridDotRadius - start) * sized + explodeFlare * blast;

    const alphaBase = dotAlphaCenter + (dotAlphaEdge - dotAlphaCenter) * p.rNorm[i];
    let alpha = alphaBase * alphaScale;

    // Born dots surface early in the flight, while everything is moving and
    // flaring — so their arrival does not read as popping out of nowhere.
    if (p.born[i]) {
      const appear = clamp01((local - 0.05) / 0.35);
      if (appear <= 0) continue;
      alpha *= appear;
    }

    ctx.globalAlpha = alpha + (1 - alpha) * m; // dots reach the grid fully opaque
    ctx.fillStyle = GRAY[Math.max(0, Math.min(255, gray)) | 0];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
}

/**
 * Settled grid — the static frame, drawn as a single path.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {ReturnType<typeof buildParticles>} p
 * @param {typeof DOTS_CONFIG} [cfg]
 */
export function drawGrid(ctx, p, cfg = DOTS_CONFIG) {
  const { nodes } = p.grid;
  const r = cfg.gridDotRadius;
  ctx.globalAlpha = 1;
  ctx.fillStyle = GRAY[cfg.colorGrid];
  ctx.beginPath();
  for (let i = 0; i < nodes.length; i += 2) {
    ctx.moveTo(nodes[i] + r, nodes[i + 1]);
    ctx.arc(nodes[i], nodes[i + 1], r, 0, TAU);
  }
  ctx.fill();
}
