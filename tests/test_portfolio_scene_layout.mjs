/**
 * Portfolio scene layout vs Scene Layout Config (task 3.2 / UC-02).
 *
 * TC-E2E-01: Viewport 1024×609 start {1,0,0}; slot positions vs layout ±4px;
 *            Sidebar/Card/Tapper sizes; about cluster + stiker inside.
 */

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it, before, after } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const TOLERANCE_PX = 4;

/**
 * @param {string} relativePath
 * @returns {string}
 */
function abs(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

/**
 * Minimal DOM shim for mountScene (inline styles / query).
 * @returns {{ document: object, world: object, viewport: object }}
 */
function createDomShim() {
  /** @type {WeakMap<object, Map<string, string>>} */
  const attrs = new WeakMap();

  /**
   * @param {object} el
   * @returns {Map<string, string>}
   */
  function attrMap(el) {
    let m = attrs.get(el);
    if (!m) {
      m = new Map();
      attrs.set(el, m);
    }
    return m;
  }

  /**
   * @param {object} el
   * @param {string} sel
   */
  function matchOne(el, sel) {
    if (sel.startsWith("#")) {
      return el.id === sel.slice(1);
    }
    if (sel.includes("[")) {
      const m = /^([a-z0-9]*)\[([^=\]]+)(?:=["']?([^"'\]]+)["']?)?\]$/i.exec(
        sel
      );
      if (!m) {
        return false;
      }
      const [, tag, attr, val] = m;
      if (tag && el.tagName.toLowerCase() !== tag.toLowerCase()) {
        return false;
      }
      const actual = el.getAttribute(attr);
      if (val === undefined) {
        return actual != null;
      }
      return actual === val;
    }
    const classParts = sel.match(/\.[a-zA-Z0-9_-]+/g) || [];
    const tagPart = sel.replace(/\.[a-zA-Z0-9_-]+/g, "").trim();
    if (tagPart && el.tagName.toLowerCase() !== tagPart.toLowerCase()) {
      return false;
    }
    if (classParts.length > 0) {
      return classParts.every((c) => el.classList.contains(c.slice(1)));
    }
    return Boolean(tagPart);
  }

  /**
   * @param {object} root
   * @param {string} selector
   * @returns {object[]}
   */
  function queryAll(root, selector) {
    const out = [];
    const parts = selector.split(",").map((s) => s.trim());
    for (const part of parts) {
      /**
       * @param {object} node
       */
      function walk(node) {
        for (const child of node.children || []) {
          if (matchOne(child, part)) {
            out.push(child);
          }
          walk(child);
        }
      }
      walk(root);
    }
    return out;
  }

  /**
   * @param {string} tagName
   */
  function createElement(tagName) {
    const children = [];
    /** @type {Record<string, string>} */
    const style = {};
    /** @type {Record<string, string>} */
    const dataset = {};
    const classSet = new Set();
    let classNameValue = "";
    let idValue = "";

    /**
     * @param {string} value
     */
    function setClassName(value) {
      classNameValue = String(value);
      classSet.clear();
      for (const part of classNameValue.split(/\s+/).filter(Boolean)) {
        classSet.add(part);
      }
    }

    const el = {
      tagName: String(tagName).toUpperCase(),
      children,
      childNodes: children,
      style,
      dataset,
      parentNode: null,
      textContent: "",
      clientWidth: 0,
      clientHeight: 0,
      get id() {
        return idValue;
      },
      set id(value) {
        idValue = String(value);
      },
      get className() {
        return classNameValue;
      },
      set className(value) {
        setClassName(value);
      },
      get classList() {
        return {
          add(...names) {
            for (const n of names) {
              classSet.add(n);
            }
            classNameValue = [...classSet].join(" ");
          },
          contains(name) {
            return classSet.has(name);
          },
        };
      },
      setAttribute(name, value) {
        attrMap(el).set(String(name), String(value));
        if (name === "class") {
          setClassName(String(value));
        }
        if (name === "id") {
          idValue = String(value);
        }
        if (name.startsWith("data-")) {
          const key = name
            .slice(5)
            .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          dataset[key] = String(value);
        }
      },
      getAttribute(name) {
        if (name === "class") {
          return classNameValue || null;
        }
        if (name === "id") {
          return idValue || null;
        }
        return attrMap(el).has(String(name))
          ? attrMap(el).get(String(name))
          : null;
      },
      appendChild(child) {
        if (child.parentNode) {
          const sibs = child.parentNode.children;
          const idx = sibs.indexOf(child);
          if (idx >= 0) {
            sibs.splice(idx, 1);
          }
        }
        child.parentNode = el;
        children.push(child);
        return child;
      },
      append(...nodes) {
        for (const n of nodes) {
          el.appendChild(n);
        }
      },
      replaceChildren(...nodes) {
        for (const c of children.splice(0, children.length)) {
          c.parentNode = null;
        }
        for (const n of nodes) {
          el.appendChild(n);
        }
      },
      querySelector(selector) {
        return queryAll(el, selector)[0] || null;
      },
      querySelectorAll(selector) {
        return queryAll(el, selector);
      },
    };

    Object.defineProperty(el, "width", {
      get() {
        return Number(attrMap(el).get("width") || 0);
      },
      set(v) {
        attrMap(el).set("width", String(v));
      },
      configurable: true,
    });
    Object.defineProperty(el, "height", {
      get() {
        return Number(attrMap(el).get("height") || 0);
      },
      set(v) {
        attrMap(el).set("height", String(v));
      },
      configurable: true,
    });

    return el;
  }

  const document = {
    createElement,
    querySelector(selector) {
      if (matchOne(viewport, selector) || matchOne(world, selector)) {
        if (matchOne(viewport, selector)) {
          return viewport;
        }
        return world;
      }
      return (
        queryAll(viewport, selector)[0] ||
        queryAll(world, selector)[0] ||
        null
      );
    },
  };

  const viewport = createElement("div");
  viewport.className = "viewport";
  viewport.clientWidth = 1024;
  viewport.clientHeight = 609;

  const world = createElement("div");
  world.className = "world";
  world.id = "world";
  viewport.appendChild(world);

  return { document, world, viewport };
}

/**
 * @param {string|number|undefined} px
 * @returns {number}
 */
function parsePx(px) {
  return Number.parseFloat(String(px ?? "0").replace("px", "")) || 0;
}

/**
 * @param {number} actual
 * @param {number} expected
 * @param {string} label
 */
function assertWithin(actual, expected, label) {
  assert.ok(
    Math.abs(actual - expected) <= TOLERANCE_PX,
    `${label}: expected ${expected}±${TOLERANCE_PX}, got ${actual}`
  );
}

describe("portfolio scene layout (UC-02)", () => {
  /** @type {typeof globalThis.document | undefined} */
  let previousDocument;
  /** @type {ReturnType<typeof createDomShim>} */
  let shim;
  /** @type {typeof import("../portfolio/js/scene.js")} */
  let sceneMod;
  /** @type {typeof import("../portfolio/js/camera.js")} */
  let cameraMod;
  /** @type {typeof import("../shared/content.js")} */
  let contentMod;
  /** @type {typeof import("../shared/layout.js")} */
  let layoutMod;
  /** @type {typeof import("../portfolio/js/resolveAsset.js")} */
  let resolveMod;

  before(async () => {
    previousDocument = globalThis.document;
    shim = createDomShim();
    globalThis.document = /** @type {any} */ (shim.document);

    const bust = `?t=${Date.now()}`;
    sceneMod = await import(
      pathToFileURL(abs("portfolio/js/scene.js")).href + bust
    );
    cameraMod = await import(
      pathToFileURL(abs("portfolio/js/camera.js")).href + bust
    );
    contentMod = await import(
      pathToFileURL(abs("shared/content.js")).href + bust
    );
    layoutMod = await import(
      pathToFileURL(abs("shared/layout.js")).href + bust
    );
    resolveMod = await import(
      pathToFileURL(abs("portfolio/js/resolveAsset.js")).href + bust
    );
  });

  after(() => {
    if (previousDocument === undefined) {
      // @ts-ignore
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  });

  it("TC-E2E-01: 1024×609 start {1,0,0}; slots vs layout ±4px; key sizes", () => {
    shim.world.replaceChildren();
    const mounted = sceneMod.mountScene(
      shim.world,
      layoutMod.sceneGraph,
      contentMod.contentMap,
      (key) => resolveMod.resolveAsset(key, { mode: "repo" })
    );
    assert.ok(mounted);

    const camera = cameraMod.createCameraController(shim.world, {
      getViewportSize: () => ({
        width: shim.viewport.clientWidth,
        height: shim.viewport.clientHeight,
      }),
      getContentAABB: () => mounted.contentAABB,
    });
    camera.apply();
    assert.deepEqual(camera.getState(), {
      scale: 1,
      translateX: 0,
      translateY: 0,
    });

    const byId = Object.fromEntries(
      layoutMod.nodes.map((n) => [n.id, n])
    );

    for (const node of layoutMod.nodes) {
      const el = mounted.nodesById[node.id];
      assert.ok(el, `missing node ${node.id}`);
      assertWithin(parsePx(el.style.left), node.x, `${node.id}.left`);
      assertWithin(parsePx(el.style.top), node.y, `${node.id}.top`);
      assertWithin(parsePx(el.style.width), node.width, `${node.id}.width`);
      assertWithin(parsePx(el.style.height), node.height, `${node.id}.height`);
    }

    assert.equal(parsePx(mounted.nodesById.sidebar.style.width), 310);
    // Without chromeEl, sidebar uses artboard height from layout.
    assert.equal(parsePx(mounted.nodesById.sidebar.style.height), 561);
    assert.equal(parsePx(mounted.nodesById.cardA.style.width), 310);
    assert.equal(parsePx(mounted.nodesById.cardA.style.height), 310);
    assert.equal(parsePx(mounted.nodesById.tapper.style.width), 40);
    assert.equal(parsePx(mounted.nodesById.tapper.style.height), 104);

    // About cluster: me/macbook/stiker children live inside the world about node.
    assertWithin(
      parsePx(mounted.nodesById.about.style.width),
      byId.about.width,
      "about.width scene bbox"
    );
    assertWithin(
      parsePx(mounted.nodesById.about.style.height),
      byId.about.height,
      "about.height scene bbox"
    );
    assert.ok(mounted.nodesById.about.className.includes("scene-about-cluster"));
    const stikerEl = mounted.nodesById.about.querySelector(
      '[data-node-id="stiker"], .ds-stiker'
    );
    assert.ok(stikerEl, "stiker must be inside about cluster");
    assert.ok(stikerEl.className.includes("ds-stiker"));
    assert.equal(mounted.nodesById.comp, undefined);
    assert.equal(mounted.nodesById.stiker, undefined);
  });

  it("TC-E2E-02: 1366×768 layout 51:4107 slots ±4px; sidebar stretch; tapper right chrome", () => {
    shim.viewport.clientWidth = 1366;
    shim.viewport.clientHeight = 768;
    shim.world.replaceChildren();
    for (const old of Array.from(
      shim.viewport.querySelectorAll(".scene-chrome")
    )) {
      if (typeof old.remove === "function") {
        old.remove();
      }
    }

    const layout = layoutMod.selectSceneLayout({
      width: 1366,
      height: 768,
    });
    assert.equal(layout.id, "51:4107");

    const mounted = sceneMod.mountScene(
      shim.world,
      layout,
      contentMod.contentMap,
      (key) => resolveMod.resolveAsset(key, { mode: "repo" }),
      { chromeEl: shim.viewport }
    );
    assert.ok(mounted);

    for (const node of layout.nodes) {
      const el = mounted.nodesById[node.id];
      assert.ok(el, `missing node ${node.id}`);
      if (node.kind === "sidebar" || node.kind === "tapper") {
        continue;
      }
      assertWithin(parsePx(el.style.left), node.x, `${node.id}.left`);
      assertWithin(parsePx(el.style.top), node.y, `${node.id}.top`);
      assertWithin(parsePx(el.style.width), node.width, `${node.id}.width`);
      assertWithin(parsePx(el.style.height), node.height, `${node.id}.height`);
    }

    assert.equal(parsePx(mounted.nodesById.sidebar.style.width), 310);
    assert.equal(parsePx(mounted.nodesById.sidebar.style.top), 24);
    assert.equal(parsePx(mounted.nodesById.sidebar.style.bottom), 24);
    assert.equal(mounted.nodesById.sidebar.style.height, "auto");
    assert.equal(parsePx(mounted.nodesById.cardA.style.left), 475);
    assert.equal(parsePx(mounted.nodesById.cardB.style.left), 907);
    assert.equal(parsePx(mounted.nodesById.cardC.style.left), 565);
    assert.equal(parsePx(mounted.nodesById.about.style.left), 1081);
    assert.equal(mounted.nodesById.tapper.parentNode, shim.viewport);
    assert.equal(mounted.nodesById.about.parentNode, shim.world);
    assert.equal(mounted.nodesById.sidebar.parentNode, shim.viewport);
    assert.equal(mounted.nodesById.tapper.style.left, "auto");
    assert.equal(mounted.nodesById.tapper.style.right, "24px");
    assert.equal(mounted.nodesById.tapper.style.top, "50%");
    assert.equal(parsePx(mounted.nodesById.tapper.style.width), 40);
    assert.equal(parsePx(mounted.nodesById.tapper.style.height), 104);
    assert.ok(mounted.nodesById.tapper.className.includes("scene-chrome"));
    assert.ok(
      mounted.nodesById.tapper.className.includes("ds-tapper--portrait")
    );
  });
});
