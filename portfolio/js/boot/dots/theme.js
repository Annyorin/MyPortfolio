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
  html[data-theme="dark"] .portfolio-mobile-host {
    background-color: ${DARK.page} !important;
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
    bottom: 20px;
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
