/**
 * Scene Layout Config for Портфолио.Главная (architecture §3.2 / §4.1 SceneGraph).
 * World origin = top-left of the active Figma frame (41:1416 @1024 or 51:4107 @1366).
 */

/**
 * @typedef {Object} SceneChild
 * @property {string} id
 * @property {"me"|"macbook"|"stiker"} kind
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} [rotation]
 * @property {string[]} [contentKeys]
 * @property {string[]} [assetKeys]
 */

/**
 * @typedef {Object} SceneNode
 * @property {string} id
 * @property {"bg"|"sidebar"|"card"|"about"|"tapper"} kind
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} zIndex
 * @property {string[]} [contentKeys]
 * @property {string[]} [assetKeys]
 * @property {{ rotation?: number, matrix?: string, portrait?: boolean }} [sceneTransform]
 * @property {SceneChild[]} [children]
 */

/**
 * @typedef {Object} ContentAABB
 * @property {number} minX
 * @property {number} minY
 * @property {number} maxX
 * @property {number} maxY
 */

/**
 * @typedef {Object} SceneLayout
 * @property {string} id
 * @property {{ width: number, height: number }} frame
 * @property {SceneNode[]} nodes
 */

/** Kinds that form the key content AABB (canvas; BG expands). */
const KEY_CONTENT_KINDS = new Set(["card", "about"]);

/** Screen-fixed chrome — not scaled/panned with the world camera. */
export const FIXED_CHROME_KINDS = new Set(["sidebar", "tapper"]);

const SIDEBAR_CONTENT_KEYS = [
  "profile.name",
  "profile.role",
  "sidebar.bio",
  "chip.b2b",
  "chip.b2c",
  "chip.design_system",
  "chip.ai_prototyping",
  "contact.cv",
  "contact.telegram",
  "contact.linkedin",
  "contact.behance",
];

const CARD_CONTENT_KEYS = ["card.title", "card.meta", "card.description"];

/**
 * Figma 41:1416 «About me» (120:11877), origin = cluster top-left.
 * Paint order: Macbook (back) → me → Stiker (front).
 * x/y/w/h + rotation° from Plugin API (me 12.6°, macbook −10.44°, stiker 3.89°).
 * Scene applies CSS rotate(−θ) with origin top-left to match Figma relativeTransform.
 */
const ABOUT_CHILDREN_1024 = [
  {
    id: "macbook",
    kind: "macbook",
    x: 85.23,
    y: 5,
    width: 126.47,
    height: 89.57,
    rotation: -10.44,
    assetKeys: ["macbook"],
  },
  {
    id: "me",
    kind: "me",
    x: 0,
    y: 18.2,
    width: 83.45,
    height: 83.45,
    rotation: 12.6,
    assetKeys: ["me"],
  },
  {
    id: "stiker",
    kind: "stiker",
    x: 24,
    y: 83.49,
    width: 81,
    height: 32,
    rotation: 3.89,
    contentKeys: ["stiker.label"],
  },
];

/**
 * @param {Partial<SceneNode> & Pick<SceneNode, "id"|"kind"|"x"|"y"|"width"|"height"|"zIndex">} base
 * @returns {SceneNode}
 */
function node(base) {
  return { ...base };
}

/**
 * Shared non-positional fields; positions come from each artboard.
 * @param {{
 *   sidebarH: number,
 *   cardA: { x: number, y: number },
 *   cardB: { x: number, y: number },
 *   cardC: { x: number, y: number },
 *   about: { x: number, y: number, width: number, height: number },
 *   tapper: { x: number, y: number, width: number, height: number, portrait?: boolean },
 * }} geom
 * @returns {SceneNode[]}
 */
function buildNodes(geom) {
  return [
    node({
      id: "bg",
      kind: "bg",
      x: -48,
      y: -35,
      width: 1120,
      height: 680,
      zIndex: 0,
      assetKeys: ["img_bg"],
    }),
    node({
      id: "sidebar",
      kind: "sidebar",
      x: 24,
      y: 24,
      width: 310,
      height: geom.sidebarH,
      zIndex: 1,
      contentKeys: SIDEBAR_CONTENT_KEYS,
      assetKeys: ["avatar"],
    }),
    node({
      id: "cardA",
      kind: "card",
      x: geom.cardA.x,
      y: geom.cardA.y,
      width: 310,
      height: 310,
      zIndex: 2,
      contentKeys: CARD_CONTENT_KEYS,
      assetKeys: ["card.image.a"],
    }),
    node({
      id: "cardB",
      kind: "card",
      x: geom.cardB.x,
      y: geom.cardB.y,
      width: 310,
      height: 310,
      zIndex: 2,
      contentKeys: CARD_CONTENT_KEYS,
      assetKeys: ["card.image.b"],
    }),
    node({
      id: "cardC",
      kind: "card",
      x: geom.cardC.x,
      y: geom.cardC.y,
      width: 310,
      height: 310,
      zIndex: 2,
      contentKeys: CARD_CONTENT_KEYS,
      assetKeys: ["card.image.c"],
    }),
    node({
      id: "about",
      kind: "about",
      x: geom.about.x,
      y: geom.about.y,
      width: geom.about.width,
      height: geom.about.height,
      zIndex: 3,
      children: ABOUT_CHILDREN_1024,
    }),
    node({
      id: "tapper",
      kind: "tapper",
      x: geom.tapper.x,
      y: geom.tapper.y,
      width: geom.tapper.width,
      height: geom.tapper.height,
      zIndex: 5,
      contentKeys: ["tapper.zoom_out", "tapper.zoom_in"],
      assetKeys: ["icons.minus", "icons.plus"],
      sceneTransform: { portrait: Boolean(geom.tapper.portrait) },
    }),
  ];
}

/** Figma 41:1416 — Портфолио.Главная 1024×609 */
export const layout1024 = {
  id: "41:1416",
  frame: { width: 1024, height: 609 },
  nodes: buildNodes({
    sidebarH: 561,
    cardA: { x: 358, y: 28 },
    cardB: { x: 690, y: 169 },
    cardC: { x: 358, y: 362 },
    // About me frame 120:11877 on 41:1416
    about: { x: 763, y: 16, width: 209.61, height: 116.01 },
    // Portrait tapper: visual AABB after Figma 90° rotate of 104×40 @ (976,356)
    tapper: { x: 1008, y: 324, width: 40, height: 104, portrait: true },
  }),
};

/** Figma 51:4107 — Портфолио.Главная 1366×768 */
export const layout1366 = {
  id: "51:4107",
  frame: { width: 1366, height: 768 },
  nodes: buildNodes({
    sidebarH: 720,
    // Card triangle from Figma 51:4107 (top / right / bottom)
    cardA: { x: 475, y: 65 },
    cardB: { x: 907, y: 193 },
    cardC: { x: 565, y: 408 },
    about: { x: 1081, y: 39, width: 209.61, height: 116.01 },
    tapper: { x: 1302, y: 436, width: 40, height: 104, portrait: true },
  }),
};

/** Fixed chrome metrics shared with camera stage fit. */
export const STAGE_CHROME = Object.freeze({
  inset: 24,
  sidebarWidth: 310,
  tapperWidth: 40,
});

/**
 * Interactive right stage (viewport minus sidebar + edge/tapper insets).
 * Cards+about are scaled and centered here for viewports ≥1024 wide.
 *
 * @param {{ width: number, height: number }} viewport
 * @returns {{ left: number, top: number, width: number, height: number }}
 */
export function interactiveStageRect(viewport) {
  const vw = Number(viewport?.width) || 0;
  const vh = Number(viewport?.height) || 0;
  const { inset, sidebarWidth, tapperWidth } = STAGE_CHROME;
  const left = inset + sidebarWidth + inset;
  const right = Math.max(left + 1, vw - inset - tapperWidth);
  const top = inset;
  const bottom = Math.max(top + 1, vh - inset);
  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  };
}

/**
 * Picks artboard layout by viewport size.
 * ≥1024 wide → 51:4107 card arrangement; narrower → 41:1416 + fit-to-content.
 *
 * @param {{ width?: number, height?: number, clientWidth?: number, clientHeight?: number }|null|undefined} viewport
 * @returns {SceneLayout}
 */
export function selectSceneLayout(viewport) {
  const width = Number(
    viewport && (viewport.width ?? viewport.clientWidth)
  );
  if (Number.isFinite(width) && width >= layout1024.frame.width) {
    return layout1366;
  }
  return layout1024;
}

/**
 * Default scene graph = 1024 artboard (tests / Storybook / narrow start).
 * Paint order = ascending zIndex: BG → Sidebar → Card×3 → About → Tapper.
 */
export const sceneGraph = layout1024;

/** Convenience re-export of scene nodes (same array as sceneGraph.nodes). */
export const nodes = sceneGraph.nodes;

/**
 * Computes union AABB of key content (cards + about). Chrome and BG excluded.
 *
 * @param {SceneNode[]} nodeList
 * @returns {ContentAABB}
 */
export function computeContentAABB(nodeList) {
  const list = Array.isArray(nodeList) ? nodeList : [];
  const keyNodes = list.filter((n) => KEY_CONTENT_KINDS.has(n.kind));

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  /**
   * @param {SceneNode} n
   */
  function expand(n) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + n.width);
    maxY = Math.max(maxY, n.y + n.height);
  }

  for (const n of keyNodes) {
    expand(n);
  }

  if (!Number.isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  return { minX, minY, maxX, maxY };
}
