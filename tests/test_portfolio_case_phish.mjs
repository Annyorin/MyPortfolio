/**
 * Portfolio case page InnoPhish (case-phish.html).
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

/**
 * @param {string} relativePath
 * @returns {string}
 */
function abs(relativePath) {
  return path.join(REPO_ROOT, relativePath);
}

/**
 * @param {string} relativePath
 * @returns {string}
 */
function read(relativePath) {
  return fs.readFileSync(abs(relativePath), "utf8");
}

describe("portfolio case-phish page", () => {
  it("case-phish.html links DS CSS, case.css, case.js and data-case-id", () => {
    const html = read("portfolio/case-phish.html");
    assert.match(html, /data-case-id=["']phish["']/);
    assert.match(html, /<title>\s*InnoPhish\s*<\/title>/);
    assert.match(html, /href=["']\.\.\/ds-showcase\/css\/tokens\.css["']/);
    assert.match(html, /href=["']\.\.\/ds-showcase\/css\/components\.css["']/);
    assert.match(html, /href=["']css\/case\.css["']/);
    assert.match(html, /src=["']js\/case\.js["']/);
    assert.match(html, /class=["'][^"']*\bds-header\b/);
    assert.match(html, /class=["'][^"']*\bds-side-nav\b/);
    assert.match(html, /class=["'][^"']*\bds-segments\b/);
    assert.match(html, /class=["'][^"']*\bds-fab\b/);
    assert.match(html, /href=["']main\.html["']/);
    assert.match(html, /id=["']context["']/);
    assert.match(html, /id=["']analysis["']/);
    assert.match(html, /id=["']hypotheses["']/);
    assert.match(html, /id=["']conclusions["']/);
    assert.match(html, /id=["']contacts["']/);
    assert.match(html, /images\/phish\.png/);
    assert.match(html, /mc\.yandex\.ru\/metrika\/tag\.js/);
  });

  it("case-phish.html includes Header, Toolbar, and drawer backdrop", () => {
    const html = read("portfolio/case-phish.html");
    assert.match(html, /class=["'][^"']*\bds-header\b/);
    assert.match(html, /data-case=["']header-burger["']/);
    assert.match(html, /class=["'][^"']*\bds-toolbar\b/);
    assert.match(html, /data-case=["']toolbar-burger["']/);
    assert.match(html, /data-case=["']drawer-backdrop["']/);
    assert.match(html, /id=["']case-side-nav["']/);
  });

  it("vite rollup input includes casePhish entry", () => {
    const config = read("vite.config.js");
    assert.match(config, /casePhish/);
    assert.match(config, /portfolio\/case-phish\.html/);
  });

  it("contentMap wires card.b.url and case.phish keys", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    assert.equal(contentMap["card.b.url"], "case-phish.html");
    assert.ok(!Object.prototype.hasOwnProperty.call(contentMap, "card.b.action"));
    assert.equal(
      contentMap["card.b.description"],
      "Для\u00A0ИБ — сводка обучения и\u00A0атак в\u00A0одном дашборде вместо Excel-склейки."
    );
    assert.equal(contentMap["case.phish.period_label"], "Период выполнения");
    assert.equal(contentMap["case.phish.platforms_value"], "Desktop");
    assert.equal(contentMap["case.phish.role_value"]?.includes("UX/UI"), true);
    assert.equal(contentMap["case.phish.team_value"]?.includes("4 фронта"), true);
    assert.equal(contentMap["case.phish.context_title"], "Контекст задачи");
    assert.equal(contentMap["case.phish.intro_title"], "Вводные");
    assert.ok(contentMap["case.phish.analysis_body"]);
    assert.ok(contentMap["case.phish.hypotheses_body"]);
    assert.ok(contentMap["case.phish.conclusions_body"]);
    assert.equal(contentMap["case.phish.next_label"], "Далее");
    assert.equal(contentMap["case.phish.next_url"], "case-dragon.html");
    assert.equal(contentMap["case.phish.toolbar_title"], "InnoPhish");
    assert.equal(
      contentMap.assets["case.phish.hero"]?.pathFromDsRoot,
      "images/phish.png"
    );
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/images/phish.png")),
      "hero asset file must exist"
    );
  });

  it("case.js reads data-case-id and fills stub sections / short mode", () => {
    const src = read("portfolio/js/case.js");
    assert.match(src, /dataset\.caseId|readCaseId/);
    assert.match(src, /case\.\$\{|caseKeyPrefix/);
    assert.match(src, /card\.b|CASE_CARD_PREFIX/);
    assert.match(src, /fillStubSection/);
    assert.match(src, /analysis_title|hypotheses_title|conclusions_title/);
    assert.match(src, /data-case-long-only|applyCaseLengthMode/);
    assert.match(src, /role_value|team_value/);
  });
});
