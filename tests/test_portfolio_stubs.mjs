/**
 * Portfolio / shared / camera delivery tests (task 1.1; camera expectations updated in 2.3).
 *
 * TC-E2E-01: modules import; CameraController initial getState {1,0,0}; zoom updates scale
 * TC-UNIT-01: getState fields
 * TC-UNIT-02: resolveAsset('avatar') returns non-throwing string
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const STUB_MODULES = [
  "shared/content.js",
  "shared/layout.js",
  "portfolio/js/camera.js",
  "portfolio/js/input.js",
  "portfolio/js/scene.js",
  "portfolio/js/interactions.js",
  "portfolio/js/resolveAsset.js",
  "portfolio/js/main.js",
  ".storybook/main.js",
  ".storybook/preview.js",
  "stories/Chip.stories.js",
  "stories/Card.stories.js",
  "stories/Sidebar.stories.js",
  "vite.config.js",
];

/**
 * @param {string} relativePath
 * @returns {string}
 */
function abs(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

describe("portfolio stubs delivery", () => {
  it("TC-E2E-01: stub modules pass node --check and import without syntax error", () => {
    for (const rel of STUB_MODULES) {
      const filePath = abs(rel);
      assert.ok(fs.existsSync(filePath), `missing ${rel}`);
      const checked = spawnSync(process.execPath, ["--check", filePath], {
        encoding: "utf8",
      });
      assert.equal(
        checked.status,
        0,
        `node --check failed for ${rel}: ${checked.stderr || checked.stdout}`
      );
    }
  });

  it("TC-E2E-01: CameraController initial getState is {1,0,0}; zoom updates scale", async () => {
    const { createCameraController } = await import(
      pathToFileURL(abs("portfolio/js/camera.js")).href
    );
    const worldEl = { style: {} };
    const camera = createCameraController(worldEl);
    assert.deepEqual(camera.getState(), {
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    camera.zoomBy(0.1, "viewportCenter");
    assert.equal(camera.getState().scale, 1.1);
    camera.zoomTo(1, "keepWorldCenter");
    assert.equal(camera.getState().scale, 1);
    camera.apply();
    assert.equal(worldEl.style.transformOrigin, "0 0");
    assert.match(worldEl.style.transform, /^translate\(.+\) scale\(.+\)$/);
  });

  it("TC-UNIT-01: getState() returns object with scale, translateX, translateY", async () => {
    const { createCameraController } = await import(
      pathToFileURL(abs("portfolio/js/camera.js")).href
    );
    const state = createCameraController({ style: {} }).getState();
    assert.equal(typeof state.scale, "number");
    assert.equal(typeof state.translateX, "number");
    assert.equal(typeof state.translateY, "number");
    assert.ok("scale" in state);
    assert.ok("translateX" in state);
    assert.ok("translateY" in state);
  });

  it("TC-UNIT-02: resolveAsset('avatar') returns non-throwing string", async () => {
    const { resolveAsset } = await import(
      pathToFileURL(abs("portfolio/js/resolveAsset.js")).href
    );
    const url = resolveAsset("avatar");
    assert.equal(typeof url, "string");
    assert.ok(url.length > 0);
  });

  it("package.json declares storybook and portfolio:dev scripts", () => {
    const pkg = JSON.parse(fs.readFileSync(abs("package.json"), "utf8"));
    assert.equal(typeof pkg.scripts.storybook, "string");
    assert.equal(typeof pkg.scripts["portfolio:dev"], "string");
    assert.ok(pkg.scripts.storybook.length > 0);
    assert.ok(pkg.scripts["portfolio:dev"].length > 0);
  });

  it("shared stubs export contentMap and sceneGraph.nodes", async () => {
    const content = await import(pathToFileURL(abs("shared/content.js")).href);
    const layout = await import(pathToFileURL(abs("shared/layout.js")).href);
    assert.equal(typeof content.contentMap, "object");
    assert.ok(content.contentMap !== null);
    assert.equal(typeof layout.sceneGraph, "object");
    assert.ok(Array.isArray(layout.sceneGraph.nodes));
    assert.ok(Array.isArray(layout.nodes));
  });

  it("required scaffold directories and files exist", () => {
    const required = [
      "shared",
      "portfolio",
      "portfolio/css",
      "portfolio/js",
      "stories",
      ".storybook",
      "portfolio/index.html",
      "portfolio/main.html",
      "portfolio/css/portfolio.css",
    ];
    for (const rel of required) {
      assert.ok(fs.existsSync(abs(rel)), `missing ${rel}`);
    }
  });
});
