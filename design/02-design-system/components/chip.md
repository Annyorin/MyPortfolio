---
type: ds-component
env: 02-design-system
status: synced
figma-node: "40:1171"
updated: 2026-09-08
---

# Chip

## Назначение
Компактный фильтр / тег высотой 32.

## Анатомия
Текст (Caption) в пилюле / контейнере h32.

## Варианты
| Вариант | node-id | Когда |
|---------|---------|-------|
| Property 1=default | `40:1170` | не выбран |
| Property 1=active | `40:1169` | выбран |

## Состояния
default / active

## Токены
| Свойство | Токен |
|----------|-------|
| height | 32 |
| text | Caption |
| fill active | Primary / White (по макету) |

## Правила применения
Навигация-фильтр, не кнопка действия (см. Tapper / Button / CursorHover).

## Чем не является
Не Tapper, не Stiker, не Link, не Tooltip.
