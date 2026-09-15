---
type: package
env: 03-content
status: ready
updated: 2026-09-15
source: figma:xboMnqU5JURL0xlzxN7edN/41:1416|41:11646 + tz:technical_specification.md§1/§4/§3 + research-digest.md + owner 2026-09-15
scope: storybook-demo+portfolio-home+case-phish
---

# Content package

Публичный выход среды 3. Среда 4 / Code подставляют тексты по ключам из этой таблицы.

**Канон ключей для Storybook, prototype и сайта — этот файл.** Имена публичных ключей фиксируются здесь (`chip.*`, `contact.*`, `card.meta`, `card.b.*`, `case.phish.*`, `tapper.*`); альтернативы вроде `sidebar.chip.*` / `sidebar.contact.*` / `card.years` не канон.

Демо-строки UI (Storybook / главная) — Figma fileKey `xboMnqU5JURL0xlzxN7edN`, nodes `41:1416` / `41:11646` + ТЗ §1/§3/§4. Кейс сводного дашборда InnoPhish — `copy/case-phish.md` ← `01-research/outputs/research-digest.md` + факты владельца 2026-09-15.

**Контракт контактов:** у `contact.*` есть только подписи, **без URL** → навигация не предполагается (`href="#"` / button без перехода). Источник правила: ТЗ §1 / §4.

**Card на Портфолио.Главная:** демо-набор `card.*` (InnoDragon) сохраняется для витрины. Карточка кейса InnoPhish — ключи `card.b.*` (фокус: сводный дашборд). Полный текст кейса — `case.phish.*`.

## Тексты
| Ключ | Текст | Вариант / состояние | Роль | Источник инсайта |
|------|-------|---------------------|------|------------------|
| profile.name | Аня Ясинская | — | Имя в Profile / Sidebar | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
| profile.role | Продуктовый дизайнер | — | Роль в Profile (орфография макета) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| sidebar.bio | Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь. | — | Bio в Sidebar.Inform | figma:xboMnqU5JURL0xlzxN7edN/41:1416 |
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
| card.title | InnoDragon | — | Заголовок Card (демо ×3) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| card.meta | · 2024-2026 | — | Мета Card (демо ×3) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| card.description | Система управления безопасностью. Позволяет организациям эффективно защищать свои сети и активы в реальном времени. | — | Описание Card (демо ×3) | figma:xboMnqU5JURL0xlzxN7edN/41:1416; tz:technical_specification.md§1/§4 |
| card.b.title | InnoPhish | — | Заголовок Card кейса (дашборд) | owner 2026-09-15; research-digest |
| card.b.meta | · 2024–2026 | — | Мета Card кейса | owner 2026-09-15 (как card.b / период) |
| card.b.description | Для ИБ — сводка обучения и атак в одном дашборде вместо Excel-склейки. | — | Одна строка сути карточки | research-digest J1/P1; owner: фокус дашборда + табы |
| case.phish.card_line | Для ИБ — сводка обучения и атак в одном дашборде вместо Excel-склейки. | — | Дубль строки карточки в теле кейса | = card.b.description |
| case.phish.hero.product | InnoPhish — платформа awareness и устойчивости к социнженерии / фишингу. Кейс про сводный дашборд (обучение + атаки), не про весь продукт. | — | Герой: продукт | owner + digest «не полный продукт» |
| case.phish.hero.period_platform | 2024–2026 · Desktop | — | Герой: период / платформа | owner |
| case.phish.hero.role | UX/UI дизайнер. Зона: UX-исследование, макеты в Figma, согласование с руководством, дизайн-ревью, тестирование на пользователях. | — | Герой: роль | owner |
| case.phish.hero.team | 4 фронта, 4 бэка + дизайнер | — | Герой: команда | owner |
| case.phish.hero.mission | Получить актуальную картину «обучение + атаки» для доклада, назначения курсов и оценки эффекта — без склейки в Excel и без dual-mode. | — | Герой: миссия человека | digest J1 |
| case.phish.hero.business_goal | Снизить время до сводки для ИБ; сигнал риска на сводке без жизни в консоли; PDF по кнопке для CISO, не dual-mode. | — | Герой: цель бизнеса | digest O1/O2/H3; owner PDF |
| case.phish.hero.success | Человек: сводка за один заход на дашборде, без Excel. Бизнес: доклад и назначение со сводки; PDF on-demand для CISO. | — | Герой: критерии успеха | digest + owner |
| case.phish.hero.result | As-is EvilGo → сводный дашборд InnoPhish; вкладки «Атаки» / «Обучение»; сигнал риска + PDF по кнопке. Макет → прод; повторно не замерили. | — | Герой: результат | owner |
| case.phish.hero.proof | As-is EvilGo ~60% переходов (не эффект дашборда). Тест: перегруз → вкладки. Повторно не замерили. | — | Герой: доказательство | owner |
| case.phish.hero.body | До: EvilGo; ~60% — as-is. Сделали сводку InnoPhish; перегруз → вкладки «Атаки» / «Обучение». После: макет → прод; повторно не замерили. | — | Готовый абзац героя | owner |
| case.phish.context.as_is | Пробные рассылки через EvilGo + статистика там же; ~60% переходов по ссылкам в наблюдаемой кампании — до сводного дашборда, не результат UI. | — | §1 as-is сцена | owner 2026-09-15 |
| case.phish.context.ux | Специалист по социнженерии и руководитель анализа не могут за один заход собрать картину обучения и атак рядом со статистикой EvilGo: метрики разнесены, связки атака↔обучение нет, сигнала риска на сводке нет. | — | §1 UX-проблема | digest P1–P4 + owner as-is |
| case.phish.context.biz | Excel-склейка поверх EvilGo; назначение обучения с уязвимых затягивается даже при высоком % переходов; запрос dual-mode / «как Отчёты». | — | §1 бизнес-проблема | digest + owner as-is |
| case.phish.context.why_now | Исследование + отдельная страница сводки InnoPhish; рынок нормализует сигнал риска, attack+training, топ, PDF, срезы. | — | §1 почему сейчас | digest + owner InnoPhish |
| case.phish.context.constraint_pii | ФИО топа на сводке с PII-ограничением: видимость для primary ↔ матрица ролей. | — | §1 ограничение (факт) | digest решения п.4 |
| case.phish.context.constraint_gap | ⚠ запомнено / ждём ответ владельца: ограничение → отказ → цена. Не закрыто, не выдумано. | — | §1 дыра ограничения | owner: не знает |
| case.phish.analysis.jtbd | Когда нужна сводка по awareness / фишингу, хочу единую актуальную картину «обучение + атаки» — без Excel и без dual-mode. | — | §2 JTBD | digest J1 |
| case.phish.analysis.methods | Интервью ИБ + конкурентный разбор; тест чернового макета (перегруз → табы). | — | §2 методы | digest + owner тест |
| case.phish.hypotheses.took | Сводка ≠ Отчёты; актуальный срез; вкладки Атаки/Обучение; сигнал риска (без формулы); ФИО; HR/SOC; PDF по кнопке. | — | §3 взяли | digest + owner |
| case.phish.hypotheses.deferred | Dual-mode ролей; тренд 3–6–12; всё без табов; traffic-light; schedule PDF; формула Risk Score в кейсе. | — | §3 отложили / не стали | digest + owner |
| case.phish.outcome | Макет → прод; повторно не замерили. Провал: перегруз → вкладки. Сигнал на сводке без формулы; PDF on-demand. Имя: InnoPhish. | — | §4 выводы | owner |
| case.phish.source_file | design/03-content/copy/case-phish.md | — | Полный текст кейса | — |
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
| card.b.image | — | Кадр сводного дашборда InnoPhish (макет); не сток |
| img_bg | — | Экспорт из Figma Ui kit: IMG_BG |
| img_1 | — | Экспорт из Figma Ui kit: IMG_1 |
| img_2 | — | Экспорт из Figma Ui kit: IMG_2 |
| img_3 | — | Экспорт из Figma Ui kit: IMG_3 |
| comp | — | Экспорт из Figma Ui kit: Comp (коллаж) |

## Tone of voice — краткая выжимка
Демо UI — как в макете, без маркетинговой переписки. Кейс InnoPhish — по `strategy/case-writing-template.md`: конкретика, выбор, без выдуманных %; при отсутствии замера — «повторно не замерили». Кавычки «ёлочки»; висячие предлоги — NBSP.
