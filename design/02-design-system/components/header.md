---
type: ds-component
env: 02-design-system
status: synced
figma-node: "226:15768"
updated: 2026-09-14
---

# Header

## Назначение
Шапка кейса / внутренней страницы: назад + заголовок портфолио. Витрина **620×81**.

## Анатомия
Контейнер (border-b Gray_dark, py 16, pr 24, justify space-between) + **Button** Text «На главную» (слева, ~115×36) + title H2 Gray_text «Аня Ясинская · Портфолио» (между слотами, shrink) + **BurgerMenu** (справа, 48×48).

## Варианты
| Вариант | node-id | Когда |
|---------|---------|-------|
| default | `226:15768` | витрина · 620×81; на ≥1366 BurgerMenu `opacity: 0`, слот сохраняется |

## Состояния
default (кнопка внутри — default / hover через **Button** Text).

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size | 620×81 |
| border-bottom | Gray_dark `#e4e4e4` |
| padding | py 16 · pr 24 · pl 0 |
| layout | flex · `justify-content: space-between` · `align-items: center` |
| title | H2 · Gray_text `#888888` · между Button и Burger (не absolute-center) |
| back CTA | Button Text · icon-left 20 · label H2 Black / Gray_text на hover |
| BurgerMenu | icon 24 · hit 48×48 · padding 12 |

## Правила применения
Для внутренних экранов кейса (1920 / 1366 / 1024 / 768). Title — flex-слот между CTA и Burger, как в Figma auto-layout (не геометрический центр бара). На ≤480 — **Toolbar** (`247:16546`). Не подменять **Sidebar** профиля.

## Чем не является
Не Sidebar (`158:11468`), не SideBar TOC (`227:16241`), не **Toolbar** mobile (`247:16546`).
