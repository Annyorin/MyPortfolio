---
type: ds-component
env: 02-design-system
status: synced
figma-node: "41:11659"
updated: 2026-09-06
---

# Card

## Назначение
Карточка проекта / работы 310×310 с состояниями default и hover.

## Анатомия
Медиа-плоскость + оверлей/контент на hover.

## Варианты
| Вариант | node-id | Когда |
|---------|---------|-------|
| Property 1=default | `41:11660` | покой |
| Property 1=hover | `41:11667` | наведение |

## Состояния
default / hover

## Токены
| Свойство | Токен |
|----------|-------|
| size | 310×310 |
| shadow (hover) | Shadow `0 5px 9px #BBBBBD40` |

## Правила применения
Тень на hover — только токен **Shadow**. Эффект «вв» к Card **не** привязывать.

## Чем не является
Не Sidebar, не сырой IMG_*.
