/**
 * Portfolio camera E2E: gestures via public API + world children identity (task 3.2).
 *
 * TC-E2E-02: Zoom/pan change only world transform; children identity stable
 * TC-E2E-03: Ctrl/Cmd+wheel pivot = cursor; keyboard/Tapper pivot = center
 * TC-E2E-04: Zoom 100% keeps world center; fit fits AABB
 * Plus: Tapper click zoom
 */

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it, before, after } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const VIEWPORT = Object.freeze({ width: 1024, height: 609 });
const FLOAT_EPS = 1e-6;

/**
 * @param {string} relativePath
 * @returns {string}
 */
function abs(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

/**
 * @returns {{ document: object, world: object, createElement: Function }}
 */
function createDomHarness() {
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
   * @param {object} el
   * @param {string} selector
   * @returns {object|null}
   */
  function closest(el, selector) {
    let cur = el;
    while (cur) {
      const parts = selector.split(",").map((s) => s.trim());
      if (parts.some((p) => matchOne(cur, p))) {
        return cur;
      }
      cur = cur.parentNode;
    }
    return null;
  }

  /**
   * @param {object} root
   * @param {string} selector
   * @returns {object[]}
   */
  function queryAll(root, selector) {
    const out = [];
    const groups = selector.split(",").map((s) => s.trim());
    for (const group of groups) {
      /**
       * @param {object} node
       */
      function walk(node) {
        for (const child of node.children || []) {
          if (matchOne(child, group)) {
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
    /** @type {Map<string, Function[]>} */
    const listeners = new Map();

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
      matches(selector) {
        return selector.split(",").some((s) => matchOne(el, s.trim()));
      },
      closest(selector) {
        return closest(el, selector);
      },
      addEventListener(type, fn) {
        const list = listeners.get(type) || [];
        list.push(fn);
        listeners.set(type, list);
      },
      removeEventListener(type, fn) {
        const list = listeners.get(type) || [];
        listeners.set(
          type,
          list.filter((f) => f !== fn)
        );
      },
      dispatchEvent(event) {
        const list = [...(listeners.get(event.type) || [])];
        for (const fn of list) {
          fn(event);
        }
        return !event.defaultPrevented;
      },
      contains(node) {
        let cur = node;
        while (cur) {
          if (cur === el) {
            return true;
          }
          cur = cur.parentNode;
        }
        return false;
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

  const document = { createElement };
  const world = createElement("div");
  world.className = "world";
  world.id = "world";
  return { document, world, createElement };
}

/**
 * @param {Partial<Event> & {type: string, target?: object}} overrides
 */
function makeEvent(overrides) {
  let defaultPrevented = false;
  return {
    bubbles: true,
    cancelable: true,
    defaultPrevented: false,
    preventDefault() {
      defaultPrevented = true;
      this.defaultPrevented = true;
    },
    stopPropagation() {},
    ...overrides,
    get defaultPreventedFlag() {
      return defaultPrevented;
    },
  };
}

/**
 * @param {{ scale: number, translateX: number, translateY: number }} state
 */
function viewportCenterWorld(state) {
  return {
    x: (VIEWPORT.width / 2 - state.translateX) / state.scale,
    y: (VIEWPORT.height / 2 - state.translateY) / state.scale,
  };
}

describe("portfolio camera e2e (UC-03/04)", () => {
  /** @type {typeof globalThis.document | undefined} */
  let previousDocument;
  /** @type {ReturnType<typeof createDomHarness>} */
  let shim;
  /** @type {typeof import("../portfolio/js/scene.js")} */
  let sceneMod;
  /** @type {typeof import("../portfolio/js/camera.js")} */
  let cameraMod;
  /** @type {typeof import("../portfolio/js/interactions.js")} */
  let interactionsMod;
  /** @type {typeof import("../shared/content.js")} */
  let contentMod;
  /** @type {typeof import("../shared/layout.js")} */
  let layoutMod;

  before(async () => {
    previousDocument = globalThis.document;
    shim = createDomHarness();
    globalThis.document = /** @type {any} */ (shim.document);
    const bust = `?t=${Date.now()}`;
    sceneMod = await import(
      pathToFileURL(abs("portfolio/js/scene.js")).href + bust
    );
    cameraMod = await import(
      pathToFileURL(abs("portfolio/js/camera.js")).href + bust
    );
    interactionsMod = await import(
      pathToFileURL(abs("portfolio/js/interactions.js")).href + bust
    );
    contentMod = await import(
      pathToFileURL(abs("shared/content.js")).href + bust
    );
    layoutMod = await import(
      pathToFileURL(abs("shared/layout.js")).href + bust
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

  /**
   * @returns {{
   *   camera: ReturnType<typeof cameraMod.createCameraController>,
   *   nodesById: Record<string, object>,
   *   beforeChildren: object[],
   *   childLeftTop: Array<{ id: string, left: string, top: string }>,
   *   unbind: () => void
   * }}
   */
  function mountSceneCamera() {
    shim.world.replaceChildren();
    const mounted = sceneMod.mountScene(
      shim.world,
      layoutMod.sceneGraph,
      contentMod.contentMap,
      (key) => `asset://${key}`
    );
    assert.ok(mounted);
    const camera = cameraMod.createCameraController(shim.world, {
      getViewportSize: () => ({ ...VIEWPORT }),
      getContentAABB: () => mounted.contentAABB,
    });
    const inputMode = {
      spaceDown: false,
      isPanning: false,
      suppressClicks: false,
    };
    const unbind = interactionsMod.bindInteractions(
      shim.world,
      camera,
      inputMode
    );
    const beforeChildren = [...shim.world.children];
    const childLeftTop = beforeChildren.map((c) => ({
      id: c.dataset.nodeId,
      left: c.style.left,
      top: c.style.top,
    }));
    return {
      camera,
      nodesById: mounted.nodesById,
      beforeChildren,
      childLeftTop,
      unbind,
    };
  }

  it("TC-E2E-02: zoom/pan change only world transform; children identity stable", () => {
    const { camera, beforeChildren, childLeftTop, unbind } = mountSceneCamera();
    const beforeTransform = shim.world.style.transform;

    camera.zoomBy(0.2, "viewportCenter");
    camera.panBy(-30, 20);

    assert.notEqual(shim.world.style.transform, beforeTransform);
    assert.match(
      shim.world.style.transform,
      /^translate\(.+\) scale\(.+\)$/
    );
    assert.equal(shim.world.children.length, beforeChildren.length);
    for (let i = 0; i < beforeChildren.length; i += 1) {
      assert.equal(shim.world.children[i], beforeChildren[i]);
      assert.equal(shim.world.children[i].style.left, childLeftTop[i].left);
      assert.equal(shim.world.children[i].style.top, childLeftTop[i].top);
    }
    unbind();
  });

  it("TC-E2E-03: cursor pivot vs center pivot (API state); Tapper uses center", () => {
    const { camera, nodesById, unbind } = mountSceneCamera();

    const cursor = { x: 200, y: 150 };
    const worldUnderCursor = camera.screenToWorld(cursor.x, cursor.y);
    camera.zoomBy(0.1, cursor);
    const afterCursor = camera.screenToWorld(cursor.x, cursor.y);
    assert.ok(Math.abs(afterCursor.x - worldUnderCursor.x) < FLOAT_EPS);
    assert.ok(Math.abs(afterCursor.y - worldUnderCursor.y) < FLOAT_EPS);

    const beforeCenter = viewportCenterWorld(camera.getState());
    camera.zoomBy(0.1, "viewportCenter");
    const afterCenter = viewportCenterWorld(camera.getState());
    assert.ok(Math.abs(afterCenter.x - beforeCenter.x) < FLOAT_EPS);
    assert.ok(Math.abs(afterCenter.y - beforeCenter.y) < FLOAT_EPS);

    const beforeTapper = viewportCenterWorld(camera.getState());
    const plus = nodesById.tapper.querySelector(
      '[data-tapper-action="zoom-in"]'
    );
    assert.ok(plus);
    const scaleBefore = camera.getState().scale;
    shim.world.dispatchEvent(makeEvent({ type: "click", target: plus }));
    assert.ok(camera.getState().scale > scaleBefore);
    const afterTapper = viewportCenterWorld(camera.getState());
    assert.ok(Math.abs(afterTapper.x - beforeTapper.x) < FLOAT_EPS);
    assert.ok(Math.abs(afterTapper.y - beforeTapper.y) < FLOAT_EPS);
    unbind();
  });

  it("TC-E2E-04: zoom 100% keeps world center; fitToContent fits AABB", () => {
    const { camera, unbind } = mountSceneCamera();
    camera.zoomBy(0.3, "viewportCenter");
    camera.panBy(-50, 40);
    const before = camera.getState();
    const center = viewportCenterWorld(before);

    camera.zoomTo(1, "keepWorldCenter");
    const after100 = camera.getState();
    assert.equal(after100.scale, 1);
    const screen = camera.worldToScreen(center.x, center.y);
    assert.ok(Math.abs(screen.x - VIEWPORT.width / 2) < FLOAT_EPS);
    assert.ok(Math.abs(screen.y - VIEWPORT.height / 2) < FLOAT_EPS);

    const fit = camera.fitToContent(24);
    const aabb = layoutMod.computeContentAABB(layoutMod.nodes);
    const aabbW = aabb.maxX - aabb.minX;
    const aabbH = aabb.maxY - aabb.minY;
    const expectedScale = Math.min(
      (VIEWPORT.width - 48) / aabbW,
      (VIEWPORT.height - 48) / aabbH
    );
    assert.ok(Math.abs(fit.scale - expectedScale) < 1e-9);
    const fittedCenter = {
      x: (aabb.minX + aabb.maxX) / 2,
      y: (aabb.minY + aabb.maxY) / 2,
    };
    const fittedScreen = camera.worldToScreen(fittedCenter.x, fittedCenter.y);
    assert.ok(Math.abs(fittedScreen.x - VIEWPORT.width / 2) < FLOAT_EPS);
    assert.ok(Math.abs(fittedScreen.y - VIEWPORT.height / 2) < FLOAT_EPS);
    unbind();
  });
});
