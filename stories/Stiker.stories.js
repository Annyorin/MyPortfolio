/**
 * Stiker inventory story: default label from Content Map.
 */
import { contentMap } from "../shared/content.js";

export default {
  title: "Stiker",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const el = document.createElement("div");
    el.className = "ds-stiker";
    el.setAttribute("aria-label", "Stiker");
    el.textContent = contentMap["stiker.label"];
    return el;
  },
};
