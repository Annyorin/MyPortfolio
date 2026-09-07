/**
 * Tests for ds-showcase Asset Store (task 2.3).
 *
 * TC-UNIT-01: MediaAsset keys map to files on disk.
 * TC-E2E-01: index references assets; HTTP serves them without 404.
 * TC-E2E-02: missing image keeps .ds-placeholder box proportions (UC-01 A2).
 * Regression: smoke 1.3 + tokens foundations not broken.
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

/** MediaAsset key → relative path from index.html (architecture §4.2). */
const MEDIA_ASSETS = [
  { key: "icon.close", rel: "assets/icons/close.svg" },
  { key: "icon.plus", rel: "assets/icons/plus.svg" },
  { key: "icon.plus.hover", rel: "assets/icons/plus-hover.svg" },
  { key: "icon.minus", rel: "assets/icons/minus.svg" },
  { key: "icon.minus.hover", rel: "assets/icons/minus-hover.svg" },
  { key: "icon.arrow-right", rel: "assets/icons/arrow-right.svg" },
  { key: "avatar", rel: "assets/images/avatar.png" },
  { key: "card.image", rel: "assets/images/card-innodragon.png" },
  { key: "img_bg", rel: "assets/images/img-bg.png" },
  { key: "img_1", rel: "assets/images/img-1.png" },
  { key: "img_2", rel: "assets/images/img-2.png" },
  { key: "img_3", rel: "assets/images/img-3.png" },
  { key: "comp", rel: "assets/images/comp.png" },
  { key: "me", rel: "assets/images/me.png" },
  { key: "macbook", rel: "assets/images/macbook.png" },
];

/** Display boxes from screen-spec / Figma Ui kit for Media section. */
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

describe("TC-UNIT-01 MediaAsset keys map to disk files", () => {
  it("every MediaAsset key has a non-empty file at the stable relative path", () => {
    const missing = [];
    for (const { key, rel } of MEDIA_ASSETS) {
      const abs = path.join(SHOWCASE_ROOT, rel);
      if (!fs.existsSync(abs) || fs.statSync(abs).size === 0) {
        missing.push(`${key} → ${rel}`);
      }
    }
    assert.deepEqual(missing, [], `Missing MediaAsset files: ${missing.join(", ")}`);
  });

  it("index.html references each MediaAsset path and meaningful alt on raster imgs", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    for (const { key, rel } of MEDIA_ASSETS) {
      assert.ok(html.includes(rel), `index.html missing src path for ${key}: ${rel}`);
    }

    const imgTags = html.match(/<img\b[^>]*>/gi) || [];
    const rasterImgs = imgTags.filter((t) => /assets\/images\//i.test(t));
    assert.ok(rasterImgs.length >= 5, "expected raster <img> tags");
    for (const tag of rasterImgs) {
      const alt = /\balt\s*=\s*["']([^"']*)["']/i.exec(tag);
      assert.ok(alt, `raster img missing alt: ${tag}`);
      const isDecorative = /aria-hidden=["']true["']/i.test(html.slice(Math.max(0, html.indexOf(tag) - 200), html.indexOf(tag)));
      if (!isDecorative && /avatar\.png|card-innodragon|img-|comp\.png/i.test(tag)) {
        assert.ok(alt[1].length > 0 || /alt=["']["']/.test(tag), `empty alt on significant img: ${tag}`);
      }
    }

    for (const [key, box] of Object.entries(MEDIA_BOXES)) {
      const slotRe = new RegExp(
        `data-media=["']${key}["'][^>]*style=["'][^"']*width:\\s*${box.w}px[^"']*aspect-ratio:\\s*${box.w}/${box.h}`,
        "i"
      );
      assert.ok(slotRe.test(html), `Media slot ${key} must declare ${box.w}×${box.h} box`);
    }
  });
});

describe("TC-E2E-01 assets served with showcase", () => {
  it("HTTP returns 200 for index and every MediaAsset path", async () => {
    const { port, close } = await startStaticServer();
    try {
      const index = await httpGet(port, "/index.html");
      assert.equal(index.status, 200);
      const html = index.body.toString("utf8");
      assert.ok(html.includes("ds-showcase"));

      for (const { key, rel } of MEDIA_ASSETS) {
        const { status, body } = await httpGet(port, `/${rel.replace(/\\/g, "/")}`);
        assert.equal(status, 200, `${key} (${rel}) expected 200, got ${status}`);
        assert.ok(body.length > 0, `${key} empty body`);
      }
    } finally {
      await close();
    }
  });
});

describe("TC-E2E-02 missing asset keeps placeholder proportions (A2)", () => {
  it("renamed image yields 404 while placeholder box and CSS remain", async () => {
    const targetRel = "assets/images/img-1.png";
    const targetAbs = path.join(SHOWCASE_ROOT, targetRel);
    const tmpAbs = path.join(SHOWCASE_ROOT, "assets/images/img-1.png.__missing__");

    assert.ok(fs.existsSync(targetAbs), "img-1.png must exist before A2 test");

    const css = fs.readFileSync(SHOWCASE_CSS, "utf8");
    assert.match(css, /\.ds-placeholder\s*\{/);
    assert.match(css, /aspect-ratio|flex-shrink\s*:\s*0|object-fit\s*:\s*cover/);

    const htmlBefore = fs.readFileSync(INDEX_PATH, "utf8");
    assert.match(
      htmlBefore,
      /data-media=["']img_1["'][^>]*style=["'][^"']*aspect-ratio:\s*345\/230/
    );

    fs.renameSync(targetAbs, tmpAbs);
    try {
      const { port, close } = await startStaticServer();
      try {
        const page = await httpGet(port, "/index.html");
        assert.equal(page.status, 200, "page must stay usable");
        const html = page.body.toString("utf8");
        assert.match(
          html,
          /data-media=["']img_1["'][^>]*style=["'][^"']*width:\s*345px[^"']*aspect-ratio:\s*345\/230/
        );
        assert.ok(html.includes('class="ds-placeholder"') || html.includes("ds-placeholder"));

        const missing = await httpGet(port, `/${targetRel}`);
        assert.equal(missing.status, 404, "renamed asset must 404");

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

    assert.ok(fs.existsSync(targetAbs), "img-1.png must be restored after A2 test");
  });
});

describe("Regression smoke inventory and foundations tokens", () => {
  it("five sections and media×7 slots remain in index.html", () => {
    const html = fs.readFileSync(INDEX_PATH, "utf8");
    const titles = [];
    const re = /<h2\b[^>]*>([^<]*)<\/h2>/gi;
    let match;
    while ((match = re.exec(html)) !== null) {
      titles.push(match[1].trim());
    }
    assert.deepEqual(titles, ["Foundations", "Icons", "Atomic", "Composite", "Media"]);

    const mediaSection = /aria-labelledby=["']section-media["'][\s\S]*?<\/section>/i.exec(html);
    assert.ok(mediaSection);
    assert.equal((mediaSection[0].match(/data-media="/g) || []).length, 7);
  });

  it("tokens.css still declares foundation color and shadow variables", () => {
    const tokens = fs.readFileSync(path.join(SHOWCASE_ROOT, "css", "tokens.css"), "utf8");
    for (const name of [
      "--color-primary",
      "--color-secondary",
      "--color-black",
      "--color-gray-l",
      "--shadow",
    ]) {
      assert.ok(tokens.includes(name), `token missing: ${name}`);
    }
  });
});
