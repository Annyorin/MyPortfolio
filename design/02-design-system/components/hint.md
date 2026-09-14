---
type: ds-component
env: 02-design-system
status: synced
figma-node: "251:21308"
updated: 2026-09-14
---

# Hint

## Назначение
Белая текстовая подсказка у стикеров Macbook (About expanded).

## Анатомия
Контейнер (White, padding 8×16, max-width ~252, radius **0 25 25 25**) + текст H2 Black.

## Варианты
| Вариант | node-id | Когда |
|---------|---------|-------|
| default | `251:21308` | Macbook sticker hover / focus |

## Состояния
default; видимость — через hover / `:focus-visible` / `.is-hint-open` на родителе.

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| fill | White `#FEFEFE` |
| text | H2 · Inter Medium 16/20 · Black `#232323` |
| radius | `0 25px 25px 25px` (острый верхний левый) |
| padding | 8×16 |
| elevation | `--shadow` (`0 5px 9px #BBBBBD40`) |
| max-width | ~252px (контент может переноситься) |

## Правила применения
Только как tip у интерактивных стикеров Macbook. Не заменяет Tooltip (чёрный pill).

## Чем не является
Не Tooltip, не Chip, не Button.
