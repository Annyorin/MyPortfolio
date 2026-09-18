/**
 * Boot loader unit tests — ring layout, wave pulse, skip paths.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it, before, after } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const BOOT_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "bootLoader.js")
).href;
const RING_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "boot", "ringLayout.js")
).href;
const GRID_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "boot", "gridLayout.js")
).href;
const EASE_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "boot", "easing.js")
).href;

describe("portfolio boot loader", () => {
  /** @type {Storage|undefined} */
  let prevSession;

  before(() => {
    prevSession = globalThis.sessionStorage;
  });

  after(() => {
    if (prevSession) {
      globalThis.sessionStorage = prevSession;
    } else {
      delete globalThis.sessionStorage;
    }
    delete globalThis.document;
    delete globalThis.matchMedia;
  });

  it("buildRadialDots makes concentric rings around centre", async () => {
    const { buildRadialDots } = await import(`${BOOT_URL}?t=${Date.now()}`);
    const dots = buildRadialDots(400, 300, 220);
    assert.ok(dots.length > 100);
    const rings = new Set(dots.map((d) => d.ring));
    assert.ok(rings.size >= 8);
    for (const d of dots) {
      const dist = Math.hypot(d.x - 400, d.y - 300);
      assert.ok(dist > 50, "dots clear the badge hole");
    }
  });

  it("waveHeat peaks near the travelling wave and is low far away", async () => {
    const { waveHeat } = await import(`${RING_URL}?t=${Date.now() + 1}`);
    assert.ok(waveHeat(3, 3) > 0.9);
    assert.ok(waveHeat(0, 3) < waveHeat(3, 3));
    assert.ok(waveHeat(10, 3) < 0.2);
  });

  it("pulseFunction peaks at crest", async () => {
    const { pulseFunction } = await import(`${EASE_URL}?t=${Date.now() + 2}`);
    assert.ok(pulseFunction(0, 200) > 0.9);
    assert.ok(pulseFunction(200, 200) < 0.05);
  });

  it("assignNearestCells maps each seed to a unique cell", async () => {
    const { assignNearestCells } = await import(`${GRID_URL}?t=${Date.now() + 3}`);
    const seeds = [
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 10, y: 50 },
    ];
    const cells = [
      { x: 0, y: 0 },
      { x: 40, y: 0 },
      { x: 0, y: 40 },
      { x: 80, y: 80 },
    ];
    const map = assignNearestCells(seeds, cells);
    assert.equal(map.length, 3);
    const used = new Set(map.filter((x) => x != null));
    assert.equal(used.size, 3);
  });

  it("watchPortfolioAssets resolves empty root", async () => {
    const { watchPortfolioAssets } = await import(
      `${BOOT_URL}?t=${Date.now() + 4}`
    );
    const snap = await watchPortfolioAssets(null);
    assert.equal(snap.done, 1);
    assert.equal(snap.total, 1);
  });

  it("mountBootLoader no-ops without DOM root", async () => {
    const { mountBootLoader } = await import(`${BOOT_URL}?t=${Date.now() + 5}`);
    const api = mountBootLoader(null);
    assert.equal(typeof api.setProgress, "function");
    await api.whenFinished;
  });

  it("rings drop inner+outer and burst after 100%", async () => {
    const { BOOT_CONFIG } = await import(`${BOOT_URL}?cfg=${Date.now()}`);
    assert.equal(BOOT_CONFIG.ringCount, 10);
    assert.equal(BOOT_CONFIG.ringInnerPad, 32);
    assert.ok(BOOT_CONFIG.burstMs >= 600);
    assert.ok(BOOT_CONFIG.waveIntervalMs >= 2400);
    assert.ok(BOOT_CONFIG.slowPulseMinMs >= 1800);
    assert.equal(BOOT_CONFIG.slowLoadMs, 1000);
  });

  it("portfolio.css keeps scene painted under the overlay", () => {
    const css = fs.readFileSync(
      path.join(REPO_ROOT, "portfolio", "css", "portfolio.css"),
      "utf8"
    );
    assert.doesNotMatch(css, /@keyframes\s+boot-objects-in/);
    assert.match(css, /html\.is-booting \.boot-loader\.is-forming-grid/);
    assert.match(css, /html\.is-booting:not\(\.is-boot-slow\)/);
  });

  it("mountBootLoader skips when enter crossfade is set", async () => {
    const store = new Map();
    globalThis.sessionStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    };
    store.set("portfolio-page-enter", "crossfade");

    const { mountBootLoader } = await import(
      `${BOOT_URL}?crossfade=${Date.now()}`
    );
    const root = {
      hidden: false,
      classList: { add() {}, remove() {}, contains: () => false },
      setAttribute() {},
      removeAttribute() {},
      querySelector: () => null,
      prepend() {},
      appendChild() {},
      style: {},
      getBoundingClientRect: () => ({ width: 800, height: 600 }),
    };
    globalThis.document = {
      documentElement: { classList: { add() {}, remove() {} } },
      createElement: () => ({
        className: "",
        style: {},
        appendChild() {},
        getContext: () => null,
      }),
      fonts: { ready: Promise.resolve() },
    };

    const api = mountBootLoader(root);
    assert.equal(root.hidden, true);
    await api.whenFinished;
  });
});
