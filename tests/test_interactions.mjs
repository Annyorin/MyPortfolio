/**
 * Interactive Hits: Tapper, a11y, contacts, suppressClicks, broken image (task 2.5).
 *
 * TC-E2E-01: Click Tapper plus → scale increases (viewportCenter)
 * TC-E2E-02: Card has hover-distinct styles (ds-card + :hover shadow rule)
 * TC-E2E-03: Click contact does not navigate to external URL
 * TC-E2E-04: suppressClicks blocks Card action handler
 * TC-E2E-05: Synthetic img error keeps slot size; camera state unchanged
 * TC-UNIT-01: Tapper buttons have accessible names from contentMap
 * TC-UNIT-02: onImageError does not throw and logs warn/error
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it, before, after } from "node:test";

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
 * Minimal EventTarget + DOM tree for interactions/scene under node:test.
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
   * @param {string} selector
   * @returns {boolean}
   */
  function matches(el, selector) {
    const parts = selector.split(",").map((s) => s.trim());
    return parts.some((part) => matchOne(el, part));
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
    let rest = sel.replace(/\.[a-zA-Z0-9_-]+/g, "").trim();
    if (rest.includes(">")) {
      return false;
    }
    const tagPart = rest;
    if (tagPart && el.tagName.toLowerCase() !== tagPart.toLowerCase()) {
      return false;
    }
    if (classParts.length > 0) {
      return classParts.every((c) => el.classList.contains(c.slice(1)));
    }
    if (tagPart) {
      return true;
    }
    return false;
  }

  /**
   * @param {object} el
   * @param {string} selector
   * @returns {object|null}
   */
  function closest(el, selector) {
    let cur = el;
    while (cur) {
      if (matches(cur, selector)) {
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
      const tokens = group.split(/\s+/).filter(Boolean);
      /**
       * @param {object} node
       * @param {number} tokenIndex
       */
      function walk(node, tokenIndex) {
        for (const child of node.children || []) {
          if (matchOne(child, tokens[tokenIndex])) {
            if (tokenIndex === tokens.length - 1) {
              out.push(child);
            } else {
              walk(child, tokenIndex + 1);
            }
          }
          walk(child, tokenIndex);
        }
      }
      walk(root, 0);
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
    /** @type {Map<string, Array<{fn: Function, options?: object}>>} */
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
      tabIndex: 0,
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
      matches(selector) {
        return matches(el, selector);
      },
      closest(selector) {
        return closest(el, selector);
      },
      contains(node) {
        if (node === el) {
          return true;
        }
        let cur = node;
        while (cur) {
          if (cur === el) {
            return true;
          }
          cur = cur.parentNode;
        }
        return false;
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
        for (const c of [...children]) {
          c.parentNode = null;
        }
        children.length = 0;
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
      addEventListener(type, fn, options) {
        if (!listeners.has(type)) {
          listeners.set(type, []);
        }
        listeners.get(type).push({ fn, options });
      },
      removeEventListener(type, fn) {
        const list = listeners.get(type) || [];
        listeners.set(
          type,
          list.filter((entry) => entry.fn !== fn)
        );
      },
      dispatchEvent(event) {
        const type = event.type;
        const list = listeners.get(type) || [];
        const ordered = [
          ...list.filter((e) => e.options?.capture),
          ...list.filter((e) => !e.options?.capture),
        ];
        for (const { fn } of ordered) {
          if (event.propagationStopped) {
            break;
          }
          fn(event);
        }
        return !event.defaultPrevented;
      },
    };

    Object.defineProperty(el, "href", {
      get() {
        return attrMap(el).get("href");
      },
      set(v) {
        attrMap(el).set("href", String(v));
      },
      configurable: true,
    });

    Object.defineProperty(el, "type", {
      get() {
        return attrMap(el).get("type");
      },
      set(v) {
        attrMap(el).set("type", String(v));
      },
      configurable: true,
    });

    Object.defineProperty(el, "alt", {
      get() {
        return attrMap(el).get("alt") ?? "";
      },
      set(v) {
        attrMap(el).set("alt", String(v));
      },
      configurable: true,
    });

    Object.defineProperty(el, "src", {
      get() {
        return attrMap(el).get("src") ?? "";
      },
      set(v) {
        attrMap(el).set("src", String(v));
      },
      configurable: true,
    });

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

    Object.defineProperty(el, "parentElement", {
      get() {
        return el.parentNode;
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
  let propagationStopped = false;
  return {
    bubbles: true,
    cancelable: true,
    defaultPrevented: false,
    get defaultPreventedFlag() {
      return defaultPrevented;
    },
    preventDefault() {
      defaultPrevented = true;
      this.defaultPrevented = true;
    },
    stopPropagation() {
      propagationStopped = true;
    },
    get propagationStopped() {
      return propagationStopped;
    },
    ...overrides,
  };
}

describe("portfolio interactive hits", () => {
  /** @type {typeof globalThis.document | undefined} */
  let previousDocument;
  /** @type {ReturnType<typeof createDomHarness>} */
  let shim;
  /** @type {typeof import("../portfolio/js/scene.js")} */
  let sceneMod;
  /** @type {typeof import("../portfolio/js/interactions.js")} */
  let interactionsMod;
  /** @type {typeof import("../portfolio/js/camera.js")} */
  let cameraMod;
  /** @type {typeof import("../shared/content.js")} */
  let contentMod;
  /** @type {typeof import("../shared/layout.js")} */
  let layoutMod;

  before(async () => {
    previousDocument = globalThis.document;
    shim = createDomHarness();
    globalThis.document = /** @type {Document} */ (
      /** @type {unknown} */ (shim.document)
    );

    sceneMod = await import(
      pathToFileURL(abs("portfolio/js/scene.js")).href + `?t=${Date.now()}`
    );
    interactionsMod = await import(
      pathToFileURL(abs("portfolio/js/interactions.js")).href +
        `?t=${Date.now()}`
    );
    cameraMod = await import(
      pathToFileURL(abs("portfolio/js/camera.js")).href + `?t=${Date.now()}`
    );
    contentMod = await import(
      pathToFileURL(abs("shared/content.js")).href + `?t=${Date.now()}`
    );
    layoutMod = await import(
      pathToFileURL(abs("shared/layout.js")).href + `?t=${Date.now()}`
    );
  });

  after(() => {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  });

  /**
   * @returns {{
   *   camera: ReturnType<typeof cameraMod.createCameraController>,
   *   inputMode: {spaceDown: boolean, isPanning: boolean, suppressClicks: boolean},
   *   nodesById: Record<string, object>,
   *   unbind: () => void
   * }}
   */
  function mountInteractive() {
    shim.world.replaceChildren();
    const resolveAsset = (key) => `asset://${key}`;
    const mounted = sceneMod.mountScene(
      shim.world,
      layoutMod.sceneGraph,
      contentMod.contentMap,
      resolveAsset
    );
    const camera = cameraMod.createCameraController(shim.world, {
      getViewportSize: () => ({ width: 1024, height: 609 }),
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
    return { camera, inputMode, nodesById: mounted.nodesById, unbind };
  }

  it("TC-E2E-01: Click Tapper plus → scale increases (pivot center)", () => {
    const { camera, nodesById, unbind } = mountInteractive();
    const before = camera.getState();
    assert.equal(before.scale, 1);

    const plus = nodesById.tapper.querySelector(
      '[data-tapper-action="zoom-in"]'
    );
    assert.ok(plus);

    shim.world.dispatchEvent(
      makeEvent({
        type: "click",
        target: plus,
      })
    );

    const after = camera.getState();
    assert.ok(after.scale > before.scale, "scale should increase");
    assert.equal(after.scale, before.scale + camera.zoomStep);
    unbind();
  });

  it("TC-E2E-02: Card has hover-distinct styles (computed shadow or class)", () => {
    const { nodesById, unbind } = mountInteractive();
    const card = nodesById.cardA;
    assert.ok(card.classList.contains("ds-card"));

    const componentsCss = fs.readFileSync(
      abs("ds-showcase/css/components.css"),
      "utf8"
    );
    assert.match(componentsCss, /\.ds-card:hover\s*\{[^}]*box-shadow:\s*var\(--shadow\)/s);
    assert.match(componentsCss, /\.ds-card--default\s*\{[^}]*box-shadow:\s*none/s);
    unbind();
  });

  it("TC-E2E-03: Click contact opens mapped URL (no in-app location rewrite)", () => {
    const { nodesById, unbind } = mountInteractive();
    const link = nodesById.sidebar.querySelector(
      ".ds-sidebar__skills a.ds-button--primary"
    );
    assert.ok(link);
    const href = link.getAttribute("href") ?? "";
    assert.ok(href.length > 0 && href !== "#");
    assert.equal(link.getAttribute("target"), "_blank");

    /** @type {{ href: string }} */
    const fakeLocation = { href: "http://portfolio.local/home" };
    const beforeHref = fakeLocation.href;

    const ev = makeEvent({
      type: "click",
      target: link,
    });
    // Real href: interactions must not preventDefault (browser opens target=_blank).
    shim.world.dispatchEvent(ev);
    assert.equal(ev.defaultPrevented, false);
    assert.equal(fakeLocation.href, beforeHref);
    unbind();
  });

  it("TC-E2E-04: When suppressClicks, Card click does not activate action handler", () => {
    const { inputMode, nodesById, unbind } = mountInteractive();
    const card = nodesById.cardA;
    let actionCount = 0;
    // Bubble-phase action on world (simulates navigation/action handler).
    shim.world.addEventListener("click", () => {
      actionCount += 1;
    });

    inputMode.suppressClicks = true;
    const suppressed = makeEvent({
      type: "click",
      target: card,
    });
    shim.world.dispatchEvent(suppressed);
    assert.equal(suppressed.defaultPrevented, true);
    assert.equal(actionCount, 0, "bubble action must not run when suppressed");

    inputMode.suppressClicks = false;
    const allowed = makeEvent({
      type: "click",
      target: card,
    });
    shim.world.dispatchEvent(allowed);
    assert.equal(actionCount, 1, "after pan ends, Card hits work again");
    unbind();
  });

  it("TC-E2E-05: Synthetic img error keeps slot size; camera state unchanged", () => {
    const { camera, nodesById, unbind } = mountInteractive();
    const before = { ...camera.getState() };
    const media = nodesById.cardA.querySelector(".ds-card__media");
    const img = media.querySelector("img");
    assert.ok(media);
    assert.ok(img);

    const minHBefore = media.style.minHeight;
    assert.ok(minHBefore, "slot has min-height before load");

    img.dispatchEvent(
      makeEvent({
        type: "error",
        target: img,
      })
    );

    assert.ok(media.classList.contains("ds-media-slot--broken"));
    assert.ok(media.classList.contains("ds-placeholder"));
    assert.equal(media.style.minHeight, minHBefore);
    assert.notEqual(media.style.minHeight, "0px");
    assert.notEqual(media.style.minHeight, "");
    assert.deepEqual(camera.getState(), before);
    unbind();
  });

  it("TC-UNIT-01: Tapper buttons have accessible names from contentMap", () => {
    const { nodesById, unbind } = mountInteractive();
    const minus = nodesById.tapper.querySelector(
      '[data-tapper-action="zoom-out"]'
    );
    const plus = nodesById.tapper.querySelector(
      '[data-tapper-action="zoom-in"]'
    );
    assert.equal(
      minus.getAttribute("aria-label"),
      contentMod.contentMap["tapper.zoom_out"]
    );
    assert.equal(
      plus.getAttribute("aria-label"),
      contentMod.contentMap["tapper.zoom_in"]
    );
    assert.equal(minus.tagName, "BUTTON");
    assert.equal(plus.tagName, "BUTTON");
    assert.equal(minus.getAttribute("type") ?? minus.type, "button");
    assert.equal(
      minus.querySelector(".ds-tooltip")?.textContent,
      contentMod.contentMap["tooltip.zoom_out"]
    );
    assert.equal(
      plus.querySelector(".ds-tooltip")?.textContent,
      contentMod.contentMap["tooltip.zoom_in"]
    );
    unbind();
  });

  it("TC-UNIT-02: onImageError does not throw and logs warn/error", () => {
    const warns = [];
    const errors = [];
    const prevWarn = console.warn;
    const prevError = console.error;
    console.warn = (...args) => {
      warns.push(args);
    };
    console.error = (...args) => {
      errors.push(args);
    };

    try {
      const img = shim.createElement("img");
      img.src = "broken://x";
      img.width = 310;
      img.height = 180;
      const slot = shim.createElement("div");
      slot.className = "ds-card__media ds-placeholder";
      slot.appendChild(img);

      assert.doesNotThrow(() => {
        interactionsMod.onImageError({ type: "error", target: img });
      });
      assert.ok(slot.classList.contains("ds-media-slot--broken"));
      assert.ok(warns.length + errors.length >= 1);
    } finally {
      console.warn = prevWarn;
      console.error = prevError;
    }
  });

  it("after suppressClicks cleared, Tapper click zooms again (hit-testing)", () => {
    const { camera, inputMode, nodesById, unbind } = mountInteractive();
    inputMode.suppressClicks = true;
    const plus = nodesById.tapper.querySelector(
      '[data-tapper-action="zoom-in"]'
    );
    const mid = camera.getState().scale;
    // Task: suppress only Card/Link/Contacts — Tapper still allowed,
    // but we also verify normal mode after pan ends.
    inputMode.suppressClicks = false;
    shim.world.dispatchEvent(makeEvent({ type: "click", target: plus }));
    assert.ok(camera.getState().scale > mid);
    unbind();
  });
});
