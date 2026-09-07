/**
 * Delivery README + entrypoint smoke (task 4.1).
 *
 * TC-E2E-01: README names scripts storybook and portfolio:dev
 * TC-E2E-02: package.json scripts match README
 * TC-E2E-03: no-mock smoke of both entrypoints
 * TC-UNIT-01: README lists required install/run commands and @ds-assets
 */

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const README_PATH = path.join(REPO_ROOT, "README.md");
const PKG_PATH = path.join(REPO_ROOT, "package.json");

/**
 * @param {string} url
 * @returns {Promise<{ status: number, body: string }>}
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 0,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      })
      .on("error", reject);
  });
}

/**
 * @param {import('node:child_process').ChildProcess} child
 * @returns {Promise<void>}
 */
function stopChild(child) {
  return new Promise((resolve) => {
    if (child.exitCode != null) {
      resolve();
      return;
    }
    const done = () => resolve();
    child.once("exit", done);
    try {
      if (process.platform === "win32" && child.pid) {
        spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
          stdio: "ignore",
          windowsHide: true,
        }).once("exit", done);
      } else {
        child.kill("SIGTERM");
      }
    } catch {
      child.kill("SIGKILL");
    }
    setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {
        /* ignore */
      }
      resolve();
    }, 3000);
  });
}

const PORTFOLIO_README_PATH = path.join(REPO_ROOT, "portfolio", "README.md");
const FIGMA_FILE_KEY = "xboMnqU5JURL0xlzxN7edN";
const FIGMA_SCENE_NODE = "41:1416";

describe("TC-UNIT-01 delivery README required commands", () => {
  it("README documents install, scripts, @ds-assets, prerequisites", () => {
    assert.ok(fs.existsSync(README_PATH), "root README.md missing");
    const text = fs.readFileSync(README_PATH, "utf8");
    assert.match(text, /Портфолио\s*\+\s*Storybook/i);
    assert.match(text, /Node\.js\s+LTS/i);
    assert.match(text, /npm\s+ci/);
    assert.match(text, /npm\s+install/);
    assert.match(text, /ds-showcase\/css/);
    assert.match(text, /ds-showcase\/assets/);
    assert.match(text, /npm\s+run\s+storybook/);
    assert.match(text, /npm\s+run\s+portfolio:dev/);
    assert.match(text, /npm\s+run\s+portfolio:static/);
    assert.match(text, /npm\s+test/);
    assert.match(text, /@ds-assets/);
    assert.match(text, /design\/\*\*/);
    assert.match(text, /секрет/i);
    assert.match(text, /Shift\s*\+\s*`?1`?/i);
    assert.ok(text.includes(FIGMA_FILE_KEY), "Figma fileKey missing in root README");
    assert.ok(
      text.includes(FIGMA_SCENE_NODE) || text.includes("41-1416"),
      "Figma scene node 41:1416 missing in root README"
    );
    assert.match(text, /figma\.com\/design/i);
    assert.match(text, /portfolio\/README\.md/);

    assert.ok(fs.existsSync(PORTFOLIO_README_PATH), "portfolio/README.md missing");
    const portfolioReadme = fs.readFileSync(PORTFOLIO_README_PATH, "utf8");
    assert.match(portfolioReadme, /npm\s+run\s+portfolio:dev/);
    assert.match(portfolioReadme, /@ds-assets/);
    assert.ok(
      portfolioReadme.includes(FIGMA_SCENE_NODE) ||
        portfolioReadme.includes("41-1416"),
      "Figma 41:1416 missing in portfolio/README.md"
    );
  });
});

describe("TC-E2E-01 README script names", () => {
  it("README contains exact script names storybook and portfolio:dev", () => {
    const text = fs.readFileSync(README_PATH, "utf8");
    assert.match(text, /`npm run storybook`/);
    assert.match(text, /`npm run portfolio:dev`/);
  });
});

describe("TC-E2E-02 package.json scripts match README", () => {
  it("scripts.storybook / portfolio:dev / portfolio:static / test exist and match README", () => {
    const pkg = JSON.parse(fs.readFileSync(PKG_PATH, "utf8"));
    const readme = fs.readFileSync(README_PATH, "utf8");

    assert.equal(typeof pkg.scripts.storybook, "string");
    assert.equal(typeof pkg.scripts["portfolio:dev"], "string");
    assert.equal(typeof pkg.scripts["portfolio:static"], "string");
    assert.equal(typeof pkg.scripts.test, "string");

    assert.match(readme, /npm run storybook/);
    assert.match(readme, /npm run portfolio:dev/);
    assert.match(readme, /npm run portfolio:static/);
    assert.match(readme, /npm test/);

    assert.match(pkg.scripts.storybook, /storybook/);
    assert.match(pkg.scripts["portfolio:dev"], /vite/);
    assert.match(pkg.description || "", /@ds-assets/);

    const viteCfg = fs.readFileSync(
      path.join(REPO_ROOT, "vite.config.js"),
      "utf8"
    );
    const sbMain = fs.readFileSync(
      path.join(REPO_ROOT, ".storybook", "main.js"),
      "utf8"
    );
    assert.match(viteCfg, /["']@ds-assets["']/);
    assert.match(sbMain, /["']@ds-assets["']/);
  });
});

describe("TC-E2E-03 no-mock smoke entrypoints", () => {
  it("portfolio:dev (Vite) serves Главная", async () => {
    const viteBin = path.join(
      REPO_ROOT,
      "node_modules",
      "vite",
      "bin",
      "vite.js"
    );
    assert.ok(fs.existsSync(viteBin), "vite binary missing — run npm ci");

    const port = 5200 + Math.floor(Math.random() * 400);
    const child = spawn(
      process.execPath,
      [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
      {
        cwd: REPO_ROOT,
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, BROWSER: "none" },
        windowsHide: true,
      }
    );

    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => {
      stdout += String(d);
    });
    child.stderr?.on("data", (d) => {
      stderr += String(d);
    });

    const baseUrl = `http://127.0.0.1:${port}`;
    const deadline = Date.now() + 45000;
    let ready = false;

    try {
      while (Date.now() < deadline) {
        if (child.exitCode != null) {
          throw new Error(`vite exited early: ${stderr || stdout}`);
        }
        try {
          const res = await httpGet(`${baseUrl}/portfolio/main.html`);
          if (res.status === 200) {
            ready = true;
            assert.match(res.body, /class=["'][^"']*\bviewport\b/);
            assert.match(res.body, /id=["']world["']/);
            break;
          }
        } catch {
          /* retry */
        }
        await new Promise((r) => setTimeout(r, 250));
      }

      assert.ok(ready, `vite not ready: ${stderr || stdout}`);

      const tokens = await httpGet(`${baseUrl}/ds-showcase/css/tokens.css`);
      assert.equal(tokens.status, 200);

      const resolveSrc = fs.readFileSync(
        path.join(REPO_ROOT, "portfolio", "js", "resolveAsset.js"),
        "utf8"
      );
      assert.match(resolveSrc, /@ds-assets/);
    } finally {
      await stopChild(child);
    }
  });

  it("storybook serves UI without environment crash", async () => {
    const sbBin = path.join(
      REPO_ROOT,
      "node_modules",
      "storybook",
      "bin",
      "index.cjs"
    );
    assert.ok(fs.existsSync(sbBin), "storybook binary missing — run npm ci");

    const port = 6100 + Math.floor(Math.random() * 200);
    const child = spawn(
      process.execPath,
      [
        sbBin,
        "dev",
        "-p",
        String(port),
        "--host",
        "127.0.0.1",
        "--ci",
        "--no-open",
      ],
      {
        cwd: REPO_ROOT,
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, BROWSER: "none", CI: "true" },
        windowsHide: true,
      }
    );

    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => {
      stdout += String(d);
    });
    child.stderr?.on("data", (d) => {
      stderr += String(d);
    });

    const baseUrl = `http://127.0.0.1:${port}`;
    const deadline = Date.now() + 90000;
    let ready = false;

    try {
      while (Date.now() < deadline) {
        if (child.exitCode != null) {
          throw new Error(
            `storybook exited early (${child.exitCode}): ${stderr || stdout}`
          );
        }
        try {
          const iframe = await httpGet(`${baseUrl}/iframe.html`);
          if (iframe.status === 200) {
            ready = true;
            break;
          }
          const root = await httpGet(`${baseUrl}/`);
          if (root.status === 200 && /storybook|iframe|root/i.test(root.body)) {
            ready = true;
            break;
          }
        } catch {
          /* retry */
        }
        await new Promise((r) => setTimeout(r, 500));
      }

      assert.ok(ready, `storybook did not become ready: ${stderr || stdout}`);

      const sbMain = fs.readFileSync(
        path.join(REPO_ROOT, ".storybook", "main.js"),
        "utf8"
      );
      assert.match(sbMain, /@ds-assets/);
    } finally {
      await stopChild(child);
    }
  });
});
