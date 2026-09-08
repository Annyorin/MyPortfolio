/**
 * Interactive hits on the portfolio world: Tapper zoom, contacts, image errors,
 * Space-pan click suppression, and long-press card drag (architecture InteractiveHits).
 */

const SUPPRESSIBLE_SELECTOR = [
  ".ds-card",
  "[data-node-kind='card']",
  ".ds-link",
  "a.ds-link",
  ".ds-sidebar__contacts",
  ".ds-sidebar__contacts a",
].join(", ");

const CARD_SELECTOR =
  ".ds-card, [data-node-kind='card'], .scene-about-cluster, [data-node-kind='about']";
const CRITICAL_IMG_SELECTOR =
  "img[data-media-slot], img.scene-comp__img, .scene-about__me img, .scene-about__macbook img";

/** Hold duration before card enters grab/drag mode (stationary press). */
export const CARD_LONG_PRESS_MS = 150;
/** With pointer moved past slop while held, arm drag after this delay from pointerdown. */
export const CARD_DRAG_MOVE_ARM_MS = 10;
/** Pointer movement (px) that signals drag intent (vs cancel / wait for long-press). */
export const CARD_PRESS_SLOP_PX = 8;

/**
 * Resolves the media slot wrapper that must keep geometry on broken src.
 *
 * @param {HTMLElement|EventTarget|null} img
 * @returns {HTMLElement|null}
 */
function resolveMediaSlot(img) {
  if (!img || typeof /** @type {HTMLElement} */ (img).closest !== "function") {
    return /** @type {HTMLElement|null} */ (img?.parentElement ?? null);
  }
  const el = /** @type {HTMLElement} */ (img);
  return (
    el.closest(
      ".ds-avatar, .ds-card__media, .scene-comp, .scene-about__me, .scene-about__macbook, .scene-bg, .ds-placeholder, [data-media-slot-box]"
    ) || el.parentElement
  );
}

/**
 * Keeps slot box size and logs when a critical image fails to load.
 * Does not throw; scene and camera stay usable.
 *
 * @param {Event|{target?: EventTarget}|HTMLElement} eventOrImg
 * @returns {void}
 */
export function onImageError(eventOrImg) {
  try {
    const img =
      eventOrImg && typeof eventOrImg === "object" && "target" in eventOrImg
        ? /** @type {HTMLElement|null} */ (eventOrImg.target)
        : /** @type {HTMLElement|null} */ (eventOrImg);

    if (!img) {
      return;
    }

    const slot = resolveMediaSlot(img);
    if (slot) {
      const widthAttr = Number(
        /** @type {HTMLImageElement} */ (img).getAttribute?.("width") ||
          /** @type {HTMLImageElement} */ (img).width ||
          0
      );
      const heightAttr = Number(
        /** @type {HTMLImageElement} */ (img).getAttribute?.("height") ||
          /** @type {HTMLImageElement} */ (img).height ||
          0
      );

      slot.classList?.add?.("ds-media-slot--broken");
      slot.classList?.add?.("ds-placeholder");

      if (slot.style) {
        if (widthAttr > 0 && !slot.style.minWidth) {
          slot.style.minWidth = `${widthAttr}px`;
        }
        if (heightAttr > 0 && !slot.style.minHeight) {
          slot.style.minHeight = `${heightAttr}px`;
        }
        if (widthAttr > 0 && heightAttr > 0 && !slot.style.aspectRatio) {
          slot.style.aspectRatio = `${widthAttr} / ${heightAttr}`;
        }
      }
    }

    const src =
      /** @type {HTMLImageElement} */ (img).currentSrc ||
      /** @type {HTMLImageElement} */ (img).src ||
      img.getAttribute?.("src") ||
      "";
    console.warn("[portfolio] media image failed to load:", src || "(empty src)");
  } catch (err) {
    console.error("[portfolio] onImageError handler failed:", err);
  }
}

/**
 * @param {EventTarget|null|undefined} target
 * @param {HTMLElement} rootEl
 * @returns {boolean}
 */
function isInsideRoot(target, rootEl) {
  if (!target || !rootEl) {
    return false;
  }
  if (typeof rootEl.contains === "function") {
    return rootEl.contains(/** @type {Node} */ (target));
  }
  return false;
}

/**
 * @param {object} inputMode
 */
function syncSuppress(inputMode) {
  inputMode.suppressClicks = Boolean(
    inputMode.spaceDown || inputMode.isPanning || inputMode.cardDragging
  );
}

/**
 * Activates a portfolio card: modal → no-op (a11y preventDefault);
 * URL → open in a new tab. Shared by canvas interactions and mobile sheet.
 *
 * @param {HTMLElement|null|undefined} card
 * @param {MouseEvent|KeyboardEvent|Event|null|undefined} [event]
 * @returns {boolean} true if the hit was a card activate path
 */
export function activateCardHit(card, event) {
  if (!card) {
    return false;
  }
  if (card.classList?.contains?.("scene-about-cluster")) {
    return false;
  }
  if (card.dataset?.cardAction === "modal") {
    // Future: open project modal. Keep focusable but do not navigate yet.
    if (event && event.type === "keydown") {
      const key = /** @type {KeyboardEvent} */ (event).key;
      if (key === "Enter" || key === " ") {
        event.preventDefault?.();
      }
    }
    return true;
  }
  const url = String(card.dataset?.cardUrl || "").trim();
  if (!url) {
    return false;
  }
  if (event && event.type === "keydown") {
    const key = /** @type {KeyboardEvent} */ (event).key;
    if (key !== "Enter" && key !== " ") {
      return false;
    }
    event.preventDefault?.();
  }
  try {
    if (typeof window !== "undefined" && typeof window.open === "function") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } catch {
    /* harness / popup blocked */
  }
  return true;
}

/**
 * Registers interactive hits: Tapper ± zoom, contact no-nav, image errors,
 * suppress clicks while Space-pan, long-press card drag in world space.
 * `rootEl` should be the viewport (covers fixed chrome + world).
 *
 * @param {HTMLElement|null} rootEl
 * @param {{ zoomBy?: Function, zoomStep?: number, getState?: Function }|null} camera
 * @param {{ suppressClicks?: boolean, spaceDown?: boolean, isPanning?: boolean, cardDragging?: boolean }} [inputMode]
 * @returns {() => void} unbind
 */
export function bindInteractions(rootEl, camera, inputMode = {}) {
  if (!rootEl || typeof rootEl.addEventListener !== "function") {
    return () => {};
  }

  if (inputMode.cardDragging === undefined) {
    inputMode.cardDragging = false;
  }

  const step =
    camera && Number.isFinite(camera.zoomStep) ? Number(camera.zoomStep) : 0.1;

  /** @type {ReturnType<typeof setTimeout>|null} */
  let pressTimer = null;
  /** @type {HTMLElement|null} */
  let pressCard = null;
  /** @type {number|null} */
  let pressPointerId = null;
  let pressStartX = 0;
  let pressStartY = 0;
  let pressStartedAt = 0;
  let pressLastX = 0;
  let pressLastY = 0;
  /** @type {HTMLElement|null} */
  let dragCard = null;
  let dragLastX = 0;
  let dragLastY = 0;
  /** @type {string|null} */
  let dragBaseZ = null;
  /** True if the current card press produced a drag move (skip click→URL). */
  let cardDragMoved = false;

  function clearPressTimer() {
    if (pressTimer != null) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    pressCard = null;
    pressPointerId = null;
  }

  /**
   * @param {number} delayMs
   * @param {{ clientX: number, clientY: number, pointerId?: number }} point
   */
  function armPressTimer(delayMs, point) {
    if (pressTimer != null) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    pressTimer = setTimeout(() => {
      pressTimer = null;
      if (!pressCard) {
        return;
      }
      beginCardDrag(pressCard, {
        clientX: point.clientX,
        clientY: point.clientY,
        pointerId: pressPointerId ?? point.pointerId,
      });
    }, Math.max(0, delayMs));
  }

  function endCardDrag() {
    if (dragCard) {
      dragCard.classList.remove("is-card-grab", "is-card-dragging");
      if (dragBaseZ != null) {
        dragCard.style.zIndex = dragBaseZ;
      }
      dragCard = null;
    }
    dragBaseZ = null;
    inputMode.cardDragging = false;
    syncSuppress(inputMode);
    clearPressTimer();
  }

  /**
   * @param {HTMLElement} card
   * @param {{ clientX: number, clientY: number, pointerId?: number }} e
   */
  function beginCardDrag(card, e) {
    dragCard = card;
    dragLastX = e.clientX;
    dragLastY = e.clientY;
    dragBaseZ = card.style.zIndex || String(card.dataset?.nodeKind ? "2" : "");
    cardDragMoved = false;
    inputMode.cardDragging = true;
    syncSuppress(inputMode);
    card.classList.add("is-card-grab", "is-card-dragging");
    card.style.zIndex = "40";
    if (
      typeof card.setPointerCapture === "function" &&
      e.pointerId != null
    ) {
      try {
        card.setPointerCapture(e.pointerId);
      } catch {
        /* harness / lost target */
      }
    }
  }

  /**
   * @param {Event} event
   */
  function suppressInteractiveHit(event) {
    if (!inputMode.suppressClicks) {
      return;
    }
    const target = /** @type {HTMLElement|null} */ (event.target);
    if (!target || typeof target.closest !== "function") {
      return;
    }
    if (!isInsideRoot(target, rootEl)) {
      return;
    }
    if (target.closest(SUPPRESSIBLE_SELECTOR)) {
      event.preventDefault?.();
      event.stopPropagation?.();
    }
  }

  /**
   * @param {MouseEvent|PointerEvent|Event} event
   */
  function onTapperActivate(event) {
    if (inputMode.suppressClicks || inputMode.cardDragging) {
      return;
    }
    const target = /** @type {HTMLElement|null} */ (event.target);
    if (!target || typeof target.closest !== "function") {
      return;
    }
    if (!isInsideRoot(target, rootEl)) {
      return;
    }
    const hit = target.closest(
      "[data-tapper-action], .scene-tapper__hit, .ds-tapper button"
    );
    if (!hit || !isInsideRoot(hit, rootEl)) {
      return;
    }

    const action =
      hit.getAttribute?.("data-tapper-action") ||
      /** @type {HTMLElement} */ (hit).dataset?.tapperAction;

    if (!camera || typeof camera.zoomBy !== "function") {
      return;
    }

    if (action === "zoom-out") {
      event.preventDefault?.();
      camera.zoomBy(-step, "viewportCenter");
      return;
    }
    if (action === "zoom-in") {
      event.preventDefault?.();
      camera.zoomBy(+step, "viewportCenter");
    }
  }

  /**
   * @param {MouseEvent|Event} event
   */
  function onContactClick(event) {
    const target = /** @type {HTMLElement|null} */ (event.target);
    if (!target || typeof target.closest !== "function") {
      return;
    }
    if (!isInsideRoot(target, rootEl)) {
      return;
    }
    const link = target.closest(
      ".ds-sidebar__contacts a, .ds-sidebar__contacts .ds-link, a.ds-link"
    );
    if (!link || !isInsideRoot(link, rootEl)) {
      return;
    }
    if (inputMode.suppressClicks) {
      event.preventDefault?.();
      event.stopPropagation?.();
      return;
    }
    const href = String(link.getAttribute?.("href") ?? link.href ?? "").trim();
    if (!href || href === "#") {
      event.preventDefault?.();
    }
  }

  /**
   * Click / keyboard activate on Card with card.url opens the project in a new tab.
   * Cards with data-card-action="modal" are reserved for a future modal (no-op for now).
   * Skipped after a drag move so long-press pan does not navigate.
   *
   * @param {MouseEvent|KeyboardEvent|Event} event
   */
  function onCardActivate(event) {
    if (inputMode.suppressClicks || inputMode.spaceDown || inputMode.isPanning) {
      return;
    }
    if (cardDragMoved) {
      cardDragMoved = false;
      return;
    }
    const target = /** @type {HTMLElement|null} */ (event.target);
    if (!target || typeof target.closest !== "function") {
      return;
    }
    if (!isInsideRoot(target, rootEl)) {
      return;
    }
    const card = /** @type {HTMLElement|null} */ (
      target.closest(".ds-card, [data-node-kind='card']")
    );
    if (!card || !isInsideRoot(card, rootEl)) {
      return;
    }
    activateCardHit(card, event);
  }

  /**
   * @param {Event} event
   */
  function onCriticalImageError(event) {
    const target = /** @type {HTMLElement|null} */ (event.target);
    if (!target || target.tagName !== "IMG") {
      return;
    }
    if (!isInsideRoot(target, rootEl)) {
      return;
    }
    if (typeof target.matches === "function") {
      if (!target.matches(CRITICAL_IMG_SELECTOR)) {
        return;
      }
    }
    onImageError(event);
  }

  /**
   * @param {PointerEvent} event
   */
  function onCardPointerDown(event) {
    if (event.button != null && event.button !== 0) {
      return;
    }
    if (inputMode.spaceDown || inputMode.isPanning || inputMode.cardDragging) {
      return;
    }
    const target = /** @type {HTMLElement|null} */ (event.target);
    if (!target || typeof target.closest !== "function") {
      return;
    }
    const card = /** @type {HTMLElement|null} */ (target.closest(CARD_SELECTOR));
    if (!card || !isInsideRoot(card, rootEl)) {
      return;
    }
    // Only world canvas cards — not showcase chrome samples if any.
    if (card.classList?.contains?.("scene-chrome")) {
      return;
    }
    if (card.closest?.(".scene-chrome")) {
      return;
    }

    clearPressTimer();
    pressCard = card;
    pressPointerId = event.pointerId != null ? event.pointerId : null;
    pressStartX = event.clientX;
    pressStartY = event.clientY;
    pressLastX = event.clientX;
    pressLastY = event.clientY;
    pressStartedAt = Date.now();
    cardDragMoved = false;
    armPressTimer(CARD_LONG_PRESS_MS, {
      clientX: pressStartX,
      clientY: pressStartY,
      pointerId: pressPointerId ?? undefined,
    });
  }

  /**
   * @param {PointerEvent} event
   */
  function onCardPointerMove(event) {
    if (
      dragCard &&
      (pressPointerId == null ||
        event.pointerId == null ||
        event.pointerId === pressPointerId)
    ) {
      const scale =
        camera && typeof camera.getState === "function"
          ? Number(camera.getState().scale) || 1
          : 1;
      const dxScreen = event.clientX - dragLastX;
      const dyScreen = event.clientY - dragLastY;
      dragLastX = event.clientX;
      dragLastY = event.clientY;
      if (dxScreen !== 0 || dyScreen !== 0) {
        cardDragMoved = true;
        const left = Number.parseFloat(String(dragCard.style.left || "0")) || 0;
        const top = Number.parseFloat(String(dragCard.style.top || "0")) || 0;
        dragCard.style.left = `${left + dxScreen / scale}px`;
        dragCard.style.top = `${top + dyScreen / scale}px`;
      }
      event.preventDefault?.();
      return;
    }

    if (pressCard && pressTimer != null) {
      if (
        pressPointerId != null &&
        event.pointerId != null &&
        event.pointerId !== pressPointerId
      ) {
        return;
      }
      const dist = Math.hypot(
        event.clientX - pressStartX,
        event.clientY - pressStartY
      );
      if (dist > CARD_PRESS_SLOP_PX) {
        pressLastX = event.clientX;
        pressLastY = event.clientY;
        const elapsed = Date.now() - pressStartedAt;
        const point = {
          clientX: event.clientX,
          clientY: event.clientY,
          pointerId: pressPointerId ?? undefined,
        };
        if (elapsed >= CARD_DRAG_MOVE_ARM_MS) {
          if (pressTimer != null) {
            clearTimeout(pressTimer);
            pressTimer = null;
          }
          const card = pressCard;
          // Seed from press origin so this flick frame applies full delta.
          beginCardDrag(card, {
            clientX: pressStartX,
            clientY: pressStartY,
            pointerId: pressPointerId ?? undefined,
          });
          pressCard = null;
          const scale =
            camera && typeof camera.getState === "function"
              ? Number(camera.getState().scale) || 1
              : 1;
          const dxScreen = event.clientX - pressStartX;
          const dyScreen = event.clientY - pressStartY;
          dragLastX = event.clientX;
          dragLastY = event.clientY;
          if ((dxScreen !== 0 || dyScreen !== 0) && card) {
            const left = Number.parseFloat(String(card.style.left || "0")) || 0;
            const top = Number.parseFloat(String(card.style.top || "0")) || 0;
            card.style.left = `${left + dxScreen / scale}px`;
            card.style.top = `${top + dyScreen / scale}px`;
          }
          event.preventDefault?.();
        } else {
          armPressTimer(CARD_DRAG_MOVE_ARM_MS - elapsed, point);
        }
      }
    }
  }

  /**
   * @param {PointerEvent} event
   */
  function onCardPointerUp(event) {
    if (
      dragCard &&
      (pressPointerId == null ||
        event.pointerId == null ||
        event.pointerId === pressPointerId)
    ) {
      endCardDrag();
      event.preventDefault?.();
      return;
    }
    if (
      pressPointerId == null ||
      event.pointerId == null ||
      event.pointerId === pressPointerId
    ) {
      clearPressTimer();
    }
  }

  const captureOpts = { capture: true };

  rootEl.addEventListener("pointerdown", suppressInteractiveHit, captureOpts);
  rootEl.addEventListener("click", suppressInteractiveHit, captureOpts);
  rootEl.addEventListener("click", onTapperActivate);
  rootEl.addEventListener("click", onContactClick);
  rootEl.addEventListener("click", onCardActivate);
  rootEl.addEventListener("keydown", onCardActivate);
  rootEl.addEventListener("error", onCriticalImageError, captureOpts);
  rootEl.addEventListener("pointerdown", onCardPointerDown);
  rootEl.addEventListener("pointermove", onCardPointerMove);
  rootEl.addEventListener("pointerup", onCardPointerUp);
  rootEl.addEventListener("pointercancel", onCardPointerUp);

  /** @type {HTMLElement[]} */
  const imgs =
    typeof rootEl.querySelectorAll === "function"
      ? Array.from(rootEl.querySelectorAll(CRITICAL_IMG_SELECTOR))
      : [];
  for (const img of imgs) {
    img.addEventListener("error", onImageError);
  }

  return function unbind() {
    rootEl.removeEventListener(
      "pointerdown",
      suppressInteractiveHit,
      captureOpts
    );
    rootEl.removeEventListener("click", suppressInteractiveHit, captureOpts);
    rootEl.removeEventListener("click", onTapperActivate);
    rootEl.removeEventListener("click", onContactClick);
    rootEl.removeEventListener("click", onCardActivate);
    rootEl.removeEventListener("keydown", onCardActivate);
    rootEl.removeEventListener("error", onCriticalImageError, captureOpts);
    rootEl.removeEventListener("pointerdown", onCardPointerDown);
    rootEl.removeEventListener("pointermove", onCardPointerMove);
    rootEl.removeEventListener("pointerup", onCardPointerUp);
    rootEl.removeEventListener("pointercancel", onCardPointerUp);
    for (const img of imgs) {
      img.removeEventListener("error", onImageError);
    }
    endCardDrag();
  };
}
