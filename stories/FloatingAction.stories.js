/**
 * FloatingAction inventory story (Figma 169:13303).
 */
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "FloatingAction",
};

/**
 * @returns {HTMLButtonElement}
 */
export const Default = {
  render: () => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ds-fab";
    btn.setAttribute("aria-label", "FloatingAction");

    const icon = document.createElement("span");
    icon.className = "ds-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.dataset.icon = "vuesax/linear/arrow-right";
    const img = document.createElement("img");
    img.src = resolveAsset("icons.arrow-right");
    img.alt = "";
    img.width = 24;
    img.height = 24;
    icon.appendChild(img);

    btn.appendChild(icon);
    return btn;
  },
};
