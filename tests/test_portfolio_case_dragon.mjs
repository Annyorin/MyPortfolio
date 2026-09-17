/**
 * Portfolio case page InnoDragon (case-dragon.html).
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

describe("portfolio case-dragon page", () => {
  it("case-dragon.html links DS CSS, case.css, and case.js module", () => {
    const html = read("portfolio/case-dragon.html");
    assert.match(html, /data-case-id=["']dragon["']/);
    assert.match(html, /href=["']\.\.\/ds-showcase\/css\/tokens\.css["']/);
    assert.match(html, /href=["']\.\.\/ds-showcase\/css\/components\.css["']/);
    assert.match(html, /href=["']css\/case\.css["']/);
    assert.match(html, /src=["']js\/case\.js["']/);
    assert.match(html, /class=["'][^"']*\bds-header\b/);
    assert.match(html, /class=["'][^"']*\bds-side-nav\b/);
    assert.match(html, /class=["'][^"']*\bds-menu-mobile\b/);
    assert.match(html, /class=["'][^"']*\bds-segments\b/);
    assert.match(html, /class=["'][^"']*\bds-fab\b/);
    assert.match(html, /href=["']main\.html["']/);
    assert.match(html, /id=["']context["']/);
    assert.match(html, /id=["']contacts["']/);
    assert.match(
      html,
      /Аня Ясинская — Продуктовый дизайнер · UX\/UI дизайнер/
    );
  });

  it("case-dragon.html includes Header, Toolbar, and drawer backdrop", () => {
    const html = read("portfolio/case-dragon.html");
    assert.match(html, /class=["'][^"']*\bds-header\b/);
    assert.match(html, /class=["'][^"']*\bds-header__title\b/);
    assert.match(html, /data-case=["']header-burger["']/);
    assert.match(html, /class=["'][^"']*\bds-toolbar\b/);
    assert.match(html, /data-case=["']toolbar-burger["']/);
    assert.match(html, /data-case=["']toolbar-back-label["']/);
    assert.match(html, /data-case=["']drawer-backdrop["']/);
    assert.match(html, /id=["']case-side-nav["']/);
    assert.match(html, /burger-menu\.svg/);
  });

  it("vite rollup input includes caseDragon entry", () => {
    const config = read("vite.config.js");
    assert.match(config, /caseDragon/);
    assert.match(config, /portfolio\/case-dragon\.html/);
  });

  it("contentMap wires card.a.url and case.dragon keys", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    assert.equal(contentMap["card.a.url"], "case-dragon.html");
    assert.ok(!Object.prototype.hasOwnProperty.call(contentMap, "card.a.action"));
    assert.equal(contentMap["case.dragon.period_label"], "Период выполнения");
    assert.equal(contentMap["case.dragon.platforms_value"], "Desktop");
    assert.equal(contentMap["case.dragon.role_value"]?.includes("UX/UI"), true);
    assert.equal(contentMap["case.dragon.team_value"]?.includes("4 фронта"), true);
    assert.match(contentMap["case.dragon.intro_body"], /## Цель/);
    assert.match(contentMap["case.dragon.intro_body"], /## Критерии успеха/);
    assert.match(contentMap["case.dragon.intro_body"], /ушёл в/);
    assert.match(contentMap["case.dragon.analysis_body"], /## Бенчмарки/);
    assert.match(contentMap["case.dragon.analysis_body"], /первый клик/);
    assert.match(contentMap["case.dragon.analysis_body"], /среднее время/);
    assert.match(contentMap["case.dragon.intro_body"], /записи прогона/);
    assert.match(contentMap["case.dragon.analysis_body"], /Weeek/);
    assert.doesNotMatch(contentMap["case.dragon.analysis_body"], /A\/B/);
    assert.doesNotMatch(contentMap["case.dragon.intro_body"], /чистые интерфейсы/);
    assert.equal(contentMap["case.dragon.context_title"], "Контекст задачи");
    assert.equal(contentMap["case.dragon.intro_title"], "Вводные");
    assert.equal(contentMap["case.dragon.next_label"], "Далее");
    assert.equal(contentMap["case.dragon.next_url"], "case-phish.html");
    assert.equal(contentMap["toolbar.back"], "Назад");
    assert.equal(contentMap["case.dragon.toolbar_title"], "InnoDragon");
    assert.match(contentMap["case.dragon.contact_heading"], /Свяжитесь\sсо/);
    assert.equal(
      contentMap.assets["case.dragon.hero"]?.pathFromDsRoot,
      "images/case-dragon-hero.png"
    );
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/images/case-dragon-hero.png")),
      "hero asset file must exist"
    );
  });

  it("case.js exports initCasePage and binds segments/FAB/drawer helpers", () => {
    const src = read("portfolio/js/case.js");
    assert.match(src, /export function initCasePage/);
    assert.match(src, /bindSegmentsControl/);
    assert.match(src, /CASE_FAB_SHOW_SCROLL_Y/);
    assert.match(src, /CASE_FAB_DIR_SLOP_PX/);
    assert.match(src, /delta\s*<\s*-CASE_FAB_DIR_SLOP_PX/);
    assert.match(src, /bindDrawer/);
    assert.match(src, /is-drawer-open/);
    assert.match(src, /dataset\.caseId|caseKeyPrefix/);
    assert.match(src, /data-case-long-only|applyCaseLengthMode/);
    assert.match(src, /bindNextCaseLink|case-page__next/);
    assert.match(src, /next_url/);
    assert.match(src, /from ["']\.\.\/\.\.\/ds-showcase\/js\/segments\.js["']/);
  });

  it("case.css covers Figma breakpoints without token redefinition", () => {
    const css = read("portfolio/css/case.css");
    assert.match(css, /\.case-page__shell/);
    assert.match(css, /\.case-page__sidebar/);
    assert.match(css, /\.case-page__toolbar/);
    assert.match(css, /position:\s*sticky/);
    assert.match(css, /@media\s*\(min-width:\s*1920px\)/);
    assert.match(css, /@media\s*\(max-width:\s*1365px\)/);
    assert.match(css, /@media\s*\(max-width:\s*768px\)/);
    assert.match(css, /@media\s*\(max-width:\s*480px\)/);
    assert.match(css, /\.case-page__toolbar\.ds-toolbar[\s\S]*display:\s*flex/);
    assert.match(css, /\.case-page__toolbar\.ds-toolbar[\s\S]*z-index:\s*120/);
    assert.match(
      css,
      /@media\s*\(max-width:\s*480px\)[\s\S]*body\.is-drawer-open\s+\.case-page__sidebar[\s\S]*z-index:\s*130/
    );
    assert.match(
      css,
      /@media\s*\(max-width:\s*480px\)[\s\S]*\.case-page__toolbar\.ds-toolbar[\s\S]*position:\s*fixed/
    );
    assert.match(
      css,
      /body\.is-drawer-open\s+\.case-page__sidebar[\s\S]*z-index:\s*115/
    );
    assert.match(css, /\.case-page__main-inner\s*>\s*\.ds-header[\s\S]*display:\s*none/);
    assert.match(css, /is-drawer-open/);
    assert.match(css, /ds-menu-mobile/);
    assert.match(css, /var\(--shadow-mobile\)/);
    assert.match(css, /max-width:\s*none/);
    assert.match(css, /\.case-page__sidebar[\s\S]*position:\s*sticky/);
    assert.match(css, /\.case-page__main-inner\s+\.ds-header[\s\S]*position:\s*sticky/);
    assert.match(css, /\.case-page__main-inner\s+\.ds-header[\s\S]*z-index:\s*120/);
    assert.match(css, /\.case-page__meta-value[\s\S]*--type-text-2-size/);
    assert.match(css, /\.case-page__fill-body[\s\S]*--type-text-2-size/);
    assert.match(
      css,
      /@media\s*\(max-width:\s*480px\)[\s\S]*\.case-page__meta-value[\s\S]*--type-caption-size/
    );
    assert.doesNotMatch(css, /--color-primary\s*:/);
  });
});
