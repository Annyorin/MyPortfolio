/**
 * Document-scroll mobile portfolio (Figma «Портфолио.360» 169:12080).
 * Compact Sidebar + full-width cards + FloatingAction; no camera canvas.
 */

import { fixHangingPrepositions } from "../../shared/typography.js";
import { activateCardHit } from "./interactions.js";
import { buildCard } from "./scene.js";

/** Scroll distance (px) before FAB becomes visible. */
export const FAB_SHOW_SCROLL_Y = 48;

/** Mobile contact row: Telegram + CV only (Behance/Mail/copyright hidden). */
const MOBILE_CONTACT_ACTIONS = [
  { key: "contact.telegram", variant: "primary", icon: "icons.telegram" },
  { key: "contact.cv", variant: "secondary", icon: "icons.cv" },
];

const MOBILE_CARDS = [
  { id: "cardA", imageKey: "card.image.a" },
  { id: "cardB", imageKey: "card.image.b" },
  { id: "cardC", imageKey: "card.image.c" },
];

/**
 * @param {unknown} value
 * @returns {string}
 */
function textOf(value) {
  return fixHangingPrepositions(typeof value === "string" ? value : "");
}

/**
 * Compact ProfileMobile sidebar (full content width, 2 contact buttons).
 *
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @returns {HTMLElement}
 */
function buildMobileSidebar(content, resolveAsset) {
  const aside = document.createElement("aside");
  aside.className = "ds-sidebar portfolio-mobile__sidebar";
  aside.setAttribute("data-mobile-sidebar", "true");

  const designer = document.createElement("div");
  designer.className = "ds-sidebar__designer";

  // ProfileMobile only — do not use .ds-sidebar__profile (desktop column layout).
  const profile = document.createElement("div");
  profile.className = "ds-profile ds-profile--mobile";

  const avatar = document.createElement("div");
  avatar.className = "ds-avatar ds-placeholder";
  avatar.setAttribute("aria-hidden", "true");
  avatar.setAttribute("data-media-slot-box", "avatar");
  const avatarImg = document.createElement("img");
  avatarImg.src = resolveAsset("avatar");
  avatarImg.alt = "";
  avatarImg.width = 48;
  avatarImg.height = 48;
  avatarImg.setAttribute("data-media-slot", "avatar");
  avatar.appendChild(avatarImg);

  const meta = document.createElement("div");
  meta.className = "ds-profile__meta";
  const name = document.createElement("span");
  name.className = "ds-profile__name";
  name.textContent = textOf(content["profile.name"]);
  const role = document.createElement("span");
  role.className = "ds-profile__role";
  role.textContent = textOf(content["profile.role"]);
  meta.append(name, role);
  profile.append(avatar, meta);

  const inform = document.createElement("div");
  inform.className = "ds-sidebar__inform";
  const bio = document.createElement("p");
  bio.className = "ds-sidebar__bio";
  bio.textContent = textOf(content["sidebar.bio"]);

  const actions = document.createElement("div");
  actions.className = "ds-sidebar__skills";
  actions.setAttribute("aria-label", "Contacts");
  for (const action of MOBILE_CONTACT_ACTIONS) {
    const btn = document.createElement("a");
    btn.className = `ds-button ds-button--${action.variant}`;
    const urls = content.contactUrls;
    const href =
      urls && typeof urls[action.key] === "string" && urls[action.key]
        ? urls[action.key]
        : "#";
    btn.href = href;
    btn.tabIndex = 0;
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
    actions.appendChild(btn);
  }
  inform.append(bio, actions);
  designer.append(profile, inform);
  aside.append(designer);
  return aside;
}

/**
 * @param {(key: string) => string} resolveAsset
 * @returns {HTMLButtonElement}
 */
function buildFab(resolveAsset) {
  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "ds-fab";
  fab.setAttribute("aria-label", "Наверх");
  fab.setAttribute("data-mobile-fab", "true");
  const icon = document.createElement("span");
  icon.className = "ds-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.dataset.icon = "vuesax/linear/arrow-right";
  const iconImg = document.createElement("img");
  iconImg.src = resolveAsset("icons.arrow-right");
  iconImg.alt = "";
  iconImg.width = 24;
  iconImg.height = 24;
  icon.appendChild(iconImg);
  fab.appendChild(icon);
  return fab;
}

/**
 * Mounts document-scroll mobile portfolio into host.
 *
 * @param {HTMLElement} rootEl
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @param {{ scrollEl?: HTMLElement|null }} [options]
 * @returns {() => void} teardown
 */
export function mountMobilePortfolio(rootEl, content, resolveAsset, options = {}) {
  if (!rootEl || typeof document === "undefined") {
    return () => {};
  }

  const scrollEl =
    options.scrollEl ||
    (typeof rootEl.closest === "function"
      ? rootEl.closest(".viewport")
      : null) ||
    rootEl;

  rootEl.replaceChildren();
  if ("hidden" in rootEl) {
    rootEl.hidden = false;
  }
  rootEl.removeAttribute?.("hidden");
  rootEl.classList.add("portfolio-mobile");

  const scrin = document.createElement("div");
  scrin.className = "portfolio-mobile__scrin";

  scrin.appendChild(buildMobileSidebar(content || {}, resolveAsset));

  const projects = document.createElement("div");
  projects.className = "portfolio-mobile__projects";
  projects.setAttribute("aria-label", "Projects");
  for (const spec of MOBILE_CARDS) {
    const card = buildCard(
      content || {},
      resolveAsset,
      spec.imageKey,
      spec.id
    );
    card.classList.add("portfolio-mobile__card");
    projects.appendChild(card);
  }
  scrin.appendChild(projects);
  rootEl.appendChild(scrin);

  const fab = buildFab(resolveAsset);
  rootEl.appendChild(fab);

  /**
   * @returns {number}
   */
  function readScrollY() {
    if (scrollEl && Number.isFinite(scrollEl.scrollTop)) {
      return Number(scrollEl.scrollTop);
    }
    if (typeof window !== "undefined" && Number.isFinite(window.scrollY)) {
      return Number(window.scrollY);
    }
    return 0;
  }

  function syncFabVisibility() {
    const show = readScrollY() > FAB_SHOW_SCROLL_Y;
    fab.classList.toggle("is-visible", show);
    if (show) {
      fab.removeAttribute("hidden");
    } else {
      fab.setAttribute("hidden", "");
    }
  }

  /**
   * @param {Event} event
   */
  function onScroll() {
    syncFabVisibility();
  }

  /**
   * @param {MouseEvent|Event} event
   */
  function onFabClick(event) {
    event.preventDefault?.();
    if (typeof scrollEl.scrollTo === "function") {
      scrollEl.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scrollEl.scrollTop = 0;
    }
    syncFabVisibility();
  }

  /**
   * @param {MouseEvent|KeyboardEvent|Event} event
   */
  function onCardActivate(event) {
    const target = /** @type {HTMLElement|null} */ (event.target);
    if (!target || typeof target.closest !== "function") {
      return;
    }
    const card = /** @type {HTMLElement|null} */ (
      target.closest(".ds-card, [data-card-id]")
    );
    if (!card || !rootEl.contains?.(card)) {
      return;
    }
    if (event.type === "keydown") {
      const key = /** @type {KeyboardEvent} */ (event).key;
      if (key !== "Enter" && key !== " ") {
        return;
      }
    }
    activateCardHit(card, event);
  }

  syncFabVisibility();
  scrollEl.addEventListener?.("scroll", onScroll, { passive: true });
  fab.addEventListener("click", onFabClick);
  rootEl.addEventListener("click", onCardActivate);
  rootEl.addEventListener("keydown", onCardActivate);

  return function teardown() {
    scrollEl.removeEventListener?.("scroll", onScroll);
    fab.removeEventListener("click", onFabClick);
    rootEl.removeEventListener("click", onCardActivate);
    rootEl.removeEventListener("keydown", onCardActivate);
    rootEl.replaceChildren();
    rootEl.classList.remove("portfolio-mobile");
    if ("hidden" in rootEl) {
      rootEl.hidden = true;
    }
    rootEl.setAttribute?.("hidden", "");
  };
}
