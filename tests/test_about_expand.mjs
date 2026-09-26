/**
 * About-me Macbook expand (Figma 201:19914).
 */
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";
import {
  ABOUT_EXPANDED_1024,
  ABOUT_EXPANDED_1366,
  buildAboutExpandedLayout,
  getAboutExpandedLayout,
} from "../shared/layout.js";
import {
  ABOUT_EXPAND_MS,
  createAboutExpand,
} from "../portfolio/js/aboutExpand.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

/**
 * @param {string} relativePath
 * @returns {string}
 */
function abs(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

/**
 * Minimal DOM shim for about cluster + cards.
 */
function makeAboutDom() {
  /** @type {Map<string, any>} */
  const byKind = new Map();

  function el(tag, className, kind) {
    /** @type {Record<string, string>} */
    const style = {};
    /** @type {Set<string>} */
    const classes = new Set(String(className || "").split(/\s+/).filter(Boolean));
    const node = {
      tagName: String(tag).toUpperCase(),
      className,
      style,
      dataset: /** @type {Record<string, string>} */ ({}),
      children: /** @type {any[]} */ ([]),
      attributes: /** @type {Record<string, string>} */ ({}),
      classList: {
        add: (...xs) => xs.forEach((x) => classes.add(x)),
        remove: (...xs) => xs.forEach((x) => classes.delete(x)),
        contains: (x) => classes.has(x),
        toggle: (x, force) => {
          if (force === true) classes.add(x);
          else if (force === false) classes.delete(x);
          else if (classes.has(x)) classes.delete(x);
          else classes.add(x);
          return classes.has(x);
        },
      },
      setAttribute(k, v) {
        this.attributes[k] = String(v);
      },
      getAttribute(k) {
        return this.attributes[k] ?? null;
      },
      removeAttribute(k) {
        delete this.attributes[k];
      },
      appendChild(child) {
        this.children.push(child);
        return child;
      },
      querySelector(sel) {
        const m = /data-node-kind=['"]([^'"]+)['"]/.exec(String(sel));
        if (m) {
          return byKind.get(m[1]) || null;
        }
        return null;
      },
      querySelectorAll(sel) {
        if (String(sel).includes("data-node-kind='card'")) {
          return this._cards || [];
        }
        return [];
      },
    };
    if (kind) {
      node.dataset.nodeKind = kind;
      byKind.set(kind, node);
    }
    return node;
  }

  const world = el("div", "world");
  world._cards = [el("article", "ds-card scene-node"), el("article", "ds-card scene-node")];
  for (const c of world._cards) {
    c.dataset.nodeKind = "card";
    c.className = "ds-card scene-node";
    world.appendChild(c);
  }

  const about = el("div", "scene-about-cluster", "about");
  about.dataset.nodeKind = "about";
  about.dataset.aboutCollapsed = JSON.stringify({
    cluster: { x: 763, y: 16, width: 209.61, height: 116.01 },
    children: {
      me: { x: 0, y: 10.2, width: 83.45, height: 83.45, rotation: 12.596 },
      macbook: {
        x: 84.98,
        y: 5,
        width: 126,
        height: 92,
        rotation: -10,
      },
      stiker: { x: 29, y: 78, width: 81, height: 32, rotation: 0 },
    },
  });
  for (const kind of ["macbook", "me", "stiker"]) {
    const child = el("div", `scene-about__item scene-about__${kind}`, kind);
    about.appendChild(child);
  }
  about.parentElement = world;
  world.appendChild(about);

  return { world, about, byKind };
}

describe("about expanded layout (Figma 201:19914 О себе)", () => {
  it("keeps Figma screen fraction and scales me/stiker with Macbook", () => {
    assert.equal(ABOUT_EXPANDED_1024.cluster.width, 581);
    assert.equal(ABOUT_EXPANDED_1024.cluster.height, 424);
    assert.equal(ABOUT_EXPANDED_1024.cluster.x, 375);
    assert.equal(ABOUT_EXPANDED_1024.cluster.y, 86);
    assert.ok(
      Math.abs(ABOUT_EXPANDED_1024.children.me.width - 83.446) < 0.01
    );
    assert.ok(
      Math.abs(ABOUT_EXPANDED_1024.children.stiker.width - 81) < 0.01
    );
    assert.ok(ABOUT_EXPANDED_1024.children.me.rotation > 0);
    assert.ok(ABOUT_EXPANDED_1024.children.stiker.rotation > 0);

    const s1366 =
      ABOUT_EXPANDED_1366.cluster.width / ABOUT_EXPANDED_1024.cluster.width;
    assert.ok(
      Math.abs(
        ABOUT_EXPANDED_1366.children.me.width -
          ABOUT_EXPANDED_1024.children.me.width * s1366
      ) < 0.05
    );
    assert.ok(
      Math.abs(
        ABOUT_EXPANDED_1366.children.stiker.width -
          ABOUT_EXPANDED_1024.children.stiker.width * s1366
      ) < 0.05
    );
    assert.equal(getAboutExpandedLayout("51:4107"), ABOUT_EXPANDED_1366);
    assert.equal(getAboutExpandedLayout("41:1416"), ABOUT_EXPANDED_1024);
  });

  it("buildAboutExpandedLayout scales me/stiker size with Macbook", () => {
    const a = buildAboutExpandedLayout(1024, 609);
    const b = buildAboutExpandedLayout(2048, 1218);
    const ratio = b.cluster.width / a.cluster.width;
    assert.ok(Math.abs(ratio - 2) < 0.01);
    assert.ok(
      Math.abs(b.children.me.width / a.children.me.width - ratio) < 0.01
    );
    assert.ok(
      Math.abs(b.children.stiker.height / a.children.stiker.height - ratio) <
        0.01
    );
  });
});

describe("createAboutExpand", () => {
  it("opens to expanded geom and dims cards; close restores collapsed", () => {
    const { world, about, byKind } = makeAboutDom();
    const ctrl = createAboutExpand({
      aboutEl: /** @type {any} */ (about),
      worldEl: /** @type {any} */ (world),
      layoutId: "41:1416",
    });

    assert.equal(ABOUT_EXPAND_MS, 720);
    assert.equal(ctrl.isExpanded(), false);

    // Force reduced-motion path via immediate apply (busy gate still works).
    const origMatch = globalThis.matchMedia;
    globalThis.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });
    try {
      ctrl.open();
    } finally {
      globalThis.matchMedia = origMatch;
    }

    assert.equal(ctrl.isExpanded(), true);
    const expectedW = ABOUT_EXPANDED_1024.cluster.width;
    const expectedH = ABOUT_EXPANDED_1024.cluster.height;
    assert.equal(about.style.width, `${expectedW}px`);
    assert.equal(about.style.height, `${expectedH}px`);
    assert.equal(about.style.left, `${ABOUT_EXPANDED_1024.cluster.x}px`);
    assert.equal(about.style.top, `${ABOUT_EXPANDED_1024.cluster.y}px`);
    assert.equal(byKind.get("macbook").style.width, `${expectedW}px`);
    assert.equal(byKind.get("macbook").style.height, `${expectedH}px`);
    assert.equal(byKind.get("macbook").style.transform, "none");
    assert.ok(about.classList.contains("is-about-open"));
    assert.equal(about.getAttribute("aria-expanded"), "true");
    for (const card of world._cards) {
      assert.ok(card.classList.contains("is-about-dimmed"));
    }

    globalThis.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });
    try {
      ctrl.close();
    } finally {
      globalThis.matchMedia = origMatch;
    }

    assert.equal(ctrl.isExpanded(), false);
    assert.equal(about.style.width, "209.61px");
    assert.equal(about.style.left, "763px");
    assert.equal(byKind.get("macbook").style.width, "126px");
    assert.match(String(byKind.get("macbook").style.transform), /rotate\(10deg\)/);
    for (const card of world._cards) {
      assert.equal(card.classList.contains("is-about-dimmed"), false);
    }

    ctrl.destroy();
  });

  it("restores home camera framing on close (wide viewport)", () => {
    const { world, about } = makeAboutDom();
    const viewport = { clientWidth: 1366, clientHeight: 768 };
    let fitStage = 0;
    let fitContent = 0;
    const camera = {
      getState: () => ({ scale: 1.4, translateX: -120, translateY: 40 }),
      panBy() {},
      apply() {},
      fitInteractiveStage() {
        fitStage += 1;
      },
      fitToContent() {
        fitContent += 1;
      },
    };
    const ctrl = createAboutExpand({
      aboutEl: /** @type {any} */ (about),
      worldEl: /** @type {any} */ (world),
      layoutId: "41:1416",
      viewportEl: /** @type {any} */ (viewport),
      camera,
    });
    const origMatch = globalThis.matchMedia;
    globalThis.matchMedia = () => ({
      matches: true,
      addListener() {},
      removeListener() {},
    });
    try {
      ctrl.open();
      ctrl.close();
    } finally {
      globalThis.matchMedia = origMatch;
    }
    assert.equal(fitStage, 1);
    assert.equal(fitContent, 0);
    ctrl.destroy();
  });

  it("scales me/stiker size with camera zoom compensation", () => {
    const { world, about, byKind } = makeAboutDom();
    const viewport = {
      clientWidth: 1024,
      clientHeight: 609,
    };
    const camera = {
      getState: () => ({ scale: 2, translateX: 0, translateY: 0 }),
      panBy() {},
      apply() {},
    };
    const ctrl = createAboutExpand({
      aboutEl: /** @type {any} */ (about),
      worldEl: /** @type {any} */ (world),
      layoutId: "41:1416",
      viewportEl: /** @type {any} */ (viewport),
      camera,
    });
    const origMatch = globalThis.matchMedia;
    globalThis.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });
    try {
      ctrl.open();
    } finally {
      globalThis.matchMedia = origMatch;
    }
    const macW = Number.parseFloat(byKind.get("macbook").style.width);
    const meW = Number.parseFloat(byKind.get("me").style.width);
    const ratio = meW / macW;
    const expected =
      ABOUT_EXPANDED_1024.children.me.width /
      ABOUT_EXPANDED_1024.cluster.width;
    assert.ok(Math.abs(ratio - expected) < 0.01, `me/macbook ratio ${ratio} vs ${expected}`);
    // Stiker keeps 81px box; visual scale tracks Macbook
    assert.equal(byKind.get("stiker").style.width, "81px");
    assert.match(String(byKind.get("stiker").style.transform), /scale\(/);
    ctrl.destroy();
  });

  it("toggle opens then closes", () => {
    const { world, about } = makeAboutDom();
    const ctrl = createAboutExpand({
      aboutEl: /** @type {any} */ (about),
      worldEl: /** @type {any} */ (world),
      layoutId: "41:1416",
    });
    const origMatch = globalThis.matchMedia;
    globalThis.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });
    try {
      ctrl.toggle();
      assert.equal(ctrl.isExpanded(), true);
      ctrl.toggle();
      assert.equal(ctrl.isExpanded(), false);
    } finally {
      globalThis.matchMedia = origMatch;
      ctrl.destroy();
    }
  });

  it("clears sticker inert when open and restores when closed", () => {
    const { world, about, byKind } = makeAboutDom();
    const stickers = {
      className: "scene-about__stickers",
      attributes: /** @type {Record<string, string>} */ ({ inert: "" }),
      children: [],
      setAttribute(k, v) {
        this.attributes[k] = String(v);
      },
      removeAttribute(k) {
        delete this.attributes[k];
      },
      hasAttribute(k) {
        return Object.hasOwn(this.attributes, k);
      },
      querySelectorAll() {
        return this.children;
      },
    };
    about.querySelector = (sel) => {
      if (String(sel).includes("scene-about__stickers")) {
        return stickers;
      }
      const m = /data-node-kind=['"]([^'"]+)['"]/.exec(String(sel));
      if (m) {
        return byKind.get(m[1]) || null;
      }
      return null;
    };

    const ctrl = createAboutExpand({
      aboutEl: /** @type {any} */ (about),
      worldEl: /** @type {any} */ (world),
      layoutId: "41:1416",
    });
    const origMatch = globalThis.matchMedia;
    globalThis.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });
    try {
      assert.equal(stickers.hasAttribute("inert"), true);
      ctrl.open();
      assert.equal(stickers.hasAttribute("inert"), false);
      ctrl.close();
      assert.equal(stickers.hasAttribute("inert"), true);
    } finally {
      globalThis.matchMedia = origMatch;
      ctrl.destroy();
    }
  });
});

describe("Macbook sticker content", () => {
  it("contentMap has Hint strings and layered Macbook asset keys", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href + `?t=${Date.now()}`
    );
    for (const id of ["create", "question", "sport", "anime", "seal", "books"]) {
      assert.equal(typeof contentMap[`hint.${id}`], "string");
      assert.ok(contentMap[`hint.${id}`].length > 0);
      assert.ok(contentMap.assets[`macbook.sticker.${id}`]?.pathFromDsRoot);
    }
    assert.equal(
      contentMap.assets["macbook.lid"]?.pathFromDsRoot,
      "images/macbook-lid.png"
    );
    assert.equal(
      contentMap.assets.macbook?.pathFromDsRoot,
      "images/macbook-png.png"
    );
    assert.equal(
      contentMap.assets["macbook.png"]?.pathFromDsRoot,
      "images/macbook-png.png"
    );
    assert.match(contentMap.assets.anime.pathFromDsRoot, /\.png$/);
  });
});
