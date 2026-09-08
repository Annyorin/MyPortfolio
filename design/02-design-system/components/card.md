---
type: ds-component
env: 02-design-system
status: synced
figma-node: "40:1209"
updated: 2026-09-08
---

# Card

## Назначение
Карточка проекта / работы 310×310 с состояниями default и hover.

## Анатомия
Медиа-плоскость + оверлей/контент на hover.

## Варианты
| Вариант | node-id | Когда |
|---------|---------|-------|
| Property 1=default | `40:1208` | покой · 310×310 |
| Property 1=hover | `40:1207` | наведение · ~320×320 на витрине |

## Состояния
default / hover

## Токены
| Свойство | Токен |
|----------|-------|
| size | 310×310 (default) |
| shadow (hover) | Shadow `0 5px 9px #BBBBBD40` |

## Правила применения
Тень на hover — только токен **Shadow**. Эффект «вв» к Card **не** привязывать.

## Чем не является
Не Sidebar, не сырой IMG_* / SityBike.
