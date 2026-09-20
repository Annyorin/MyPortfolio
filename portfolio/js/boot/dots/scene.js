/**
 * Dots scene: canvas, DPR, resize, RAF loop and the loading → morph → done
 * state machine. Progress is pushed in from the outside.
 */
import { resolveDotsConfig } from "./config.js";
import { buildParticles, drawParticles, drawGrid, morphTotal } from "./particles.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{
 *   config?: object,
 *   transparent?: boolean,
 *   onProgress?: (p: number) => void,
 *   onMorphStart?: () => void,
 *   onComplete?: () => void,
 * }} [options] transparent keeps the canvas clear so CSS paints the backdrop.
 */
export function createDotsScene(canvas, {
  config,
  transparent = false,
  onProgress,
  onMorphStart,
  onComplete,
} = {}) {
  const ctx = canvas.getContext("2d");
  const cfg = resolveDotsConfig(config);

  let width = 0;
  let height = 0;
  let particles = null;
  let phase = "loading";
  let progress = 0;
  let startTime = 0;
  let morphStart = 0;
  let raf = 0;
  let resizeRaf = 0;
  let pendingResize = false;

  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = buildParticles(width, height, cfg);
  }

  function clear() {
    if (transparent) {
      ctx.clearRect(0, 0, width, height);
      return;
    }
    ctx.fillStyle = cfg.background;
    ctx.fillRect(0, 0, width, height);
  }

  function finish() {
    phase = "done";
    raf = 0;
    if (pendingResize) {
      pendingResize = false;
      layout();
    }
    clear();
    drawGrid(ctx, particles, cfg);
    onComplete?.();
  }

  function frame(now) {
    clear();
    if (phase === "morph") {
      const t = now - morphStart;
      drawParticles(ctx, particles, { time: now - startTime, progress: 1, morphT: t }, cfg);
      if (t >= morphTotal(cfg)) {
        finish();
        return;
      }
    } else {
      drawParticles(ctx, particles, { time: now - startTime, progress, morphT: 0 }, cfg);
    }
    raf = requestAnimationFrame(frame);
  }

  function applyResize() {
    resizeRaf = 0;
    // Mid-blast the layout is left alone, otherwise particles jump in flight.
    if (phase === "morph") {
      pendingResize = true;
      return;
    }
    layout();
    if (phase === "done") {
      clear();
      drawGrid(ctx, particles, cfg);
    }
  }

  // Resize and zoom fire in bursts — collapse them into one relayout per frame.
  function onResize() {
    if (!resizeRaf) resizeRaf = requestAnimationFrame(applyResize);
  }

  function start() {
    layout();
    startTime = performance.now();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
  }

  function setProgress(value) {
    if (phase !== "loading") return;
    const next = Math.max(0, Math.min(1, value));
    if (next <= progress) return; // progress is monotonic
    progress = next;
    onProgress?.(progress);
    if (progress >= 1) {
      phase = "morph";
      morphStart = performance.now();
      onMorphStart?.();
    }
  }

  /**
   * Patch the config and rebuild the layout. Needed when the animation target is
   * only known later — e.g. the grid has to land on the page's own dotted grid,
   * which is painted after the loader starts.
   *
   * @param {object} patch
   */
  function reconfigure(patch) {
    Object.assign(cfg, patch);
    layout();
  }

  /**
   * Redraw the static frame after the canvas moved to another container.
   *
   * Moving a node around the DOM does not clear its bitmap, so with matching
   * sizes nothing is touched: rebuilding here would mean a grid different from
   * the one the animation just settled into. A zero size (container not laid out
   * yet) is skipped too — it would produce a one-cell grid.
   *
   * @returns {boolean} true when the grid was rebuilt for a new size
   */
  function redraw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || (w === width && h === height)) return false;

    layout();
    clear();
    if (phase === "done") drawGrid(ctx, particles, cfg);
    return true;
  }

  /** Repaint with the same frame the static finale draws, without rebuilding. */
  function repaint() {
    if (phase !== "done" || !particles) return;
    clear();
    drawGrid(ctx, particles, cfg);
  }

  function destroy() {
    if (raf) cancelAnimationFrame(raf);
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    raf = 0;
    resizeRaf = 0;
    window.removeEventListener("resize", onResize);
    window.visualViewport?.removeEventListener("resize", onResize);
  }

  return {
    start,
    setProgress,
    redraw,
    repaint,
    reconfigure,
    destroy,
    get progress() { return progress; },
    get phase() { return phase; },
    get config() { return cfg; },
  };
}
