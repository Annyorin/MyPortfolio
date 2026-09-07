---
type: mirror
env: 04-prototype
source: 02-design-system/outputs/ds-manifest.md
mirrored-version: 0.1.2
status: fresh
updated: 2026-09-06
figma_fileKey: xboMnqU5JURL0xlzxN7edN
ui_kit_node: "41:11646"
portfolio_home_node: "41:1416"
---

# Зеркало дизайн-системы (read-only)

Проекция манифеста среды 2 v0.1.2 (`status: synced`). Здесь ничего не проектируется — только копируется.
Перед сборкой сверь `mirrored-version` с `version` в манифесте.

**Источник Ui kit:** [Портфолио · Ui kit](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-11646) · `fileKey` `xboMnqU5JURL0xlzxN7edN` · node `41:11646` · reuse v0.1.1 состава, handoff notes → v0.1.2.

**Сцена продукта:** [Портфолио · Главная](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-1416) · node `41:1416` (composition reference, не витрина DS).

## Доступные токены

| Группа | Токены |
|--------|--------|
| Color | Primary `#64b3f9`, Secondary `#ededed`, White `#FEFEFE`, Black Figma Variable `#000000` · **product override (ТЗ review gate) `#232323`**, Gray_text `#888888`, Gray_dark `#e4e4e4`, GrayL `#6B6B6B` (без свотча) |
| Typography | Inter · H1 20/24/600 · H2 16/20/500 · Text 16/20/400 · Caption 12/16/500 |
| Elevation | Shadow `0 5px 9px #BBBBBD40` (Card hover, Sidebar); «вв» не к Card |
| Layout | фиксированные размеры компонентов (см. таблицу ниже) |
| Motion | — (нет в Ui kit; hover — статические варианты) |

Свотчи на витрине: 6 (`41:11757`). GrayL — только CSS.

## Доступные компоненты

| Компонент | Варианты | Состояния | Размер (витрина) | node-id |
|-----------|----------|-----------|------------------|---------|
| Icons | close, Plus, Minus, vuesax/linear/arrow-right | default | 24×24 | `41:11677` (`41:11678`–`41:11681`) |
| Avatar | — | default | 48×48 | `41:11653` |
| Profile | — | default | 240×48 | `41:11652` |
| Chip | default, active | default / active | h32 | `41:11647` (`41:11648`, `41:11650`) |
| Link | default, hover | default / hover | — | `41:11654` (`41:11655`, `41:11657`) |
| Tapper | — · **104×40** | default | 104×40 | `41:11674` |
| Stiker | «Обо мне» | default | 81×32 (витрина); **на сцене Главной — bbox сцены** | `41:11676` |
| Hover | Behance + arrow · **114×40** | default | 114×40 | `41:11682` |
| Card | default, hover · 310×310 | default / hover | 310×310 | `41:11659` (`41:11660`, `41:11667`) |
| Sidebar | — | default | 310×561 | `41:11675` |
| IMG_BG | — | default | 345×230 | `41:11686` |
| IMG_1 | — | default | 345×230 | `41:11683` |
| IMG_2 | — | default | 345×230 | `41:11684` |
| IMG_3 | — | default | 345×345 | `41:11685` |
| Comp | — | default | ~149×103 (витрина); **на сцене Главной — bbox сцены** | `41:11687` |

Именованных единиц: **18**.

## Паттерны

| Паттерн | Состав | Когда применять |
|---------|--------|-----------------|
| _нет_ | — | паттерны не извлечены из Ui kit |

## Handoff (из манифеста 0.1.2)

- **Reuse Ui kit** `41:11646` — состав достаточен для каталога Storybook; пересборка не нужна.
- **Storybook units:** Chip, Link, Card, Sidebar, Tapper, Stiker, Hover, Avatar, Profile, Icons, Media (`IMG_BG`, `IMG_1`, `IMG_2`, `IMG_3`, `Comp`). Продуктовая реализация каталога — **вне** `design/`.
- **Black product override:** `#232323` (не Variable Black `#000000`).
- **Фикс. размеры витрины:** Tapper **104×40**, Hover **114×40**, Card **310×310**, Sidebar **310×561**.
- **Comp / Stiker на Главной:** сверять по **bbox сцены** `41:1416`, не только по atomic-размеру витрины.

## Чего нет в системе

| Что нужно | Для какого экрана | Контракт |
|-----------|-------------------|----------|
| _пусто_ | — | слоты Портфолио.Главная и DS Showcase закрыты зеркалом 0.1.2 |

## Известные ограничения (из манифеста)

- Black: Figma Variable = `#000000`; **product override (ТЗ review gate) = `#232323`** — нельзя читать только Figma-значение для продукта.
- Эффект «вв» не использовать на Card (только Shadow).
- GrayL только CSS, без свотча на витрине.
- Motion-токенов нет; hover — статические варианты.
- Продуктовый HTML/CSS / Storybook вне `design/` — не генерируется средой 4.
