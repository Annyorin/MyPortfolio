---
type: ds-component
env: 02-design-system
status: synced
figma-node: "41:11521"
updated: 2026-09-08
---

# Icons

## Назначение
Набор иконок UI витрины: линейные 24×24 и social / tool 20×20.

## Анатомия
Один глиф, без текста.

## Варианты — 24×24 (группа Icons)
| Вариант | node-id | Когда |
|---------|---------|-------|
| close | `40:1179` | закрытие / dismiss |
| Plus (символы + варианты) | `55:9404` (set) · `55:9403` default · `55:9402` hover | добавить |
| Minus (символы + варианты) | `55:9407` (set) · `55:9406` default · `55:9405` hover | убрать |
| vuesax/linear/arrow-right | `41:1530` | переход / CTA / FAB (rotate) |

## Варианты — 20×20 (social / tool)
| Вариант | node-id | Когда |
|---------|---------|-------|
| linkedin-box-fill | `158:11220` | LinkedIn |
| behance | `158:11208` | Behance |
| mail | `158:11262` | почта |
| cv | `158:11193` | резюме / CV |
| telegram | `158:11186` | Telegram |
| CursorFigma | `163:11657` | см. `cursor-figma.md` |

## Состояния
default; Plus/Minus — default / hover.

## Токены
| Свойство | Токен |
|----------|-------|
| size UI | 24×24 fixed |
| size social/tool | 20×20 fixed |

## Правила применения
Не растягивать. Стрелка — в CursorHover / FloatingAction (−90°). Social 20×20 — в **Button** и ряд контактов.

## Чем не является
Не декоративные иллюстрации (Comp / IMG_* / SityBike).
