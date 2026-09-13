/**
 * TitleSidebar inventory stories: default + hover/muted (Figma 227:16228/29).
 */
import { contentMap } from "../shared/content.js";

export default {
  title: "TitleSidebar",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const el = document.createElement("span");
    el.className = "ds-title-sidebar";
    el.textContent = contentMap["sidenav.context"];
    return el;
  },
};

/**
 * Forced hover/muted paint via `ds-title-sidebar--hover`.
 * @returns {HTMLElement}
 */
export const Hover = {
  render: () => {
    const el = document.createElement("span");
    el.className = "ds-title-sidebar ds-title-sidebar--hover";
    el.textContent = contentMap["sidenav.context"];
    return el;
  },
};
