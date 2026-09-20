/**
 * Portfolio case page: segments, FAB scroll-to-top, side-nav active, mobile drawer.
 */

import { contentMap } from "../../shared/content.js";
import { fixHangingPrepositions } from "../../shared/typography.js";
import { bindSegmentsControl } from "../../ds-showcase/js/segments.js";
import { consumeEnterCrossfade, navigateWithExpand, isInternalPortfolioUrl } from "./pageTransition.js";
import { resolveAsset } from "./resolveAsset.js";

/** Min scroll Y (px) before FAB may appear; always hidden near top. */
export const CASE_FAB_SHOW_SCROLL_Y = 48;
/** Ignore scroll deltas smaller than this (px) to avoid flicker. */
export const CASE_FAB_DIR_SLOP_PX = 4;

/** @type {Record<string, string>} */
const CASE_CARD_PREFIX = {
  dragon: "card.a",
  phish: "card.b",
};

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
 * @returns {string}
 */
function readCaseId() {
  const raw = String(document.body?.dataset?.caseId || "dragon").trim();
  return raw || "dragon";
}

/**
 * @param {string} caseId
 * @returns {string}
 */
function caseKeyPrefix(caseId) {
  return `case.${caseId}.`;
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
 * Sets body text; multiline (`\n`) uses pre-line so paragraphs stay readable.
 *
 * @param {string} selector
 * @param {string} text
 */
function setBodyText(selector, text) {
  const el = document.querySelector(selector);
  if (!el) {
    return;
  }
  const fixed = textOf(text);
  const parts = fixed
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const hasHeadings = parts.some((part) => /^##\s+/.test(part));
  if (!hasHeadings && parts.length <= 1) {
    el.textContent = fixed;
    return;
  }
  if (!hasHeadings) {
    el.textContent = fixed;
    el.style.whiteSpace = "pre-line";
    return;
  }
  const parent = el.parentElement;
  if (!(parent instanceof HTMLElement)) {
    el.textContent = fixed;
    return;
  }
  const className = el.className;
  const frag = document.createDocumentFragment();
  for (const part of parts) {
    const heading = part.match(/^##\s+(.+)$/);
    const node = document.createElement(heading ? "h3" : "p");
    node.className = heading ? "case-page__text-sub" : className;
    node.textContent = heading ? heading[1] : part;
    frag.appendChild(node);
  }
  parent.insertBefore(frag, el);
  el.remove();
}

/**
 * @param {HTMLElement} container
 * @param {string} body
 * @param {string} [className]
 * @param {boolean} [longOnly]
 */
function appendBodyParagraphs(container, body, className = "case-page__text-body", longOnly = false) {
  const fixed = textOf(body);
  const parts = fixed
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const chunks = parts.length > 0 ? parts : [""];
  for (const part of chunks) {
    const heading = part.match(/^##\s+(.+)$/);
    const el = document.createElement(heading ? "h3" : "p");
    el.className = heading ? "case-page__text-sub" : className;
    if (longOnly) {
      el.setAttribute("data-case-long-only", "");
    }
    el.textContent = heading ? heading[1] : part;
    container.appendChild(el);
  }
}

/**
 * Fills stub sections (analysis / hypotheses / conclusions) when keys exist.
 *
 * @param {string} sectionId
 * @param {string | undefined} title
 * @param {string | undefined} body
 * @param {{ longOnly?: boolean, longBody?: string }} [options]
 */
function fillStubSection(sectionId, title, body, options = {}) {
  const section = document.getElementById(sectionId);
  if (!(section instanceof HTMLElement)) {
    return;
  }
  const hasTitle = typeof title === "string" && title.trim();
  const hasBody = typeof body === "string" && body.trim();
  const longBody =
    typeof options.longBody === "string" && options.longBody.trim()
      ? options.longBody
      : "";
  if (!hasTitle && !hasBody && !longBody) {
    return;
  }

  section.replaceChildren();
  if (options.longOnly) {
    section.setAttribute("data-case-long-only", "");
  }

  const block = document.createElement("div");
  block.className = "case-page__text-block";

  if (hasTitle) {
    const h2 = document.createElement("h2");
    h2.className = "case-page__text-title";
    h2.textContent = textOf(title);
    block.appendChild(h2);
  }
  if (hasBody) {
    appendBodyParagraphs(block, body);
  }
  if (longBody) {
    appendBodyParagraphs(block, longBody, "case-page__text-body", true);
  }
  section.appendChild(block);
}

/**
 * Short version hides long-only blocks (analysis + extra hypotheses detail).
 *
 * @param {boolean} isShort
 */
function applyCaseLengthMode(isShort) {
  document.body.classList.toggle("is-case-short", isShort);
  const nodes = document.querySelectorAll("[data-case-long-only]");
  for (const node of nodes) {
    if (node instanceof HTMLElement) {
      node.hidden = isShort;
    }
  }
}

/**
 * Fills static slots from contentMap for the active case id.
 *
 * @param {typeof contentMap} content
 * @param {string} caseId
 */
function fillContent(content, caseId) {
  const prefix = caseKeyPrefix(caseId);
  const cardPrefix = CASE_CARD_PREFIX[caseId] || "card.a";
  const bio = content["sidebar.bio"];

  /**
   * @param {string} key
   * @returns {string | undefined}
   */
  function caseVal(key) {
    return content[`${prefix}${key}`];
  }

  setText("[data-case='home-label']", content["button.home"]);
  setText(
    "[data-case='header-brand']",
    caseVal("header_brand") || content["header.title"]
  );
  setText("[data-case='title']", content[`${cardPrefix}.title`]);
  setText("[data-case='title-meta']", content[`${cardPrefix}.meta`]);

  setText("[data-case='period-label']", caseVal("period_label"));
  setText("[data-case='period-value']", caseVal("period_value"));
  setText("[data-case='platforms-label']", caseVal("platforms_label"));
  setText("[data-case='platforms-value']", caseVal("platforms_value"));
  setText("[data-case='role-label']", caseVal("role_label"));
  setText("[data-case='role-value']", caseVal("role_value") || bio);
  setText("[data-case='team-label']", caseVal("team_label"));
  setText("[data-case='team-value']", caseVal("team_value") || bio);

  setText("[data-case='segments-long']", content["segments.long"]);
  setText("[data-case='segments-short']", content["segments.short"]);

  setText("[data-case='context-title']", caseVal("context_title"));
  setBodyText("[data-case='context-body']", caseVal("context_body") || bio);
  setText("[data-case='intro-title']", caseVal("intro_title"));
  setBodyText("[data-case='intro-body']", caseVal("intro_body") || bio);
  setText(
    "[data-case='contact-heading']",
    caseVal("contact_heading") || content["case.dragon.contact_heading"]
  );
  setText(
    "[data-case='contact-sub']",
    caseVal("contact_sub") || content["case.dragon.contact_sub"]
  );
  setText(
    "[data-case='next-label']",
    caseVal("next_label") || content["case.dragon.next_label"]
  );
  const nextLink = document.querySelector("a.case-page__next");
  if (nextLink instanceof HTMLAnchorElement) {
    const nextUrl = String(caseVal("next_url") || "").trim();
    if (nextUrl) {
      nextLink.href = nextUrl;
      if (isInternalPortfolioUrl(nextUrl)) {
        nextLink.removeAttribute("target");
        nextLink.removeAttribute("rel");
      } else {
        nextLink.target = "_blank";
        nextLink.rel = "noopener noreferrer";
      }
    }
  }
  setText("[data-case='toolbar-back-label']", content["toolbar.back"]);
  const toolbarBack = document.querySelector(".ds-toolbar__back");
  if (toolbarBack instanceof HTMLElement) {
    toolbarBack.setAttribute("aria-label", textOf(content["toolbar.back"]));
  }

  const navMap = [
    ["context", "sidenav.context"],
    ["analysis", "sidenav.analysis"],
    ["hypotheses", "sidenav.hypotheses"],
    ["conclusions", "sidenav.conclusions"],
    ["contacts", "sidenav.contacts"],
  ];
  for (const [id, key] of navMap) {
    const override =
      id === "analysis" ? caseVal("analysis_title") : undefined;
    setText(`[data-case-nav='${id}']`, override || content[key]);
  }

  fillStubSection("analysis", caseVal("analysis_title"), caseVal("analysis_body"), {
    longOnly: true,
  });
  fillStubSection(
    "hypotheses",
    caseVal("hypotheses_title"),
    caseVal("hypotheses_body"),
    { longBody: caseVal("hypotheses_body_long") }
  );
  fillStubSection(
    "conclusions",
    caseVal("conclusions_title"),
    caseVal("conclusions_body")
  );

  const hero = document.querySelector("[data-case='hero-img']");
  const picture = document.querySelector("[data-case='picture']");
  if (hero instanceof HTMLImageElement) {
    const src = resolveAsset(`${prefix}hero`);
    hero.src = src;
    hero.alt = `${textOf(content[`${cardPrefix}.title`])} cover`;
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
        // Резюме открываем во вкладке, а не скачиваем: атрибут download отменял бы
        // target="_blank" и файл падал бы в загрузки мимо просмотрщика.
        btn.setAttribute("target", "_blank");
        btn.setAttribute("rel", "noopener noreferrer");
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
 * FAB → top: visible only while the user scrolls up (hidden on scroll down / near top).
 *
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

  let lastY = readScrollY();

  function syncVisibility() {
    const y = readScrollY();
    const delta = y - lastY;
    lastY = y;

    if (y <= CASE_FAB_SHOW_SCROLL_Y) {
      fab.classList.remove("is-visible");
      return;
    }
    if (delta < -CASE_FAB_DIR_SLOP_PX) {
      fab.classList.add("is-visible");
    } else if (delta > CASE_FAB_DIR_SLOP_PX) {
      fab.classList.remove("is-visible");
    }
  }

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  fab.classList.remove("is-visible");
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
  /** Ignore backdrop clicks from the same gesture that opened the drawer. */
  let backdropCloseArmed = true;

  /**
   * @param {boolean} open
   */
  function setOpen(open) {
    document.body.classList.toggle("is-drawer-open", open);
    for (const burger of burgers) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (open) {
      backdropCloseArmed = false;
      backdrop.removeAttribute("hidden");
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            backdropCloseArmed = true;
          });
        });
      } else {
        backdropCloseArmed = true;
      }
    } else {
      backdrop.setAttribute("hidden", "");
      backdropCloseArmed = true;
    }
  }

  function close() {
    setOpen(false);
  }

  function toggle() {
    setOpen(!document.body.classList.contains("is-drawer-open"));
  }

  /**
   * @param {MouseEvent} event
   */
  const onBurger = (event) => {
    event.preventDefault?.();
    event.stopPropagation?.();
    toggle();
  };
  const onBackdrop = () => {
    if (!backdropCloseArmed) {
      return;
    }
    close();
  };
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
    document.querySelectorAll("a.ds-toolbar__back, a.case-page__toolbar-back, .ds-header a[href]")
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
 * Crossfade to the next internal case page, or open external next URL.
 *
 * @returns {() => void}
 */
function bindNextCaseLink() {
  const link = document.querySelector("a.case-page__next");
  if (!(link instanceof HTMLAnchorElement)) {
    return () => {};
  }

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
    const href = String(link.getAttribute("href") || "").trim();
    if (!href || href.startsWith("#")) {
      return;
    }
    if (isInternalPortfolioUrl(href)) {
      event.preventDefault();
      navigateWithExpand(href, link);
      return;
    }
    // External (e.g. CityBike Behance): let the browser open target=_blank,
    // or fall back if target was missing.
    if (!link.target) {
      event.preventDefault();
      try {
        window.open(href, "_blank", "noopener,noreferrer");
      } catch {
        window.location.assign(href);
      }
    }
  }

  link.addEventListener("click", onClick);
  return () => link.removeEventListener("click", onClick);
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

  const caseId = readCaseId();
  fillContent(contentMap, caseId);

  const segments = document.querySelector(".ds-segments");
  const unbindSegments =
    segments instanceof HTMLElement
      ? bindSegmentsControl(segments, (index) => {
          // 0 = long (default), 1 = short
          applyCaseLengthMode(index === 1);
        })
      : () => {};

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
  const unbindNext = bindNextCaseLink();

  return () => {
    unbindSegments();
    unbindFab();
    unbindNav();
    unbindDrawer();
    unbindHome();
    unbindNext();
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
