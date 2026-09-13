---
type: ds-component
env: 02-design-system
status: synced
figma-node: "227:16230"
updated: 2026-09-13
---

# TitleSidebar

## Назначение
Пункт оглавления (TOC) в **SideBar**: одна строка H2, без иконки. Пример label: «Контекст».

## Анатомия
Текстовый слой H2 на высоте 20.

## Варианты
| State | node-id | Цвет |
|-------|---------|------|
| set | `227:16230` | — |
| default | `227:16228` | Black `#000000` (Variable; product override `#232323` по контексту) |
| hover | `227:16229` | Gray_text `#888888` |

## Состояния
default / hover (State)

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| typography | H2 · Inter Medium 16/20 |
| height | 20 |
| default color | Black |
| hover color | Gray_text |

## Правила применения
Только внутри **Menu** / SideBar (TOC) и **MenuMobile**. Для ссылок в профильном сайдбаре — **Link**.

## Чем не является
Не Link, не Chip, не пункт **Sidebar** профиля.
