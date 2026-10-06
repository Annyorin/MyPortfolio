---
type: ds-component
env: 02-design-system
status: synced
figma-node: "41:1311"
updated: 2026-10-06
---

# Tapper

## Назначение
Кнопка-таппер 104×40 (ландшафт) / 40×104 (портрет на главной) для zoom ±.

## Анатомия
Контейнер White + Shadow · две hit-зоны Plus / Minus 24×24.

## Варианты
| Вариант | Значения | Когда |
|---------|----------|-------|
| default | 104×40 | витрина / lightbox |
| portrait | 40×104 | главная, справа от сцены |

## Состояния
| Состояние | Иконки |
|-----------|--------|
| default | Plus/Minus Black `#121214` |
| hover hit | Plus/Minus Gray_text `#888888` |

## Токены
| Свойство | Токен |
|----------|-------|
| size | 104×40 / портрет 40×104 |
| fill | `--color-white` |
| shadow | `--shadow` |
| icon default | `--color-black` · `plus.svg` / `minus.svg` |
| icon hover | `--color-gray-text` · `plus-hover.svg` / `minus-hover.svg` |

## Правила применения
CTA без стрелки / без social-icon. Стрелка Behance — CursorHover. С icon+label — **Button**. FAB — **FloatingAction**.

## Чем не является
Не CursorHover, не Chip, не Link, не Button, не FloatingAction.
