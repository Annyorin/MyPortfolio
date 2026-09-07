---
type: log
env: 04-prototype
status: active
updated: 2026-09-06
---

# Build log

Публичный выход среды 4: что собрано / задокументировано в Figma и на какой версии зеркала.

| Дата | Экран | node-id | Версия зеркала | Примечание |
|------|-------|---------|----------------|------------|
| 2026-09-06 | Портфолио.Главная | `41:1416` | 0.1.2 | Эталон frame **1024×609**. Layout: Sidebar (24,24) 310×561; Card×3 (358,28)/(690,169)/(358,362) 310×310; Comp ~bbox (830,28); Stiker «Обо мне» bbox сцены; Tapper (896,537) 104×40; BG плитка. Comp/Stiker — по bbox сцены, не atomic витрины. Три Card = один демо InnoDragon. Canvas-спека (zoom/pan/hover/contacts/focus-visible) в `screens/portfolio-home.md`. **`use_figma` не вызывался.** |
| 2026-09-06 | DS Showcase | `41:11646` | 0.1.2 | Reference витрины Ui kit (reuse). Storybook inventory coverage noted; stories в коде не собирались. |
| 2026-09-06 | **Review fix** · Главная + Showcase | `41:1416` / `41:11646` | 0.1.2 | Design review Major+Minor: UC-04 A1 Space-pan приоритет над кликами; UC-02 A2 узкий viewport → стартовый **zoom-to-fit**; UC-02 A1 битый image → геометрия слота + warn; полная матрица хоткеев + шаг ~10–25% + preventDefault + grab/grabbing; Tapper keys на витрине; убраны фейковые §2.8.1/§2.8 → Figma `41:11646` + ТЗ §1/§3/§4. Спеки/flow обновлены; Figma не пересобирался. |

## Content → prototype

- Источник: `design/03-content/outputs/content-package.md` · `status: ready` · scope `storybook-demo+portfolio-home`.
- Канон ключей: `profile.*`, `sidebar.bio`, `chip.*`, `contact.*` (без URL), `link.sample`, `stiker.label`, `hover.label`, `card.title` / `card.meta` / `card.description`, **`tapper.zoom_out` / `tapper.zoom_in`**, `foundations.swatch_labels`, `typography.labels`.
- **Три Card на Главной:** один набор InnoDragon на все экземпляры.
- **Sidebar Skills:** `chip.b2b` + `chip.b2c` → **active**; `chip.design_system` + `chip.ai_prototyping` → **default**.
- Трассировка демо: Figma `41:11646` + ТЗ §1/§3/§4 (не §2.8.1).

## Canvas handoff (документировано, не runtime)

- **Старт узкий viewport (&lt;1024×609):** **zoom-to-fit**; эталон сверки desktop ≥1024×609.
- Zoom: Tapper −/+; bare +/−; Shift+0 → 100%; Ctrl/Cmd =/+/−/0; Shift+1 fit AABB (Sidebar+3×Card+Comp+Stiker+Tapper); Ctrl/Cmd+wheel к курсору; шаг **~10–25%** дискретно; **25%…400%**; pivot 100% = центр viewport; **`preventDefault`** на холсте для Ctrl/Cmd+wheel.
- Pan: Space+drag (**grab→grabbing**); **UC-04 A1** — над Card/Link/Contacts pan приоритетнее клика, пока Space зажат; wheel без модификатора (`preventDefault`); optional MMB+drag; clamp content AABB + 1×viewport padding.
- Битый image: слот сохраняет геометрию; `console.warn`; сцена работает.
- Hover Card; контакты без URL; focus-visible.

## Storybook

- Каталог = покрытие инвентаря DS: Chip, Link, Card, Sidebar, Tapper, Stiker, Hover, Avatar, Profile, Icons, Media.
- Продуктовая реализация / stories — **вне** `design/`. Среда 4 только фиксирует покрытие в screen-map / build-log / flow.

## Handoff notes (архитектор / код)

- Стек продукта: вне `design/`; HTML/JS/Storybook код здесь не пишется.
- Токены: CSS variables; Black product `#232323`.
- Card default: border Secondary, без shadow; hover = Shadow; не «вв».
- Comp/Stiker: сверять bbox сцены `41:1416`.
- Tapper 104×40 world; a11y `tapper.zoom_out` / `tapper.zoom_in`; Hover 114×40 (витрина `41:11646`).

## Артефакты среды 4

| Артефакт | Путь |
|----------|------|
| Зеркало DS | `mirror/ds-mirror.md` (v0.1.2) |
| Screen-spec Главная | `screens/portfolio-home.md` |
| Screen-spec Showcase | `screens/ds-showcase.md` |
| Screen map | `screens/SCREEN-MAP.md` |
| Flow Главная | `flows/portfolio-home-flow.md` |
| Flow Showcase | `flows/ds-showcase-flow.md` |

## Заблокировано контрактами
| Контракт | Чего ждём |
|----------|-----------|
| — | — |
