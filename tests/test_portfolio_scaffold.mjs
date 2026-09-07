/**
 * Smoke: architecture §3.4 scaffold paths exist on disk (no-mock file anchor).
 *
 * TC-E2E-01: shared / portfolio/js / .storybook / stories paths
 * TC-E2E-04: npm scripts storybook and portfolio:dev
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

/**
 * @param {string} relativePath
 * @returns {string}
 */
function abs(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

const REQUIRED_PATHS = [
  "shared/content.js",
  "shared/layout.js",
  "portfolio/js/main.js",
  "portfolio/js/camera.js",
  "portfolio/js/infiniteBg.js",
  "portfolio/js/input.js",
  "portfolio/js/scene.js",
  "portfolio/js/interactions.js",
  "portfolio/js/resolveAsset.js",
  ".storybook/main.js",
  "stories",
];

describe("portfolio scaffold smoke (stubs)", () => {
  it("TC-E2E-01: architecture §3.4 directories and files exist on disk", () => {
    for (const rel of REQUIRED_PATHS) {
      assert.ok(fs.existsSync(abs(rel)), `missing ${rel}`);
    }
  });

  it("TC-E2E-04: package.json declares storybook and portfolio:dev scripts", () => {
    const pkg = JSON.parse(fs.readFileSync(abs("package.json"), "utf8"));
    assert.equal(typeof pkg.scripts.storybook, "string");
    assert.equal(typeof pkg.scripts["portfolio:dev"], "string");
    assert.ok(pkg.scripts.storybook.length > 0);
    assert.ok(pkg.scripts["portfolio:dev"].length > 0);
  });
});
