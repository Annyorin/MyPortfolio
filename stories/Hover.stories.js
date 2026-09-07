/**
 * Hover (CTA) inventory story matching ds-showcase Atomic.
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Hover",
};

/**
 * @returns {HTMLButtonElement}
 */
export const Default = {
  render: () => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ds-hover";
    btn.setAttribute("aria-label", contentMap["hover.label"]);

    const label = document.createElement("span");
    label.className = "ds-hover__label";
    label.textContent = contentMap["hover.label"];

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

    btn.append(label, icon);
    return btn;
  },
};
