/**
 * Portfolio interactions E2E: contacts, suppressClicks, broken image, Tapper a11y (task 3.2 / UC-05).
 *
 * TC-E2E-06: Broken image — slot not collapsed; console warn path via spy
 * TC-E2E-07: Card hover distinct; contacts focusable; Space blocks click
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
      if (matchOne(cur, selector) || selector.split(",").some((s) => matchOne(cur, s.trim()))) {
        return cur;
      }
      // Multi-selector closest: try each part
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
    /** @type {Map<string, Array<{fn: Function, capture: boolean}>>} */
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
      tabIndex: -1,
      href: "",
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
        if (name === "href") {
          el.href = String(value);
        }
        if (name === "tabindex" || name === "tabIndex") {
          el.tabIndex = Number(value);
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
        if (name === "href") {
          return el.href || attrMap(el).get("href") || null;
        }
        return attrMap(el).has(String(name))
          ? attrMap(el).get(String(name))
          : null;
      },
      matches(selector) {
        return selector.split(",").some((s) => matchOne(el, s.trim()));
      },
      closest(selector) {
        return closest(el, selector);
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
      addEventListener(type, fn, opts) {
        const capture = Boolean(opts && opts.capture);
        const list = listeners.get(type) || [];
        list.push({ fn, capture });
        listeners.set(type, list);
      },
      removeEventListener(type, fn, opts) {
        const capture = Boolean(opts && opts.capture);
        const list = listeners.get(type) || [];
        listeners.set(
          type,
          list.filter((e) => !(e.fn === fn && e.capture === capture))
        );
      },
      dispatchEvent(event) {
        const list = listeners.get(event.type) || [];
        for (const { fn, capture } of list.filter((e) => e.capture)) {
          fn(event);
        }
        for (const { fn, capture } of list.filter((e) => !e.capture)) {
          if (event.propagationStopped) {
            break;
          }
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

describe("portfolio interactions e2e (UC-05 / UC-02 A1)", () => {
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
    globalThis.document = /** @type {any} */ (shim.document);
    const bust = `?t=${Date.now()}`;
    sceneMod = await import(
      pathToFileURL(abs("portfolio/js/scene.js")).href + bust
    );
    interactionsMod = await import(
      pathToFileURL(abs("portfolio/js/interactions.js")).href + bust
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
   *   inputMode: {spaceDown: boolean, isPanning: boolean, suppressClicks: boolean},
   *   nodesById: Record<string, object>,
   *   unbind: () => void
   * }}
   */
  function mountInteractive() {
    shim.world.replaceChildren();
    const mounted = sceneMod.mountScene(
      shim.world,
      layoutMod.sceneGraph,
      contentMod.contentMap,
      (key) => `asset://${key}`
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

  it("TC-E2E-06: broken image keeps slot geometry; console.warn spy covered", () => {
    const { camera, nodesById, unbind } = mountInteractive();
    const before = { ...camera.getState() };
    const media = nodesById.cardA.querySelector(".ds-card__media");
    const img = media.querySelector("img");
    assert.ok(media);
    assert.ok(img);
    const minHBefore = media.style.minHeight;
    assert.ok(minHBefore);

    const warns = [];
    const prevWarn = console.warn;
    console.warn = (...args) => {
      warns.push(args);
    };
    try {
      img.dispatchEvent(makeEvent({ type: "error", target: img }));
      assert.ok(media.classList.contains("ds-media-slot--broken"));
      assert.equal(media.style.minHeight, minHBefore);
      assert.notEqual(media.style.minHeight, "0px");
      assert.ok(warns.length >= 1);
      assert.match(String(warns[0].join(" ")), /media image failed|portfolio/i);
      assert.deepEqual(camera.getState(), before);
    } finally {
      console.warn = prevWarn;
    }
    unbind();
  });

  it("TC-E2E-07: Card hover distinct; contacts focusable with URLs; Space suppressClicks", () => {
    const { inputMode, nodesById, unbind } = mountInteractive();

    const card = nodesById.cardA;
    assert.ok(card.classList.contains("ds-card"));
    const componentsCss = fs.readFileSync(
      abs("ds-showcase/css/components.css"),
      "utf8"
    );
    assert.match(
      componentsCss,
      /\.ds-card:hover\s*\{[^}]*box-shadow:\s*var\(--shadow\)/s
    );

    const contacts = nodesById.sidebar.querySelectorAll(
      ".ds-sidebar__contacts a.ds-link"
    );
    assert.ok(contacts.length >= 4);
    for (const link of contacts) {
      const href = link.getAttribute("href") ?? "";
      assert.ok(href.length > 0 && href !== "#");
      assert.equal(link.getAttribute("target"), "_blank");
      assert.ok(
        Number(link.tabIndex) >= 0 || link.getAttribute("tabindex") === "0"
      );
    }

    const link = contacts[0];
    const contactEv = makeEvent({ type: "click", target: link });
    shim.world.dispatchEvent(contactEv);
    assert.equal(contactEv.defaultPrevented, false);

    let actionCount = 0;
    shim.world.addEventListener("click", () => {
      actionCount += 1;
    });
    inputMode.suppressClicks = true;
    const suppressed = makeEvent({ type: "click", target: card });
    shim.world.dispatchEvent(suppressed);
    assert.equal(suppressed.defaultPrevented, true);
    assert.equal(actionCount, 0);

    inputMode.suppressClicks = false;
    const allowed = makeEvent({ type: "click", target: card });
    shim.world.dispatchEvent(allowed);
    assert.equal(actionCount, 1);

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
    unbind();
  });
});
