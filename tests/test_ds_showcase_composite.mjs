/**
 * Tests for Composite Card/Sidebar + Media proportions (task 2.5).
 *
 * TC-E2E-01: Card default vs hover (shadow matrix §3.1; InnoDragon texts).
 * TC-E2E-02: Sidebar sizes, Skills gap/matrix, Contacts Caption, bio.
 * TC-E2E-03: Media five slots with target proportions.
 * TC-UNIT-01: Card default has no box-shadow (except none); hover uses var(--shadow).
 * TC-UNIT-02: Contacts use caption tokens.
 * Regression: atomic 2.4 Chip reuse; foundations 2.2; tokens 2.1; smoke 1.3.
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
const COMPONENTS_CSS_PATH = path.join(SHOWCASE_ROOT, "css", "components.css");
const TOKENS_PATH = path.join(SHOWCASE_ROOT, "css", "tokens.css");

const SECTION_ORDER = ["Foundations", "Icons", "Atomic", "Composite", "Media"];

const CARD_DESCRIPTION =
  "Система управления безопасностью. Позволяет организациям эффективно защищать свои сети и активы в реальном времени.";

const SIDEBAR_BIO =
  "Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь.";

/** Figma / mirror / screen-spec: BG/1/2 = 345×230; IMG_3 = 345×345; Comp ≈149×103; me 254; Macbook 451×319. */
const MEDIA_BOXES = {
  img_bg: { w: 345, h: 230 },
  img_1: { w: 345, h: 230 },
  img_2: { w: 345, h: 230 },
  img_3: { w: 345, h: 345 },
  comp: { w: 149, h: 103 },
  me: { w: 254, h: 254 },
  macbook: { w: 451, h: 319 },
};

/**
 * Collect h2 texts in order.
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
 * Extract a CSS rule body for an exact selector.
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
 * Parse px dimension from a CSS declaration value.
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
 * Assert size within ±2px of target.
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

/**
 * Parse :root custom properties.
 * @param {string} css
 * @returns {Map<string, string>}
 */
function parseRootCustomProperties(css) {
  const rootMatch = /:root\s*\{([\s\S]*?)\}/m.exec(css);
  assert.ok(rootMatch, ":root block required");
  const map = new Map();
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = re.exec(rootMatch[1])) !== null) {
    map.set(match[1].toLowerCase(), match[2].trim().toLowerCase());
  }
  return map;
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
 * Start static file server for SHOWCASE_ROOT.
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

/**
 * Shadow declaration uses only var(--shadow), not the Tapper «вв» effect.
 * @param {string} body
 */
function assertShadowTokenOnly(body) {
  assert.match(body, /box-shadow\s*:\s*var\(--shadow\)/i);
  assert.doesNotMatch(body, /4px\s+9px\s+18\.7/i);
  assert.doesNotMatch(body, /#b1b3bb/i);
}

describe("TC-UNIT-01 Card shadow contract", () => {
  it("default has no drop-shadow; hover/static-hover use var(--shadow)", () => {
    const css = fs.readFileSync(COMPONENTS_CSS_PATH, "utf8");

    const base = ruleBody(css, ".ds-card");
    const def = ruleBody(css, ".ds-card--default");
    assert.ok(base, ".ds-card rule required");
    assert.ok(def, ".ds-card--default rule required");

    for (const [label, body] of [
      [".ds-card", base],
      [".ds-card--default", def],
    ]) {
      const shadow = /box-shadow\s*:\s*([^;]+)/i.exec(body);
      assert.ok(shadow, `${label} must declare box-shadow`);
      const val = shadow[1].trim().toLowerCase();
      assert.ok(
        val === "none" || val === "unset" || val === "initial",
        `${label} must not use drop-shadow (got ${shadow[1]})`
      );
    }

    const hoverStatic = ruleBody(css, ".ds-card--hover");
    assert.ok(hoverStatic, ".ds-card--hover rule required");
    assertShadowTokenOnly(hoverStatic);
    const interactive = ruleBody(css, ".ds-card:hover");
    assert.ok(interactive, ".ds-card:hover rule required");
    assertShadowTokenOnly(interactive);

    assert.doesNotMatch(css, /\.ds-card[^{]*\{[^}]*4px\s+9px\s+18\.7/s);
  });
});

describe("TC-UNIT-02 Contacts caption tokens", () => {
  it("Sidebar Contacts links use var(--type-caption-*)", () => {
    const css = fs.readFileSync(COMPONENTS_CSS_PATH, "utf8");
    const body = ruleBody(css, ".ds-sidebar__contacts .ds-link");
    assert.ok(body, ".ds-sidebar__contacts .ds-link rule required");
    assert.match(body, /var\(--type-caption-size\)/);
    assert.match(body, /var\(--type-caption-line\)/);
    assert.match(body, /var\(--type-caption-weight\)/);
    assert.doesNotMatch(body, /var\(--type-text-size\)/);

    assert.match(
      css,
      /\.ds-sidebar__contacts\s+\.ds-link:focus-visible\s*\{[^}]*outline/s
    );
  });
});

describe("TC-E2E-01 Card default vs hover", () => {
  it("static pair + :hover; sizes; InnoDragon texts; Secondary border", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const css = fs.readFileSync(COMPONENTS_CSS_PATH, "utf8");

    const composite = /aria-labelledby=["']section-composite["'][\s\S]*?<\/section>/i.exec(html);
    assert.ok(composite, "Composite section required");
    const block = composite[0];

    assert.ok(/ds-card--default/.test(block));
    assert.ok(/ds-card--hover/.test(block));
    assert.equal((block.match(/ds-card--(?:default|hover)/g) || []).length, 2);

    assert.ok(block.includes("InnoDragon"));
    assert.ok(block.includes("· 2024-2026"));
    assert.ok(block.includes(CARD_DESCRIPTION));

    const card = ruleBody(css, ".ds-card");
    assert.ok(card);
    assertWithinTol(declaredPx(card, "width"), 310, "Card width");
    assertWithinTol(declaredPx(card, "height"), 310, "Card height");
    assertWithinTol(declaredPx(card, "border-radius"), 24, "Card radius");
    assert.match(card, /border\s*:[^;]*var\(--color-secondary\)/);

    assert.match(css, /\.ds-card:hover/);
    assert.match(css, /box-shadow\s*:\s*var\(--shadow\)/);
  });

  it("HTTP serves Composite Card assets", async () => {
    const { port, close } = await startStaticServer();
    try {
      const { status, body } = await httpGet(port, "/index.html");
      assert.equal(status, 200);
      const html = body.toString("utf8");
      assert.ok(html.includes("section-composite"));
      assert.ok(html.includes("ds-card--default"));

      const cardImg = await httpGet(port, "/assets/images/card-innodragon.png");
      assert.equal(cardImg.status, 200);
      assert.ok(cardImg.body.length > 0);

      const components = await httpGet(port, "/css/components.css");
      assert.equal(components.status, 200);
      assert.match(components.body.toString("utf8"), /var\(--shadow\)/);
    } finally {
      await close();
    }
  });
});

describe("TC-E2E-02 Sidebar structure and Skills matrix", () => {
  it("box metrics ±2px; Skills gap 8; active/default matrix; Caption contacts; bio", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const css = fs.readFileSync(COMPONENTS_CSS_PATH, "utf8");

    const sidebar = /<aside\b[^>]*class="[^"]*ds-sidebar[^"]*"[\s\S]*?<\/aside>/i.exec(html);
    assert.ok(sidebar, "Sidebar aside required");
    const block = sidebar[0];

    assert.ok(block.includes(SIDEBAR_BIO), "bio must be verbatim");
    assert.ok(/ds-profile/.test(block), "reuses Profile");
    assert.ok(/ds-avatar/.test(block), "reuses Avatar");

    const skills = /class="ds-sidebar__skills"[\s\S]*?<\/div>/i.exec(block);
    assert.ok(skills);
    assert.match(skills[0], /ds-chip--active[^>]*>\s*B2B/);
    assert.match(skills[0], /ds-chip--active[^>]*>\s*B2C/);
    assert.match(skills[0], /ds-chip--default[^>]*>\s*Design System/);
    assert.match(skills[0], /ds-chip--default[^>]*>\s*AI-prototyping/);

    const contacts = /ds-sidebar__contacts[\s\S]*?<\/nav>/i.exec(block);
    assert.ok(contacts);
    for (const label of ["CV", "Telegram", "LinkedIn", "Behance"]) {
      assert.ok(contacts[0].includes(label), `contact missing: ${label}`);
    }

    const side = ruleBody(css, ".ds-sidebar");
    assert.ok(side);
    assertWithinTol(declaredPx(side, "width"), 310, "Sidebar width");
    assertWithinTol(declaredPx(side, "height"), 561, "Sidebar height");
    assertWithinTol(declaredPx(side, "border-radius"), 16, "Sidebar radius");
    assertWithinTol(declaredPx(side, "padding"), 16, "Sidebar padding");
    assert.match(side, /border\s*:[^;]*var\(--color-secondary\)/);
    assertShadowTokenOnly(side);

    const skillsCss = ruleBody(css, ".ds-sidebar__skills");
    assert.ok(skillsCss);
    assertWithinTol(declaredPx(skillsCss, "gap"), 8, "Skills gap");

    const bio = ruleBody(css, ".ds-sidebar__bio");
    assert.ok(bio && /var\(--color-gray-l\)/.test(bio));
    assert.ok(bio && /var\(--type-text-size\)/.test(bio));

    // Chip styles reused (not redeclared fill inside sidebar skills)
    assert.ok(ruleBody(css, ".ds-chip--active"));
    assert.ok(ruleBody(css, ".ds-chip--default"));
  });
});

describe("TC-E2E-03 Media proportions", () => {
  it("seven slots keep target boxes; layout classes present", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const mediaSection = /aria-labelledby=["']section-media["'][\s\S]*?<\/section>/i.exec(html);
    assert.ok(mediaSection);
    assert.equal((mediaSection[0].match(/data-media="/g) || []).length, 7);

    for (const [key, box] of Object.entries(MEDIA_BOXES)) {
      const slotRe = new RegExp(
        `data-media=["']${key}["'][^>]*style=["'][^"']*width:\\s*${box.w}px[^"']*aspect-ratio:\\s*${box.w}/${box.h}`,
        "i"
      );
      assert.ok(slotRe.test(html), `Media slot ${key} must declare ${box.w}×${box.h}`);
      assert.match(
        mediaSection[0],
        new RegExp(
          `class=["'][^"']*ds-placeholder[^"']*["'][^>]*data-media=["']${key}["']|data-media=["']${key}["'][^>]*class=["'][^"']*ds-placeholder`,
          "i"
        )
      );
    }

    assert.match(mediaSection[0], /\balt=["'][^"']+["']/i);
  });
});

describe("Regression atomic Chip + tokens + smoke", () => {
  it("Chip modifiers still distinct; tokens Shadow intact; section order", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const css = fs.readFileSync(COMPONENTS_CSS_PATH, "utf8");
    const tokens = parseRootCustomProperties(fs.readFileSync(TOKENS_PATH, "utf8"));

    assert.deepEqual(collectH2Texts(html), SECTION_ORDER);

    const chipDef = ruleBody(css, ".ds-chip--default");
    const chipAct = ruleBody(css, ".ds-chip--active");
    assert.ok(chipDef && /var\(--color-secondary\)/.test(chipDef));
    assert.ok(chipAct && /var\(--color-primary\)/.test(chipAct));

    assert.equal(tokens.get("--shadow"), "0 5px 9px #bbbbbd40");
    assert.equal(tokens.get("--color-secondary"), "#ededed");
    assert.equal(tokens.get("--type-caption-size"), "12px");
    assert.equal(tokens.get("--type-caption-line"), "16px");
    assert.equal(tokens.get("--type-caption-weight"), "500");

    assert.doesNotMatch(html, /<script\b/i);
  });
});

