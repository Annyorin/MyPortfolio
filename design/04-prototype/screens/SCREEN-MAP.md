---
type: registry
env: 04-prototype
updated: 2026-10-05
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
| InnoPhish · IA v2 + User Flow (FigJam) | [`../flows/dashboard-ia.md`](../flows/dashboard-ia.md) · UF | `69:289` | `apRL892T8oK9XfD7YvbCRe` | — | figjam | 2026-10-01 · секции: IA `69:289`, UF v2 `69:414`, as-is `71:416`, Почему v2 `71:464` · [board](https://www.figma.com/board/apRL892T8oK9XfD7YvbCRe/UF-Portfolio?node-id=69-289) |
| Портфолио.Главная | [`portfolio-home.md`](portfolio-home.md) | `41:1416` | `xboMnqU5JURL0xlzxN7edN` | 0.1.2 | built | 2026-09-06 (эталон задокументирован; `use_figma` не вызывался) |
| DS Showcase | [`ds-showcase.md`](ds-showcase.md) | `41:11646` | `xboMnqU5JURL0xlzxN7edN` | 0.1.2 | built | 2026-09-06 (reference витрины Ui kit; Storybook inventory) |
| IP-ATT-1 · Сводка · Атаки | wireframe · 3 вкладки | pending | — | — | wireframe | 2026-10-01 · [`../wireframes/innophish-dashboard-wireframes.html`](../wireframes/innophish-dashboard-wireframes.html) · PNG [`../outputs/innophish-wireframes/01-tab-attacks.png`](../outputs/innophish-wireframes/01-tab-attacks.png) |
| IP-REA-1 · Сводка · Реакции | wireframe · 3 вкладки | pending | — | — | wireframe | 2026-10-01 · HTML board · PNG [`../outputs/innophish-wireframes/02-tab-reactions.png`](../outputs/innophish-wireframes/02-tab-reactions.png) |
| IP-TRN-1 · Сводка · Обучение | wireframe · 3 вкладки | pending | — | — | wireframe | 2026-10-01 · HTML board · PNG [`../outputs/innophish-wireframes/03-tab-training.png`](../outputs/innophish-wireframes/03-tab-training.png) |
| IP-PDF-1 · PDF для CISO (опц.) | wireframe · export preview | pending | — | — | wireframe | 2026-10-01 · HTML board · PNG [`../outputs/innophish-wireframes/04-pdf-ciso.png`](../outputs/innophish-wireframes/04-pdf-ciso.png) |
| IP-SPD-1 · Сводка · скорость реакции (репорт) | wireframe · блок | pending | — | — | wireframe | 2026-10-05 · [`../wireframes/attack-reaction-speed-wireframe.html`](../wireframes/attack-reaction-speed-wireframe.html) · заполненный список атак, медиана + min |
| IP-SPD-1b · Сводка · скорость реакции (клик) | wireframe · блок | pending | — | — | wireframe | 2026-10-05 · тот же HTML · срез «Клик»: быстрый клик = риск |
| IP-SPD-EMPTY · скорость · репортов 0 | wireframe · блок | pending | — | — | wireframe | 2026-10-05 · тот же HTML · атаки есть, репортов ещё нет |
| IP-SPD-SPARSE · скорость · мало событий | wireframe · блок | pending | — | — | wireframe | 2026-10-05 · тот же HTML · 1–2 репорта, медиана «—» |
| DB-REACT-FILT-1 · Реакции · топ-5 без отдела X | wireframe · сценарий фильтра | pending | — | — | wireframe | 2026-10-05 · [`../wireframes/reactions-dept-filter-wireframe.html`](../wireframes/reactions-dept-filter-wireframe.html) · «Все» = критичный топ-5 |
| DB-REACT-FILT-2 · Реакции · picker подразделений | wireframe · гипотеза | pending | — | — | wireframe | 2026-10-05 · тот же HTML · поиск + дерево multi-select / include children |
| DB-REACT-FILT-3 · Реакции · срез отдела | wireframe · сценарий фильтра | pending | — | — | wireframe | 2026-10-05 · тот же HTML · уязвимые выбранной ветки |
| DB-IB · Дашборд ИБ (primary) | wireframe · IA [`../flows/dashboard-ia.md`](../flows/dashboard-ia.md) | pending | — | — | wireframe | 2026-09-15 · mobile [`../wireframes/dashboard-wireframes.html`](../wireframes/dashboard-wireframes.html) |
| DB-IB-D · Дашборд ИБ (primary) Desktop | wireframe · IA · DASH-IB | pending | — | — | wireframe | 2026-09-30 · [`../wireframes/dashboard-wireframes-desktop.html`](../wireframes/dashboard-wireframes-desktop.html) · график индекс+обучение+│ |
| DB-HR · Срез HR (обучение) | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile |
| DB-HR-D · Срез HR Desktop | wireframe · IA · DASH-HR | pending | — | — | wireframe | 2026-09-30 · desktop board |
| DB-SOC · Срез SOC | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile |
| DB-SOC-D · Срез SOC Desktop | wireframe · IA · DASH-SOC | pending | — | — | wireframe | 2026-09-30 · desktop board |
| DB-EMPTY · Пусто (нет кампаний) | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile |
| DB-EMPTY-D · Пусто Desktop | wireframe · IA · DASH-EMPTY | pending | — | — | wireframe | 2026-09-30 · desktop board |
| DB-LOAD · Loading | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile |
| DB-LOAD-D · Loading Desktop | wireframe · IA · DASH-LOADING | pending | — | — | wireframe | 2026-09-30 · desktop board (+ скелетон графика) |
| DB-ASSIGN · Назначение обучения | wireframe · IA | pending | — | — | wireframe | 2026-09-15 · mobile sheet |
| DB-ASSIGN-D · Назначение Desktop | wireframe · IA · DASH-ASSIGN | pending | — | — | wireframe | 2026-09-30 · desktop modal |
| DB-TIP-D · TIP-VERT (список атак на │) | wireframe · IA · TIP-VERT | pending | — | — | wireframe | 2026-09-30 · desktop board · hover вертикали |
| DB-ATTACK · Drill → Атаки (внешний) | wireframe · stub | pending | — | — | wireframe | 2026-09-15 · mobile · маркер EXT-ATTACKS |
| DB-ATTACK-D · Drill → Атаки Desktop | wireframe · stub · EXT-ATTACKS | pending | — | — | wireframe | 2026-09-30 · split-view hint · вход с TIP-VERT |

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
