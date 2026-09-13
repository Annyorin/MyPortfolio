---
type: ds-component
env: 02-design-system
status: synced
figma-node: "40:1209"
updated: 2026-09-13
---

# Card

## Назначение
Карточка проекта / работы 310×310 с состояниями default и hover.

## Анатомия
Медиа-плоскость (Photo) + InfoCard · radius 24 · border Secondary.

| Блок | Figma | Размер / отступы |
|------|-------|------------------|
| Photo | `40:1112` | **зафиксирован** 308×172 · crop сверху как на `51:4107` · assets **924×516** (3×) |
| InfoCard | `40:1114` | **зафиксирован** 308×136 · **padding 16** · gap 8 — одинаково у всех карточек |
| Description | `40:1118` | Caption 64px (4 строки) |
| MainTitle | `232:16647` | title + meta + Chip · space-between |

Инстанс на главной (`51:4116` и др.) наследует те же **16px** у InfoCard.

## Варианты
| Вариант | node-id | Когда |
|---------|---------|-------|
| Property 1=default | `40:1208` | покой · 310×310 · **с Shadow** |
| Property 1=hover | `40:1207` | наведение · ~320×320 на витрине · Shadow |

## Состояния
default / hover

## Токены
| Свойство | Токен |
|----------|-------|
| size | 310×310 (default) |
| radius | 24 |
| border | Secondary `#ededed` |
| fill | White `#FEFEFE` |
| shadow (default **и** hover) | Shadow `0 5px 9px #BBBBBD40` |

## Правила применения
Тень **всегда** (default и hover) — только токен **Shadow**. Эффект «вв» к Card **не** привязывать.

## Чем не является
Не Sidebar, не SideBar, не сырой IMG_* / SityBike.
