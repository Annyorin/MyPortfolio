/**
 * Boot demo page — scaffold + uniform-grid controller smoke.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DEMO_HTML = path.join(REPO_ROOT, "portfolio", "boot-demo.html");
const DEMO_JS = path.join(REPO_ROOT, "portfolio", "js", "bootDemo.js");
const PKG = path.join(REPO_ROOT, "package.json");
const DEMO_URL = pathToFileURL(DEMO_JS).href;
const GRID_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "boot", "gridLayout.js")
).href;

describe("portfolio boot demo", () => {
  it("boot-demo.html hosts canvas, badge, HUD, and mock cards", () => {
    const html = fs.readFileSync(DEMO_HTML, "utf8");
    assert.match(html, /id="boot-loader"/);
    assert.match(html, /boot-loader__canvas/);
    assert.match(html, /boot-loader__pct/);
    assert.match(html, /id="boot-demo-restart"/);
    assert.match(html, /id="boot-demo-stage"/);
    assert.match(html, /id="boot-demo-progress"/);
    assert.match(html, /data-mock-card/);
    assert.match(html, /js\/bootDemo\.js/);
  });

  it("package.json exposes portfolio:boot-demo script", () => {
    const pkg = JSON.parse(fs.readFileSync(PKG, "utf8"));
    assert.equal(
      pkg.scripts["portfolio:boot-demo"],
      "vite --open /portfolio/boot-demo.html"
    );
  });

  it("buildFullViewportGrid covers full resolution edge-to-edge", async () => {
    const { buildFullViewportGrid } = await import(
      `${DEMO_URL}?grid=${Date.now()}`
    );
    const { cells, cols, rows } = buildFullViewportGrid(1280, 720, 20);
    assert.equal(cells.length, cols * rows);
    assert.ok(cells.length > 1000);
    const xs = cells.map((c) => c.x);
    const ys = cells.map((c) => c.y);
    assert.ok(Math.min(...xs) > 0 && Math.max(...xs) < 1280);
    assert.ok(Math.min(...ys) > 0 && Math.max(...ys) < 720);
  });

  it("buildUniformGrid fills viewport with regular cells", async () => {
    const { buildUniformGrid } = await import(`${GRID_URL}?t=${Date.now()}`);
    const cells = buildUniformGrid(400, 300, 20);
    assert.ok(cells.length > 100);
    const xs = new Set(cells.map((c) => c.x));
    const ys = new Set(cells.map((c) => c.y));
    assert.ok(xs.size >= 10);
    assert.ok(ys.size >= 8);
  });

  it("mountBootDemo no-ops without canvas context", async () => {
    const { mountBootDemo } = await import(`${DEMO_URL}?t=${Date.now()}`);

    const canvas = {
      classList: {
        contains: (c) => c === "boot-loader__canvas",
        add() {},
        remove() {},
      },
      style: {},
      width: 0,
      height: 0,
      getContext: () => null,
    };
    const classSet = new Set(["boot-loader", "is-visible"]);
    /** @type {string[]} */
    const stages = [];
    let completed = false;
    const root = {
      hidden: false,
      classList: {
        add: (...c) => c.forEach((x) => classSet.add(x)),
        remove: (...c) => c.forEach((x) => classSet.delete(x)),
        contains: (c) => classSet.has(c),
      },
      style: {},
      setAttribute() {},
      removeAttribute() {},
      querySelector: (sel) => {
        if (sel === ".boot-loader__canvas") return canvas;
        if (sel === ".boot-loader__badge") return { querySelector: () => null };
        if (sel === ".boot-loader__pct") return { textContent: "0%" };
        return null;
      },
      prepend() {},
      appendChild() {},
      getBoundingClientRect: () => ({ width: 800, height: 600 }),
    };

    const api = mountBootDemo(root, {
      onStage: (s) => stages.push(s),
      onComplete: () => {
        completed = true;
      },
    });
    assert.equal(typeof api.restart, "function");
    assert.equal(typeof api.destroy, "function");
    assert.ok(stages.includes("done"));
    assert.equal(completed, true);
  });

  it("collectMockCardOccluders reads data-mock-card rects", async () => {
    const { collectMockCardOccluders } = await import(
      `${DEMO_URL}?occ=${Date.now()}`
    );
    assert.deepEqual(collectMockCardOccluders(null), []);
    const root = {
      querySelectorAll: () => [],
    };
    assert.deepEqual(collectMockCardOccluders(root), []);
  });
});
