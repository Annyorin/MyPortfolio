/**
 * CameraController — viewport↔world math contract (architecture §5.2).
 * Default: one element gets `translate(...) scale(...)`, origin 0 0.
 * With `scaleEl` + CSS `zoom`: pan host gets translate; scaleEl gets zoom (sharper text/photos).
 */

import { interactiveStageRect } from "../../shared/layout.js";

const DEFAULT_MIN_SCALE = 0.25;
const DEFAULT_MAX_SCALE = 4;
/** Discrete zoom step (~0.1…0.25), additive to scale. */
const DEFAULT_ZOOM_STEP = 0.1;
const DEFAULT_VIEWPORT = Object.freeze({ width: 1024, height: 609 });

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * @param {{ minX: number, minY: number, maxX: number, maxY: number }} aabb
 * @param {number} viewportW
 * @param {number} viewportH
 * @returns {{ minX: number, minY: number, maxX: number, maxY: number }}
 */
function expandContentAABB(aabb, viewportW, viewportH) {
  return {
    minX: aabb.minX - viewportW,
    maxX: aabb.maxX + viewportW,
    minY: aabb.minY - viewportH,
    maxY: aabb.maxY + viewportH,
  };
}

/**
 * @returns {boolean}
 */
function supportsCssZoom() {
  try {
    return (
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("zoom", "1")
    );
  } catch {
    return false;
  }
}

/**
 * Creates a CameraController bound to a world / pan element.
 *
 * Quality: when `options.scaleEl` is set and CSS `zoom` is supported, pan uses
 * `transform: translate` on the host and magnification uses `zoom` on `scaleEl`
 * so text/photos re-rasterize sharper than a single `transform: scale`.
 *
 * @param {HTMLElement|{style: CSSStyleDeclaration|Record<string, string>, children?: unknown[]}} worldEl
 * @param {object} [options]
 * @param {() => { width: number, height: number }} [options.getViewportSize]
 * @param {() => { minX: number, minY: number, maxX: number, maxY: number }|null|undefined} [options.getContentAABB]
 * @param {(state: {scale: number, translateX: number, translateY: number}) => void} [options.onApply]
 * @param {HTMLElement|{style: CSSStyleDeclaration|Record<string, string>}|null} [options.scaleEl]
 * @param {number} [options.minScale=0.25]
 * @param {number} [options.maxScale=4]
 * @param {number} [options.zoomStep=0.1]
 */
export function createCameraController(worldEl, options = {}) {
  const minScale = Number.isFinite(options.minScale)
    ? options.minScale
    : DEFAULT_MIN_SCALE;
  const maxScale = Number.isFinite(options.maxScale)
    ? options.maxScale
    : DEFAULT_MAX_SCALE;
  const zoomStep = Number.isFinite(options.zoomStep)
    ? options.zoomStep
    : DEFAULT_ZOOM_STEP;

  const panEl = worldEl;
  const scaleEl =
    options.scaleEl && options.scaleEl !== worldEl ? options.scaleEl : null;
  const useCssZoom = Boolean(scaleEl) && supportsCssZoom();

  /** @type {{ scale: number, translateX: number, translateY: number }} */
  const state = {
    scale: 1,
    translateX: 0,
    translateY: 0,
  };

  /**
   * @returns {{ width: number, height: number }}
   */
  function readViewportSize() {
    if (typeof options.getViewportSize === "function") {
      const size = options.getViewportSize();
      if (
        size &&
        Number.isFinite(size.width) &&
        Number.isFinite(size.height) &&
        size.width > 0 &&
        size.height > 0
      ) {
        return { width: size.width, height: size.height };
      }
    }
    return { width: DEFAULT_VIEWPORT.width, height: DEFAULT_VIEWPORT.height };
  }

  /**
   * @returns {{ minX: number, minY: number, maxX: number, maxY: number }|null}
   */
  function readContentAABB() {
    if (typeof options.getContentAABB !== "function") {
      return null;
    }
    const aabb = options.getContentAABB();
    if (
      !aabb ||
      !Number.isFinite(aabb.minX) ||
      !Number.isFinite(aabb.minY) ||
      !Number.isFinite(aabb.maxX) ||
      !Number.isFinite(aabb.maxY)
    ) {
      return null;
    }
    return aabb;
  }

  /**
   * Soft-clamp: viewport center in world must stay inside expand(ContentAABB, vw, vh).
   * Per axis independently; attempting to leave further is corrected to the boundary.
   */
  function softClamp() {
    const aabb = readContentAABB();
    if (!aabb) {
      return;
    }
    const { width: vw, height: vh } = readViewportSize();
    const expanded = expandContentAABB(aabb, vw, vh);
    const scale = state.scale;

    let cx = (vw / 2 - state.translateX) / scale;
    let cy = (vh / 2 - state.translateY) / scale;

    if (cx < expanded.minX) {
      state.translateX = vw / 2 - expanded.minX * scale;
    } else if (cx > expanded.maxX) {
      state.translateX = vw / 2 - expanded.maxX * scale;
    }

    if (cy < expanded.minY) {
      state.translateY = vh / 2 - expanded.minY * scale;
    } else if (cy > expanded.maxY) {
      state.translateY = vh / 2 - expanded.maxY * scale;
    }
  }

  /**
   * Applies camera CSS without changing child left/top layout.
   * Prefer CSS zoom on scaleEl when available; else translate+scale on pan host.
   */
  function apply() {
    if (!panEl || !panEl.style) {
      if (typeof options.onApply === "function") {
        options.onApply(getState());
      }
      return;
    }

    if (useCssZoom && scaleEl && scaleEl.style) {
      panEl.style.transformOrigin = "0 0";
      panEl.style.transform = `translate(${state.translateX}px, ${state.translateY}px)`;
      scaleEl.style.transformOrigin = "0 0";
      scaleEl.style.transform = "";
      scaleEl.style.zoom = String(state.scale);
    } else {
      panEl.style.transformOrigin = "0 0";
      panEl.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
      if (scaleEl && scaleEl.style) {
        scaleEl.style.zoom = "";
        scaleEl.style.transform = "";
      }
    }

    if (typeof options.onApply === "function") {
      options.onApply(getState());
    }
  }

  /**
   * @returns {{ scale: number, translateX: number, translateY: number }}
   */
  function getState() {
    return {
      scale: state.scale,
      translateX: state.translateX,
      translateY: state.translateY,
    };
  }

  /**
   * Screen → world (origin 0 0, translate then scale).
   * @param {number} sx
   * @param {number} sy
   * @returns {{ x: number, y: number }}
   */
  function screenToWorld(sx, sy) {
    return {
      x: (sx - state.translateX) / state.scale,
      y: (sy - state.translateY) / state.scale,
    };
  }

  /**
   * World → screen.
   * @param {number} wx
   * @param {number} wy
   * @returns {{ x: number, y: number }}
   */
  function worldToScreen(wx, wy) {
    return {
      x: wx * state.scale + state.translateX,
      y: wy * state.scale + state.translateY,
    };
  }

  /**
   * Resolve pivot screen coordinates.
   * @param {'viewportCenter'|{x: number, y: number}} pivot
   * @returns {{ x: number, y: number }}
   */
  function resolvePivotScreen(pivot) {
    if (pivot === "viewportCenter") {
      const { width: vw, height: vh } = readViewportSize();
      return { x: vw / 2, y: vh / 2 };
    }
    if (pivot && Number.isFinite(pivot.x) && Number.isFinite(pivot.y)) {
      return { x: pivot.x, y: pivot.y };
    }
    const { width: vw, height: vh } = readViewportSize();
    return { x: vw / 2, y: vh / 2 };
  }

  /**
   * Zoom by additive step around pivot; no-op at min/max without throw.
   * @param {number} deltaStep
   * @param {'viewportCenter'|{x: number, y: number}} pivot
   */
  function zoomBy(deltaStep, pivot) {
    const nextScale = clamp(state.scale + deltaStep, minScale, maxScale);
    if (nextScale === state.scale) {
      return getState();
    }

    const pivotScreen = resolvePivotScreen(pivot);
    const world = screenToWorld(pivotScreen.x, pivotScreen.y);
    state.scale = nextScale;
    state.translateX = pivotScreen.x - world.x * nextScale;
    state.translateY = pivotScreen.y - world.y * nextScale;
    softClamp();
    apply();
    return getState();
  }

  /**
   * Zoom to absolute scale. For 100%: pivotMode `keepWorldCenter`.
   * @param {number} targetScale
   * @param {string} pivotMode
   */
  function zoomTo(targetScale, pivotMode) {
    const nextScale = clamp(targetScale, minScale, maxScale);
    if (nextScale === state.scale && pivotMode !== "keepWorldCenter") {
      return getState();
    }

    if (pivotMode === "keepWorldCenter") {
      const { width: vw, height: vh } = readViewportSize();
      const cx = (vw / 2 - state.translateX) / state.scale;
      const cy = (vh / 2 - state.translateY) / state.scale;
      state.scale = nextScale;
      state.translateX = vw / 2 - cx * nextScale;
      state.translateY = vh / 2 - cy * nextScale;
    } else {
      const pivotScreen = resolvePivotScreen("viewportCenter");
      const world = screenToWorld(pivotScreen.x, pivotScreen.y);
      state.scale = nextScale;
      state.translateX = pivotScreen.x - world.x * nextScale;
      state.translateY = pivotScreen.y - world.y * nextScale;
    }

    softClamp();
    apply();
    return getState();
  }

  /**
   * Fit ContentAABB into viewport with padding; center AABB on viewport center.
   * @param {number} [padding=24]
   */
  function fitToContent(padding = 24) {
    const aabb = readContentAABB();
    if (!aabb) {
      return getState();
    }

    const aabbW = aabb.maxX - aabb.minX;
    const aabbH = aabb.maxY - aabb.minY;
    if (!(aabbW > 0) || !(aabbH > 0)) {
      return getState();
    }

    const { width: vw, height: vh } = readViewportSize();
    const pad = Number.isFinite(padding) ? padding : 24;
    const scaleFit = Math.min(
      (vw - 2 * pad) / aabbW,
      (vh - 2 * pad) / aabbH
    );
    const nextScale = clamp(scaleFit, minScale, maxScale);
    const centerX = (aabb.minX + aabb.maxX) / 2;
    const centerY = (aabb.minY + aabb.maxY) / 2;

    state.scale = nextScale;
    state.translateX = vw / 2 - centerX * nextScale;
    state.translateY = vh / 2 - centerY * nextScale;
    softClamp();
    apply();
    return getState();
  }

  /**
   * Scale + center cards/about in the interactive right stage (sidebar is chrome).
   * Scale grows with viewport: larger screens → larger cards, still centered in stage.
   * @param {number} [padding=16]
   */
  function fitInteractiveStage(padding = 16) {
    const aabb = readContentAABB();
    if (!aabb) {
      return getState();
    }

    const aabbW = aabb.maxX - aabb.minX;
    const aabbH = aabb.maxY - aabb.minY;
    if (!(aabbW > 0) || !(aabbH > 0)) {
      return getState();
    }

    const viewport = readViewportSize();
    const stage = interactiveStageRect(viewport);
    const pad = Number.isFinite(padding) ? Math.max(0, padding) : 16;
    const innerW = Math.max(1, stage.width - 2 * pad);
    const innerH = Math.max(1, stage.height - 2 * pad);
    const scaleFit = Math.min(innerW / aabbW, innerH / aabbH);
    const nextScale = clamp(scaleFit, minScale, maxScale);
    const centerX = (aabb.minX + aabb.maxX) / 2;
    const centerY = (aabb.minY + aabb.maxY) / 2;
    const stageCx = stage.left + stage.width / 2;
    const stageCy = stage.top + stage.height / 2;

    state.scale = nextScale;
    state.translateX = stageCx - centerX * nextScale;
    state.translateY = stageCy - centerY * nextScale;
    softClamp();
    apply();
    return getState();
  }

  /**
   * Pan by screen-space delta; soft-clamp per axis (out of bounds → no-op on axis).
   * @param {number} dx
   * @param {number} dy
   */
  function panBy(dx, dy) {
    state.translateX += dx;
    state.translateY += dy;
    softClamp();
    apply();
    return getState();
  }

  /**
   * Idle camera for artboard-sized viewports: scale 1, origin top-left.
   */
  function resetIdle() {
    state.scale = 1;
    state.translateX = 0;
    state.translateY = 0;
    apply();
    return getState();
  }

  return {
    screenToWorld,
    worldToScreen,
    zoomBy,
    zoomTo,
    fitToContent,
    fitInteractiveStage,
    panBy,
    resetIdle,
    getState,
    apply,
    zoomStep,
  };
}
