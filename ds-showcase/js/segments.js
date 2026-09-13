/**
 * SegmentsControl — sliding thumb between options (Figma Segmets_control).
 */

/**
 * Ensures a thumb exists and wires click → smooth active index.
 *
 * @param {HTMLElement} root `.ds-segments`
 * @returns {() => void} teardown
 */
export function bindSegmentsControl(root) {
  if (!root || !(root instanceof HTMLElement)) {
    return () => {};
  }

  const items = Array.from(root.querySelectorAll(".ds-segments__item"));
  if (items.length === 0) {
    return () => {};
  }

  let thumb = root.querySelector(".ds-segments__thumb");
  if (!thumb) {
    thumb = document.createElement("span");
    thumb.className = "ds-segments__thumb";
    thumb.setAttribute("aria-hidden", "true");
    root.insertBefore(thumb, root.firstChild);
  }

  /**
   * @param {number} index
   */
  function setActive(index) {
    const next = Math.max(0, Math.min(items.length - 1, index));
    root.dataset.active = String(next);
    items.forEach((btn, i) => {
      const on = i === next;
      btn.classList.toggle("ds-segments__item--active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.tabIndex = on ? 0 : -1;
    });
    const activeLabel = items[next]?.textContent?.trim() || "";
    if (activeLabel) {
      root.setAttribute("aria-label", `${activeLabel} активна`);
    }
  }

  /** @type {Array<() => void>} */
  const cleanups = [];

  items.forEach((btn, i) => {
    const onClick = () => setActive(i);
    btn.addEventListener("click", onClick);
    cleanups.push(() => btn.removeEventListener("click", onClick));
  });

  const initial = items.findIndex((btn) =>
    btn.classList.contains("ds-segments__item--active")
  );
  // Skip transition on first paint
  const thumbStyle = thumb.style;
  const prevThumbTransition =
    thumbStyle && typeof thumbStyle.transition === "string"
      ? thumbStyle.transition
      : "";
  if (thumbStyle) {
    thumbStyle.transition = "none";
  }
  setActive(initial >= 0 ? initial : 0);
  requestAnimationFrame(() => {
    if (thumbStyle) {
      thumbStyle.transition = prevThumbTransition;
    }
  });

  return () => {
    for (const off of cleanups) {
      off();
    }
  };
}

/**
 * @param {ParentNode | Document} [scope]
 * @returns {() => void}
 */
export function bindAllSegmentsControls(scope = document) {
  const roots = Array.from(scope.querySelectorAll(".ds-segments"));
  const teardowns = roots.map((el) => bindSegmentsControl(/** @type {HTMLElement} */ (el)));
  return () => {
    for (const off of teardowns) {
      off();
    }
  };
}
