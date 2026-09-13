/**
 * CursorFigma inventory story (Figma 163:11657 — 20×20).
 */
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "CursorFigma",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const item = document.createElement("span");
    item.className = "ds-icon";
    item.setAttribute("role", "img");
    item.setAttribute("aria-label", "CursorFigma");
    item.dataset.icon = "cursor-figma";
    const img = document.createElement("img");
    img.src = resolveAsset("icons.cursor-figma");
    img.alt = "";
    img.width = 20;
    img.height = 20;
    item.appendChild(img);
    return item;
  },
};
