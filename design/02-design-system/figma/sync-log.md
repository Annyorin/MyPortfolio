---
type: log
env: 02-design-system
updated: 2026-09-08
---

# Лог синхронизаций с Figma

Каждая операция чтения или записи через Figma MCP — одна строка.

| Дата | Направление | node-id | Что затронуто | Результат |
|------|-------------|---------|---------------|-----------|
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
