/**
 * Tests for ds-showcase scaffold (task 1.1).
 *
 * TC-UNIT-01: architecture §3.4 file structure and CSS contract names.
 * TC-E2E-01: index.html parses and linked CSS files resolve (no 404).
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const SHOWCASE_ROOT = path.join(REPO_ROOT, "ds-showcase");

const REQUIRED_PATHS = [
  "README.md",
  "index.html",
  "css/tokens.css",
  "css/components.css",
  "css/showcase.css",
  "assets/icons",
  "assets/images",
  "assets/fonts",
].map((p) => path.join(SHOWCASE_ROOT, p));

const REQUIRED_COMPONENT_SELECTORS = [
  ".ds-avatar",
  ".ds-profile",
  ".ds-chip",
  ".ds-link",
  ".ds-tapper",
  ".ds-tooltip",
  ".ds-stiker",
  ".ds-hover",
  ".ds-card",
  ".ds-sidebar",
  ".ds-icon",
  ".ds-chip--default",
  ".ds-chip--active",
  ".ds-link--default",
  ".ds-link--hover",
  ".ds-card--default",
  ".ds-card--hover",
  ".ds-sidebar__designer",
  ".ds-sidebar__profile",
  ".ds-sidebar__inform",
  ".ds-sidebar__skills",
  ".ds-sidebar__copyright",
  ".ds-button",
  ".ds-button--primary",
  ".ds-button--secondary",
  ".ds-profile--mobile",
  ".ds-fab",
];

const REQUIRED_SHOWCASE_SELECTORS = [
  ".ds-showcase",
  ".ds-section",
  ".ds-swatch",
  ".ds-media",
  ".ds-placeholder",
];

const REQUIRED_TOKEN_VARS = [
  "--color-primary",
  "--color-secondary",
  "--color-white",
  "--color-black",
  "--color-gray-text",
  "--color-gray-dark",
  "--color-gray-l",
  "--shadow",
  "--type-h1-size",
  "--type-h1-line",
  "--type-h1-weight",
  "--type-h2-size",
  "--type-h2-line",
  "--type-h2-weight",
  "--type-text-size",
  "--type-text-line",
  "--type-text-weight",
  "--type-text-2-size",
  "--type-text-2-line",
  "--type-text-2-weight",
  "--color-primary-hover",
  "--type-caption-size",
  "--type-caption-line",
  "--type-caption-weight",
  "--page-bg",
];

const EXPECTED_CSS_HREFS = [
  "css/tokens.css",
  "css/components.css",
  "css/showcase.css",
];

/**
 * Return true if selector appears as a CSS rule start.
 * @param {string} css
 * @param {string} selector
 */
function selectorDeclared(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?<![\\w-])${escaped}\\s*\\{`);
  return pattern.test(css);
}

/**
 * Collect stylesheet hrefs from HTML link tags.
 * @param {string} html
 * @returns {string[]}
 */
function collectStylesheetHrefs(html) {
  const hrefs = [];
  const linkRe = /<link\b[^>]*>/gi;
  let match;
  while ((match = linkRe.exec(html)) !== null) {
    const tag = match[0];
    const relMatch = /\brel\s*=\s*["']([^"']+)["']/i.exec(tag);
    const hrefMatch = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag);
    if (!relMatch || !hrefMatch) continue;
    if (relMatch[1].toLowerCase().includes("stylesheet")) {
      hrefs.push(hrefMatch[1]);
    }
  }
  return hrefs;
}

/**
 * GET a path from a local static server rooted at SHOWCASE_ROOT.
 * @param {number} port
 * @param {string} urlPath
 * @returns {Promise<{status:number, body:Buffer}>}
 */
function httpGet(port, urlPath) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${port}${urlPath}`, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks) });
        });
      })
      .on("error", reject);
  });
}

describe("TC-UNIT-01 file structure and CSS contract", () => {
  it("architecture §3.4 paths exist", () => {
    const missing = REQUIRED_PATHS.filter((p) => !fs.existsSync(p));
    assert.deepEqual(missing, [], `Missing paths: ${missing.join(", ")}`);
  });

  it("components.css declares required selectors", () => {
    const css = fs.readFileSync(path.join(SHOWCASE_ROOT, "css", "components.css"), "utf8");
    const missing = REQUIRED_COMPONENT_SELECTORS.filter((sel) => !selectorDeclared(css, sel));
    assert.deepEqual(missing, [], `Missing component selectors: ${missing.join(", ")}`);
  });

  it("showcase.css declares layout stubs", () => {
    const css = fs.readFileSync(path.join(SHOWCASE_ROOT, "css", "showcase.css"), "utf8");
    const missing = REQUIRED_SHOWCASE_SELECTORS.filter((sel) => !selectorDeclared(css, sel));
    assert.deepEqual(missing, [], `Missing showcase selectors: ${missing.join(", ")}`);
  });

  it("tokens.css declares foundation variable names", () => {
    const css = fs.readFileSync(path.join(SHOWCASE_ROOT, "css", "tokens.css"), "utf8");
    const missing = REQUIRED_TOKEN_VARS.filter((name) => !css.includes(name));
    assert.deepEqual(missing, [], `Missing token variables: ${missing.join(", ")}`);
  });
});

describe("TC-E2E-01 index.html entry and CSS delivery", () => {
  it("HTML parses stylesheet links and files resolve on disk", () => {
    const indexPath = path.join(SHOWCASE_ROOT, "index.html");
    const html = fs.readFileSync(indexPath, "utf8");

    assert.match(html, /<!DOCTYPE html>/i, "HTML must start with DOCTYPE");
    assert.doesNotMatch(html, /<\/html>\s*<[^!]/i, "Unexpected content after </html>");

    const hrefs = collectStylesheetHrefs(html);
    assert.deepEqual(hrefs, EXPECTED_CSS_HREFS);

    for (const href of hrefs) {
      const cssPath = path.join(SHOWCASE_ROOT, href);
      assert.ok(fs.existsSync(cssPath), `CSS link 404: ${href}`);
    }

    const fileUrl = pathToFileURL(indexPath).href;
    assert.match(fileUrl, /^file:/);
  });

  it("static HTTP server returns index and three CSS without 404", async () => {
    const server = http.createServer((req, res) => {
      const reqPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const safePath = reqPath === "/" ? "/index.html" : reqPath;
      const filePath = path.normalize(path.join(SHOWCASE_ROOT, safePath));
      if (!filePath.startsWith(SHOWCASE_ROOT)) {
        res.writeHead(403);
        res.end();
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("not found");
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    });

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());

    try {
      const paths = ["/index.html", "/css/tokens.css", "/css/components.css", "/css/showcase.css"];
      for (const p of paths) {
        const { status, body } = await httpGet(port, p);
        assert.equal(status, 200, `${p} expected 200, got ${status}`);
        assert.ok(body.length > 0, `${p} empty body`);
      }
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
