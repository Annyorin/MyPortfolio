/**
 * Header inventory story (ds-showcase Composite).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "Header",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const header = document.createElement("header");
    header.className = "ds-header";

    const back = document.createElement("a");
    back.className = "ds-button ds-button--text";
    back.href = "#";
    const icon = document.createElement("span");
    icon.className = "ds-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.dataset.icon = "vuesax/linear/arrow-left";
    const img = document.createElement("img");
    img.src = resolveAsset("icons.arrow-left");
    img.alt = "";
    img.width = 20;
    img.height = 20;
    icon.appendChild(img);
    back.append(icon, document.createTextNode(contentMap["button.home"]));

    const title = document.createElement("p");
    title.className = "ds-header__title";
    title.textContent = contentMap["header.title"];

    const burger = document.createElement("button");
    burger.type = "button";
    burger.className = "ds-header__burger";
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

    header.append(back, title, burger);
    return header;
  },
};
