/**
 * Smoke: portfolio entry HTML wiring (no-mock parse of real main.html).
 *
 * TC-E2E-02: DS tokens/components CSS links; .viewport / .world; module main.js
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const ENTRY_HTML = path.join(REPO_ROOT, "portfolio", "main.html");

describe("portfolio entry HTML smoke (stubs)", () => {
  it("TC-E2E-02: entry HTML links DS CSS, has .viewport/.world and module main.js", () => {
    assert.ok(fs.existsSync(ENTRY_HTML), "missing portfolio/main.html");
    const html = fs.readFileSync(ENTRY_HTML, "utf8");

    assert.match(
      html,
      /href=["']\.\.\/ds-showcase\/css\/tokens\.css["']/,
      "tokens.css link required"
    );
    assert.match(
      html,
      /href=["']\.\.\/ds-showcase\/css\/components\.css["']/,
      "components.css link required"
    );
    assert.match(html, /class=["'][^"']*\bviewport\b/, ".viewport required");
    assert.match(html, /class=["'][^"']*\bworld\b/, ".world required");
    assert.match(
      html,
      /<script\s+type=["']module["']\s+src=["']js\/main\.js["']/,
      "module main.js required"
    );
  });
});
