---
type: ds-component
env: 02-design-system
status: synced
figma-node: "226:15768"
updated: 2026-09-13
---

# Header

## Назначение
Шапка кейса / внутренней страницы: назад + заголовок портфолио. Витрина **620×85**.

## Анатомия
Контейнер (border-b Gray_dark, py 24, pr 24) + **Button** Text «На главную» (слева) + title H2 Gray_text «Аня Ясинская· Портфолио» (**по центру ширины Header**) + **BurgerMenu** (справа, 48×48).

## Варианты
| Вариант | node-id | Когда |
|---------|---------|-------|
| default | `226:15768` | витрина · 620×85; на ≥1366 BurgerMenu `opacity: 0`, слот сохраняется |

## Состояния
default (кнопка внутри — default / hover через **Button** Text).

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size | 620×85 |
| border-bottom | Gray_dark `#e4e4e4` |
| padding | py 24 · pr 24 |
| title | H2 · Gray_text `#888888` · **горизонтальный центр** |
| back CTA | Button Text · label H2 Black / Gray_text на hover |
| BurgerMenu | icon 24 · hit 48×48 |

## Правила применения
Для внутренних экранов кейса (1920 / 1366 / 1024 / 768). Title всегда по центру бара, не «между» неравными слотами. Не подменять **Sidebar** профиля.

## Чем не является
Не Sidebar (`158:11468`), не SideBar TOC (`227:16241`).
