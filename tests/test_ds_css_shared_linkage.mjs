/**
 * Shared DS CSS linkage: portfolio + Storybook → ds-showcase (task 3.3).
 *
 * TC-E2E-02: no second tokens.css / components.css outside ds-showcase/css
 * TC-UNIT-01: Black token remains product #232323
 * Linkage: portfolio HTML and Storybook preview reference ds-showcase/css/*
 * Parity: Tapper 104×40, Card 310×310 declared in shared components.css
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const CANON_TOKENS = path.join(REPO_ROOT, "ds-showcase", "css", "tokens.css");
const CANON_COMPONENTS = path.join(
  REPO_ROOT,
  "ds-showcase",
  "css",
  "components.css"
);

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  "design",
  ".cursor",
  "storybook-static",
]);

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

/**
 * Walk repo for files named basename; skip vendor/design trees.
 * @param {string} basename
 * @returns {string[]} absolute paths
 */
function findFilesNamed(basename) {
  /** @type {string[]} */
  const found = [];

  /**
   * @param {string} dir
   */
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (SKIP_DIR_NAMES.has(entry.name)) {
        continue;
      }
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (entry.isFile() && entry.name === basename) {
        found.push(full);
      }
    }
  }

  walk(REPO_ROOT);
  return found;
}

/**
 * @param {string} css
 * @param {string} selector
 * @returns {string|null}
 */
function ruleBody(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?<![\\w-])${escaped}\\s*\\{([^}]*)\\}`, "m");
  const m = re.exec(css);
  return m ? m[1] : null;
}

/**
 * @param {string} body
 * @param {string} prop
 * @returns {number|null}
 */
function declaredPx(body, prop) {
  const re = new RegExp(`${prop}\\s*:\\s*([\\d.]+)px`, "i");
  const m = re.exec(body);
  return m ? Number(m[1]) : null;
}

/**
 * @param {number|null} actual
 * @param {number} target
 * @param {string} label
 */
function assertWithinTol(actual, target, label) {
  assert.ok(actual !== null, `${label}: missing px declaration`);
  assert.ok(
    Math.abs(actual - target) <= 2,
    `${label}: ${actual}px not within ±2 of ${target}px`
  );
}

describe("ds CSS shared linkage (no fork)", () => {
  it("portfolio HTML and Storybook preview link ds-showcase/css/* only", () => {
    const html = read("portfolio/main.html");
    assert.match(
      html,
      /href=["']\.\.\/ds-showcase\/css\/tokens\.css["']/,
      "portfolio must link ds-showcase tokens.css"
    );
    assert.match(
      html,
      /href=["']\.\.\/ds-showcase\/css\/components\.css["']/,
      "portfolio must link ds-showcase components.css"
    );
    assert.doesNotMatch(
      html,
      /href=["'](?:\.\/)?css\/tokens\.css["']/,
      "portfolio must not use a local tokens.css copy"
    );
    assert.doesNotMatch(
      html,
      /href=["'](?:\.\/)?css\/components\.css["']/,
      "portfolio must not use a local components.css copy"
    );

    const preview = read(".storybook/preview.js");
    assert.match(
      preview,
      /import\s+["']\.\.\/ds-showcase\/css\/tokens\.css["']/,
      "preview must import ds-showcase tokens.css"
    );
    assert.match(
      preview,
      /import\s+["']\.\.\/ds-showcase\/css\/components\.css["']/,
      "preview must import ds-showcase components.css"
    );

    const portfolioCss = read("portfolio/css/portfolio.css");
    assert.doesNotMatch(
      portfolioCss,
      /--color-black\s*:/,
      "portfolio.css must not redefine DS color tokens"
    );
    assert.doesNotMatch(
      portfolioCss,
      /^\s*\.ds-card\s*\{/m,
      "portfolio.css must not redefine base .ds-card rule"
    );
    assert.doesNotMatch(
      portfolioCss,
      /^\s*\.ds-tapper\s*\{/m,
      "portfolio.css must not redefine base .ds-tapper rule"
    );
    assert.doesNotMatch(
      portfolioCss,
      /^\s*\.ds-card\s*\{[^}]*width\s*:\s*310px/ms,
      "portfolio.css must not fork Card 310px box"
    );
    assert.doesNotMatch(
      portfolioCss,
      /^\s*\.ds-tapper\s*\{[^}]*width\s*:\s*104px/ms,
      "portfolio.css must not fork Tapper 104px box"
    );
  });

  it("TC-E2E-02: no second tokens.css / components.css outside ds-showcase/css", () => {
    const tokens = findFilesNamed("tokens.css");
    const components = findFilesNamed("components.css");

    assert.deepEqual(
      tokens.map((p) => path.relative(REPO_ROOT, p).split(path.sep).join("/")),
      ["ds-showcase/css/tokens.css"],
      `unexpected tokens.css copies: ${tokens.join(", ")}`
    );
    assert.deepEqual(
      components
        .map((p) => path.relative(REPO_ROOT, p).split(path.sep).join("/")),
      ["ds-showcase/css/components.css"],
      `unexpected components.css copies: ${components.join(", ")}`
    );

    assert.ok(fs.existsSync(CANON_TOKENS), "canonical tokens.css missing");
    assert.ok(
      fs.existsSync(CANON_COMPONENTS),
      "canonical components.css missing"
    );
  });

  it("TC-UNIT-01: Black token in tokens.css remains product #232323", () => {
    const css = fs.readFileSync(CANON_TOKENS, "utf8");
    const rootMatch = /:root\s*\{([\s\S]*?)\}/m.exec(css);
    assert.ok(rootMatch, ":root block required");
    const black = /--color-black\s*:\s*([^;]+);/i.exec(rootMatch[1]);
    assert.ok(black, "--color-black required");
    assert.equal(
      black[1].trim().toLowerCase(),
      "#232323",
      "Black must stay product #232323"
    );
  });

  it("parity: shared components.css Tapper 104×40 and Card 310×310 (±2px)", () => {
    const css = fs.readFileSync(CANON_COMPONENTS, "utf8");

    const tapper = ruleBody(css, ".ds-tapper");
    assert.ok(tapper, ".ds-tapper rule required");
    assertWithinTol(declaredPx(tapper, "width"), 104, ".ds-tapper width");
    assertWithinTol(declaredPx(tapper, "height"), 40, ".ds-tapper height");

    const card = ruleBody(css, ".ds-card");
    assert.ok(card, ".ds-card rule required");
    assertWithinTol(declaredPx(card, "width"), 310, ".ds-card width");
    assertWithinTol(declaredPx(card, "height"), 310, ".ds-card height");

    const chipStory = read("stories/Chip.stories.js");
    const cardStory = read("stories/Card.stories.js");
    const tapperStory = read("stories/Tapper.stories.js");
    assert.match(chipStory, /ds-chip/, "Chip story must use ds-chip classes");
    assert.match(cardStory, /ds-card/, "Card story must use ds-card classes");
    assert.match(tapperStory, /ds-tapper/, "Tapper story must use ds-tapper");
  });
});
