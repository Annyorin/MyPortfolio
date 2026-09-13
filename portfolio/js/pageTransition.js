/**
 * Same-origin page open: soft crossfade with a light blur.
 * Motion overlaps navigation so the veil covers load instead of waiting for it.
 */

/** Crossfade duration; keep in sync with `.portfolio-page-transition` CSS. */
export const PAGE_CROSSFADE_MS = 240;
/** Navigate before the dissolve ends so load overlaps remaining motion. */
export const PAGE_CROSSFADE_NAVIGATE_AFTER_MS = 180;

export const ENTER_MOTION_KEY = "portfolio-page-enter";
export const HOME_HREF_KEY = "portfolio-home-href";

/** @type {boolean} */
let transitionBusy = false;

/** @type {Set<string>} */
const prefetchedHrefs = new Set();

/**
 * Relative portfolio URLs (e.g. case-dragon.html) stay in-app; http(s)/mailto open externally.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isInternalPortfolioUrl(url) {
  const value = String(url || "").trim();
  if (!value) {
    return false;
  }
  if (/^(https?:|mailto:|tel:|javascript:)/i.test(value)) {
    return false;
  }
  if (value.startsWith("//") || value.startsWith("#")) {
    return false;
  }
  return true;
}

/**
 * @returns {boolean}
 */
function prefersReducedMotion() {
  try {
    return Boolean(
      typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    );
  } catch {
    return false;
  }
}

/**
 * @param {string} href
 * @returns {void}
 */
function appendPrefetchLink(href) {
  if (prefetchedHrefs.has(href) || typeof document === "undefined") {
    return;
  }
  if (!document.head || typeof document.createElement !== "function") {
    return;
  }
  prefetchedHrefs.add(href);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Warm the HTTP cache for an internal portfolio page (hover / pointerdown).
 *
 * @param {string} url
 * @returns {void}
 */
export function prefetchInternalPage(url) {
  if (!isInternalPortfolioUrl(url) || typeof window === "undefined") {
    return;
  }
  let href = "";
  try {
    href = new URL(String(url).trim(), window.location.href).href;
  } catch {
    return;
  }
  appendPrefetchLink(href);
}

/**
 * Prefetch from a card node when it has an internal `data-card-url`.
 *
 * @param {HTMLElement|null|undefined} card
 * @returns {void}
 */
export function prefetchCardIfInternal(card) {
  if (!card || typeof card !== "object") {
    return;
  }
  const url = String(card.dataset?.cardUrl || "").trim();
  if (isInternalPortfolioUrl(url)) {
    prefetchInternalPage(url);
  }
}

/**
 * @returns {void}
 */
function rememberNavigation() {
  try {
    sessionStorage.setItem(ENTER_MOTION_KEY, "crossfade");
    const file = String(window.location.pathname.split("/").pop() || "main.html");
    if (/^main[\w.-]*\.html$/.test(file)) {
      sessionStorage.setItem(HOME_HREF_KEY, file);
    }
  } catch {
    /* private mode */
  }
}

/**
 * Apply a pending crossfade enter class and clear the session flag.
 *
 * @returns {boolean}
 */
export function consumeEnterCrossfade() {
  try {
    const enter = sessionStorage.getItem(ENTER_MOTION_KEY);
    sessionStorage.removeItem(ENTER_MOTION_KEY);
    if (enter === "crossfade") {
      document.documentElement.classList.add("is-page-enter-crossfade");
      return true;
    }
  } catch {
    /* private mode */
  }
  return false;
}

/**
 * Soft dissolve of the current page, then navigate.
 *
 * @param {string} url
 * @param {HTMLElement|null|undefined} [_fromEl]
 * @returns {void}
 */
export function navigateWithExpand(url, _fromEl) {
  const target = String(url || "").trim();
  if (!target || typeof window === "undefined") {
    return;
  }

  if (transitionBusy) {
    return;
  }

  prefetchInternalPage(target);
  rememberNavigation();

  if (prefersReducedMotion()) {
    window.location.assign(target);
    return;
  }

  transitionBusy = true;

  const root = document.createElement("div");
  root.className = "portfolio-page-transition";
  root.setAttribute("aria-hidden", "true");
  document.body.appendChild(root);
  document.body.classList.add("is-page-crossfading");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.add("is-active");
    });
  });

  window.setTimeout(() => {
    window.location.assign(target);
  }, PAGE_CROSSFADE_NAVIGATE_AFTER_MS);
}
