/**
 * Tests for ds-showcase token layer (task 2.1).
 *
 * TC-E2E-01: tokens.css served over HTTP; :root custom properties match canon.
 * TC-UNIT-01: ColorToken + GrayL + Shadow + TypographyStyle vs TZ §3.1.
 * Regression: no-mock smoke 1.3 (page opens with inventory).
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const SHOWCASE_ROOT = path.join(REPO_ROOT, "ds-showcase");
const TOKENS_PATH = path.join(SHOWCASE_ROOT, "css", "tokens.css");
const INDEX_PATH = path.join(SHOWCASE_ROOT, "index.html");

/** Canonical ColorToken hex from TZ §3.1 / architecture §4.2 (case-insensitive). */
const COLOR_TOKENS = {
  "--color-primary": "#64b3f9",
  "--color-primary-hover": "#79befc",
  "--color-secondary": "#ededed",
  "--color-white": "#fefefe",
  "--color-black": "#232323",
  "--color-gray-text": "#888888",
  "--color-gray-dark": "#e4e4e4",
  "--color-gray-l": "#6b6b6b",
};

const SHADOW_VALUE = "0 5px 9px #bbbbbd40";

const TYPE_TOKENS = {
  "--type-h1-size": "20px",
  "--type-h1-line": "24px",
  "--type-h1-weight": "600",
  "--type-h2-size": "16px",
  "--type-h2-line": "20px",
  "--type-h2-weight": "500",
  "--type-text-size": "16px",
  "--type-text-line": "20px",
  "--type-text-weight": "400",
  "--type-text-2-size": "14px",
  "--type-text-2-line": "18px",
  "--type-text-2-weight": "400",
  "--type-caption-size": "12px",
  "--type-caption-line": "16px",
  "--type-caption-weight": "500",
};

/**
 * Parse custom property declarations inside the first :root { ... } block.
 * @param {string} css
 * @returns {Map<string, string>}
 */
function parseRootCustomProperties(css) {
  const rootMatch = /:root\s*\{([\s\S]*?)\}/m.exec(css);
  assert.ok(rootMatch, ":root block required in tokens.css");
  const body = rootMatch[1];
  const map = new Map();
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = re.exec(body)) !== null) {
    map.set(match[1].toLowerCase(), match[2].trim());
  }
  return map;
}

/**
 * Normalize hex color for comparison (#RGB / #RRGGBB / #RRGGBBAA → lower).
 * @param {string} value
 * @returns {string}
 */
function normalizeHex(value) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value.trim());
  if (!m) return value.trim().toLowerCase().replace(/\s+/g, " ");
  return `#${m[1].toLowerCase()}`;
}

/**
 * Normalize shadow declaration for comparison.
 * @param {string} value
 * @returns {string}
 */
function normalizeShadow(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/rgba\(\s*187\s*,\s*187\s*,\s*189\s*,\s*0\.25\s*\)/g, "#bbbbbd40");
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

/**
 * Start static file server for SHOWCASE_ROOT on an ephemeral port.
 * @returns {Promise<{port:number, close:() => Promise<void>}>}
 */
function startStaticServer() {
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

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());
      resolve({
        port,
        close: () => new Promise((r) => server.close(() => r())),
      });
    });
  });
}

describe("TC-UNIT-01 token table vs TZ §3.1", () => {
  it("ColorToken hex, GrayL, Shadow and TypographyStyle match canon", () => {
    const css = fs.readFileSync(TOKENS_PATH, "utf8");
    const props = parseRootCustomProperties(css);

    for (const [name, expected] of Object.entries(COLOR_TOKENS)) {
      assert.ok(props.has(name), `Missing color token: ${name}`);
      assert.equal(
        normalizeHex(props.get(name)),
        normalizeHex(expected),
        `${name} expected ${expected}`
      );
    }

    assert.ok(props.has("--shadow"), "Missing --shadow");
    assert.equal(
      normalizeShadow(props.get("--shadow")),
      normalizeShadow(SHADOW_VALUE),
      `--shadow expected ${SHADOW_VALUE}`
    );

    for (const [name, expected] of Object.entries(TYPE_TOKENS)) {
      assert.ok(props.has(name), `Missing type token: ${name}`);
      assert.equal(props.get(name).toLowerCase(), expected.toLowerCase(), `${name}`);
    }

    assert.ok(props.has("--page-bg"), "Missing --page-bg");
    const pageBg = props.get("--page-bg").toLowerCase();
    assert.ok(
      pageBg === "var(--color-white)" ||
        normalizeHex(pageBg) === "#ffffff" ||
        normalizeHex(pageBg) === "#fefefe",
      `--page-bg must be white/near-white, got ${pageBg}`
    );

    assert.equal(normalizeHex(props.get("--color-black")), "#232323");

    const declaredNames = [...props.keys()];
    const forbiddenElevation = declaredNames.filter(
      (n) => n !== "--shadow" && /shadow|elevation|vv|вв/i.test(n)
    );
    assert.deepEqual(
      forbiddenElevation,
      [],
      `Unexpected elevation tokens: ${forbiddenElevation.join(", ")}`
    );
    assert.doesNotMatch(css, /4\s+9\s+18\.7|#b1b3bb40/i);
  });
});

describe("TC-E2E-01 :root computed contract via served tokens.css", () => {
  it("HTTP tokens.css exposes all 7 colors and canonical --shadow", async () => {
    const { port, close } = await startStaticServer();
    try {
      const { status, body } = await httpGet(port, "/css/tokens.css");
      assert.equal(status, 200, `tokens.css expected 200, got ${status}`);
      const css = body.toString("utf8");
      const props = parseRootCustomProperties(css);

      for (const [name, expected] of Object.entries(COLOR_TOKENS)) {
        assert.equal(
          normalizeHex(props.get(name) || ""),
          normalizeHex(expected),
          `served ${name}`
        );
      }

      assert.equal(
        normalizeShadow(props.get("--shadow") || ""),
        normalizeShadow(SHADOW_VALUE)
      );
      assert.equal(normalizeHex(props.get("--color-black") || ""), "#232323");

      for (const name of Object.keys(TYPE_TOKENS)) {
        assert.ok(props.has(name), `served missing ${name}`);
      }
    } finally {
      await close();
    }
  });
});

describe("Regression no-mock smoke 1.3", () => {
  it("index.html opens over HTTP with five sections", async () => {
    assert.ok(fs.existsSync(INDEX_PATH));
    const { port, close } = await startStaticServer();
    try {
      const { status, body } = await httpGet(port, "/index.html");
      assert.equal(status, 200);
      const html = body.toString("utf8");
      assert.match(html, /<main\b[^>]*class=["'][^"']*\bds-showcase\b/);
      const h2 = [];
      const re = /<h2\b[^>]*>([^<]*)<\/h2>/gi;
      let m;
      while ((m = re.exec(html)) !== null) h2.push(m[1].trim());
      assert.deepEqual(h2, ["Foundations", "Icons", "Atomic", "Composite", "Media"]);
    } finally {
      await close();
    }
  });
});
