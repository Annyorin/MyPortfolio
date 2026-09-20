/**
 * Pure geometry for the dots boot animation: the screen-wide grid, the rings the
 * dots start from, and the order that pairs one with the other.
 *
 * No canvas, no DOM — every function here is directly testable.
 */

const TAU = Math.PI * 2;

/**
 * Angle normalised into [0, TAU).
 *
 * @param {number} a
 * @returns {number}
 */
function normalizeAngle(a) {
  const x = a % TAU;
  return x < 0 ? x + TAU : x;
}

/**
 * Regular dot grid with a FIXED step, anchored to the coordinate origin and
 * running past the right and bottom edges.
 *
 * The step never stretches to fit the viewport, so resizing and browser zoom
 * leave existing dots where they were — only edge rows are added or dropped.
 * `offsetX` / `offsetY` let the grid land on a foreign one (see siteGrid.js).
 *
 * @param {number} width
 * @param {number} height
 * @param {number} cell
 * @param {number} [offsetX]
 * @param {number} [offsetY]
 * @returns {{ cols: number, rows: number, cell: number, offsetX: number, offsetY: number, nodes: Float32Array }}
 */
export function buildGrid(width, height, cell, offsetX = 0, offsetY = 0) {
  // Start from the first node left of / above zero so the grid covers the
  // viewport whatever the offset is.
  const firstX = offsetX - Math.ceil(offsetX / cell) * cell;
  const firstY = offsetY - Math.ceil(offsetY / cell) * cell;
  const cols = Math.max(1, Math.ceil((width - firstX) / cell));
  const rows = Math.max(1, Math.ceil((height - firstY) / cell));

  const nodes = new Float32Array((cols + 1) * (rows + 1) * 2);
  let i = 0;
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      nodes[i++] = firstX + c * cell;
      nodes[i++] = firstY + r * cell;
    }
  }
  return { cols, rows, cell, offsetX, offsetY, nodes };
}

/**
 * Walk order for the grid nodes: radial buckets out from the centre, by angle
 * inside a bucket. Makes the blast read as ordered rather than random.
 *
 * @param {Float32Array} nodes
 * @param {number} cx
 * @param {number} cy
 * @param {number} bucket
 * @returns {Uint32Array}
 */
export function orderNodes(nodes, cx, cy, bucket) {
  const n = nodes.length / 2;
  const keys = new Float64Array(n);
  const angles = new Float64Array(n);
  const order = new Array(n);

  for (let i = 0; i < n; i++) {
    const dx = nodes[i * 2] - cx;
    const dy = nodes[i * 2 + 1] - cy;
    keys[i] = Math.round(Math.hypot(dx, dy) / bucket);
    angles[i] = normalizeAngle(Math.atan2(dy, dx));
    order[i] = i;
  }

  order.sort((a, b) => keys[a] - keys[b] || angles[a] - angles[b] || a - b);
  return Uint32Array.from(order);
}

/**
 * Rings filling a disc: centre dot plus rings of round(2*pi*k) dots.
 *
 * @param {number} count
 * @param {number} maxRadius
 * @returns {{ radii: number[], caps: number[], spacing: number }}
 */
function solidRings(count, maxRadius) {
  const caps = [1];
  let total = 1;
  for (let k = 1; total < count; k++) {
    const cap = Math.round(TAU * k);
    caps.push(cap);
    total += cap;
  }
  const spacing = caps.length > 1 ? maxRadius / (caps.length - 1) : 0;
  return { radii: caps.map((_, k) => k * spacing), caps, spacing };
}

/**
 * Rings in an annulus from innerRadius to maxRadius — the middle stays empty,
 * e.g. for the percent badge. Ring capacity follows its circumference, so the
 * gap between dots roughly matches the gap between rings.
 *
 * @param {number} count
 * @param {number} innerRadius
 * @param {number} maxRadius
 * @returns {{ radii: number[], caps: number[], spacing: number }}
 */
function annulusRings(count, innerRadius, maxRadius) {
  const width = Math.max(0, maxRadius - innerRadius);
  for (let k = 1; ; k++) {
    const spacing = width / k;
    const radii = [];
    const caps = [];
    let total = 0;
    for (let i = 0; i <= k; i++) {
      const radius = innerRadius + i * spacing;
      const cap = Math.max(1, Math.round((TAU * radius) / (spacing || radius || 1)));
      radii.push(radius);
      caps.push(cap);
      total += cap;
    }
    if (total >= count || k > 500) return { radii, caps, spacing };
  }
}

/**
 * How many dots fit in the rings at a given step. Lets ring density be set
 * independently of the final grid density.
 *
 * @param {number} innerRadius
 * @param {number} maxRadius
 * @param {number} step
 * @returns {number}
 */
export function ringCapacity(innerRadius, maxRadius, step) {
  if (step <= 0 || maxRadius <= 0) return 0;

  if (innerRadius <= 0) {
    const k = Math.max(1, Math.round(maxRadius / step));
    let total = 1; // centre dot
    for (let i = 1; i <= k; i++) total += Math.round(TAU * i);
    return total;
  }

  const k = Math.max(1, Math.round((maxRadius - innerRadius) / step));
  const spacing = (maxRadius - innerRadius) / k;
  let total = 0;
  for (let i = 0; i <= k; i++) {
    const radius = innerRadius + i * spacing;
    total += Math.max(1, Math.round((TAU * radius) / (spacing || radius || 1)));
  }
  return total;
}

/**
 * Exactly `count` dots on concentric rings, ordered by radius then angle.
 * With innerRadius > 0 the middle stays empty.
 *
 * @param {number} count
 * @param {number} maxRadius
 * @param {number} [innerRadius]
 * @returns {{ points: Float32Array, spacing: number, ringCount: number }}
 *          points is flat: x, y, radius (relative to the centre).
 */
export function buildRings(count, maxRadius, innerRadius = 0) {
  if (count <= 0) return { points: new Float32Array(0), spacing: 0, ringCount: 0 };

  const { radii, caps, spacing } =
    innerRadius > 0
      ? annulusRings(count, innerRadius, maxRadius)
      : solidRings(count, maxRadius);

  const points = new Float32Array(count * 3);
  let remaining = count;
  let i = 0;

  for (let ring = 0; ring < caps.length && remaining > 0; ring++) {
    const radius = radii[ring];
    if (radius === 0) {
      points[i++] = 0;
      points[i++] = 0;
      points[i++] = 0;
      remaining--;
      continue;
    }
    // Spread the remainder over the whole circle so the ring is never broken.
    const n = Math.min(caps[ring], remaining);
    const offset = (ring % 2) * (Math.PI / n);
    for (let j = 0; j < n; j++) {
      const a = offset + (j / n) * TAU;
      points[i++] = Math.cos(a) * radius;
      points[i++] = Math.sin(a) * radius;
      points[i++] = radius;
    }
    remaining -= n;
  }
  return { points, spacing, ringCount: caps.length - 1 };
}
