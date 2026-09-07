---
type: screen-spec
env: 04-prototype
status: built
mirror-version: 0.1.2
figma-node: "41:1416"
figma-fileKey: xboMnqU5JURL0xlzxN7edN
updated: 2026-09-06
---

# Портфолио.Главная

## Задача экрана

Единственный продуктовый экран портфолио: infinite-canvas сцена с Sidebar, тремя Card, Comp, Stiker, Tapper и фоновой плиткой. Эталон уже есть в Figma; новая сборка через `use_figma` **не** делалась — узел задокументирован.

**Figma:** [Портфолио.Главная](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-1416) · node `41:1416` · frame **1024×609**.

**Контент:** `design/03-content/outputs/content-package.md` · `status: ready` · scope `storybook-demo+portfolio-home`.

**Зеркало:** `mirror/ds-mirror.md` · mirrored-version **0.1.2**.

## Layout (координаты сцены, origin = фрейм)

Позиции и размеры — из ТЗ §1/§3/§4 / metadata Figma `41:1416` (сверка 2026-09-06).  
**Эталонная сверка макета** — desktop **≥1024×609** (frame `41:1416`).

| Слот | Компонент | x, y | w×h | Instance node | Примечание |
|------|-----------|------|-----|---------------|------------|
| BG | плитка BG ×4 | frame BG `-48,-35` → `1120×680` | тайлы 560×340 | `41:5425` (`41:5426`–`41:5429`) | фон сцены, не atomic Media витрины |
| Sidebar | Sidebar | **24, 24** | **310×561** | `41:1418` | совпадает с витриной |
| Card A | Card | **358, 28** | **310×310** | `41:1493` | демо InnoDragon |
| Card B | Card | **690, 169** | **310×310** | `41:1500` | тот же демо-набор |
| Card C | Card | **358, 362** | **310×310** | `41:1507` | тот же демо-набор |
| Comp | Comp | **~830, 28** | **~149×103** | `41:11512` | bbox сцены ≈ `830.16, 27.66` · `148.81×102.68` — **не** atomic витрины как единственный источник |
| Stiker | Stiker | **~813, 85** | **~87×63** | `41:11515` | bbox сцены ≈ `813.41, 84.52` · `86.96×62.96`; витрина 81×32 — **не** эталон сцены |
| Tapper | Tapper | **896, 537** | **104×40** | `41:1482` | **world element** (в мировых координатах canvas) |

**Правило Comp / Stiker:** при handoff и регрессии сверять **bbox сцены** `41:1416`, а не размеры atomic-витрины Ui kit.

## Инвентарь компонентов

| Слот | Компонент из зеркала | Вариант / состояние | Ключи контента |
|------|----------------------|---------------------|----------------|
| Sidebar | Sidebar | default | `profile.name`, `profile.role`, `sidebar.bio`, chips, contacts, `avatar` |
| Sidebar · Profile | Profile (внутри) | default | `profile.name`, `profile.role` |
| Sidebar · Skills | Chip ×4 | active / default | `chip.b2b`, `chip.b2c` (**active**); `chip.design_system`, `chip.ai_prototyping` (**default**) |
| Sidebar · Contacts | Link-like | default | `contact.cv`, `contact.telegram`, `contact.linkedin`, `contact.behance` — **без URL** |
| Card ×3 | Card | default → hover | `card.title`, `card.meta`, `card.description`, `card.image` — **один** демо-набор InnoDragon на все три |
| Comp | Comp | default | `comp` |
| Stiker | Stiker | default | `stiker.label` → «Обо мне» |
| Tapper | Tapper | default | `tapper.zoom_out`, `tapper.zoom_in` (a11y) |
| BG | BG tiles | default | визуал фона сцены |

## Демо-контент (три Card = один набор)

| Ключ | Текст |
|------|-------|
| `card.title` | InnoDragon |
| `card.meta` | · 2024-2026 |
| `card.description` | Система управления безопасностью. Позволяет организациям эффективно защищать свои сети и активы в реальном времени. |
| `stiker.label` | Обо мне |
| `tapper.zoom_out` | Уменьшить масштаб |
| `tapper.zoom_in` | Увеличить масштаб |
| `profile.name` | Аня Ясинская |
| `profile.role` | Подуктовый дизайнер |
| `sidebar.bio` | Создаю чистые интерфейсы. … (полный текст в content-package) |
| `chip.b2b` / `chip.b2c` | B2B / B2C · **active** |
| `chip.design_system` / `chip.ai_prototyping` | Design System / AI-prototyping · **default** |
| `contact.*` | CV, Telegram, LinkedIn, Behance · **без URL** |

## Состояния экрана и компонентов

| Состояние | Описание |
|-----------|----------|
| idle | Canvas на zoom 100% (desktop ≥1024); на узком viewport — стартовый **zoom-to-fit** (см. ниже); Card default; Tapper default |
| card-hover | Pointer over Card → вариант **hover** + Shadow `0 5px 9px #BBBBBD40`; не «вв» |
| focus-visible | Клавиатурный фокус на интерактивах (Contacts, Tapper ±, Card если focusable) — видимый outline |
| contacts | `contact.*` — подписи без навигации (`href="#"` / button без перехода) |
| canvas-zoom / canvas-pan | см. контракт ниже; не отдельные «экраны» |
| broken-image (UC-02 A1) | при битом `src` у Media/Card image: слот **сохраняет геометрию** (placeholder / пустая область **без схлопывания layout**); `console.warn`; остальная сцена работает |

## Canvas-контракт (спека для handoff, не runtime)

Спецификация поведения камеры для продуктовой реализации **вне** `design/`. HTML/JS здесь не пишется.

### Стартовое поведение viewport (UC-02 A2)

| Условие | Поведение |
|---------|-----------|
| Viewport **≥ 1024×609** | idle: zoom **100%**, pan по умолчанию; эталонная сверка макета |
| Viewport **&lt; 1024×609** | canvas-модель **не ломается**; при старте — **zoom-to-fit** (тот же fit, что Shift+1 / fit AABB ключевого контента). Пользователь далее pan/zoom как обычно |

**Выбор зафиксирован:** стартовый **zoom-to-fit** на узком viewport (не «частичная сцена без fit»).

### Zoom (UC-03)

| Вход | Поведение |
|------|-----------|
| Tapper **−** / **+** | zoom out / zoom in; a11y-имена `tapper.zoom_out` / `tapper.zoom_in` |
| bare **`+`** / **`−`** | zoom in / out (без модификатора; фокус на холсте) |
| **Shift+0** | zoom **100%** |
| Ctrl/Cmd **`=`** / **`+`** | zoom in |
| Ctrl/Cmd **`−`** | zoom out |
| Ctrl/Cmd **`0`** | reset zoom **100%** |
| **Shift+1** | **fit** = AABB ключевого контента (**Sidebar + 3×Card + Comp + Stiker + Tapper**) вписать в viewport |
| Ctrl/Cmd + wheel | zoom к курсору (как Figma UI); на области холста — **`preventDefault`** (zoom сцены, не страницы) |
| Шаг зума | дискретный **~10–25%** за шаг / «как Figma UI» |
| Диапазон | **25%…400%** |
| Pivot при 100% | точка мира, бывшая в **центре viewport**, остаётся в центре после reset 100% (Shift+0 / Ctrl/Cmd+0) |
| Tapper placement | **world element** — живёт в мировых координатах (позиция эталона `896,537`), не UI chrome viewport |

### Pan (UC-04)

| Вход | Поведение |
|------|-----------|
| Space + drag | pan; курсор **`grab`** (Space down) → **`grabbing`** (drag) |
| Space + drag над интерактивами (Card / Link / Contacts) (**UC-04 A1**) | **приоритет у pan**; клики/активации **не срабатывают**, пока Space зажат; после отпускания Space — обычные клики снова доступны |
| Wheel без модификатора | pan; на области холста — **`preventDefault`** (не скролл страницы) |
| Middle-button + drag | опциональный pan |
| Clamp | content AABB + **1× viewport** padding (не уводить контент за пределы с запасом в один viewport) |

### Прочее UI

- **Hover Card** — переход в вариант hover из зеркала.
- **Контакты** — без URL; клик не уводит со страницы.
- **focus-visible** — обязателен для клавиатурной навигации по интерактивам.
- **Битый image** — геометрия слота сохраняется; сцена не деградирует.

## Storybook (покрытие, не сборка)

Каталог Storybook = покрытие инвентаря DS: **Chip, Link, Card, Sidebar, Tapper, Stiker, Hover, Avatar, Profile, Icons, Media**.  
Stories в коде средой 4 **не** собираются; продуктовая реализация каталога — вне `design/`.  
Reference витрины компонентов: Ui kit `41:11646` (см. [`ds-showcase.md`](ds-showcase.md)).

## Переходы

Один экран. Продуктовой навигации между экранами нет; жесты камеры — внутри сцены.

См. [`../flows/portfolio-home-flow.md`](../flows/portfolio-home-flow.md).

## Пробелы

Компонентов в зеркале 0.1.2 достаточно — контракт к среде 2 не нужен.  
Content-package ready; `tapper.zoom_out` / `tapper.zoom_in` доступны.
