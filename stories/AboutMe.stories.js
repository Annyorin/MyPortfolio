/**
 * About me composite (Figma 391:22957): me + Macbook + Stiker.
 * Theme: light/dark via data-theme toolbar (tokens on .ds-stiker).
 */
import { contentMap } from "../shared/content.js";
import { resolveAsset } from "../portfolio/js/resolveAsset.js";

export default {
  title: "AboutMe",
  parameters: {
    layout: "centered",
  },
};

/**
 * @returns {HTMLElement}
 */
function renderAboutMe() {
  const root = document.createElement("div");
  root.className = "ds-about-me";
  root.setAttribute("aria-label", "Обо мне");

  const me = document.createElement("div");
  me.className = "ds-about-me__me";
  const meImg = document.createElement("img");
  meImg.src = resolveAsset("me");
  meImg.alt = "";
  meImg.width = 83;
  meImg.height = 83;
  meImg.decoding = "async";
  meImg.draggable = false;
  me.appendChild(meImg);

  const macbook = document.createElement("div");
  macbook.className = "ds-about-me__macbook";
  const frame = document.createElement("div");
  frame.className = "ds-about-me__macbook-frame";
  const macImg = document.createElement("img");
  macImg.src = resolveAsset("macbook.png");
  macImg.alt = "";
  macImg.width = 126;
  macImg.height = 92;
  macImg.decoding = "async";
  macImg.draggable = false;
  frame.appendChild(macImg);
  macbook.appendChild(frame);

  const stiker = document.createElement("div");
  stiker.className = "ds-stiker";
  stiker.setAttribute("aria-label", "Stiker");
  stiker.textContent = contentMap["stiker.label"];

  root.append(me, macbook, stiker);
  return root;
}

export const Default = {
  name: "Default",
  render: () => renderAboutMe(),
};

export const Dark = {
  name: "Dark",
  globals: { theme: "dark" },
  parameters: {
    backgrounds: { default: "page-dark" },
  },
  render: () => renderAboutMe(),
};
