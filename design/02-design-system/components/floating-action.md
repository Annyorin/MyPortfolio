---
type: ds-component
env: 02-design-system
status: synced
figma-node: "169:13303"
updated: 2026-09-08
---

# FloatingAction

## Назначение
Круглая FAB для scroll-to-top / первичного плавающего действия на сцене портфолио.

## Анатомия
| Слой | Описание |
|------|----------|
| Container | круг **50×50**, radius **35**, fill Black product |
| Icon | `vuesax/linear/arrow-right` **24×24**, rotation **-90°** (стрелка вверх) |
| Inset | иконка ≈ **13px** от краёв |

## Варианты
| Вариант | Значения | Когда |
|---------|----------|-------|
| default | 50×50 | единственный |

## Состояния
default

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size | 50×50 |
| radius | 35 |
| fill | Black product `#232323` |
| shadow | drop `0 5 / 4.5 #BBBBBD40` (семейство Shadow; blur на FAB = 4.5) |
| icon | arrow-right 24×24, rotate −90° |

## Правила применения
Плавающая кнопка поверх сцены. Не смешивать с **Button** (103×36, label+icon) и **Tapper**.

## Чем не является
Не Button, не Tapper, не CursorHover.
