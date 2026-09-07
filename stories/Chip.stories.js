/**
 * Chip inventory stories (default / active) matching ds-showcase Atomic.
 */
import { contentMap } from "../shared/content.js";

export default {
  title: "Chip",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const el = document.createElement("span");
    el.className = "ds-chip ds-chip--default";
    el.textContent = contentMap["chip.sample.default"];
    return el;
  },
};

/**
 * @returns {HTMLElement}
 */
export const Active = {
  render: () => {
    const el = document.createElement("span");
    el.className = "ds-chip ds-chip--active";
    el.textContent = contentMap["chip.sample.active"];
    return el;
  },
};
