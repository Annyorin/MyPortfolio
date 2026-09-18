/**
 * Lightweight 2D particle physics for boot burst / settle.
 * Wall bounce + soft pairwise repulsion via spatial hash.
 */

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp speed and integrate with exponential damping.
 *
 * @param {{ x: number, y: number, vx: number, vy: number, r?: number }} p
 * @param {number} dt
 * @param {{
 *   damping: number,
 *   maxSpeed: number,
 *   wallMargin: number,
 *   wallBounce: number,
 *   width: number,
 *   height: number,
 * }} opts
 */
export function integrateParticle(p, dt, opts) {
  const maxSp = opts.maxSpeed;
  let sp = Math.hypot(p.vx, p.vy);
  if (sp > maxSp && sp > 0) {
    const s = maxSp / sp;
    p.vx *= s;
    p.vy *= s;
    sp = maxSp;
  }

  const damp = Math.exp(-opts.damping * dt);
  p.vx *= damp;
  p.vy *= damp;

  p.x += p.vx * dt;
  p.y += p.vy * dt;

  const m = opts.wallMargin;
  const bounce = opts.wallBounce;
  if (p.x < m) {
    p.x = m;
    p.vx = Math.abs(p.vx) * bounce;
  } else if (p.x > opts.width - m) {
    p.x = opts.width - m;
    p.vx = -Math.abs(p.vx) * bounce;
  }
  if (p.y < m) {
    p.y = m;
    p.vy = Math.abs(p.vy) * bounce;
  } else if (p.y > opts.height - m) {
    p.y = opts.height - m;
    p.vy = -Math.abs(p.vy) * bounce;
  }
}

/**
 * Soft repulsion between nearby particles (spatial hash).
 *
 * @param {{ x: number, y: number, vx: number, vy: number }[]} particles
 * @param {number} dt
 * @param {{ radius: number, strength: number }} opts
 */
export function applyCollisions(particles, dt, opts) {
  const n = particles.length;
  if (n < 2) return;

  const cell = Math.max(4, opts.radius * 2);
  /** @type {Map<string, number[]>} */
  const buckets = new Map();

  for (let i = 0; i < n; i++) {
    const p = particles[i];
    const ix = Math.floor(p.x / cell);
    const iy = Math.floor(p.y / cell);
    const key = `${ix},${iy}`;
    const list = buckets.get(key);
    if (list) list.push(i);
    else buckets.set(key, [i]);
  }

  const r = opts.radius;
  const r2 = r * r;
  const strength = opts.strength;

  for (let i = 0; i < n; i++) {
    const a = particles[i];
    const ix = Math.floor(a.x / cell);
    const iy = Math.floor(a.y / cell);
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        const list = buckets.get(`${ix + ox},${iy + oy}`);
        if (!list) continue;
        for (let k = 0; k < list.length; k++) {
          const j = list[k];
          if (j <= i) continue;
          const b = particles[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d2 = dx * dx + dy * dy;
          if (d2 >= r2 || d2 < 1e-8) continue;
          const d = Math.sqrt(d2);
          const overlap = r - d;
          const nx = dx / d;
          const ny = dy / d;
          const push = overlap * strength * dt;
          a.vx -= nx * push;
          a.vy -= ny * push;
          b.vx += nx * push;
          b.vy += ny * push;
          // Separate positions slightly to reduce sticky clumps.
          const sep = overlap * 0.35;
          a.x -= nx * sep;
          a.y -= ny * sep;
          b.x += nx * sep;
          b.y += ny * sep;
        }
      }
    }
  }
}

/**
 * Critically-damped-ish spring toward a target point.
 *
 * @param {{ x: number, y: number, vx: number, vy: number }} p
 * @param {number} tx
 * @param {number} ty
 * @param {number} dt
 * @param {{ spring: number, damp: number }} opts
 */
export function springToward(p, tx, ty, dt, opts) {
  const ax = (tx - p.x) * opts.spring - p.vx * opts.damp;
  const ay = (ty - p.y) * opts.spring - p.vy * opts.damp;
  p.vx += ax * dt;
  p.vy += ay * dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
}

/**
 * @param {number} dist
 * @param {number} maxDelay
 * @param {number} [pxPerMs=0.45]
 */
export function delayFromDistance(dist, maxDelay, pxPerMs = 0.45) {
  return Math.min(maxDelay, Math.max(0, dist * pxPerMs));
}

/**
 * Coarse occupancy field for spreading particles into empty screen areas.
 *
 * @param {{ x: number, y: number }[]} particles
 * @param {number} width
 * @param {number} height
 * @param {number} cellSize
 */
export function buildDensityField(particles, width, height, cellSize) {
  const cs = Math.max(16, cellSize);
  const cols = Math.max(1, Math.ceil(width / cs));
  const rows = Math.max(1, Math.ceil(height / cs));
  const field = new Float32Array(cols * rows);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const ix = Math.min(cols - 1, Math.max(0, Math.floor(p.x / cs)));
    const iy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / cs)));
    field[iy * cols + ix] += 1;
  }
  return { field, cols, rows, cellSize: cs };
}

/**
 * Unit-ish force pointing toward lower local density (escape from clumps).
 *
 * @param {number} x
 * @param {number} y
 * @param {{ field: Float32Array, cols: number, rows: number, cellSize: number }} dens
 * @returns {{ x: number, y: number }}
 */
export function densityEscapeForce(x, y, dens) {
  const { field, cols, rows, cellSize } = dens;
  const ix = Math.min(cols - 1, Math.max(0, Math.floor(x / cellSize)));
  const iy = Math.min(rows - 1, Math.max(0, Math.floor(y / cellSize)));
  const here = field[iy * cols + ix] || 0;
  let best = here;
  let bx = 0;
  let by = 0;
  for (let oy = -1; oy <= 1; oy++) {
    for (let ox = -1; ox <= 1; ox++) {
      if (!ox && !oy) continue;
      const jx = ix + ox;
      const jy = iy + oy;
      if (jx < 0 || jy < 0 || jx >= cols || jy >= rows) continue;
      const v = field[jy * cols + jx] || 0;
      if (v < best) {
        best = v;
        bx = ox;
        by = oy;
      }
    }
  }
  if (!bx && !by) {
    // Already in a local minimum — gentle random wander.
    const a = Math.random() * Math.PI * 2;
    return { x: Math.cos(a) * 0.15, y: Math.sin(a) * 0.15 };
  }
  const len = Math.hypot(bx, by) || 1;
  const weight = Math.min(1.5, (here - best) * 0.35 + 0.35);
  return { x: (bx / len) * weight, y: (by / len) * weight };
}

/**
 * Apply density-escape acceleration to active particles.
 *
 * @param {{ x: number, y: number, vx: number, vy: number }[]} particles
 * @param {number} dt
 * @param {{ field: Float32Array, cols: number, rows: number, cellSize: number }} dens
 * @param {number} strength
 */
export function applyDensityDrift(particles, dt, dens, strength) {
  if (!particles.length || strength <= 0) return;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const f = densityEscapeForce(p.x, p.y, dens);
    p.vx += f.x * strength * dt;
    p.vy += f.y * strength * dt;
  }
}

export { lerp };
