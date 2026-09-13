---
type: ds-component
env: 02-design-system
status: synced
figma-node: "158:11315"
updated: 2026-09-13
---

# Button

## Назначение
Кнопка с иконкой и подписью: primary / secondary / **Text** × default / hover.

## Анатомия
- **primary / secondary:** контейнер (padding 16×8, gap 4, radius 24) + icon 20×20 + label Caption · витрина ~103×36.
- **Text:** без fill; gap 4, py 8, radius 24; icon L/R 20×20 (arrow-left / arrow-right) + label H2 · витрина ~87×36.

## Варианты
| Property 1 × Property 2 | node-id | Fill / text | Icon |
|-------------------------|---------|-------------|------|
| secondary × default | `158:11314` | Secondary `#ededed` · Black `#232323` | cv |
| secondary × hover | `158:11311` | Secondary `#ededed` · Gray_text `#888888` | cv |
| primary × default | `158:11313` | Primary `#64b3f9` · White `#FEFEFE` | telegram |
| primary × hover | `158:11312` | Primary_hover `#79befc` · White `#FEFEFE` | telegram |
| Text × default | `226:15947` | no fill · Black `#232323` · H2 | arrow-left (L) |
| Text × hover | `227:15952` | no fill · Gray_text `#888888` · H2 | arrow-left (L) |

Boolean props (Text): `showIconL` / `showIconR` (по умолчанию L=true, R=false).

## Состояния
default / hover (Property 2)

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size primary/secondary | ~103×36 |
| size Text | ~87×36 |
| radius | 24 |
| padding primary/secondary | 16×8 |
| padding Text | py 8 (без горизонтального fill-padding) |
| gap | 4 |
| label primary/secondary | Caption · Inter Medium 12/16 |
| label Text | H2 · Inter Medium 16/20 |
| icons social | 20×20 (`cv`, `telegram`) |
| icons Text | arrow-left / arrow-right @20×20 |

## Правила применения
CTA с иконкой соц/документа — primary/secondary. Навигация «назад / на главную» — **Text** (см. **Header**). Без иконки / другой размер — **Tapper**. Внешняя «Behance + arrow» — **CursorHover**.

## Чем не является
Не Tapper, не Chip, не Link, не FloatingAction.
