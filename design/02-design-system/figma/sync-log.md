---
type: log
env: 02-design-system
updated: 2026-10-07
---

# Лог синхронизаций с Figma

Каждая операция чтения или записи через Figma MCP — одна строка.

| Дата | Направление | node-id | Что затронуто | Результат |
|------|-------------|---------|---------------|-----------|
| 2026-10-07 | read whoami | — | OAuth session | ok · makjsgjyeqei · student Full |
| 2026-10-07 | read screenshot+metadata+variables | `603:18197` | Hint set 390×495 · mouse/trackpad 350×173 | ok |
| 2026-10-07 | read design_context | `603:18196` `603:18195` | Hint panel variants + copy + markerHint | ok |
| 2026-10-07 | read metadata | `603:18092` `603:18130` `566:29549` `603:18274` | gesture icons 32×32 | ok |
| 2026-10-07 | read download_assets svg | `603:18092` `603:18130` `566:29549` `603:18274` | export URLs (bytes: HTTP fetch blocked in session) | ok · URLs · local SVG written |
| 2026-10-07 | write local | `603:18197` | hint-panel.md; icons 32×32; INDEX; registry; NOTES; manifest **v0.1.13** | ok |
| 2026-09-26 | read+write local | `226:15768` `401:23328` | Header padding py16 / no px (снят pr 24); header.md; registry; INDEX; NOTES; manifest **v0.1.12** | ok · docs only |
| 2026-09-26 | write local | `391:22957` `391:22959` `391:22958` | About me Plugin geometry + MacbookPng keys everywhere; close AABB 140.61 drift; manifest **v0.1.11** | ok · docs only |
| 2026-09-26 | read metadata | `391:22957` `391:22958` | About me + MacbookPng sizes | ok · ≈209.6×116 · 310×226 |
| 2026-09-26 | write local | `391:22957` `391:22958` | +About me / MacbookPng в media.md, registry, manifest **v0.1.10** | ok · docs only |
| 2026-09-14 | read design_context+screenshot+metadata | `226:15768` | Header parity | ok · 620×81 · py 16 |
| 2026-09-14 | write local | `226:15768` | Header py16 / 620×81 / flex title; `.ds-header`; registry; manifest **v0.1.9** | ok |
| 2026-09-14 | write local | `251:21308` | +Hint; components.css `.ds-hint`; INDEX; registry; manifest **v0.1.8** | ok |
| 2026-09-14 | read whoami | — | OAuth session | ok · makjsgjyeqei · student Full |
| 2026-09-14 | read design_context | `232:16826` `232:16829` `247:16308` `244:17347` `244:17349` `244:17346` `244:17348` `244:17350` `245:17642` | Dragon, Phish, Macbook, stickers | ok |
| 2026-09-14 | export @3×/@1 | см. выше | → `ds-showcase/assets/images/` (dragon/phish/macbook + stickers/*.svg) | ok · без tmp под Vite watch |
| 2026-09-14 | write local | `41:11520` | +dragon/phish; media stickers+Macbook; INDEX; registry; manifest **v0.1.6** | ok |
| 2026-09-13 | read+export | `105:11869` | Macbook Ui kit → `macbook.png` @3× | ok · 389×283 (superseded 2026-09-14 → `247:16308` 388×283) |
| 2026-09-06 | read whoami | — | OAuth session | ok · makjsgjyeqei · student Full |
| 2026-09-06 | read metadata | `41:11646` | структура Ui kit | ok · icons/atomic/composite/media + swatches/type |
| 2026-09-06 | read variables | `41:11646` | color + type + effects | ok · 7 colors, 4 type, Shadow + вв |
| 2026-09-06 | write local | `41:11646` | foundations/, components/, registry, manifest v0.1.0 | ok |
| 2026-09-06 | write local | — | manifest v0.1.1 · снят ложный дрейф Hover; Black product override | ok |
| 2026-09-06 | write local | `41:11646` + ref `41:1416` | manifest v0.1.2 · reuse Ui kit; handoff portfolio/Storybook (Black #232323, sizes, Comp/Stiker scene bbox) | ok · no Figma rewrite |
| 2026-09-08 | read whoami | — | OAuth session | ok · makjsgjyeqei · student Full |
| 2026-09-08 | read metadata | `41:11520` | Ui kit (новый root; был `41:11646`) | ok · +ProfileMobile/FloatingAction/SityBike/Button/Tooltip/CursorFigma/me/Macbook; node-id дрейф атомов |
| 2026-09-08 | read design_context | `169:11933` `169:13303` `164:11800` `158:11315` `92:11490` `163:11657` `105:11564` `105:11869` | новые компоненты | ok |
| 2026-09-08 | write local | `41:11520` | components/*, INDEX, registry, manifest v0.1.3 | ok · ui_kit_node → 41:11520 |
| 2026-09-13 | read whoami | — | OAuth session | ok · makjsgjyeqei · student Full |
| 2026-09-13 | read design_context | `226:15768` `226:15785` `226:15784` `226:15947` `227:15952` `227:16241` `40:1208` | Header, Segmets_control, Button Text, SideBar, Card default | ok |
| 2026-09-13 | read metadata | `204:15709` `194:15522` `227:16230` `226:15768` `226:15785` `227:16241` `158:11315` | Burger_menu, arrow-left, TitleSidebar, sizes, Button set | ok |
| 2026-09-13 | write local | `41:11520` | +header/segments-control/title-sidebar/side-bar; icons/button/card; INDEX; registry; elevation; manifest **v0.1.4** | ok |
| 2026-09-13 | read design_context | `245:17643` `227:16241` | MenuMobile + Menu (SideBar TOC) | ok |
| 2026-09-13 | write local | `245:17643` | +menu-mobile; shadow-mobile; case BurgerMenu≤1365; manifest **v0.1.5** | ok |
| 2026-09-14 | read design_context | `247:16546` | Toolbar mobile | ok |
| 2026-09-14 | read+export @3× | `248:17115` | Macbook → `macbook.png` 1164×849 | ok · supersedes `247:16308` |

## Зафиксированный дрейф
Расхождения между Figma и текстовым описанием. Устраняются до завершения задачи.

| Дата | Узел | Расхождение | Статус |
|------|------|-------------|--------|
| 2026-09-06 | Variable Black | Figma Variable `#000000` · product override (ТЗ review gate) `#232323` — оба зафиксированы в color + manifest | closed · documented |
| 2026-09-06 | Hover `41:11682` | Ложный дрейф: Hover=114×40 и Tapper=104×40 по ТЗ §2.8 / UC-01 — совпадает с Figma | closed · false positive removed |
| 2026-09-06 | Effect «вв» | Есть в Variables; по правилу ТЗ не привязывать к Card | closed · задокументировано в elevation |
| 2026-09-08 | Ui kit root | Было `41:11646` → актуально `41:11520`; старые node-id атомов (41:116xx) устарели | closed · registry/manifest обновлены |
| 2026-09-08 | Hover → CursorHover | Figma-имя `CursorHover` (`41:1548`); локальный файл `hover.md` сохранён | closed · documented |
| 2026-09-08 | SityBike | Figma-имя с опечаткой; продукт CityBike | closed · documented в sitybike.md + manifest |
| 2026-09-08 | FloatingAction shadow | На компоненте blur **4.5**; именованный Shadow эффект в файле часто radius **9** | closed · documented в floating-action.md |
| 2026-09-13 | Segmets_control | Figma-имя с опечаткой; продукт **SegmentsControl** | closed · documented в segments-control.md |
| 2026-09-13 | SideBar vs Sidebar | `227:16241` TOC ≠ `158:11468` profile | closed · отдельные файлы side-bar.md / sidebar.md |
| 2026-09-13 | Card Shadow | default тоже имеет Shadow (ранее в тексте только hover) | closed · card.md + elevation |
| 2026-09-14 | Macbook scene | Ui kit atomic **388×283** (`248:17115`); About child ранее **140.61×111.01** AABB — superseded: local Macbook **126×92 @ −10°** в About me **209.61×116.01**; collapsed = MacbookPng `391:22958` → `macbook-png.png` | closed · 2026-09-26 |
| 2026-09-14 | Dragon/Phish vs IMG_* | Cover `232:16826`/`232:16829` (308×190) ≠ атомы IMG_1/IMG_2 (345×230); продукт `img-1`/`img-2` зеркалят covers | closed · documented в media/dragon/phish |
| 2026-09-26 | read+export @3x | `248:17115` + stickers | Macbook refresh → `macbook-248-17115.png` / `macbook-lid.png` / `stickers/*.png|svg` | ok · asset sync |
| 2026-09-26 | read+export @3x | `105:11564` | me → `me.png` | ok · asset sync |
