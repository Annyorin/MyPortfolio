---
type: copy
env: 03-content
entity: case-dragon
status: ready
updated: 2026-10-06
source: Figma xboMnqU5JURL0xlzxN7edN node 530:15457 + research-digest-innodragon.md
---

# Кейс: настройки уведомлений InnoDragon

Слой A — факты, на сайт не копировать. Слой B — ключи `shared/content.js` (канон Figma, скелет как InnoPhish).

---

## Карточка на главной

| Ключ | Текст |
|------|-------|
| `card.b.title` | InnoDragon |
| `card.b.meta` | · 2024-2026 |
| `card.b.description` | Система управления безопасностью. Позволяет организациям эффективно защищать свои сети и активы в реальном времени. |

---

## Слой B — страница (Figma 530:15457)

### Навигация

Контекст → Исследование → Проектирование → UX-тест → Финальные макеты → Результаты (`nav_conclusions`). Без `#hypotheses`.

### Мета

| Ключ | Текст |
|------|-------|
| `case.dragon.period_value` | 2024–2026 год |
| `case.dragon.platforms_value` | Desktop |
| `case.dragon.role_value` | UX/UI дизайнер: Discovery и ux-исследование для настроек, макеты интерфейса. |
| `case.dragon.team_value` | 4 фронтендера, 4 бэкендера, дизайнер, проджект-менеджер, стейкхолдеры — CISO и Директор ИБ. |

### Продукт (`context_title` / `context_body`)

`context_title` = Продукт. Система управления безопасностью: целостная картина киберрисков, связи активов / уязвимостей / инцидентов, быстрые решения.

### Контекст задачи (`intro_title` / `intro_body`)

`intro_title` = Контекст задачи. Два абзаца (цена ошибки + уведомления 10 мин) → ## Как сейчас + `[[img:case.dragon.as_is]]` + проблемы 1–4 → ## Цель / ## Аудитория / ## Проблема для пользователей / ## Проблема для бизнеса / ## Критерии успеха (10 мин→2 мин; одно сохранение; обратная связь).

### Исследование (`analysis_body`, long-only)

Вступление → ==таблица фич== → ## Конкуренты (MaxPatrol… Rapid7; Monday/Weeek; антипаттерн KSC) + `[[img:case.dragon.competitors]]` → ==требования== → ==Провёла интервью== → ## Результаты интервью (3 чел., 9 пунктов) → ## JTBD + `[[jtbd:case.dragon.jtbd]]` (9 рядов) → ## Ценности (4) → ## Гипотезы (1–7).

### Проектирование (`design_body`, long-only)

## IA + `[[img:case.dragon.ia]]` → ## User Flow + `[[img:case.dragon.flow]]`.

### UX-тест (`ux_test_body`)

Цель теста; ==Что было.== / ==Чего не было.==; сценарий Telegram; варианты кнопка / toggle; выводы 0,6 vs 0,7 сек; 1,3 vs 2 мин; 8 справились / 1 с трудностями.

### Финальные макеты (`finals_body`)

Первый вариант в прод; `final_1` / `final_2`; ## Синк с разработкой / ## Дизайн-ревью.

### Результат (`conclusions_title` / `conclusions_body`)

`conclusions_title` = Результат и ограничения. Markers: Что сделала (3,5 мин → 45 сек) / Чему научило / Что не измеряла / Что дальше / Что сделала бы иначе.

### Ассеты

`case.dragon.hero`, `as_is`, `competitors`, `ia`, `flow`, `test_btn`, `test_toggle`, `final_1`, `final_2` → `ds-showcase/assets/images/case-dragon-*.png`.

---

## Короткая vs длинная

| Режим | Что на странице |
|-------|-----------------|
| Short | Мета + продукт + контекст + UX-тест + финалы + результат |
| Long | То же + исследование + проектирование |

---

## Дыры

| Где | Чего не хватает |
| --- | --- |
| Lightbox full | Отдельных `-full` для Dragon нет — lightbox использует тот же path |
| JTBD в Figma | В макете ещё Phish-тексты; на сайте — 9 Dragon-рядов из постановки |
