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
  { key: "icons.burger-menu", label: "Burger_menu", dataIcon: "Burger_menu" },
  {
    key: "icons.arrow-right",
    label: "arrow-right",
    dataIcon: "vuesax/linear/arrow-right",
  },
  {
    key: "icons.arrow-left",
    label: "arrow-left",
    dataIcon: "vuesax/linear/arrow-left",
  },
  { key: "icons.mouse-zoom", label: "mouseZoom", dataIcon: "mouseZoom" },
  { key: "icons.mouse-move", label: "mouseMove", dataIcon: "mouseMove" },
  { key: "icons.hand-zoom", label: "handZoom", dataIcon: "handZoom" },
  { key: "icons.hand-move", label: "handMove", dataIcon: "handMove" },
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
      const size = icon.key.startsWith("icons.mouse") || icon.key.startsWith("icons.hand")
        ? 32
        : 24;
      const item = document.createElement("span");
      item.className = size === 32 ? "ds-icon ds-icon--32" : "ds-icon";
      item.setAttribute("role", "listitem");
      item.setAttribute("aria-label", icon.label);
      item.dataset.icon = icon.dataIcon;
      const img = document.createElement("img");
      img.src = resolveAsset(icon.key);
      img.alt = "";
      img.width = size;
      img.height = size;
      item.appendChild(img);
      list.appendChild(item);
    }

    return list;
  },
};
