---
type: ds-component
env: 02-design-system
status: synced
figma-node: "247:16546"
updated: 2026-09-14
---

# Toolbar

Мобильная шапка кейса (360). **Вместо Header** на ширине ≤480.

## Назначение
Компактный бар: назад + label «Назад» + BurgerMenu. Витрина **360×48**.

## Анатомия
Контейнер (px 4, border-b Secondary, White) + Start Button 48 (arrow-left 20) + Labels (H2 Black) + End Buttons 48 (menu 24).

## Варианты
| Вариант | node-id | Когда |
|---------|---------|-------|
| default | `247:16546` | mobile case · ≤480 |

## Состояния
default; интерактив — через кнопки/ссылку.

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size | 360×48 |
| padding | px 4 |
| border-bottom | Secondary `#ededed` |
| fill | White |
| back icon | arrow-left 20×20 · hit 48 |
| label | H2 · Black · «Назад» |
| burger | menu 24×24 · hit 48 |

## Правила применения
Только mobile case. На ≥481 — **Header** (`226:15768`).

## Чем не является
Не Header, не MenuMobile, не профильный Sidebar.
