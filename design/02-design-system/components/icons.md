---
type: ds-component
env: 02-design-system
status: synced
figma-node: "41:11521"
updated: 2026-10-07
---

# Icons

## Назначение
Набор иконок UI витрины: линейные 24×24, social / tool 20×20 и gesture 32×32.

## Анатомия
Один глиф, без текста.

## Варианты — 24×24 (группа Icons)
| Вариант | node-id | Когда |
|---------|---------|-------|
| close | `40:1179` | закрытие / dismiss |
| Plus (символы + варианты) | `55:9404` (set) · `55:9403` default · `55:9402` hover | добавить |
| Minus (символы + варианты) | `55:9407` (set) · `55:9406` default · `55:9405` hover | убрать |
| vuesax/linear/arrow-right | `41:1530` | переход / CTA / FAB (rotate) |
| vuesax/linear/arrow-left | `194:15522` | назад / Button Text |
| Burger_menu | `204:15709` | меню · внутренний `vuesax/linear/menu` |

## Варианты — 20×20 (social / tool)
| Вариант | node-id | Когда |
|---------|---------|-------|
| linkedin-box-fill | `158:11220` | LinkedIn |
| behance | `158:11208` | Behance |
| mail | `158:11262` | почта |
| cv | `158:11193` | резюме / CV |
| telegram | `158:11186` | Telegram |
| CursorFigma | `163:11657` | см. `cursor-figma.md` |

## Варианты — 32×32 (gesture icons)

Не путать с chrome 24×24. Файлы: `components/icons/*.svg`.

| Вариант | node-id | Файл | Когда |
|---------|---------|------|-------|
| mouseZoom | `603:18092` | `icons/mouse-zoom.svg` | масштаб мышью (Hint panel mouse) |
| mouseMove | `603:18130` | `icons/mouse-move.svg` | панорама мышью (Hint panel mouse) |
| handZoom | `566:29549` | `icons/hand-zoom.svg` | масштаб тачпадом (Hint panel trackpad) |
| handMove | `603:18274` | `icons/hand-move.svg` | панорама тачпадом (Hint panel trackpad) |

## Состояния
default; Plus/Minus — default Black `#121214` / hover Gray_text `#888888` (Figma `55:9403`/`55:9402`, `55:9406`/`55:9405`).

## Токены
| Свойство | Токен |
|----------|-------|
| size UI | 24×24 fixed |
| size social/tool | 20×20 fixed |
| size gesture | 32×32 fixed |

## Правила применения
Не растягивать. Стрелка вправо — в CursorHover / FloatingAction (−90°). Стрелка влево — в **Button** Text / **Header**. Burger_menu — мобильное меню. Social 20×20 — в **Button** и ряд контактов. Gesture 32×32 — только **Hint panel**.

## Чем не является
Не декоративные иллюстрации (Comp / IMG_* / SityBike).
