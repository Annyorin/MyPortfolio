/**
 * Input Gesture Layer routing (task 2.4 / UC-03, UC-04).
 *
 * TC-E2E-01: Ctrl+= → scale grows
 * TC-E2E-02: wheel without ctrl → pan translate; scale unchanged
 * TC-E2E-03: Ctrl+wheel → zoom; preventDefault called
 * TC-E2E-04: Space+drag → pan; suppressClicks true during gesture
 * TC-UNIT-01: 100% and fit hotkeys call zoomTo / fitToContent
 * TC-UNIT-02: bare + ignored while focus in input
 * TC-UNIT-03: Meta vs Ctrl symmetric for zoom wheel
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
 * Minimal EventTarget-like viewport for in-process gesture tests.
 * @returns {object}
 */
function createViewportHarness() {
  /** @type {Map<string, Array<{fn: Function, options?: object}>>} */
  const listeners = new Map();

  const el = {
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

  return el;
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

describe("input gesture layer", () => {
  it("TC-E2E-01: Ctrl+= keydown increases camera scale", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);
    const viewport = createViewportHarness();
    const camera = createCameraController({ style: {} });
    const inputMode = { spaceDown: false, isPanning: false, suppressClicks: false };
    const unbind = bindInput(viewport, camera, inputMode);
    const before = camera.getState().scale;

    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "=", code: "Equal", ctrlKey: true })
    );

    assert.ok(camera.getState().scale > before);
    unbind();
  });

  it("TC-E2E-02: wheel without ctrl pans translate; scale unchanged", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);
    const viewport = createViewportHarness();
    const camera = createCameraController({ style: {} });
    const inputMode = { spaceDown: false, isPanning: false, suppressClicks: false };
    const unbind = bindInput(viewport, camera, inputMode);
    const before = camera.getState();

    const ev = wheelEvent({ deltaX: 40, deltaY: 25 });
    viewport.dispatchEvent(ev);

    const after = camera.getState();
    assert.equal(after.scale, before.scale);
    assert.notEqual(after.translateX, before.translateX);
    assert.notEqual(after.translateY, before.translateY);
    assert.equal(ev.defaultPrevented, true);
    unbind();
  });

  it("TC-E2E-03: Ctrl+wheel zooms and calls preventDefault", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);
    const viewport = createViewportHarness();
    const camera = createCameraController({ style: {} });
    const inputMode = { spaceDown: false, isPanning: false, suppressClicks: false };
    const unbind = bindInput(viewport, camera, inputMode);
    const before = camera.getState().scale;

    const ev = wheelEvent({ deltaY: -100, ctrlKey: true, clientX: 320, clientY: 180 });
    viewport.dispatchEvent(ev);

    assert.ok(camera.getState().scale > before);
    assert.equal(ev.defaultPrevented, true);
    unbind();
  });

  it("TC-E2E-04: Space+drag pans and sets suppressClicks during gesture", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);
    const viewport = createViewportHarness();
    const camera = createCameraController({ style: {} });
    const inputMode = { spaceDown: false, isPanning: false, suppressClicks: false };
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
        pointerId: 7,
        clientX: 100,
        clientY: 100,
        target: viewport,
      })
    );
    assert.equal(inputMode.isPanning, true);
    assert.equal(inputMode.suppressClicks, true);
    assert.equal(viewport.style.cursor, "grabbing");

    viewport.dispatchEvent(
      pointerEvent({
        type: "pointermove",
        pointerId: 7,
        clientX: 140,
        clientY: 130,
      })
    );

    const mid = camera.getState();
    assert.equal(mid.scale, before.scale);
    assert.equal(mid.translateX, before.translateX + 40);
    assert.equal(mid.translateY, before.translateY + 30);
    assert.equal(inputMode.suppressClicks, true);

    viewport.dispatchEvent(
      pointerEvent({ type: "pointerup", pointerId: 7, clientX: 140, clientY: 130 })
    );
    assert.equal(inputMode.isPanning, false);
    assert.equal(inputMode.spaceDown, true);
    assert.equal(inputMode.suppressClicks, true);
    assert.equal(viewport.style.cursor, "grab");

    viewport.dispatchEvent(keyEvent({ type: "keyup", key: " ", code: "Space" }));
    assert.equal(inputMode.spaceDown, false);
    assert.equal(inputMode.suppressClicks, false);
    assert.equal(viewport.style.cursor, "");

    unbind();
  });

  it("TC-UNIT-01: 100% and fit hotkeys call zoomTo / fitToContent", async () => {
    const { bindInput } = await import(INPUT_URL);
    const calls = { zoomTo: [], fitToContent: [], zoomBy: [] };
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
      panBy() {},
    };
    const viewport = createViewportHarness();
    const inputMode = { spaceDown: false, isPanning: false, suppressClicks: false };
    const unbind = bindInput(viewport, camera, inputMode);

    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "0", code: "Digit0", ctrlKey: true })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "0", code: "Digit0", shiftKey: true })
    );
    viewport.dispatchEvent(
      keyEvent({ type: "keydown", key: "1", code: "Digit1", shiftKey: true })
    );

    assert.equal(calls.zoomTo.length, 2);
    assert.deepEqual(calls.zoomTo[0], [1, "keepWorldCenter"]);
    assert.deepEqual(calls.zoomTo[1], [1, "keepWorldCenter"]);
    assert.equal(calls.fitToContent.length, 1);
    assert.deepEqual(calls.fitToContent[0], [24]);

    unbind();
  });

  it("TC-UNIT-02: bare + does not zoom while focus is in input", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);
    const viewport = createViewportHarness();
    const camera = createCameraController({ style: {} });
    const inputMode = { spaceDown: false, isPanning: false, suppressClicks: false };
    const unbind = bindInput(viewport, camera, inputMode);
    const before = camera.getState().scale;

    const fakeInput = { tagName: "INPUT" };
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
          key: "+",
          code: "equal",
          target: viewport,
        })
      );
      // still editing via document.activeElement
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

    unbind();
  });

  it("TC-UNIT-03: Meta and Ctrl are symmetric for zoom wheel", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);

    const run = (mod) => {
      const viewport = createViewportHarness();
      const camera = createCameraController({ style: {} });
      const inputMode = {
        spaceDown: false,
        isPanning: false,
        suppressClicks: false,
      };
      const unbind = bindInput(viewport, camera, inputMode);
      const ev = wheelEvent({
        deltaY: -80,
        clientX: 200,
        clientY: 150,
        ctrlKey: mod === "ctrl",
        metaKey: mod === "meta",
      });
      viewport.dispatchEvent(ev);
      const state = camera.getState();
      unbind();
      return { state, prevented: ev.defaultPrevented };
    };

    const ctrl = run("ctrl");
    const meta = run("meta");

    assert.equal(ctrl.prevented, true);
    assert.equal(meta.prevented, true);
    assert.equal(ctrl.state.scale, meta.state.scale);
    assert.equal(ctrl.state.translateX, meta.state.translateX);
    assert.equal(ctrl.state.translateY, meta.state.translateY);
    assert.ok(ctrl.state.scale > 1);
  });

  it("Cmd+= zoom in matches Ctrl+= (keyboard symmetry)", async () => {
    const { bindInput } = await import(INPUT_URL);
    const { createCameraController } = await import(CAMERA_URL);

    const zoomWith = async (modKey) => {
      const viewport = createViewportHarness();
      const camera = createCameraController({ style: {} });
      const unbind = bindInput(viewport, camera, {
        spaceDown: false,
        isPanning: false,
        suppressClicks: false,
      });
      viewport.dispatchEvent(
        keyEvent({
          type: "keydown",
          key: "=",
          code: "Equal",
          ctrlKey: modKey === "ctrl",
          metaKey: modKey === "meta",
        })
      );
      const scale = camera.getState().scale;
      unbind();
      return scale;
    };

    assert.equal(await zoomWith("ctrl"), await zoomWith("meta"));
  });
});
