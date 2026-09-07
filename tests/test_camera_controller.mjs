/**
 * CameraController math contract (architecture §5.2 / task 2.3).
 *
 * TC-E2E-01: zoomBy increases scale; world children node refs unchanged
 * TC-E2E-02: zoomTo(1, keepWorldCenter) keeps former center world under viewport center
 * TC-E2E-03: fitToContent fits AABB; repeated fit is stable
 * TC-E2E-04: panBy past expand AABB does not move viewport center outside clamp
 * TC-UNIT-01: screen↔world round-trip
 * TC-UNIT-02: zoom to cursor keeps world under pivot
 * TC-UNIT-03: zoom at maxScale is no-op
 * TC-UNIT-04: CSS transform string has translate before scale
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

const VIEWPORT = { width: 1024, height: 609 };
const CONTENT_AABB = {
  minX: 24,
  minY: 24,
  maxX: 1000,
  maxY: 577,
};

const FLOAT_EPS = 1e-9;

/**
 * @param {object} [overrides]
 */
function createHarness(overrides = {}) {
  const childA = { id: "a" };
  const childB = { id: "b" };
  const worldEl = {
    style: {},
    children: [childA, childB],
  };

  const viewport = { ...VIEWPORT, ...(overrides.viewport || {}) };
  const aabb = { ...CONTENT_AABB, ...(overrides.aabb || {}) };

  return {
    worldEl,
    childA,
    childB,
    options: {
      getViewportSize: () => ({ ...viewport }),
      getContentAABB: () => ({ ...aabb }),
      minScale: overrides.minScale ?? 0.25,
      maxScale: overrides.maxScale ?? 4,
      zoomStep: overrides.zoomStep ?? 0.1,
    },
  };
}

describe("camera controller math contract", () => {
  it("TC-E2E-01: zoomBy(+step, center) increases scale; world children refs unchanged", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, childA, childB, options } = createHarness();
    const camera = createCameraController(worldEl, options);
    const beforeChildren = [...worldEl.children];
    const beforeScale = camera.getState().scale;

    camera.zoomBy(0.1, "viewportCenter");

    assert.ok(camera.getState().scale > beforeScale);
    assert.equal(worldEl.children.length, beforeChildren.length);
    assert.equal(worldEl.children[0], childA);
    assert.equal(worldEl.children[1], childB);
    assert.equal(worldEl.children[0], beforeChildren[0]);
  });

  it("TC-E2E-02: zoomTo(1, keepWorldCenter) → scale===1; former center world stays centered", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = createHarness();
    const camera = createCameraController(worldEl, options);

    camera.zoomBy(0.25, "viewportCenter");
    camera.panBy(-40, 30);

    const { width: vw, height: vh } = VIEWPORT;
    const before = camera.getState();
    const cx =
      (vw / 2 - before.translateX) / before.scale;
    const cy =
      (vh / 2 - before.translateY) / before.scale;

    camera.zoomTo(1, "keepWorldCenter");
    const after = camera.getState();
    assert.equal(after.scale, 1);

    const screen = camera.worldToScreen(cx, cy);
    assert.ok(Math.abs(screen.x - vw / 2) < FLOAT_EPS);
    assert.ok(Math.abs(screen.y - vh / 2) < FLOAT_EPS);
  });

  it("TC-E2E-03: fitToContent fits AABB; repeated fit is stable", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = createHarness();
    const camera = createCameraController(worldEl, options);

    const first = camera.fitToContent(24);
    const second = camera.fitToContent(24);

    assert.deepEqual(second, first);

    const aabbW = CONTENT_AABB.maxX - CONTENT_AABB.minX;
    const aabbH = CONTENT_AABB.maxY - CONTENT_AABB.minY;
    const expectedScale = Math.min(
      (VIEWPORT.width - 48) / aabbW,
      (VIEWPORT.height - 48) / aabbH
    );
    assert.ok(Math.abs(first.scale - expectedScale) < FLOAT_EPS);

    const centerX = (CONTENT_AABB.minX + CONTENT_AABB.maxX) / 2;
    const centerY = (CONTENT_AABB.minY + CONTENT_AABB.maxY) / 2;
    const screen = camera.worldToScreen(centerX, centerY);
    assert.ok(Math.abs(screen.x - VIEWPORT.width / 2) < 1e-6);
    assert.ok(Math.abs(screen.y - VIEWPORT.height / 2) < 1e-6);
  });

  it("TC-E2E-04: panBy past expand AABB keeps viewport center inside clamp", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = createHarness();
    const camera = createCameraController(worldEl, options);

    camera.panBy(1e6, 1e6);
    const after = camera.getState();
    const cx =
      (VIEWPORT.width / 2 - after.translateX) / after.scale;
    const cy =
      (VIEWPORT.height / 2 - after.translateY) / after.scale;

    const expanded = {
      minX: CONTENT_AABB.minX - VIEWPORT.width,
      maxX: CONTENT_AABB.maxX + VIEWPORT.width,
      minY: CONTENT_AABB.minY - VIEWPORT.height,
      maxY: CONTENT_AABB.maxY + VIEWPORT.height,
    };

    assert.ok(cx >= expanded.minX - FLOAT_EPS);
    assert.ok(cx <= expanded.maxX + FLOAT_EPS);
    assert.ok(cy >= expanded.minY - FLOAT_EPS);
    assert.ok(cy <= expanded.maxY + FLOAT_EPS);

    const clamped = { ...after };
    camera.panBy(500, 500);
    assert.deepEqual(camera.getState(), clamped);
  });

  it("TC-UNIT-01: screen↔world round-trip at known scale/translate", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = createHarness();
    const camera = createCameraController(worldEl, options);

    camera.zoomBy(0.5, "viewportCenter");
    camera.panBy(12, -34);

    const sx = 400;
    const sy = 200;
    const world = camera.screenToWorld(sx, sy);
    const back = camera.worldToScreen(world.x, world.y);
    assert.ok(Math.abs(back.x - sx) < FLOAT_EPS);
    assert.ok(Math.abs(back.y - sy) < FLOAT_EPS);

    const state = camera.getState();
    assert.ok(
      Math.abs(world.x - (sx - state.translateX) / state.scale) < FLOAT_EPS
    );
    assert.ok(
      Math.abs(world.y - (sy - state.translateY) / state.scale) < FLOAT_EPS
    );
  });

  it("TC-UNIT-02: zoom to cursor keeps world under pivot", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = createHarness();
    const camera = createCameraController(worldEl, options);

    const pivot = { x: 320, y: 180 };
    const worldBefore = camera.screenToWorld(pivot.x, pivot.y);
    camera.zoomBy(0.2, pivot);
    const screenAfter = camera.worldToScreen(worldBefore.x, worldBefore.y);

    assert.ok(Math.abs(screenAfter.x - pivot.x) < FLOAT_EPS);
    assert.ok(Math.abs(screenAfter.y - pivot.y) < FLOAT_EPS);
  });

  it("TC-UNIT-03: zoom at maxScale — further zoom in is no-op", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = createHarness({ maxScale: 4 });
    const camera = createCameraController(worldEl, options);

    camera.zoomTo(4, "keepWorldCenter");
    const atMax = camera.getState();
    camera.zoomBy(0.25, "viewportCenter");
    assert.deepEqual(camera.getState(), atMax);
  });

  it("TC-UNIT-04: CSS transform string contains translate before scale", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = createHarness();
    const camera = createCameraController(worldEl, options);

    camera.zoomBy(0.1, "viewportCenter");
    camera.panBy(5, -7);
    camera.apply();

    const transform = worldEl.style.transform;
    assert.equal(worldEl.style.transformOrigin, "0 0");
    const translateIdx = transform.indexOf("translate(");
    const scaleIdx = transform.indexOf("scale(");
    assert.ok(translateIdx >= 0);
    assert.ok(scaleIdx > translateIdx);

    const { scale, translateX, translateY } = camera.getState();
    assert.equal(
      transform,
      `translate(${translateX}px, ${translateY}px) scale(${scale})`
    );
  });
});
