---
type: manifest
env: 02-design-system
status: synced
version: 0.1.3
updated: 2026-09-08
figma_fileKey: xboMnqU5JURL0xlzxN7edN
ui_kit_node: "41:11520"
portfolio_home_node: "41:1416"
---

# DS manifest

Публичный выход среды 2 и единственное, что видно снаружи. Среда 4 строит по нему
своё зеркало `04-prototype/mirror/ds-mirror.md`.

Версия поднимается при каждом изменении состава компонентов или токенов — по ней
среда 4 определяет устаревание зеркала.

**Источник Ui kit:** [Портфолио · Ui kit](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-11520) · `fileKey` `xboMnqU5JURL0xlzxN7edN` · node `41:11520` · **v0.1.3** (синк новых компонентов + актуализация node-id; ранее root `41:11646`).

**Сцена продукта:** [Портфолио · Главная](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-1416) · node `41:1416` (composition reference, не витрина DS).

## Foundations

| Группа | Токены | Источник в Figma |
|--------|--------|------------------|
| Color | Primary `#64b3f9`, Primary_hover `#79befc`, Secondary `#ededed`, White `#FEFEFE`, Black Figma Variable `#000000` · **product override `#232323`**, Gray_text `#888888`, Gray_dark `#e4e4e4`, GrayL `#6B6B6B` | Variables @ `41:11520` |
| Typography | Inter · H1 20/24/600 · H2 16/20/500 · Text/Text1 16/20/400 · Caption 12/16/500 | Variables @ `41:11520` |
| Elevation | Shadow `0 5px 9px #BBBBBD40` (Card hover, Sidebar); FloatingAction drop `0 5 / 4.5 #BBBBBD40`; «вв» не к Card | Effect styles @ `41:11520` |
| Layout | фиксированные размеры компонентов (см. layout.md) | metadata Ui kit |
| Motion | — | нет в Ui kit |

## Компоненты

| Компонент | Варианты | Состояния | Статус | node-id |
|-----------|----------|-----------|--------|---------|
| Icons | close, Plus, Minus, arrow-right · social: linkedin, behance, mail, cv, telegram | default (+ Plus/Minus hover) | synced | `41:11521` (+ social nodes) |
| Avatar90 | — · **90×90** (instance @48 в ProfileMobile) | default | synced | `41:11499` |
| Profile | — · **240×154** | default | synced | `40:1187` |
| ProfileMobile | — · **240×48** · Avatar90@48 + H1 + Text1 GrayL | default | synced | `169:11933` |
| Chip | default, active | default / active | synced | `40:1171` (`40:1170`, `40:1169`) |
| Link | default, hover | default / hover | synced | `40:1199` (`40:1198`, `40:1197`) |
| Button | primary/secondary × default/hover · **~103×36** | default / hover | synced | `158:11315` (`158:11314`/`158:11311`/`158:11313`/`158:11312`) |
| Tapper | — · **104×40** | default | synced | `41:1311` |
| Stiker | «Обо мне» · **81×32** | default | synced | `41:1517` |
| Tooltip | pill · **~66×36** | default | synced | `92:11490` |
| CursorHover (Hover) | Behance + arrow · **114×40** | default | synced | `41:1548` |
| CursorFigma | — · **20×20** | default | synced | `163:11657` |
| FloatingAction | circle **50×50** · arrow −90° · Black `#232323` · shadow 0 5 / 4.5 | default | synced | `169:13303` |
| Card | default, hover · 310×310 | default / hover | synced | `40:1209` (`40:1208`, `40:1207`) |
| Sidebar | 310×561 | default | synced | `158:11468` |
| SityBike | Figma `SityBike` / продукт **CityBike** · **308×190** · gradient `#282a30`→`#454b59` · 2 phones | default | synced | `164:11800` |
| IMG_BG | 345×230 | default | synced | `41:11477` |
| IMG_1 | 345×230 | default | synced | `41:11479` |
| IMG_2 | 345×230 | default | synced | `41:11478` |
| IMG_3 | 345×345 | default | synced | `41:11476` |
| Comp | ~160×120 | default | synced | `41:11511` |
| me | 254×254 | default | synced | `105:11564` |
| Macbook | 389×276 | default | synced | `105:11869` |

Именованных единиц (манифест): **24+** (icons/social отдельно в Icons). Карточек в `components/`: **17**.

## Паттерны

| Паттерн | Состав | Когда применять |
|---------|--------|-----------------|
| _нет_ | — | паттерны не извлечены из Ui kit |

## Handoff для портфолио / Storybook

- **Ui kit root** `41:11520` (не `41:11646`).
- **Новые units v0.1.3:** ProfileMobile, FloatingAction, SityBike (CityBike), Button, Tooltip, CursorFigma; media **me**, **Macbook**.
- **Переименования / алиасы:** Avatar → **Avatar90**; Hover → Figma **CursorHover** (файл `hover.md`); SityBike = CityBike.
- **Storybook units:** Chip, Link, Card, Sidebar, Tapper, Stiker, Hover/CursorHover, Button, Tooltip, Avatar90, Profile, ProfileMobile, FloatingAction, CursorFigma, Icons, Media (`IMG_*`, `Comp`, `me`, `Macbook`, `SityBike`).
- **Black product override:** `#232323` (не Variable Black `#000000`).
- **Фикс. размеры:** Tapper **104×40**, CursorHover **114×40**, Card **310×310**, Sidebar **310×561**, ProfileMobile **240×48**, FloatingAction **50×50**, SityBike **308×190**, Button **~103×36**.
- **Comp / Stiker на Главной:** сверять по **bbox сцены** `41:1416`, не только по atomic-размеру витрины.

## Известные ограничения

- Black: Figma Variable = `#000000`; **product override = `#232323`** — нельзя читать только Figma-значение для продукта.
- Эффект «вв» есть в файле; **не** использовать на Card (только Shadow).
- FloatingAction: blur тени на компоненте **4.5**, не обязательно radius 9 именованного Shadow.
- GrayL только CSS, без свотча на витрине (если свотч отсутствует).
- Motion-токенов нет; hover — статические варианты.
- Продуктовый HTML/CSS / Storybook вне этой среды не генерируется.
