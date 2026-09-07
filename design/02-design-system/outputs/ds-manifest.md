---
type: manifest
env: 02-design-system
status: synced
version: 0.1.2
updated: 2026-09-06
figma_fileKey: xboMnqU5JURL0xlzxN7edN
ui_kit_node: "41:11646"
portfolio_home_node: "41:1416"
---

# DS manifest

Публичный выход среды 2 и единственное, что видно снаружи. Среда 4 строит по нему
своё зеркало `04-prototype/mirror/ds-mirror.md`.

Версия поднимается при каждом изменении состава компонентов или токенов — по ней
среда 4 определяет устаревание зеркала.

**Источник Ui kit:** [Портфолио · Ui kit](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-11646) · `fileKey` `xboMnqU5JURL0xlzxN7edN` · node `41:11646` · **reuse v0.1.1 состава, handoff notes → v0.1.2**.

**Сцена продукта:** [Портфолио · Главная](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-1416) · node `41:1416` (composition reference, не витрина DS).

## Foundations

| Группа | Токены | Источник в Figma |
|--------|--------|------------------|
| Color | Primary `#64b3f9`, Secondary `#ededed`, White `#FEFEFE`, Black Figma Variable `#000000` · **product override (ТЗ review gate) `#232323`**, Gray_text `#888888`, Gray_dark `#e4e4e4`, GrayL `#6B6B6B` (без свотча) | Variables @ `41:11646`; свотчи `41:11757` |
| Typography | Inter · H1 20/24/600 · H2 16/20/500 · Text 16/20/400 · Caption 12/16/500 | Variables @ `41:11646`; specimens `41:11764` |
| Elevation | Shadow `0 5px 9px #BBBBBD40` (Card hover, Sidebar); «вв» не к Card | Effect styles @ `41:11646` |
| Layout | фиксированные размеры компонентов (см. layout.md) | metadata Ui kit |
| Motion | — | нет в Ui kit |

## Компоненты

| Компонент | Варианты | Состояния | Статус | node-id |
|-----------|----------|-----------|--------|---------|
| Icons | close, Plus, Minus, vuesax/linear/arrow-right | default | synced | `41:11677` (инстансы `41:11678`–`41:11681`) |
| Avatar | — | default | synced | `41:11653` |
| Profile | — | default | synced | `41:11652` |
| Chip | default, active | default / active | synced | `41:11647` (`41:11648`, `41:11650`) |
| Link | default, hover | default / hover | synced | `41:11654` (`41:11655`, `41:11657`) |
| Tapper | — · **104×40** | default | synced | `41:11674` |
| Stiker | «Обо мне» | default | synced | `41:11676` |
| Hover | Behance + arrow · **114×40** | default | synced | `41:11682` |
| Card | default, hover · 310×310 | default / hover | synced | `41:11659` (`41:11660`, `41:11667`) |
| Sidebar | 310×561 | default | synced | `41:11675` |
| IMG_BG | 345×230 | default | synced | `41:11686` |
| IMG_1 | 345×230 | default | synced | `41:11683` |
| IMG_2 | 345×230 | default | synced | `41:11684` |
| IMG_3 | 345×345 | default | synced | `41:11685` |
| Comp | ~149×103 | default | synced | `41:11687` |

Именованных единиц: **18**. Карточек в `components/`: **11**.

## Паттерны

| Паттерн | Состав | Когда применять |
|---------|--------|-----------------|
| _нет_ | — | паттерны не извлечены из Ui kit |

## Handoff для портфолио / Storybook

- **Reuse Ui kit** `41:11646` — состав достаточен для каталога Storybook; пересборка не нужна.
- **Storybook units:** Chip, Link, Card, Sidebar, Tapper, Stiker, Hover, Avatar, Profile, Icons, Media (`IMG_BG`, `IMG_1`, `IMG_2`, `IMG_3`, `Comp`).
- **Black product override:** `#232323` (не Variable Black `#000000`).
- **Фикс. размеры витрины:** Tapper **104×40**, Hover **114×40**, Card **310×310**, Sidebar **310×561**.
- **Comp / Stiker на Главной:** сверять по **bbox сцены** `41:1416`, не только по atomic-размеру витрины (Stiker витрина 81×32; Comp витрина ~149×103 — на сцене могут отличаться).

## Известные ограничения

- Black: Figma Variable = `#000000`; **product override (ТЗ review gate) = `#232323`** — нельзя читать только Figma-значение для продукта.
- Эффект «вв» есть в файле; **не** использовать на Card (только Shadow).
- GrayL только CSS, без свотча на витрине.
- Motion-токенов нет; hover — статические варианты.
- Продуктовый HTML/CSS / Storybook вне этой среды не генерируется.
