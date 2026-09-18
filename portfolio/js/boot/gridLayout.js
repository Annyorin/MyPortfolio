/**
 * Uniform grid layout + nearest-free-cell assignment for burst → settle.
 */

/**
 * @param {number} w
 * @param {number} h
 * @param {number} step
 * @returns {{ x: number, y: number }[]}
 */
export function buildUniformGrid(w, h, step) {
  const s = Math.max(8, step);
  const cols = Math.max(1, Math.floor(w / s));
  const rows = Math.max(1, Math.floor(h / s));
  const ox = (w - (cols - 1) * s) / 2;
  const oy = (h - (rows - 1) * s) / 2;
  /** @type {{ x: number, y: number }[]} */
  const cells = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      cells.push({ x: ox + i * s, y: oy + j * s });
    }
  }
  return cells;
}

/**
 * Greedy nearest-free matching: each seed → closest unused cell.
 * Prefer matching from cloud/burst positions for locality.
 *
 * @param {{ x: number, y: number }[]} seeds
 * @param {{ x: number, y: number }[]} cells
 * @returns {(number|null)[]} seed → cell index
 */
export function assignNearestCells(seeds, cells) {
  /** @type {(number|null)[]} */
  const seedCell = new Array(seeds.length).fill(null);
  if (!cells.length || !seeds.length) return seedCell;

  if (seeds.length * cells.length > 250_000) {
    return assignNearestCellsLocal(seeds, cells, 5);
  }

  /** @type {{ si: number, ci: number, d: number }[]} */
  const pairs = [];
  for (let si = 0; si < seeds.length; si++) {
    for (let ci = 0; ci < cells.length; ci++) {
      const dx = seeds[si].x - cells[ci].x;
      const dy = seeds[si].y - cells[ci].y;
      pairs.push({ si, ci, d: dx * dx + dy * dy });
    }
  }
  pairs.sort((a, b) => a.d - b.d);
  const taken = new Uint8Array(cells.length);
  for (const p of pairs) {
    if (seedCell[p.si] != null || taken[p.ci]) continue;
    seedCell[p.si] = p.ci;
    taken[p.ci] = 1;
  }
  for (let si = 0; si < seeds.length; si++) {
    if (seedCell[si] != null) continue;
    let best = -1;
    let bestD = Infinity;
    for (let ci = 0; ci < cells.length; ci++) {
      if (taken[ci]) continue;
      const dx = seeds[si].x - cells[ci].x;
      const dy = seeds[si].y - cells[ci].y;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = ci;
      }
    }
    if (best >= 0) {
      seedCell[si] = best;
      taken[best] = 1;
    }
  }
  return seedCell;
}

/**
 * @param {{ x: number, y: number }[]} seeds
 * @param {{ x: number, y: number }[]} cells
 * @param {number} search
 */
function assignNearestCellsLocal(seeds, cells, search) {
  // Build spatial hash by rounding to approximate step
  let step = 20;
  if (cells.length >= 2) {
    step = Math.max(8, Math.hypot(cells[1].x - cells[0].x, cells[1].y - cells[0].y) || step);
  }
  /** @type {Map<string, number[]>} */
  const bucket = new Map();
  for (let ci = 0; ci < cells.length; ci++) {
    const i = Math.round(cells[ci].x / step);
    const j = Math.round(cells[ci].y / step);
    const k = `${i},${j}`;
    const arr = bucket.get(k);
    if (arr) arr.push(ci);
    else bucket.set(k, [ci]);
  }
  /** @type {(number|null)[]} */
  const seedCell = new Array(seeds.length).fill(null);
  const taken = new Uint8Array(cells.length);
  /** @type {{ si: number, ci: number, d: number }[]} */
  const pairs = [];
  for (let si = 0; si < seeds.length; si++) {
    const i0 = Math.round(seeds[si].x / step);
    const j0 = Math.round(seeds[si].y / step);
    for (let dj = -search; dj <= search; dj++) {
      for (let di = -search; di <= search; di++) {
        const list = bucket.get(`${i0 + di},${j0 + dj}`);
        if (!list) continue;
        for (const ci of list) {
          const dx = seeds[si].x - cells[ci].x;
          const dy = seeds[si].y - cells[ci].y;
          pairs.push({ si, ci, d: dx * dx + dy * dy });
        }
      }
    }
  }
  pairs.sort((a, b) => a.d - b.d);
  for (const p of pairs) {
    if (seedCell[p.si] != null || taken[p.ci]) continue;
    seedCell[p.si] = p.ci;
    taken[p.ci] = 1;
  }
  return seedCell;
}
