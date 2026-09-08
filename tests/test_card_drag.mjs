/**
 * Long-press card drag in world space.
 */
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it, before, after } from "node:test";
import {
  CARD_LONG_PRESS_MS,
  CARD_DRAG_MOVE_ARM_MS,
  CARD_PRESS_SLOP_PX,
} from "../portfolio/js/interactions.js";

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
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Minimal shell for card drag.
 */
function createShell() {
  /** @type {WeakMap<object, Map<string, string>>} */
  const attrs = new WeakMap();

  function attrMap(el) {
    let m = attrs.get(el);
    if (!m) {
      m = new Map();
      attrs.set(el, m);
    }
    return m;
  }

  function matchOne(el, sel) {
    if (sel.startsWith(".")) {
      return el.classList.contains(sel.slice(1));
    }
    if (sel.includes("[")) {
      const m = /^([a-z0-9]*)\[([^=\]]+)(?:=["']?([^"'\]]+)["']?)?\]$/i.exec(
        sel
      );
      if (!m) return false;
      const [, tag, attr, val] = m;
      if (tag && el.tagName.toLowerCase() !== tag.toLowerCase()) return false;
      const actual = el.getAttribute(attr);
      if (val === undefined) return actual != null;
      return actual === val;
    }
    return false;
  }

  function queryAll(root, selector) {
    const out = [];
    const parts = selector.split(",").map((s) => s.trim());
    for (const part of parts) {
      function walk(node) {
        for (const child of node.children || []) {
          if (matchOne(child, part)) out.push(child);
          walk(child);
        }
      }
      walk(root);
    }
    return out;
  }

  function createElement(tagName) {
    const children = [];
    const style = {};
    const dataset = {};
    const classSet = new Set();
    let classNameValue = "";
    /** @type {Map<string, Function[]>} */
    const listeners = new Map();

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
            for (const n of names) classSet.add(n);
            classNameValue = [...classSet].join(" ");
          },
          remove(...names) {
            for (const n of names) classSet.delete(n);
            classNameValue = [...classSet].join(" ");
          },
          contains(name) {
            return classSet.has(name);
          },
        };
      },
      setAttribute(name, value) {
        attrMap(el).set(String(name), String(value));
        if (name === "class") setClassName(String(value));
        if (name.startsWith("data-")) {
          const key = name
            .slice(5)
            .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          dataset[key] = String(value);
        }
      },
      getAttribute(name) {
        if (name === "class") return classNameValue || null;
        return attrMap(el).has(String(name))
          ? attrMap(el).get(String(name))
          : null;
      },
      appendChild(child) {
        child.parentNode = el;
        children.push(child);
        return child;
      },
      append(...nodes) {
        for (const n of nodes) el.appendChild(n);
      },
      replaceChildren(...nodes) {
        for (const c of children.splice(0, children.length)) {
          c.parentNode = null;
        }
        for (const n of nodes) el.appendChild(n);
      },
      querySelector(selector) {
        return queryAll(el, selector)[0] || null;
      },
      querySelectorAll(selector) {
        return queryAll(el, selector);
      },
      closest(selector) {
        let cur = el;
        const parts = selector.split(",").map((s) => s.trim());
        while (cur) {
          if (parts.some((p) => matchOne(cur, p))) return cur;
          cur = cur.parentNode;
        }
        return null;
      },
      contains(node) {
        let cur = node;
        while (cur) {
          if (cur === el) return true;
          cur = cur.parentNode;
        }
        return false;
      },
      addEventListener(type, fn) {
        const list = listeners.get(type) || [];
        list.push(fn);
        listeners.set(type, list);
      },
      removeEventListener(type, fn) {
        listeners.set(
          type,
          (listeners.get(type) || []).filter((f) => f !== fn)
        );
      },
      dispatchEvent(event) {
        let cur = el;
        while (cur) {
          for (const fn of [...(listeners.get(event.type) || [])]) {
            fn(event);
          }
          cur = cur.parentNode;
        }
        return true;
      },
      setPointerCapture() {},
    };
    return el;
  }

  const viewport = createElement("div");
  viewport.className = "viewport";
  const world = createElement("div");
  world.className = "world";
  world.id = "world";
  viewport.appendChild(world);

  const document = {
    createElement,
    querySelector(sel) {
      if (sel.includes("viewport") || sel === ".viewport") return viewport;
      if (sel.includes("world") || sel === "#world") return world;
      return queryAll(viewport, sel)[0] || null;
    },
  };

  return { document, viewport, world, createElement };
}

describe("card long-press drag", () => {
  /** @type {typeof globalThis.document | undefined} */
  let previousDocument;
  let interactionsMod;
  let sceneMod;
  let contentMod;
  let layoutMod;
  let resolveMod;
  let cameraMod;

  before(async () => {
    previousDocument = globalThis.document;
    const bust = `?t=${Date.now()}`;
    interactionsMod = await import(
      pathToFileURL(abs("portfolio/js/interactions.js")).href + bust
    );
    sceneMod = await import(
      pathToFileURL(abs("portfolio/js/scene.js")).href + bust
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
    cameraMod = await import(
      pathToFileURL(abs("portfolio/js/camera.js")).href + bust
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

  it("long-press arms grab; drag moves card in world px; exports timing constants", async () => {
    assert.ok(CARD_LONG_PRESS_MS >= 150);
    assert.equal(CARD_DRAG_MOVE_ARM_MS, 10);
    assert.ok(CARD_PRESS_SLOP_PX > 0);

    const shim = createShell();
    globalThis.document = /** @type {any} */ (shim.document);

    const mounted = sceneMod.mountScene(
      shim.world,
      layoutMod.sceneGraph,
      contentMod.contentMap,
      (key) => resolveMod.resolveAsset(key, { mode: "repo" }),
      { chromeEl: shim.viewport }
    );
    assert.ok(mounted);

    const camera = cameraMod.createCameraController(shim.world, {
      getViewportSize: () => ({ width: 1024, height: 609 }),
      getContentAABB: () => mounted.contentAABB,
    });
    const inputMode = {
      spaceDown: false,
      isPanning: false,
      suppressClicks: false,
      cardDragging: false,
    };
    const unbind = interactionsMod.bindInteractions(
      shim.viewport,
      camera,
      inputMode
    );

    const card = mounted.nodesById.cardA;
    const startLeft = Number.parseFloat(card.style.left);
    const startTop = Number.parseFloat(card.style.top);

    const pointerDown = {
      type: "pointerdown",
      button: 0,
      pointerId: 1,
      clientX: 100,
      clientY: 100,
      target: card,
      preventDefault() {},
      stopPropagation() {},
    };
    // Listeners are on viewport (bubble); dispatch there with card as target.
    shim.viewport.dispatchEvent(pointerDown);

    await delay(CARD_LONG_PRESS_MS + 80);
    assert.equal(inputMode.cardDragging, true, "cardDragging after long-press");
    assert.ok(card.classList.contains("is-card-grab"));
    assert.ok(card.classList.contains("is-card-dragging"));

    shim.viewport.dispatchEvent({
      type: "pointermove",
      pointerId: 1,
      clientX: 140,
      clientY: 120,
      target: card,
      preventDefault() {},
    });

    assert.equal(Number.parseFloat(card.style.left), startLeft + 40);
    assert.equal(Number.parseFloat(card.style.top), startTop + 20);

    shim.viewport.dispatchEvent({
      type: "pointerup",
      pointerId: 1,
      clientX: 140,
      clientY: 120,
      target: card,
      preventDefault() {},
    });
    assert.equal(inputMode.cardDragging, false);
    assert.equal(card.classList.contains("is-card-dragging"), false);

    unbind();
  });

  it("move past slop after 10ms arms drag without waiting full long-press", async () => {
    const shim = createShell();
    globalThis.document = /** @type {any} */ (shim.document);

    const mounted = sceneMod.mountScene(
      shim.world,
      layoutMod.sceneGraph,
      contentMod.contentMap,
      (key) => resolveMod.resolveAsset(key, { mode: "repo" }),
      { chromeEl: shim.viewport }
    );
    assert.ok(mounted);

    const camera = cameraMod.createCameraController(shim.world, {
      getViewportSize: () => ({ width: 1024, height: 609 }),
      getContentAABB: () => mounted.contentAABB,
    });
    const inputMode = {
      spaceDown: false,
      isPanning: false,
      suppressClicks: false,
      cardDragging: false,
    };
    const unbind = interactionsMod.bindInteractions(
      shim.viewport,
      camera,
      inputMode
    );

    const card = mounted.nodesById.cardA;
    const startLeft = Number.parseFloat(card.style.left);
    const startTop = Number.parseFloat(card.style.top);

    shim.viewport.dispatchEvent({
      type: "pointerdown",
      button: 0,
      pointerId: 2,
      clientX: 100,
      clientY: 100,
      target: card,
      preventDefault() {},
      stopPropagation() {},
    });

    await delay(CARD_DRAG_MOVE_ARM_MS + 5);
    assert.equal(inputMode.cardDragging, false, "not yet dragging before move");

    shim.viewport.dispatchEvent({
      type: "pointermove",
      pointerId: 2,
      clientX: 100 + CARD_PRESS_SLOP_PX + 12,
      clientY: 110,
      target: card,
      preventDefault() {},
    });

    assert.equal(inputMode.cardDragging, true, "drag arms on move after 10ms");
    assert.ok(card.classList.contains("is-card-dragging"));
    assert.equal(
      Number.parseFloat(card.style.left),
      startLeft + CARD_PRESS_SLOP_PX + 12
    );
    assert.equal(Number.parseFloat(card.style.top), startTop + 10);

    shim.viewport.dispatchEvent({
      type: "pointerup",
      pointerId: 2,
      clientX: 130,
      clientY: 110,
      target: card,
      preventDefault() {},
    });
    assert.equal(inputMode.cardDragging, false);

    unbind();
  });
});
