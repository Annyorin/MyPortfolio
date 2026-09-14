---
type: notes
env: 02-design-system
updated: 2026-09-14
---

# Рабочие заметки

Прогресс длинных задач этой среды. Читается и дополняется только внутри среды.

## Активная задача
_нет_ — Header `226:15768` refresh → **620×81**, py 16; manifest **v0.1.9**.

## Открытые вопросы
- Macbook About на Главной: оставить scene bbox **140.61×111.01** или подогнать aspect к kit **388×283**? Сейчас drift зафиксирован, composition не трогали.

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
