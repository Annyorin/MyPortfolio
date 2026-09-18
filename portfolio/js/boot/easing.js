/**
 * Easing helpers for boot particle stages.
 */

/** @param {number} t */
export function clamp01(t) {
  return Math.min(1, Math.max(0, t));
}

/** @param {number} t */
export function easeOutQuad(t) {
  const x = clamp01(t);
  return 1 - (1 - x) * (1 - x);
}

/** @param {number} t */
export function easeOutCubic(t) {
  const x = clamp01(t);
  return 1 - (1 - x) ** 3;
}

/** @param {number} t */
export function easeInOutCubic(t) {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

/**
 * Soft cosine pulse 0..1 peaking at phase≈0 within halfWidth.
 * @param {number} phaseMs signed distance from wave crest
 * @param {number} halfWidthMs
 */
export function pulseFunction(phaseMs, halfWidthMs) {
  const w = Math.max(1, halfWidthMs);
  const t = Math.abs(phaseMs) / w;
  if (t >= 1) return 0;
  return 0.5 * (1 + Math.cos(Math.PI * t));
}
