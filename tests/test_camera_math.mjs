/**
 * CameraController math contract unit suite (task 3.1 / UC-03, UC-04).
 *
 * TC-E2E-01: zoom in → pan → zoom 100% → fit; clamp + children invariant
 * TC-UNIT-01: screen↔world round-trip
 * TC-UNIT-02: zoomBy pivot viewportCenter keeps center world
 * TC-UNIT-03: zoomBy pivot cursor keeps world under cursor
 * TC-UNIT-04: zoomTo(1, keepWorldCenter) scale===1, center preserved
 * TC-UNIT-05: fitToContent(24) fits layout AABB
 * TC-UNIT-Clamp: pan past expand AABB → no-op on axis
 * TC-UNIT-Fit-narrow: viewport <1024 → fit reduces scale / changes translate
 * TC-UNIT-MinMax: zoom at min/max is no-op
 * TC-UNIT-Apply: transform-only apply (children refs, no left/top)
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
const LAYOUT_URL = pathToFileURL(
  path.join(REPO_ROOT, "shared", "layout.js")
).href;

const VIEWPORT = Object.freeze({ width: 1024, height: 609 });
const FLOAT_EPS = 1e-9;

/**
 * @returns {Promise<{
 *   worldEl: { style: Record<string, string>, children: object[] },
 *   childA: object,
 *   childB: object,
 *   aabb: { minX: number, minY: number, maxX: number, maxY: number },
 *   options: object,
 *   viewport: { width: number, height: number }
 * }>}
 */
async function createHarness(overrides = {}) {
  const { nodes, computeContentAABB } = await import(LAYOUT_URL);
  const layoutAabb = computeContentAABB(nodes);
  const childA = { id: "a", left: "10px", top: "20px" };
  const childB = { id: "b", left: "30px", top: "40px" };
  const worldEl = {
    style: {},
    children: [childA, childB],
  };

  const viewport = {
    width: overrides.viewportWidth ?? VIEWPORT.width,
    height: overrides.viewportHeight ?? VIEWPORT.height,
  };
  const aabb = { ...layoutAabb, ...(overrides.aabb || {}) };

  return {
    worldEl,
    childA,
    childB,
    aabb,
    viewport,
    options: {
      getViewportSize: () => ({ ...viewport }),
      getContentAABB: () => ({ ...aabb }),
      minScale: overrides.minScale ?? 0.25,
      maxScale: overrides.maxScale ?? 4,
      zoomStep: overrides.zoomStep ?? 0.1,
    },
  };
}

/**
 * @param {{ scale: number, translateX: number, translateY: number }} state
 * @param {{ width: number, height: number }} viewport
 */
function viewportCenterWorld(state, viewport) {
  return {
    x: (viewport.width / 2 - state.translateX) / state.scale,
    y: (viewport.height / 2 - state.translateY) / state.scale,
  };
}

/**
 * @param {{ minX: number, minY: number, maxX: number, maxY: number }} aabb
 * @param {{ width: number, height: number }} viewport
 */
function expandAabb(aabb, viewport) {
  return {
    minX: aabb.minX - viewport.width,
    maxX: aabb.maxX + viewport.width,
    minY: aabb.minY - viewport.height,
    maxY: aabb.maxY + viewport.height,
  };
}

describe("camera math contract", () => {
  it("TC-E2E-01: zoom → pan → 100% → fit keeps clamp and world children", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, childA, childB, aabb, options, viewport } =
      await createHarness();
    const camera = createCameraController(worldEl, options);
    const beforeChildren = [...worldEl.children];

    camera.zoomBy(0.2, "viewportCenter");
    camera.panBy(-80, 40);
    camera.zoomTo(1, "keepWorldCenter");
    const afterFit = camera.fitToContent(24);

    assert.equal(worldEl.children.length, beforeChildren.length);
    assert.equal(worldEl.children[0], childA);
    assert.equal(worldEl.children[1], childB);
    assert.equal(worldEl.children[0], beforeChildren[0]);
    assert.equal(worldEl.children[1], beforeChildren[1]);

    const center = viewportCenterWorld(afterFit, viewport);
    const expanded = expandAabb(aabb, viewport);
    assert.ok(center.x >= expanded.minX - FLOAT_EPS);
    assert.ok(center.x <= expanded.maxX + FLOAT_EPS);
    assert.ok(center.y >= expanded.minY - FLOAT_EPS);
    assert.ok(center.y <= expanded.maxY + FLOAT_EPS);

    const aabbW = aabb.maxX - aabb.minX;
    const aabbH = aabb.maxY - aabb.minY;
    const expectedScale = Math.min(
      (viewport.width - 48) / aabbW,
      (viewport.height - 48) / aabbH
    );
    const clampedExpected = Math.min(4, Math.max(0.25, expectedScale));
    assert.ok(Math.abs(afterFit.scale - clampedExpected) < FLOAT_EPS);
  });

  it("TC-UNIT-01: screen↔world round-trip", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = await createHarness();
    const camera = createCameraController(worldEl, options);

    camera.zoomBy(0.3, "viewportCenter");
    camera.panBy(18, -22);

    const sx = 411;
    const sy = 257;
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

  it("TC-UNIT-02: zoomBy pivot viewportCenter keeps world under center", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options, viewport } = await createHarness();
    const camera = createCameraController(worldEl, options);

    const pivot = {
      x: viewport.width / 2,
      y: viewport.height / 2,
    };
    const worldBefore = camera.screenToWorld(pivot.x, pivot.y);
    camera.zoomBy(0.15, "viewportCenter");
    const screenAfter = camera.worldToScreen(worldBefore.x, worldBefore.y);

    assert.ok(Math.abs(screenAfter.x - pivot.x) < FLOAT_EPS);
    assert.ok(Math.abs(screenAfter.y - pivot.y) < FLOAT_EPS);
    assert.ok(camera.getState().scale > 1);
  });

  it("TC-UNIT-03: zoomBy pivot cursor keeps world under cursor", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = await createHarness();
    const camera = createCameraController(worldEl, options);

    const pivot = { x: 288, y: 194 };
    const worldBefore = camera.screenToWorld(pivot.x, pivot.y);
    camera.zoomBy(0.25, pivot);
    const screenAfter = camera.worldToScreen(worldBefore.x, worldBefore.y);

    assert.ok(Math.abs(screenAfter.x - pivot.x) < FLOAT_EPS);
    assert.ok(Math.abs(screenAfter.y - pivot.y) < FLOAT_EPS);
  });

  it("TC-UNIT-04: zoomTo(1, keepWorldCenter) restores 100% and center", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options, viewport } = await createHarness();
    const camera = createCameraController(worldEl, options);

    camera.zoomBy(0.4, "viewportCenter");
    camera.panBy(-55, 28);
    const before = camera.getState();
    const cx = viewportCenterWorld(before, viewport);

    camera.zoomTo(1, "keepWorldCenter");
    const after = camera.getState();
    assert.equal(after.scale, 1);

    const screen = camera.worldToScreen(cx.x, cx.y);
    assert.ok(Math.abs(screen.x - viewport.width / 2) < FLOAT_EPS);
    assert.ok(Math.abs(screen.y - viewport.height / 2) < FLOAT_EPS);
  });

  it("TC-UNIT-05: fitToContent(24) fits layout AABB into viewport", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, aabb, options, viewport } = await createHarness();
    const camera = createCameraController(worldEl, options);

    const first = camera.fitToContent(24);
    const second = camera.fitToContent(24);
    assert.deepEqual(second, first);

    const aabbW = aabb.maxX - aabb.minX;
    const aabbH = aabb.maxY - aabb.minY;
    const expectedScale = Math.min(
      (viewport.width - 48) / aabbW,
      (viewport.height - 48) / aabbH
    );
    const clampedExpected = Math.min(4, Math.max(0.25, expectedScale));
    assert.ok(Math.abs(first.scale - clampedExpected) < FLOAT_EPS);

    const centerX = (aabb.minX + aabb.maxX) / 2;
    const centerY = (aabb.minY + aabb.maxY) / 2;
    const screen = camera.worldToScreen(centerX, centerY);
    assert.ok(Math.abs(screen.x - viewport.width / 2) < 1e-6);
    assert.ok(Math.abs(screen.y - viewport.height / 2) < 1e-6);
  });

  it("TC-UNIT-Clamp: pan past expand AABB is no-op on axis", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, aabb, options, viewport } = await createHarness();
    const camera = createCameraController(worldEl, options);

    camera.panBy(1e6, 1e6);
    const atBoundary = camera.getState();
    const center = viewportCenterWorld(atBoundary, viewport);
    const expanded = expandAabb(aabb, viewport);

    assert.ok(center.x >= expanded.minX - FLOAT_EPS);
    assert.ok(center.x <= expanded.maxX + FLOAT_EPS);
    assert.ok(center.y >= expanded.minY - FLOAT_EPS);
    assert.ok(center.y <= expanded.maxY + FLOAT_EPS);

    camera.panBy(250, 0);
    assert.equal(camera.getState().translateX, atBoundary.translateX);
    assert.equal(camera.getState().translateY, atBoundary.translateY);

    camera.panBy(0, 250);
    assert.deepEqual(camera.getState(), atBoundary);
  });

  it("TC-UNIT-Fit-narrow: viewport <1024 fit shrinks scale or moves translate", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const wide = await createHarness();
    const narrow = await createHarness({
      viewportWidth: 640,
      viewportHeight: 480,
    });

    const camWide = createCameraController(wide.worldEl, wide.options);
    const camNarrow = createCameraController(narrow.worldEl, narrow.options);

    const fitWide = camWide.fitToContent(24);
    const fitNarrow = camNarrow.fitToContent(24);

    assert.ok(
      fitNarrow.scale < fitWide.scale ||
        fitNarrow.translateX !== fitWide.translateX ||
        fitNarrow.translateY !== fitWide.translateY
    );
    assert.ok(fitNarrow.scale < fitWide.scale);
  });

  it("TC-UNIT-MinMax: zoom at min/max scale is no-op", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, options } = await createHarness({
      minScale: 0.25,
      maxScale: 4,
    });
    const camera = createCameraController(worldEl, options);

    camera.zoomTo(4, "keepWorldCenter");
    const atMax = camera.getState();
    camera.zoomBy(0.5, "viewportCenter");
    assert.deepEqual(camera.getState(), atMax);

    camera.zoomTo(0.25, "keepWorldCenter");
    const atMin = camera.getState();
    camera.zoomBy(-0.5, "viewportCenter");
    assert.deepEqual(camera.getState(), atMin);
  });

  it("TC-UNIT-Apply: transform-only; children geometry fields untouched", async () => {
    const { createCameraController } = await import(CAMERA_URL);
    const { worldEl, childA, childB, options } = await createHarness();
    const camera = createCameraController(worldEl, options);

    const leftA = childA.left;
    const topA = childA.top;
    const leftB = childB.left;
    const topB = childB.top;
    const childrenBefore = [...worldEl.children];

    camera.zoomBy(0.1, "viewportCenter");
    camera.panBy(12, -8);
    camera.apply();

    assert.equal(worldEl.style.transformOrigin, "0 0");
    const transform = worldEl.style.transform;
    const translateIdx = transform.indexOf("translate(");
    const scaleIdx = transform.indexOf("scale(");
    assert.ok(translateIdx >= 0);
    assert.ok(scaleIdx > translateIdx);

    const { scale, translateX, translateY } = camera.getState();
    assert.equal(
      transform,
      `translate(${translateX}px, ${translateY}px) scale(${scale})`
    );

    assert.equal(childA.left, leftA);
    assert.equal(childA.top, topA);
    assert.equal(childB.left, leftB);
    assert.equal(childB.top, topB);
    assert.equal(worldEl.children[0], childrenBefore[0]);
    assert.equal(worldEl.children[1], childrenBefore[1]);
  });
});
