/**
 * Portfolio case page: segments, FAB scroll-to-top, side-nav active, mobile drawer.
 */

import { contentMap } from "../../shared/content.js";
import { fixHangingPrepositions } from "../../shared/typography.js";
import { bindSegmentsControl } from "../../ds-showcase/js/segments.js";
import { consumeEnterCrossfade, navigateWithExpand } from "./pageTransition.js";
import { resolveAsset } from "./resolveAsset.js";

/** Scroll distance (px) before FAB becomes visible. */
export const CASE_FAB_SHOW_SCROLL_Y = 48;

const CONTACT_ACTIONS = [
  { key: "contact.telegram", variant: "primary", icon: "icons.telegram" },
  { key: "contact.cv", variant: "secondary", icon: "icons.cv" },
  { key: "contact.behance", variant: "secondary", icon: "icons.behance" },
  { key: "contact.mail", variant: "secondary", icon: "icons.mail" },
];

/**
 * @param {unknown} value
 * @returns {string}
 */
function textOf(value) {
  return fixHangingPrepositions(typeof value === "string" ? value : "");
}

/**
 * @param {string} selector
 * @param {string} text
 */
function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) {
    el.textContent = textOf(text);
  }
}

/**
 * Fills static slots from contentMap.
 *
 * @param {typeof contentMap} content
 */
function fillContent(content) {
  const bio = content["sidebar.bio"];

  setText("[data-case='home-label']", content["button.home"]);
  setText("[data-case='header-brand']", content["case.dragon.header_brand"] || content["header.title"]);
  setText("[data-case='title']", content["card.a.title"]);
  setText("[data-case='title-meta']", content["card.a.meta"]);
  setText(
    "[data-case='toolbar-title']",
    content["case.dragon.toolbar_title"] || content["card.a.title"]
  );

  setText("[data-case='period-label']", content["case.dragon.period_label"]);
  setText("[data-case='period-value']", content["case.dragon.period_value"]);
  setText("[data-case='platforms-label']", content["case.dragon.platforms_label"]);
  setText("[data-case='platforms-value']", content["case.dragon.platforms_value"]);
  setText("[data-case='role-label']", content["case.dragon.role_label"]);
  setText("[data-case='role-value']", bio);
  setText("[data-case='team-label']", content["case.dragon.team_label"]);
  setText("[data-case='team-value']", bio);

  setText("[data-case='segments-long']", content["segments.long"]);
  setText("[data-case='segments-short']", content["segments.short"]);

  setText("[data-case='context-title']", content["case.dragon.context_title"]);
  setText("[data-case='context-body']", content["case.dragon.context_body"] || bio);
  setText("[data-case='intro-title']", content["case.dragon.intro_title"]);
  setText("[data-case='intro-body']", content["case.dragon.intro_body"] || bio);
  setText("[data-case='contact-heading']", content["case.dragon.contact_heading"]);
  setText("[data-case='contact-sub']", content["case.dragon.contact_sub"]);
  setText("[data-case='next-label']", content["case.dragon.next_label"]);

  const navMap = [
    ["context", "sidenav.context"],
    ["analysis", "sidenav.analysis"],
    ["hypotheses", "sidenav.hypotheses"],
    ["conclusions", "sidenav.conclusions"],
    ["contacts", "sidenav.contacts"],
  ];
  for (const [id, key] of navMap) {
    setText(`[data-case-nav='${id}']`, content[key]);
  }

  const hero = document.querySelector("[data-case='hero-img']");
  const picture = document.querySelector("[data-case='picture']");
  if (hero instanceof HTMLImageElement) {
    const src = resolveAsset("case.dragon.hero");
    hero.src = src;
    hero.alt = `${textOf(content["card.a.title"])} cover`;
    hero.addEventListener(
      "error",
      () => {
        hero.removeAttribute("src");
        picture?.classList.add("is-empty");
      },
      { once: true }
    );
  }

  const homeIcon = document.querySelector("[data-case='home-icon']");
  if (homeIcon instanceof HTMLImageElement) {
    homeIcon.src = resolveAsset("icons.arrow-left");
  }
  const toolbarBackIcon = document.querySelector("[data-case='toolbar-back-icon']");
  if (toolbarBackIcon instanceof HTMLImageElement) {
    toolbarBackIcon.src = resolveAsset("icons.arrow-left");
  }
  const toolbarBurgerIcon = document.querySelector("[data-case='toolbar-burger-icon']");
  if (toolbarBurgerIcon instanceof HTMLImageElement) {
    toolbarBurgerIcon.src = resolveAsset("icons.burger-menu");
  }
  const headerBurgerIcon = document.querySelector("[data-case='header-burger-icon']");
  if (headerBurgerIcon instanceof HTMLImageElement) {
    headerBurgerIcon.src = resolveAsset("icons.burger-menu");
  }
  const nextIcon = document.querySelector("[data-case='next-icon']");
  if (nextIcon instanceof HTMLImageElement) {
    nextIcon.src = resolveAsset("icons.arrow-right");
  }
  const fabIcon = document.querySelector("[data-case='fab-icon']");
  if (fabIcon instanceof HTMLImageElement) {
    fabIcon.src = resolveAsset("icons.arrow-right");
  }

  const actionsRoot = document.querySelector("[data-case='contact-actions']");
  if (actionsRoot) {
    actionsRoot.replaceChildren();
    for (const action of CONTACT_ACTIONS) {
      const btn = document.createElement("a");
      btn.className = `ds-button ds-button--${action.variant}`;
      const urls = content.contactUrls;
      const href =
        urls && typeof urls[action.key] === "string" && urls[action.key]
          ? urls[action.key]
          : "#";
      btn.href = href;
      if (href !== "#" && !href.startsWith("mailto:")) {
        btn.setAttribute("target", "_blank");
        btn.setAttribute("rel", "noopener noreferrer");
        if (action.key === "contact.cv") {
          btn.setAttribute("download", "CV-Yasinskaya.pdf");
        }
      }
      const icon = document.createElement("span");
      icon.className = "ds-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.dataset.icon = action.icon.replace(/^icons\./, "");
      const iconImg = document.createElement("img");
      iconImg.src = resolveAsset(action.icon);
      iconImg.alt = "";
      iconImg.width = 20;
      iconImg.height = 20;
      icon.appendChild(iconImg);
      const label = document.createElement("span");
      label.className = "ds-button__label";
      label.textContent = textOf(content[action.key]);
      btn.append(icon, label);
      actionsRoot.appendChild(btn);
    }
  }
}

/**
 * @param {HTMLElement} fab
 * @returns {() => void}
 */
function bindFab(fab) {
  /**
   * @returns {number}
   */
  function readScrollY() {
    if (typeof window !== "undefined" && Number.isFinite(window.scrollY)) {
      return Number(window.scrollY);
    }
    return 0;
  }

  function syncVisibility() {
    const show = readScrollY() > CASE_FAB_SHOW_SCROLL_Y;
    fab.classList.toggle("is-visible", show);
  }

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  fab.addEventListener("click", onClick);
  window.addEventListener("scroll", syncVisibility, { passive: true });
  syncVisibility();

  return () => {
    fab.removeEventListener("click", onClick);
    window.removeEventListener("scroll", syncVisibility);
  };
}

/**
 * Highlights side-nav link for the section nearest the top of the viewport.
 *
 * @param {HTMLElement} nav
 * @returns {() => void}
 */
function bindSideNavActive(nav) {
  const links = Array.from(nav.querySelectorAll("a[href^='#']"));
  /** @type {{ id: string, el: HTMLElement, link: HTMLAnchorElement }[]} */
  const sections = [];
  for (const link of links) {
    const href = link.getAttribute("href") || "";
    const id = href.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (el) {
      sections.push({ id, el, link: /** @type {HTMLAnchorElement} */ (link) });
    }
  }
  if (sections.length === 0) {
    return () => {};
  }

  /**
   * @param {string} activeId
   */
  function setActive(activeId) {
    for (const section of sections) {
      const on = section.id === activeId;
      section.link.classList.toggle("is-active", on);
      section.link.classList.toggle("ds-title-sidebar--muted", !on);
    }
  }

  function sync() {
    const marker = 120;
    let current = sections[0].id;
    for (const section of sections) {
      const top = section.el.getBoundingClientRect().top;
      if (top - marker <= 0) {
        current = section.id;
      }
    }
    setActive(current);
  }

  window.addEventListener("scroll", sync, { passive: true });
  sync();
  return () => window.removeEventListener("scroll", sync);
}

/**
 * BurgerMenu → MenuMobile popover (≤1365 via CSS; desktop burger is opacity 0).
 *
 * @param {{ burgers: HTMLElement[], backdrop: HTMLElement, nav: HTMLElement }} parts
 * @returns {() => void}
 */
function bindDrawer({ burgers, backdrop, nav }) {
  /**
   * @param {boolean} open
   */
  function setOpen(open) {
    document.body.classList.toggle("is-drawer-open", open);
    for (const burger of burgers) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (open) {
      backdrop.removeAttribute("hidden");
    } else {
      backdrop.setAttribute("hidden", "");
    }
  }

  function close() {
    setOpen(false);
  }

  function toggle() {
    setOpen(!document.body.classList.contains("is-drawer-open"));
  }

  const onBurger = () => toggle();
  const onBackdrop = () => close();
  const onNavClick = (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a[href^='#']")) {
      close();
    }
  };
  const onKeydown = (event) => {
    if (event.key === "Escape") {
      close();
    }
  };

  for (const burger of burgers) {
    burger.addEventListener("click", onBurger);
  }
  backdrop.addEventListener("click", onBackdrop);
  nav.addEventListener("click", onNavClick);
  document.addEventListener("keydown", onKeydown);

  return () => {
    for (const burger of burgers) {
      burger.removeEventListener("click", onBurger);
    }
    backdrop.removeEventListener("click", onBackdrop);
    nav.removeEventListener("click", onNavClick);
    document.removeEventListener("keydown", onKeydown);
    document.body.classList.remove("is-drawer-open");
  };
}

/**
 * Crossfade back to the portfolio home (header + mobile toolbar).
 *
 * @returns {() => void}
 */
function bindHomeLinks() {
  const links = Array.from(
    document.querySelectorAll("a.case-page__toolbar-back, .ds-header a[href]")
  ).filter((el) => el instanceof HTMLElement);

  /**
   * @param {MouseEvent} event
   */
  function onClick(event) {
    if (event.defaultPrevented) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (event.button != null && event.button !== 0) {
      return;
    }
    const link = /** @type {HTMLAnchorElement} */ (event.currentTarget);
    const href = String(link.getAttribute("href") || "").trim();
    if (!href || href.startsWith("#")) {
      return;
    }
    event.preventDefault();
    navigateWithExpand(href, link);
  }

  for (const link of links) {
    link.addEventListener("click", onClick);
  }

  return () => {
    for (const link of links) {
      link.removeEventListener("click", onClick);
    }
  };
}

/**
 * Bootstraps the case page.
 */
export function initCasePage() {
  consumeEnterCrossfade();
  try {
    const home = sessionStorage.getItem("portfolio-home-href");
    if (home && /^[A-Za-z0-9._-]+\.html$/.test(home)) {
      const links = document.querySelectorAll('a[href="main.html"]');
      for (const link of links) {
        link.setAttribute("href", home);
      }
    }
  } catch {
    /* private mode */
  }

  fillContent(contentMap);

  const segments = document.querySelector(".ds-segments");
  const unbindSegments =
    segments instanceof HTMLElement ? bindSegmentsControl(segments) : () => {};

  const fab = document.querySelector("[data-case='fab']");
  const unbindFab = fab instanceof HTMLElement ? bindFab(fab) : () => {};

  const nav = document.querySelector(".ds-side-nav");
  const unbindNav = nav instanceof HTMLElement ? bindSideNavActive(nav) : () => {};

  const burgers = Array.from(
    document.querySelectorAll(
      "[data-case='header-burger'], [data-case='toolbar-burger']"
    )
  ).filter((el) => el instanceof HTMLElement);
  const backdrop = document.querySelector("[data-case='drawer-backdrop']");
  const unbindDrawer =
    burgers.length > 0 &&
    backdrop instanceof HTMLElement &&
    nav instanceof HTMLElement
      ? bindDrawer({ burgers, backdrop, nav })
      : () => {};
  const unbindHome = bindHomeLinks();

  return () => {
    unbindSegments();
    unbindFab();
    unbindNav();
    unbindDrawer();
    unbindHome();
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initCasePage(), {
      once: true,
    });
  } else {
    initCasePage();
  }
}
