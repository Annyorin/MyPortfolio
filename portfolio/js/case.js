/**
 * Portfolio case page: segments, FAB scroll-to-top, side-nav active, mobile drawer,
 * section fade-up reveal (setupCaseReveal).
 */

import { contentMap } from "../../shared/content.js";
import { fixHangingPrepositions } from "../../shared/typography.js";
import { bindSegmentsControl } from "../../ds-showcase/js/segments.js";
import {
  consumeEnterCrossfade,
  navigateWithExpand,
  isInternalPortfolioUrl,
  prefetchInternalPage,
  HOME_HREF_KEY,
  PAGE_CROSSFADE_MS,
} from "./pageTransition.js";
import { resolveAsset } from "./resolveAsset.js";
import { setupTheme } from "./boot/dots/theme.js";

/** Macbook layers to keep warm while the user reads a case (case→home). */
const MACBOOK_PREFETCH_KEYS = Object.freeze([
  "macbook.png",
  "macbook.lid",
  "macbook.sticker.create",
  "macbook.sticker.question",
  "macbook.sticker.sport",
  "macbook.sticker.anime",
  "macbook.sticker.seal",
  "macbook.sticker.books",
]);

/**
 * Keep home Macbook bitmaps in HTTP/memory cache while on a case page.
 *
 * @returns {void}
 */
function prefetchMacbookAssets() {
  if (typeof Image === "undefined") return;
  for (const key of MACBOOK_PREFETCH_KEYS) {
    try {
      const img = new Image();
      img.decoding = "async";
      img.src = resolveAsset(key);
    } catch {
      /* harness */
    }
  }
}

/** Min scroll Y (px) before FAB may appear; always hidden near top. */
export const CASE_FAB_SHOW_SCROLL_Y = 48;
/** Ignore scroll deltas smaller than this (px) to avoid flicker. */
export const CASE_FAB_DIR_SLOP_PX = 4;

/**
 * Browsers that already ship a floating «scroll to top» control.
 * Our FAB would duplicate theirs — skip mounting there.
 *
 * @param {string} [ua]
 * @returns {boolean}
 */
export function browserHasNativeScrollTopButton(ua) {
  const value =
    typeof ua === "string"
      ? ua
      : typeof navigator !== "undefined"
        ? String(navigator.userAgent || "")
        : "";
  // Samsung Internet: floating scroll-to-top chip while scrolling.
  if (/SamsungBrowser/i.test(value)) return true;
  return false;
}

/** Block units that fade-up once when scrolled into view (not on first paint). */
const CASE_REVEAL_SELECTORS = [
  ".case-page__intro",
  "#context .case-page__picture",
  "#context .case-page__fill-block",
  "#context > .case-page__text-block",
  // Per text/picture unit (Phish rich bodies); not the whole stub — otherwise
  // multi-block sections fade in as one blob when the top edge intersects.
  ".case-page__section-stub > .case-page__text-block",
  ".case-page__section-stub > .case-page__picture",
  ".case-page__section-stub .case-page__picture--inline",
  ".case-page__footer",
];

/** Inline body marker: [[img:assetKey]] or [[img:assetKey|Caption]]. */
const CASE_IMG_MARKER_RE = /^\[\[img:([a-zA-Z0-9._-]+)(?:\|([^\]]*))?\]\]$/;

/** Inline JTBD grid marker: [[jtbd:gridKey]] → contentMap.jtbdGrids[gridKey]. */
const CASE_JTBD_MARKER_RE = /^\[\[jtbd:([a-zA-Z0-9._-]+)\]\]$/;

/** @type {Record<string, string>} */
const CASE_CARD_PREFIX = {
  phish: "card.a",
  dragon: "card.b",
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
  const parent = el.parentElement;
  if (!hasHeadings && parts.length <= 1) {
    el.textContent = fixed;
    return;
  }
  if (!hasHeadings) {
    if (parent instanceof HTMLElement && parts.length > 1) {
      const className = el.className;
      const frag = document.createDocumentFragment();
      for (const part of parts) {
        const node = document.createElement("p");
        node.className = className;
        node.textContent = part;
        frag.appendChild(node);
      }
      parent.insertBefore(frag, el);
      el.remove();
      return;
    }
    el.textContent = fixed;
    el.style.whiteSpace = "pre-line";
    return;
  }
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
    if (CASE_IMG_MARKER_RE.test(part) || CASE_JTBD_MARKER_RE.test(part)) {
      continue;
    }
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
 * Builds JTBD card grid (Figma TextBlockSecond / Fill_Block rows).
 *
 * @param {string} gridKey
 * @returns {HTMLElement | null}
 */
function createJtbdGrid(gridKey) {
  const rows = contentMap.jtbdGrids?.[gridKey];
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }
  const grid = document.createElement("div");
  grid.className = "case-page__jtbd";
  grid.setAttribute("role", "list");
  for (const row of rows) {
    const cells = Array.isArray(row?.cells) ? row.cells : [];
    if (cells.length === 0) continue;
    const rowEl = document.createElement("div");
    rowEl.className = "case-page__jtbd-row";
    rowEl.setAttribute("role", "listitem");
    for (const cell of cells) {
      const card = document.createElement("div");
      card.className = "case-page__fill-block case-page__fill-block--compact";
      const p = document.createElement("p");
      p.className = "case-page__jtbd-text";
      const prefix = document.createElement("span");
      prefix.className = "case-page__jtbd-prefix";
      prefix.textContent = textOf(cell?.prefix || "");
      const rest = document.createElement("span");
      rest.className = "case-page__jtbd-rest";
      rest.textContent = textOf(cell?.text || "");
      p.append(prefix, rest);
      card.appendChild(p);
      rowEl.appendChild(card);
    }
    grid.appendChild(rowEl);
  }
  return grid.childElementCount > 0 ? grid : null;
}

/**
 * Builds a zoomable case picture block from a content asset key.
 *
 * @param {string} assetKey
 * @param {string} [caption]
 * @returns {HTMLElement}
 */
function createCasePicture(assetKey, caption = "") {
  const wrap = document.createElement("div");
  wrap.className = "case-page__picture case-page__picture--inline";
  wrap.setAttribute("data-case-zoomable", "");
  const assetRef = contentMap.assets?.[assetKey];
  if (assetRef?.layout === "center") {
    wrap.classList.add("case-page__picture--center");
  }
  if (caption) {
    const cap = document.createElement("p");
    cap.className = "case-page__picture-caption";
    cap.textContent = textOf(caption);
    wrap.appendChild(cap);
  }
  const img = document.createElement("img");
  img.className = "case-page__picture-img";
  img.src = resolveAsset(assetKey);
  const fullSrc = resolveAsset(assetKey, { full: true });
  if (fullSrc && fullSrc !== img.src) {
    img.dataset.fullSrc = fullSrc;
  }
  img.alt = textOf(caption) || assetKey;
  img.decoding = "async";
  // Eager: lazy + height:auto caused 0×0 boxes that never entered the
  // viewport, so zoomable case pictures stayed blank and skew reveal layout.
  wrap.appendChild(img);
  return wrap;
}

/**
 * Appends body parts into a section, opening/closing text blocks around images.
 *
 * @param {HTMLElement} section
 * @param {string} body
 * @param {string} [className]
 * @param {boolean} [longOnly]
 * @param {HTMLElement | null} [openBlock]
 * @returns {HTMLElement | null}
 */
function appendRichBody(
  section,
  body,
  className = "case-page__text-body",
  longOnly = false,
  openBlock = null,
  mergeHeadings = false
) {
  const fixed = textOf(body);
  const parts = fixed
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  let block = openBlock;

  /**
   * @returns {HTMLElement}
   */
  function ensureBlock() {
    if (block instanceof HTMLElement) {
      return block;
    }
    block = document.createElement("div");
    block.className = "case-page__text-block";
    if (longOnly) {
      block.setAttribute("data-case-long-only", "");
    }
    section.appendChild(block);
    return block;
  }

  for (const part of parts) {
    const imgMatch = part.match(CASE_IMG_MARKER_RE);
    if (imgMatch) {
      const picture = createCasePicture(imgMatch[1], (imgMatch[2] || "").trim());
      if (longOnly) {
        picture.setAttribute("data-case-long-only", "");
      }
      ensureBlock().appendChild(picture);
      continue;
    }
    const jtbdMatch = part.match(CASE_JTBD_MARKER_RE);
    if (jtbdMatch) {
      const jtbd = createJtbdGrid(jtbdMatch[1]);
      if (jtbd) {
        if (longOnly) {
          jtbd.setAttribute("data-case-long-only", "");
        }
        ensureBlock().appendChild(jtbd);
      }
      continue;
    }
    const heading = part.match(/^##\s+(.+)$/);
    const el = document.createElement(heading ? "h3" : "p");
    el.className = heading ? "case-page__text-sub" : className;
    el.textContent = heading ? heading[1] : part;
    if (heading && !mergeHeadings) {
      block = null;
    }
    ensureBlock().appendChild(el);
  }
  return block;
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

  const mergeHeadings = Boolean(options.mergeHeadings);
  const titleAsSub = Boolean(options.titleAsSub);
  let block = null;
  if (hasTitle) {
    block = document.createElement("div");
    block.className = "case-page__text-block";
    const heading = document.createElement(titleAsSub ? "h3" : "h2");
    heading.className = titleAsSub
      ? "case-page__text-sub"
      : "case-page__text-title";
    heading.textContent = textOf(title);
    block.appendChild(heading);
    section.appendChild(block);
  }
  if (hasBody) {
    block = appendRichBody(
      section,
      body,
      "case-page__text-body",
      false,
      block,
      mergeHeadings
    );
  }
  if (longBody) {
    appendRichBody(
      section,
      longBody,
      "case-page__text-body",
      true,
      null,
      mergeHeadings
    );
  }
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
  const introBodyEl = document.querySelector("[data-case='intro-body']");
  const introBlock =
    introBodyEl instanceof HTMLElement
      ? introBodyEl.closest(".case-page__text-block")
      : null;
  const introHost =
    introBlock instanceof HTMLElement ? introBlock.parentElement : null;
  if (introHost instanceof HTMLElement && introBlock instanceof HTMLElement) {
    introBodyEl.remove();
    appendRichBody(
      introHost,
      caseVal("intro_body") || bio,
      "case-page__text-body",
      false,
      introBlock
    );
  } else {
    setBodyText("[data-case='intro-body']", caseVal("intro_body") || bio);
  }
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

  /** @type {Record<string, string>} */
  const navFallback = {
    context: "sidenav.context",
    analysis: "sidenav.analysis",
    hypotheses: "sidenav.hypotheses",
    conclusions: "sidenav.conclusions",
    contacts: "sidenav.contacts",
  };
  /** @type {Record<string, string>} */
  const navTitleKey = {
    analysis: "analysis_title",
    design: "design_title",
    ux_test: "ux_test_title",
    finals: "finals_title",
    hypotheses: "hypotheses_title",
    conclusions: "conclusions_title",
  };
  for (const link of document.querySelectorAll("[data-case-nav]")) {
    if (!(link instanceof HTMLElement)) continue;
    const id = String(link.getAttribute("data-case-nav") || "").trim();
    if (!id) continue;
    const navOverride = caseVal(`nav_${id}`);
    const titleFromCase = navTitleKey[id] ? caseVal(navTitleKey[id]) : undefined;
    const fallbackKey = navFallback[id];
    const label =
      (typeof navOverride === "string" && navOverride.trim()
        ? navOverride
        : undefined) ||
      (typeof titleFromCase === "string" && titleFromCase.trim()
        ? titleFromCase
        : undefined) ||
      (fallbackKey ? content[fallbackKey] : undefined) ||
      link.textContent ||
      "";
    link.textContent = textOf(label);
  }

  fillStubSection("analysis", caseVal("analysis_title"), caseVal("analysis_body"), {
    longOnly: true,
  });
  fillStubSection("design", caseVal("design_title"), caseVal("design_body"), {
    longOnly: true,
  });
  fillStubSection("ux_test", caseVal("ux_test_title"), caseVal("ux_test_body"));
  fillStubSection("finals", caseVal("finals_title"), caseVal("finals_body"), {
    titleAsSub: true,
    mergeHeadings: true,
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
  // Zoom/lightbox opted-in per case (InnoPhish). Dragon hero stays as before.
  if (caseId === "phish" && picture instanceof HTMLElement) {
    picture.setAttribute("data-case-zoomable", "");
  }
  if (hero instanceof HTMLImageElement) {
    const heroKey = `${prefix}hero`;
    const src = resolveAsset(heroKey);
    hero.src = src;
    const fullSrc = resolveAsset(heroKey, { full: true });
    if (fullSrc && fullSrc !== src) {
      hero.dataset.fullSrc = fullSrc;
    }
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
 * No-op when the browser already provides a native scroll-to-top control.
 *
 * @param {HTMLElement} fab
 * @returns {() => void}
 */
function bindFab(fab) {
  if (browserHasNativeScrollTopButton()) {
    fab.hidden = true;
    fab.setAttribute("hidden", "");
    fab.classList.remove("is-visible");
    return () => {};
  }

  fab.hidden = false;
  fab.removeAttribute("hidden");

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
 * BurgerMenu → MenuMobile popover (<1366 via CSS; ≥1366 burger is hidden, theme stays).
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
    document.documentElement.classList.toggle("is-drawer-open", open);
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
    document.documentElement.classList.remove("is-drawer-open");
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
 * Collects non-nested reveal targets for the case main column.
 *
 * @returns {HTMLElement[]}
 */
function collectCaseRevealTargets() {
  /** @type {HTMLElement[]} */
  const out = [];
  for (const selector of CASE_REVEAL_SELECTORS) {
    const nodes = document.querySelectorAll(selector);
    for (const node of nodes) {
      if (node instanceof HTMLElement) {
        out.push(node);
      }
    }
  }
  return out;
}

/**
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return Boolean(
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
  );
}

/**
 * True if the block overlaps the visible viewport at all
 * (or was already scrolled past). Those stay static — no fade.
 *
 * @param {HTMLElement} el
 * @returns {boolean}
 */
function isCaseBlockOnScreenOrPast(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  if (vh <= 0) {
    return false;
  }
  // Scrolled past (above the fold) or any pixel still in the viewport.
  return rect.bottom <= 0 || (rect.bottom > 0 && rect.top < vh);
}

/**
 * Waits until case picture imgs have dimensions (or fail / time out) so
 * scroll-reveal measures real layout, not collapsed lazy placeholders.
 *
 * @param {number} [capMs]
 * @returns {Promise<void>}
 */
function waitForCasePictureLayout(capMs = 1200) {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }
  const imgs = Array.from(
    document.querySelectorAll(".case-page__main img.case-page__picture-img")
  );
  if (imgs.length === 0) {
    return Promise.resolve();
  }
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          let settled = false;
          const done = () => {
            if (settled) return;
            settled = true;
            resolve();
          };
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          window.setTimeout(done, capMs);
        })
    )
  ).then(() => {});
}

/**
 * Marks only off-screen blocks with `is-reveal` and fades them once via
 * IntersectionObserver (`is-in`) when the user scrolls them into view.
 * Anything already in the visible viewport stays without animation.
 * Long/short toggle does not call this again — no replay.
 *
 * @returns {() => void} teardown
 */
export function setupCaseReveal() {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return () => {};
  }
  if (!document.body?.classList?.contains("case-page")) {
    return () => {};
  }

  const targets = collectCaseRevealTargets();
  if (targets.length === 0) {
    return () => {};
  }

  if (prefersReducedMotion()) {
    return () => {};
  }

  /** @type {Set<HTMLElement>} */
  const revealed = new Set();
  /** @type {IntersectionObserver | null} */
  let observer = null;
  /** @type {ReturnType<typeof setTimeout> | null} */
  let startTimer = null;
  let cancelled = false;

  /**
   * @param {HTMLElement} el
   * @returns {void}
   */
  function markIn(el) {
    if (revealed.has(el) || el.classList.contains("is-in")) {
      revealed.add(el);
      return;
    }
    revealed.add(el);
    el.classList.add("is-in");
    observer?.unobserve(el);
  }

  /**
   * @returns {void}
   */
  function startReveal() {
    startTimer = null;
    if (cancelled) {
      return;
    }
    /** @type {HTMLElement[]} */
    const offScreen = [];
    for (const el of targets) {
      if (isCaseBlockOnScreenOrPast(el)) {
        continue;
      }
      el.classList.add("is-reveal");
      offScreen.push(el);
    }

    if (offScreen.length === 0) {
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const target = entry.target;
          if (target instanceof HTMLElement) {
            markIn(target);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: [0, 0.12],
      }
    );

    for (const el of offScreen) {
      observer.observe(el);
    }
  }

  const waitEnter = document.documentElement.classList.contains(
    "is-page-enter-crossfade"
  );
  const enterDelayMs = waitEnter ? PAGE_CROSSFADE_MS : 0;

  Promise.all([
    waitForCasePictureLayout(),
    enterDelayMs > 0
      ? new Promise((resolve) => {
          startTimer = window.setTimeout(resolve, enterDelayMs);
        })
      : Promise.resolve(),
  ]).then(() => {
    if (cancelled) {
      return;
    }
    startReveal();
  });

  return () => {
    cancelled = true;
    if (startTimer != null) {
      window.clearTimeout(startTimer);
      startTimer = null;
    }
    observer?.disconnect();
    observer = null;
  };
}

const LIGHTBOX_SCALE_MAX = 8;
const LIGHTBOX_ZOOM_FACTOR = 1.25;

/**
 * Builds DS tapper (+/−) for case lightbox zoom.
 *
 * @returns {HTMLElement}
 */
function createLightboxTapper() {
  const root = document.createElement("div");
  root.className = "ds-tapper case-page__lightbox-tapper";
  root.setAttribute("role", "group");
  root.setAttribute("aria-label", "Tapper");

  /** @type {Array<{ action: string, labelKey: string, tooltipKey: string, iconKey: string, hoverKey: string, iconName: string }>} */
  const hits = [
    {
      action: "zoom-out",
      labelKey: "tapper.zoom_out",
      tooltipKey: "tooltip.zoom_out",
      iconKey: "icons.minus",
      hoverKey: "icons.minus.hover",
      iconName: "Minus",
    },
    {
      action: "zoom-in",
      labelKey: "tapper.zoom_in",
      tooltipKey: "tooltip.zoom_in",
      iconKey: "icons.plus",
      hoverKey: "icons.plus.hover",
      iconName: "Plus",
    },
  ];

  for (const hit of hits) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scene-tapper__hit";
    btn.setAttribute("data-tapper-action", hit.action);
    btn.setAttribute("aria-label", textOf(contentMap[hit.labelKey] || hit.action));
    btn.tabIndex = 0;

    const icon = document.createElement("span");
    icon.className = "ds-icon ds-icon--swap";
    icon.setAttribute("aria-hidden", "true");
    icon.dataset.icon = hit.iconName;

    const imgDefault = document.createElement("img");
    imgDefault.className = "ds-icon__state ds-icon__state--default";
    imgDefault.src = resolveAsset(hit.iconKey);
    imgDefault.alt = "";
    imgDefault.width = 24;
    imgDefault.height = 24;

    const imgHover = document.createElement("img");
    imgHover.className = "ds-icon__state ds-icon__state--hover";
    imgHover.src = resolveAsset(hit.hoverKey);
    imgHover.alt = "";
    imgHover.width = 24;
    imgHover.height = 24;

    icon.appendChild(imgDefault);
    icon.appendChild(imgHover);
    btn.appendChild(icon);

    const tip = document.createElement("span");
    tip.className = "ds-tooltip";
    tip.setAttribute("role", "tooltip");
    tip.textContent = textOf(contentMap[hit.tooltipKey] || contentMap[hit.labelKey] || "");
    btn.appendChild(tip);

    root.appendChild(btn);
  }

  return root;
}

/**
 * Case picture lightbox: pan/zoom via transform (Figma-style), not scroll.
 * Wheel and tapper zoom to the cursor/center; drag moves the frame.
 *
 * @returns {() => void}
 */
function setupCaseLightbox() {
  if (typeof document === "undefined") {
    return () => {};
  }

  /** @type {HTMLElement | null} */
  let overlay = null;
  /** @type {HTMLElement | null} */
  let stage = null;
  /** @type {HTMLImageElement | null} */
  let overlayImg = null;
  /** @type {HTMLButtonElement | null} */
  let closeBtn = null;
  /** @type {HTMLElement | null} */
  let tapper = null;
  /** Scale relative to natural size. */
  let k = 1;
  /** Fit-to-stage scale (contain, never upscale past 1). */
  let fit = 1;
  let x = 0;
  let y = 0;
  /** @type {Map<number, {x: number, y: number}>} */
  const pointers = new Map();
  let panning = false;
  let moved = false;

  /**
   * @returns {{w: number, h: number}}
   */
  function naturalSize() {
    return {
      w: overlayImg?.naturalWidth || 0,
      h: overlayImg?.naturalHeight || 0,
    };
  }

  /**
   * Keep at least a quarter of the frame on stage.
   * @returns {void}
   */
  function clampPan() {
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    const { w: nw, h: nh } = naturalSize();
    const w = nw * k;
    const h = nh * k;
    const keepX = Math.min(w, box.width) / 4;
    const keepY = Math.min(h, box.height) / 4;
    x = Math.min(box.width - keepX, Math.max(keepX - w, x));
    y = Math.min(box.height - keepY, Math.max(keepY - h, y));
  }

  /**
   * @returns {void}
   */
  function draw() {
    if (!overlayImg) return;
    clampPan();
    overlayImg.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) scale(${k})`;
    const zoomed = k > fit * 1.001;
    stage?.classList.toggle("is-zoomed", zoomed);
    if (tapper) {
      const out = tapper.querySelector('[data-tapper-action="zoom-out"]');
      const inn = tapper.querySelector('[data-tapper-action="zoom-in"]');
      if (out instanceof HTMLButtonElement) {
        out.disabled = k <= fit * 1.001;
      }
      if (inn instanceof HTMLButtonElement) {
        inn.disabled = k >= LIGHTBOX_SCALE_MAX * 0.999;
      }
    }
  }

  /**
   * @returns {void}
   */
  function fitScreen() {
    if (!stage || !overlayImg) return;
    const box = stage.getBoundingClientRect();
    const { w, h } = naturalSize();
    if (!w || !h || box.width <= 0 || box.height <= 0) return;
    fit = Math.min(box.width / w, box.height / h, 1);
    k = fit;
    x = (box.width - w * k) / 2;
    y = (box.height - h * k) / 2;
    draw();
  }

  /**
   * Zoom around a stage-local point so the pixel under the cursor stays put.
   *
   * @param {number} next
   * @param {number} [px]
   * @param {number} [py]
   * @returns {void}
   */
  function zoomAt(next, px, py) {
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    const cx = px ?? box.width / 2;
    const cy = py ?? box.height / 2;
    const clamped = Math.min(LIGHTBOX_SCALE_MAX, Math.max(fit, next));
    const ratio = k === 0 ? 1 : clamped / k;
    x = cx - (cx - x) * ratio;
    y = cy - (cy - y) * ratio;
    k = clamped;
    draw();
  }

  /**
   * @param {number} factor
   * @param {number} [px]
   * @param {number} [py]
   * @returns {void}
   */
  function zoomBy(factor, px, py) {
    zoomAt(k * factor, px, py);
  }

  /**
   * @returns {void}
   */
  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.className = "case-page__lightbox";
    overlay.setAttribute("hidden", "");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Просмотр изображения");

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className =
      "ds-button-round ds-button-round--outlined case-page__lightbox-close";
    closeBtn.setAttribute("aria-label", "Закрыть");
    const closeIcon = document.createElement("span");
    closeIcon.className = "ds-icon";
    closeIcon.setAttribute("aria-hidden", "true");
    closeIcon.dataset.icon = "close";
    const closeImg = document.createElement("img");
    closeImg.src = resolveAsset("icons.close");
    closeImg.alt = "";
    closeImg.width = 24;
    closeImg.height = 24;
    closeIcon.appendChild(closeImg);
    closeBtn.appendChild(closeIcon);
    closeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      close();
    });

    stage = document.createElement("div");
    stage.className = "case-page__lightbox-stage";
    overlayImg = document.createElement("img");
    overlayImg.className = "case-page__lightbox-img";
    overlayImg.alt = "";
    overlayImg.decoding = "async";
    overlayImg.draggable = false;
    overlayImg.addEventListener("load", () => fitScreen());
    overlayImg.addEventListener("dragstart", (event) => event.preventDefault());
    overlayImg.addEventListener("dblclick", (event) => {
      if (!stage) return;
      const box = stage.getBoundingClientRect();
      if (k > fit * 1.5) fitScreen();
      else zoomBy(2, event.clientX - box.left, event.clientY - box.top);
    });
    stage.appendChild(overlayImg);

    stage.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        if (!stage) return;
        const box = stage.getBoundingClientRect();
        const pinch = event.ctrlKey || event.metaKey;
        zoomBy(
          Math.exp(-event.deltaY / (pinch ? 100 : 400)),
          event.clientX - box.left,
          event.clientY - box.top
        );
      },
      { passive: false }
    );

    stage.addEventListener("pointerdown", (event) => {
      if (event.target instanceof Element && event.target.closest("button")) {
        return;
      }
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      stage?.setPointerCapture(event.pointerId);
      moved = false;
    });

    stage.addEventListener("pointermove", (event) => {
      const prev = pointers.get(event.pointerId);
      if (!prev) return;
      const dx = event.clientX - prev.x;
      const dy = event.clientY - prev.y;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return;
      moved = true;
      panning = true;
      stage?.classList.add("is-panning");
      x += dx;
      y += dy;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      draw();
    });

    /**
     * @param {PointerEvent} event
     * @returns {void}
     */
    function releasePointer(event) {
      const from = pointers.get(event.pointerId);
      pointers.delete(event.pointerId);
      if (!pointers.size) {
        stage?.classList.remove("is-panning");
        panning = false;
      }
      if (!from || moved) return;
      if (event.pointerType !== "mouse") return;
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      if (hit === stage || hit === overlay) close();
    }

    stage.addEventListener("pointerup", releasePointer);
    stage.addEventListener("pointercancel", (event) => {
      pointers.delete(event.pointerId);
      if (!pointers.size) {
        stage?.classList.remove("is-panning");
        panning = false;
      }
    });

    tapper = createLightboxTapper();
    tapper.addEventListener("click", (event) => {
      event.stopPropagation();
      const hit =
        event.target instanceof Element
          ? event.target.closest("[data-tapper-action]")
          : null;
      if (!(hit instanceof HTMLElement)) return;
      const action = hit.getAttribute("data-tapper-action");
      if (action === "zoom-in") {
        event.preventDefault();
        zoomBy(LIGHTBOX_ZOOM_FACTOR);
      } else if (action === "zoom-out") {
        event.preventDefault();
        zoomBy(1 / LIGHTBOX_ZOOM_FACTOR);
      }
    });

    overlay.appendChild(closeBtn);
    overlay.appendChild(stage);
    overlay.appendChild(tapper);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
  }

  /**
   * @param {string} src
   * @param {string} [alt]
   * @returns {void}
   */
  function open(src, alt = "") {
    if (!src) return;
    ensureOverlay();
    if (!overlay || !overlayImg) return;
    k = 1;
    fit = 1;
    x = 0;
    y = 0;
    pointers.clear();
    moved = false;
    panning = false;
    overlayImg.removeAttribute("width");
    overlayImg.removeAttribute("height");
    overlayImg.style.width = "";
    overlayImg.style.height = "";
    overlayImg.style.transform = "";
    overlayImg.src = src;
    overlayImg.alt = alt || "";
    overlay.removeAttribute("hidden");
    document.documentElement.classList.add("is-case-lightbox-open");
    document.body.classList.add("is-case-lightbox-open");
    if (overlayImg.complete && overlayImg.naturalWidth) {
      fitScreen();
    } else {
      requestAnimationFrame(() => fitScreen());
    }
    closeBtn?.focus?.({ preventScroll: true });
  }

  /**
   * @returns {void}
   */
  function close() {
    if (!overlay) return;
    overlay.setAttribute("hidden", "");
    if (overlayImg) {
      overlayImg.removeAttribute("src");
      overlayImg.alt = "";
      overlayImg.style.transform = "";
    }
    k = 1;
    fit = 1;
    x = 0;
    y = 0;
    pointers.clear();
    moved = false;
    panning = false;
    stage?.classList.remove("is-zoomed", "is-panning");
    document.documentElement.classList.remove("is-case-lightbox-open");
    document.body.classList.remove("is-case-lightbox-open");
  }

  /**
   * @param {MouseEvent} event
   * @returns {void}
   */
  function onClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".case-page__lightbox")) return;
    const picture = target.closest("[data-case-zoomable]");
    if (!(picture instanceof HTMLElement)) return;
    if (picture.classList.contains("is-empty")) return;
    const img =
      target instanceof HTMLImageElement &&
      target.classList.contains("case-page__picture-img")
        ? target
        : picture.querySelector(".case-page__picture-img");
    if (!(img instanceof HTMLImageElement) || !img.src) return;
    event.preventDefault();
    const fullSrc = img.dataset.fullSrc?.trim();
    open(fullSrc || img.currentSrc || img.src, img.alt || "");
  }

  /**
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  function onKeydown(event) {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (!overlay || overlay.hasAttribute("hidden")) return;
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomBy(LIGHTBOX_ZOOM_FACTOR);
    } else if (event.key === "-") {
      event.preventDefault();
      zoomBy(1 / LIGHTBOX_ZOOM_FACTOR);
    } else if (event.key === "0") {
      event.preventDefault();
      fitScreen();
    }
  }

  /**
   * @returns {void}
   */
  function onResize() {
    if (!overlay || overlay.hasAttribute("hidden")) return;
    fitScreen();
  }

  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", onResize);

  return () => {
    document.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onResize);
    close();
    overlay?.remove();
    overlay = null;
    stage = null;
    overlayImg = null;
    closeBtn = null;
    tapper = null;
  };
}

/**
 * Bootstraps the case page.
 */
export function initCasePage() {
  consumeEnterCrossfade();
  // Warm the home document + keep «Назад» href aligned with the entry file.
  try {
    const home = sessionStorage.getItem(HOME_HREF_KEY) || "main.html";
    if (/^[A-Za-z0-9._-]+\.html$/.test(home)) {
      prefetchInternalPage(home);
      const links = document.querySelectorAll('a[href="main.html"]');
      for (const link of links) {
        link.setAttribute("href", home);
      }
    }
  } catch {
    prefetchInternalPage("main.html");
  }
  // Home Macbook layers: warm HTTP/memory cache so back does not PNG→layers flash.
  prefetchMacbookAssets();

  const caseId = readCaseId();
  fillContent(contentMap, caseId);
  const unbindReveal = setupCaseReveal();
  const unbindLightbox = setupCaseLightbox();

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
    unbindReveal();
    unbindLightbox();
    unbindSegments();
    unbindFab();
    unbindNav();
    unbindDrawer();
    unbindHome();
    unbindNext();
  };
}

// Case pages carry the theme too, and read the same stored choice as the home
// page — switching there and navigating here keeps the theme. Toggle docks
// next to the burger (Header / Toolbar) via setupTheme placement.
const theme = setupTheme();

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        initCasePage();
        theme.syncPlacement?.();
      },
      { once: true }
    );
  } else {
    initCasePage();
    theme.syncPlacement?.();
  }
}
