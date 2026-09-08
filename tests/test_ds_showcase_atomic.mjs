/**
 * Tests for Icons + Atomic components (task 2.4).
 *
 * TC-E2E-01: Atomic + Icons inventory; key box sizes ±2px; Chip/Link static pairs.
 * TC-E2E-02: default/hover/active distinguishable without :hover (touch / A1).
 * TC-UNIT-01: Chip/Link modifier classes in DOM.
 * TC-UNIT-02: aria-label / accessible names on Tapper and icon buttons.
 * Regression: foundations 2.2, tokens 2.1, smoke 1.3.
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

/** Target sizes from screen-spec / task (±2px). */
const SIZE_TARGETS = [
  { selector: ".ds-icon", width: 24, height: 24 },
  { selector: ".ds-avatar", width: 90, height: 90 },
  { selector: ".ds-profile", width: 240, height: null, minHeight: null },
  { selector: ".ds-profile--mobile", width: null, height: 48 },
  { selector: ".ds-chip", height: 32, width: null },
  { selector: ".ds-tapper", width: 104, height: 40 },
  { selector: ".ds-stiker", width: 81, height: 32 },
  { selector: ".ds-hover", width: 114, height: 40 },
  { selector: ".ds-fab", width: 50, height: 50 },
];

const COLOR_TOKENS_REGRESSION = {
  "--color-primary": "#64b3f9",
  "--color-primary-hover": "#79befc",
  "--color-secondary": "#ededed",
  "--color-white": "#fefefe",
  "--color-black": "#232323",
  "--color-gray-text": "#888888",
  "--color-gray-dark": "#e4e4e4",
  "--color-gray-l": "#6b6b6b",
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

describe("TC-UNIT-01 Chip/Link modifiers in DOM", () => {
  it("Atomic samples expose ds-chip--default/active and ds-link--default/hover", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const atomic = /aria-labelledby=["']section-atomic["'][\s\S]*?<\/section>/i.exec(html);
    assert.ok(atomic, "Atomic section required");
    const block = atomic[0];

    assert.ok(/ds-chip\s+ds-chip--default/.test(block) || /ds-chip--default/.test(block));
    assert.ok(/ds-chip--active/.test(block));
    assert.ok(/ds-link--default/.test(block));
    assert.ok(/ds-link--hover/.test(block));

    const chips = block.match(/ds-chip--(?:default|active)/g) || [];
    assert.ok(chips.includes("ds-chip--default"));
    assert.ok(chips.includes("ds-chip--active"));

    const links = block.match(/ds-link--(?:default|hover)/g) || [];
    assert.ok(links.includes("ds-link--default"));
    assert.ok(links.includes("ds-link--hover"));
  });
});

describe("TC-UNIT-02 accessible names for Tapper / icon buttons", () => {
  it("Tapper has aria-label; Icons list items have aria-label; Hover has aria-label", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");

    assert.match(html, /class="ds-tapper"[^>]*aria-label="Tapper"/);
    assert.match(html, /class="ds-hover"[^>]*aria-label="Behance"/);
    assert.match(html, /aria-label="Stiker"/);

    const icons = /aria-labelledby=["']section-icons["'][\s\S]*?<\/section>/i.exec(html);
    assert.ok(icons, "Icons section");
    for (const name of [
      "close",
      "Plus",
      "Plus hover",
      "Minus",
      "Minus hover",
      "vuesax/linear/arrow-right",
      "linkedin",
      "behance",
      "mail",
      "cv",
      "telegram",
      "CursorFigma",
    ]) {
      assert.ok(
        icons[0].includes(`aria-label="${name}"`),
        `Icon aria-label missing: ${name}`
      );
    }

    const tapper = /class="ds-tapper"[^>]*>[\s\S]*?<\/div>/i.exec(html);
    assert.ok(tapper, "Tapper group");
    assert.ok(/data-icon="Minus"/.test(tapper[0]), "Tapper Minus icon");
    assert.ok(/data-icon="Plus"/.test(tapper[0]), "Tapper Plus icon");
  });
});

describe("TC-E2E-01 Atomic + Icons inventory and sizes", () => {
  it("key box sizes declared within ±2px and inventory visible", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const css = fs.readFileSync(COMPONENTS_CSS_PATH, "utf8");

    assert.deepEqual(collectH2Texts(html), SECTION_ORDER);

    const icons = /aria-labelledby=["']section-icons["'][\s\S]*?<\/section>/i.exec(html);
    assert.ok(icons);
    assert.equal((icons[0].match(/class="ds-icon"/g) || []).length, 12);

    const atomic = /aria-labelledby=["']section-atomic["'][\s\S]*?<\/section>/i.exec(html);
    assert.ok(atomic);
    for (const cls of [
      "ds-avatar",
      "ds-profile",
      "ds-profile--mobile",
      "ds-chip",
      "ds-button",
      "ds-link",
      "ds-tapper",
      "ds-stiker",
      "ds-hover",
      "ds-fab",
    ]) {
      assert.ok(atomic[0].includes(cls), `Atomic missing ${cls}`);
    }

    assert.ok(atomic[0].includes("B2B"));
    assert.ok(atomic[0].includes("Написать"));
    assert.ok(atomic[0].includes(">Link<") || atomic[0].includes(">Link</a>"));
    assert.ok(atomic[0].includes("Обо мне"));
    assert.ok(atomic[0].includes("Behance"));
    assert.ok(/Stiker/i.test(atomic[0]));

    for (const t of SIZE_TARGETS) {
      const body = ruleBody(css, t.selector);
      assert.ok(body, `Rule missing for ${t.selector}`);
      if (t.width != null) {
        assertWithinTol(declaredPx(body, "width"), t.width, `${t.selector} width`);
      }
      if (t.height != null) {
        assertWithinTol(declaredPx(body, "height"), t.height, `${t.selector} height`);
      }
      if (t.minHeight != null) {
        const mh = declaredPx(body, "min-height");
        assertWithinTol(mh, t.minHeight, `${t.selector} min-height`);
      }
    }

    // Chip / Link fill tokens (screen-spec)
    const chipDefault = ruleBody(css, ".ds-chip--default");
    const chipActive = ruleBody(css, ".ds-chip--active");
    assert.ok(chipDefault && /var\(--color-secondary\)/.test(chipDefault));
    assert.ok(chipDefault && /var\(--color-black\)/.test(chipDefault));
    assert.ok(chipActive && /var\(--color-primary\)/.test(chipActive));
    assert.ok(chipActive && /var\(--color-white\)/.test(chipActive));

    const linkHover = ruleBody(css, ".ds-link--hover");
    assert.ok(linkHover && /var\(--color-primary\)/.test(linkHover));
    assert.match(css, /\.ds-link:hover[\s\S]*?var\(--color-primary\)/);

    // Role uses GrayL
    const role = ruleBody(css, ".ds-profile__role");
    assert.ok(role && /var\(--color-gray-l\)/.test(role));

    const profileMobile = ruleBody(css, ".ds-profile--mobile");
    assert.ok(profileMobile && /flex-direction\s*:\s*row/.test(profileMobile));
    assertWithinTol(declaredPx(profileMobile, "height"), 48, ".ds-profile--mobile height");

    const fab = ruleBody(css, ".ds-fab");
    assert.ok(fab && /var\(--color-black\)/.test(fab));
    assert.ok(fab && /0\s+5px\s+4\.5px/.test(fab));
    assert.match(css, /\.ds-fab[\s\S]*?rotate\(-90deg\)/);

    // No component JS preference
    assert.doesNotMatch(html, /<script\b/i);
  });

  it("HTTP serves Atomic/Icons with assets and CSS", async () => {
    const { port, close } = await startStaticServer();
    try {
      const { status, body } = await httpGet(port, "/index.html");
      assert.equal(status, 200);
      const html = body.toString("utf8");
      assert.ok(html.includes("section-atomic"));
      assert.ok(html.includes("section-icons"));

      for (const p of [
        "/css/components.css",
        "/assets/icons/close.svg",
        "/assets/icons/plus.svg",
        "/assets/icons/plus-hover.svg",
        "/assets/icons/minus.svg",
        "/assets/icons/minus-hover.svg",
        "/assets/icons/arrow-right.svg",
        "/assets/icons/telegram.svg",
        "/assets/icons/cv.svg",
        "/assets/icons/mail.svg",
        "/assets/icons/cursor-figma.svg",
        "/assets/images/avatar.png",
      ]) {
        const res = await httpGet(port, p);
        assert.equal(res.status, 200, `${p} expected 200`);
        assert.ok(res.body.length > 0);
      }
    } finally {
      await close();
    }
  });
});

describe("TC-E2E-02 static variants without :hover (touch A1)", () => {
  it("Chip default+active and Link default+hover are distinct static classes", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const css = fs.readFileSync(COMPONENTS_CSS_PATH, "utf8");

    const chipSamples = /ds-chip-samples[\s\S]*?<\/div>/i.exec(html);
    assert.ok(chipSamples);
    assert.ok(/ds-chip--default/.test(chipSamples[0]));
    assert.ok(/ds-chip--active/.test(chipSamples[0]));

    const linkSamples = /ds-link-samples[\s\S]*?<\/div>/i.exec(html);
    assert.ok(linkSamples);
    assert.ok(/ds-link--default/.test(linkSamples[0]));
    assert.ok(/ds-link--hover/.test(linkSamples[0]));

    const defBg = ruleBody(css, ".ds-chip--default");
    const actBg = ruleBody(css, ".ds-chip--active");
    assert.ok(defBg && actBg);
    assert.notEqual(
      /background-color\s*:\s*([^;]+)/i.exec(defBg)?.[1],
      /background-color\s*:\s*([^;]+)/i.exec(actBg)?.[1],
      "Chip default and active must differ without :hover"
    );

    const linkDef = ruleBody(css, ".ds-link--default");
    const linkHov = ruleBody(css, ".ds-link--hover");
    assert.ok(linkDef && linkHov);
    assert.notEqual(
      /color\s*:\s*([^;]+)/i.exec(linkDef)?.[1],
      /color\s*:\s*([^;]+)/i.exec(linkHov)?.[1],
      "Link default and hover samples must differ without :hover"
    );
  });
});

describe("Regression tokens 2.1 + smoke inventory", () => {
  it("ColorToken hex unchanged and smoke section order intact", () => {
    const tokens = parseRootCustomProperties(fs.readFileSync(TOKENS_PATH, "utf8"));
    for (const [name, hex] of Object.entries(COLOR_TOKENS_REGRESSION)) {
      assert.equal(tokens.get(name), hex, `${name} regression`);
    }
    assert.equal(tokens.get("--shadow"), "0 5px 9px #bbbbbd40");

    const html = fs.readFileSync(INDEX_PATH, "utf8");
    assert.deepEqual(collectH2Texts(html), SECTION_ORDER);
    assert.ok(html.includes("ds-swatch"));
    assert.ok(html.includes("ds-sidebar"));
  });
});
