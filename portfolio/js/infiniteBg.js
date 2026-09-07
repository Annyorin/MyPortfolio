/**
 * Infinite FigJam-style dotted canvas in world space.
 * Screen-fixed layer; period and dot radius scale with camera so zoom
 * enlarges/shrinks dots and spacing; pan slides the grid with the world.
 */

/** Figma BG: 4px dots + 16px gap, pad 8, colors from Ui kit. */
export const INFINITE_BG = Object.freeze({
  color: "#f5f5f5",
  dotColor: "#e4e4e4",
  worldPeriod: 20,
  worldDotRadius: 2,
  worldPad: 8,
});

/**
 * Computes CSS background props for a camera state (world-locked grid).
 *
 * @param {{ scale: number, translateX: number, translateY: number }} state
 * @param {typeof INFINITE_BG} [spec=INFINITE_BG]
 * @returns {{
 *   backgroundColor: string,
 *   backgroundImage: string,
 *   backgroundSize: string,
 *   backgroundPosition: string
 * }}
 */
export function infiniteBgStyles(state, spec = INFINITE_BG) {
  const scale = Number(state?.scale);
  const tx = Number(state?.translateX);
  const ty = Number(state?.translateY);
  const s = Number.isFinite(scale) && scale > 0 ? scale : 1;
  const translateX = Number.isFinite(tx) ? tx : 0;
  const translateY = Number.isFinite(ty) ? ty : 0;

  const period = spec.worldPeriod * s;
  const r = spec.worldDotRadius * s;
  const ox = translateX + spec.worldPad * s;
  const oy = translateY + spec.worldPad * s;

  return {
    backgroundColor: spec.color,
    backgroundImage: `radial-gradient(circle ${r}px at ${r}px ${r}px, ${spec.dotColor} 99%, transparent 100%)`,
    backgroundSize: `${period}px ${period}px`,
    backgroundPosition: `${ox}px ${oy}px`,
  };
}

/**
 * Mounts a full-bleed infinite bg behind `.world` and returns a sync API.
 *
 * @param {HTMLElement} viewportEl
 * @returns {{ el: HTMLElement, sync: (state: {scale:number,translateX:number,translateY:number}) => void }|null}
 */
export function createInfiniteBg(viewportEl) {
  if (!viewportEl || typeof document === "undefined") {
    return null;
  }

  const canQuery = typeof viewportEl.querySelector === "function";
  const canInsert =
    typeof viewportEl.insertBefore === "function" &&
    typeof document.createElement === "function";

  if (!canInsert) {
    // Test shims / headless hosts without DOM mutation — sync is a no-op.
    return {
      el: null,
      sync() {},
    };
  }

  let el = canQuery ? viewportEl.querySelector(".scene-infinite-bg") : null;
  if (!el) {
    el = document.createElement("div");
    el.className = "scene-infinite-bg";
    el.setAttribute("aria-hidden", "true");
    const first =
      typeof viewportEl.firstChild !== "undefined"
        ? viewportEl.firstChild
        : null;
    viewportEl.insertBefore(el, first);
  }

  /**
   * @param {{ scale: number, translateX: number, translateY: number }} state
   */
  function sync(state) {
    if (!el || !el.style) {
      return;
    }
    const styles = infiniteBgStyles(state);
    el.style.backgroundColor = styles.backgroundColor;
    el.style.backgroundImage = styles.backgroundImage;
    el.style.backgroundSize = styles.backgroundSize;
    el.style.backgroundPosition = styles.backgroundPosition;
    el.style.backgroundRepeat = "repeat";
  }

  sync({ scale: 1, translateX: 0, translateY: 0 });
  return { el, sync };
}
