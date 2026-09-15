---
type: design_spec
status: draft
updated: 2026-09-15
focus: dashboard-summary
note: artifacts_dir оркестратора не передан — спека лежит в outputs среды 4; при наличии artifacts_dir скопировать туда.
---

# Design spec

## Scope

Затронута среда **04-prototype**: IA + HTML wireframe board сводного дашборда программы «А».

- Research: готов (`prd.md`, `research-digest.md`) — только вход.
- Content / Design System / Figma / код продукта — **не** в этом шаге.
- Внешние разделы А (Пользователи, Атаки, Шаблоны, Обучение, Отчёты, кабинет учащегося) — узлы-выходы, без перепроектирования.

## UX outcomes

Источник: `design/01-research/outputs/prd.md`, сжатие — `research-digest.md`.

- **Main job (J1):** одна актуальная картина «атаки + обучение» без Excel и без dual-mode.
- Ключевые сценарии: доклад/экспорт (J2/J7), назначение обучения с топа (J3/H4), Risk Score + обучение (J4), сравнение подразделений без порога «плохо» (J5), срезы HR (J8) и SOC (J9).
- Ограничения человека: первый экран = последняя кампания / актуальный срез (без 3–6–12); ФИО топа на сводке; дашборд ≠ Отчёты; нет dual-mode ИБ/руководство.

## Information architecture

`design/04-prototype/flows/dashboard-ia.md`

| Уровень | Узлы |
|--------|------|
| Primary | DASH-IB |
| Срезы | DASH-HR (обучение), DASH-SOC (уязвимые + частые инциденты) |
| Transient | DASH-EMPTY, DASH-LOADING, DASH-ASSIGN (sheet) |
| Drill | DRILL-ATTACK → EXT-ATTACKS; DRILL-USER → EXT-USERS; EXPORT (± EXT-REPORTS) |
| Внешние | EXT-USERS, EXT-ATTACKS, EXT-TEMPLATES, EXT-TRAINING, EXT-REPORTS; EXT-LEARNER вне графа |

## Content keys

Пока нет: `design/03-content/outputs/content-package.md` для дашборда не создавался. Следующий шаг — `designer-content` (лейблы Risk Score, CTA, empty, срезы, экспорт).

## Design system

Не задействована. Figma node-id = `pending`. Перед визуалом — `designer-ds` / контракт компонентов (Risk Score, топ-таблица, сравнение подразделений, sheet назначения, скелетон).

## Prototype

| Артефакт | Путь |
|----------|------|
| IA | `design/04-prototype/flows/dashboard-ia.md` |
| Wireframe board | `design/04-prototype/wireframes/dashboard-wireframes.html` |
| Стили доски | `design/04-prototype/wireframes/board.css` |
| Screen map | `design/04-prototype/screens/SCREEN-MAP.md` (status `wireframe`) |
| Build log | `design/04-prototype/outputs/build-log.md` |

Экраны на доске: **DB-IB**, **DB-HR**, **DB-SOC**, **DB-EMPTY**, **DB-LOAD**, **DB-ASSIGN**, **DB-ATTACK**. Подпись: структура, не визуал.

## Handoff to architecture

- Состояния: loading (скелетон), empty (нет кампаний / нет уязвимых / нулевое обучение), error+retry, PII denied на топе.
- Drill только во внешние разделы; sheet ASSIGN не заменяет раздел Обучение.
- Экспорт — one-shot с дашборда; Отчёты — отдельный маршрут (архив/schedule).
- Ролевой доступ к ФИО и срезам HR/SOC; кабинет учащегося не связан с дашбордом.
- Адаптив: desktop shell; мобильный таббар в IA не заложен.
- Параллельно уточнить A2 (PII), A3 (формула Risk Score), A4 («частые инциденты»).

## Open questions

Не блокируют каркасы; желательно закрыть до визуала/ролей:

1. Вход в HR/SOC: пункты shell по роли vs чипы на сводке?
2. Дефолт данных: строго «последняя кампания» vs org-срез (PRD §12.2)?
3. EXPORT: всегда файл или опция «в Отчёты»?
4. Тап по ФИО: сразу EXT-USERS или preview?
5. A4 / A2 — определение инцидентов и матрица PII.
