/**
 * Production boot knobs (portfolio main).
 * Pattern: quiet cover → (slow net) sonar rings → 100% fly-apart → scene.
 * Lab-only burst→grid keys live in `bootDemo.js`.
 */

export const BOOT_CONFIG = Object.freeze({
  progressCapWhileLoading: 97,

  loadingMinMs: 520,
  /** Show rings/percent only if navigation still waiting after this (slow net). */
  slowLoadMs: 1000,
  /** After rings appear, hold the sonar at least this long before 100% burst. */
  slowPulseMinMs: 2200,
  /** Soft % crawl window; does not cut the ring animation on slow loads. */
  loadingMaxMs: 8000,
  /** Radial fly-apart after 100%. */
  burstMs: 860,

  overlapBurstToGridMs: 90,

  /** Sonar pulse — slow travelling crest, wide enough to read as a wave. */
  waveIntervalMs: 2800,
  waveSpeedPxPerMs: 0.05,
  wavePulseWidthMs: 1100,

  /** Ring layout: drop one inner + one outer vs previous 12 / pad 14. */
  badgeSize: 100,
  ringCount: 10,
  ringStep: 18,
  ringInnerPad: 32,
  baseDotR: 2.05,
  dotsPerRingBase: 18,
  dotsPerRingGrow: 5.5,

  /** Burst — mostly sideways, existing ring dots only. */
  burstImpulseMin: 160,
  burstImpulseMax: 320,
  burstTangentJitter: 36,
  burstSideBias: 1.45,
  burstVerticalBias: 0.42,

  colorDim: Object.freeze({ r: 128, g: 128, b: 128 }),
  colorHot: Object.freeze({ r: 196, g: 196, b: 196 }),
});
