/**
 * Dark theme and its toggle.
 *
 * The site runs on design-system CSS variables, so the theme is a matter of
 * overriding tokens under `html[data-theme="dark"]` — no markup changes. Only a
 * few hardcoded spots need explicit rules: the page backdrop, the scene grid and
 * the boot loader.
 */
import { INFINITE_BG } from "../../infiniteBg.js";

const STORAGE_KEY = "portfolio-theme";
const INLINE_CLASS = "dots-theme-toggle--inline";
const SLOT_CLASS = "dots-theme-slot";

/**
 * Dark palette (Figma DarkColors 383:15362 fills + home 386:20585).
 * Color tokens live in tokens.css under html[data-theme="dark"];
 * these values drive canvas/boot surfaces that CSS variables cannot reach.
 */
export const DARK = Object.freeze({
  page: "#121214",
  surface: "#232323",
  raised: "#2f2f35",
  line: "#2f2f35",
  text: "#f5f5f5",
  muted: "#b4b4bd",
  soft: "#b4b4bd",
  dot: "#2f2f35",
  primary: "#2d97f7",
  primaryHover: "#3983ea",
});

const R = INFINITE_BG.worldDotRadius;

const CSS = `
  /* Token overrides are in ds-showcase/css/tokens.css (html[data-theme="dark"]). */
  html[data-theme="dark"],
  html[data-theme="dark"] body,
  html[data-theme="dark"] .viewport,
  html[data-theme="dark"] .viewport.portfolio--mobile,
  /* Case pages share the page backdrop, not the surface colour.
     Do NOT paint .case-page__backdrop — it is a click-catcher over the
     page while MenuMobile is open; an opaque fill would hide the content. */
  html[data-theme="dark"] .case-page,
  html[data-theme="dark"] .ds-showcase {
    background-color: ${DARK.page} !important;
  }
  /* Mobile sheet stays clear so the dotted viewport grid shows through. */
  html[data-theme="dark"] .portfolio-mobile-host {
    background-color: transparent !important;
  }
  /* Their own surfaces stay one step lighter, as in the design system. */
  html[data-theme="dark"] .case-page__shell,
  html[data-theme="dark"] .case-page__sidebar {
    background-color: transparent;
  }
  /* The scene grid is painted inline and panned with the camera: only the dot
     image is overridden, position and size stay the site's own. */
  html[data-theme="dark"] .scene-infinite-bg {
    background-color: ${DARK.page} !important;
    background-image: radial-gradient(circle ${R}px at ${R}px ${R}px, ${DARK.dot} 99%, transparent 100%) !important;
  }
  /* The fallback grid the loader paints where the site has none (mobile). Its
     color belongs to the theme, not to an inline style written at load time. */
  [data-dots-grid-bg] {
    background-image: radial-gradient(circle ${R}px at ${R}px ${R}px, ${INFINITE_BG.dotColor} 99%, transparent 100%) !important;
  }
  html[data-theme="dark"] [data-dots-grid-bg] {
    background-image: radial-gradient(circle ${R}px at ${R}px ${R}px, ${DARK.dot} 99%, transparent 100%) !important;
  }
  /* The mobile sheet had its fill removed on purpose — it sits above the grid. */
  html[data-theme="dark"] [data-dots-clear-bg] { background-color: transparent !important; }
  html[data-theme="dark"] .boot-loader { background-color: ${DARK.page}; }
  html[data-theme="dark"] .boot-loader__badge { background: ${DARK.surface}; }
  html[data-theme="dark"] .boot-loader__pct { color: ${DARK.text}; }
  /* Placeholder slots: light #ededed fringe shows as white hairline in dark. */
  html[data-theme="dark"] .ds-avatar.ds-placeholder,
  html[data-theme="dark"] .scene-comp.ds-placeholder,
  html[data-theme="dark"] .ds-media-slot--broken,
  html[data-theme="dark"] .ds-card__media.ds-placeholder {
    background-color: ${DARK.raised};
  }
  /* Some icons are images drawn in dark ink on transparent: those get inverted
     in tokens.css (html[data-theme="dark"] .ds-icon:has(> img)). */
  .dots-theme-toggle {
    position: fixed;
    right: 20px;
    top: 20px;
    z-index: 99999;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 1px solid var(--color-gray-dark, #e4e4e4);
    border-radius: 50%;
    background: var(--color-white, #fefefe);
    color: var(--color-black, #121214);
    cursor: pointer;
    padding: 0;
    box-shadow: var(--shadow, 0 5px 9px #bbbbbd40);
    transition-property: transform, background, border-color, opacity;
    transition-duration: .2s;
    transition-timing-function: cubic-bezier(.22,.82,.18,1);
  }
  .dots-theme-toggle:hover { transform: translateY(-2px); }

  /* Figma Tooltip 92:11490 — home ≥1024 only (cases / narrow: aria-label) */
  .dots-theme-toggle .ds-tooltip {
    position: absolute;
    right: calc(100% + 12px);
    top: 50%;
    left: auto;
    transform: translateY(-50%);
    z-index: 1;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 120ms ease, visibility 120ms ease;
  }
  @media (min-width: 1024px) {
    body:not(.case-page) .dots-theme-toggle:hover .ds-tooltip,
    body:not(.case-page) .dots-theme-toggle:focus-visible .ds-tooltip {
      opacity: 1;
      visibility: visible;
    }
  }

  /* Inside the menu the button is just another icon: no fill, no border, no fixing.
     It sits out of flow — otherwise its width shifts the header layout and the title
     stops being centred. */
  .dots-theme-toggle--inline {
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 4px;
    width: 40px;
    height: 40px;
    border: 0;
    background: transparent;
    box-shadow: none;
  }
  .dots-theme-toggle--inline:hover { transform: translateY(-50%); opacity: .7; }
  .dots-theme-slot { position: relative; display: inline-flex; align-items: center; }
  .dots-theme-toggle:focus-visible { outline: 2px solid var(--color-primary, #64b3f9); outline-offset: 2px; }
  .dots-theme-toggle svg { width: 20px; height: 20px; display: block; }
  /* While booting the toggle must not hover over the loader. */
  html.is-booting .dots-theme-toggle { opacity: 0; pointer-events: none; }
`;

const SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
  stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/>
  <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/></svg>`;

const MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M20.5 14.3A8.6 8.6 0 1 1 9.7 3.5a6.9 6.9 0 0 0 10.8 10.8z"/></svg>`;

/** Inert handle for environments without a DOM. */
function noopTheme() {
  return {
    get theme() { return "light"; },
    get isDark() { return false; },
    set() {},
    toggle() { return "light"; },
    syncPlacement() {},
  };
}

/** Things the button must not sit on top of when it floats on its own. */
const CHROME = '.ds-header__burger, .ds-toolbar__burger, .ds-toolbar, .ds-header, .case-page__toolbar';
/** The menu toggle: the theme button belongs right next to it. */
const BURGER = '.ds-header__burger, .ds-toolbar__burger';

const visible = (el) => {
  const box = el.getBoundingClientRect();
  if (!(box.width > 0 && box.height > 0)) return false;
  // Opacity-0 desktop burger (≥1366) still has a box — skip it so the theme
  // docks only to a real menu control, otherwise floats in the free corner.
  try {
    if (typeof getComputedStyle === "function") {
      const cs = getComputedStyle(el);
      if (cs) {
        if (cs.display === "none" || cs.visibility === "hidden") return false;
        const opacity = Number.parseFloat(cs.opacity);
        if (Number.isFinite(opacity) && opacity <= 0.01) return false;
      }
    }
  } catch {
    /* stub DOM in tests — size alone is enough */
  }
  return true;
};

/**
 * Docks the button right beside the menu toggle, to its left.
 *
 * Inserting it as a sibling is not enough: the header spreads its children to the
 * edges, leaving a hundred-pixel gap between the two. So both move into a shared
 * wrapper — to the header that is a single child, and they stay together.
 *
 * @param {HTMLElement} burger
 * @param {HTMLElement} button
 */
function dockNextTo(burger, button) {
  let slot = burger.parentElement;
  if (!slot?.classList.contains(SLOT_CLASS)) {
    slot = document.createElement('div');
    slot.className = SLOT_CLASS;
    burger.replaceWith(slot);
    slot.append(burger);
  }
  // Already docked — do not re-insert (stub DOMs may duplicate on insertBefore).
  if (button.parentElement === slot && button.nextElementSibling === burger) {
    return;
  }
  // Real DOM insertBefore moves the node; stubs may need an explicit detach.
  if (button.parentElement && typeof button.remove === "function") {
    button.remove();
  }
  slot.insertBefore(button, burger);
}

/**
 * Menu toggle to dock beside. Prefer a fully visible control; on case desktop
 * (≥1366) the burger stays opacity 0 but is still the dock target in the header.
 *
 * @returns {HTMLElement|null}
 */
function findDockBurger() {
  if (typeof document.querySelectorAll !== "function") return null;
  const all = Array.from(document.querySelectorAll(BURGER));
  const shown = all.find(visible);
  if (shown) return /** @type {HTMLElement} */ (shown);
  const laidOut = all.find((el) => {
    const box = el.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  });
  return laidOut ? /** @type {HTMLElement} */ (laidOut) : null;
}

/**
 * Places the button wherever there is room.
 *
 * Where a page has a menu, the button belongs in it — next to the toggle, living in
 * the header flow rather than floating over the page. Without a menu it falls back to
 * the top-right corner, measured rather than hardcoded: step aside if something is
 * next to it, drop below if something spans the width.
 *
 * @param {HTMLElement} button
 */
function place(button) {
  if (typeof document.querySelectorAll !== 'function') return;

  // A page with a menu gets the button inside it, beside the toggle.
  // Of the two headers (regular and mobile toolbar) take the one on screen,
  // or the opacity-0 desktop burger that still owns the header slot.
  const burger = findDockBurger();
  if (burger) {
    button.classList.add(INLINE_CLASS);
    button.style.right = '';
    button.style.top = '';
    dockNextTo(burger, button);
    return;
  }

  // No menu — the button floats, so look for a free corner.
  button.classList.remove(INLINE_CLASS);
  if (button.parentNode !== document.body) document.body.append(button);

  const GAP = 12;
  const EDGE = 20;
  button.style.right = `${EDGE}px`;
  button.style.top = `${EDGE}px`;

  const self = button.getBoundingClientRect();
  let right = EDGE;
  let top = EDGE;

  for (const el of document.querySelectorAll(CHROME)) {
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) continue;
    // Only actual overlaps matter.
    const overlaps = !(box.right < self.left || box.left > self.right
      || box.bottom < self.top || box.top > self.bottom);
    if (!overlaps) continue;

    const wide = box.width > innerWidth * 0.6;
    if (wide) top = Math.max(top, box.bottom + GAP);
    else right = Math.max(right, innerWidth - box.left + GAP);
  }

  // Having dropped below a full-width header there is no reason to move left too.
  button.style.right = `${top > EDGE ? EDGE : right}px`;
  button.style.top = `${top}px`;
}

/**
 * Theme on first visit: the stored choice, otherwise the system setting.
 *
 * @param {string|null} stored
 * @param {boolean} prefersDark
 * @returns {"light"|"dark"}
 */
export function resolveTheme(stored, prefersDark) {
  if (stored === "dark" || stored === "light") return stored;
  return prefersDark ? "dark" : "light";
}

function readStored() {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // private mode — the choice just is not remembered
  }
}

function writeStored(theme) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* fine: the theme holds until reload */
  }
}

/**
 * Applies the theme and mounts the toggle. Call as early as possible so the
 * loader is drawn in the right colors from the first frame.
 *
 * @param {{ mount?: boolean }} [options]
 */
export function setupTheme({ mount = true } = {}) {
  // The entry module is imported in stubbed environments too, where document may
  // be a bare object without head/body.
  if (typeof document === "undefined" || !document.head?.append) return noopTheme();

  const html = document.documentElement;
  if (!html?.setAttribute) return noopTheme();
  // The entry module is imported in DOM-less test environments too.
  const prefersDark =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  let theme = resolveTheme(readStored(), prefersDark);

  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.append(style);

  let button = null;
  /** @type {HTMLElement|null} */
  let tip = null;

  function themeLabel() {
    return theme === "dark" ? "Включить светлую" : "Включить тёмную";
  }

  function isCasePage() {
    try {
      return Boolean(document.body?.classList?.contains("case-page"));
    } catch {
      return false;
    }
  }

  function syncButton() {
    if (!button) return;
    const label = themeLabel();
    button.setAttribute("aria-label", label);
    button.removeAttribute("title");

    button.replaceChildren();
    button.insertAdjacentHTML("afterbegin", theme === "dark" ? SUN : MOON);

    // Tooltip DOM only on home; visibility ≥1024 is CSS. Cases — aria-label only.
    if (isCasePage()) {
      if (tip?.parentNode) tip.remove();
      return;
    }

    if (!tip) {
      tip = document.createElement("span");
      tip.className = "ds-tooltip";
      tip.setAttribute("role", "tooltip");
      tip.setAttribute("aria-hidden", "true");
    }
    tip.textContent = label;
    button.appendChild(tip);
  }

  function apply(next) {
    theme = next;
    if (theme === "dark") html.setAttribute("data-theme", "dark");
    else html.removeAttribute("data-theme");
    syncButton();
  }

  apply(theme);

  if (mount && document.body?.append) {
    button = document.createElement("button");
    button.type = "button";
    button.className = "dots-theme-toggle";
    button.addEventListener("click", () => {
      apply(theme === "dark" ? "light" : "dark");
      writeStored(theme);
    });

    // Case pages: mount straight into the header/toolbar slot so the control
    // never appears as the home floating button, even for one frame.
    const burger = findDockBurger();
    if (burger) {
      button.classList.add(INLINE_CLASS);
      dockNextTo(burger, button);
    } else {
      document.body.append(button);
    }
    apply(theme);

    const reposition = () => {
      if (button) place(button);
    };
    // Re-dock if chrome swaps (Header ↔ Toolbar) after layout / resize.
    reposition();
    if (typeof requestAnimationFrame === "function" && button.getBoundingClientRect) {
      requestAnimationFrame(reposition);
      window.addEventListener?.("resize", reposition);
      window.addEventListener?.("load", reposition, { once: true });
      if (typeof MutationObserver === "function") {
        new MutationObserver(reposition).observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    }

    return {
      get theme() { return theme; },
      get isDark() { return theme === "dark"; },
      set(next) { apply(next); writeStored(next); },
      toggle() {
        apply(theme === "dark" ? "light" : "dark");
        writeStored(theme);
        return theme;
      },
      /** Re-dock after case chrome is ready (header / toolbar burger). */
      syncPlacement: reposition,
    };
  }

  return {
    get theme() { return theme; },
    get isDark() { return theme === "dark"; },
    set(next) { apply(next); writeStored(next); },
    toggle() {
      apply(theme === "dark" ? "light" : "dark");
      writeStored(theme);
      return theme;
    },
    syncPlacement() {},
  };
}
