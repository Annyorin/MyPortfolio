---
type: screen-spec
env: 04-prototype
status: built
mirror-version: 0.1.2
figma-node: "41:11646"
figma-fileKey: xboMnqU5JURL0xlzxN7edN
updated: 2026-09-06
role: ds-reference
---

# DS Showcase (витрина дизайн-системы)

## Задача экрана

Одноэкранная витрина / **reference** Ui kit (не портфолио-приложение): показать foundations, иконки, атомарные и составные компоненты, медиа-ассеты. Эталон = существующий фрейм **Ui kit** в Figma; отдельная сборка через `use_figma` не требуется.

**Storybook:** каталог = покрытие инвентаря DS (Chip, Link, Card, Sidebar, Tapper, Stiker, Hover, Avatar, Profile, Icons, Media). Stories в коде средой 4 не собираются — продуктовая реализация вне `design/`.

**Figma:** [Ui kit](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-11646) · node `41:11646` · frame 1657×1622.

**Допуски размеров:** ±2px относительно Figma.

**Контент:** `design/03-content/outputs/content-package.md` · **status: ready**; ключи ниже = канон пакета; демо-набор сверён с Figma `41:11646` и ТЗ §1/§3/§4.

## Секции витрины

| # | Секция | Содержимое | Figma nodes |
|---|--------|------------|-------------|
| 1 | Foundations | 6 color-свотчей; type specimens H1–Caption; GrayL только в CSS (без свотча) | `41:11757`, `41:11764` |
| 2 | Icons | close, Plus, Minus, arrow-right (24×24) | `41:11677`–`41:11681` |
| 3 | Atomic | Avatar, Profile, Chip, Link, Tapper, Stiker, Hover | см. инвентарь |
| 4 | Composite | Card (default/hover), Sidebar | `41:11659`, `41:11675` |
| 5 | Media | IMG_BG, IMG_1, IMG_2, IMG_3, Comp | `41:11683`–`41:11687` |

## Инвентарь компонентов

| Слот | Компонент из зеркала | Вариант / состояние | Размер | node-id | Ключ контента |
|------|----------------------|---------------------|--------|---------|---------------|
| Profile sample | Profile | default | 240×48 | `41:11652` | `profile.name`, `profile.role` |
| Avatar sample | Avatar | default | 48×48 | `41:11653` | `avatar` |
| Chip samples | Chip | default + active | h32 | `41:11648`, `41:11650` | `chip.sample.default`, `chip.sample.active` |
| Link samples | Link | default + hover | — | `41:11655`, `41:11657` | `link.sample` |
| Tapper | Tapper | default | **104×40** | `41:11674` | `tapper.zoom_out`, `tapper.zoom_in` |
| Stiker | Stiker | default | 81×32 | `41:11676` | `stiker.label` |
| Hover CTA | Hover | default | **114×40** | `41:11682` | `hover.label` |
| Card default | Card | default | 310×310 | `41:11660` | `card.title`, `card.meta`, `card.description`, `card.image` |
| Card hover | Card | hover | 310×310 | `41:11667` | те же ключи + Shadow |
| Sidebar | Sidebar | default | 310×561 | `41:11675` | `profile.*`, `sidebar.bio`, chips, contacts |
| Icons row | Icons | default | 24×24 ×4 | `41:11677` | — |
| Media | IMG_BG / 1 / 2 / 3 | default | 345×230 / 345×345 | `41:11683`–`41:11686` | `img_bg`, `img_1`, `img_2`, `img_3` |
| Comp | Comp | default | ~149×103 | `41:11687` | `comp` |

## Демо-контент (content-package → Figma `41:11646` / ТЗ §1/§3/§4)

| Ключ | Текст | Вариант / где |
|------|-------|---------------|
| `profile.name` | Аня Ясинская | Profile, Sidebar |
| `profile.role` | Продуктовый дизайнер | Profile, Sidebar (орфография макета) |
| `sidebar.bio` | Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь. | Sidebar.Inform |
| `chip.b2b` | B2B | **active** · Sidebar Skills |
| `chip.b2c` | B2C | **active** · Sidebar Skills |
| `chip.design_system` | Design System | **default** · Sidebar Skills |
| `chip.ai_prototyping` | AI-prototyping | **default** · Sidebar Skills |
| `chip.sample.default` | B2B | **default** · образец Chip на витрине |
| `chip.sample.active` | B2B | **active** · образец Chip на витрине |
| `contact.cv` | CV | Sidebar.Contacts |
| `contact.telegram` | Telegram | Sidebar.Contacts |
| `contact.linkedin` | LinkedIn | Sidebar.Contacts |
| `contact.behance` | Behance | Sidebar.Contacts |
| `link.sample` | Link | Link samples default/hover |
| `stiker.label` | Обо мне | Stiker |
| `hover.label` | Behance | Hover |
| `tapper.zoom_out` | Уменьшить масштаб | Tapper a11y |
| `tapper.zoom_in` | Увеличить масштаб | Tapper a11y |
| `card.title` | InnoDragon | Card |
| `card.meta` | · 2024-2026 | Card |
| `card.description` | Система управления безопасностью. Позволяет организациям эффективно защищать свои сети и активы в реальном времени. | Card |
| `foundations.swatch_labels` | Primary, Secondary, Gray_dark, Gray_text, Black, White | Foundations |
| `typography.labels` | Заголовок 1, Заголовок 2, Текст, Подписи | Foundations |

**Handoff · Sidebar Skills:** B2B / B2C = **active**; Design System / AI-prototyping = **default**.

## Состояния компонентов (обязательные)

### Chip
| Состояние | Визуал | Применение |
|-----------|--------|------------|
| default | Secondary bg, Black текст | `chip.design_system`, `chip.ai_prototyping`; `chip.sample.default` |
| active | Primary bg, White текст | `chip.b2b`, `chip.b2c` в Sidebar; `chip.sample.active` |

### Link
| Состояние | Визуал | Применение |
|-----------|--------|------------|
| default | Text/Caption, без underline-акцента hover | sample `link.sample` |
| hover | hover-вариант из зеркала | sample рядом с default |

### Card
| Состояние | Визуал | Применение |
|-----------|--------|------------|
| default | 310×310, `border: 1px solid` Secondary `#ededed`, **без drop-shadow** | sample |
| hover | 310×310 + Shadow `0 5px 9px #BBBBBD40`; **не** эффект «вв» | sample рядом |

## Состояния экрана

| Состояние | Описание |
|-----------|----------|
| основное | единственное: статическая витрина всех секций |
| пустое / загрузка / ошибка | не применимо (showcase, не приложение) |

## Переходы

| Действие | Куда |
|----------|------|
| — | одноэкранный flow; продуктовой навигации нет |

См. [`../flows/ds-showcase-flow.md`](../flows/ds-showcase-flow.md).

## Foundations на витрине

| Группа | Спецификация | Допуск |
|--------|--------------|--------|
| Color swatches | Primary, Secondary, White, Black, Gray_text, Gray_dark — 6 свотчей | ±2px |
| GrayL | `#6B6B6B` только CSS variable, без свотча | — |
| Type | Inter H1 20/24/600, H2 16/20/500, Text 16/20/400, Caption 12/16/500 | size/line ±0 |
| Shadow | `0 5px 9px #BBBBBD40` на Card hover и Sidebar | — |

## Handoff notes для архитектора

- **Стек:** только HTML+CSS; путь продукта **вне** `design/`.
- **Токены:** CSS custom properties; 6 свотчей на витрине + GrayL только в CSS.
- **Card default:** `border: 1px solid` Secondary `#ededed`, без drop-shadow; **hover** = Shadow `0 5px 9px #BBBBBD40`; не использовать «вв».
- **Black product:** `#232323` (review gate ТЗ §1/§3), даже если в ds-manifest Figma Variable `#000000`.
- **Hover кнопка:** **114×40** (Figma `41:11646` / Ui kit); **Tapper** 104×40, a11y `tapper.zoom_out` / `tapper.zoom_in`.
- **Sidebar Skills:** B2B/B2C **active**, Design System / AI-prototyping **default**.
- **Адаптив:** ≥1280px.
- **a11y:** базовая (семантика секций, alt у медиа, focus у Link/Hover/Tapper/Contacts).

## Пробелы

Компонентов в зеркале достаточно — контракт к среде 2 не нужен.
Content-package **ready**; трассировка ключей выше совпадает с `design/03-content/outputs/content-package.md`; демо сверён с Figma `41:11646` и ТЗ §1/§3/§4.
