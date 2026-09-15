/**
 * Yandex Metrika on portfolio HTML entries (counter + Webvisor).
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
function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

const COUNTER_ID = "98871536";

describe("Yandex Metrika", () => {
  it("metrika.js inits the counter with Webvisor", () => {
    const src = read("portfolio/js/metrika.js");
    assert.match(src, /mc\.yandex\.ru\/metrika\/tag\.js/);
    assert.match(src, new RegExp(`ym\\(${COUNTER_ID},\\s*"init"`));
    assert.match(src, /webvisor:\s*true/);
    assert.match(src, /clickmap:\s*true/);
    assert.match(src, /trackLinks:\s*true/);
    assert.match(src, /accurateTrackBounce:\s*true/);
  });

  it("main.html, case-dragon.html and case-phish.html inline the counter (Vite does not emit js/metrika.js)", () => {
    for (const file of [
      "portfolio/main.html",
      "portfolio/case-dragon.html",
      "portfolio/case-phish.html",
    ]) {
      const html = read(file);
      assert.doesNotMatch(html, /src=["']js\/metrika\.js["']/, `${file} no external 404`);
      assert.match(html, /mc\.yandex\.ru\/metrika\/tag\.js/, `${file} tag.js`);
      assert.match(html, new RegExp(`ym\\(${COUNTER_ID},\\s*"init"`), `${file} init`);
      assert.match(html, /webvisor:\s*true/, `${file} Webvisor`);
      assert.match(
        html,
        new RegExp(`mc\\.yandex\\.ru/watch/${COUNTER_ID}`),
        `${file} noscript`
      );
    }
  });

  it("index.html redirect does not load Metrika (avoids a double hit)", () => {
    const html = read("portfolio/index.html");
    assert.doesNotMatch(html, /metrika/);
    assert.doesNotMatch(html, new RegExp(COUNTER_ID));
  });
});
