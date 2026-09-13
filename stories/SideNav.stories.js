/**
 * Menu / SideBar TOC inventory story (Figma 227:16241).
 */
import { contentMap } from "../shared/content.js";

export default {
  title: "SideNav",
};

/**
 * @returns {HTMLElement}
 */
export const Default = {
  render: () => {
    const nav = document.createElement("nav");
    nav.className = "ds-side-nav";
    nav.setAttribute("aria-label", "Menu");

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
