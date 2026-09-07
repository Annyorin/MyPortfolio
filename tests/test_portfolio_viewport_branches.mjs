/**
 * Portfolio viewport start branches + no-mock entry smoke (task 3.2 / UC-02 A2).
 *
 * TC-E2E-05: wide ≥1024 → stage-fit 51:4107; narrow → fit; pan/zoom still work
 * No-mock: real portfolio entry over Vite (portfolio:dev) HTTP 200
 */

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it, before, after } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const REF_W = 1024;
const REF_H = 609;

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
 * @returns {{ document: object, world: object, viewport: object }}
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

  const viewport = createElement("div");
  viewport.className = "viewport";
  viewport.clientWidth = width;
  viewport.clientHeight = height;

  const world = createElement("div");
  world.className = "world";
  world.id = "world";
  viewport.appendChild(world);

  const document = {
    createElement,
    querySelector(selector) {
      const parts = selector.split(",").map((s) => s.trim());
      for (const part of parts) {
        if (matchOne(viewport, part)) {
          return viewport;
        }
        if (matchOne(world, part)) {
          return world;
        }
        const hit =
          queryAll(viewport, part)[0] || queryAll(world, part)[0] || null;
        if (hit) {
          return hit;
        }
      }
      return null;
    },
  };

  return { document, world, viewport };
}

/**
 * @param {string} url
 * @returns {Promise<{ status: number, body: string }>}
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 0,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      })
      .on("error", reject);
  });
}

/**
 * Starts Vite on a free port; returns base URL and kill fn.
 * @returns {Promise<{ baseUrl: string, stop: () => Promise<void> }>}
 */
async function startViteDev() {
  const port = 5173 + Math.floor(Math.random() * 200);
  const viteBin = path.join(
    REPO_ROOT,
    "node_modules",
    "vite",
    "bin",
    "vite.js"
  );
  const child = spawn(
    process.execPath,
    [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: REPO_ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none" },
      windowsHide: true,
    }
  );

  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (d) => {
    stdout += String(d);
  });
  child.stderr?.on("data", (d) => {
    stderr += String(d);
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 30000;

  /**
   * @returns {Promise<void>}
   */
  function stop() {
    return new Promise((resolve) => {
      if (child.exitCode != null) {
        resolve();
        return;
      }
      const done = () => resolve();
      child.once("exit", done);
      try {
        if (process.platform === "win32" && child.pid) {
          spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
            stdio: "ignore",
            windowsHide: true,
          }).once("exit", done);
        } else {
          child.kill("SIGTERM");
        }
      } catch {
        child.kill("SIGKILL");
      }
      setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {
          /* ignore */
        }
        resolve();
      }, 3000);
    });
  }

  while (Date.now() < deadline) {
    if (child.exitCode != null) {
      throw new Error(
        `vite exited early (${child.exitCode}): ${stderr || stdout}`
      );
    }
    try {
      const res = await httpGet(`${baseUrl}/portfolio/main.html`);
      if (res.status === 200) {
        return { baseUrl, stop };
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  await stop();
  throw new Error(`vite did not become ready: ${stderr || stdout}`);
}

describe("portfolio viewport branches + entry smoke", () => {
  /** @type {typeof globalThis.document | undefined} */
  let previousDocument;

  before(() => {
    previousDocument = globalThis.document;
  });

  after(() => {
    if (previousDocument === undefined) {
      // @ts-ignore
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  });

  it("TC-E2E-05: wide ≥1024 → stage-fit 51:4107; narrow start fit; pan/zoom available", async () => {
    const bust = `?t=${Date.now()}`;

    // Wide branch (≥1024): 51:4107 + interactive stage fit (not idle 1,0,0)
    const wide = createShell(REF_W, REF_H);
    globalThis.document = /** @type {any} */ (wide.document);
    const mainWide = await import(
      pathToFileURL(abs("portfolio/js/main.js")).href + bust + "&w=1"
    );
    const wideInit = mainWide.initPortfolioStubs();
    const wideState = wideInit.camera.getState();
    assert.ok(wideState.scale > 0);
    assert.ok(wideState.scale <= 1.05, "1024 stage scale near/below design");
    assert.ok(wideInit.scene);
    assert.equal(wide.world.children.length, 5);
    assert.equal(wideInit.layoutId, "51:4107");

    // 1366 artboard: larger stage → scale ≥ 1024 branch
    const wide1366 = createShell(1366, 768);
    globalThis.document = /** @type {any} */ (wide1366.document);
    const main1366 = await import(
      pathToFileURL(abs("portfolio/js/main.js")).href + bust + "&w1366=1"
    );
    const init1366 = main1366.initPortfolioStubs();
    assert.equal(init1366.layoutId, "51:4107");
    const state1366 = init1366.camera.getState();
    assert.ok(state1366.scale >= wideState.scale);
    assert.equal(
      Number.parseFloat(String(init1366.scene.nodesById.cardA.style.left)),
      475
    );
    assert.equal(init1366.scene.nodesById.sidebar.style.height, "auto");
    assert.equal(
      Number.parseFloat(String(init1366.scene.nodesById.sidebar.style.top)),
      24
    );
    assert.equal(
      Number.parseFloat(String(init1366.scene.nodesById.sidebar.style.bottom)),
      24
    );

    // Narrow branch
    const narrow = createShell(800, 500);
    globalThis.document = /** @type {any} */ (narrow.document);
    const mainNarrow = await import(
      pathToFileURL(abs("portfolio/js/main.js")).href + bust + "&n=1"
    );
    const narrowInit = mainNarrow.initPortfolioStubs();
    const narrowState = narrowInit.camera.getState();
    assert.ok(
      narrowState.scale < 1 ||
        narrowState.translateX !== 0 ||
        narrowState.translateY !== 0,
      "narrow start must reach fit (scale/translate changed)"
    );
    assert.ok(narrowState.scale > 0);
    assert.equal(narrowInit.layoutId, "41:1416");

    const afterPan = narrowInit.camera.panBy(20, -10);
    assert.ok(
      afterPan.translateX !== narrowState.translateX ||
        afterPan.translateY !== narrowState.translateY
    );
    const afterZoom = narrowInit.camera.zoomBy(0.1, "viewportCenter");
    assert.ok(afterZoom.scale > afterPan.scale);
  });

  it("no-mock entry: Vite serves portfolio/main.html (portfolio:dev)", async () => {
    const { baseUrl, stop } = await startViteDev();
    try {
      const html = await httpGet(`${baseUrl}/portfolio/main.html`);
      assert.equal(html.status, 200);
      assert.match(html.body, /class=["'][^"']*\bviewport\b/);
      assert.match(html.body, /id=["']world["']/);
      assert.match(html.body, /js\/main\.js/);

      const mainJs = await httpGet(`${baseUrl}/portfolio/js/main.js`);
      assert.equal(mainJs.status, 200);
      assert.match(mainJs.body, /initPortfolioStubs|mountScene/);

      const tokens = await httpGet(`${baseUrl}/ds-showcase/css/tokens.css`);
      assert.equal(tokens.status, 200);
    } finally {
      await stop();
    }
  });
});
