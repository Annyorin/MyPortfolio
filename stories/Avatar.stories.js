/**
 * Avatar inventory story (ds-showcase Atomic).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Avatar",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const el = document.createElement("div");
    el.className = "ds-avatar ds-placeholder";
    const img = document.createElement("img");
    img.src = resolveAsset("avatar");
    img.alt = `Avatar of ${contentMap["profile.name"]}`;
    img.width = 90;
    img.height = 90;
    el.appendChild(img);
    return el;
  },
};
