---
type: ds-component
env: 02-design-system
status: synced
figma-node: "603:18197"
updated: 2026-10-07
---

# Hint panel

Figma имя: **Hint**. Display / продукт: **Hint panel**. CSS (среда 4): **`.ds-hint-panel`**.

## Назначение
Подсказка жестов камеры: масштаб и панорама для мыши или тачпада.

## Анатомия
Карточка **350×173** (column, overflow clip) = Header **350×45** + Info (padding 16, gap 16 column).

| Слой | Размер / layout | Содержание |
|------|-----------------|------------|
| Card | width 350, radius 16, fill White `#fefefe` / `--color-white`, Shadow `0 5px 9px #bbbbbd40` / `--shadow` | clip, column |
| Header | 350×45 · px 16 py 12 · border-bottom Secondary `#ededed` | justify space-between: Controls + close 20×20 |
| Controls | два TitleSidebar H2 16/20 ×73 | «Мышка» / «Тачпад» |
| close | 20×20 | существующая иконка close (`40:1179`) |
| Row | icon 32×32 + gap 13 + Text1 16/20 Black `#121214` | лейбл Medium 16/20 + описание Regular 16/20 |
| markerHint | bg `#eff7fe` · text Primary `#64b3f9` · Text3 Medium 14/20 · radius 2 · px 4 | клавиши **Ctrl** / **Space** (только variant mouse) |

Витрина set-frame: **390×495** (`603:18197`).

## Варианты
| Вариант | node-id | Property 1 | Когда |
|---------|---------|------------|-------|
| mouse | `603:18196` | mouse | жесты мыши · **350×173** |
| trackpad | `603:18195` | trackpad | жесты тачпада · **350×173** |

Set: `603:18197`.

## Состояния (табы Controls)
| Вариант | «Мышка» | «Тачпад» |
|---------|---------|----------|
| mouse | TitleSidebar default Black | TitleSidebar hover Gray_text |
| trackpad | TitleSidebar hover Gray_text | TitleSidebar default Black |

## Тексты
| Вариант | Строка | Копирайт |
|---------|--------|----------|
| mouse | zoom | Изменить масштаб: Зажми Ctrl и крути колёсико мыши. |
| mouse | move | Перемещение: Зажми Space и левую кнопку мышки. |
| trackpad | zoom | Изменить масштаб: Зажми тачпад двумя пальцами. |
| trackpad | move | Перемещение: Свайпни на тачпаде двумя пальцами |

Лейблы «Изменить масштаб:» / «Перемещение:» — Inter Medium 16/20. markerHint на mouse: **Ctrl**, **Space**.

Иконки строк: mouse → `mouseZoom` / `mouseMove`; trackpad → `handZoom` / `handMove` (см. `icons.md`, 32×32).

## Токены
| Свойство | Токен / значение |
|----------|------------------|
| size | 350×173 |
| radius | 16 |
| fill | White `#fefefe` |
| elevation | `--shadow` `0 5px 9px #bbbbbd40` |
| header border | Secondary `#ededed` |
| header padding | 16 / 12 |
| info padding / gap | 16 |
| row gap | 13 |
| icon | 32×32 |
| body | Text1 Regular 16/20 · Black `#121214` |
| label | Inter Medium 16/20 |
| tabs | H2 16/20 · TitleSidebar |
| markerHint | `#eff7fe` / Primary `#64b3f9` / Text3 Medium 14/20 |
| CSS | `.ds-hint-panel` |

## Правила применения
Панель помощи по жестам камеры (мышь / тачпад). Табы переключают Property 1; close закрывает панель.

## Чем не является
Не sticker **Hint** (`hint.md`, `251:21308`, `.ds-hint`). Не Tooltip, не SegmentsControl, не MenuMobile.
