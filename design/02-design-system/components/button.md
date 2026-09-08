---
type: ds-component
env: 02-design-system
status: synced
figma-node: "158:11315"
updated: 2026-09-08
---

# Button

## Назначение
Кнопка с иконкой и подписью: primary / secondary × default / hover (витрина ~103×36).

## Анатомия
Контейнер (padding 16×8, gap 4, radius 24) + icon 20×20 + label Caption.

## Варианты
| Property 1 × Property 2 | node-id | Fill / text | Icon |
|-------------------------|---------|-------------|------|
| secondary × default | `158:11314` | Secondary `#ededed` · Black `#232323` | cv |
| secondary × hover | `158:11311` | Secondary `#ededed` · Gray_text `#888888` | cv |
| primary × default | `158:11313` | Primary `#64b3f9` · White `#FEFEFE` | telegram |
| primary × hover | `158:11312` | Primary_hover `#79befc` · White `#FEFEFE` | telegram |

## Состояния
default / hover (Property 2)

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size (витрина) | ~103×36 |
| radius | 24 |
| padding | 16×8 |
| gap | 4 |
| label | Caption · Inter Medium 12/16 |
| icons | social 20×20 (`cv`, `telegram`) |

## Правила применения
CTA с иконкой соц/документа. Без иконки / другой размер — **Tapper**. Внешняя «Behance + arrow» — **CursorHover**.

## Чем не является
Не Tapper, не Chip, не Link, не FloatingAction.
