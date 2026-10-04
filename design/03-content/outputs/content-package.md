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
| case.dragon.intro_body | Цель: политика за один заход + сигнал о подтверждённом инциденте. Аудитория SOC/VM/админ/руководство. Критерии: группа, каналы рядом, одно Save, прод; секунды не сняты. | — | Вводные | digest + interview SOC + SLA 3→30 |
| case.dragon.context_body | Модалка-вкладки; тройной проклик; шум → пропуск critical. Не конструктор Qualys. | — | Контекст (длинная) | owner + interview |
| case.dragon.analysis_title | Исследование | — | Заголовок секции (длинная) | шаблон |
| case.dragon.analysis_body | SOC/NIST (Detect→Respond→Recover, alert≠инцидент); бенчмарки; IA/flow/вайрфреймы; n=10 + интервью; антипаттерны. | — | Исследование, длинная | digest + interview + wireframes |
| case.dragon.hypotheses_body | Чекбокс на вкладках недостаточен → матрица событие×канал; Connect отдельно; n=10; не Qualys. | — | Гипотезы, короткая | owner + рынок |
| case.dragon.hypotheses_body_long | Компромисс вкладок в проде; target wireframes; приоритет подтверждения инцидента; не «скопировать с Почты». | — | Гипотезы, длинная | UI 09-28 + interview |
| case.dragon.conclusions_body | Прод; секунды не сняты; провал — чекбокс при вкладках; дальше — роли и подтверждение инцидента, не пресет Critical→TG для всех. | — | Выводы | owner + interview |
| case.dragon.source_file | design/03-content/copy/case-dragon.md | — | Полный текст кейса (A + B) | — |
| card.b.title | InnoPhish | — | Заголовок Card кейса (дашборд) | owner 2026-09-15; research-digest |
| card.b.meta | · 2024–2026 | — | Мета Card кейса | owner 2026-09-15 (как card.b / период) |
| card.b.description | Программа для повышения осведомлённости сотрудников в области ИБ и укрепления их устойчивости к кибератакам, основанным на социальной инженерии. | — | Описание Card (4 строки, переносы в content.js) | Figma Card + owner |
| case.phish.role_value | UX/UI дизайнер: Discovery и ux-исследование для дашборда, макеты интерфейса. | — | Мета: роль | Figma 509:18872 |
| case.phish.team_value | 4 фронтендера, 4 бэкендера, дизайнер, проджект-менеджер, стейкхолдеры — CISO и Директор ИБ | — | Мета: команда | Figma 509:18872 |
| case.phish.context_title | Продукт | — | Fill-блок после hero | Figma 509:18872 |
| case.phish.context_body | Описание программы + рассылки / аналитика / курсы / отчётность. | — | Fill-блок «Продукт» | Figma 509:18872 |
| case.phish.intro_title | Контекст задачи | — | Заголовок контекста | Figma 509:18872 |
| case.phish.intro_body | Excel/Word → задача сводки; ## Цель / Аудитория / Проблемы / Критерии. | — | Контекст + вводные блоки | Figma 509:18872 |
| case.phish.analysis_title | Исследование | — | Заголовок секции (длинная) | Figma 509:18872 |
| case.phish.analysis_body | Бенчмарки → требования → интервью → вопросы → JTBD → триггеры → ценности → гипотезы. | — | Секция «Исследование», длинная | Figma + digest |
| case.phish.design_title | Проектирование | — | Нав + секция (длинная) | Figma 509:18872 |
| case.phish.design_body | IA / бизнес-схема / User Flow + img markers. | — | Проектирование | Figma + draft |
| case.phish.ux_test_title | UX-тест | — | Нав + секция | Figma 509:18872 |
| case.phish.ux_test_body | 2 vs 3 вкладки; n=8; картинки вариантов; 3,4 мин → 45 сек. | — | UX-тест | Figma 509:18872 |
| case.phish.finals_title | Финальные макеты | — | Нав + секция | Figma 509:18872 |
| case.phish.finals_body | Изменения + финальные кадры + синк + ревью. | — | Финальные макеты | Figma 509:18872 |
| case.phish.conclusions_title | Результат и ограничения | — | Заголовок секции | Figma 509:18872 |
| case.phish.nav_conclusions | Результаты | — | Подпись sidenav | Figma menu |
| case.phish.conclusions_body | Что сделала / научило / не измеряла / дальше / иначе. | — | Результат | Figma 509:18872 |
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
| card.b.image / case.phish.hero | images/phish.png | Hero дашборда InnoPhish (Figma 509:18898 @2×) |
| case.phish.ia | images/case-phish-ia.png | IA diagram |
| case.phish.business | images/case-phish-business.png | Бизнес-схема |
| case.phish.flow | images/case-phish-flow.png | User Flow |
| case.phish.test_2tabs | images/case-phish-test-2tabs.png | UX-тест, 2 вкладки |
| case.phish.test_3tabs | images/case-phish-test-3tabs.png | UX-тест, 3 вкладки |
| case.phish.final_1 | images/case-phish-final-1.png | Финальные макеты, блок 1 |
| case.phish.final_2 | images/case-phish-final-2.png | Финальные макеты, блок 2 |
| img_bg | — | Экспорт из Figma Ui kit: IMG_BG |
| img_1 | — | Экспорт из Figma Ui kit: IMG_1 |
| img_2 | — | Экспорт из Figma Ui kit: IMG_2 |
| img_3 | — | Экспорт из Figma Ui kit: IMG_3 |
| comp | — | Экспорт из Figma Ui kit: Comp (коллаж) |

## Tone of voice — краткая выжимка
Демо UI — как в макете, без маркетинговой переписки. Кейс InnoPhish — слой B по макету Figma `509:18872` и `strategy/case-writing-template.md`. Заголовок JTBD на сайте оставлен как в макете. Без выдуманных % вне макета/исследования. Кавычки «ёлочки»; висячие предлоги — NBSP.
