/**
 * Icons inventory story: close, Plus/Minus default+hover, arrow-right (Ui kit).
 */
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Icons",
};

/** @type {Array<{ key: string, label: string, dataIcon: string }>} */
const ICONS = [
  { key: "icons.close", label: "close", dataIcon: "close" },
  { key: "icons.plus", label: "Plus", dataIcon: "Plus" },
  { key: "icons.plus.hover", label: "Plus hover", dataIcon: "Plus" },
  { key: "icons.minus", label: "Minus", dataIcon: "Minus" },
  { key: "icons.minus.hover", label: "Minus hover", dataIcon: "Minus" },
  {
    key: "icons.arrow-right",
    label: "arrow-right",
    dataIcon: "vuesax/linear/arrow-right",
  },
];

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const list = document.createElement("div");
    list.className = "ds-icons";
    list.setAttribute("role", "list");

    for (const icon of ICONS) {
      const item = document.createElement("span");
      item.className = "ds-icon";
      item.setAttribute("role", "listitem");
      item.setAttribute("aria-label", icon.label);
      item.dataset.icon = icon.dataIcon;
      const img = document.createElement("img");
      img.src = resolveAsset(icon.key);
      img.alt = "";
      img.width = 24;
      img.height = 24;
      item.appendChild(img);
      list.appendChild(item);
    }

    return list;
  },
};
