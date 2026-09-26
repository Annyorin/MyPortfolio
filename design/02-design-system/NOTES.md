---
type: notes
env: 02-design-system
updated: 2026-09-26
---

# Рабочие заметки

Прогресс длинных задач этой среды. Читается и дополняется только внутри среды.

## Активная задача
_нет_ — Header padding sync (снят pr 24) → manifest **v0.1.12**.

## Открытые вопросы
_нет_

## Решения
- 2026-09-06: источник истины при синке — Figma Variables/metadata; дрейф с ТЗ зафиксирован в sync-log.
- Имя **Stiker** сохранено как в макете.
- «вв» не привязан к Card.
- 2026-09-06: Hover **114×40**, Tapper **104×40** — оба по ТЗ §2.8 / UC-01; ложный дрейф Hover снят.
- 2026-09-06: Black — Figma Variable `#000000`, **product override (ТЗ review gate) `#232323`**.
- 2026-09-08: Ui kit root **`41:11520`** (вместо `41:11646`); node-id атомов обновлены.
- 2026-09-08: Hover в Figma = **CursorHover**; Avatar = **Avatar90**; **SityBike** = продукт CityBike.
- 2026-09-08: добавлены ProfileMobile, FloatingAction, SityBike, Button, Tooltip, CursorFigma; media me/Macbook.
- 2026-09-13: **SideBar** (`227:16241`) ≠ **Sidebar** профиля (`158:11468`); Figma name **Menu**.
- 2026-09-13: **MenuMobile** (`245:17643`) — burger panel ≤1365.
- 2026-09-13: Figma **Segmets_control** → продукт **SegmentsControl**.
- 2026-09-13: Card default тоже имеет Shadow (не только hover).
- 2026-09-13: Button + variant **Text** (arrow-left + H2, no fill).
- 2026-09-14: Macbook node **`248:17115`** · **388×283** (был `247:16308`).
- 2026-09-14: Dragon/Phish = cover 308×190 как SityBike; зеркала card-innodragon/img-1, card-innophish/img-2.
- 2026-09-14: stickers anime/books/create/question/seal/sport — декоратив About; SVG в `stickers/`.
- 2026-09-14: **Hint** (`251:21308`) — white tip для Macbook sticker hover; PNG stickers + `macbook-lid.png` на сцене.
- 2026-09-14: **Header** (`226:15768`) — **620×81**, py **16** (было 24 / 85); title = flex slot space-between, не absolute-center.
- 2026-09-26: **Header** — снят **pr 24**; факт Figma `226:15768` + desktop `401:23328`: только **py 16 · px 0** (`padding: 16px 0`).
- 2026-09-26: **About me** (`391:22957`, home `391:22959`) — frame **209.61×116.01**; children: me **83.45² @ +12.596°**, Macbook **126×92 @ −10°**, Stiker **81×32**; paint me→Macbook→Stiker; `.ds-about-me`.
- 2026-09-26: **MacbookPng** (`391:22958`) → `macbook-png.png`; keys `macbook` / `macbook.png`. Старый AABB **140.61×111.01** и `macbook-248-17115.png` закрыты.
- 2026-09-26: Dark About Stiker — fill White `#FEFEFE`, text Primary `#2D97F7` (не surface `#232323`).
