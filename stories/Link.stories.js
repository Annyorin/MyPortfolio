/**
 * Link inventory stories: default + forced hover/focus demos (ds-showcase Atomic).
 */
import { contentMap } from "../shared/content.js";

export default {
  title: "Link",
};

/**
 * @returns {HTMLAnchorElement}
 */
export const Default = {
  render: () => {
    const el = document.createElement("a");
    el.className = "ds-link ds-link--default";
    el.href = "#";
    el.textContent = contentMap["link.sample"];
    return el;
  },
};

/**
 * Forced hover paint via `ds-link--hover` (demo state from showcase).
 * @returns {HTMLAnchorElement}
 */
export const Hover = {
  name: "Hover",
  render: () => {
    const el = document.createElement("a");
    el.className = "ds-link ds-link--hover";
    el.href = "#";
    el.textContent = contentMap["link.sample"];
    return el;
  },
};

/**
 * Focus-visible demo: focuses the link after mount.
 * @returns {HTMLAnchorElement}
 */
export const Focus = {
  name: "Focus",
  render: () => {
    const el = document.createElement("a");
    el.className = "ds-link ds-link--default";
    el.href = "#";
    el.textContent = contentMap["link.sample"];
    queueMicrotask(() => {
      el.focus();
    });
    return el;
  },
};
