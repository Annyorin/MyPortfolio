/**
 * Unit: internal URL detection, prefetch, and soft crossfade wiring.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  isInternalPortfolioUrl,
  PAGE_CROSSFADE_MS,
  PAGE_CROSSFADE_NAVIGATE_AFTER_MS,
  prefetchInternalPage,
} from "../portfolio/js/pageTransition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

/**
 * @param {string} relativePath
 * @returns {string}
 */
function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

describe("portfolio pageTransition", () => {
  it("isInternalPortfolioUrl: relative yes, http/mailto/hash no", () => {
    assert.equal(isInternalPortfolioUrl("case-dragon.html"), true);
    assert.equal(isInternalPortfolioUrl("./case-dragon.html"), true);
    assert.equal(isInternalPortfolioUrl("https://behance.net/x"), false);
    assert.equal(isInternalPortfolioUrl("http://example.com"), false);
    assert.equal(isInternalPortfolioUrl("mailto:a@b.c"), false);
    assert.equal(isInternalPortfolioUrl("#contacts"), false);
    assert.equal(isInternalPortfolioUrl(""), false);
  });

  it("navigate overlaps a soft crossfade: AFTER < DURATION ≤ 300", () => {
    assert.equal(PAGE_CROSSFADE_MS, 240);
    assert.equal(PAGE_CROSSFADE_NAVIGATE_AFTER_MS, 180);
    assert.ok(PAGE_CROSSFADE_NAVIGATE_AFTER_MS < PAGE_CROSSFADE_MS);
    assert.ok(PAGE_CROSSFADE_MS <= 300);
  });

  it("prefetchInternalPage inserts a single link[rel=prefetch] per url", () => {
    const created = [];
    const prevDoc = globalThis.document;
    const prevWin = globalThis.window;
    globalThis.document = {
      head: {
        appendChild(node) {
          created.push(node);
        },
      },
      createElement() {
        return { rel: "", href: "" };
      },
    };
    globalThis.window = {
      location: { href: "http://localhost:5173/portfolio/main.html" },
    };
    try {
      prefetchInternalPage("https://behance.net/x");
      prefetchInternalPage("case-dragon.html");
      prefetchInternalPage("case-dragon.html");
      assert.equal(created.length, 1);
      assert.equal(created[0].rel, "prefetch");
      assert.match(String(created[0].href), /case-dragon\.html$/);
    } finally {
      globalThis.document = prevDoc;
      globalThis.window = prevWin;
    }
  });

  it("home uses a soft blur dissolve without sheet or card stretch", () => {
    const css = read("portfolio/css/portfolio.css");
    const js = read("portfolio/js/pageTransition.js");
    const caseCss = read("portfolio/css/case.css");
    const caseHtml = read("portfolio/case-dragon.html");
    const caseJs = read("portfolio/js/case.js");
    const interactions = read("portfolio/js/interactions.js");
    const mobile = read("portfolio/js/mobile.js");
    const config = read("vite.config.js");

    assert.match(js, /PAGE_CROSSFADE_NAVIGATE_AFTER_MS/);
    assert.match(js, /scheduleClearEnterCrossfade/);
    assert.match(js, /is-page-enter-crossfade/);
    assert.match(js, /remove\?\.\(["']is-page-enter-crossfade["']\)/);
    assert.match(js, /prefetchInternalPage/);
    assert.match(js, /resetPageTransitionUi/);
    assert.match(js, /pageshow/);
    assert.match(js, /pagehide/);
    assert.doesNotMatch(js, /cloneNode/);
    assert.doesNotMatch(js, /scale\(/);
    assert.doesNotMatch(js, /navigateWithSheet/);
    assert.doesNotMatch(css, /translateY\(100%\)/);
    assert.doesNotMatch(css, /ab-motion-badge/);
    assert.doesNotMatch(css, /portfolio-page-transition__ghost/);
    assert.doesNotMatch(css, /left 560ms/);
    assert.doesNotMatch(css, /width 560ms/);
    assert.match(css, /is-page-crossfading/);
    assert.match(css, /blur\(4px\)/);
    assert.match(css, /opacity 240ms/);
    assert.match(css, /page-crossfade-in/);

    assert.match(caseCss, /is-page-enter-crossfade/);
    assert.match(caseCss, /case-crossfade-in/);
    assert.match(caseCss, /240ms/);
    assert.match(caseHtml, /is-page-enter-crossfade/);
    assert.match(caseJs, /navigateWithExpand/);
    assert.match(caseJs, /bindHomeLinks/);
    assert.match(read("portfolio/main.html"), /is-page-enter-crossfade/);
    assert.match(read("portfolio/js/main.js"), /consumeEnterCrossfade/);

    assert.match(interactions, /prefetchCardIfInternal/);
    assert.match(mobile, /prefetchCardIfInternal/);
    assert.doesNotMatch(config, /main-crossfade/);
  });
});
