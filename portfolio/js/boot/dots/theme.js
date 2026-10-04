/**
 * Dark theme and its toggle.
 *
 * The site runs on design-system CSS variables, so the theme is a matter of
 * overriding tokens under `html[data-theme="dark"]` — no markup changes. Only a
 * few hardcoded spots need explicit rules: the page backdrop, the scene grid and
 * the boot loader.
 */
import { INFINITE_BG } from "../../infiniteBg.js";
import { resolveAsset } from "../../resolveAsset.js";

const STORAGE_KEY = "portfolio-theme";
const INLINE_CLASS = "dots-theme-toggle--inline";
const SLOT_CLASS = "dots-theme-slot";
const DS_ROUND = "ds-button-round";
const DS_OUTLINED = "ds-button-round--outlined";

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
     in tokens.css (html[data-theme="dark"] .ds-icon > img). */
  /* Placement only — home floating = Outlined; case Header/Toolbar = Text (Figma 226:15768 / 247:16546). */
  .dots-theme-toggle {
    position: fixed;
    right: 20px;
    top: 20px;
    z-index: 99999;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition-property: transform, background, border-color, opacity, color;
    transition-duration: .2s;
    transition-timing-function: cubic-bezier(.22,.82,.18,1);
  }
  .dots-theme-toggle:active { outline: none; }
  /* Fallback floating chrome when not yet DS ButtonRound. */
  .dots-theme-toggle:not(.ds-button-round) {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 1px solid var(--color-gray-dark, #e4e4e4);
    border-radius: 50%;
    background: var(--color-white, #fefefe);
    color: var(--color-black, #121214);
    padding: 0;
    box-shadow: var(--shadow, 0 5px 9px #bbbbbd40);
  }
  /* Home Outlined: Figma 417:17882 / 417:17917 — muted Gray_text + lift.
     :hover by default — Electron may not match (hover: hover). */
  .dots-theme-toggle:not(.dots-theme-toggle--inline).ds-button-round--outlined:hover {
    color: var(--color-gray-text, #888888);
    transform: translateY(-2px);
  }
  .dots-theme-toggle:not(.dots-theme-toggle--inline).ds-button-round--outlined:hover .ds-icon {
    color: var(--color-gray-text, #888888);
    background-color: currentColor;
  }
  /* Touch only — no sticky lift / muted (do not use pointer: coarse). */
  @media (hover: none) {
    .dots-theme-toggle:not(.dots-theme-toggle--inline).ds-button-round--outlined:hover {
      color: var(--color-black, #121214);
      transform: none;
    }
    .dots-theme-toggle:not(.dots-theme-toggle--inline).ds-button-round--outlined:hover .ds-icon {
      color: var(--color-black, #121214);
    }
  }

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

  /* Case / Header·Toolbar Text: dock left of burger; size/padding from .ds-button-round.
     Absolute so the 48px hit does not shift the centred title. Hover/pressed = DS CSS. */
  .dots-theme-toggle--inline.ds-button-round {
    position: absolute;
    right: 100%;
    top: 50%;
    left: auto;
    transform: translateY(-50%);
    margin: 0;
    z-index: 1;
  }
  .dots-theme-slot { position: relative; display: inline-flex; align-items: center; }
  .dots-theme-toggle:focus-visible { outline: 2px solid var(--focus-ring, #2d97f7); outline-offset: 2px; }
  /* While booting the toggle must not hover over the loader. */
  html.is-booting .dots-theme-toggle { opacity: 0; pointer-events: none; }
  /* Leave crossfade: floating sits above the veil (z-index 99999 > 10000) — hide it. */
  body.is-page-crossfading .dots-theme-toggle:not(.dots-theme-toggle--inline) {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
  /* Case: only docked --inline in Header/Toolbar; never show orphan floating. */
  body.case-page .dots-theme-toggle:not(.dots-theme-toggle--inline) {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
`;

const DS_PRESSED = "ds-button-round--pressed";

/**
 * DS theme icon (mask via .ds-button-round .ds-icon[data-icon]).
 * light → moon, dark → sun.
 * @param {HTMLElement} button
 * @param {"light"|"dark"} theme
 */
function appendDsThemeIcon(button, theme) {
  const name = theme === "dark" ? "sun" : "moon";
  const icon = document.createElement("span");
  icon.className = "ds-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.dataset.icon = name;
  const img = document.createElement("img");
  img.src = resolveAsset(theme === "dark" ? "icons.sun" : "icons.moon");
  img.alt = "";
  img.width = 24;
  img.height = 24;
  icon.appendChild(img);
  button.appendChild(icon);
}

/** True when primary input has no hover — use pressed, not sticky :hover. */
function prefersTouchPress() {
  try {
    return Boolean(
      typeof window !== "undefined" &&
        window.matchMedia?.("(hover: none)").matches,
    );
  } catch {
    return false;
  }
}

/**
 * Bind --pressed only when (hover: none) so desktop keeps hover Outlined.
 * @param {HTMLElement} button
 */
function bindTouchPressed(button) {
  if (!prefersTouchPress()) return;
  const clear = () => button.classList.remove(DS_PRESSED);
  button.addEventListener("pointerdown", (ev) => {
    if (ev.pointerType === "mouse") return;
    button.classList.add(DS_PRESSED);
  });
  button.addEventListener("pointerup", clear);
  button.addEventListener("pointercancel", clear);
  button.addEventListener("pointerleave", clear);
  button.addEventListener("lostpointercapture", clear);
}

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

/** Case pages dock the control in Header/Toolbar — never float on body. */
function isCasePage() {
  try {
    return Boolean(document.body?.classList?.contains("case-page"));
  } catch {
    return false;
  }
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

  // Case: wait for chrome (resize / MutationObserver / syncPlacement) — never
  // mount a home-style floating control on body for even one frame.
  if (isCasePage()) {
    if (button.parentNode === document.body) {
      button.classList.remove(INLINE_CLASS);
      button.style.right = '';
      button.style.top = '';
      if (typeof button.remove === "function") button.remove();
    }
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
/**
 * Pointer vs keyboard modality for focus rings (WCAG 2.4.7).
 * Chrome marks a mouse click on a button as :focus-visible — hide the ring
 * until the user Tabs (or uses arrows).
 *
 * @returns {void}
 */
function setupFocusModality() {
  const html = document.documentElement;
  if (!html?.classList || typeof document.addEventListener !== "function") {
    return;
  }
  const onPointer = () => {
    html.classList.add("is-pointer-focus");
  };
  const onKey = (event) => {
    const key = event && typeof event.key === "string" ? event.key : "";
    if (
      key === "Tab" ||
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "ArrowLeft" ||
      key === "ArrowRight"
    ) {
      html.classList.remove("is-pointer-focus");
    }
  };
  document.addEventListener("pointerdown", onPointer, true);
  document.addEventListener("keydown", onKey, true);
}

export function setupTheme({ mount = true } = {}) {
  // The entry module is imported in stubbed environments too, where document may
  // be a bare object without head/body.
  if (typeof document === "undefined" || !document.head?.append) return noopTheme();
  setupFocusModality();

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

  function syncButton() {
    if (!button) return;
    const label = themeLabel();
    button.setAttribute("aria-label", label);
    button.removeAttribute("title");

    // Home floating → Outlined (Figma 417:17856); case Header/Toolbar → Text.
    const useOutlined = !button.classList.contains(INLINE_CLASS) && !isCasePage();
    button.classList.add(DS_ROUND);
    if (useOutlined) button.classList.add(DS_OUTLINED);
    else button.classList.remove(DS_OUTLINED);

    button.replaceChildren();
    // light → moon, dark → sun (DS mask assets) for both Text and Outlined.
    appendDsThemeIcon(button, theme);

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
    bindTouchPressed(button);

    // Case pages: mount straight into the header/toolbar slot so the control
    // never appears as the home floating button, even for one frame.
    // If chrome is not ready yet, stay detached — place()/syncPlacement docks later.
    const burger = findDockBurger();
    if (burger) {
      button.classList.add(INLINE_CLASS);
      dockNextTo(burger, button);
    } else if (!isCasePage()) {
      document.body.append(button);
    }
    apply(theme);

    const reposition = () => {
      if (!button) return;
      const before = button.classList.contains(INLINE_CLASS);
      place(button);
      const after = button.classList.contains(INLINE_CLASS);
      if (before !== after) syncButton();
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
