/**
 * Figma-like canvas scrollbars for the camera stage (right + bottom).
 * Mirror pan extents; drag thumbs / click tracks to pan.
 */

import { interactiveStageRect } from "../../shared/layout.js";

const BAR_PX = 10;
const THUMB_MIN_PX = 40;

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
 * @param {{ getPanExtents?: Function }} camera
 * @returns {{
 *   vw: number,
 *   vh: number,
 *   txMin: number,
 *   txMax: number,
 *   tyMin: number,
 *   tyMax: number,
 * }|null}
 */
function readExtents(camera) {
  if (typeof camera?.getPanExtents !== "function") {
    return null;
  }
  const ext = camera.getPanExtents();
  if (
    !ext ||
    !Number.isFinite(ext.txMin) ||
    !Number.isFinite(ext.txMax) ||
    !Number.isFinite(ext.tyMin) ||
    !Number.isFinite(ext.tyMax)
  ) {
    return null;
  }
  return ext;
}

/**
 * @param {HTMLElement} viewportEl
 * @param {{
 *   getState: Function,
 *   panBy: Function,
 *   getPanExtents: Function,
 * }} camera
 * @returns {{ sync: () => void, teardown: () => void }}
 */
export function bindCanvasScrollbars(viewportEl, camera) {
  if (
    !viewportEl ||
    typeof document === "undefined" ||
    typeof camera?.panBy !== "function" ||
    typeof camera?.getState !== "function"
  ) {
    return { sync: () => {}, teardown: () => {} };
  }

  const root = document.createElement("div");
  root.className = "canvas-scrollbars";
  root.setAttribute("aria-hidden", "true");

  const trackY = document.createElement("div");
  trackY.className = "canvas-scrollbars__track canvas-scrollbars__track--y";
  const thumbY = document.createElement("button");
  thumbY.type = "button";
  thumbY.className = "canvas-scrollbars__thumb canvas-scrollbars__thumb--y";
  thumbY.tabIndex = -1;
  trackY.appendChild(thumbY);

  const trackX = document.createElement("div");
  trackX.className = "canvas-scrollbars__track canvas-scrollbars__track--x";
  const thumbX = document.createElement("button");
  thumbX.type = "button";
  thumbX.className = "canvas-scrollbars__thumb canvas-scrollbars__thumb--x";
  thumbX.tabIndex = -1;
  trackX.appendChild(thumbX);

  const corner = document.createElement("div");
  corner.className = "canvas-scrollbars__corner";

  root.append(trackY, trackX, corner);
  viewportEl.appendChild(root);

  /** @type {{ axis: 'x'|'y', startClient: number, startTranslate: number }|null} */
  let drag = null;

  function layoutTracks() {
    const vw = Number(viewportEl.clientWidth) || 0;
    const vh = Number(viewportEl.clientHeight) || 0;
    const stage = interactiveStageRect({ width: vw, height: vh });

    trackY.style.top = `${stage.top}px`;
    trackY.style.right = `2px`;
    trackY.style.bottom = `${BAR_PX}px`;
    trackY.style.width = `${BAR_PX}px`;

    trackX.style.left = `${stage.left}px`;
    trackX.style.right = `${BAR_PX}px`;
    trackX.style.bottom = `2px`;
    trackX.style.height = `${BAR_PX}px`;

    corner.style.width = `${BAR_PX}px`;
    corner.style.height = `${BAR_PX}px`;
    corner.style.right = `2px`;
    corner.style.bottom = `2px`;
  }

  function sync() {
    layoutTracks();
    const ext = readExtents(camera);
    const state = camera.getState();
    if (!ext || !state) {
      root.hidden = true;
      return;
    }

    const rangeX = ext.txMax - ext.txMin;
    const rangeY = ext.tyMax - ext.tyMin;
    const canScrollX = rangeX > 1;
    const canScrollY = rangeY > 1;
    root.hidden = false;
    root.classList.toggle("is-scroll-x", canScrollX);
    root.classList.toggle("is-scroll-y", canScrollY);

    const trackYSize = trackY.clientHeight || 1;
    const trackXSize = trackX.clientWidth || 1;

    if (canScrollY) {
      const thumbH = clamp(
        (ext.vh / (ext.vh + rangeY)) * trackYSize,
        THUMB_MIN_PX,
        trackYSize
      );
      const travel = Math.max(0, trackYSize - thumbH);
      const progress = rangeY > 0 ? (ext.tyMax - state.translateY) / rangeY : 0;
      thumbY.style.height = `${thumbH}px`;
      thumbY.style.transform = `translateY(${clamp(progress, 0, 1) * travel}px)`;
      trackY.hidden = false;
    } else {
      trackY.hidden = true;
    }

    if (canScrollX) {
      const thumbW = clamp(
        (ext.vw / (ext.vw + rangeX)) * trackXSize,
        THUMB_MIN_PX,
        trackXSize
      );
      const travel = Math.max(0, trackXSize - thumbW);
      const progress = rangeX > 0 ? (ext.txMax - state.translateX) / rangeX : 0;
      thumbX.style.width = `${thumbW}px`;
      thumbX.style.transform = `translateX(${clamp(progress, 0, 1) * travel}px)`;
      trackX.hidden = false;
    } else {
      trackX.hidden = true;
    }

    corner.hidden = !(canScrollX && canScrollY);
  }

  /**
   * @param {'x'|'y'} axis
   * @param {number} client
   */
  function panFromClient(axis, client) {
    const ext = readExtents(camera);
    const state = camera.getState();
    if (!ext || !state) {
      return;
    }
    if (axis === "y") {
      const trackSize = trackY.clientHeight || 1;
      const thumbH = thumbY.offsetHeight || THUMB_MIN_PX;
      const travel = Math.max(1, trackSize - thumbH);
      const rect = trackY.getBoundingClientRect();
      const local = clamp(client - rect.top - thumbH / 2, 0, travel);
      const nextTy = ext.tyMax - (local / travel) * (ext.tyMax - ext.tyMin);
      camera.panBy(0, nextTy - state.translateY);
    } else {
      const trackSize = trackX.clientWidth || 1;
      const thumbW = thumbX.offsetWidth || THUMB_MIN_PX;
      const travel = Math.max(1, trackSize - thumbW);
      const rect = trackX.getBoundingClientRect();
      const local = clamp(client - rect.left - thumbW / 2, 0, travel);
      const nextTx = ext.txMax - (local / travel) * (ext.txMax - ext.txMin);
      camera.panBy(nextTx - state.translateX, 0);
    }
  }

  /**
   * @param {PointerEvent} event
   * @param {'x'|'y'} axis
   */
  function onThumbDown(event, axis) {
    event.preventDefault();
    event.stopPropagation();
    const state = camera.getState();
    drag = {
      axis,
      startClient: axis === "y" ? event.clientY : event.clientX,
      startTranslate: axis === "y" ? state.translateY : state.translateX,
    };
    (axis === "y" ? thumbY : thumbX).classList.add("is-dragging");
    try {
      (axis === "y" ? thumbY : thumbX).setPointerCapture?.(event.pointerId);
    } catch {
      /* harness */
    }
  }

  /**
   * @param {PointerEvent} event
   */
  function onThumbMove(event) {
    if (!drag) {
      return;
    }
    const ext = readExtents(camera);
    if (!ext) {
      return;
    }
    const state = camera.getState();
    if (drag.axis === "y") {
      const travel = Math.max(
        1,
        (trackY.clientHeight || 1) - (thumbY.offsetHeight || THUMB_MIN_PX)
      );
      const deltaProgress = (event.clientY - drag.startClient) / travel;
      const nextTy =
        drag.startTranslate - deltaProgress * (ext.tyMax - ext.tyMin);
      camera.panBy(0, nextTy - state.translateY);
    } else {
      const travel = Math.max(
        1,
        (trackX.clientWidth || 1) - (thumbX.offsetWidth || THUMB_MIN_PX)
      );
      const deltaProgress = (event.clientX - drag.startClient) / travel;
      const nextTx =
        drag.startTranslate - deltaProgress * (ext.txMax - ext.txMin);
      camera.panBy(nextTx - state.translateX, 0);
    }
    sync();
  }

  /**
   * @param {PointerEvent} event
   */
  function onThumbUp(event) {
    if (!drag) {
      return;
    }
    const thumb = drag.axis === "y" ? thumbY : thumbX;
    thumb.classList.remove("is-dragging");
    try {
      thumb.releasePointerCapture?.(event.pointerId);
    } catch {
      /* harness */
    }
    drag = null;
    sync();
  }

  /**
   * @param {PointerEvent} event
   * @param {'x'|'y'} axis
   */
  function onTrackDown(event, axis) {
    if (event.target === thumbX || event.target === thumbY) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    panFromClient(axis, axis === "y" ? event.clientY : event.clientX);
    sync();
  }

  /** @param {PointerEvent} e */
  const downY = (e) => onThumbDown(e, "y");
  /** @param {PointerEvent} e */
  const downX = (e) => onThumbDown(e, "x");
  /** @param {PointerEvent} e */
  const trackDownY = (e) => onTrackDown(e, "y");
  /** @param {PointerEvent} e */
  const trackDownX = (e) => onTrackDown(e, "x");

  thumbY.addEventListener("pointerdown", downY);
  thumbX.addEventListener("pointerdown", downX);
  thumbY.addEventListener("pointermove", onThumbMove);
  thumbX.addEventListener("pointermove", onThumbMove);
  thumbY.addEventListener("pointerup", onThumbUp);
  thumbX.addEventListener("pointerup", onThumbUp);
  thumbY.addEventListener("pointercancel", onThumbUp);
  thumbX.addEventListener("pointercancel", onThumbUp);
  trackY.addEventListener("pointerdown", trackDownY);
  trackX.addEventListener("pointerdown", trackDownX);

  const onResize = () => sync();
  if (typeof window !== "undefined") {
    window.addEventListener("resize", onResize);
  }

  sync();

  return {
    sync,
    teardown() {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", onResize);
      }
      thumbY.removeEventListener("pointerdown", downY);
      thumbX.removeEventListener("pointerdown", downX);
      thumbY.removeEventListener("pointermove", onThumbMove);
      thumbX.removeEventListener("pointermove", onThumbMove);
      thumbY.removeEventListener("pointerup", onThumbUp);
      thumbX.removeEventListener("pointerup", onThumbUp);
      thumbY.removeEventListener("pointercancel", onThumbUp);
      thumbX.removeEventListener("pointercancel", onThumbUp);
      trackY.removeEventListener("pointerdown", trackDownY);
      trackX.removeEventListener("pointerdown", trackDownX);
      if (root.parentNode) {
        root.parentNode.removeChild(root);
      }
    },
  };
}
