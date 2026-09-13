/**
 * MenuMobile inventory story (Figma 245:17643).
 */
import { contentMap } from "../shared/content.js";

export default {
  title: "MenuMobile",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const nav = document.createElement("nav");
    nav.className = "ds-menu-mobile";
    nav.setAttribute("aria-label", "MenuMobile");

    /** @type {Array<{ key: string, muted?: boolean, href: string }>} */
    const items = [
      { key: "sidenav.context", href: "#context" },
      { key: "sidenav.analysis", muted: true, href: "#analysis" },
      { key: "sidenav.hypotheses", muted: true, href: "#hypotheses" },
      { key: "sidenav.conclusions", muted: true, href: "#conclusions" },
      { key: "sidenav.contacts", muted: true, href: "#contacts" },
    ];

    for (const item of items) {
      const link = document.createElement("a");
      link.className = item.muted
        ? "ds-title-sidebar ds-title-sidebar--muted"
        : "ds-title-sidebar";
      link.href = item.href;
      link.textContent = contentMap[item.key];
      nav.appendChild(link);
    }

    return nav;
  },
};
