/**
 * Input Gesture Layer — normalize keyboard/wheel/pointer into CameraController commands.
 * Does not rebuild the scene graph.
 */

/**
 * @param {EventTarget|{tagName?: string, isContentEditable?: boolean, getAttribute?: Function}|null|undefined} el
 * @returns {boolean}
 */
function isTextEditingElement(el) {
  if (!el || typeof el !== "object") {
    return false;
  }
  const tag = String(el.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") {
    return true;
  }
  if (el.isContentEditable === true) {
    return true;
  }
  if (typeof el.getAttribute === "function" && el.getAttribute("contenteditable") === "true") {
    return true;
  }
  return false;
}

/**
 * @param {Event} e
 * @returns {boolean}
 */
function isEditingContext(e) {
  if (isTextEditingElement(e.target)) {
    return true;
  }
  if (typeof document !== "undefined" && isTextEditingElement(document.activeElement)) {
    return true;
  }
  return false;
}

/**
 * @param {object} inputMode
 */
function syncSuppressClicks(inputMode) {
  inputMode.suppressClicks = Boolean(
    inputMode.spaceDown || inputMode.isPanning || inputMode.cardDragging
  );
}

/**
 * @param {EventTarget|null} target
 * @param {HTMLElement|EventTarget} viewportEl
 * @returns {boolean}
 */
function isBackgroundPanTarget(target, viewportEl) {
  if (!target || target === viewportEl) {
    return true;
  }
  const id = /** @type {{id?: string}} */ (target).id;
  const classList = /** @type {{classList?: {contains?: (c: string) => boolean}, closest?: Function, getAttribute?: Function}} */ (
    target
  );
  if (id === "world" || classList.classList?.contains?.("world")) {
    return true;
  }
  if (classList.classList?.contains?.("scene-bg")) {
    return true;
  }
  if (classList.getAttribute?.("data-node-kind") === "bg") {
    return true;
  }
  if (typeof classList.closest === "function") {
    if (classList.closest(".scene-bg, [data-node-kind='bg']")) {
      return true;
    }
    if (
      classList.closest(
        [
          ".ds-card",
          ".ds-link",
          ".ds-tapper",
          ".ds-sidebar",
          ".ds-stiker",
          ".ds-comp",
          "a",
          "button",
          "[data-node-kind='card']",
          "[data-node-kind='tapper']",
          "[data-node-kind='sidebar']",
          "[data-node-kind='comp']",
          "[data-node-kind='stiker']",
        ].join(", ")
      )
    ) {
      return false;
    }
  }
  return false;
}

/**
 * Binds Figma-like canvas gestures to a CameraController.
 *
 * InputMode fields mutated in place: `spaceDown`, `isPanning`, `suppressClicks`.
 *
 * @param {HTMLElement|EventTarget|null} viewportEl
 * @param {{
 *   zoomBy?: Function,
 *   zoomTo?: Function,
 *   fitToContent?: Function,
 *   panBy?: Function,
 *   zoomStep?: number
 * }} camera
 * @param {{spaceDown?: boolean, isPanning?: boolean, suppressClicks?: boolean}} [inputMode]
 * @returns {() => void} unbind function
 */
export function bindInput(viewportEl, camera, inputMode = {}) {
  if (inputMode.spaceDown === undefined) {
    inputMode.spaceDown = false;
  }
  if (inputMode.isPanning === undefined) {
    inputMode.isPanning = false;
  }
  if (inputMode.suppressClicks === undefined) {
    inputMode.suppressClicks = false;
  }
  if (inputMode.cardDragging === undefined) {
    inputMode.cardDragging = false;
  }

  if (!viewportEl || typeof viewportEl.addEventListener !== "function") {
    return () => {};
  }

  /**
   * @returns {number}
   */
  function zoomStep() {
    const step = camera?.zoomStep;
    return Number.isFinite(step) && step > 0 ? step : 0.1;
  }

  /**
   * @param {string} value
   */
  function setCursor(value) {
    const style = /** @type {{style?: {cursor?: string}}} */ (viewportEl).style;
    if (style) {
      style.cursor = value;
    }
  }

  /** @type {number|string|null} */
  let panPointerId = null;
  let lastClientX = 0;
  let lastClientY = 0;

  function endPanGesture() {
    panPointerId = null;
    inputMode.isPanning = false;
    syncSuppressClicks(inputMode);
    setCursor(inputMode.spaceDown ? "grab" : "");
  }

  /**
   * @param {{pointerId?: number, clientX: number, clientY: number, button?: number}} e
   */
  function startPanGesture(e) {
    panPointerId = e.pointerId != null ? e.pointerId : "mouse";
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    inputMode.isPanning = true;
    syncSuppressClicks(inputMode);
    setCursor("grabbing");
    const capture = /** @type {{setPointerCapture?: Function}} */ (viewportEl)
      .setPointerCapture;
    if (typeof capture === "function" && e.pointerId != null) {
      try {
        capture.call(viewportEl, e.pointerId);
      } catch {
        /* ignore capture failures in harness */
      }
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  const onKeyDown = (e) => {
    const key = e.key;
    const code = e.code;
    const mod = Boolean(e.ctrlKey || e.metaKey);
    const shift = Boolean(e.shiftKey);

    if (code === "Space" || key === " ") {
      if (e.repeat) {
        e.preventDefault?.();
        return;
      }
      if (!inputMode.spaceDown) {
        inputMode.spaceDown = true;
        syncSuppressClicks(inputMode);
        setCursor("grab");
      }
      e.preventDefault?.();
      return;
    }

    // Shift+2 (zoom to selection) — intentionally out of scope

    if (mod && !shift && (code === "Digit0" || key === "0")) {
      camera.zoomTo?.(1, "keepWorldCenter");
      e.preventDefault?.();
      return;
    }

    if (shift && (code === "Digit0" || key === "0" || key === ")")) {
      camera.zoomTo?.(1, "keepWorldCenter");
      e.preventDefault?.();
      return;
    }

    if (shift && (code === "Digit1" || key === "1" || key === "!")) {
      camera.fitToContent?.(24);
      e.preventDefault?.();
      return;
    }

    const editing = isEditingContext(e);

    const wantsZoomIn =
      (mod && (key === "=" || key === "+" || code === "Equal" || code === "NumpadAdd")) ||
      (!mod && (key === "+" || code === "NumpadAdd") && !editing);

    if (wantsZoomIn) {
      camera.zoomBy?.(zoomStep(), "viewportCenter");
      e.preventDefault?.();
      return;
    }

    const wantsZoomOut =
      (mod && (key === "-" || key === "_" || code === "Minus" || code === "NumpadSubtract")) ||
      (!mod && (key === "-" || code === "NumpadSubtract" || code === "Minus") && !editing);

    if (wantsZoomOut) {
      camera.zoomBy?.(-zoomStep(), "viewportCenter");
      e.preventDefault?.();
    }
  };

  /**
   * @param {KeyboardEvent} e
   */
  const onKeyUp = (e) => {
    if (e.code === "Space" || e.key === " ") {
      inputMode.spaceDown = false;
      if (!inputMode.isPanning) {
        syncSuppressClicks(inputMode);
        setCursor("");
      } else {
        syncSuppressClicks(inputMode);
      }
      e.preventDefault?.();
    }
  };

  /**
   * @param {WheelEvent} e
   */
  const onWheel = (e) => {
    const mod = Boolean(e.ctrlKey || e.metaKey);
    e.preventDefault?.();

    if (mod) {
      const rect =
        typeof /** @type {{getBoundingClientRect?: Function}} */ (viewportEl)
          .getBoundingClientRect === "function"
          ? /** @type {{getBoundingClientRect: Function}} */ (viewportEl).getBoundingClientRect()
          : { left: 0, top: 0 };
      const pivot = {
        x: e.clientX - (rect.left || 0),
        y: e.clientY - (rect.top || 0),
      };
      const direction = e.deltaY < 0 ? 1 : e.deltaY > 0 ? -1 : 0;
      if (direction !== 0) {
        camera.zoomBy?.(direction * zoomStep(), pivot);
      }
      return;
    }

    camera.panBy?.(-e.deltaX, -e.deltaY);
  };

  /**
   * @param {PointerEvent} e
   */
  const onPointerDown = (e) => {
    if (inputMode.cardDragging) {
      return;
    }
    const middle = e.button === 1;
    const spacePan = inputMode.spaceDown && e.button === 0;
    const bgPan =
      !inputMode.spaceDown &&
      e.button === 0 &&
      isBackgroundPanTarget(e.target, viewportEl);

    if (!middle && !spacePan && !bgPan) {
      return;
    }

    if (middle) {
      e.preventDefault?.();
    }

    startPanGesture(e);
  };

  /**
   * @param {PointerEvent} e
   */
  const onPointerMove = (e) => {
    if (inputMode.cardDragging) {
      return;
    }
    if (panPointerId == null) {
      return;
    }
    if (e.pointerId != null && e.pointerId !== panPointerId) {
      return;
    }
    const dx = e.clientX - lastClientX;
    const dy = e.clientY - lastClientY;
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    if (dx !== 0 || dy !== 0) {
      camera.panBy?.(dx, dy);
    }
  };

  /**
   * @param {PointerEvent} e
   */
  const onPointerUp = (e) => {
    if (panPointerId == null) {
      return;
    }
    if (e.pointerId != null && e.pointerId !== panPointerId) {
      return;
    }
    endPanGesture();
  };

  viewportEl.addEventListener("wheel", onWheel, { passive: false });
  viewportEl.addEventListener("keydown", onKeyDown);
  viewportEl.addEventListener("keyup", onKeyUp);
  viewportEl.addEventListener("pointerdown", onPointerDown);
  viewportEl.addEventListener("pointermove", onPointerMove);
  viewportEl.addEventListener("pointerup", onPointerUp);
  viewportEl.addEventListener("pointercancel", onPointerUp);
  viewportEl.addEventListener("lostpointercapture", onPointerUp);

  return () => {
    viewportEl.removeEventListener("wheel", onWheel);
    viewportEl.removeEventListener("keydown", onKeyDown);
    viewportEl.removeEventListener("keyup", onKeyUp);
    viewportEl.removeEventListener("pointerdown", onPointerDown);
    viewportEl.removeEventListener("pointermove", onPointerMove);
    viewportEl.removeEventListener("pointerup", onPointerUp);
    viewportEl.removeEventListener("pointercancel", onPointerUp);
    viewportEl.removeEventListener("lostpointercapture", onPointerUp);
    endPanGesture();
    inputMode.spaceDown = false;
    inputMode.isPanning = false;
    inputMode.cardDragging = false;
    inputMode.suppressClicks = false;
    setCursor("");
  };
}
