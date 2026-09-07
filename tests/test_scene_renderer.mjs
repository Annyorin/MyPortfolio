/**
 * Portfolio Scene Renderer (task 2.2).
 *
 * TC-E2E-01: world has 3 cards, about, tapper, bg; chrome has sidebar
 * TC-E2E-02: slot geometry Sidebar stretch, Card 310×310, Tapper 40×104 portrait
 * TC-E2E-03: profile.role and card.title match contentMap
 * TC-E2E-04: three Cards share InnoDragon content
 * TC-UNIT-01: DOM child order follows ascending zIndex
 * TC-UNIT-02: contacts use href="#" or button without http URL
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
 * Minimal DOM shim so mountScene can run under node:test without jsdom.
 * @returns {{ document: Document, world: HTMLElement }}
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

    return el;
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
      const tokens = part.split(/\s+/).filter(Boolean);
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
   * @param {object} el
   * @param {string} cls
   */
  function hasClass(el, cls) {
    return (
      el.classList.contains(cls) ||
      String(el.className)
        .split(/\s+/)
        .includes(cls)
    );
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
      return classParts.every((c) => hasClass(el, c.slice(1)));
    }
    if (tagPart) {
      return true;
    }
    return false;
  }

  const document = {
    createElement,
  };

  const viewport = createElement("div");
  viewport.className = "viewport";

  const world = createElement("div");
  world.className = "world";
  world.id = "world";
  viewport.appendChild(world);

  return { document, world, viewport };
}

/**
 * @param {string} px
 * @returns {number}
 */
function parsePx(px) {
  return Number.parseFloat(String(px).replace("px", ""));
}

describe("portfolio scene renderer", () => {
  /** @type {typeof globalThis.document | undefined} */
  let previousDocument;
  /** @type {Awaited<ReturnType<typeof import("../portfolio/js/scene.js")>>} */
  let sceneMod;
  /** @type {Awaited<ReturnType<typeof import("../shared/content.js")>>} */
  let contentMod;
  /** @type {Awaited<ReturnType<typeof import("../shared/layout.js")>>} */
  let layoutMod;
  /** @type {Awaited<ReturnType<typeof import("../portfolio/js/resolveAsset.js")>>} */
  let resolveMod;
  /** @type {ReturnType<typeof createDomShim>} */
  let shim;

  before(async () => {
    previousDocument = globalThis.document;
    shim = createDomShim();
    globalThis.document = /** @type {any} */ (shim.document);

    sceneMod = await import(
      pathToFileURL(abs("portfolio/js/scene.js")).href + `?t=${Date.now()}`
    );
    contentMod = await import(pathToFileURL(abs("shared/content.js")).href);
    layoutMod = await import(pathToFileURL(abs("shared/layout.js")).href);
    resolveMod = await import(
      pathToFileURL(abs("portfolio/js/resolveAsset.js")).href
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
   * @returns {NonNullable<ReturnType<typeof sceneMod.mountScene>>}
   */
  function mountFresh() {
    shim.world.replaceChildren();
    for (const old of Array.from(
      shim.viewport.querySelectorAll(".scene-chrome")
    )) {
      old.remove();
    }
    const result = sceneMod.mountScene(
      shim.world,
      layoutMod.sceneGraph,
      contentMod.contentMap,
      (key) => resolveMod.resolveAsset(key, { mode: "repo" }),
      { chromeEl: shim.viewport }
    );
    assert.ok(result);
    return result;
  }

  it("TC-E2E-01: after mount world has canvas; chrome has sidebar+tapper", () => {
    const { nodesById } = mountFresh();
    assert.ok(nodesById.bg);
    assert.ok(nodesById.sidebar);
    assert.ok(nodesById.cardA);
    assert.ok(nodesById.cardB);
    assert.ok(nodesById.cardC);
    assert.ok(nodesById.about);
    assert.ok(nodesById.tapper);
    assert.equal(nodesById.comp, undefined);
    assert.equal(nodesById.stiker, undefined);

    assert.ok(nodesById.sidebar.className.includes("ds-sidebar"));
    assert.ok(nodesById.sidebar.className.includes("scene-chrome"));
    assert.ok(nodesById.cardA.className.includes("ds-card"));
    assert.ok(nodesById.about.className.includes("scene-about-cluster"));
    assert.ok(nodesById.tapper.className.includes("ds-tapper"));
    assert.ok(nodesById.tapper.className.includes("ds-tapper--portrait"));
    assert.ok(nodesById.tapper.className.includes("scene-chrome"));
    assert.ok(nodesById.about.querySelector(".ds-stiker"));
    assert.ok(nodesById.bg.className.includes("scene-bg"));
    assert.equal(shim.world.children.length, 5);
    assert.equal(nodesById.sidebar.parentNode, shim.viewport);
    assert.equal(nodesById.tapper.parentNode, shim.viewport);
    assert.equal(nodesById.about.parentNode, shim.world);
    assert.equal(nodesById.tapper.style.left, "auto");
    assert.equal(nodesById.tapper.style.right, "24px");
    assert.equal(nodesById.tapper.style.top, "50%");
  });

  it("TC-E2E-02: slot geometry Sidebar stretch chrome / Card 310×310 / Tapper 40×104", () => {
    const { nodesById } = mountFresh();
    assert.equal(parsePx(nodesById.sidebar.style.width), 310);
    assert.equal(parsePx(nodesById.sidebar.style.top), 24);
    assert.equal(parsePx(nodesById.sidebar.style.bottom), 24);
    assert.equal(nodesById.sidebar.style.height, "auto");
    assert.equal(parsePx(nodesById.cardA.style.width), 310);
    assert.equal(parsePx(nodesById.cardA.style.height), 310);
    assert.equal(parsePx(nodesById.cardB.style.width), 310);
    assert.equal(parsePx(nodesById.cardB.style.height), 310);
    assert.equal(parsePx(nodesById.cardC.style.width), 310);
    assert.equal(parsePx(nodesById.cardC.style.height), 310);
    assert.equal(parsePx(nodesById.about.style.width), 209.61);
    assert.equal(parsePx(nodesById.about.style.height), 116.01);
    assert.equal(parsePx(nodesById.tapper.style.width), 40);
    assert.equal(parsePx(nodesById.tapper.style.height), 104);

    // About me children: Figma θ → CSS rotate(-θ), origin top-left
    const about = nodesById.about;
    const items = about.children.filter((el) =>
      String(el.className).includes("scene-about__item")
    );
    const byId = Object.fromEntries(
      items.map((el) => [el.dataset.nodeId, el])
    );
    assert.ok(byId.me && byId.macbook && byId.stiker);
    assert.equal(parsePx(byId.me.style.left), 0);
    assert.equal(parsePx(byId.me.style.top), 18.2);
    assert.equal(byId.me.style.transform, "rotate(-12.6deg)");
    assert.equal(byId.me.style.transformOrigin, "0 0");
    assert.equal(parsePx(byId.macbook.style.left), 85.23);
    assert.equal(parsePx(byId.macbook.style.top), 5);
    assert.equal(byId.macbook.style.transform, "rotate(10.44deg)");
    assert.equal(parsePx(byId.stiker.style.left), 24);
    assert.equal(parsePx(byId.stiker.style.top), 83.49);
    assert.equal(byId.stiker.style.transform, "rotate(-3.89deg)");
  });

  it("TC-E2E-03: profile.role and card.title match contentMap", () => {
    const { nodesById } = mountFresh();
    const role = nodesById.sidebar.querySelector(".ds-profile__role");
    const title = nodesById.cardA.querySelector(".ds-card__title");
    assert.ok(role);
    assert.ok(title);
    assert.equal(role.textContent, contentMod.contentMap["profile.role"]);
    assert.equal(title.textContent, contentMod.contentMap["card.title"]);
  });

  it("TC-E2E-04: three Cards share InnoDragon copy with distinct cover assets", () => {
    const { nodesById } = mountFresh();
    const cards = [
      { el: nodesById.cardA, file: "img-1.png" },
      { el: nodesById.cardB, file: "img-2.png" },
      { el: nodesById.cardC, file: "img-3.png" },
    ];
    for (const { el: card, file } of cards) {
      assert.equal(
        card.querySelector(".ds-card__title")?.textContent,
        "InnoDragon"
      );
      assert.equal(
        card.querySelector(".ds-card__meta")?.textContent,
        contentMod.contentMap["card.meta"]
      );
      assert.equal(
        card.querySelector(".ds-card__description")?.textContent,
        contentMod.contentMap["card.description"]
      );
      const img = card.querySelector(".ds-card__media img");
      assert.ok(img);
      assert.match(String(img.src), new RegExp(file.replace(".", "\\.")));
      assert.equal(Number(img.height), 180);
    }
  });

  it("TC-UNIT-01: world DOM children order follows ascending zIndex (canvas only)", () => {
    mountFresh();
    const order = shim.world.children.map((el) => el.dataset.nodeId);
    assert.deepEqual(order, [
      "bg",
      "cardA",
      "cardB",
      "cardC",
      "about",
    ]);
    const z = shim.world.children.map((el) => Number(el.style.zIndex));
    for (let i = 1; i < z.length; i += 1) {
      assert.ok(z[i] >= z[i - 1], `zIndex non-decreasing at ${i}`);
    }
  });

  it('TC-UNIT-02: contacts use contactUrls (http(s) or assets) with target=_blank', () => {
    const { nodesById } = mountFresh();
    const links = nodesById.sidebar.querySelectorAll("a.ds-link");
    assert.equal(links.length, 4);
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      assert.ok(href.length > 0 && href !== "#");
      assert.ok(
        href.startsWith("http") || href.startsWith("assets/"),
        `unexpected href: ${href}`
      );
      assert.equal(link.getAttribute("target"), "_blank");
      assert.equal(link.getAttribute("rel"), "noopener noreferrer");
    }
  });

  it("mountScene returns contentAABB covering canvas slots (cards+about)", () => {
    const { contentAABB } = mountFresh();
    assert.ok(contentAABB.minX <= 358);
    assert.ok(contentAABB.minY <= 28);
    assert.ok(contentAABB.maxX >= 690 + 310);
    assert.ok(contentAABB.maxX >= 763 + 209.61);
    assert.ok(contentAABB.maxY >= 362 + 310);
  });

  it("camera.apply does not recreate scene DOM children", async () => {
    const { nodesById } = mountFresh();
    const before = [...shim.world.children];
    const { createCameraController } = await import(
      pathToFileURL(abs("portfolio/js/camera.js")).href
    );
    const camera = createCameraController(shim.world);
    camera.apply();
    camera.apply();
    assert.equal(shim.world.children.length, before.length);
    assert.equal(nodesById.sidebar.parentNode, shim.viewport);
    assert.equal(nodesById.cardA.parentNode, shim.world);
    assert.equal(nodesById.tapper.parentNode, shim.viewport);
    assert.equal(shim.world.children[0], before[0]);
  });
});
