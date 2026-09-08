/**
 * Page shell NFR: layout, a11y, A1/A2 degradations.
 *
 * TC-E2E-01: viewport ≥1280 — no critical horizontal scroll contract in CSS.
 * TC-E2E-02: narrow viewport — vertical stack / wrap rules present.
 * TC-E2E-03 (A1): Inter weights limited; sans-serif fallback preserves type tokens.
 * TC-E2E-04 (A2): broken image path keeps .ds-placeholder proportions; page usable.
 * TC-E2E-05: focus-visible + accessible names on Link / Hover / Tapper / Contacts.
 * TC-UNIT-01: main + ≥5 section.
 * Regression: Atomic+Composite inventory; no-mock smoke section order.
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
const SHOWCASE_CSS = path.join(SHOWCASE_ROOT, "css", "showcase.css");
const TOKENS_CSS = path.join(SHOWCASE_ROOT, "css", "tokens.css");
const COMPONENTS_CSS = path.join(SHOWCASE_ROOT, "css", "components.css");

const SECTION_ORDER = ["Foundations", "Icons", "Atomic", "Composite", "Media"];

/**
 * Collect h2 text contents in document order.
 * @param {string} html
 * @returns {string[]}
 */
function collectH2Texts(html) {
  const titles = [];
  const re = /<h2\b[^>]*>([^<]*)<\/h2>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    titles.push(match[1].trim());
  }
  return titles;
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

describe("TC-UNIT-01 main and sections", () => {
  it("has main and at least five section elements", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    assert.match(html, /<main\b[^>]*class=["'][^"']*\bds-showcase\b/);
    const sections = html.match(/<section\b/gi) || [];
    assert.ok(sections.length >= 5, `expected ≥5 section, got ${sections.length}`);
    assert.deepEqual(collectH2Texts(html), SECTION_ORDER);
    assert.match(html, /<h1\b[^>]*>\s*DS Showcase\s*<\/h1>/i);
  });
});

describe("TC-E2E-01 viewport 1280+ no critical horizontal scroll", () => {
  it("showcase CSS clamps overflow at min-width 1280px and keeps light page bg", () => {
    const css = fs.readFileSync(SHOWCASE_CSS, "utf8");
    const tokens = fs.readFileSync(TOKENS_CSS, "utf8");

    assert.match(css, /@media\s*\(\s*min-width\s*:\s*1280px\s*\)/);
    assert.match(css, /overflow-x\s*:\s*hidden/);
    assert.match(css, /\.ds-showcase\s*\{[\s\S]*max-width\s*:\s*100%/);
    assert.match(css, /background-color\s*:\s*var\(\s*--page-bg\s*\)/);
    assert.match(tokens, /--page-bg\s*:\s*var\(\s*--color-white\s*\)/);
    assert.doesNotMatch(css, /prefers-color-scheme\s*:\s*dark/);
    assert.doesNotMatch(tokens, /prefers-color-scheme\s*:\s*dark/);
  });
});

describe("TC-E2E-02 narrow viewport vertical stack", () => {
  it("declares max-width 1279 stacking / wrap rules for sections and samples", () => {
    const css = fs.readFileSync(SHOWCASE_CSS, "utf8");
    assert.match(css, /@media\s*\(\s*max-width\s*:\s*1279px\s*\)/);
    assert.match(
      css,
      /@media\s*\(\s*max-width\s*:\s*1279px\s*\)\s*\{[\s\S]*flex-wrap\s*:\s*wrap/
    );
    assert.match(
      css,
      /section-composite[\s\S]*flex-direction\s*:\s*column|flex-direction\s*:\s*column[\s\S]*section-composite/
    );
  });
});

describe("TC-E2E-03 A1 font fallback hierarchy", () => {
  it("loads only Inter 400/500/600 and keeps type size/weight tokens with sans-serif fallback", () => {
    const tokens = fs.readFileSync(TOKENS_CSS, "utf8");
    const showcase = fs.readFileSync(SHOWCASE_CSS, "utf8");

    assert.match(tokens, /family=Inter:wght@400;500;600/);
    assert.doesNotMatch(tokens, /wght@[^"'\s]*700|wght@[^"'\s]*300|wght@[^"'\s]*800/);
    assert.match(showcase, /font-family\s*:\s*Inter\s*,\s*sans-serif/);

    for (const role of ["h1", "h2", "text", "caption"]) {
      assert.match(tokens, new RegExp(`--type-${role}-size\\s*:`));
      assert.match(tokens, new RegExp(`--type-${role}-line\\s*:`));
      assert.match(tokens, new RegExp(`--type-${role}-weight\\s*:`));
    }

    assert.match(tokens, /--type-h1-size\s*:\s*20px/);
    assert.match(tokens, /--type-h2-size\s*:\s*16px/);
    assert.match(tokens, /--type-text-size\s*:\s*16px/);
    assert.match(tokens, /--type-caption-size\s*:\s*12px/);
  });
});

describe("TC-E2E-04 A2 broken image keeps placeholder", () => {
  it("broken src yields 404; placeholder CSS + remaining sections stay available", async () => {
    const targetRel = "assets/images/img-2.png";
    const targetAbs = path.join(SHOWCASE_ROOT, targetRel);
    const tmpAbs = path.join(SHOWCASE_ROOT, "assets/images/img-2.png.__missing__");

    assert.ok(fs.existsSync(targetAbs), "img-2.png must exist before A2 test");

    const css = fs.readFileSync(SHOWCASE_CSS, "utf8");
    assert.match(css, /\.ds-placeholder\s*\{/);
    assert.match(css, /\.ds-avatar\.ds-placeholder/);
    assert.match(css, /aspect-ratio|flex-shrink\s*:\s*0/);

    const htmlBefore = fs.readFileSync(INDEX_PATH, "utf8");
    assert.match(htmlBefore, /class="ds-avatar ds-placeholder"/);
    assert.match(
      htmlBefore,
      /data-media=["']img_2["'][^>]*style=["'][^"']*aspect-ratio:\s*345\/230/
    );

    fs.renameSync(targetAbs, tmpAbs);
    try {
      const { port, close } = await startStaticServer();
      try {
        const page = await httpGet(port, "/index.html");
        assert.equal(page.status, 200, "page must stay usable");
        const html = page.body.toString("utf8");
        assert.deepEqual(collectH2Texts(html), SECTION_ORDER);

        const missing = await httpGet(port, `/${targetRel}`);
        assert.equal(missing.status, 404, "broken asset path must 404");

        const other = await httpGet(port, "/assets/images/img-bg.png");
        assert.equal(other.status, 200, "other media must remain available");
      } finally {
        await close();
      }
    } finally {
      if (fs.existsSync(tmpAbs)) {
        fs.renameSync(tmpAbs, targetAbs);
      }
    }

    assert.ok(fs.existsSync(targetAbs), "img-2.png must be restored after A2 test");
  });
});

describe("TC-E2E-05 keyboard focus and accessible names", () => {
  it("focus-visible on Link / Hover / Tapper / Contacts; aria-label and alt present", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const components = fs.readFileSync(COMPONENTS_CSS, "utf8");

    assert.match(components, /\.ds-link:focus-visible\s*\{/);
    assert.match(components, /\.ds-hover:focus-visible\s*\{/);
    assert.match(components, /\.ds-tapper:focus-visible\s*\{/);
    assert.match(components, /\.ds-button:focus-visible\s*\{/);

    assert.match(html, /class="ds-tapper"[^>]*aria-label="Tapper"/);
    assert.match(html, /class="ds-hover"[^>]*aria-label="Behance"/);
    assert.match(html, /ds-sidebar__skills[^>]*aria-label="Contacts"/);

    const icons = /aria-labelledby=["']section-icons["'][\s\S]*?<\/section>/i.exec(html);
    assert.ok(icons, "Icons section");
    for (const name of ["close", "Plus", "Minus", "vuesax/linear/arrow-right", "telegram", "mail", "CursorFigma"]) {
      assert.ok(icons[0].includes(`aria-label="${name}"`), `Icon aria-label missing: ${name}`);
    }

    const mediaImgs = html.match(/<img\b[^>]*assets\/images\/[^>]*>/gi) || [];
    assert.ok(mediaImgs.length >= 5);
    for (const tag of mediaImgs) {
      assert.match(tag, /\balt\s*=/, `raster img missing alt: ${tag}`);
    }

    assert.doesNotMatch(html, /\bds-empty\b|\bds-loading\b|\bds-error-screen\b/i);
  });
});

describe("Regression Atomic+Composite and smoke IA", () => {
  it("keeps Chip/Link/Card variants and five IA sections over HTTP", async () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    assert.ok(html.includes("ds-chip--default") && html.includes("ds-chip--active"));
    assert.ok(html.includes("ds-link--default") && html.includes("ds-link--hover"));
    assert.ok(html.includes("ds-card--default") && html.includes("ds-card--hover"));
    assert.ok(html.includes("ds-sidebar"));
    assert.doesNotMatch(html, /якорн|оглавлени|table of contents/i);

    const { port, close } = await startStaticServer();
    try {
      const { status, body } = await httpGet(port, "/index.html");
      assert.equal(status, 200);
      assert.deepEqual(collectH2Texts(body.toString("utf8")), SECTION_ORDER);
    } finally {
      await close();
    }
  });
});
