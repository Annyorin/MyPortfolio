---
type: ds-component
env: 02-design-system
status: synced
figma-node: "232:16829"
updated: 2026-09-14
---

# Phish

> **Figma-имя:** `Phish`. **Продукт / handoff:** InnoPhish cover · ассеты `phish.png` / `card-innophish.png` / `img-2.png`.

## Назначение
Media cover кейса InnoPhish: кадр дашборда в клипе **308×190** (скругление верхних углов 8).

## Анатомия
| Слой | Описание |
|------|----------|
| Cover | фрейм **308×190**, overflow clip, `rounded-tl/tr` 8 |
| Photo | fill-изображение дашборда (light InnoPhish UI) |

## Варианты
| Вариант | Значения | Когда |
|---------|----------|-------|
| default | 308×190 | единственный |

## Состояния
default

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size | 308×190 |
| radius top | 8 |

## Правила применения
Обложка / медиа карточки кейса InnoPhish. Канон Ui kit — `phish.png`; зеркала `card-innophish.png` и продуктовый `img-2.png` (`card.image.b`) синхронизированы с тем же экспортом.

## Чем не является
Не Card. Не атом `IMG_2` (`41:11478`, 345×230) — другое имя в Ui kit.
