/**
 * Portfolio Scene Renderer: mounts world DOM once from Scene Layout + Content Map.
 * Camera gestures must not rewrite children left/top (architecture §5.2).
 */

import { computeContentAABB, FIXED_CHROME_KINDS } from "../../shared/layout.js";
import { fixHangingPrepositions } from "../../shared/typography.js";

const CHIP_KEYS = [
  "chip.b2b",
  "chip.b2c",
  "chip.design_system",
  "chip.ai_prototyping",
];

const CONTACT_KEYS = [
  "contact.cv",
  "contact.telegram",
  "contact.linkedin",
  "contact.behance",
];

const BG_TILE_WIDTH = 560;
const BG_TILE_HEIGHT = 340;

/**
 * @param {unknown} value
 * @returns {string}
 */
function textOf(value) {
  return fixHangingPrepositions(typeof value === "string" ? value : "");
}

/** Screen inset for fixed chrome (sidebar / tapper) vs viewport edges. */
const VIEWPORT_CHROME_INSET = 24;

/**
 * Applies absolute world-slot or screen-chrome geometry from a SceneNode.
 *
 * @param {HTMLElement} el
 * @param {{ x: number, y: number, width: number, height: number, zIndex: number, id: string, kind: string }} node
 * @param {{ fixedChrome?: boolean }} [opts]
 */
function applySlotGeometry(el, node, opts = {}) {
  el.classList.add("scene-node");
  if (opts.fixedChrome) {
    el.classList.add("scene-chrome");
  }
  el.dataset.nodeId = node.id;
  el.dataset.nodeKind = node.kind;
  el.style.position = "absolute";
  el.style.width = `${node.width}px`;
  el.style.zIndex = String(node.zIndex);
  el.style.boxSizing = "border-box";

  // Tapper chrome: sticky to viewport right edge (24px), vertically centered.
  if (opts.fixedChrome && node.kind === "tapper") {
    el.style.width = `${node.width}px`;
    el.style.height = `${node.height}px`;
    el.style.left = "auto";
    el.style.right = `${VIEWPORT_CHROME_INSET}px`;
    el.style.top = "50%";
    el.style.bottom = "auto";
    el.style.transform = "translateY(-50%)";
    return;
  }

  // Sidebar chrome: pinned top+bottom with 24px inset; height follows viewport.
  if (opts.fixedChrome && node.kind === "sidebar") {
    el.style.left = `${node.x}px`;
    el.style.top = `${VIEWPORT_CHROME_INSET}px`;
    el.style.right = "auto";
    el.style.bottom = `${VIEWPORT_CHROME_INSET}px`;
    el.style.height = "auto";
    return;
  }

  el.style.height = `${node.height}px`;
  el.style.left = `${node.x}px`;
  el.style.top = `${node.y}px`;
  el.style.right = "auto";
  el.style.bottom = "auto";
}

/**
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @returns {HTMLElement}
 */
function buildSidebar(content, resolveAsset) {
  const aside = document.createElement("aside");
  aside.className = "ds-sidebar";

  const designer = document.createElement("div");
  designer.className = "ds-sidebar__designer";

  const profile = document.createElement("div");
  profile.className = "ds-sidebar__profile ds-profile";

  const avatar = document.createElement("div");
  avatar.className = "ds-avatar ds-placeholder";
  avatar.setAttribute("aria-hidden", "true");
  avatar.setAttribute("data-media-slot-box", "avatar");
  avatar.style.width = "48px";
  avatar.style.height = "48px";
  avatar.style.minWidth = "48px";
  avatar.style.minHeight = "48px";
  avatar.style.aspectRatio = "1 / 1";
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

  const skills = document.createElement("div");
  skills.className = "ds-sidebar__skills";
  const variants =
    content && typeof content.chipVariants === "object" && content.chipVariants
      ? content.chipVariants
      : {};
  for (const key of CHIP_KEYS) {
    const chip = document.createElement("span");
    const variant = variants[key] === "active" ? "active" : "default";
    chip.className = `ds-chip ds-chip--${variant}`;
    chip.textContent = textOf(content[key]);
    skills.appendChild(chip);
  }
  inform.append(bio, skills);
  designer.append(profile, inform);

  const contacts = document.createElement("nav");
  contacts.className = "ds-sidebar__contacts";
  contacts.setAttribute("aria-label", "Contacts");
  for (const key of CONTACT_KEYS) {
    const link = document.createElement("a");
    link.className = "ds-link";
    const urls = content.contactUrls;
    const href =
      urls && typeof urls[key] === "string" && urls[key] ? urls[key] : "#";
    link.href = href;
    link.tabIndex = 0;
    link.textContent = textOf(content[key]);
    if (href !== "#") {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      if (key === "contact.cv") {
        link.setAttribute("download", "CV-Yasinskaya.pdf");
      }
    }
    contacts.appendChild(link);
  }

  aside.append(designer, contacts);
  return aside;
}

/**
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @param {string} [imageAssetKey="card.image"]
 * @returns {HTMLElement}
 */
function buildCard(content, resolveAsset, imageAssetKey = "card.image") {
  const article = document.createElement("article");
  article.className = "ds-card ds-card--default";

  const media = document.createElement("div");
  media.className = "ds-card__media ds-placeholder";
  media.setAttribute("data-media-slot-box", "card");
  // Figma Photo slot 308×180 (card 310×310, InfoCard 128).
  media.style.width = "100%";
  media.style.minHeight = "180px";
  media.style.aspectRatio = "310 / 180";
  const img = document.createElement("img");
  img.src = resolveAsset(imageAssetKey);
  img.alt = `${textOf(content["card.title"])} project cover`;
  img.width = 310;
  img.height = 180;
  img.setAttribute("data-media-slot", "card");
  media.appendChild(img);

  const body = document.createElement("div");
  body.className = "ds-card__body";
  const header = document.createElement("div");
  header.className = "ds-card__header";
  const title = document.createElement("h3");
  title.className = "ds-card__title";
  title.textContent = textOf(content["card.title"]);
  const meta = document.createElement("p");
  meta.className = "ds-card__meta";
  meta.textContent = textOf(content["card.meta"]);
  header.append(title, meta);
  const description = document.createElement("p");
  description.className = "ds-card__description";
  description.textContent = textOf(content["card.description"]);
  body.append(header, description);

  article.append(media, body);
  return article;
}

/**
 * @param {(key: string) => string} resolveAsset
 * @param {{ width: number, height: number }} size
 * @param {string} assetKey
 * @param {string} className
 * @returns {HTMLElement}
 */
function buildMediaCutout(resolveAsset, size, assetKey, className) {
  const wrap = document.createElement("div");
  wrap.className = className;
  wrap.setAttribute("data-media-slot-box", assetKey);
  const img = document.createElement("img");
  img.src = resolveAsset(assetKey);
  img.alt = "";
  img.width = Math.round(size.width);
  img.height = Math.round(size.height);
  img.setAttribute("data-media-slot", assetKey);
  img.draggable = false;
  wrap.appendChild(img);
  return wrap;
}

/**
 * @param {object} content
 * @returns {HTMLElement}
 */
function buildStiker(content) {
  const el = document.createElement("div");
  el.className = "ds-stiker";
  el.setAttribute("aria-label", "Stiker");
  el.textContent = textOf(content["stiker.label"]);
  return el;
}

/**
 * me + Macbook + Stiker as one draggable world cluster (Figma 41:1416).
 *
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @param {{ children?: Array<{ id: string, kind: string, x: number, y: number, width: number, height: number, rotation?: number }> }} node
 * @returns {HTMLElement}
 */
function buildAboutCluster(content, resolveAsset, node) {
  const root = document.createElement("div");
  root.className = "scene-about-cluster";
  root.setAttribute("aria-label", "Обо мне");

  const children = Array.isArray(node.children) ? node.children : [];
  for (const child of children) {
    /** @type {HTMLElement} */
    let el;
    if (child.kind === "me") {
      el = buildMediaCutout(resolveAsset, child, "me", "scene-about__me");
    } else if (child.kind === "macbook") {
      el = buildMediaCutout(
        resolveAsset,
        child,
        "macbook",
        "scene-about__macbook"
      );
    } else if (child.kind === "stiker") {
      el = buildStiker(content);
    } else {
      continue;
    }
    el.classList.add("scene-about__item");
    el.dataset.nodeId = child.id;
    el.dataset.nodeKind = child.kind;
    el.style.position = "absolute";
    el.style.left = `${child.x}px`;
    el.style.top = `${child.y}px`;
    el.style.width = `${child.width}px`;
    el.style.height = `${child.height}px`;
    el.style.boxSizing = "border-box";
    // Figma node.rotation (Plugin API) maps to CSS rotate(-θ): Figma relativeTransform
    // [[cos, sin], [-sin, cos]] equals CSS matrix for rotate(-θ). Origin = top-left.
    if (Number.isFinite(child.rotation) && child.rotation !== 0) {
      el.style.transform = `rotate(${-child.rotation}deg)`;
      el.style.transformOrigin = "0 0";
    }
    root.appendChild(el);
  }

  return root;
}

/**
 * Tapper with two focusable hit buttons (− / +); clicks wired in interactions.
 * Portrait (Figma home): Plus above, Minus below; tooltips to the left.
 *
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @param {{ sceneTransform?: { portrait?: boolean } }} [node]
 * @returns {HTMLElement}
 */
function buildTapper(content, resolveAsset, node = {}) {
  const root = document.createElement("div");
  const portrait = Boolean(node.sceneTransform && node.sceneTransform.portrait);
  root.className = portrait ? "ds-tapper ds-tapper--portrait" : "ds-tapper";
  root.setAttribute("role", "group");
  root.setAttribute("aria-label", "Tapper");

  /** @type {Array<{ action: string, labelKey: string, tooltipKey: string, iconKey: string, hoverKey: string, iconName: string }>} */
  const hitsLandscape = [
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
  // Portrait stack: Plus (top) → Minus (bottom), matching Figma home visual.
  const hits = portrait
    ? [hitsLandscape[1], hitsLandscape[0]]
    : hitsLandscape;

  for (const hit of hits) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scene-tapper__hit";
    btn.setAttribute("data-tapper-action", hit.action);
    btn.setAttribute("aria-label", textOf(content[hit.labelKey]));
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

    icon.append(imgDefault, imgHover);

    const tip = document.createElement("span");
    tip.className = "ds-tooltip";
    tip.setAttribute("role", "tooltip");
    tip.textContent = textOf(content[hit.tooltipKey] || content[hit.labelKey]);

    btn.append(icon, tip);
    root.appendChild(btn);
  }

  return root;
}


/**
 * Layout AABB marker only — visual dots live on infinite viewport layer (FigJam physics).
 *
 * @param {(key: string) => string} resolveAsset
 * @param {{ width: number, height: number }} node
 * @returns {HTMLElement}
 */
function buildBg(resolveAsset, node) {
  void resolveAsset;
  const el = document.createElement("div");
  el.className = "scene-bg";
  el.style.pointerEvents = "none";
  el.style.visibility = "hidden";
  el.setAttribute("aria-hidden", "true");
  el.dataset.bgTiles = `${Math.ceil(node.width / BG_TILE_WIDTH)}x${Math.ceil(
    node.height / BG_TILE_HEIGHT
  )}`;
  return el;
}

/**
 * @param {{ kind: string, id: string, width: number, height: number, sceneTransform?: { rotation?: number, matrix?: string } }} node
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @param {{ fixedChrome?: boolean }} [opts]
 * @returns {HTMLElement}
 */
function buildNodeElement(node, content, resolveAsset, opts = {}) {
  /** @type {HTMLElement} */
  let el;
  switch (node.kind) {
    case "bg":
      el = buildBg(resolveAsset, node);
      break;
    case "sidebar":
      el = buildSidebar(content, resolveAsset);
      break;
    case "card":
      el = buildCard(
        content,
        resolveAsset,
        Array.isArray(node.assetKeys) && node.assetKeys[0]
          ? node.assetKeys[0]
          : "card.image"
      );
      break;
    case "about":
      el = buildAboutCluster(content, resolveAsset, node);
      break;
    case "tapper":
      el = buildTapper(content, resolveAsset, node);
      break;
    default:
      el = document.createElement("div");
      el.className = "scene-node-unknown";
  }

  applySlotGeometry(el, node, opts);

  const transform = node.sceneTransform;
  if (transform && typeof transform === "object") {
    if (typeof transform.matrix === "string" && transform.matrix) {
      el.style.transform = transform.matrix;
    } else if (typeof transform.rotation === "number") {
      el.style.transform = `rotate(${transform.rotation}deg)`;
    }
  }

  return el;
}

/**
 * Mounts portfolio scene: canvas nodes into world (camera), chrome into chromeEl (fixed).
 *
 * @param {HTMLElement} worldEl
 * @param {{ nodes?: object[] }|object[]} layout
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @param {{ chromeEl?: HTMLElement|null }} [options]
 * @returns {{ nodesById: Record<string, HTMLElement>, contentAABB: { minX: number, minY: number, maxX: number, maxY: number } }|null}
 */
export function mountScene(worldEl, layout, content, resolveAsset, options = {}) {
  if (!worldEl || typeof document === "undefined") {
    return null;
  }

  const nodes = Array.isArray(layout)
    ? layout
    : Array.isArray(layout?.nodes)
      ? layout.nodes
      : [];

  const chromeEl =
    options.chromeEl && options.chromeEl !== worldEl ? options.chromeEl : null;

  worldEl.replaceChildren();
  if (chromeEl && typeof chromeEl.querySelectorAll === "function") {
    for (const old of Array.from(chromeEl.querySelectorAll(".scene-chrome"))) {
      if (typeof old.remove === "function") {
        old.remove();
      } else if (old.parentNode && Array.isArray(old.parentNode.children)) {
        const sibs = old.parentNode.children;
        const idx = sibs.indexOf(old);
        if (idx >= 0) {
          sibs.splice(idx, 1);
        }
        old.parentNode = null;
      }
    }
  }

  const sorted = [...nodes].sort(
    (a, b) =>
      Number(a.zIndex) - Number(b.zIndex) ||
      String(a.id).localeCompare(String(b.id))
  );

  /** @type {Record<string, HTMLElement>} */
  const nodesById = {};

  for (const node of sorted) {
    if (!node || typeof node !== "object") {
      continue;
    }
    const fixedChrome = FIXED_CHROME_KINDS.has(node.kind) && Boolean(chromeEl);
    const el = buildNodeElement(node, content || {}, resolveAsset, {
      fixedChrome,
    });
    const parent = fixedChrome ? chromeEl : worldEl;
    parent.appendChild(el);
    nodesById[node.id] = el;
  }

  const contentAABB = computeContentAABB(nodes);
  return { nodesById, contentAABB };
}
