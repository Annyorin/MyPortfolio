---
type: ds-component
env: 02-design-system
status: synced
figma-node: "245:17643"
updated: 2026-09-13
---

# MenuMobile

Мобильная и планшетная панель оглавления. Открывается по **BurgerMenu**. Десктопный TOC — **Menu** / SideBar (`227:16241`, `side-bar.md`).

## Назначение
Компактная карточка-меню (167×224) поверх контента кейса: те же пункты, что у Menu, типографика **Text2**.

## Анатомия
Карточка (padding 12, radius 12, fill White, shadow Mobile) + 5× TitleSidebar-строк высотой 40 (width 143).

## Варианты
| Вариант | node-id | Когда |
|---------|---------|-------|
| default | `245:17643` | ≤1365 · по клику BurgerMenu |

## Состояния
default; активный пункт — Black; остальные — Gray_text (`--muted` / не active).

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size | 167×224 |
| padding | 12 |
| radius | 12 |
| fill | White |
| shadow | Mobile · `--shadow-mobile` `0 3px 9px #8B8B8E40` |
| item | Text2 14/18 Regular · height 40 · width 143 |
| active | Black |
| muted | Gray_text |

## Правила применения
Только mobile/tablet вместе с BurgerMenu. На ≥1366 — десктопный **Menu** (`.ds-side-nav`) в колонке.

## Чем не является
Не десктопный Menu/SideBar (`227:16241`), не профильный Sidebar (`158:11468`), не Header.
