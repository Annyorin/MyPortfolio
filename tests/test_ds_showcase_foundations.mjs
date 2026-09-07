/**
 * Tests for ds-showcase Foundations catalog (task 2.2).
 *
 * TC-E2E-01: six swatches with names/hex; no GrayL; type samples use §3.1 tokens; light page.
 * TC-UNIT-01: DOM count of .ds-swatch === 6.
 * Regression: smoke 1.3; token values from 2.1 unchanged.
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
const INDEX_PATH = path.join(SHOWCASE_ROOT, "index.html");
const SHOWCASE_CSS_PATH = path.join(SHOWCASE_ROOT, "css", "showcase.css");
const TOKENS_PATH = path.join(SHOWCASE_ROOT, "css", "tokens.css");

/** Swatch order and hex from TZ §3.1 (GrayL excluded). */
const SWATCHES = [
  { token: "primary", label: "Primary", hex: "#64b3f9", cssVar: "--color-primary" },
  { token: "secondary", label: "Secondary", hex: "#ededed", cssVar: "--color-secondary" },
  { token: "gray-dark", label: "Gray_dark", hex: "#e4e4e4", cssVar: "--color-gray-dark" },
  { token: "gray-text", label: "Gray_text", hex: "#888888", cssVar: "--color-gray-text" },
  { token: "black", label: "Black", hex: "#232323", cssVar: "--color-black" },
  { token: "white", label: "White", hex: "#fefefe", cssVar: "--color-white" },
];

const TYPE_SPECIMENS = [
  {
    modifier: "h1",
    label: "Заголовок 1",
    size: "var(--type-h1-size)",
    line: "var(--type-h1-line)",
    weight: "var(--type-h1-weight)",
  },
  {
    modifier: "h2",
    label: "Заголовок 2",
    size: "var(--type-h2-size)",
    line: "var(--type-h2-line)",
    weight: "var(--type-h2-weight)",
  },
  {
    modifier: "text",
    label: "Текст",
    size: "var(--type-text-size)",
    line: "var(--type-text-line)",
    weight: "var(--type-text-weight)",
  },
  {
    modifier: "caption",
    label: "Подписи",
    size: "var(--type-caption-size)",
    line: "var(--type-caption-line)",
    weight: "var(--type-caption-weight)",
  },
];

/** Canon token hex from task 2.1 / TZ §3.1 (regression). */
const COLOR_TOKENS_REGRESSION = {
  "--color-primary": "#64b3f9",
  "--color-secondary": "#ededed",
  "--color-white": "#fefefe",
  "--color-black": "#232323",
  "--color-gray-text": "#888888",
  "--color-gray-dark": "#e4e4e4",
  "--color-gray-l": "#6b6b6b",
};

/**
 * Extract Foundations section HTML.
 * @param {string} html
 * @returns {string}
 */
function foundationsBlock(html) {
  const m = /aria-labelledby=["']section-foundations["'][\s\S]*?<\/section>/i.exec(html);
  assert.ok(m, "Foundations section missing");
  return m[0];
}

/**
 * Parse :root custom properties from tokens.css.
 * @param {string} css
 * @returns {Map<string, string>}
 */
function parseRootCustomProperties(css) {
  const rootMatch = /:root\s*\{([\s\S]*?)\}/m.exec(css);
  assert.ok(rootMatch, ":root block required in tokens.css");
  const map = new Map();
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = re.exec(rootMatch[1])) !== null) {
    map.set(match[1].toLowerCase(), match[2].trim());
  }
  return map;
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeHex(value) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value.trim());
  if (!m) return value.trim().toLowerCase().replace(/\s+/g, " ");
  return `#${m[1].toLowerCase()}`;
}

/**
 * GET from local static server.
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

describe("TC-UNIT-01 Foundations swatch count", () => {
  it("DOM has exactly six .ds-swatch and no GrayL swatch", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const block = foundationsBlock(html);
    const swatches = block.match(/class=["']ds-swatch["']/g) || [];
    assert.equal(swatches.length, 6, `Expected 6 .ds-swatch, got ${swatches.length}`);

    assert.doesNotMatch(block, /data-token=["']gray-l["']/i);
    assert.doesNotMatch(block, /\bGrayL\b/);
    assert.doesNotMatch(block, /#6b6b6b/i);
  });
});

describe("TC-E2E-01 Foundations catalog contract", () => {
  it("six named swatches with hex; backgrounds via var(--color-*); 80×80", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const css = fs.readFileSync(SHOWCASE_CSS_PATH, "utf8");
    const block = foundationsBlock(html);

    for (const s of SWATCHES) {
      assert.ok(block.includes(s.label), `Missing label: ${s.label}`);
      assert.ok(
        block.toLowerCase().includes(s.hex.toLowerCase()),
        `Missing hex for ${s.label}: ${s.hex}`
      );
      assert.ok(
        block.includes(`data-token="${s.token}"`),
        `Missing data-token=${s.token}`
      );

      const tokenRule = new RegExp(
        `\\.ds-swatch\\[data-token=["']${s.token}["']\\]\\s*\\{[^}]*background-color\\s*:\\s*var\\(${s.cssVar.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}\\)`,
        "i"
      );
      assert.ok(tokenRule.test(css), `${s.token} must use background-color: var(${s.cssVar})`);
    }

    assert.match(css, /\.ds-swatch\s*\{[^}]*width\s*:\s*80px/i);
    assert.match(css, /\.ds-swatch\s*\{[^}]*height\s*:\s*80px/i);
    assert.doesNotMatch(css, /\.ds-swatch\[data-token=["']gray-l["']\]/i);
  });

  it("type specimens use Inter tokens and Russian labels from layout", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const css = fs.readFileSync(SHOWCASE_CSS_PATH, "utf8");
    const block = foundationsBlock(html);

    for (const t of TYPE_SPECIMENS) {
      assert.ok(block.includes(t.label), `Type label missing: ${t.label}`);
      assert.ok(
        new RegExp(`ds-type--${t.modifier}\\b`).test(block),
        `Missing class ds-type--${t.modifier}`
      );

      const rule = new RegExp(`\\.ds-type--${t.modifier}\\s*\\{([\\s\\S]*?)\\}`, "i");
      const m = rule.exec(css);
      assert.ok(m, `.ds-type--${t.modifier} rule missing`);
      const body = m[1];
      assert.ok(body.includes(t.size), `${t.modifier} size token`);
      assert.ok(body.includes(t.line), `${t.modifier} line token`);
      assert.ok(body.includes(t.weight), `${t.modifier} weight token`);
    }

    assert.match(css, /\.ds-type\s*\{[^}]*font-family\s*:\s*Inter\s*,\s*sans-serif/i);
  });

  it("page background is light via --page-bg", () => {
    const css = fs.readFileSync(SHOWCASE_CSS_PATH, "utf8");
    assert.match(css, /body\s*\{[^}]*background-color\s*:\s*var\(--page-bg\)/i);
    assert.match(css, /\.ds-showcase\s*\{[^}]*background-color\s*:\s*var\(--page-bg\)/i);

    const tokens = fs.readFileSync(TOKENS_PATH, "utf8");
    const props = parseRootCustomProperties(tokens);
    const pageBg = (props.get("--page-bg") || "").toLowerCase();
    assert.ok(
      pageBg === "var(--color-white)" ||
        normalizeHex(pageBg) === "#ffffff" ||
        normalizeHex(pageBg) === "#fefefe",
      `--page-bg must be light, got ${pageBg}`
    );
  });

  it("HTTP serves Foundations with six swatches and type labels", async () => {
    const { port, close } = await startStaticServer();
    try {
      const { status, body } = await httpGet(port, "/index.html");
      assert.equal(status, 200);
      const html = body.toString("utf8");
      const block = foundationsBlock(html);
      const swatches = block.match(/class=["']ds-swatch["']/g) || [];
      assert.equal(swatches.length, 6);
      for (const label of ["Заголовок 1", "Заголовок 2", "Текст", "Подписи"]) {
        assert.ok(block.includes(label));
      }
      assert.doesNotMatch(block, /\bGrayL\b/);
    } finally {
      await close();
    }
  });
});

describe("Regression smoke 1.3 and tokens 2.1", () => {
  it("index opens over HTTP with five IA sections", async () => {
    const { port, close } = await startStaticServer();
    try {
      const { status, body } = await httpGet(port, "/index.html");
      assert.equal(status, 200);
      const html = body.toString("utf8");
      const h2 = [];
      const re = /<h2\b[^>]*>([^<]*)<\/h2>/gi;
      let m;
      while ((m = re.exec(html)) !== null) h2.push(m[1].trim());
      assert.deepEqual(h2, ["Foundations", "Icons", "Atomic", "Composite", "Media"]);
    } finally {
      await close();
    }
  });

  it("token ColorToken hex values from 2.1 did not regress", () => {
    const css = fs.readFileSync(TOKENS_PATH, "utf8");
    const props = parseRootCustomProperties(css);
    for (const [name, expected] of Object.entries(COLOR_TOKENS_REGRESSION)) {
      assert.equal(
        normalizeHex(props.get(name) || ""),
        normalizeHex(expected),
        `regression ${name}`
      );
    }
  });
});
