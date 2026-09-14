---
type: ds-component
env: 02-design-system
status: synced
figma-node: "232:16826"
updated: 2026-09-14
---

# Dragon

> **Figma-имя:** `Dragon`. **Продукт / handoff:** InnoDragon cover · ассеты `dragon.png` / `card-innodragon.png` / `img-1.png`.

## Назначение
Media cover кейса InnoDragon: кадр дашборда в клипе **308×190** (скругление верхних углов 8).

## Анатомия
| Слой | Описание |
|------|----------|
| Cover | фрейм **308×190**, overflow clip, `rounded-tl/tr` 8 |
| Photo | fill-изображение дашборда (dark admin UI) |

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
Обложка / медиа карточки кейса InnoDragon. Канон Ui kit — `dragon.png`; зеркала `card-innodragon.png` и продуктовый `img-1.png` (`card.image.a`) синхронизированы с тем же экспортом.

## Чем не является
Не Card (Card = интерактивная композиция). Не атом `IMG_1` (`41:11479`, 345×230) — другое имя в Ui kit.
