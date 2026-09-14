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

  it("main.html and case-dragon.html load metrika.js and noscript pixel", () => {
    for (const file of ["portfolio/main.html", "portfolio/case-dragon.html"]) {
      const html = read(file);
      assert.match(html, /src=["']js\/metrika\.js["']/, `${file} script`);
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
