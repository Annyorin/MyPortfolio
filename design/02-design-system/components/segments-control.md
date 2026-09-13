---
type: ds-component
env: 02-design-system
status: synced
figma-node: "226:15785"
updated: 2026-09-13
---

# SegmentsControl

Figma-имя с опечаткой: **Segmets_control**. Продуктовое имя: **SegmentsControl**.

## Назначение
Двухсегментный переключатель «длинная / короткая версия». Витрина **620×42**.

## Анатомия
Track (Secondary, radius 20, padding 4) + 2 equally flex сегмента + active pill (White + Shadow + hairline border) + label Text2.

## Варианты
| Property 1 | node-id | Active сегмент |
|------------|---------|----------------|
| long | `226:15785` | «Длинная версия» |
| short | `226:15784` | «Короткая версия» |

## Состояния
Выбор сегмента = Property 1 (long / short). Отдельного hover на сегменте нет.

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size | 620×42 |
| track fill | Secondary `#ededed` |
| track radius | 20 |
| track padding | 4 |
| active pill | White `#FEFEFE` · radius 20 |
| active shadow | Shadow `0 5px 9px #BBBBBD40` |
| active border | 0.5px `rgba(0,0,0,0.04)` |
| label | Text2 · Inter Regular 14/18 · Black `#232323` |
| segment padding | px 10 · py 8 (active) / py 3 (inactive) |

## Правила применения
Только бинарный переключатель длины контента. Не Chip, не Tab bar общего назначения.

## Чем не является
Не Chip, не Button, не Tapper.
