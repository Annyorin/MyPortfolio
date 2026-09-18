/**
 * Concentric ring particle layout (Cash App Nearby / loader rings).
 */

import { BOOT_CONFIG } from "./config.js";

/**
 * @typedef {{
 *   x: number, y: number,
 *   homeX: number, homeY: number,
 *   ring: number, ringRadius: number, ringAngle: number,
 *   vx: number, vy: number,
 *   r: number, baseR: number,
 *   heat: number, opacity: number, scale: number,
 *   delay: number,
 *   startX: number, startY: number,
 *   ctrlX: number, ctrlY: number,
 *   burstX: number, burstY: number,
 *   gridX: number, gridY: number,
 *   targetX: number, targetY: number,
 * }} BootParticle
 */

/**
 * Build concentric rings of dots around (cx, cy).
 *
 * @param {number} cx
 * @param {number} cy
 * @param {number} maxR
 * @param {typeof BOOT_CONFIG} [cfg]
 * @returns {BootParticle[]}
 */
export function buildRingParticles(cx, cy, maxR, cfg = BOOT_CONFIG) {
  /** @type {BootParticle[]} */
  const out = [];
  const inner = cfg.badgeSize / 2 + cfg.ringInnerPad;
  const rings = cfg.ringCount;
  const outer = Math.min(maxR, inner + (rings - 1) * cfg.ringStep);

  for (let ring = 0; ring < rings; ring++) {
    const radius = inner + ring * cfg.ringStep;
    if (radius > outer + 0.5) break;
    const count = Math.max(
      cfg.dotsPerRingBase,
      Math.round(cfg.dotsPerRingBase + ring * cfg.dotsPerRingGrow)
    );
    const edge = rings <= 1 ? 1 : Math.pow(1 - ring / (rings - 1), 1.1);
    const baseR = cfg.baseDotR * (0.72 + 0.28 * edge);
    const baseOpacity = 0.22 + 0.78 * edge;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      out.push({
        x,
        y,
        homeX: x,
        homeY: y,
        ring,
        ringRadius: radius,
        ringAngle: angle,
        vx: 0,
        vy: 0,
        r: baseR,
        baseR,
        heat: 0,
        opacity: baseOpacity,
        scale: 1,
        delay: 0,
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
      });
    }
  }
  return out;
}

/**
 * Sonar heat 0..1 from travelling wave along ring index (test helper).
 * @param {number} ring
 * @param {number} wavePos
 * @param {number} [width=2]
 */
export function waveHeat(ring, wavePos, width = 2) {
  const d = Math.abs(ring - wavePos);
  const t = d / width;
  if (t >= 1) return 0;
  return 0.5 * (1 + Math.cos(Math.PI * t));
}
