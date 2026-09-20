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

/** Dark palette. Light is simply the absence of the attribute. */
export const DARK = Object.freeze({
  page: "#121214",
  surface: "#1c1c1e",
  raised: "#2a2a2d",
  line: "#34343a",
  text: "#ececec",
  muted: "#9a9aa2",
  soft: "#b4b4bd",
  dot: "#34343d",
});

const R = INFINITE_BG.worldDotRadius;

const CSS = `
  html[data-theme="dark"] {
    color-scheme: dark;
    --color-white: ${DARK.surface};
    --color-black: ${DARK.text};
    --color-secondary: ${DARK.raised};
    --color-gray-dark: ${DARK.line};
    --color-gray-text: ${DARK.muted};
    --color-gray-l: ${DARK.soft};
    --shadow: 0 5px 14px #00000066;
    --shadow-mobile: 0 3px 10px #00000059;
  }
  html[data-theme="dark"],
  html[data-theme="dark"] body,
  html[data-theme="dark"] .viewport,
  html[data-theme="dark"] .viewport.portfolio--mobile,
  html[data-theme="dark"] .portfolio-mobile-host,
  /* Case pages share the page backdrop, not the surface colour. */
  html[data-theme="dark"] .case-page,
  html[data-theme="dark"] .case-page__backdrop,
  html[data-theme="dark"] .ds-showcase {
    background-color: ${DARK.page} !important;
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
  /* Some icons are images drawn in dark ink on transparent: those get inverted. */
  html[data-theme="dark"] .ds-icon { filter: invert(1) hue-rotate(180deg); }
  /* On buttons an icon is a mask filled with currentColor — it already takes its
     color from the tokens, and inverting would turn it black again. */
  html[data-theme="dark"] .ds-button .ds-icon { filter: none; }

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
    color: var(--color-black, #232323);
    cursor: pointer;
    padding: 0;
    box-shadow: var(--shadow, 0 5px 9px #bbbbbd40);
    transition-property: transform, background, border-color, opacity;
    transition-duration: .2s;
    transition-timing-function: cubic-bezier(.22,.82,.18,1);
  }
  .dots-theme-toggle:hover { transform: translateY(-2px); }

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
  };
}

/** Things the button must not sit on top of when it floats on its own. */
const CHROME = '.ds-header__burger, .ds-toolbar__burger, .ds-toolbar, .ds-header, .case-page__toolbar';
/** The menu toggle: the theme button belongs right next to it. */
const BURGER = '.ds-header__burger, .ds-toolbar__burger';

const visible = (el) => {
  const box = el.getBoundingClientRect();
  return box.width > 0 && box.height > 0;
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
  // Theme button first, menu toggle stays rightmost.
  if (button.parentElement !== slot || button.nextElementSibling !== burger) {
    slot.insertBefore(button, burger);
  }
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
  // Of the two headers (regular and mobile toolbar) take the one on screen.
  const burger = Array.from(document.querySelectorAll(BURGER)).find(visible);
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

  function apply(next) {
    theme = next;
    if (theme === "dark") html.setAttribute("data-theme", "dark");
    else html.removeAttribute("data-theme");
    if (button) {
      button.innerHTML = theme === "dark" ? SUN : MOON;
      const label = theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему";
      button.setAttribute("aria-label", label);
      button.title = label;
    }
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
    document.body.append(button);
    apply(theme);

    // Measure after paint: before it the neighbours may not be on screen yet. In
    // environments without a layout (tests, SSR) placement is simply skipped.
    if (typeof requestAnimationFrame === "function" && button.getBoundingClientRect) {
      const reposition = () => place(button);
      requestAnimationFrame(reposition);
      window.addEventListener?.("resize", reposition);
      // The scene is built after startup — re-measure when it changes.
      if (typeof MutationObserver === "function") {
        new MutationObserver(reposition).observe(document.body, { childList: true, subtree: true });
      }
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
  };
}
