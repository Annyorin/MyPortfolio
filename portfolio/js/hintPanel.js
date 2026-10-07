/**
 * Hint panel on the home canvas (Figma Hint 603:18346 on Портфолио.Главная 1366).
 * Viewport chrome: ≥1024 only, once per unique user, mouse vs trackpad tab.
 */

import { contentMap } from "../../shared/content.js";
import { MOBILE_BREAKPOINT } from "../../shared/layout.js";
import { fixHangingPrepositions } from "../../shared/typography.js";
import { resolveAsset as resolveAssetDefault } from "./resolveAsset.js";

export const HINT_PANEL_STORAGE_KEY = "portfolio-hint-panel-seen";

/**
 * @param {unknown} value
 * @returns {string}
 */
function textOf(value) {
  return fixHangingPrepositions(typeof value === "string" ? value : "");
}

/**
 * Mac / iPad family → trackpad tab; otherwise mouse.
 * Trackpad and mouse both report as `pointerType: mouse`; there is no reliable API.
 *
 * @param {{ platform?: string, userAgent?: string, maxTouchPoints?: number }|null|undefined} nav
 * @returns {"mouse"|"trackpad"}
 */
export function detectHintDevice(nav) {
  const platform = String(nav?.platform || "");
  const ua = String(nav?.userAgent || "");
  const maxTouch = Number(nav?.maxTouchPoints) || 0;
  if (maxTouch > 1 && /MacIntel|Macintosh/.test(`${platform} ${ua}`)) {
    return "trackpad";
  }
  if (
    /Mac|iPhone|iPad|iPod/.test(platform) ||
    /Mac OS X|iPhone|iPad|iPod/.test(ua)
  ) {
    return "trackpad";
  }
  return "mouse";
}

/**
 * @param {{ getItem?: (k: string) => string|null }|null|undefined} storage
 * @returns {boolean}
 */
export function hasSeenHintPanel(storage) {
  try {
    return storage?.getItem?.(HINT_PANEL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * @param {{ setItem?: (k: string, v: string) => void }|null|undefined} storage
 */
export function markHintPanelSeen(storage) {
  try {
    storage?.setItem?.(HINT_PANEL_STORAGE_KEY, "1");
  } catch {
    // private mode / blocked storage — treat as session-only
  }
}

/**
 * @param {ParentNode} parent
 * @param {...Node} nodes
 */
function append(parent, ...nodes) {
  if (typeof parent.append === "function") {
    parent.append(...nodes);
    return;
  }
  for (const node of nodes) {
    parent.appendChild(node);
  }
}

/**
 * @param {Document} doc
 * @param {string} value
 * @returns {Node}
 */
function textNode(doc, value) {
  if (typeof doc.createTextNode === "function") {
    return doc.createTextNode(value);
  }
  const span = doc.createElement("span");
  span.textContent = value;
  return span;
}

/**
 * @param {HTMLElement} p
 * @param {Document} doc
 * @param {string} bodyText
 * @param {string} [key]
 */
function fillHintText(p, doc, bodyText, key) {
  if (!key) {
    append(p, textNode(doc, bodyText));
    return;
  }
  const parts = bodyText.split(key);
  append(p, textNode(doc, parts[0] || "Зажми "));
  const kbd = doc.createElement("span");
  kbd.className = "ds-hint-panel__key";
  kbd.textContent = key;
  append(p, kbd);
  append(p, textNode(doc, parts[1] || ""));
}

/**
 * @param {"mouse"|"trackpad"} variant
 * @param {{
 *   content?: Record<string, string>,
 *   resolveAsset?: (key: string) => string,
 *   doc?: Document
 * }} [opts]
 * @returns {HTMLElement}
 */
export function buildHintPanel(variant, opts = {}) {
  const doc = opts.doc || document;
  const content = opts.content || contentMap;
  const resolveAsset = opts.resolveAsset || resolveAssetDefault;
  const isMouse = variant === "mouse";

  const root = doc.createElement("article");
  root.className = "ds-hint-panel";
  root.dataset.variant = variant;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", "Подсказка по жестам");

  const header = doc.createElement("header");
  header.className = "ds-hint-panel__header";
  const tabs = doc.createElement("div");
  tabs.className = "ds-hint-panel__tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Устройство");

  /**
   * @param {"mouse"|"trackpad"} id
   * @param {string} labelKey
   * @param {boolean} selected
   */
  function makeTab(id, labelKey, selected) {
    const tab = doc.createElement("button");
    tab.type = "button";
    tab.className = selected
      ? "ds-title-sidebar"
      : "ds-title-sidebar ds-title-sidebar--muted";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", selected ? "true" : "false");
    tab.setAttribute("data-hint-tab", id);
    tab.dataset.hintTab = id;
    tab.textContent = textOf(content[labelKey]);
    return tab;
  }

  append(
    tabs,
    makeTab("mouse", "hint.panel.tab.mouse", isMouse),
    makeTab("trackpad", "hint.panel.tab.trackpad", !isMouse)
  );

  const close = doc.createElement("button");
  close.type = "button";
  close.className = "ds-hint-panel__close";
  close.setAttribute("aria-label", textOf(content["hint.panel.close"]));
  const closeIcon = doc.createElement("span");
  closeIcon.className = "ds-icon";
  closeIcon.setAttribute("aria-hidden", "true");
  closeIcon.dataset.icon = "close";
  const closeImg = doc.createElement("img");
  closeImg.src = resolveAsset("icons.close");
  closeImg.alt = "";
  closeImg.width = 20;
  closeImg.height = 20;
  append(closeIcon, closeImg);
  append(close, closeIcon);
  append(header, tabs, close);

  const body = doc.createElement("div");
  body.className = "ds-hint-panel__body";
  body.setAttribute("role", "tabpanel");

  const rows = isMouse
    ? [
        {
          icon: "icons.mouse-zoom",
          dataIcon: "mouseZoom",
          label: "hint.panel.zoom_label",
          body: "hint.panel.mouse.zoom",
          key: "Ctrl",
        },
        {
          icon: "icons.mouse-move",
          dataIcon: "mouseMove",
          label: "hint.panel.move_label",
          body: "hint.panel.mouse.move",
          key: "Space",
        },
      ]
    : [
        {
          icon: "icons.hand-zoom",
          dataIcon: "handZoom",
          label: "hint.panel.zoom_label",
          body: "hint.panel.trackpad.zoom",
        },
        {
          icon: "icons.hand-move",
          dataIcon: "handMove",
          label: "hint.panel.move_label",
          body: "hint.panel.trackpad.move",
        },
      ];

  for (const row of rows) {
    const line = doc.createElement("div");
    line.className = "ds-hint-panel__row";
    const icon = doc.createElement("span");
    icon.className = "ds-icon ds-icon--32";
    icon.setAttribute("aria-hidden", "true");
    icon.dataset.icon = row.dataIcon;
    const img = doc.createElement("img");
    img.src = resolveAsset(row.icon);
    img.alt = "";
    img.width = 32;
    img.height = 32;
    append(icon, img);
    const p = doc.createElement("p");
    p.className = "ds-hint-panel__text";
    const label = doc.createElement("span");
    label.className = "ds-hint-panel__label";
    label.textContent = `${textOf(content[row.label])} `;
    append(p, label);
    fillHintText(p, doc, textOf(content[row.body]), row.key);
    append(line, icon, p);
    append(body, line);
  }

  append(root, header, body);
  return root;
}

/**
 * Mounts the hint as viewport chrome. Hidden below 1024px; stored as seen on first show.
 *
 * @param {HTMLElement|null} viewportEl
 * @param {{
 *   content?: Record<string, string>,
 *   resolveAsset?: (key: string) => string,
 *   storage?: { getItem?: Function, setItem?: Function }|null,
 *   navigator?: { platform?: string, userAgent?: string, maxTouchPoints?: number },
 *   getWidth?: () => number,
 *   win?: Window,
 *   doc?: Document
 * }} [options]
 * @returns {() => void}
 */
export function bindHintPanel(viewportEl, options = {}) {
  if (!viewportEl || typeof viewportEl.appendChild !== "function") {
    return () => {};
  }

  const doc = options.doc || (typeof document !== "undefined" ? document : null);
  const win = options.win || (typeof window !== "undefined" ? window : null);
  const storage =
    options.storage !== undefined
      ? options.storage
      : typeof localStorage !== "undefined"
        ? localStorage
        : null;
  const nav =
    options.navigator ||
    (typeof navigator !== "undefined" ? navigator : {});
  const getWidth =
    options.getWidth ||
    (() => {
      const cw = Number(viewportEl.clientWidth);
      if (Number.isFinite(cw) && cw > 0) {
        return cw;
      }
      const iw = Number(win?.innerWidth);
      return Number.isFinite(iw) && iw > 0 ? iw : 0;
    });

  /** @type {HTMLElement|null} */
  let host = null;
  let variant = detectHintDevice(nav);

  function removeHost() {
    if (host && host.parentNode && typeof host.parentNode.removeChild === "function") {
      host.parentNode.removeChild(host);
    } else if (host && typeof host.remove === "function") {
      host.remove();
    }
    host = null;
  }

  function isWide() {
    return getWidth() >= MOBILE_BREAKPOINT;
  }

  /**
   * @param {"mouse"|"trackpad"} next
   */
  function mountPanel(next) {
    removeHost();
    variant = next;
    host = doc.createElement("div");
    host.className = "scene-hint-panel";
    host.setAttribute("data-node-kind", "hint-panel");
    const panel = buildHintPanel(variant, {
      content: options.content,
      resolveAsset: options.resolveAsset,
      doc,
    });
    append(host, panel);

    const stop = (event) => {
      if (typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
    };
    host.addEventListener("wheel", stop, { passive: true });
    host.addEventListener("pointerdown", stop);
    host.addEventListener("mousedown", stop);

    host.addEventListener("click", (event) => {
      const raw = /** @type {Node|null} */ (event.target);
      const target = /** @type {HTMLElement|null} */ (
        raw && raw.nodeType === 3 ? raw.parentElement : raw
      );
      const close = target?.closest?.(".ds-hint-panel__close");
      if (close) {
        markHintPanelSeen(storage);
        removeHost();
        return;
      }
      const tab = target?.closest?.("[data-hint-tab]");
      const nextTab = tab?.getAttribute?.("data-hint-tab") || tab?.dataset?.hintTab;
      if (nextTab === "mouse" || nextTab === "trackpad") {
        if (nextTab !== variant) {
          mountPanel(nextTab);
        }
      }
    });

    viewportEl.appendChild(host);
  }

  function sync() {
    if (!doc) {
      return;
    }
    // Already shown this unique user: keep the current session until close;
    // do not remount on later visits or after a mobile↔desktop resize.
    if (hasSeenHintPanel(storage)) {
      return;
    }
    if (!isWide()) {
      removeHost();
      return;
    }
    if (!host) {
      mountPanel(variant);
      markHintPanelSeen(storage);
    }
  }

  const onResize = () => {
    sync();
  };
  sync();
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => {
      sync();
    });
  }

  let resizeObserver = null;
  if (typeof ResizeObserver === "function") {
    resizeObserver = new ResizeObserver(() => {
      sync();
    });
    resizeObserver.observe(viewportEl);
  }
  if (win && typeof win.addEventListener === "function") {
    win.addEventListener("resize", onResize);
  }

  return () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (win && typeof win.removeEventListener === "function") {
      win.removeEventListener("resize", onResize);
    }
    removeHost();
  };
}
