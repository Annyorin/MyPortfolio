/**
 * Portfolio mobile document mode (Figma Портфолио.360 / 169:12080).
 *
 * At width 360: ProfileMobile sheet, 2 contacts, 3 distinct cards, FAB scroll.
 * At width ≥768: mobile sheet torn down; canvas scene present.
 */

import assert from "node:assert/strict";
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
 * @param {number} width
 * @param {number} height
 */
function createShell(width, height) {
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
    if (sel.startsWith(".")) {
      return el.classList.contains(sel.slice(1));
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
    let hiddenValue = false;
    let scrollTopValue = 0;
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
      clientWidth: 0,
      clientHeight: 0,
      get scrollTop() {
        return scrollTopValue;
      },
      set scrollTop(v) {
        scrollTopValue = Number(v) || 0;
      },
      scrollTo(opts) {
        if (opts && typeof opts === "object" && "top" in opts) {
          scrollTopValue = Number(opts.top) || 0;
        }
        for (const fn of [...(listeners.get("scroll") || [])]) {
          fn({ type: "scroll", target: el });
        }
      },
      get id() {
        return idValue;
      },
      set id(value) {
        idValue = String(value);
      },
      get hidden() {
        return hiddenValue;
      },
      set hidden(value) {
        hiddenValue = Boolean(value);
        if (hiddenValue) {
          attrMap(el).set("hidden", "");
        } else {
          attrMap(el).delete("hidden");
        }
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
          remove(...names) {
            for (const n of names) {
              classSet.delete(n);
            }
            classNameValue = [...classSet].join(" ");
          },
          toggle(name, force) {
            if (force === true) {
              classSet.add(name);
            } else if (force === false) {
              classSet.delete(name);
            } else if (classSet.has(name)) {
              classSet.delete(name);
            } else {
              classSet.add(name);
            }
            classNameValue = [...classSet].join(" ");
            return classSet.has(name);
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
        if (name === "hidden") {
          hiddenValue = true;
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
        if (name === "hidden") {
          return hiddenValue ? "" : null;
        }
        return attrMap(el).has(String(name))
          ? attrMap(el).get(String(name))
          : null;
      },
      removeAttribute(name) {
        attrMap(el).delete(String(name));
        if (name === "hidden") {
          hiddenValue = false;
        }
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
      remove() {
        if (!el.parentNode) {
          return;
        }
        const sibs = el.parentNode.children;
        const idx = sibs.indexOf(el);
        if (idx >= 0) {
          sibs.splice(idx, 1);
        }
        el.parentNode = null;
      },
      closest(selector) {
        let cur = el;
        while (cur) {
          if (matchOne(cur, selector)) {
            return cur;
          }
          cur = cur.parentNode;
        }
        return null;
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
      querySelector(selector) {
        return queryAll(el, selector)[0] || null;
      },
      querySelectorAll(selector) {
        return queryAll(el, selector);
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
        for (const fn of [...(listeners.get(event.type) || [])]) {
          fn(event);
        }
        return true;
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

  const body = createElement("body");
  const viewport = createElement("div");
  viewport.className = "viewport";
  viewport.clientWidth = width;
  viewport.clientHeight = height;

  const pan = createElement("div");
  pan.id = "camera-pan";
  pan.className = "camera-pan";

  const world = createElement("div");
  world.className = "world";
  world.id = "world";
  pan.appendChild(world);

  const mobile = createElement("div");
  mobile.id = "mobile-sheet";
  mobile.className = "portfolio-mobile-host";
  mobile.hidden = true;

  viewport.appendChild(pan);
  viewport.appendChild(mobile);
  body.appendChild(viewport);

  /** @type {Map<string, Function[]>} */
  const windowListeners = new Map();

  const document = {
    body,
    createElement,
    querySelector(selector) {
      const parts = selector.split(",").map((s) => s.trim());
      for (const part of parts) {
        if (part === "body" || part === "BODY") {
          return body;
        }
        if (matchOne(viewport, part)) {
          return viewport;
        }
        if (matchOne(pan, part)) {
          return pan;
        }
        if (matchOne(world, part)) {
          return world;
        }
        if (matchOne(mobile, part)) {
          return mobile;
        }
        const hit =
          queryAll(body, part)[0] ||
          queryAll(viewport, part)[0] ||
          null;
        if (hit) {
          return hit;
        }
      }
      return null;
    },
    querySelectorAll(selector) {
      return queryAll(body, selector);
    },
  };

  const windowObj = {
    addEventListener(type, fn) {
      const list = windowListeners.get(type) || [];
      list.push(fn);
      windowListeners.set(type, list);
    },
    removeEventListener(type, fn) {
      const list = windowListeners.get(type) || [];
      windowListeners.set(
        type,
        list.filter((f) => f !== fn)
      );
    },
    /**
     * @param {string} type
     */
    dispatch(type) {
      for (const fn of [...(windowListeners.get(type) || [])]) {
        fn({ type });
      }
    },
    open() {
      return null;
    },
  };

  return { document, body, viewport, pan, world, mobile, windowObj };
}

describe("portfolio mobile document mode", () => {
  /** @type {typeof globalThis.document | undefined} */
  let previousDocument;
  /** @type {typeof globalThis.window | undefined} */
  let previousWindow;

  before(() => {
    previousDocument = globalThis.document;
    previousWindow = globalThis.window;
  });

  after(() => {
    if (previousDocument === undefined) {
      // @ts-ignore
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
    if (previousWindow === undefined) {
      // @ts-ignore
      delete globalThis.window;
    } else {
      globalThis.window = previousWindow;
    }
  });

  it("width 360: ProfileMobile, 2 contacts, 3 distinct cards, FAB scroll", async () => {
    const bust = `?t=${Date.now()}&mobile=1`;
    const shell = createShell(360, 800);
    globalThis.document = /** @type {any} */ (shell.document);
    globalThis.window = /** @type {any} */ (shell.windowObj);

    const main = await import(
      pathToFileURL(abs("portfolio/js/main.js")).href + bust
    );
    const init = main.initPortfolioStubs();

    assert.equal(init.mode, "mobile");
    assert.equal(init.layoutId, null);
    assert.equal(init.scene, null);
    assert.ok(shell.viewport.classList.contains("portfolio--mobile"));
    assert.ok(shell.mobile.classList.contains("portfolio-mobile"));
    assert.equal(shell.mobile.hidden, false);

    const profile = shell.mobile.querySelector(".ds-profile--mobile");
    assert.ok(profile, "ProfileMobile present");
    const avatarBox = shell.mobile.querySelector(".ds-avatar");
    assert.ok(avatarBox);
    const avatar = avatarBox.querySelector("img");
    assert.ok(avatar);
    assert.equal(avatar.width, 48);

    const skills = shell.mobile.querySelector(".ds-sidebar__skills");
    assert.ok(skills);
    const buttons = skills.querySelectorAll(".ds-button");
    assert.equal(buttons.length, 2);
    assert.ok(buttons[0].classList.contains("ds-button--primary"));
    const labels = buttons.map(
      (b) => b.querySelector(".ds-button__label")?.textContent
    );
    assert.deepEqual(labels, ["Написать", "Резюме"]);
    assert.equal(shell.mobile.querySelector(".ds-sidebar__copyright"), null);

    const cards = shell.mobile.querySelectorAll(".ds-card");
    assert.equal(cards.length, 3);
    const titles = cards.map(
      (c) => c.querySelector(".ds-card__title")?.textContent
    );
    assert.deepEqual(titles, ["InnoDragon", "Innophish", "CityBike"]);
    const imgs = cards.map((c) => {
      const media = c.querySelector(".ds-card__media");
      return media?.querySelector("img")?.src || "";
    });
    assert.ok(imgs[0].includes("img-1"));
    assert.ok(imgs[1].includes("img-2"));
    assert.ok(imgs[2].includes("card-citybike"));
    assert.notEqual(imgs[0], imgs[1]);
    assert.notEqual(imgs[1], imgs[2]);

    assert.equal(cards[0].dataset.cardAction, "modal");
    assert.equal(cards[1].dataset.cardAction, "modal");
    assert.ok(String(cards[2].dataset.cardUrl || "").includes("behance.net"));

    const fab = shell.mobile.querySelector(".ds-fab");
    assert.ok(fab);
    assert.equal(fab.classList.contains("is-visible"), false);

    shell.viewport.scrollTop = 80;
    shell.viewport.dispatchEvent({ type: "scroll", target: shell.viewport });
    assert.equal(fab.classList.contains("is-visible"), true);

    fab.dispatchEvent({ type: "click", preventDefault() {} });
    assert.equal(shell.viewport.scrollTop, 0);
  });

  it("width ≥768: mobile sheet gone / canvas scene present", async () => {
    const bust = `?t=${Date.now()}&desktop=1`;
    const shell = createShell(1024, 609);
    globalThis.document = /** @type {any} */ (shell.document);
    globalThis.window = /** @type {any} */ (shell.windowObj);

    const main = await import(
      pathToFileURL(abs("portfolio/js/main.js")).href + bust
    );
    const init = main.initPortfolioStubs();

    assert.equal(init.mode, "canvas");
    assert.equal(init.layoutId, "51:4107");
    assert.ok(init.scene);
    assert.ok(init.camera);
    assert.equal(shell.viewport.classList.contains("portfolio--mobile"), false);
    assert.equal(shell.mobile.hidden, true);
    assert.equal(shell.mobile.querySelector(".ds-card"), null);
    assert.ok(shell.world.children.length >= 4);
  });

  it("resize 360→1024 tears down mobile and mounts canvas", async () => {
    const bust = `?t=${Date.now()}&resize=1`;
    const shell = createShell(360, 800);
    globalThis.document = /** @type {any} */ (shell.document);
    globalThis.window = /** @type {any} */ (shell.windowObj);

    const main = await import(
      pathToFileURL(abs("portfolio/js/main.js")).href + bust
    );
    const init = main.initPortfolioStubs();
    assert.equal(init.mode, "mobile");
    assert.ok(shell.mobile.querySelector(".ds-card"));

    shell.viewport.clientWidth = 1024;
    shell.viewport.clientHeight = 609;
    shell.windowObj.dispatch("resize");

    // Re-read via a fresh init return is stale; inspect DOM after resize handler.
    assert.equal(shell.viewport.classList.contains("portfolio--mobile"), false);
    assert.equal(shell.mobile.hidden, true);
    assert.equal(shell.mobile.querySelector(".ds-card"), null);
    assert.ok(shell.world.children.length >= 4);
  });
});
