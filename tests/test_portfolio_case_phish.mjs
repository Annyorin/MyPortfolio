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
    assert.match(html, /aria-label=["']Исследование["']/);
    assert.match(html, /id=["']design["']/);
    assert.match(html, /id=["']ux_test["']/);
    assert.match(html, /id=["']finals["']/);
    assert.match(html, /id=["']conclusions["']/);
    assert.match(html, /id=["']contacts["']/);
    assert.doesNotMatch(html, /id=["']hypotheses["']/);
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

  it("contentMap wires card.a.url and case.phish keys", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    assert.equal(contentMap["card.a.url"], "case-phish.html");
    assert.ok(!Object.prototype.hasOwnProperty.call(contentMap, "card.a.action"));
    assert.equal(
      contentMap["card.a.description"],
      "Программа для\u00A0повышения осведомлённости\nсотрудников в\u00A0области ИБ\u00A0и\u00A0укрепления\nих устойчивости к\u00A0кибератакам, основанным\nна\u00A0социальной инженерии."
    );
    assert.equal(contentMap["case.phish.period_label"], "Период выполнения");
    assert.equal(contentMap["case.phish.platforms_value"], "Desktop");
    assert.equal(contentMap["case.phish.role_value"]?.includes("UX/UI"), true);
    assert.equal(contentMap["case.phish.team_value"]?.includes("4"), true);
    assert.equal(contentMap["case.phish.context_title"], "Продукт");
    assert.equal(contentMap["case.phish.intro_title"], "Контекст задачи");
    assert.equal(contentMap["case.phish.analysis_title"], "Исследование");
    assert.equal(contentMap["case.phish.design_title"], "Проектирование");
    assert.equal(contentMap["case.phish.ux_test_title"], "UX-тест");
    assert.equal(contentMap["case.phish.finals_title"], "Финальные макеты");
    assert.match(contentMap["case.phish.intro_body"], /## Цель/);
    assert.match(contentMap["case.phish.intro_body"], /## Критерии успеха/);
    assert.match(contentMap["case.phish.analysis_body"], /## Вопросы пользователям/);
    assert.match(contentMap["case.phish.analysis_body"], /## Гипотезы/);
    assert.match(contentMap["case.phish.analysis_body"], /## JTBD/);
    assert.match(contentMap["case.phish.analysis_body"], /\[\[jtbd:case\.phish\.jtbd\]\]/);
    assert.equal(contentMap.jtbdGrids?.["case.phish.jtbd"]?.length, 8);
    assert.equal(contentMap.jtbdGrids["case.phish.jtbd"][0].cells.length, 3);
    assert.match(contentMap.jtbdGrids["case.phish.jtbd"][0].cells[0].prefix, /Когда я/);
    assert.match(contentMap["case.phish.design_body"], /\[\[img:case\.phish\.ia\]\]/);
    assert.match(contentMap["case.phish.ux_test_body"], /3,4/);
    assert.doesNotMatch(contentMap["case.phish.analysis_body"], /Пять чисел/);
    const innophish = read("design/03-content/copy/innophish.md");
    assert.match(innophish, /## Вопрос/);
    assert.match(innophish, /EvilGo Phish/);
    assert.ok(contentMap["case.phish.conclusions_body"]);
    assert.equal(contentMap["case.phish.nav_conclusions"], "Результаты");
    assert.equal(contentMap["case.phish.next_label"], "Далее");
    assert.equal(contentMap["case.phish.next_url"], "case-dragon.html");
    assert.equal(contentMap["case.phish.toolbar_title"], "InnoPhish");
    assert.equal(
      contentMap.assets["case.phish.hero"]?.pathFromDsRoot,
      "images/phish.png"
    );
    assert.equal(
      contentMap.assets["case.phish.hero"]?.fullPathFromDsRoot,
      "images/case-phish-hero-full.png"
    );
    assert.equal(contentMap.assets["case.phish.final_2"]?.layout, "center");
    assert.equal(
      contentMap.assets["case.phish.final_2"]?.fullPathFromDsRoot,
      "images/case-phish-final-2-full.png"
    );
    for (const key of [
      "case.phish.ia",
      "case.phish.business",
      "case.phish.flow",
      "case.phish.test_2tabs",
      "case.phish.test_3tabs",
      "case.phish.final_1",
      "case.phish.final_2",
    ]) {
      const rel = contentMap.assets[key]?.pathFromDsRoot;
      assert.ok(rel, `${key} asset key missing`);
      assert.ok(
        fs.existsSync(abs(`ds-showcase/assets/${rel}`)),
        `${rel} must exist`
      );
    }
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/images/phish.png")),
      "hero asset file must exist"
    );
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/images/case-phish-hero-full.png")),
      "hero full/lightbox asset must exist"
    );
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/images/case-phish-final-2-full.png")),
      "final_2 full/lightbox asset must exist"
    );
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/icons/cursor-zoom-in.svg")),
      "zoom cursor asset must exist"
    );
  });

  it("case.js reads data-case-id and fills stub sections / short mode", () => {
    const src = read("portfolio/js/case.js");
    assert.match(src, /dataset\.caseId|readCaseId/);
    assert.match(src, /case\.\$\{|caseKeyPrefix/);
    assert.match(src, /card\.a|CASE_CARD_PREFIX/);
    assert.match(src, /fillStubSection/);
    assert.match(src, /analysis_title|design_title|ux_test_title|finals_title|conclusions_title/);
    assert.match(src, /setupCaseLightbox|data-case-zoomable/);
    assert.match(src, /dataset\.fullSrc|data-full-src|full:\s*true/);
    assert.match(src, /waitForCasePictureLayout/);
    assert.match(src, /case-page__lightbox-close|createLightboxTapper|ds-tapper/);
    assert.match(src, /translate\(\$\{Math\.round\(x\)\}px/);
    assert.match(src, /scale\(\$\{k\}\)/);
    assert.match(src, /pointermove/);
    assert.match(src, /zoomAt/);
    assert.match(src, /CASE_IMG_MARKER_RE|\[\[img:/);
    assert.match(src, /CASE_JTBD_MARKER_RE|\[\[jtbd:/);
    assert.match(src, /createJtbdGrid|case-page__jtbd/);
    assert.match(src, /case-page__text-sub/);
    assert.match(src, /data-case-long-only|applyCaseLengthMode/);
    assert.match(src, /role_value|team_value/);
    assert.match(src, /hasHeadings/);
    assert.doesNotMatch(src, /loading\s*=\s*["']lazy["']/);
    // Reveal targets each text/picture in stubs (same unit grain as Dragon
    // context blocks), not the whole .case-page__section-stub.
    assert.match(
      src,
      /\.case-page__section-stub\s*>\s*\.case-page__text-block/
    );
    assert.match(
      src,
      /\.case-page__section-stub\s*>\s*\.case-page__picture/
    );
    assert.doesNotMatch(
      src,
      /CASE_REVEAL_SELECTORS\s*=\s*\[[^\]]*["']\.case-page__section-stub["']/s
    );
  });

  it("case.css styles zoomable inline pictures and lightbox chrome", () => {
    const css = read("portfolio/css/case.css");
    assert.match(css, /\.case-page__jtbd/);
    assert.match(css, /\.case-page__fill-block--compact/);
    assert.match(css, /grid-template-columns:\s*repeat\(3/);
    assert.match(css, /\[data-case-zoomable\]/);
    assert.match(css, /\.case-page__picture--inline/);
    assert.match(
      css,
      /\.case-page__picture--inline[^{]*\{[^}]*overflow:\s*hidden/s
    );
    assert.match(
      css,
      /\.case-page__picture-caption[^{]*\{[^}]*--type-caption-size/s
    );
    assert.match(css, /\.case-page__picture--center \.case-page__picture-img/);
    assert.match(css, /\.case-page__lightbox-close/);
    assert.match(
      css,
      /\.case-page__lightbox-close\.ds-button-round\s*\{[^}]*color:\s*var\(--color-black\)/s
    );
    assert.match(
      css,
      /\.case-page__lightbox-close\.ds-button-round:hover[\s\S]*?color:\s*var\(--color-gray-text\)/
    );
    assert.match(css, /icons\/close\.svg/);
    assert.match(css, /\.case-page__lightbox-tapper/);
    assert.match(css, /cursor-zoom-in\.svg/);
    assert.match(css, /\.case-page__lightbox-stage[^{]*\{[^}]*overflow:\s*hidden/s);
    assert.match(css, /transform-origin:\s*0\s+0/);
    // Lightbox close uses DS tokens, not forced light hex chrome.
    assert.doesNotMatch(
      css,
      /\.case-page__lightbox-close[^{]*\{[^}]*#fefefe\s*!important/s
    );
  });
});
