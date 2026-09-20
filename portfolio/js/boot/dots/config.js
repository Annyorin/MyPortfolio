/**
 * Dots boot animation knobs.
 * Pattern: concentric rings with a lightness wave → blast → screen-wide dot grid.
 *
 * Values are merged over by the adapter (light/dark) and by whatever is read from
 * the live scene grid, so keep this a plain object — `resolveDotsConfig` freezes
 * nothing and callers may patch a live copy through `scene.reconfigure`.
 */

export const DOTS_CONFIG = {
  /** Final grid step in px; nodes sit at gridOffset + k * cell. */
  cell: 40,
  gridOffsetX: 0,
  gridOffsetY: 0,

  /** Dot radius at the inner ring edge, in px. */
  dotRadius: 2.6,
  /** How much smaller a dot gets towards the outer ring: 1 keeps them equal. */
  dotRadiusEdgeRatio: 1,
  /** Dot radius in the settled grid. */
  gridDotRadius: 1.6,

  /** Outer ring radius as a share of min(width, height). */
  ringsRadiusRatio: 0.34,
  /** Empty radius in the middle, e.g. under the percent badge. */
  ringsInnerRadius: 0,
  /**
   * Distance between rings in px. 0 puts exactly as many dots in the rings as
   * there are grid nodes; a value decouples ring density from grid density and
   * the missing dots are born during the blast.
   */
  ringStep: 0,

  background: "#ffffff",
  /** Grayscale ends of the loading wave. */
  colorDark: 0x2a,
  colorLight: 0xe2,
  /** Settled grid color. */
  colorGrid: 0xcc,

  /** Dot opacity at the inner ring edge and at the outer one. */
  dotAlphaCenter: 1,
  dotAlphaEdge: 1,
  /** Opacity multiplier at zero progress: dots glow up as loading advances. */
  dotAlphaStart: 1,

  /** Wave length along the radius, px. */
  waveLength: 200,
  waveSpeedMin: 0.35,
  waveSpeedMax: 1.1,
  waveAmpMin: 0.35,
  waveAmpMax: 1,

  /** Blast timing, ms. */
  morphDuration: 950,
  morphStagger: 220,
  /** Radial overshoot at the blast peak, px at a 900px tall viewport. */
  explodePush: 130,
  /** Extra radius at the peak, px. */
  explodeFlare: 1.8,
  /** Shade shift at the peak; negative brightens (dark theme). */
  explodeFlash: 80,
  /** Share of the flight over which radius reaches its final value. */
  sizeSnap: 1,
};

/**
 * Scene config: defaults with targeted overrides.
 *
 * @param {Partial<typeof DOTS_CONFIG>} [overrides]
 * @returns {typeof DOTS_CONFIG}
 */
export function resolveDotsConfig(overrides) {
  return overrides ? { ...DOTS_CONFIG, ...overrides } : { ...DOTS_CONFIG };
}
