/**
 * About-me Macbook expand (Figma 201:19914).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ABOUT_EXPANDED_1024,
  ABOUT_EXPANDED_1366,
  getAboutExpandedLayout,
} from "../shared/layout.js";
import {
  ABOUT_EXPAND_MS,
  createAboutExpand,
} from "../portfolio/js/aboutExpand.js";

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
      macbook: {
        x: 85.23,
        y: 5,
        width: 140.61,
        height: 111.01,
        rotation: -10.44,
      },
      me: { x: 0, y: 18.2, width: 99.64, height: 99.64, rotation: 12.6 },
      stiker: { x: 24, y: 83.49, width: 82.98, height: 37.42, rotation: 3.89 },
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

describe("about expanded layout (Figma 201:19914)", () => {
  it("exports 570×415.57 Macbook composition for 1024 and 1366", () => {
    assert.equal(ABOUT_EXPANDED_1024.cluster.width, 570);
    assert.equal(ABOUT_EXPANDED_1024.cluster.height, 415.57);
    assert.equal(ABOUT_EXPANDED_1024.cluster.x, 384);
    assert.equal(ABOUT_EXPANDED_1024.cluster.y, 92);
    assert.equal(ABOUT_EXPANDED_1024.children.macbook.rotation, 0);
    assert.ok(ABOUT_EXPANDED_1366.cluster.x > ABOUT_EXPANDED_1024.cluster.x);
    assert.equal(getAboutExpandedLayout("51:4107"), ABOUT_EXPANDED_1366);
    assert.equal(getAboutExpandedLayout("41:1416"), ABOUT_EXPANDED_1024);
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
    assert.equal(about.style.width, "570px");
    assert.equal(about.style.height, "415.57px");
    assert.equal(about.style.left, "384px");
    assert.equal(byKind.get("macbook").style.width, "570px");
    assert.equal(byKind.get("macbook").style.height, "415.57px");
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
    assert.equal(byKind.get("macbook").style.width, "140.61px");
    assert.match(String(byKind.get("macbook").style.transform), /rotate\(10\.44deg\)/);
    for (const card of world._cards) {
      assert.equal(card.classList.contains("is-about-dimmed"), false);
    }

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
});
