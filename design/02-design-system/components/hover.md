---
type: ds-component
env: 02-design-system
status: synced
figma-node: "41:1548"
updated: 2026-09-08
---

# Hover (CursorHover)

> Figma-имя мастера: **CursorHover**. В тексте DS сохраняем файл `hover.md` / имя Hover для совместимости с ранними handoff.

## Назначение
CTA «Behance» со стрелкой arrow-right (внешняя ссылка / портфолио).

## Анатомия
Label «Behance» + icon `vuesax/linear/arrow-right`.

## Варианты
| Вариант | Значения | Когда |
|---------|----------|-------|
| default | 114×40 | единственный |

## Состояния
default (отдельного Property 1=hover нет)

## Токены
| Свойство | Токен |
|----------|-------|
| size | 114×40 |
| icon | arrow-right 24×24 |

## Правила применения
Внешняя ссылка Behance. Для текстовой ссылки — Link; для кнопки с icon+label — **Button**; для кнопки без стрелки — Tapper. Не путать с **CursorFigma** (20×20).

## Чем не является
Не Link, не Tapper, не Button, не CursorFigma, не состояние hover у Card.
