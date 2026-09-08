/**
 * Tests for ds-showcase page shell and demo content binding (task 1.2).
 *
 * TC-E2E-01: five IA sections, variants, sidebar skills/contacts, demo strings.
 * TC-UNIT-01: HTML literals match content-package §2.8.1 strings.
 * Regression: TC-E2E-01 from task 1.1 (index + CSS links resolve).
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
const INDEX_PATH = path.join(SHOWCASE_ROOT, "index.html");

const SECTION_ORDER = ["Foundations", "Icons", "Atomic", "Composite", "Media"];

/** Demo strings from design/03-content/outputs/content-package.md (§2.8.1). */
const CONTENT_LITERALS = [
  "Аня Ясинская",
  "Подуктовый дизайнер",
  "Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь.",
  "B2B",
  "Написать",
  "Резюме",
  "Почта",
  "Behance",
  "Link",
  "Обо мне",
  "CityBike",
  "· 2024",
  "Приложение для аренды электрических велосипедов. Удобный и экологичный транспорт по доступным ценам. Экономия времени в одно касание.",
  "Primary",
  "Primary_hover",
  "Secondary",
  "Gray_dark",
  "Gray_text",
  "Black",
  "White",
  "Заголовок 1",
  "Заголовок 2",
  "Текст 1",
  "Текст 2",
  "Подписи",
  "Annyorina © 2026",
];

const FORBIDDEN_KEYS = ["sidebar.chip.", "sidebar.contact.", "card.years"];

const EXPECTED_CSS_HREFS = [
  "css/tokens.css",
  "css/components.css",
  "css/showcase.css",
];

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

describe("TC-E2E-01 showcase shell inventory", () => {
  it("five IA section headings in order and key demo inventory in DOM", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");

    assert.match(html, /<main\b[^>]*class=["'][^"']*\bds-showcase\b/, "main.ds-showcase required");
    assert.deepEqual(collectH2Texts(html), SECTION_ORDER);

    assert.ok(html.includes('class="ds-chip ds-chip--default"') || html.includes("ds-chip--default"), "Chip default");
    assert.ok(html.includes("ds-chip--active"), "Chip active");
    assert.ok(html.includes("ds-link--default"), "Link default");
    assert.ok(html.includes("ds-link--hover"), "Link hover");
    assert.ok(html.includes("ds-card--default"), "Card default");
    assert.ok(html.includes("ds-card--hover"), "Card hover");

    assert.ok(html.includes("ds-sidebar"), "Sidebar present");
    assert.ok(html.includes("ds-sidebar__skills"), "Sidebar Skills/actions");
    assert.ok(html.includes("ds-sidebar__copyright"), "Sidebar copyright");
    assert.ok(html.includes("ds-button--primary"), "Primary button");
    assert.ok(html.includes("ds-button--secondary"), "Secondary button");

    const skillsBlock = /class="ds-sidebar__skills"[\s\S]*?<\/div>/i.exec(html);
    assert.ok(skillsBlock, "Actions block parseable");
    const skillsHtml = skillsBlock[0];
    const actionButtons = skillsHtml.match(/class="ds-button\s+ds-button--(?:primary|secondary)"/g) || [];
    assert.equal(actionButtons.length, 4, "Skills must have 4 action buttons");
    for (const label of ["Написать", "Резюме", "Behance", "Почта"]) {
      assert.ok(skillsHtml.includes(label), `Action missing: ${label}`);
    }

    assert.ok(html.includes("Аня Ясинская"));
    assert.ok(html.includes("Подуктовый дизайнер"));
    assert.ok(html.includes('aria-label="Stiker"') || /Stiker/i.test(html));

    assert.doesNotMatch(html, /якорн|оглавлени|table of contents/i);
    assert.doesNotMatch(html, /\bGrayL\b/);
  });

  it("Font Delivery declares Inter with sans-serif fallback", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const tokensCss = fs.readFileSync(path.join(SHOWCASE_ROOT, "css", "tokens.css"), "utf8");
    const showcaseCss = fs.readFileSync(path.join(SHOWCASE_ROOT, "css", "showcase.css"), "utf8");
    const bundled = `${html}\n${tokensCss}\n${showcaseCss}`;

    assert.ok(
      /fonts\.googleapis\.com.*Inter|@font-face[\s\S]*Inter|family=Inter/i.test(bundled),
      "Inter must be loaded via CDN or @font-face"
    );
    assert.match(showcaseCss, /font-family\s*:\s*Inter\s*,\s*sans-serif/i);
  });
});

describe("TC-UNIT-01 content-package demo literals", () => {
  it("each content-package demo string appears verbatim in index.html", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const missing = CONTENT_LITERALS.filter((s) => !html.includes(s));
    assert.deepEqual(missing, [], `Missing literals: ${missing.join(" | ")}`);

    for (const key of FORBIDDEN_KEYS) {
      assert.ok(!html.includes(key), `Forbidden non-canon key in HTML: ${key}`);
    }
  });

  it("foundations has exactly seven swatches and five type labels", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const foundations = /aria-labelledby=["']section-foundations["'][\s\S]*?<\/section>/i.exec(html);
    assert.ok(foundations, "Foundations section missing");
    const block = foundations[0];
    const swatches = block.match(/class="ds-swatch"/g) || [];
    assert.equal(swatches.length, 7);
    for (const label of ["Заголовок 1", "Заголовок 2", "Текст 1", "Текст 2", "Подписи"]) {
      assert.ok(block.includes(label), `Type label missing: ${label}`);
    }
  });

  it("media slots cover img_bg, img_1, img_2, img_3, comp, me, macbook, sitybike", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    for (const key of ["img_bg", "img_1", "img_2", "img_3", "comp", "me", "macbook", "sitybike"]) {
      assert.ok(
        html.includes(`data-media="${key}"`) || html.includes(`alt="${key}"`) || html.includes(`aria-label="${key}"`),
        `Media slot missing: ${key}`
      );
    }
  });
});

describe("Regression TC-E2E-01 index and CSS delivery (task 1.1)", () => {
  it("HTML parses stylesheet links and files resolve on disk", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");

    assert.match(html, /<!DOCTYPE html>/i, "HTML must start with DOCTYPE");
    assert.doesNotMatch(html, /<\/html>\s*<[^!]/i, "Unexpected content after </html>");

    const hrefs = collectStylesheetHrefs(html);
    assert.deepEqual(hrefs, EXPECTED_CSS_HREFS);

    for (const href of hrefs) {
      const cssPath = path.join(SHOWCASE_ROOT, href);
      assert.ok(fs.existsSync(cssPath), `CSS link 404: ${href}`);
    }

    const fileUrl = pathToFileURL(INDEX_PATH).href;
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
