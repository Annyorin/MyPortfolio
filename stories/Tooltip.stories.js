/**
 * Tooltip inventory story (Figma Ui kit 92:11490).
 */
import { contentMap } from "../shared/content.js";

export default {
  title: "Tooltip",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const el = document.createElement("span");
    el.className = "ds-tooltip";
    el.setAttribute("role", "tooltip");
    el.textContent = "Text";
    return el;
  },
};

/**
 * @returns {HTMLElement}
 */
export const ZoomIn = {
  render: () => {
    const el = document.createElement("span");
    el.className = "ds-tooltip";
    el.setAttribute("role", "tooltip");
    el.textContent = contentMap["tooltip.zoom_in"];
    return el;
  },
};

/**
 * @returns {HTMLElement}
 */
export const ZoomOut = {
  render: () => {
    const el = document.createElement("span");
    el.className = "ds-tooltip";
    el.setAttribute("role", "tooltip");
    el.textContent = contentMap["tooltip.zoom_out"];
    return el;
  },
};
