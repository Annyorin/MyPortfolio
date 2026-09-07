/**
 * Delivery docs for ds-showcase README (task 4.1).
 *
 * TC-E2E-01: open path from README + no-mock smoke green.
 * TC-E2E-02: Figma pointer and/or local evidence path resolvable.
 * TC-UNIT-01: no secrets / .cursor/mcp.json in README.
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
const README_PATH = path.join(SHOWCASE_ROOT, "README.md");
const INDEX_PATH = path.join(SHOWCASE_ROOT, "index.html");
const EVIDENCE_PATH = path.join(
  REPO_ROOT,
  "docs",
  "implementation",
  "figma-ui-kit-reference.png"
);

const FIGMA_FILE_KEY = "xboMnqU5JURL0xlzxN7edN";
const FIGMA_NODE = "41-11646";

const SECRET_PATTERNS = [
  /\.cursor\/mcp\.json/i,
  /\b(api[_-]?key|secret|password|token)\s*[:=]/i,
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/i,
];

/**
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
      const { port } = /** @type {import('node:net').AddressInfo} */ (
        server.address()
      );
      resolve({
        port,
        close: () => new Promise((r) => server.close(() => r())),
      });
    });
  });
}

describe("TC-UNIT-01 README has no secrets", () => {
  it("README exists, is not a stub, and has no secret/mcp paths", () => {
    assert.ok(fs.existsSync(README_PATH), "README.md missing");
    const text = fs.readFileSync(README_PATH, "utf8");
    assert.ok(text.trim().length > 80, "README looks like a stub");
    assert.doesNotMatch(
      text,
      /будет заполнено/i,
      "README still contains stub placeholder"
    );
    for (const re of SECRET_PATTERNS) {
      assert.doesNotMatch(text, re, `Forbidden pattern: ${re}`);
    }
  });
});

describe("TC-E2E-01 follow README open path", () => {
  it("documents index.html and serves page without extra steps", async () => {
    const readme = fs.readFileSync(README_PATH, "utf8");
    assert.match(readme, /index\.html/);
    assert.match(readme, /static|сервер|serve/i);
    assert.ok(fs.existsSync(INDEX_PATH));

    const fileUrl = pathToFileURL(INDEX_PATH).href;
    assert.match(fileUrl, /^file:/);

    const { port, close } = await startStaticServer();
    try {
      const { status, body } = await httpGet(port, "/index.html");
      assert.equal(status, 200);
      const html = body.toString("utf8");
      assert.match(html, /<main\b[^>]*class=["'][^"']*\bds-showcase\b/);
      const h2 = [...html.matchAll(/<h2\b[^>]*>([^<]*)<\/h2>/gi)].map((m) =>
        m[1].trim()
      );
      assert.deepEqual(h2, [
        "Foundations",
        "Icons",
        "Atomic",
        "Composite",
        "Media",
      ]);
    } finally {
      await close();
    }
  });
});

describe("TC-E2E-02 Figma and/or local evidence from README", () => {
  it("README points to Figma Ui kit and local evidence file exists", () => {
    const readme = fs.readFileSync(README_PATH, "utf8");
    assert.ok(readme.includes(FIGMA_FILE_KEY), "fileKey missing in README");
    assert.ok(
      readme.includes(FIGMA_NODE) || readme.includes("41:11646"),
      "node-id missing in README"
    );
    assert.match(readme, /figma\.com\/design/i);

    assert.ok(
      readme.includes("figma-ui-kit-reference.png") ||
        /нужен доступ к Figma/i.test(readme),
      "evidence pointer missing"
    );
    assert.ok(
      fs.existsSync(EVIDENCE_PATH),
      `Evidence file missing: ${EVIDENCE_PATH}`
    );

    const relativeFromReadme = path.resolve(
      SHOWCASE_ROOT,
      "../docs/implementation/figma-ui-kit-reference.png"
    );
    assert.ok(
      fs.existsSync(relativeFromReadme),
      "Relative evidence path from ds-showcase/ does not resolve"
    );
  });
});
