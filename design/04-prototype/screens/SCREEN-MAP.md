---
type: registry
env: 04-prototype
updated: 2026-09-15
mirrored-version: 0.1.2
---

# Карта экранов: прототип ↔ Figma

Неразрывная связь между спецификациями в `screens/` и узлами продуктового файла Figma.
Обновляется в той же задаче, что и сборка, — не откладывается.

Правило целостности: собранный экран обязан иметь строку здесь. Экран без строки
считается дрейфом и фиксируется в
[`../../02-design-system/figma/sync-log.md`](../../02-design-system/figma/sync-log.md).

## Экраны

| Экран | Спецификация | node-id | fileKey | Версия зеркала при сборке | Статус | Собран |
|-------|--------------|---------|---------|---------------------------|--------|--------|
| Портфолио.Главная | [`portfolio-home.md`](portfolio-home.md) | `41:1416` | `xboMnqU5JURL0xlzxN7edN` | 0.1.2 | built | 2026-09-06 (эталон задокументирован; `use_figma` не вызывался) |
| DS Showcase | [`ds-showcase.md`](ds-showcase.md) | `41:11646` | `xboMnqU5JURL0xlzxN7edN` | 0.1.2 | built | 2026-09-06 (reference витрины Ui kit; Storybook inventory) |
| DB-IB · Дашборд ИБ (primary) | wireframe · IA [`../flows/dashboard-ia.md`](../flows/dashboard-ia.md) | pending | — | — | wireframe | 2026-09-15 · mobile [`../wireframes/dashboard-wireframes.html`](../wireframes/dashboard-wireframes.html) |
| DB-IB-D · Дашборд ИБ (primary) Desktop | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · [`../wireframes/dashboard-wireframes-desktop.html`](../wireframes/dashboard-wireframes-desktop.html) |
| DB-HR · Срез HR (обучение) | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile |
| DB-HR-D · Срез HR Desktop | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · desktop board |
| DB-SOC · Срез SOC | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile |
| DB-SOC-D · Срез SOC Desktop | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · desktop board |
| DB-EMPTY · Пусто (нет кампаний) | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile |
| DB-EMPTY-D · Пусто Desktop | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · desktop board |
| DB-LOAD · Loading | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile |
| DB-LOAD-D · Loading Desktop | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · desktop board |
| DB-ASSIGN · Назначение обучения | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile sheet |
| DB-ASSIGN-D · Назначение Desktop | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · desktop modal |
| DB-ATTACK · Drill → Атаки (внешний) | wireframe · stub | pending | — | — | wireframe | 2026-09-15 · mobile · маркер EXT-ATTACKS |
| DB-ATTACK-D · Drill → Атаки Desktop | wireframe · stub | pending | — | — | wireframe | 2026-09-15 · split-view hint |

Статусы: `wireframe` (каркас HTML, Figma node-id нет) → `spec` (описан, не собран) → `built` (собран в Figma) →
`stale` (зеркало ушло вперёд, требуется пересборка) → `retired`.

## Storybook coverage (вне design/)

Каталог Storybook = покрытие инвентаря DS: **Chip, Link, Card, Sidebar, Tapper, Stiker, Hover, Avatar, Profile, Icons, Media**.  
Stories в коде средой 4 не собираются; продуктовая реализация — вне `design/`. Reference витрины: `41:11646`.

## Использование компонентов

Обратная связь «компонент → где применён». Нужна среде 2 при оценке последствий
изменения компонента: строки отсюда прикладываются к контракту.

| Компонент из зеркала | Экраны |
|----------------------|--------|
| Icons | DS Showcase |
| Avatar | DS Showcase, Портфолио.Главная (в Sidebar) |
| Profile | DS Showcase, Портфолио.Главная (в Sidebar) |
| Chip | DS Showcase, Портфолио.Главная (Sidebar Skills) |
| Link | DS Showcase; контакты на Главной — без URL |
| Tapper | DS Showcase, Портфолио.Главная (world, canvas zoom) |
| Stiker | DS Showcase, Портфолио.Главная (bbox сцены) |
| Hover | DS Showcase |
| Card | DS Showcase, Портфолио.Главная ×3 |
| Sidebar | DS Showcase, Портфолио.Главная |
| IMG_BG / IMG_1 / IMG_2 / IMG_3 | DS Showcase (Media); на Главной — BG-плитка сцены |
| Comp | DS Showcase, Портфолио.Главная (bbox сцены) |

## Ожидает пересборки

| Экран | Причина | Версия зеркала: была → стала |
|-------|---------|------------------------------|
| — | — | — |
