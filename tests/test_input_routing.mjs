/**
 * Input Gesture Layer routing unit suite (task 3.1 / UC-03, UC-04).
 *
 * TC-E2E-01: hotkeys table routes to camera commands
 * TC-UNIT-Wheel-pan: wheel without mod → pan, scale unchanged
 * TC-UNIT-Wheel-zoom: Ctrl/Meta+wheel → zoom to cursor; preventDefault
 * TC-UNIT-Space: Space+drag pan + suppressClicks
 * TC-UNIT-Edit: bare +/- ignored in text field
 */

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const INPUT_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "input.js")
).href;
const CAMERA_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "camera.js")
).href;

/**
 * Minimal EventTarget-like viewport (1024×609).
 * @returns {object}
 */
function createViewportHarness() {
  /** @type {Map<string, Array<{fn: Function, options?: object}>>} */
  const listeners = new Map();

  return {
    style: { cursor: "" },
    clientWidth: 1024,
    clientHeight: 609,
    /**
     * @param {string} type
     * @param {Function} fn
     * @param {object} [options]
     */
    addEventListener(type, fn, options) {
      if (!listeners.has(type)) {
        listeners.set(type, []);
      }
      listeners.get(type).push({ fn, options });
    },
    /**
     * @param {string} type
     * @param {Function} fn
     */
    removeEventListener(type, fn) {
      const list = listeners.get(type) || [];
      listeners.set(
        type,
        list.filter((entry) => entry.fn !== fn)
      );
    },
    /**
     * @param {{type: string, defaultPrevented?: boolean}} event
     */
    dispatchEvent(event) {
      const list = listeners.get(event.type) || [];
      for (const { fn } of list) {
        fn(event);
      }
      return !event.defaultPrevented;
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: 1024,
        height: 609,
        right: 1024,
        bottom: 609,
        x: 0,
        y: 0,
      };
    },
  };
}

/**
 * @param {Partial<KeyboardEvent> & {type?: string}} overrides
 */
function keyEvent(overrides) {
  let defaultPrevented = false;
  return {
    type: "keydown",
    key: "",
    code: "",
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
    target: null,
    preventDefault() {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
    ...overrides,
  };
}

/**
 * @param {Partial<WheelEvent> & {type?: string}} overrides
 */
function wheelEvent(overrides) {
  let defaultPrevented = false;
  return {
    type: "wheel",
    deltaX: 0,
    deltaY: 0,
    clientX: 512,
    clientY: 300,
    ctrlKey: false,
    metaKey: false,
    preventDefault() {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
    ...overrides,
  };
}

/**
 * @param {Partial<PointerEvent> & {type?: string}} overrides
 */
function pointerEvent(overrides) {
  let defaultPrevented = false;
  return {
    type: "pointerdown",
    button: 0,
    pointerId: 1,
    clientX: 100,
    clientY: 100,
    target: null,
    preventDefault() {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
    ...overrides,
  };
}

describe("input routing", () => {
  it("TC-E2E-01: hotkeys table routes zoom in/out, 100%, fit", async () => {
    const { bindInput } = await import(INPUT_URL);
    const calls = {
      zoomBy: [],
      zoomTo: [],
      fitToContent: [],
      panBy: [],
    };
    const camera = {
      zoomStep: 0.1,
      zoomBy(...args) {
        calls.zoomBy.push(args);
      },
      zoomTo(...args) {
        calls.zoomTo.push(args);
      },
      fitToContent(...args) {
        calls.fitToContent.push(args);
      },
      panBy(...args) {
        calls.panBy.push(args);
      },
    };
    const viewport = createViewportHarness();
    const inputMode = {
      spaceDown: false,
      isPanning: false,
      suppressClicks: false,
    };
    const unbind = bindInput(viewport, camera, inputMode);

    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "=", code: "Equal", ctrlKey: true })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "+", code: "equal", metaKey: true })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "+", code: "NumpadAdd" })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "-", code: "Minus", ctrlKey: true })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "-", code: "Minus", metaKey: true })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "-", code: "Minus" })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "0", code: "Digit0", ctrlKey: true })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "0", code: "Digit0", metaKey: true })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "0", code: "Digit0", shiftKey: true })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "1", code: "Digit1", shiftKey: true })
    );

    assert.equal(calls.zoomBy.length, 6);
    assert.deepEqual(calls.zoomBy[0], [0.1, "viewportCenter"]);
    assert.deepEqual(calls.zoomBy[1], [0.1, "viewportCenter"]);
    assert.deepEqual(calls.zoomBy[2], [0.1, "viewportCenter"]);
    assert.deepEqual(calls.zoomBy[3], [-0.1, "viewportCenter"]);
    assert.deepEqual(calls.zoomBy[4], [-0.1, "viewportCenter"]);
    assert.deepEqual(calls.zoomBy[5], [-0.1, "viewportCenter"]);

    assert.equal(calls.zoomTo.length, 3);
    for (const args of calls.zoomTo) {
      assert.deepEqual(args, [1, "keepWorldCenter"]);
    }

    assert.equal(calls.fitToContent.length, 1);
    assert.deepEqual(calls.fitToContent[0], [24]);
    assert.equal(calls.panBy.length, 0);

    unbind();
  });

  it("TC-UNIT-Wheel-pan: wheel without modifier pans; scale unchanged", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);
    const viewport = createViewportHarness();
    const camera = createCameraController({ style: {} });
    const inputMode = {
      spaceDown: false,
      isPanning: false,
      suppressClicks: false,
    };
    const unbind = bindInput(viewport, camera, inputMode);
    const before = camera.getState();

    const ev = wheelEvent({ deltaX: 35, deltaY: 20 });
    viewport.dispatchEvent(ev);

    const after = camera.getState();
    assert.equal(after.scale, before.scale);
    assert.equal(after.translateX, before.translateX - 35);
    assert.equal(after.translateY, before.translateY - 20);
    assert.equal(ev.defaultPrevented, true);
    unbind();
  });

  it("TC-UNIT-Wheel-zoom: Ctrl and Meta wheel zoom to cursor symmetrically", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);

    const run = (mod) => {
      const viewport = createViewportHarness();
      const camera = createCameraController({ style: {} });
      const unbind = bindInput(viewport, camera, {
        spaceDown: false,
        isPanning: false,
        suppressClicks: false,
      });
      const pivot = { x: 220, y: 160 };
      const worldBefore = camera.screenToWorld(pivot.x, pivot.y);
      const ev = wheelEvent({
        deltaY: -90,
        clientX: pivot.x,
        clientY: pivot.y,
        ctrlKey: mod === "ctrl",
        metaKey: mod === "meta",
      });
      viewport.dispatchEvent(ev);
      const screenAfter = camera.worldToScreen(worldBefore.x, worldBefore.y);
      const state = camera.getState();
      unbind();
      return { state, prevented: ev.defaultPrevented, screenAfter, pivot };
    };

    const ctrl = run("ctrl");
    const meta = run("meta");

    assert.equal(ctrl.prevented, true);
    assert.equal(meta.prevented, true);
    assert.ok(ctrl.state.scale > 1);
    assert.equal(ctrl.state.scale, meta.state.scale);
    assert.equal(ctrl.state.translateX, meta.state.translateX);
    assert.equal(ctrl.state.translateY, meta.state.translateY);
    assert.ok(Math.abs(ctrl.screenAfter.x - ctrl.pivot.x) < 1e-9);
    assert.ok(Math.abs(ctrl.screenAfter.y - ctrl.pivot.y) < 1e-9);
  });

  it("TC-UNIT-Space: Space+drag pans and sets suppressClicks", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);
    const viewport = createViewportHarness();
    const camera = createCameraController({ style: {} });
    const inputMode = {
      spaceDown: false,
      isPanning: false,
      suppressClicks: false,
    };
    const unbind = bindInput(viewport, camera, inputMode);
    const before = camera.getState();

    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: " ", code: "Space" })
    );
    assert.equal(inputMode.spaceDown, true);
    assert.equal(inputMode.suppressClicks, true);
    assert.equal(viewport.style.cursor, "grab");

    viewport.dispatchEvent(
      pointerEvent({
        type: "pointerdown",
        button: 0,
        pointerId: 3,
        clientX: 50,
        clientY: 60,
        target: viewport,
      })
    );
    assert.equal(inputMode.isPanning, true);
    assert.equal(inputMode.suppressClicks, true);
    assert.equal(viewport.style.cursor, "grabbing");

    viewport.dispatchEvent(
      pointerEvent({
        type: "pointermove",
        pointerId: 3,
        clientX: 90,
        clientY: 95,
      })
    );

    const mid = camera.getState();
    assert.equal(mid.scale, before.scale);
    assert.equal(mid.translateX, before.translateX + 40);
    assert.equal(mid.translateY, before.translateY + 35);
    assert.equal(inputMode.suppressClicks, true);

    viewport.dispatchEvent(
      pointerEvent({ type: "pointerup", pointerId: 3, clientX: 90, clientY: 95 })
    );
    assert.equal(inputMode.isPanning, false);
    assert.equal(inputMode.spaceDown, true);
    assert.equal(inputMode.suppressClicks, true);

    viewport.dispatchEvent(keyEvent({ type: "keyup", key: " ", code: "Space" }));
    assert.equal(inputMode.spaceDown, false);
    assert.equal(inputMode.suppressClicks, false);
    assert.equal(viewport.style.cursor, "");

    unbind();
  });

  it("TC-UNIT-Edit: bare +/- ignored while focus in text field", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);
    const viewport = createViewportHarness();
    const camera = createCameraController({ style: {} });
    const inputMode = {
      spaceDown: false,
      isPanning: false,
      suppressClicks: false,
    };
    const unbind = bindInput(viewport, camera, inputMode);
    const before = camera.getState().scale;

    const fakeInput = { tagName: "INPUT" };
    const fakeTextarea = { tagName: "TEXTAREA" };
    const prevDocument = globalThis.document;
    globalThis.document = { activeElement: fakeInput };

    try {
      viewport.dispatchEvent(
        keyEvent({
          type: "keydown",
          key: "+",
          code: "Equal",
          target: fakeInput,
        })
      );
      assert.equal(camera.getState().scale, before);

      viewport.dispatchEvent(
        keyEvent({
          type: "keydown",
          key: "-",
          code: "Minus",
          target: fakeInput,
        })
      );
      assert.equal(camera.getState().scale, before);

      globalThis.document = { activeElement: fakeTextarea };
      viewport.dispatchEvent(
        keyEvent({
          type: "keydown",
          key: "+",
          code: "NumpadAdd",
          target: fakeTextarea,
        })
      );
      assert.equal(camera.getState().scale, before);
    } finally {
      if (prevDocument === undefined) {
        delete globalThis.document;
      } else {
        globalThis.document = prevDocument;
      }
    }

    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "+", code: "equal", target: viewport })
    );
    assert.ok(camera.getState().scale > before);

    const afterPlus = camera.getState().scale;
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "-", code: "Minus", target: viewport })
    );
    assert.ok(camera.getState().scale < afterPlus);

    unbind();
  });
});
