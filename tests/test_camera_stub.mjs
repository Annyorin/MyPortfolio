/**
 * CameraController API smoke (narrowed after task 3.1 math suite).
 *
 * Behavioral check only — stub forever-{1,0,0}-after-zoom and typeof-only
 * assertions removed. Full math contract lives in test_camera_math.mjs.
 *
 * TC-E2E-03: initial getState {1,0,0}; zoom changes scale; apply matches state
 */

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CAMERA_URL = pathToFileURL(
  path.join(REPO_ROOT, "portfolio", "js", "camera.js")
).href;

describe("camera controller smoke", () => {
  it("TC-E2E-03: initial getState is {1,0,0}; zoom changes scale; apply matches state", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const worldEl = { style: {} };
    const camera = createCameraController(worldEl);

    assert.deepEqual(camera.getState(), {
      scale: 1,
      translateX: 0,
      translateY: 0,
    });

    camera.zoomBy(0.1, "viewportCenter");
    const afterZoom = camera.getState();
    assert.equal(afterZoom.scale, 1.1);
    assert.notEqual(afterZoom.scale, 1);

    camera.apply();
    assert.equal(worldEl.style.transformOrigin, "0 0");
    assert.equal(
      worldEl.style.transform,
      `translate(${afterZoom.translateX}px, ${afterZoom.translateY}px) scale(${afterZoom.scale})`
    );
    assert.match(worldEl.style.transform, /^translate\(/);
    assert.ok(
      worldEl.style.transform.indexOf("translate(") <
        worldEl.style.transform.indexOf("scale(")
    );
  });

  it("with scaleEl + CSS.supports(zoom): pan uses translate, world uses zoom", async () => {
    const prevCSS = globalThis.CSS;
    globalThis.CSS = {
      supports(property, value) {
        return property === "zoom" && value === "1";
      },
    };
    try {
      const { createCameraController } = await import(
        `${CAMERA_URL}?zoom=${Date.now()}`
      );
      const panEl = { style: {} };
      const scaleEl = { style: {} };
      const camera = createCameraController(panEl, { scaleEl });
      camera.zoomBy(0.2, "viewportCenter");
      const state = camera.getState();
      camera.apply();

      assert.equal(
        panEl.style.transform,
        `translate(${state.translateX}px, ${state.translateY}px)`
      );
      assert.equal(panEl.style.transform.includes("scale("), false);
      assert.equal(scaleEl.style.zoom, String(state.scale));
      assert.equal(scaleEl.style.transform, "");
    } finally {
      if (prevCSS === undefined) {
        delete globalThis.CSS;
      } else {
        globalThis.CSS = prevCSS;
      }
    }
  });
});
