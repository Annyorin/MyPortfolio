/**
 * Canvas scrollbars: mount, sync to pan extents, drag thumb pans camera.
 */

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it, before, after } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const SCROLLBARS_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "scrollbars.js")
).href;
const CAMERA_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "camera.js")
).href;

/**
 * Minimal DOM harness for bindCanvasScrollbars.
 */
function installDom() {
  /** @type {Map<Element, Record<string, Function[]>>} */
  const listeners = new Map();

  class FakeEl {
    constructor(tag = "div") {
      this.tagName = String(tag).toUpperCase();
      this.children = [];
      this.style = {};
      this._classSet = new Set();
      this.hidden = false;
      this.tabIndex = 0;
      this.type = "";
      this.parentNode = null;
      this.clientWidth = 1366;
      this.clientHeight = 768;
      this.offsetWidth = 40;
      this.offsetHeight = 40;
      /** @type {DOMRect} */
      this._rect = {
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 1366,
        bottom: 768,
        width: 1366,
        height: 768,
        toJSON() {
          return this;
        },
      };
      const self = this;
      this.classList = {
        add: (c) => {
          self._classSet.add(c);
        },
        remove: (c) => {
          self._classSet.delete(c);
        },
        toggle: (c, force) => {
          const on = force === undefined ? !self._classSet.has(c) : !!force;
          if (on) {
            self._classSet.add(c);
          } else {
            self._classSet.delete(c);
          }
          return on;
        },
        contains: (c) => self._classSet.has(c),
      };
    }

    get className() {
      return [...this._classSet].join(" ");
    }

    set className(value) {
      this._classSet = new Set(
        String(value || "")
          .split(/\s+/)
          .filter(Boolean)
      );
    }

    setAttribute() {}
    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      return child;
    }
    append(...nodes) {
      for (const n of nodes) {
        this.appendChild(n);
      }
    }
    removeChild(child) {
      const i = this.children.indexOf(child);
      if (i >= 0) {
        this.children.splice(i, 1);
      }
      child.parentNode = null;
      return child;
    }
    addEventListener(type, fn) {
      if (!listeners.has(this)) {
        listeners.set(this, {});
      }
      const map = listeners.get(this);
      (map[type] ||= []).push(fn);
    }
    removeEventListener(type, fn) {
      const map = listeners.get(this);
      if (!map?.[type]) {
        return;
      }
      map[type] = map[type].filter((f) => f !== fn);
    }
    getBoundingClientRect() {
      return this._rect;
    }
    setPointerCapture() {}
    releasePointerCapture() {}
  }

  const doc = {
    createElement: (tag) => new FakeEl(tag),
  };

  globalThis.document = doc;
  globalThis.window = {
    addEventListener() {},
    removeEventListener() {},
  };

  return {
    FakeEl,
    listeners,
    restore() {
      delete globalThis.document;
      delete globalThis.window;
    },
  };
}

describe("canvas scrollbars", () => {
  /** @type {ReturnType<typeof installDom>|null} */
  let dom = null;

  before(() => {
    dom = installDom();
  });

  after(() => {
    dom?.restore();
    dom = null;
  });

  it("getPanExtents matches soft-clamp translation bounds", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const viewport = { width: 1366, height: 768 };
    const aabb = { minX: 0, minY: 0, maxX: 2000, maxY: 1200 };
    const camera = createCameraController(
      { style: {} },
      {
        getViewportSize: () => ({ ...viewport }),
        getContentAABB: () => ({ ...aabb }),
      }
    );
    camera.zoomTo(1, "keepWorldCenter");
    const ext = camera.getPanExtents();
    assert.ok(ext);
    assert.equal(ext.vw, 1366);
    assert.equal(ext.vh, 768);
    assert.ok(ext.txMax > ext.txMin);
    assert.ok(ext.tyMax > ext.tyMin);

    camera.panBy(1e6, 1e6);
    const after = camera.getState();
    assert.ok(after.translateX <= ext.txMax + 1e-6);
    assert.ok(after.translateX >= ext.txMin - 1e-6);
    assert.ok(after.translateY <= ext.tyMax + 1e-6);
    assert.ok(after.translateY >= ext.tyMin - 1e-6);
  });

  it("bindCanvasScrollbars mounts V+H tracks and syncs visibility", async () => {
    const { bindCanvasScrollbars } = await import(SCROLLBARS_URL);
    const viewport = new dom.FakeEl("div");
    viewport.clientWidth = 1366;
    viewport.clientHeight = 768;

    let translateX = 100;
    let translateY = 50;
    const camera = {
      getState: () => ({ scale: 1, translateX, translateY }),
      panBy: (dx, dy) => {
        translateX += dx;
        translateY += dy;
      },
      getPanExtents: () => ({
        vw: 1366,
        vh: 768,
        txMin: -400,
        txMax: 400,
        tyMin: -300,
        tyMax: 300,
      }),
    };

    const api = bindCanvasScrollbars(viewport, camera);
    assert.equal(typeof api.sync, "function");
    assert.equal(typeof api.teardown, "function");

    const root = viewport.children[0];
    assert.ok(root);
    assert.ok(root.classList.contains("canvas-scrollbars"));
    assert.ok(root.classList.contains("is-scroll-x"));
    assert.ok(root.classList.contains("is-scroll-y"));

    const tracks = root.children.filter((c) =>
      String(c.className).includes("track")
    );
    assert.equal(tracks.length, 2);
    assert.ok(
      tracks.some((t) => String(t.className).includes("track--y"))
    );
    assert.ok(
      tracks.some((t) => String(t.className).includes("track--x"))
    );

    api.teardown();
    assert.equal(viewport.children.length, 0);
  });

  it("dragging vertical thumb calls panBy and updates translateY", async () => {
    const { bindCanvasScrollbars } = await import(SCROLLBARS_URL);
    const viewport = new dom.FakeEl("div");
    viewport.clientWidth = 1366;
    viewport.clientHeight = 768;

    let translateX = 0;
    let translateY = 0;
    const camera = {
      getState: () => ({ scale: 1, translateX, translateY }),
      panBy: (dx, dy) => {
        translateX += dx;
        translateY += dy;
      },
      getPanExtents: () => ({
        vw: 1366,
        vh: 768,
        txMin: -200,
        txMax: 200,
        tyMin: -200,
        tyMax: 200,
      }),
    };

    bindCanvasScrollbars(viewport, camera);
    const root = viewport.children[0];
    const trackY = root.children.find((c) =>
      String(c.className).includes("track--y")
    );
    const thumbY = trackY.children[0];
    trackY.clientHeight = 400;
    thumbY.offsetHeight = 80;
    trackY._rect = {
      x: 1350,
      y: 24,
      left: 1350,
      top: 24,
      right: 1360,
      bottom: 424,
      width: 10,
      height: 400,
      toJSON() {
        return this;
      },
    };

    const down = dom.listeners.get(thumbY)?.pointerdown?.[0];
    const move = dom.listeners.get(thumbY)?.pointermove?.[0];
    assert.ok(down);
    assert.ok(move);

    down({
      clientY: 100,
      pointerId: 1,
      preventDefault() {},
      stopPropagation() {},
    });
    move({
      clientY: 200,
      pointerId: 1,
      preventDefault() {},
      stopPropagation() {},
    });

    assert.ok(
      translateY < 0,
      `expected pan down (ty decreases), got ${translateY}`
    );
  });
});
