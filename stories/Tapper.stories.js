/**
 * Tapper inventory story: default − / + control (ds-showcase Atomic).
 * Plus/Minus swap to hover (#232323) assets on hit hover/focus.
 * Tooltip (92:11490): Plus → Приблизить, Minus → Отдалить.
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Tapper",
};

/**
 * @param {string} defaultKey
 * @param {string} hoverKey
 * @param {string} iconName
 * @returns {HTMLElement}
 */
function buildSwapIcon(defaultKey, hoverKey, iconName) {
  const icon = document.createElement("span");
  icon.className = "ds-icon ds-icon--swap";
  icon.setAttribute("aria-hidden", "true");
  icon.dataset.icon = iconName;

  const imgDefault = document.createElement("img");
  imgDefault.className = "ds-icon__state ds-icon__state--default";
  imgDefault.src = resolveAsset(defaultKey);
  imgDefault.alt = "";
  imgDefault.width = 24;
  imgDefault.height = 24;

  const imgHover = document.createElement("img");
  imgHover.className = "ds-icon__state ds-icon__state--hover";
  imgHover.src = resolveAsset(hoverKey);
  imgHover.alt = "";
  imgHover.width = 24;
  imgHover.height = 24;

  icon.append(imgDefault, imgHover);
  return icon;
}

/**
 * @param {string} text
 * @returns {HTMLElement}
 */
function buildTooltip(text) {
  const tip = document.createElement("span");
  tip.className = "ds-tooltip";
  tip.setAttribute("role", "tooltip");
  tip.textContent = text;
  return tip;
}

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const root = document.createElement("div");
    root.className = "ds-tapper";
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", "Tapper");

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "scene-tapper__hit";
    minus.setAttribute("data-tapper-action", "zoom-out");
    minus.setAttribute("aria-label", contentMap["tapper.zoom_out"]);
    minus.append(
      buildSwapIcon("icons.minus", "icons.minus.hover", "Minus"),
      buildTooltip(contentMap["tooltip.zoom_out"])
    );

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "scene-tapper__hit";
    plus.setAttribute("data-tapper-action", "zoom-in");
    plus.setAttribute("aria-label", contentMap["tapper.zoom_in"]);
    plus.append(
      buildSwapIcon("icons.plus", "icons.plus.hover", "Plus"),
      buildTooltip(contentMap["tooltip.zoom_in"])
    );

    root.append(minus, plus);
    return root;
  },
};
