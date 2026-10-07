/**
 * Home Hint panel: ≥1024, once per user, mouse/trackpad tab.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const HINT_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "hintPanel.js")
).href;

/**
 * @param {string} relativePath
 * @returns {string}
 */
function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

/**
 * Minimal DOM for buildHintPanel / bindHintPanel.
 * @returns {{ document: object, viewport: object }}
 */
function createDom() {
  /**
   * @param {string} tagName
   */
  function createElement(tagName) {
    const children = [];
    const attrs = new Map();
    const classSet = new Set();
    const listeners = new Map();
    const dataset = {};
    let classNameValue = "";
    let textValue = "";

    const el = {
      tagName: String(tagName).toUpperCase(),
      children,
      style: {},
      dataset,
      parentNode: null,
      nodeType: 1,
      clientWidth: 0,
      clientHeight: 0,
      get textContent() {
        if (children.length === 0) {
          return textValue;
        }
        return children.map((c) => c.textContent || "").join("");
      },
      set textContent(value) {
        textValue = String(value);
        children.length = 0;
      },
      get className() {
        return classNameValue;
      },
      set className(value) {
        classNameValue = String(value);
        classSet.clear();
        for (const part of classNameValue.split(/\s+/).filter(Boolean)) {
          classSet.add(part);
        }
      },
      classList: {
        contains(name) {
          return classSet.has(name);
        },
        add(name) {
          classSet.add(name);
          classNameValue = [...classSet].join(" ");
        },
      },
      setAttribute(name, value) {
        attrs.set(String(name), String(value));
        if (name === "class") {
          el.className = String(value);
        }
        if (String(name).startsWith("data-")) {
          const key = String(name)
            .slice(5)
            .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          dataset[key] = String(value);
        }
      },
      getAttribute(name) {
        if (name === "class") {
          return classNameValue || null;
        }
        return attrs.has(String(name)) ? attrs.get(String(name)) : null;
      },
      addEventListener(type, fn) {
        const list = listeners.get(type) || [];
        list.push(fn);
        listeners.set(type, list);
      },
      appendChild(child) {
        child.parentNode = el;
        children.push(child);
        return child;
      },
      append(...nodes) {
        for (const n of nodes) {
          el.appendChild(n);
        }
      },
      removeChild(child) {
        const idx = children.indexOf(child);
        if (idx >= 0) {
          children.splice(idx, 1);
        }
        child.parentNode = null;
        return child;
      },
      remove() {
        if (el.parentNode && typeof el.parentNode.removeChild === "function") {
          el.parentNode.removeChild(el);
        }
      },
      closest(selector) {
        let node = el;
        while (node) {
          if (matchOne(node, selector)) {
            return node;
          }
          node = node.parentNode;
        }
        return null;
      },
      querySelector(selector) {
        const all = [];
        walk(el, selector, all);
        return all[0] || null;
      },
      querySelectorAll(selector) {
        const all = [];
        walk(el, selector, all);
        return all;
      },
    };

    Object.defineProperty(el, "src", {
      get() {
        return attrs.get("src") || "";
      },
      set(v) {
        attrs.set("src", String(v));
      },
    });
    Object.defineProperty(el, "alt", {
      get() {
        return attrs.get("alt") || "";
      },
      set(v) {
        attrs.set("alt", String(v));
      },
    });
    Object.defineProperty(el, "type", {
      get() {
        return attrs.get("type") || "";
      },
      set(v) {
        attrs.set("type", String(v));
      },
    });
    Object.defineProperty(el, "width", {
      get() {
        return Number(attrs.get("width") || 0);
      },
      set(v) {
        attrs.set("width", String(v));
      },
    });
    Object.defineProperty(el, "height", {
      get() {
        return Number(attrs.get("height") || 0);
      },
      set(v) {
        attrs.set("height", String(v));
      },
    });

    return el;
  }

  /**
   * @param {object} node
   * @param {string} selector
   * @param {object[]} out
   */
  function walk(node, selector, out) {
    for (const child of node.children || []) {
      if (child.nodeType === 3) {
        continue;
      }
      if (matchOne(child, selector)) {
        out.push(child);
      }
      walk(child, selector, out);
    }
  }

  /**
   * @param {object} el
   * @param {string} sel
   */
  function matchOne(el, sel) {
    if (!el || el.nodeType === 3 || !el.classList) {
      return false;
    }
    if (sel.startsWith(".")) {
      return el.classList.contains(sel.slice(1));
    }
    if (sel.startsWith("[") && sel.endsWith("]")) {
      const inner = sel.slice(1, -1);
      const eq = inner.indexOf("=");
      if (eq > 0) {
        const key = inner.slice(0, eq);
        const val = inner.slice(eq + 1).replace(/^["']|["']$/g, "");
        return el.getAttribute(key) === val;
      }
      return el.getAttribute(inner) != null;
    }
    return el.tagName === String(sel).toUpperCase();
  }

  const document = {
    createElement,
    createTextNode(value) {
      return { nodeType: 3, textContent: String(value), parentNode: null };
    },
  };

  const viewport = createElement("div");
  viewport.className = "viewport";
  viewport.clientWidth = 1366;
  viewport.clientHeight = 768;

  return { document, viewport };
}

describe("hint panel on home", () => {
  it("detects Mac as trackpad and Windows as mouse", async () => {
    const { detectHintDevice } = await import(HINT_URL);
    assert.equal(
      detectHintDevice({
        platform: "MacIntel",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        maxTouchPoints: 0,
      }),
      "trackpad"
    );
    assert.equal(
      detectHintDevice({
        platform: "Win32",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        maxTouchPoints: 0,
      }),
      "mouse"
    );
    assert.equal(
      detectHintDevice({
        platform: "MacIntel",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        maxTouchPoints: 5,
      }),
      "trackpad"
    );
  });

  it("builds mouse and trackpad variants from content", async () => {
    const { buildHintPanel } = await import(HINT_URL);
    const { document } = createDom();
    const mouse = buildHintPanel("mouse", {
      doc: document,
      resolveAsset: (key) => `/${key}.svg`,
    });
    assert.equal(mouse.dataset.variant, "mouse");
    assert.match(mouse.textContent, /Ctrl/);
    assert.match(mouse.textContent, /Space/);

    const pad = buildHintPanel("trackpad", {
      doc: document,
      resolveAsset: (key) => `/${key}.svg`,
    });
    assert.equal(pad.dataset.variant, "trackpad");
    assert.match(pad.textContent, /двумя пальцами/);
  });

  it("mounts once on wide viewport and writes localStorage", async () => {
    const { bindHintPanel, HINT_PANEL_STORAGE_KEY } = await import(HINT_URL);
    const { document, viewport } = createDom();
    const mem = {};
    const storage = {
      getItem: (k) => (k in mem ? mem[k] : null),
      setItem: (k, v) => {
        mem[k] = String(v);
      },
    };
    bindHintPanel(viewport, {
      doc: document,
      storage,
      navigator: { platform: "Win32", userAgent: "Windows" },
      getWidth: () => 1366,
      resolveAsset: (key) => `/${key}.svg`,
    });
    assert.equal(viewport.children.length, 1);
    assert.equal(viewport.children[0].className, "scene-hint-panel");
    assert.equal(mem[HINT_PANEL_STORAGE_KEY], "1");
    const panel = viewport.children[0].querySelector(".ds-hint-panel");
    assert.equal(panel.dataset.variant, "mouse");

    bindHintPanel(viewport, {
      doc: document,
      storage,
      navigator: { platform: "Win32", userAgent: "Windows" },
      getWidth: () => 1366,
      resolveAsset: (key) => `/${key}.svg`,
    });
    assert.equal(viewport.children.length, 1, "already-seen session keeps the panel");
  });

  it("does not mount below 1024 or when already seen", async () => {
    const { bindHintPanel, HINT_PANEL_STORAGE_KEY } = await import(HINT_URL);
    const { document, viewport } = createDom();
    viewport.clientWidth = 768;
    const empty = {};
    bindHintPanel(viewport, {
      doc: document,
      storage: {
        getItem: (k) => (k in empty ? empty[k] : null),
        setItem: (k, v) => {
          empty[k] = String(v);
        },
      },
      getWidth: () => 768,
      resolveAsset: (key) => `/${key}.svg`,
    });
    assert.equal(viewport.children.length, 0);
    assert.equal(empty[HINT_PANEL_STORAGE_KEY], undefined);

    const { document: doc2, viewport: wide } = createDom();
    bindHintPanel(wide, {
      doc: doc2,
      storage: {
        getItem: (k) => (k === HINT_PANEL_STORAGE_KEY ? "1" : null),
        setItem() {},
      },
      getWidth: () => 1366,
      resolveAsset: (key) => `/${key}.svg`,
    });
    assert.equal(wide.children.length, 0);
  });

  it("wires CSS inset and hides below 1024; main.js binds the panel", () => {
    const css = read("portfolio/css/portfolio.css");
    assert.match(css, /\.scene-hint-panel[\s\S]*right:\s*24px/);
    assert.match(css, /\.scene-hint-panel[\s\S]*bottom:\s*24px/);
    assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*\.scene-hint-panel/);
    const mainSrc = read("portfolio/js/main.js");
    assert.match(mainSrc, /bindHintPanel/);
  });
});
