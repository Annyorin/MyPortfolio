/**
 * Smooth About-me expand: Macbook grows to Figma 248:17178 fraction of the viewport.
 * Motion language matches rickyzhang.me / card expand (cubic-bezier 0.32, 0.72, 0, 1).
 */

import {
  buildAboutExpandedLayout,
  getAboutExpandedLayout,
} from "../../shared/layout.js";

/** Keep in sync with `.scene-about-cluster.is-about-expanding` CSS. */
export const ABOUT_EXPAND_MS = 720;

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/**
 * @returns {boolean}
 */
function prefersReducedMotion() {
  try {
    const mm =
      (typeof window !== "undefined" && window.matchMedia) ||
      (typeof globalThis !== "undefined" && globalThis.matchMedia);
    return Boolean(mm?.("(prefers-reduced-motion: reduce)")?.matches);
  } catch {
    return false;
  }
}

/**
 * @param {() => void} fn
 * @returns {void}
 */
function nextFrame(fn) {
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => fn());
    return;
  }
  setTimeout(fn, 0);
}

/**
 * @param {HTMLElement} el
 * @param {{ x: number, y: number, width: number, height: number, rotation?: number }} geom
 * @returns {void}
 */
function applyGeom(el, geom) {
  el.style.left = `${geom.x}px`;
  el.style.top = `${geom.y}px`;
  el.style.width = `${geom.width}px`;
  el.style.height = `${geom.height}px`;
  const rot = Number(geom.rotation) || 0;
  if (rot !== 0) {
    el.style.transform = `rotate(${-rot}deg)`;
    el.style.transformOrigin = "0 0";
  } else {
    el.style.transform = "none";
    el.style.transformOrigin = "0 0";
  }
}

/**
 * @param {HTMLElement} about
 * @returns {{
 *   cluster: { x: number, y: number, width: number, height: number },
 *   children: Record<string, { x: number, y: number, width: number, height: number, rotation: number }>
 * }|null}
 */
function readCollapsed(about) {
  const raw = about.dataset?.aboutCollapsed;
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * @param {ParentNode|null|undefined} root
 * @returns {HTMLElement[]}
 */
function cardNodes(root) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return [];
  }
  return Array.from(
    /** @type {NodeListOf<HTMLElement>} */ (
      root.querySelectorAll(
        ".scene-node[data-node-kind='card'], .ds-card[data-node-kind='card']"
      )
    )
  );
}

/**
 * Creates About-me expand/collapse controller for the portfolio canvas.
 *
 * @param {{
 *   aboutEl: HTMLElement,
 *   worldEl?: HTMLElement|Element|null,
 *   camera?: {
 *     zoomTo?: Function,
 *     worldToScreen?: Function,
 *     screenToWorld?: Function,
 *     getState?: Function,
 *     apply?: Function,
 *     panBy?: Function,
 *   }|null,
 *   layoutId?: string|null,
 *   viewportEl?: HTMLElement|Element|null,
 * }} options
 * @returns {{
 *   isExpanded: () => boolean,
 *   open: () => void,
 *   close: () => void,
 *   toggle: () => void,
 *   destroy: () => void,
 * }}
 */
export function createAboutExpand(options) {
  const aboutEl = options.aboutEl;
  const worldEl = options.worldEl || aboutEl?.parentElement || null;
  const camera = options.camera || null;
  let layoutId = options.layoutId || null;
  const viewportEl = options.viewportEl || null;

  /** @type {boolean} */
  let expanded = false;
  /** @type {boolean} */
  let busy = false;
  /** @type {ReturnType<typeof setTimeout>|null} */
  let settleTimer = null;

  /**
   * @returns {void}
   */
  function clearSettle() {
    if (settleTimer != null) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }
  }

  /**
   * @param {boolean} next
   * @returns {void}
   */
  function setCardsDimmed(next) {
    for (const card of cardNodes(worldEl)) {
      if (next) {
        card.classList.add("is-about-dimmed");
        card.setAttribute("aria-hidden", "true");
      } else {
        card.classList.remove("is-about-dimmed");
        card.removeAttribute("aria-hidden");
      }
    }
  }

  /**
   * Expanded Macbook size: Figma screen fraction (~787/1366) of the live viewport,
   * converted to world units. Anchor stays the canonical expanded layout center
   * (same as before the size bump — not the collapsed About position).
   *
   * @returns {import("../../shared/layout.js").AboutExpandedLayout}
   */
  function resolveExpandedLayout() {
    const base = getAboutExpandedLayout(layoutId);
    const cx = base.cluster.x + base.cluster.width / 2;
    const cy = base.cluster.y + base.cluster.height / 2;

    const vw = Number(
      /** @type {HTMLElement|null} */ (viewportEl)?.clientWidth
    );
    const vh = Number(
      /** @type {HTMLElement|null} */ (viewportEl)?.clientHeight
    );
    const scale =
      camera && typeof camera.getState === "function"
        ? Number(camera.getState().scale) || 1
        : 1;

    if (
      Number.isFinite(vw) &&
      Number.isFinite(vh) &&
      vw > 0 &&
      vh > 0 &&
      scale > 0
    ) {
      const screenFit = buildAboutExpandedLayout(vw, vh);
      const worldW = screenFit.cluster.width / scale;
      const worldH = screenFit.cluster.height / scale;
      const childScale = worldW / base.cluster.width;
      return {
        cluster: {
          x: cx - worldW / 2,
          y: cy - worldH / 2,
          width: worldW,
          height: worldH,
        },
        children: {
          macbook: {
            x: 0,
            y: 0,
            width: worldW,
            height: worldH,
            rotation: 0,
          },
          me: {
            x: base.children.me.x * childScale,
            y: base.children.me.y * childScale,
            width: base.children.me.width,
            height: base.children.me.height,
            rotation: 0,
          },
          stiker: {
            x: base.children.stiker.x * childScale,
            y: base.children.stiker.y * childScale,
            width: base.children.stiker.width,
            height: base.children.stiker.height,
            rotation: 0,
          },
        },
      };
    }

    return base;
  }

  /**
   * Soft-focus camera on expanded Macbook center (world space).
   * @param {{ x: number, y: number, width: number, height: number }} cluster
   * @returns {void}
   */
  function focusCluster(cluster) {
    if (!camera || typeof camera.getState !== "function") {
      return;
    }
    if (typeof camera.panBy !== "function" || !viewportEl) {
      return;
    }
    const state = camera.getState();
    const vw = Number(
      /** @type {HTMLElement} */ (viewportEl).clientWidth
    );
    const vh = Number(
      /** @type {HTMLElement} */ (viewportEl).clientHeight
    );
    if (!Number.isFinite(vw) || !Number.isFinite(vh) || vw <= 0 || vh <= 0) {
      return;
    }
    const cx = cluster.x + cluster.width / 2;
    const cy = cluster.y + cluster.height / 2;
    const scale = Number(state.scale) || 1;
    // Prefer content stage center (right of sidebar chrome ≈ 58% like Figma).
    const stageCx = vw * 0.58;
    const stageCy = vh * 0.5;
    const screenX = cx * scale + Number(state.translateX);
    const screenY = cy * scale + Number(state.translateY);
    camera.panBy(stageCx - screenX, stageCy - screenY);
    camera.apply?.();
  }

  /**
   * @param {boolean} open
   * @returns {void}
   */
  function applyState(open) {
    const collapsed = readCollapsed(aboutEl);
    if (!collapsed) {
      return;
    }
    const expandedLayout = resolveExpandedLayout();
    const cluster = open ? expandedLayout.cluster : collapsed.cluster;
    const kids = open ? expandedLayout.children : collapsed.children;

    aboutEl.style.left = `${cluster.x}px`;
    aboutEl.style.top = `${cluster.y}px`;
    aboutEl.style.width = `${cluster.width}px`;
    aboutEl.style.height = `${cluster.height}px`;

    for (const kind of /** @type {const} */ (["macbook", "me", "stiker"])) {
      const el = /** @type {HTMLElement|null} */ (
        aboutEl.querySelector(`[data-node-kind='${kind}']`)
      );
      const geom = kids[kind];
      if (el && geom) {
        applyGeom(el, geom);
      }
    }

    aboutEl.classList.toggle("is-about-open", open);
    aboutEl.setAttribute("aria-expanded", open ? "true" : "false");

    const stickersRoot = /** @type {HTMLElement|null} */ (
      aboutEl.querySelector(".scene-about__stickers")
    );
    if (stickersRoot) {
      if (open) {
        stickersRoot.removeAttribute("inert");
      } else {
        stickersRoot.setAttribute("inert", "");
        for (const btn of stickersRoot.querySelectorAll(
          ".scene-about__sticker.is-hint-open"
        )) {
          btn.classList.remove("is-hint-open");
        }
        if (typeof document !== "undefined" && document?.querySelector) {
          document
            .querySelector(".scene-about__hint-float")
            ?.classList?.remove?.("is-visible");
        }
      }
    }

    setCardsDimmed(open);
    expanded = open;

    if (open) {
      focusCluster(cluster);
    }
  }

/**
 * @param {HTMLElement} about
 * @returns {void}
 */
function snapshotCollapsedFromLive(about) {
  const liveW = Number.parseFloat(String(about.style.width || "0")) || 0;
  const liveH = Number.parseFloat(String(about.style.height || "0")) || 0;
  // Keep the mount-time snapshot until the cluster has real live box metrics
  // (e.g. after applySlotGeometry / drag). Avoid wiping dataset with 0×0.
  if (!(liveW > 0 && liveH > 0)) {
    return;
  }
  /** @type {Record<string, { x: number, y: number, width: number, height: number, rotation: number }>} */
  const children = {};
  for (const kind of /** @type {const} */ (["macbook", "me", "stiker"])) {
    const el = /** @type {HTMLElement|null} */ (
      about.querySelector(`[data-node-kind='${kind}']`)
    );
    if (!el) {
      continue;
    }
    const transform = String(el.style.transform || "");
    const rotMatch = /rotate\((-?[\d.]+)deg\)/.exec(transform);
    // CSS uses rotate(-θ); store Figma θ for applyGeom.
    const cssRot = rotMatch ? Number(rotMatch[1]) : 0;
    children[kind] = {
      x: Number.parseFloat(String(el.style.left || "0")) || 0,
      y: Number.parseFloat(String(el.style.top || "0")) || 0,
      width: Number.parseFloat(String(el.style.width || "0")) || 0,
      height: Number.parseFloat(String(el.style.height || "0")) || 0,
      rotation: cssRot !== 0 ? -cssRot : 0,
    };
  }
  about.dataset.aboutCollapsed = JSON.stringify({
    cluster: {
      x: Number.parseFloat(String(about.style.left || "0")) || 0,
      y: Number.parseFloat(String(about.style.top || "0")) || 0,
      width: liveW,
      height: liveH,
    },
    children,
  });
}

/**
 * @param {boolean} open
 * @returns {void}
 */
function animateTo(open) {
    if (!aboutEl || busy) {
      return;
    }
    if (open === expanded) {
      return;
    }
    if (open) {
      snapshotCollapsedFromLive(aboutEl);
    }
    const collapsed = readCollapsed(aboutEl);
    if (!collapsed) {
      return;
    }

    busy = true;
    clearSettle();
    aboutEl.classList.add("is-about-expanding");

    if (prefersReducedMotion()) {
      applyState(open);
      aboutEl.classList.remove("is-about-expanding");
      busy = false;
      return;
    }

    // Ensure transition class is active before geometry write.
    nextFrame(() => {
      applyState(open);
      settleTimer = setTimeout(() => {
        aboutEl.classList.remove("is-about-expanding");
        busy = false;
        settleTimer = null;
      }, ABOUT_EXPAND_MS);
    });
  }

  aboutEl.setAttribute("role", "button");
  aboutEl.setAttribute("aria-expanded", "false");
  aboutEl.tabIndex = 0;

  return {
    isExpanded() {
      return expanded;
    },
    open() {
      animateTo(true);
    },
    close() {
      animateTo(false);
    },
    toggle() {
      animateTo(!expanded);
    },
    /**
     * @param {string|null|undefined} nextLayoutId
     */
    setLayoutId(nextLayoutId) {
      layoutId = nextLayoutId || null;
      if (expanded) {
        applyState(true);
      }
    },
    destroy() {
      clearSettle();
      aboutEl.classList.remove("is-about-expanding", "is-about-open");
      setCardsDimmed(false);
      aboutEl.removeAttribute("aria-expanded");
      expanded = false;
      busy = false;
    },
  };
}

/** @type {ReturnType<typeof createAboutExpand>|null} */
let activeController = null;

/**
 * @param {Parameters<typeof createAboutExpand>[0]} options
 * @returns {ReturnType<typeof createAboutExpand>}
 */
export function bindAboutExpand(options) {
  activeController?.destroy?.();
  activeController = createAboutExpand(options);
  return activeController;
}

/**
 * @returns {ReturnType<typeof createAboutExpand>|null}
 */
export function getAboutExpandController() {
  return activeController;
}

export { EASE as ABOUT_EXPAND_EASE };
