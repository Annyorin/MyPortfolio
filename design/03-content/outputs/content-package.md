---
type: package
env: 03-content
status: ready
updated: 2026-09-16
source: figma:xboMnqU5JURL0xlzxN7edN/41:1416|41:11646 + tz:technical_specification.md§1/§4/§3 + research-digest.md + research-digest-innodragon.md + owner 2026-09-15/16
scope: storybook-demo+portfolio-home+case-phish+case-dragon
---

# Content package

Публичный выход среды 3. Среда 4 / Code подставляют тексты по ключам из этой таблицы.

**Канон ключей для Storybook, prototype и сайта — этот файл.** Имена публичных ключей фиксируются здесь (`chip.*`, `contact.*`, `card.meta`, `card.a.*`, `card.b.*`, `case.dragon.*`, `case.phish.*`, `tapper.*`); альтернативы вроде `sidebar.chip.*` / `sidebar.contact.*` / `card.years` не канон.

Демо-строки UI (Storybook / главная) — Figma fileKey `xboMnqU5JURL0xlzxN7edN`, nodes `41:1416` / `41:11646` + ТЗ §1/§3/§4. Кейс уведомлений InnoDragon — `copy/case-dragon.md` ← `01-research/outputs/research-digest-innodragon.md` + факты владельца 2026-09-16. Кейс сводного дашборда InnoPhish — `copy/case-phish.md` ← `01-research/outputs/research-digest.md` + факты владельца 2026-09-15.

**Контракт контактов:** у `contact.*` есть только подписи, **без URL** → навигация не предполагается (`href="#"` / button без перехода). Источник правила: ТЗ §1 / §4.

**Card на Портфолио.Главная:** `card.a.*` — InnoDragon (фокус кейса: настройки уведомлений). `card.b.*` — InnoPhish (сводный дашборд). Полные тексты — `case.dragon.*` / `case.phish.*`. Описание `card.a.description` — канон макета, не пересказ кейса.

## Тексты
| Ключ | Текст | Вариант / состояние | Роль | Источник инсайта |
|------|-------|---------------------|------|------------------|
| profile.name | Аня Ясинская | — | Имя в Profile / Sidebar | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| profile.role | Продуктовый дизайнер | — | Роль в Profile (орфография макета) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| sidebar.bio | Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь. | — | Bio в Sidebar.Inform | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| chip.b2b | B2B | **active** | Sidebar Skills + образец Chip | figma:xboMnqU5JURL0xlzxN7edN/41:1416\|41:11646 |
| chip.b2c | B2C | **active** | Sidebar Skills | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| chip.design_system | Design System | **default** | Sidebar Skills | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| chip.ai_prototyping | AI-prototyping | **default** | Sidebar Skills | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| chip.sample.default | B2B | **default** | Образец Chip на витрине / Storybook | figma:xboMnqU5JURL0xlzxN7edN/41:11646 |
| chip.sample.active | B2B | **active** | Образец Chip на витрине / Storybook | figma:xboMnqU5JURL0xlzxN7edN/41:11646 |
| contact.cv | CV | — | Sidebar.Contacts (без URL) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| contact.telegram | Telegram | — | Sidebar.Contacts (без URL) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| contact.linkedin | LinkedIn | — | Sidebar.Contacts (без URL) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| contact.behance | Behance | — | Sidebar.Contacts (без URL) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| link.sample | Link | default / hover | Образец Link default/hover | figma:xboMnqU5JURL0xlzxN7edN/41:11646 |
| stiker.label | Обо мне | — | Подпись Stiker на Портфолио.Главная | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| hover.label | Behance | — | CTA Hover-кнопки | figma:xboMnqU5JURL0xlzxN7edN/41:1416\|41:11646 |
| card.title | InnoDragon | — | Заголовок Card (демо ×3) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| card.meta | · 2024-2026 | — | Мета Card (демо ×3) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| card.description | Система управления безопасностью. Позволяет организациям эффективно защищать свои сети и активы в реальном времени. | — | Описание Card (демо ×3 / канон макета InnoDragon) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| case.dragon.role_value | UX/UI дизайнер: исследование и макеты. Код и бэклог — не мои. | — | Мета: роль | канон портфолио; owner 2026-09-16 |
| case.dragon.team_value | 4 фронта, 4 бэка + дизайнер | — | Мета: команда | owner 2026-09-16, как InnoPhish |
| case.dragon.intro_body | InnoDragon — настройки уведомлений. Цель / аудитория / критерии. Макет в прод. Среднее время на записи, секунды в кейс не вынесены. | — | Вводные | owner + digest-innodragon + SLA 3→30 |
| case.dragon.context_body | Модалка с вкладками-каналами; дерево копируется; нет чекбокса группы; одно сохранение. Не конструктор Qualys. | — | Контекст (длинная) | owner 2026-09-16 |
| case.dragon.analysis_title | Исследование | — | Заголовок секции (длинная) | шаблон |
| case.dragon.analysis_body | Сжатые выводы: бенчмарки, Weeek, n=10, запись экрана (путь + среднее время). Полный канон — copy/innodragon.md. | — | Секция «Исследование», длинная | digest-innodragon + owner |
| case.dragon.hypotheses_body | Чекбокс на вкладках недостаточен. Матрица. Запись: первый клик, путь, среднее время. Не конструктор Qualys. | — | Гипотезы, короткая | owner + рынок |
| case.dragon.hypotheses_body_long | Каналы подключаются отдельно. Не «скопировать с вкладки Почта». | — | Гипотезы, длинная добавка | digest-innodragon |
| case.dragon.conclusions_body | Макет в прод. Целилась во время закрытия задачи. Секунды с записи не вынесены. Провал — чекбокс при вкладках. | — | Выводы | owner |
| case.dragon.source_file | design/03-content/copy/case-dragon.md | — | Полный текст кейса (A + B) | — |
| card.b.title | InnoPhish | — | Заголовок Card кейса (дашборд) | owner 2026-09-15; research-digest |
| card.b.meta | · 2024–2026 | — | Мета Card кейса | owner 2026-09-15 (как card.b / период) |
| card.b.description | Программа для повышения осведомлённости сотрудников в области ИБ и укрепления их устойчивости к кибератакам, основанным на социальной инженерии. | — | Описание Card (4 строки, переносы в content.js) | Figma Card + owner |
| case.phish.role_value | UX/UI дизайнер: исследование и макеты. Код и бэклог — не мои. | — | Мета: роль | owner; шаблон слой B |
| case.phish.team_value | 4 фронта, 4 бэка + дизайнер | — | Мета: команда | owner |
| case.phish.intro_body | InnoPhish — сводная страница для ИБ. Цель / аудитория / критерии (SLA-ритм). Время доклада после запуска не замерила. | — | Вводные | owner + [SLA 3→30](https://faithful-pink-98c.notion.site/SLA-3-30-16dd55a60207806c9bbcd56968f2e633) |
| case.phish.context_body | EvilGo + обучение + Excel; ~60% — аудитория, не UI; одна сводка и файл вместо второго экрана. | — | Контекст (длинная) | digest n=2 + owner |
| case.phish.analysis_title | Исследование | — | Заголовок секции (длинная) | owner |
| case.phish.analysis_body | Сжатые выводы: бенчмарки, интервью n=2, работа / ценности / барьеры / что не копировать. Полный канон — copy/innophish.md. | — | Секция «Исследование», длинная версия | digest + матрица; не простыня интервью |
| case.phish.hypotheses_body | Сначала всё на одном экране — не прочитали. Вкладки. PDF вместо второго экрана. | — | Гипотезы, короткая | owner тест |
| case.phish.hypotheses_body_long | Сводка ≠ «Отчёты»; срез, не тренд; топ + курс; сигнал без формулы; HR/SOC на вкладках не закрыты. | — | Гипотезы, длинная добавка | digest + owner |
| case.phish.conclusions_body | Макет в прод. Целилась в скорость доклада — не замерила. Провал — страница без вкладок. Дальше: делить типы цифр; раньше решить сводка или отчёт. | — | Выводы | owner |
| case.phish.source_file | design/03-content/copy/case-phish.md | — | Полный текст кейса (A + B) | — |
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
| avatar | — | Экспорт из Figma Ui kit: Avatar 48×48 (Profile) |
| card.image | — | Экспорт из Figma Ui kit: изображение карточки InnoDragon |
| card.b.image | — | Кадр сводного дашборда InnoPhish (макет); не сток |
| img_bg | — | Экспорт из Figma Ui kit: IMG_BG |
| img_1 | — | Экспорт из Figma Ui kit: IMG_1 |
| img_2 | — | Экспорт из Figma Ui kit: IMG_2 |
| img_3 | — | Экспорт из Figma Ui kit: IMG_3 |
| comp | — | Экспорт из Figma Ui kit: Comp (коллаж) |

## Tone of voice — краткая выжимка
Демо UI — как в макете, без маркетинговой переписки. Кейс InnoPhish — слой B по `strategy/case-writing-template.md`: речь, не склейка ярлыков; без `as-is` / `dual-mode` / JTBD на сайте; без выдуманных %; нет замера — «не замерила». Кавычки «ёлочки»; висячие предлоги — NBSP.
