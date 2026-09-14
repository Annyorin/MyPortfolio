---
type: manifest
env: 02-design-system
status: synced
version: 0.1.9
updated: 2026-09-14
figma_fileKey: xboMnqU5JURL0xlzxN7edN
ui_kit_node: "41:11520"
portfolio_home_node: "41:1416"
---

# DS manifest

Публичный выход среды 2 и единственное, что видно снаружи. Среда 4 строит по нему
своё зеркало `04-prototype/mirror/ds-mirror.md`.

Версия поднимается при каждом изменении состава компонентов или токенов — по ней
среда 4 определяет устаревание зеркала.

**Источник Ui kit:** [Портфолио · Ui kit](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-11520) · `fileKey` `xboMnqU5JURL0xlzxN7edN` · node `41:11520` · **v0.1.9** (Header 620×81 py16; Hint v0.1.8; Toolbar / Dragon/Phish/stickers/Macbook v0.1.6–0.1.7).

**Сцена продукта:** [Портфолио · Главная](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-1416) · node `41:1416` (composition reference, не витрина DS).

## Foundations

| Группа | Токены | Источник в Figma |
|--------|--------|------------------|
| Color | Primary `#64b3f9`, Primary_hover `#79befc`, Secondary `#ededed`, White `#FEFEFE`, Black Figma Variable `#000000` · **product override `#232323`**, Gray_text `#888888`, Gray_dark `#e4e4e4`, GrayL `#6B6B6B` | Variables @ `41:11520` |
| Typography | Inter · H1 20/24/600 · H2 16/20/500 · Text/Text1 16/20/400 · Caption 12/16/500 · Text2 14/18/400 (SegmentsControl) | Variables @ `41:11520` |
| Elevation | Shadow `0 5px 9px #BBBBBD40` (Card **default + hover**, Sidebar, SegmentsControl active pill, **Hint**); Mobile `0 3px 9px #8B8B8E40` (MenuMobile); FloatingAction drop `0 5 / 4.5 #BBBBBD40`; «вв» не к Card | Effect styles @ `41:11520` |
| Layout | фиксированные размеры компонентов (см. layout.md) | metadata Ui kit |
| Motion | — | нет в Ui kit |

## Компоненты

| Компонент | Варианты | Состояния | Статус | node-id |
|-----------|----------|-----------|--------|---------|
| Icons | close, Plus, Minus, arrow-right, **arrow-left**, **Burger_menu** · social: linkedin, behance, mail, cv, telegram | default (+ Plus/Minus hover) | synced | `41:11521` (+ social / new icons) |
| Avatar90 | — · **90×90** (instance @48 в ProfileMobile) | default | synced | `41:11499` |
| Profile | — · **240×154** | default | synced | `40:1187` |
| ProfileMobile | — · **240×48** · Avatar90@48 + H1 + Text1 GrayL | default | synced | `169:11933` |
| Chip | default, active | default / active | synced | `40:1171` (`40:1170`, `40:1169`) |
| Link | default, hover | default / hover | synced | `40:1199` (`40:1198`, `40:1197`) |
| Button | primary/secondary/**Text** × default/hover | default / hover | synced | `158:11315` (+ Text `226:15947` / `227:15952`) |
| Tapper | — · **104×40** | default | synced | `41:1311` |
| Stiker | «Обо мне» · **81×32** | default | synced | `41:1517` |
| Tooltip | pill · **~66×36** | default | synced | `92:11490` |
| Hint | white tip · max **~252** · radius **0 25 25 25** | default / hover parent | synced | `251:21308` |
| CursorHover (Hover) | Behance + arrow · **114×40** | default | synced | `41:1548` |
| CursorFigma | — · **20×20** | default | synced | `163:11657` |
| FloatingAction | circle **50×50** · arrow −90° · Black `#232323` · shadow 0 5 / 4.5 | default | synced | `169:13303` |
| Card | default, hover · 310×310 · **Shadow на обоих** | default / hover | synced | `40:1209` (`40:1208`, `40:1207`) |
| Sidebar (profile) | 310×561 | default | synced | `158:11468` |
| Header | — · **620×81** · py 16 · Button Text + title Gray_text H2 (flex) | default | synced | `226:15768` |
| Toolbar | — · **360×48** · «Назад» + BurgerMenu · mobile case | default | synced | `247:16546` |
| SegmentsControl | long, short · Figma **Segmets_control** · **620×42** | Property 1 | synced | `226:15785` / `226:15784` |
| TitleSidebar | default, hover · H2 Black / Gray_text | State | synced | `227:16230` (`227:16228`, `227:16229`) |
| Menu / SideBar (TOC) | — · **262×212** · TitleSidebar list + «Контакты» · Figma **Menu** | default | synced | `227:16241` |
| MenuMobile | — · **167×224** · Text2 rows · shadow Mobile · BurgerMenu | default | synced | `245:17643` |
| SityBike | Figma `SityBike` / продукт **CityBike** · **308×190** · gradient `#282a30`→`#454b59` · 2 phones | default | synced | `164:11800` |
| Dragon | Figma `Dragon` / продукт **InnoDragon** · **308×190** · dashboard cover | default | synced | `232:16826` |
| Phish | Figma `Phish` / продукт **InnoPhish** · **308×190** · dashboard cover | default | synced | `232:16829` |
| IMG_BG | 345×230 | default | synced | `41:11477` |
| IMG_1 | 345×230 | default | synced | `41:11479` |
| IMG_2 | 345×230 | default | synced | `41:11478` |
| IMG_3 | 345×345 | default | synced | `41:11476` |
| Comp | ~160×120 | default | synced | `41:11511` |
| me | 254×254 | default | synced | `105:11564` |
| Macbook | **388×283** · lid + stickers | default | synced | `248:17115` |
| anime | стикер · **~100×91** | default | synced | `244:17347` |
| books | стикер · **~84×73** | default | synced | `244:17349` |
| create | стикер · **~62×62** | default | synced | `244:17346` |
| question | стикер · **~59×69** | default | synced | `244:17348` |
| seal | стикер · **144×60** | default | synced | `244:17350` |
| sport | стикер · **~102×87** | default | synced | `245:17642` |

Именованных единиц (манифест): **39+**. Карточек в `components/`: **26**.

## Паттерны

| Паттерн | Состав | Когда применять |
|---------|--------|-----------------|
| _нет_ | — | паттерны не извлечены из Ui kit |

## Handoff для портфолио / Storybook

- **Ui kit root** `41:11520` (не `41:11646`).
- **Refresh v0.1.9:** Header (`226:15768`) — **620×81**, padding **py 16** (было 24 / 85); title flex slot (снят absolute-center).
- **Новые units v0.1.8:** Hint (`251:21308`) — white tip · `.ds-hint` · Macbook sticker hover.
- **Новые units v0.1.7:** Toolbar (`247:16546`) — mobile case chrome ≤480 вместо Header.
- **Macbook refresh:** node → **`248:17115`** · **388×283** · layered `macbook-lid.png` + `stickers/*.png` на About; collapsed/showcase composite `macbook-248-17115.png`.
- **Новые units v0.1.6:** Dragon (`232:16826`), Phish (`232:16829`), stickers anime/books/create/question/seal/sport; Macbook был `247:16308`.
- **Новые units v0.1.5:** MenuMobile (`245:17643`), `--shadow-mobile`; Figma Menu = SideBar TOC.
- **Новые units v0.1.4:** Header, SegmentsControl (Segmets_control), TitleSidebar, SideBar (TOC), Button **Text**, icons **Burger_menu** + **arrow-left**; Card shadow на default.
- **Новые units v0.1.3:** ProfileMobile, FloatingAction, SityBike (CityBike), Button, Tooltip, CursorFigma; media **me**, **Macbook**.
- **Переименования / алиасы:** Avatar → **Avatar90**; Hover → Figma **CursorHover** (файл `hover.md`); SityBike = CityBike; Dragon = InnoDragon cover; Phish = InnoPhish cover; Segmets_control = **SegmentsControl**; **Menu** / **SideBar** TOC ≠ **Sidebar** profile; **MenuMobile** = burger panel.
- **Ассеты:** `dragon.png` / `phish.png` (канон covers); зеркала `card-innodragon.png`↔`img-1.png`, `card-innophish.png`↔`img-2.png`; `macbook.png` @3× **1164×849** (`248:17115`); stickers SVG витрина + PNG для Macbook hover.
- **Storybook units:** Chip, Link, Card, Sidebar, SideNav/Menu, MenuMobile, Header, Toolbar, SegmentsControl, TitleSidebar, Tapper, Stiker, Hover/CursorHover, Button (incl. Text), Tooltip, Hint (showcase), Avatar90, Profile, ProfileMobile, FloatingAction, CursorFigma, Icons (incl. Burger_menu, arrow-left), Media (`IMG_*`, `Comp`, `me`, `Macbook`, `SityBike`, `Dragon`, `Phish`, stickers).
- **Black product override:** `#232323` (не Variable Black `#000000`).
- **Фикс. размеры:** Tapper **104×40**, CursorHover **114×40**, Card **310×310**, Sidebar **310×561**, SideBar **262×212**, MenuMobile **167×224**, Header **620×81**, Toolbar **360×48**, SegmentsControl **620×42**, ProfileMobile **240×48**, FloatingAction **50×50**, SityBike/Dragon/Phish **308×190**, Macbook **388×283**, Button filled **~103×36**, Button Text **~115×36** (Header «На главную»), Hint max-width **~252**.
- **Comp / Stiker / Macbook на Главной:** сверять по **bbox сцены** `41:1416`, не только по atomic-размеру витрины (Macbook About child ≠ 388×283).

## Известные ограничения

- Black: Figma Variable = `#000000`; **product override = `#232323`** — нельзя читать только Figma-значение для продукта.
- Эффект «вв» есть в файле; **не** использовать на Card (только Shadow).
- FloatingAction: blur тени на компоненте **4.5**, не обязательно radius 9 именованного Shadow.
- GrayL только CSS, без свотча на витрине (если свотч отсутствует).
- Text2 (14/18) зафиксирован на SegmentsControl; отдельного свотча в foundations может не быть.
- Motion-токенов нет; hover — статические варианты.
- Macbook: atomic Ui kit 388×283; сцена About на Главной держит свой bbox — не ломать composition ради паритета.
- Продуктовый HTML/CSS / Storybook вне этой среды не генерируется (handoff витрины — исключение оркестратора).
