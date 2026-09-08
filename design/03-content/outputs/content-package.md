---
type: package
env: 03-content
status: ready
updated: 2026-09-06
source: figma:xboMnqU5JURL0xlzxN7edN/41:1416|41:11646 + tz:technical_specification.md§1/§4/§3
scope: storybook-demo+portfolio-home
---

# Content package

Публичный выход среды 3. Среда 4 / Code подставляют тексты по ключам из этой таблицы.

**Канон ключей для Storybook, prototype и сайта — этот файл.** Имена публичных ключей фиксируются здесь (`chip.*`, `contact.*`, `card.meta`, `tapper.*`); альтернативы вроде `sidebar.chip.*` / `sidebar.contact.*` / `card.years` не канон.

Research digest пуст (research пропущен по scope). Эталон демо-строк UI — Figma fileKey `xboMnqU5JURL0xlzxN7edN`, nodes `41:1416` (Портфолио.Главная) и `41:11646` (Ui kit). Продуктовые правила контента (орфография макета, три одинаковые Card, contact без URL) — ТЗ `docs/implementation/technical_specification.md` §1 / §4 (допущения). a11y Tapper — ТЗ §3.

**Контракт контактов:** у `contact.*` есть только подписи, **без URL** → навигация не предполагается (`href="#"` / button без перехода). Источник правила: ТЗ §1 / §4.

**Три Card на Портфолио.Главная:** один демо-набор `card.title` / `card.meta` / `card.description` (InnoDragon) на все три экземпляра. Источник правила: ТЗ §1 / §4.

## Тексты
| Ключ | Текст | Вариант / состояние | Роль | Источник инсайта |
|------|-------|---------------------|------|------------------|
| profile.name | Аня Ясинская | — | Имя в Profile / Sidebar | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| profile.role | Продуктовый дизайнер | — | Роль в Profile (орфография макета) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| sidebar.bio | Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь. | — | Bio в Sidebar.Inform | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| chip.b2b | B2B | **active** | Sidebar Skills + образец Chip | figma:xboMnqU5JURL0xlzxN7edN/41:1416\|41:11646 |
| chip.b2c | B2C | **active** | Sidebar Skills | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| chip.design_system | Design System | **default** | Sidebar Skills | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| chip.ai_prototyping | AI-prototyping | **default** | Sidebar Skills | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| chip.sample.default | B2B | **default** | Образец Chip на витрине / Storybook | figma:xboMnqU5JURL0xlzxN7edN/41:11646 |
| chip.sample.active | B2B | **active** | Образец Chip на витрине / Storybook | figma:xboMnqU5JURL0xlzxN7edN/41:11646 |
| contact.cv | CV | — | Sidebar.Contacts (без URL) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| contact.telegram | Telegram | — | Sidebar.Contacts (без URL) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| contact.linkedin | LinkedIn | — | Sidebar.Contacts (без URL) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| contact.behance | Behance | — | Sidebar.Contacts (без URL) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| link.sample | Link | default / hover | Образец Link default/hover | figma:xboMnqU5JURL0xlzxN7edN/41:11646 |
| stiker.label | Обо мне | — | Подпись Stiker на Портфолио.Главная | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| hover.label | Behance | — | CTA Hover-кнопки | figma:xboMnqU5JURL0xlzxN7edN/41:1416\|41:11646 |
| card.title | InnoDragon | — | Заголовок Card (×3 одинаковых) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| card.meta | · 2024-2026 | — | Мета Card (×3 одинаковых) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| card.description | Система управления безопасностью. Позволяет организациям эффективно защищать свои сети и активы в реальном времени. | — | Описание Card (×3 одинаковых) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| tapper.zoom_out | Уменьшить масштаб | — | a11y-имя кнопки − (Tapper) | tz:technical_specification.md§3 |
| tapper.zoom_in | Увеличить масштаб | — | a11y-имя кнопки + (Tapper) | tz:technical_specification.md§3 |
| foundations.swatch_labels | Primary, Secondary, Gray_dark, Gray_text, Black, White | — | Подписи 6 свотчей foundations | figma:xboMnqU5JURL0xlzxN7edN/41:11646 |
| typography.labels | Заголовок 1, Заголовок 2, Текст, Подписи | — | Подписи типографических стилей | figma:xboMnqU5JURL0xlzxN7edN/41:11646 |

## Component variants (Sidebar Skills)

| Ключ | Текст | Вариант Chip | Где |
|------|-------|--------------|-----|
| chip.b2b | B2B | **active** | Sidebar Skills + образец Chip |
| chip.b2c | B2C | **active** | Sidebar Skills |
| chip.design_system | Design System | **default** | Sidebar Skills |
| chip.ai_prototyping | AI-prototyping | **default** | Sidebar Skills |
| chip.sample.default | B2B | **default** | Витрина Chip (оба состояния, подпись B2B) |
| chip.sample.active | B2B | **active** | Витрина Chip (оба состояния, подпись B2B) |

## Изображения
| Ключ | Файл | Бриф |
|------|------|------|
| avatar | — | Экспорт из Figma Ui kit: Avatar 48×48 (Profile) |
| card.image | — | Экспорт из Figma Ui kit: изображение карточки InnoDragon |
| img_bg | — | Экспорт из Figma Ui kit: IMG_BG |
| img_1 | — | Экспорт из Figma Ui kit: IMG_1 |
| img_2 | — | Экспорт из Figma Ui kit: IMG_2 |
| img_3 | — | Экспорт из Figma Ui kit: IMG_3 |
| comp | — | Экспорт из Figma Ui kit: Comp (коллаж) |

## Tone of voice — краткая выжимка
Как в макете, без маркетинговой переписки. Орфография и формулировки демо-строк — дословно из Figma `41:1416` / `41:11646` (в т.ч. «Продуктовый дизайнер»; правило орфографии макета — ТЗ §1 / §4). a11y-имена Tapper — из ТЗ §3, не маркетинг.
