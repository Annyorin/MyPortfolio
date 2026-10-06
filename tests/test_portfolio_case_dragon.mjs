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
    assert.match(html, /id=["']analysis["']/);
    assert.match(html, /aria-label=["']Исследование["']/);
    assert.match(html, /id=["']design["']/);
    assert.match(html, /id=["']ux_test["']/);
    assert.match(html, /id=["']finals["']/);
    assert.match(html, /id=["']conclusions["']/);
    assert.match(html, /id=["']contacts["']/);
    assert.doesNotMatch(html, /id=["']hypotheses["']/);
    assert.match(html, /data-case-nav=["']design["']/);
    assert.match(html, /data-case-nav=["']ux_test["']/);
    assert.match(html, /data-case-nav=["']finals["']/);
    assert.match(html, /Результаты/);
    assert.match(html, /case-dragon-hero\.png/);
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

  it("contentMap wires card.b.url and case.dragon keys", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    assert.equal(contentMap["card.b.url"], "case-dragon.html");
    assert.ok(!Object.prototype.hasOwnProperty.call(contentMap, "card.b.action"));
    assert.equal(contentMap["case.dragon.period_label"], "Период выполнения");
    assert.equal(contentMap["case.dragon.period_value"], "2024–2026 год");
    assert.equal(contentMap["case.dragon.platforms_value"], "Desktop");
    assert.equal(contentMap["case.dragon.role_value"]?.includes("UX/UI"), true);
    assert.equal(
      contentMap["case.dragon.team_value"]?.includes("4\u00A0фронтендера"),
      true
    );
    assert.equal(contentMap["case.dragon.context_title"], "Продукт");
    assert.equal(contentMap["case.dragon.intro_title"], "Контекст задачи");
    assert.equal(contentMap["case.dragon.analysis_title"], "Исследование");
    assert.equal(contentMap["case.dragon.design_title"], "Проектирование");
    assert.equal(contentMap["case.dragon.ux_test_title"], "UX-тест");
    assert.equal(contentMap["case.dragon.finals_title"], "Финальные макеты");
    assert.equal(
      contentMap["case.dragon.conclusions_title"],
      "Результат и\u00A0ограничения"
    );
    assert.equal(contentMap["case.dragon.nav_conclusions"], "Результаты");
    assert.match(contentMap["case.dragon.intro_body"], /## Цель/);
    assert.match(contentMap["case.dragon.intro_body"], /## Критерии успеха/);
    assert.match(contentMap["case.dragon.intro_body"], /## Как сейчас/);
    assert.match(contentMap["case.dragon.intro_body"], /\[\[img:case\.dragon\.as_is\]\]/);
    assert.match(contentMap["case.dragon.analysis_body"], /## Конкуренты/);
    assert.match(contentMap["case.dragon.analysis_body"], /MaxPatrol/);
    assert.match(contentMap["case.dragon.analysis_body"], /Weeek/);
    assert.doesNotMatch(contentMap["case.dragon.analysis_body"], /KnowBe4/);
    assert.match(contentMap["case.dragon.analysis_body"], /## Результаты интервью/);
    assert.match(contentMap["case.dragon.analysis_body"], /## Гипотезы/);
    assert.match(contentMap["case.dragon.analysis_body"], /## JTBD/);
    assert.match(
      contentMap["case.dragon.analysis_body"],
      /\[\[jtbd:case\.dragon\.jtbd\]\]/
    );
    assert.equal(contentMap.jtbdGrids?.["case.dragon.jtbd"]?.length, 9);
    assert.equal(contentMap.jtbdGrids["case.dragon.jtbd"][0].cells.length, 3);
    assert.match(
      contentMap.jtbdGrids["case.dragon.jtbd"][0].cells[0].prefix,
      /^Когда /
    );
    assert.match(
      contentMap.jtbdGrids["case.dragon.jtbd"][0].cells[0].text,
      /критичное уведомление/
    );
    assert.equal(
      contentMap.jtbdGrids["case.dragon.jtbd"][8].cells[1].prefix,
      "Я не хочу "
    );
    assert.match(
      contentMap["case.dragon.analysis_body"],
      /\[\[img:case\.dragon\.competitors\]\]/
    );
    assert.match(contentMap["case.dragon.design_body"], /\[\[img:case\.dragon\.ia\]\]/);
    assert.match(
      contentMap["case.dragon.design_body"],
      /\[\[img:case\.dragon\.flow\]\]/
    );
    assert.match(contentMap["case.dragon.ux_test_body"], /0,6/);
    assert.match(contentMap["case.dragon.ux_test_body"], /1,3/);
    assert.match(
      contentMap["case.dragon.ux_test_body"],
      /\[\[img:case\.dragon\.test_btn/
    );
    assert.match(
      contentMap["case.dragon.ux_test_body"],
      /\[\[img:case\.dragon\.test_toggle/
    );
    assert.match(
      contentMap["case.dragon.finals_body"],
      /\[\[img:case\.dragon\.final_1\]\]/
    );
    assert.match(
      contentMap["case.dragon.finals_body"],
      /\[\[img:case\.dragon\.final_2\]\]/
    );
    assert.doesNotMatch(contentMap["case.dragon.intro_body"], /чистые интерфейсы/);
    assert.ok(!Object.prototype.hasOwnProperty.call(contentMap, "case.dragon.hypotheses_body"));
    assert.equal(contentMap["case.dragon.next_label"], "Далее");
    assert.equal(contentMap["case.dragon.next_url"], "case-phish.html");
    assert.equal(contentMap["toolbar.back"], "Назад");
    assert.equal(contentMap["case.dragon.toolbar_title"], "InnoDragon");
    assert.match(contentMap["case.dragon.contact_heading"], /Свяжитесь\sсо/);
    assert.equal(
      contentMap.assets["case.dragon.hero"]?.pathFromDsRoot,
      "images/case-dragon-hero.png"
    );
    for (const key of [
      "case.dragon.hero",
      "case.dragon.as_is",
      "case.dragon.competitors",
      "case.dragon.ia",
      "case.dragon.flow",
      "case.dragon.test_btn",
      "case.dragon.test_toggle",
      "case.dragon.final_1",
      "case.dragon.final_2",
    ]) {
      const rel = contentMap.assets[key]?.pathFromDsRoot;
      assert.ok(rel, `${key} asset key missing`);
      assert.ok(
        fs.existsSync(abs(`ds-showcase/assets/${rel}`)),
        `${rel} must exist`
      );
    }
  });

  it("contentMap wraps InnoDragon highlighter phrases in == markers", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    const analysis = contentMap["case.dragon.analysis_body"];
    const ux = contentMap["case.dragon.ux_test_body"];
    const finals = contentMap["case.dragon.finals_body"];
    const conclusions = contentMap["case.dragon.conclusions_body"];
    assert.match(
      analysis,
      /==Проанализировала аналогичные продукты и\u00A0сделала таблицу фич==/
    );
    assert.match(
      analysis,
      /==Из\u00A0этого сформулировала требования к\u00A0решению\.==/
    );
    assert.match(analysis, /==Провёла интервью==/);
    assert.doesNotMatch(analysis, /==Провела интервью==/);
    assert.match(ux, /==Что\u00A0было\.==/);
    assert.match(ux, /==Чего не\u00A0было\.==/);
    assert.match(ux, /==Протестировала интерфейс,==/);
    assert.match(ux, /==0,6\u00A0сек против 0,7\.==/);
    assert.match(ux, /==1,3\u00A0мин против 2\u00A0мин\.==/);
    assert.doesNotMatch(finals, /==/);
    assert.match(conclusions, /==Что\u00A0сделала\.==/);
    assert.match(conclusions, /==Чему научило\.==/);
    assert.match(conclusions, /==Что\u00A0не\u00A0измеряла\.==/);
    assert.match(conclusions, /==Что\u00A0дальше\.==/);
    assert.match(conclusions, /==Что\u00A0сделала\u00A0бы\u00A0иначе\.==/);
    assert.match(conclusions, /3,5/);
  });

  it("case.js exports initCasePage and binds segments/FAB/drawer helpers", () => {
    const src = read("portfolio/js/case.js");
    assert.match(src, /export function initCasePage/);
    assert.match(src, /export function setupCaseReveal/);
    assert.match(src, /fillContent\(contentMap,\s*caseId\);\s*const unbindReveal = setupCaseReveal\(\)/);
    assert.match(src, /rootMargin:\s*["']0px 0px -8% 0px["']/);
    assert.match(src, /threshold:\s*\[\s*0\s*,\s*0\.12\s*\]/);
    assert.match(src, /isCaseBlockOnScreenOrPast/);
    assert.doesNotMatch(src, /CASE_REVEAL_STAGGER/);
    assert.match(src, /is-page-enter-crossfade/);
    assert.match(src, /PAGE_CROSSFADE_MS/);
    assert.match(src, /prefers-reduced-motion:\s*reduce/);
    assert.match(src, /bindSegmentsControl/);
    assert.match(src, /CASE_FAB_SHOW_SCROLL_Y/);
    assert.match(src, /CASE_FAB_DIR_SLOP_PX/);
    assert.match(src, /delta\s*<\s*-CASE_FAB_DIR_SLOP_PX/);
    assert.match(src, /browserHasNativeScrollTopButton/);
    assert.match(src, /bindDrawer/);
    assert.match(src, /is-drawer-open/);
    assert.match(src, /documentElement\.classList\.toggle\("is-drawer-open"/);
    assert.match(src, /dataset\.caseId|caseKeyPrefix/);
    assert.match(src, /data-case-long-only|applyCaseLengthMode/);
    assert.match(src, /bindNextCaseLink|case-page__next/);
    assert.match(src, /next_url/);
    assert.match(src, /from ["']\.\.\/\.\.\/ds-showcase\/js\/segments\.js["']/);
    assert.match(
      src,
      /caseId === ["']phish["'] \|\| caseId === ["']dragon["']/
    );
    assert.match(src, /fillStubSection\(["']design["']/);
    assert.match(src, /fillStubSection\(["']ux_test["']/);
    assert.match(src, /fillStubSection\(["']finals["']/);
  });

  it("case.css covers Figma breakpoints without token redefinition", () => {
    const css = read("portfolio/css/case.css");
    assert.match(css, /\.case-page__shell/);
    assert.match(css, /\.case-page__sidebar/);
    assert.match(css, /\.case-page__toolbar/);
    assert.match(css, /position:\s*sticky/);
    assert.match(css, /@media\s*\(min-width:\s*1920px\)/);
    assert.match(css, /@media\s*\(max-width:\s*1365px\)/);
    assert.match(
      css,
      /@media\s*\(max-width:\s*1365px\)[\s\S]*body\.is-drawer-open[\s\S]*overflow:\s*hidden/
    );
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
    assert.match(
      css,
      /body\.case-page\s+\.is-reveal[\s\S]*opacity:\s*0[\s\S]*translateY\(10px\)/
    );
    assert.match(
      css,
      /body\.case-page\s+\.is-reveal\.is-in[\s\S]*opacity:\s*1/
    );
    assert.match(
      css,
      /360ms\s+cubic-bezier\(0\.33,\s*0\.05,\s*0\.2,\s*1\)/
    );
    assert.match(
      css,
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*body\.case-page\s+\.is-reveal[\s\S]*transition:\s*none/
    );
    assert.match(
      css,
      /html\[data-theme="dark"\]\s+body\.case-page\s+\.ds-header\s+\.ds-icon\s*>\s*img/
    );
    assert.match(
      css,
      /invert\(1\)\s+hue-rotate\(180deg\)\s+!important/
    );
    assert.match(
      css,
      /html\[data-theme="dark"\]\s+body\.case-page\s+\.ds-fab\s+\.ds-icon\s*>\s*img/
    );
    assert.doesNotMatch(css, /--color-primary\s*:/);
  });
});
