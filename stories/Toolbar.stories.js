/**
 * Toolbar inventory story (Figma 247:16546).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Toolbar",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const bar = document.createElement("header");
    bar.className = "ds-toolbar";
    bar.setAttribute("aria-label", "Toolbar");

    const back = document.createElement("a");
    back.className = "ds-toolbar__back";
    back.href = "#";
    back.setAttribute("aria-label", contentMap["toolbar.back"]);
    const backIcon = document.createElement("span");
    backIcon.className = "ds-icon";
    backIcon.setAttribute("aria-hidden", "true");
    backIcon.dataset.icon = "vuesax/linear/arrow-left";
    const backImg = document.createElement("img");
    backImg.src = resolveAsset("icons.arrow-left");
    backImg.alt = "";
    backImg.width = 20;
    backImg.height = 20;
    backIcon.appendChild(backImg);
    back.appendChild(backIcon);

    const label = document.createElement("p");
    label.className = "ds-toolbar__label";
    label.textContent = contentMap["toolbar.back"];

    const burger = document.createElement("button");
    burger.type = "button";
    burger.className = "ds-toolbar__burger";
    burger.setAttribute("aria-label", "Открыть меню");
    const burgerIcon = document.createElement("span");
    burgerIcon.className = "ds-icon";
    burgerIcon.setAttribute("aria-hidden", "true");
    burgerIcon.dataset.icon = "burger-menu";
    const burgerImg = document.createElement("img");
    burgerImg.src = resolveAsset("icons.burger-menu");
    burgerImg.alt = "";
    burgerImg.width = 24;
    burgerImg.height = 24;
    burgerIcon.appendChild(burgerImg);
    burger.appendChild(burgerIcon);

    bar.append(back, label, burger);
    return bar;
  },
};
