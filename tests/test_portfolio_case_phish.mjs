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
    assert.match(html, /images\/case-phish-hero\.png/);
    assert.doesNotMatch(html, /images\/phish\.png/);
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
    assert.match(contentMap["case.phish.analysis_body"], /## Конкуренты/);
    assert.match(contentMap["case.phish.analysis_body"], /## Результаты интервью/);
    assert.doesNotMatch(contentMap["case.phish.analysis_body"], /## Вопросы пользователям/);
    assert.match(contentMap["case.phish.analysis_body"], /## Гипотезы/);
    assert.match(contentMap["case.phish.analysis_body"], /## JTBD/);
    assert.match(contentMap["case.phish.analysis_body"], /\[\[jtbd:case\.phish\.jtbd\]\]/);
    assert.equal(contentMap.jtbdGrids?.["case.phish.jtbd"]?.length, 7);
    assert.equal(contentMap.jtbdGrids["case.phish.jtbd"][0].cells.length, 3);
    assert.match(contentMap.jtbdGrids["case.phish.jtbd"][0].cells[0].prefix, /^Когда /);
    assert.match(
      contentMap.jtbdGrids["case.phish.jtbd"][0].cells[0].text,
      /CISO/
    );
    assert.match(contentMap["case.phish.analysis_body"], /\[\[img:case\.phish\.competitors\]\]/);
    assert.match(contentMap["case.phish.design_body"], /\[\[img:case\.phish\.ia\]\]/);
    assert.match(contentMap["case.phish.design_body"], /\[\[img:case\.phish\.flow\]\]/);
    assert.doesNotMatch(contentMap["case.phish.design_body"], /Бизнес-схема/);
    assert.doesNotMatch(contentMap["case.phish.design_body"], /case\.phish\.business/);
    assert.ok(!Object.prototype.hasOwnProperty.call(contentMap.assets, "case.phish.business"));
    assert.ok(
      !fs.existsSync(abs("ds-showcase/assets/images/case-phish-business.png")),
      "orphan business asset must be removed"
    );
    assert.match(
      contentMap["case.phish.ux_test_body"],
      /\[\[imgscroll:case\.phish\.test_2tabs,case\.phish\.test_2tabs_2\|/
    );
    assert.match(
      contentMap["case.phish.ux_test_body"],
      /\[\[imgscroll:case\.phish\.test_3tabs,case\.phish\.test_3tabs_2,case\.phish\.test_3tabs_3\|/
    );
    assert.match(
      contentMap["case.phish.finals_body"],
      /\[\[imgscroll:case\.phish\.final_1,case\.phish\.final_1_2\]\]/
    );
    assert.match(contentMap["case.phish.finals_body"], /\[\[img:case\.phish\.final_2\]\]/);
    assert.equal(
      (contentMap["case.phish.analysis_body"].match(/Мы\u00A0считаем/g) || []).length,
      5
    );
    assert.match(contentMap["case.phish.ux_test_body"], /3,4/);
    assert.doesNotMatch(contentMap["case.phish.analysis_body"], /оспециалисты/);
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
      "images/case-phish-hero.png"
    );
    assert.equal(
      contentMap.assets["case.phish.hero"]?.fullPathFromDsRoot,
      "images/case-phish-hero-full.png"
    );
    assert.equal(
      contentMap.assets["case.phish.competitors"]?.fullPathFromDsRoot,
      "images/case-phish-competitors-full.png"
    );
    assert.equal(
      contentMap.assets["case.phish.ia"]?.fullPathFromDsRoot,
      "images/case-phish-ia-full.png"
    );
    assert.equal(
      contentMap.assets["case.phish.flow"]?.fullPathFromDsRoot,
      "images/case-phish-flow-full.png"
    );
    assert.equal(
      contentMap.assets["case.phish.final_2"]?.fullPathFromDsRoot,
      "images/case-phish-final-2-full.png"
    );
    assert.equal(contentMap.assets["case.phish.final_1"]?.intrinsicWidth, 287);
    assert.equal(contentMap.assets["case.phish.final_1"]?.intrinsicHeight, 276);
    assert.equal(contentMap.assets["case.phish.final_1_2"]?.intrinsicWidth, 277);
    assert.equal(contentMap.assets["case.phish.final_1_2"]?.intrinsicHeight, 416);
    for (const key of [
      "case.phish.hero",
      "case.phish.ia",
      "case.phish.competitors",
      "case.phish.flow",
      "case.phish.test_2tabs",
      "case.phish.test_2tabs_2",
      "case.phish.test_3tabs",
      "case.phish.test_3tabs_2",
      "case.phish.test_3tabs_3",
      "case.phish.final_1",
      "case.phish.final_1_2",
      "case.phish.final_2",
    ]) {
      const rel = contentMap.assets[key]?.pathFromDsRoot;
      assert.ok(rel, `${key} asset key missing`);
      assert.ok(
        fs.existsSync(abs(`ds-showcase/assets/${rel}`)),
        `${rel} must exist`
      );
      const full = contentMap.assets[key]?.fullPathFromDsRoot;
      assert.ok(full, `${key} fullPathFromDsRoot missing`);
      assert.ok(
        fs.existsSync(abs(`ds-showcase/assets/${full}`)),
        `${full} must exist`
      );
    }
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/images/phish.png")),
      "main cover phish.png must remain untouched"
    );
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/images/case-phish-hero.png")),
      "case hero inline asset must exist"
    );
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/images/case-phish-hero-full.png")),
      "hero full/lightbox asset must exist"
    );
    assert.ok(
      fs.existsSync(abs("ds-showcase/assets/images/case-phish-competitors-full.png")),
      "competitors full/lightbox asset must exist"
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
    assert.match(src, /aria-disabled/);
    assert.match(src, /draggable\s*=\s*false/);
    assert.match(src, /pointerup/);
    assert.match(src, /translate\(\$\{Math\.round\(x\)\}px/);
    assert.match(src, /nw \* k/);
    assert.match(src, /LIGHTBOX_FIT_PAD_TOP/);
    assert.match(src, /LIGHTBOX_OPEN_SCALE/);
    assert.match(src, /LIGHTBOX_WIDE_ASPECT/);
    assert.doesNotMatch(src, /scale\(\$\{k\}\)/);
    assert.match(src, /pointermove/);
    assert.match(src, /zoomAt/);
    assert.match(src, /CASE_IMG_MARKER_RE|\[\[img:/);
    assert.match(src, /CASE_IMGSCROLL_MARKER_RE|\[\[imgscroll:/);
    assert.match(src, /createCasePictureScroll/);
    assert.match(src, /case-page__lightbox-chrome|createLightboxNavButton/);
    assert.match(src, /pointerDistance|pinch/);
    assert.match(src, /intrinsicWidth/);
    assert.match(src, /img\.style\.width\s*=\s*`\$\{frameW\}px`/);
    assert.match(src, /CASE_JTBD_MARKER_RE|\[\[jtbd:/);
    assert.match(src, /createJtbdGrid|case-page__jtbd/);
    assert.match(src, /createJtbdMergedCard|case-page__jtbd-merged/);
    assert.match(src, /case-page__jtbd-cell/);
    assert.match(src, /case-page__text-sub/);
    assert.match(src, /data-case-long-only|applyCaseLengthMode/);
    assert.match(src, /link\.hidden = Boolean\(section\.hidden\)/);
    assert.match(src, /role_value|team_value/);
    assert.match(src, /hasHeadings/);
    // Hscroll frames after the first may lazy-load; inline pictures stay eager.
    assert.match(src, /if\s*\(\s*index\s*>\s*0\s*\)\s*\{[\s\S]*?loading\s*=\s*["']lazy["']/);
    assert.match(
      src,
      /function createCasePicture\([\s\S]*?wrap\.appendChild\(img\);\s*return wrap;\s*\}/
    );
    assert.doesNotMatch(
      src,
      /function createCasePicture\([\s\S]*?loading\s*=\s*["']lazy["'][\s\S]*?wrap\.appendChild\(img\);\s*return wrap;\s*\}/
    );
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

  it("contentMap wraps InnoPhish highlighter phrases in == markers", async () => {
    const { contentMap } = await import(
      pathToFileURL(abs("shared/content.js")).href
    );
    const analysis = contentMap["case.phish.analysis_body"];
    const ux = contentMap["case.phish.ux_test_body"];
    const finals = contentMap["case.phish.finals_body"];
    const conclusions = contentMap["case.phish.conclusions_body"];
    assert.match(
      analysis,
      /==Проанализировала конкурентов и\u00A0выявила общие паттерны\/метрики\.==/
    );
    assert.match(
      analysis,
      /==Из\u00A0этого сформулировала требования к\u00A0решению\.== Первый экран/
    );
    assert.match(analysis, /==Не\u00A0стала копировать:== Две/);
    assert.match(analysis, /==Провёла интервью==/);
    assert.doesNotMatch(analysis, /==Провела интервью==/);
    assert.match(ux, /==Что\u00A0было\.==/);
    assert.match(ux, /==Чего не\u00A0было\.==/);
    assert.match(ux, /==Протестировала интерфейс,==/);
    assert.match(
      ux,
      /==уменьшилось с\u00A03,4\u00A0минут до\u00A045\u00A0сек\.==/
    );
    assert.doesNotMatch(finals, /==/);
    assert.match(conclusions, /==Что\u00A0сделала\.==/);
    assert.match(conclusions, /==Чему научило\.==/);
    assert.match(conclusions, /==Что\u00A0не\u00A0измеряла\.==/);
    assert.match(conclusions, /==Что\u00A0дальше\.==/);
    assert.match(conclusions, /==Что\u00A0сделала\u00A0бы\u00A0иначе\.==/);
    const wrapped = [analysis, ux, finals, conclusions].join("\n");
    const markCount = (wrapped.match(/==/g) || []).length / 2;
    assert.equal(markCount, 13);
  });

  it("case.js parses == marks and observes highlighter sweep", () => {
    const src = read("portfolio/js/case.js");
    assert.match(src, /CASE_MARK_RE/);
    assert.match(src, /==\(\[\\s\\S\]\+\?\)==/);
    assert.match(src, /setMarkedText/);
    assert.match(src, /case-page__mark/);
    assert.match(src, /setupCaseMarks/);
    assert.match(src, /IntersectionObserver/);
    assert.match(src, /--highlighted/);
    assert.match(src, /unbindMarks/);
  });

  it("case.css highlighter uses primary token, gradient, reduced-motion", () => {
    const css = read("portfolio/css/case.css");
    assert.match(css, /\.case-page__mark/);
    assert.match(css, /--highlighted/);
    assert.match(css, /color:\s*var\(--color-white\)/);
    assert.match(css, /linear-gradient\(120deg/);
    assert.match(
      css,
      /color-mix\(in srgb,\s*var\(--color-primary\)\s*80%,\s*transparent\)/
    );
    assert.match(css, /box-decoration-break:\s*clone/);
    assert.match(
      css,
      /prefers-reduced-motion:\s*reduce[\s\S]*?\.case-page__mark[\s\S]*?--highlighted:\s*1/s
    );
    assert.doesNotMatch(css, /#3d8ffe/i);
  });

  it("case.css phish hscroll uses natural height without cover crop", () => {
    const css = read("portfolio/css/case.css");
    // Shared Dragon canon stays cover 530×269.
    assert.match(css, /\.case-page__hscroll-img\s*\{[^}]*height:\s*269px/s);
    assert.match(css, /\.case-page__hscroll-img\s*\{[^}]*object-fit:\s*cover/s);
    // Shared: --scroll / --inline hug content.
    assert.match(
      css,
      /\.case-page__picture--scroll\s*,\s*\.case-page__picture--inline\s*\{[^}]*aspect-ratio:\s*auto/s
    );
    assert.match(
      css,
      /\.case-page__picture--scroll\s*,\s*\.case-page__picture--inline\s*\{[^}]*max-height:\s*none/s
    );
    assert.match(
      css,
      /\.case-page__picture--scroll\s*\{[^}]*aspect-ratio:\s*auto/s
    );
    assert.match(
      css,
      /\.case-page__picture--inline\s*\{[^}]*max-height:\s*none/s
    );
    // Caption→frames gap 16 on --scroll (phish + dragon; hug/crop overrides stay phish-only).
    assert.match(
      css,
      /body\.case-page\[data-case-id=["']phish["']\]\s+\.case-page__picture--scroll\s*,\s*body\.case-page\[data-case-id=["']dragon["']\]\s+\.case-page__picture--scroll\s*\{[^}]*gap:\s*16px/s
    );
    // Phish-only override: max natural height, no crop, no stretch.
    assert.match(
      css,
      /body\.case-page\[data-case-id=["']phish["']\]\s+\.case-page__hscroll-track\s*\{[^}]*align-items:\s*flex-start/s
    );
    assert.match(
      css,
      /body\.case-page\[data-case-id=["']phish["']\]\s+\.case-page__hscroll-img\s*\{[^}]*height:\s*auto/s
    );
    assert.match(
      css,
      /body\.case-page\[data-case-id=["']phish["']\]\s+\.case-page__hscroll-img\s*\{[^}]*aspect-ratio:\s*auto/s
    );
    assert.match(
      css,
      /body\.case-page\[data-case-id=["']phish["']\]\s+\.case-page__hscroll-img\s*\{[^}]*object-fit:\s*contain/s
    );
    // Mobile: phish keeps intrinsic ratio (overrides 530/269 lock).
    assert.match(
      css,
      /@media\s*\(max-width:\s*480px\)[\s\S]*body\.case-page\[data-case-id=["']phish["']\]\s+\.case-page__hscroll-img\s*\{[^}]*aspect-ratio:\s*auto/s
    );
  });

  it("case.css styles zoomable inline pictures and lightbox chrome", () => {
    const css = read("portfolio/css/case.css");
    assert.match(css, /\.case-page__jtbd/);
    assert.match(css, /\.case-page__fill-block--compact/);
    assert.match(css, /grid-template-columns:\s*repeat\(3/);
    assert.match(css, /\.case-page__jtbd-merged/);
    assert.match(
      css,
      /@media\s*\(max-width:\s*768px\)[\s\S]*?\.case-page__jtbd-merged\s*\{[^}]*display:\s*flex/s
    );
    assert.match(
      css,
      /@media\s*\(max-width:\s*768px\)[\s\S]*?\.case-page__jtbd-row\s*>\s*\.case-page__jtbd-cell\s*\{[^}]*display:\s*none/s
    );
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
    assert.match(css, /\.case-page__lightbox-chrome/);
    assert.match(css, /\.case-page__lightbox-tapper/);
    assert.match(
      css,
      /@media\s*\(max-width:\s*768px\)[\s\S]*?\.case-page__lightbox-tapper\s*\{[^}]*display:\s*none/s
    );
    assert.match(
      css,
      /\.case-page__lightbox-tapper[\s\S]*?\[data-tapper-action="zoom-out"\]\s*\{[^}]*padding:\s*8px 12px 8px 16px/s
    );
    assert.match(
      css,
      /\.case-page__lightbox-tapper[\s\S]*?pointer-events:\s*none/
    );
    // aria-disabled is behavioral only — do not fade/mute the icon at fit.
    assert.match(
      css,
      /\.case-page__lightbox-tapper[\s\S]*?\[aria-disabled="true"\]\s*\{[^}]*opacity:\s*1/s
    );
    assert.doesNotMatch(
      css,
      /\.case-page__lightbox-tapper[\s\S]*?\[aria-disabled="true"\]\s*\{[^}]*opacity:\s*0\.\d+/s
    );
    assert.doesNotMatch(
      css,
      /\.case-page__lightbox-tapper[\s\S]*?\[aria-disabled="true"\]:hover[\s\S]*?\.ds-icon__state--hover[\s\S]*?display:\s*none/s
    );
    assert.match(css, /cursor-zoom-in\.svg/);
    assert.match(css, /\.case-page__lightbox-stage[^{]*\{[^}]*overflow:\s*visible/s);
    assert.match(css, /\.case-page__lightbox[^{]*\{[^}]*overflow:\s*hidden/s);
    assert.match(css, /transform-origin:\s*0\s+0/);
    // Lightbox close uses DS tokens, not forced light hex chrome.
    assert.doesNotMatch(
      css,
      /\.case-page__lightbox-close[^{]*\{[^}]*#fefefe\s*!important/s
    );
  });
});
