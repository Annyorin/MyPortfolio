---
type: registry
env: 02-design-system
updated: 2026-09-08
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
| Библиотека DS / Ui kit | `xboMnqU5JURL0xlzxN7edN` | [Портфолио](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/Портфолио?node-id=41-11520) | `02-design-system` | фрейм Ui kit `41:11520` (ранее `41:11646`) |
| Продуктовый файл | _не задан_ | | `04-prototype` | экраны и флоу |

## Компоненты

| Компонент | node-id | fileKey | Назначение | Варианты | Локальный файл | Статус | Синк |
|-----------|---------|---------|------------|----------|----------------|--------|------|
| Ui kit (frame) | `41:11520` | xboMnqU5JURL0xlzxN7edN | Витрина foundations + компонентов | — | — | synced | 2026-09-08 |
| Icons | `41:11521` | xboMnqU5JURL0xlzxN7edN | Группа иконок 24×24 | close, Plus, Minus, arrow-right | `components/icons.md` | synced | 2026-09-08 |
| close | `40:1179` | xboMnqU5JURL0xlzxN7edN | Закрытие | — | `components/icons.md` | synced | 2026-09-08 |
| Plus (set) | `55:9404` | xboMnqU5JURL0xlzxN7edN | Добавить | default, hover | `components/icons.md` | synced | 2026-09-08 |
| Minus (set) | `55:9407` | xboMnqU5JURL0xlzxN7edN | Убрать | default, hover | `components/icons.md` | synced | 2026-09-08 |
| vuesax/linear/arrow-right | `41:1530` | xboMnqU5JURL0xlzxN7edN | Стрелка вправо | — | `components/icons.md` | synced | 2026-09-08 |
| linkedin-box-fill | `158:11220` | xboMnqU5JURL0xlzxN7edN | Social 20×20 | — | `components/icons.md` | synced | 2026-09-08 |
| behance | `158:11208` | xboMnqU5JURL0xlzxN7edN | Social 20×20 | — | `components/icons.md` | synced | 2026-09-08 |
| mail | `158:11262` | xboMnqU5JURL0xlzxN7edN | Social 20×20 | — | `components/icons.md` | synced | 2026-09-08 |
| cv | `158:11193` | xboMnqU5JURL0xlzxN7edN | Social 20×20 | — | `components/icons.md` | synced | 2026-09-08 |
| telegram | `158:11186` | xboMnqU5JURL0xlzxN7edN | Social 20×20 | — | `components/icons.md` | synced | 2026-09-08 |
| CursorFigma | `163:11657` | xboMnqU5JURL0xlzxN7edN | Tool icon 20×20 | default | `components/cursor-figma.md` | synced | 2026-09-08 |
| Avatar90 | `41:11499` | xboMnqU5JURL0xlzxN7edN | Аватар 90×90 | default | `components/avatar.md` | synced | 2026-09-08 |
| Profile | `40:1187` | xboMnqU5JURL0xlzxN7edN | Блок профиля 240×154 | default | `components/profile.md` | synced | 2026-09-08 |
| ProfileMobile | `169:11933` | xboMnqU5JURL0xlzxN7edN | Горизонтальный профиль 240×48 | default | `components/profile-mobile.md` | synced | 2026-09-08 |
| Chip | `40:1171` | xboMnqU5JURL0xlzxN7edN | Фильтр-чип h32 | default, active | `components/chip.md` | synced | 2026-09-08 |
| Chip / default | `40:1170` | xboMnqU5JURL0xlzxN7edN | Chip покой | Property 1=default | `components/chip.md` | synced | 2026-09-08 |
| Chip / active | `40:1169` | xboMnqU5JURL0xlzxN7edN | Chip выбран | Property 1=active | `components/chip.md` | synced | 2026-09-08 |
| Link | `40:1199` | xboMnqU5JURL0xlzxN7edN | Текстовая ссылка | default, hover | `components/link.md` | synced | 2026-09-08 |
| Link / default | `40:1198` | xboMnqU5JURL0xlzxN7edN | Link покой | Property 1=default | `components/link.md` | synced | 2026-09-08 |
| Link / hover | `40:1197` | xboMnqU5JURL0xlzxN7edN | Link наведение | Property 1=hover | `components/link.md` | synced | 2026-09-08 |
| Button | `158:11315` | xboMnqU5JURL0xlzxN7edN | CTA icon+label | primary/secondary × default/hover | `components/button.md` | synced | 2026-09-08 |
| Button / secondary default | `158:11314` | xboMnqU5JURL0xlzxN7edN | Secondary покой | Property 1=secondary, 2=default | `components/button.md` | synced | 2026-09-08 |
| Button / secondary hover | `158:11311` | xboMnqU5JURL0xlzxN7edN | Secondary hover | Property 1=secondary, 2=hover | `components/button.md` | synced | 2026-09-08 |
| Button / primary default | `158:11313` | xboMnqU5JURL0xlzxN7edN | Primary покой | Property 1=primary, 2=default | `components/button.md` | synced | 2026-09-08 |
| Button / primary hover | `158:11312` | xboMnqU5JURL0xlzxN7edN | Primary hover | Property 1=primary, 2=hover | `components/button.md` | synced | 2026-09-08 |
| Tapper | `41:1311` | xboMnqU5JURL0xlzxN7edN | Кнопка 104×40 | default | `components/tapper.md` | synced | 2026-09-08 |
| Stiker | `41:1517` | xboMnqU5JURL0xlzxN7edN | Бейдж «Обо мне» 81×32 | default | `components/stiker.md` | synced | 2026-09-08 |
| Tooltip | `92:11490` | xboMnqU5JURL0xlzxN7edN | Подсказка pill | default | `components/tooltip.md` | synced | 2026-09-08 |
| CursorHover (Hover) | `41:1548` | xboMnqU5JURL0xlzxN7edN | CTA Behance+arrow 114×40 | default | `components/hover.md` | synced | 2026-09-08 |
| FloatingAction | `169:13303` | xboMnqU5JURL0xlzxN7edN | FAB 50×50 arrow-up | default | `components/floating-action.md` | synced | 2026-09-08 |
| Card | `40:1209` | xboMnqU5JURL0xlzxN7edN | Карточка 310×310 | default, hover | `components/card.md` | synced | 2026-09-08 |
| Card / default | `40:1208` | xboMnqU5JURL0xlzxN7edN | Card покой | Property 1=default | `components/card.md` | synced | 2026-09-08 |
| Card / hover | `40:1207` | xboMnqU5JURL0xlzxN7edN | Card наведение | Property 1=hover | `components/card.md` | synced | 2026-09-08 |
| Sidebar | `158:11468` | xboMnqU5JURL0xlzxN7edN | Сайдбар 310×561 | default | `components/sidebar.md` | synced | 2026-09-08 |
| IMG_BG | `41:11477` | xboMnqU5JURL0xlzxN7edN | Медиа фон 345×230 | — | `components/media.md` | synced | 2026-09-08 |
| IMG_1 | `41:11479` | xboMnqU5JURL0xlzxN7edN | Медиа 345×230 | — | `components/media.md` | synced | 2026-09-08 |
| IMG_2 | `41:11478` | xboMnqU5JURL0xlzxN7edN | Медиа 345×230 | — | `components/media.md` | synced | 2026-09-08 |
| IMG_3 | `41:11476` | xboMnqU5JURL0xlzxN7edN | Медиа 345×345 | — | `components/media.md` | synced | 2026-09-08 |
| Comp | `41:11511` | xboMnqU5JURL0xlzxN7edN | Композитный превью | — | `components/media.md` | synced | 2026-09-08 |
| me | `105:11564` | xboMnqU5JURL0xlzxN7edN | Портрет 254×254 | — | `components/media.md` | synced | 2026-09-08 |
| Macbook | `105:11869` | xboMnqU5JURL0xlzxN7edN | Девайс-мок 389×276 | — | `components/media.md` | synced | 2026-09-08 |
| SityBike | `164:11800` | xboMnqU5JURL0xlzxN7edN | Cover CityBike 308×190 | — | `components/sitybike.md` | synced | 2026-09-08 |

Статусы: `draft` → `in-figma` → `synced` → `deprecated`.

## Переменные и стили

| Группа | node-id / коллекция | Назначение | Локальный файл | Синк |
|--------|---------------------|------------|----------------|------|
| Color | Ui kit `41:11520` | Primary, Secondary, White, Black, Gray_text, Gray_dark, GrayL, Primary_hover | `foundations/color.md` | 2026-09-08 |
| Typography | Ui kit `41:11520` | H1, H2, Text/Text1, Caption (Inter) | `foundations/typography.md` | 2026-09-08 |
| Effects | Ui kit `41:11520` | Shadow; вв (не к Card); FAB blur 4.5 | `foundations/elevation.md` | 2026-09-08 |

## Страницы библиотеки

| Страница | node-id | Что содержит |
|----------|---------|--------------|
| Ui kit (frame) | `41:11520` | foundations + atomic/composite/media витрина |
| Портфолио · Главная (composition ref) | `41:1416` | продуктовая сцена; Comp/Stiker сверять по bbox сцены |

## Mirror-map (возобновление батчей)

Машиночитаемая карта id узлов, созданных при записи в Figma:
[`mirror-map.json`](mirror-map.json). Обновляется скиллом `handoff-to-figma` после
каждого батча. Позволяет продолжить сборку с середины без повторного создания.
Шаблон структуры: [`_shared/templates/figma-mirror-map.json`](../../_shared/templates/figma-mirror-map.json).
