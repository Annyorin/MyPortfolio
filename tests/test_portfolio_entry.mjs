/**
 * Portfolio + Storybook entry wiring on stubs (task entrypoints).
 *
 * TC-E2E-01: portfolio/main.html links ds-showcase tokens + components CSS
 * TC-E2E-02: main.js calls mountScene + camera.apply; stub world transform scale(1)
 * TC-E2E-03: story files exist for Chip, Card, Sidebar (and full inventory groups)
 * TC-UNIT-01: preview.js imports both DS CSS paths
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
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

/**
 * @param {string} relativePath
 * @returns {string}
 */
function read(relativePath) {
  return fs.readFileSync(abs(relativePath), "utf8");
}

const STORY_GROUPS = [
  "Chip",
  "Link",
  "Card",
  "Sidebar",
  "Tapper",
  "Tooltip",
  "Stiker",
  "Hover",
  "Avatar",
  "Profile",
  "Icons",
  "Media",
];

describe("portfolio / Storybook entrypoints (stubs)", () => {
  it("TC-E2E-01: portfolio/main.html links tokens.css and components.css from ds-showcase", () => {
    const html = read("portfolio/main.html");
    assert.match(
      html,
      /href=["']\.\.\/ds-showcase\/css\/tokens\.css["']/,
      "tokens.css link required"
    );
    assert.match(
      html,
      /href=["']\.\.\/ds-showcase\/css\/components\.css["']/,
      "components.css link required"
    );
    assert.match(
      html,
      /href=["']css\/portfolio\.css["']/,
      "portfolio.css link required"
    );
    assert.match(html, /class=["'][^"']*\bviewport\b/, ".viewport required");
    assert.match(html, /class=["'][^"']*\bworld\b/, ".world required");
    assert.match(
      html,
      /<script\s+type=["']module["']\s+src=["']js\/main\.js["']/,
      "module main.js required"
    );
    assert.match(
      html,
      /Аня Ясинская — Продуктовый дизайнер · UX\/UI дизайнер/,
      "document title required"
    );
    assert.match(
      html,
      /rel=["']icon["'][^>]*avatar\.png/,
      "favicon Avatar90 required"
    );
    const indexHtml = read("portfolio/index.html");
    assert.match(indexHtml, /main\.html/, "index.html redirects to main.html");
  });

  it("TC-E2E-02: main.js wires mountScene → camera.apply; stub world gets scale(1)", async () => {
    const mainSrc = read("portfolio/js/main.js");
    assert.match(mainSrc, /\bmountScene\s*\(/, "mountScene call required");
    assert.match(mainSrc, /\.apply\s*\(\s*\)/, "camera.apply() call required");
    assert.match(mainSrc, /\.getState\s*\(\s*\)/, "getState call required");
    assert.match(
      mainSrc,
      /\.fitToContent\s*\(\s*24\s*\)/,
      "narrow branch fitToContent(24) required"
    );

    const checked = spawnSync(
      process.execPath,
      ["--check", abs("portfolio/js/main.js")],
      { encoding: "utf8" }
    );
    assert.equal(
      checked.status,
      0,
      `node --check main.js failed: ${checked.stderr || checked.stdout}`
    );

    const { createCameraController } = await import(
      pathToFileURL(abs("portfolio/js/camera.js")).href
    );
    const worldEl = { style: {} };
    const camera = createCameraController(worldEl);
    camera.getState();
    camera.fitToContent(24);
    camera.apply();
    assert.equal(worldEl.style.transform, "translate(0px, 0px) scale(1)");
    assert.equal(worldEl.style.transformOrigin, "0 0");

    await import(pathToFileURL(abs("portfolio/js/main.js")).href);
  });

  it("TC-E2E-03: Storybook story files exist for Chip, Card, Sidebar and inventory groups", () => {
    const mainCfg = read(".storybook/main.js");
    assert.match(
      mainCfg,
      /@storybook\/html-vite/,
      "framework @storybook/html-vite required"
    );
    assert.match(
      mainCfg,
      /stories\/\*\*\/\*\.stories\.js/,
      "stories glob required"
    );
    assert.match(mainCfg, /@ds-assets/, "Vite alias @ds-assets required");
    assert.match(
      mainCfg,
      /ds-showcase[/\\]assets/,
      "alias target ds-showcase/assets required"
    );

    for (const group of ["Chip", "Card", "Sidebar"]) {
      const rel = `stories/${group}.stories.js`;
      assert.ok(fs.existsSync(abs(rel)), `missing required story ${rel}`);
      const src = read(rel);
      assert.match(
        src,
        new RegExp(`title:\\s*["']${group}["']`),
        `${rel} must declare title ${group}`
      );
      assert.match(src, /\brender\s*:/, `${rel} must export a render`);
    }

    for (const group of STORY_GROUPS) {
      const rel = `stories/${group}.stories.js`;
      assert.ok(fs.existsSync(abs(rel)), `missing inventory story ${rel}`);
    }

    assert.equal(
      fs.existsSync(abs("stories/_inventory.stub.stories.js")),
      false,
      "inventory stub should be replaced by named story files"
    );
  });

  it("TC-UNIT-01: preview.js imports both DS CSS paths", () => {
    const preview = read(".storybook/preview.js");
    assert.match(
      preview,
      /import\s+["']\.\.\/ds-showcase\/css\/tokens\.css["']/,
      "tokens.css import required"
    );
    assert.match(
      preview,
      /import\s+["']\.\.\/ds-showcase\/css\/components\.css["']/,
      "components.css import required"
    );
  });

  it("portfolio.css defines .viewport overflow and .world transform-origin without DS tokens", () => {
    const css = read("portfolio/css/portfolio.css");
    assert.match(css, /\.viewport\s*\{[^}]*overflow:\s*hidden/s);
    assert.match(css, /cursor-figma\.png/);
    assert.match(
      css,
      /\.scene-chrome(?:\.ds-sidebar|\[data-node-kind=["']sidebar["']\])[^}]*cursor:\s*auto/s
    );
    assert.match(css, /\.camera-pan\s*\{[^}]*transform-origin:\s*0\s+0/s);
    assert.match(css, /\.world\s*\{[^}]*position:\s*relative/s);
    assert.match(css, /\.world\s*\{[^}]*transform-origin:\s*0\s+0/s);
    assert.doesNotMatch(css, /will-change:\s*transform/);
    assert.doesNotMatch(css, /--color-/);
    assert.doesNotMatch(css, /--type-/);
  });
});
