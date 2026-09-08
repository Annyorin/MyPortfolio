/**
 * No-mock smoke for ds-showcase entrypoint (task 1.3).
 *
 * TC-E2E-01: real index.html over HTTP; five sections; inventory slots in DOM.
 * TC-E2E-02: no tracked changes under design/.
 * TC-UNIT-01: required product files exist.
 * Regression: DemoContent literals from shell suite (content-package §2.8.1).
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const SHOWCASE_ROOT = path.join(REPO_ROOT, "ds-showcase");
const INDEX_PATH = path.join(SHOWCASE_ROOT, "index.html");

const SECTION_ORDER = ["Foundations", "Icons", "Atomic", "Composite", "Media"];

const REQUIRED_PRODUCT_FILES = [
  "index.html",
  "css/tokens.css",
  "css/components.css",
  "css/showcase.css",
].map((p) => path.join(SHOWCASE_ROOT, p));

/** Demo strings regression (content-package / shell TC-E2E-01). */
const DEMO_CONTENT_LITERALS = [
  "Аня Ясинская",
  "Продуктовый дизайнер",
  "Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь.",
  "B2B",
  "Написать",
  "Резюме",
  "Behance",
  "Почта",
  "Link",
  "Обо мне",
  "CityBike",
  "· 2024",
  "Приложение для аренды электрических велосипедов. Удобный и экологичный транспорт по доступным ценам. Экономия времени в одно касание.",
];

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
 * Count class occurrences that include the given token as a whole class name fragment.
 * @param {string} html
 * @param {string} classToken
 * @returns {number}
 */
function countClassToken(html, classToken) {
  const re = new RegExp(
    `class=["'][^"']*\\b${classToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
    "gi"
  );
  return (html.match(re) || []).length;
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

describe("TC-UNIT-01 required product files", () => {
  it("index.html and three CSS files exist", () => {
    const missing = REQUIRED_PRODUCT_FILES.filter((p) => !fs.existsSync(p));
    assert.deepEqual(missing, [], `Missing: ${missing.join(", ")}`);
  });
});

describe("TC-E2E-01 no-mock smoke entrypoint", () => {
  it("file:// URL resolves to index.html on disk", () => {
    assert.ok(fs.existsSync(INDEX_PATH));
    const fileUrl = pathToFileURL(INDEX_PATH).href;
    assert.match(fileUrl, /^file:/);
    assert.ok(fileUrl.endsWith("index.html") || fileUrl.includes("index.html"));
  });

  it("HTTP serves index; five sections and inventory slots in DOM", async () => {
    const { port, close } = await startStaticServer();
    try {
      const { status, body } = await httpGet(port, "/index.html");
      assert.equal(status, 200, `index.html expected 200, got ${status}`);
      const html = body.toString("utf8");
      assert.ok(html.length > 0);

      assert.match(html, /<main\b[^>]*class=["'][^"']*\bds-showcase\b/);
      assert.deepEqual(collectH2Texts(html), SECTION_ORDER);

      assert.ok(countClassToken(html, "ds-avatar") >= 1, "Avatar slot");
      assert.ok(html.includes("ds-chip--default"), "Chip default");
      assert.ok(html.includes("ds-chip--active"), "Chip active");
      const chipSamples = /ds-chip-samples[\s\S]*?<\/div>/i.exec(html);
      assert.ok(chipSamples, "Chip samples block");
      const chipVariantCount = (chipSamples[0].match(/ds-chip--(?:default|active)/g) || []).length;
      assert.equal(chipVariantCount, 2, "Chip×2 in samples");

      assert.ok(html.includes("ds-link--default"), "Link default");
      assert.ok(html.includes("ds-link--hover"), "Link hover");
      const linkSamples = /ds-link-samples[\s\S]*?<\/div>/i.exec(html);
      assert.ok(linkSamples, "Link samples block");
      const linkVariantCount = (linkSamples[0].match(/ds-link--(?:default|hover)/g) || []).length;
      assert.equal(linkVariantCount, 2, "Link×2 in samples");

      assert.ok(html.includes("ds-card--default"), "Card default");
      assert.ok(html.includes("ds-card--hover"), "Card hover");
      const cardSamples = /ds-card-samples[\s\S]*?<\/div>\s*<aside/i.exec(html);
      assert.ok(cardSamples, "Card samples block");
      const cardVariantCount = (cardSamples[0].match(/ds-card--(?:default|hover)/g) || []).length;
      assert.equal(cardVariantCount, 2, "Card×2 in samples");

      assert.ok(html.includes("ds-sidebar"), "Sidebar");

      const iconsSection = /aria-labelledby=["']section-icons["'][\s\S]*?<\/section>/i.exec(html);
      assert.ok(iconsSection, "Icons section");
      const iconSlots = iconsSection[0].match(/class="ds-icon"/g) || [];
      assert.equal(iconSlots.length, 12, "Icons×12 (chrome×6 + social×5 + CursorFigma)");

      const mediaSection = /aria-labelledby=["']section-media["'][\s\S]*?<\/section>/i.exec(html);
      assert.ok(mediaSection, "Media section");
      for (const key of ["img_bg", "img_1", "img_2", "img_3", "comp", "me", "macbook", "sitybike"]) {
        assert.ok(
          mediaSection[0].includes(`data-media="${key}"`),
          `Media slot missing: ${key}`
        );
      }
      const mediaSlots = mediaSection[0].match(/data-media="/g) || [];
      assert.equal(mediaSlots.length, 8, "Media×8");
    } finally {
      await close();
    }
  });
});

describe("TC-E2E-02 design/ scope ban", () => {
  it("no tracked modifications under design/", () => {
    const out = execFileSync(
      "git",
      ["status", "--porcelain", "--", "design/"],
      { cwd: REPO_ROOT, encoding: "utf8" }
    );
    const lines = out
      .split(/\r?\n/)
      .map((l) => l.trimEnd())
      .filter(Boolean);
    const trackedChanges = lines.filter((line) => !line.startsWith("??"));
    assert.deepEqual(
      trackedChanges,
      [],
      `Unexpected tracked changes under design/: ${trackedChanges.join(" | ")}`
    );
  });
});

describe("Regression DemoContent (shell TC-E2E-01)", () => {
  it("content-package demo literals present in index.html", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const missing = DEMO_CONTENT_LITERALS.filter((s) => !html.includes(s));
    assert.deepEqual(missing, [], `Missing DemoContent: ${missing.join(" | ")}`);
  });
});
