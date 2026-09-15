/**
 * Portfolio Scene Renderer: mounts world DOM once from Scene Layout + Content Map.
 * Camera gestures must not rewrite children left/top (architecture §5.2).
 */

import { computeContentAABB, FIXED_CHROME_KINDS } from "../../shared/layout.js";
import { fixHangingPrepositions } from "../../shared/typography.js";

/** Sidebar action buttons (Figma Ui kit Sidebar 158:11468). */
const CONTACT_ACTIONS = [
  { key: "contact.telegram", variant: "primary", icon: "icons.telegram" },
  { key: "contact.cv", variant: "secondary", icon: "icons.cv" },
  { key: "contact.behance", variant: "secondary", icon: "icons.behance" },
  { key: "contact.mail", variant: "secondary", icon: "icons.mail" },
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
  avatar.style.width = "90px";
  avatar.style.height = "90px";
  avatar.style.minWidth = "90px";
  avatar.style.minHeight = "90px";
  avatar.style.aspectRatio = "1 / 1";
  const avatarImg = document.createElement("img");
  avatarImg.src = resolveAsset("avatar");
  avatarImg.alt = "";
  avatarImg.width = 90;
  avatarImg.height = 90;
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
  for (const action of CONTACT_ACTIONS) {
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

  const copyright = document.createElement("p");
  copyright.className = "ds-sidebar__copyright";
  copyright.textContent = textOf(content["sidebar.copyright"]);

  aside.append(designer, copyright);
  return aside;
}

/**
 * @param {string} [nodeId]
 * @returns {"card.a"|"card.b"|"card.c"|"card"}
 */
function cardKeyPrefix(nodeId) {
  if (nodeId === "cardA") return "card.a";
  if (nodeId === "cardB") return "card.b";
  if (nodeId === "cardC") return "card.c";
  return "card";
}

/**
 * @param {object} content
 * @param {string} prefix
 * @param {string} field
 * @returns {string}
 */
function cardField(content, prefix, field) {
  const key = `${prefix}.${field}`;
  if (content && Object.prototype.hasOwnProperty.call(content, key)) {
    const value = content[key];
    return typeof value === "string" ? value : "";
  }
  // Do not inherit shared card.url / card.action onto per-card prefixes.
  if (field === "url" || field === "action") {
    return "";
  }
  if (prefix !== "card") {
    const fallback = content?.[`card.${field}`];
    return typeof fallback === "string" ? fallback : "";
  }
  return "";
}

/**
 * CursorHover CTA (Figma CursorHover / Hover) — label + arrow-right.
 * Behance (260:24098) = fixed 114×40; «Посмотреть» (260:24115) = wider `--view`.
 *
 * @param {string} label
 * @param {(key: string) => string} resolveAsset
 * @param {{ view?: boolean }} [options]
 * @returns {HTMLElement}
 */
function buildCursorHover(label, resolveAsset, options = {}) {
  const hover = document.createElement("div");
  hover.className = options.view ? "ds-hover ds-hover--view" : "ds-hover";
  hover.setAttribute("aria-hidden", "true");

  const labelEl = document.createElement("span");
  labelEl.className = "ds-hover__label";
  labelEl.textContent = textOf(label);

  const icon = document.createElement("span");
  icon.className = "ds-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.dataset.icon = "vuesax/linear/arrow-right";
  const img = document.createElement("img");
  img.src = resolveAsset("icons.arrow-right");
  img.alt = "";
  img.width = 24;
  img.height = 24;
  icon.appendChild(img);

  hover.append(labelEl, icon);
  return hover;
}

/**
 * @param {string} [nodeId]
 * @returns {"cursor"|"behance"|""}
 */
function cardHoverMode(nodeId) {
  if (nodeId === "cardA" || nodeId === "cardB") {
    return "cursor";
  }
  if (nodeId === "cardC") {
    return "behance";
  }
  return "";
}

/**
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @param {string} [imageAssetKey="card.image"]
 * @param {string} [nodeId]
 * @returns {HTMLElement}
 */
export function buildCard(content, resolveAsset, imageAssetKey = "card.image", nodeId) {
  const article = document.createElement("article");
  article.className = "ds-card ds-card--default";
  if (nodeId) {
    article.dataset.cardId = nodeId;
  }

  const prefix = cardKeyPrefix(nodeId);
  const title = cardField(content, prefix, "title");
  const meta = cardField(content, prefix, "meta");
  const description = cardField(content, prefix, "description");
  const cardUrl = cardField(content, prefix, "url").trim();
  const action = cardField(content, prefix, "action").trim() || (cardUrl ? "link" : "");
  const hoverMode = cardHoverMode(nodeId);

  if (cardUrl) {
    article.dataset.cardUrl = cardUrl;
    article.setAttribute("role", "link");
    article.tabIndex = 0;
  } else if (action === "modal") {
    article.dataset.cardAction = "modal";
    article.tabIndex = 0;
  }

  if (hoverMode) {
    article.dataset.cardHover = hoverMode;
  }

  const media = document.createElement("div");
  media.className = "ds-card__media ds-placeholder";
  media.setAttribute("data-media-slot-box", "card");
  // Figma Card Photo media box 308×172; Dragon/Phish covers @3× are 924×570 (Ui kit 308×190).

  media.style.width = "100%";
  const img = document.createElement("img");
  img.src = resolveAsset(imageAssetKey);
  img.alt = `${textOf(title)} project cover`;
  img.width = 308;
  img.height = 172;
  img.decoding = "async";
  img.setAttribute("data-media-slot", "card");
  media.appendChild(img);

  const body = document.createElement("div");
  body.className = "ds-card__body";
  const header = document.createElement("div");
  header.className = "ds-card__header";
  const titleGroup = document.createElement("div");
  titleGroup.className = "ds-card__title-group";
  const titleEl = document.createElement("h3");
  titleEl.className = "ds-card__title";
  titleEl.textContent = textOf(title);
  const metaEl = document.createElement("p");
  metaEl.className = "ds-card__meta";
  metaEl.textContent = textOf(meta);
  titleGroup.append(titleEl, metaEl);
  header.appendChild(titleGroup);

  const chipLabel = cardField(content, prefix, "chip").trim();
  if (chipLabel) {
    const chip = document.createElement("span");
    chip.className = "ds-chip ds-chip--default ds-card__chip";
    chip.textContent = textOf(chipLabel);
    header.appendChild(chip);
  }

  const descriptionEl = document.createElement("p");
  const descriptionText = textOf(description);
  descriptionEl.className = descriptionText.includes("\n")
    ? "ds-card__description ds-card__description--fixed-lines"
    : "ds-card__description";
  descriptionEl.textContent = descriptionText;
  body.append(header, descriptionEl);

  article.append(media, body);

  if (hoverMode === "cursor") {
    const viewLabel =
      typeof content?.["hover.label.view"] === "string"
        ? content["hover.label.view"]
        : "Посмотреть";
    const floater = document.createElement("div");
    floater.className = "ds-card__cursor-hover";
    floater.appendChild(
      buildCursorHover(viewLabel, resolveAsset, { view: true })
    );
    article.appendChild(floater);
  } else if (hoverMode === "behance") {
    const behanceLabel =
      cardField(content, prefix, "hover.label").trim() ||
      (typeof content?.["hover.label"] === "string"
        ? content["hover.label"]
        : "Behance");
    const floater = document.createElement("div");
    floater.className = "ds-card__cursor-hover";
    // Figma 260:24098 — fixed 114×40 CursorHover (no --view stretch).
    floater.appendChild(buildCursorHover(behanceLabel, resolveAsset));
    article.appendChild(floater);
  }

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
  img.decoding = "async";
  img.draggable = false;
  wrap.appendChild(img);
  return wrap;
}

/** Macbook lid stickers (hit areas + Hint copy keys). */
const MACBOOK_STICKERS = [
  "create",
  "question",
  "sport",
  "anime",
  "seal",
  "books",
];

/**
 * Layered Macbook: bare lid + absolute sticker hit buttons with `.ds-hint`.
 *
 * @param {object} content
 * @param {(key: string) => string} resolveAsset
 * @param {{ width: number, height: number }} size
 * @returns {HTMLElement}
 */
function buildMacbook(content, resolveAsset, size) {
  const wrap = document.createElement("div");
  wrap.className = "scene-about__macbook";
  wrap.setAttribute("data-media-slot-box", "macbook.lid");

  const lid = document.createElement("img");
  lid.className = "scene-about__macbook-lid";
  lid.src = resolveAsset("macbook.lid");
  lid.alt = "";
  lid.width = Math.round(size.width);
  lid.height = Math.round(size.height);
  lid.setAttribute("data-media-slot", "macbook.lid");
  lid.decoding = "async";
  lid.draggable = false;

  const stickers = document.createElement("div");
  stickers.className = "scene-about__stickers";
  stickers.setAttribute("inert", "");

  for (const id of MACBOOK_STICKERS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scene-about__sticker";
    btn.dataset.sticker = id;
    btn.setAttribute("aria-label", id);

    const img = document.createElement("img");
    img.src = resolveAsset(`macbook.sticker.${id}`);
    img.alt = "";
    img.decoding = "async";
    img.draggable = false;

    const hintId = `macbook-hint-${id}`;
    const hint = document.createElement("span");
    hint.className = "ds-hint";
    hint.id = hintId;
    hint.setAttribute("role", "tooltip");
    hint.textContent = textOf(content[`hint.${id}`]);
    btn.setAttribute("aria-describedby", hintId);

    btn.append(img, hint);
    stickers.appendChild(btn);
  }

  wrap.append(lid, stickers);
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
  /** @type {Record<string, { x: number, y: number, width: number, height: number, rotation: number }>} */
  const collapsedChildren = {};
  for (const child of children) {
    /** @type {HTMLElement} */
    let el;
    if (child.kind === "me") {
      el = buildMediaCutout(resolveAsset, child, "me", "scene-about__me");
    } else if (child.kind === "macbook") {
      el = buildMacbook(content, resolveAsset, child);
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
    collapsedChildren[child.kind] = {
      x: child.x,
      y: child.y,
      width: child.width,
      height: child.height,
      rotation: Number.isFinite(child.rotation) ? Number(child.rotation) : 0,
    };
    root.appendChild(el);
  }

  // Snapshot for expand/collapse morph (Figma 201:19914).
  root.dataset.aboutCollapsed = JSON.stringify({
    cluster: {
      x: Number(node.x) || 0,
      y: Number(node.y) || 0,
      width: Number(node.width) || 0,
      height: Number(node.height) || 0,
    },
    children: collapsedChildren,
  });

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
          : "card.image",
        node.id
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
