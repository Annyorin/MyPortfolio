---
type: registry
env: 02-design-system
updated: 2026-09-06
mcp: remote https://mcp.figma.com/mcp
account: makjsgjyeqei (allysonspiller1953@lembituses.com)
---

# Реестр Figma: проект, файлы, узлы

Единственный источник истины о связи «Figma ↔ текстовое описание». Работа с Figma
начинается отсюда: берётся конкретный `fileKey` и `node-id`, а не файл целиком.

Правило целостности: узел, к которому обращались на запись, обязан иметь строку в
этой таблице. Узел без строки — дрейф, фиксируется в [`sync-log.md`](sync-log.md).

## Проект

| Поле | Значение |
|------|----------|
| Название проекта | Портфолио (витрина DS) |
| Команда / план | allysonspiller1953's team |
| Тариф и лимиты | student · seat Full |

## Файлы

| Роль | fileKey | Ссылка | Среда-владелец | Комментарий |
|------|---------|--------|----------------|-------------|
| Библиотека DS / Ui kit | `xboMnqU5JURL0xlzxN7edN` | [Портфолио](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-11646) | `02-design-system` | фрейм Ui kit `41:11646` |
| Продуктовый файл | _не задан_ | | `04-prototype` | экраны и флоу |

## Компоненты

| Компонент | node-id | fileKey | Назначение | Варианты | Локальный файл | Статус | Синк |
|-----------|---------|---------|------------|----------|----------------|--------|------|
| Ui kit (frame) | `41:11646` | xboMnqU5JURL0xlzxN7edN | Витрина foundations + компонентов | — | — | synced | 2026-09-06 |
| Icons | `41:11677` | xboMnqU5JURL0xlzxN7edN | Иконки 24×24 | close, Plus, Minus, arrow-right | `components/icons.md` | synced | 2026-09-06 |
| close | `41:11678` | xboMnqU5JURL0xlzxN7edN | Закрытие | — | `components/icons.md` | synced | 2026-09-06 |
| Plus | `41:11679` | xboMnqU5JURL0xlzxN7edN | Добавить | — | `components/icons.md` | synced | 2026-09-06 |
| Minus | `41:11680` | xboMnqU5JURL0xlzxN7edN | Убрать | — | `components/icons.md` | synced | 2026-09-06 |
| vuesax/linear/arrow-right | `41:11681` | xboMnqU5JURL0xlzxN7edN | Стрелка вправо | — | `components/icons.md` | synced | 2026-09-06 |
| Avatar | `41:11653` | xboMnqU5JURL0xlzxN7edN | Аватар 48×48 | default | `components/avatar.md` | synced | 2026-09-06 |
| Profile | `41:11652` | xboMnqU5JURL0xlzxN7edN | Блок профиля | default | `components/profile.md` | synced | 2026-09-06 |
| Chip | `41:11647` | xboMnqU5JURL0xlzxN7edN | Фильтр-чип h32 | default, active | `components/chip.md` | synced | 2026-09-06 |
| Chip / default | `41:11648` | xboMnqU5JURL0xlzxN7edN | Chip покой | Property 1=default | `components/chip.md` | synced | 2026-09-06 |
| Chip / active | `41:11650` | xboMnqU5JURL0xlzxN7edN | Chip выбран | Property 1=active | `components/chip.md` | synced | 2026-09-06 |
| Link | `41:11654` | xboMnqU5JURL0xlzxN7edN | Текстовая ссылка | default, hover | `components/link.md` | synced | 2026-09-06 |
| Link / default | `41:11655` | xboMnqU5JURL0xlzxN7edN | Link покой | Property 1=default | `components/link.md` | synced | 2026-09-06 |
| Link / hover | `41:11657` | xboMnqU5JURL0xlzxN7edN | Link наведение | Property 1=hover | `components/link.md` | synced | 2026-09-06 |
| Tapper | `41:11674` | xboMnqU5JURL0xlzxN7edN | Кнопка 104×40 | default | `components/tapper.md` | synced | 2026-09-06 |
| Stiker | `41:11676` | xboMnqU5JURL0xlzxN7edN | Бейдж «Обо мне» 81×32 | default | `components/stiker.md` | synced | 2026-09-06 |
| Hover | `41:11682` | xboMnqU5JURL0xlzxN7edN | CTA Behance+arrow 114×40 | default | `components/hover.md` | synced | 2026-09-06 |
| Card | `41:11659` | xboMnqU5JURL0xlzxN7edN | Карточка 310×310 | default, hover | `components/card.md` | synced | 2026-09-06 |
| Card / default | `41:11660` | xboMnqU5JURL0xlzxN7edN | Card покой | Property 1=default | `components/card.md` | synced | 2026-09-06 |
| Card / hover | `41:11667` | xboMnqU5JURL0xlzxN7edN | Card наведение | Property 1=hover | `components/card.md` | synced | 2026-09-06 |
| Sidebar | `41:11675` | xboMnqU5JURL0xlzxN7edN | Сайдбар 310×561 | default | `components/sidebar.md` | synced | 2026-09-06 |
| IMG_BG | `41:11686` | xboMnqU5JURL0xlzxN7edN | Медиа фон 345×230 | — | `components/media.md` | synced | 2026-09-06 |
| IMG_1 | `41:11683` | xboMnqU5JURL0xlzxN7edN | Медиа 345×230 | — | `components/media.md` | synced | 2026-09-06 |
| IMG_2 | `41:11684` | xboMnqU5JURL0xlzxN7edN | Медиа 345×230 | — | `components/media.md` | synced | 2026-09-06 |
| IMG_3 | `41:11685` | xboMnqU5JURL0xlzxN7edN | Медиа 345×345 | — | `components/media.md` | synced | 2026-09-06 |
| Comp | `41:11687` | xboMnqU5JURL0xlzxN7edN | Композитный превью | — | `components/media.md` | synced | 2026-09-06 |

Статусы: `draft` → `in-figma` → `synced` → `deprecated`.

## Переменные и стили

| Группа | node-id / коллекция | Назначение | Локальный файл | Синк |
|--------|---------------------|------------|----------------|------|
| Color | Ui kit `41:11646` | Primary, Secondary, White, Black, Gray_text, Gray_dark, GrayL | `foundations/color.md` | 2026-09-06 |
| Typography | Ui kit `41:11646` | H1, H2, Text, Caption (Inter) | `foundations/typography.md` | 2026-09-06 |
| Effects | Ui kit `41:11646` | Shadow; вв (не к Card) | `foundations/elevation.md` | 2026-09-06 |
| Color swatches | `41:11757` | 6 свотчей на витрине | `foundations/color.md` | 2026-09-06 |
| Type specimens | `41:11764` | H1–Caption на витрине | `foundations/typography.md` | 2026-09-06 |

## Страницы библиотеки

| Страница | node-id | Что содержит |
|----------|---------|--------------|
| Ui kit (frame) | `41:11646` | foundations + atomic/composite/media витрина |
| Портфолио · Главная (composition ref) | `41:1416` | продуктовая сцена; Comp/Stiker сверять по bbox сцены, не только atomic Ui kit |

## Mirror-map (возобновление батчей)

Машиночитаемая карта id узлов, созданных при записи в Figma:
[`mirror-map.json`](mirror-map.json). Обновляется скиллом `handoff-to-figma` после
каждого батча. Позволяет продолжить сборку с середины без повторного создания.
Шаблон структуры: [`_shared/templates/figma-mirror-map.json`](../../_shared/templates/figma-mirror-map.json).
