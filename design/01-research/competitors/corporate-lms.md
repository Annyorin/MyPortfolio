---
type: competitor
env: 01-research
status: draft
updated: 2026-09-15
sources:
  - sources/competitors-sat-dashboard-raw.md
---

# Корпоративный LMS (косвенный заменитель)

## Позиционирование
Корпоративные LMS (iSpring, WebTutor, Moodle и аналоги) закрывают назначение и completion обучения, но **без** behavioral telemetry фишинга (click/report/fail→remediate).

## Целевая аудитория
HR / L&D; отчётность по обучению, не CISO risk picture.

## Ключевые сценарии
| # | Сценарий | Насколько хорошо закрыт (1–5) | Источник |
|---|----------|-------------------------------|----------|
| 1 | Completion / quiz по курсам | 5 | Adaptive Security blog (raw) |
| 2 | Behavioral metrics атак | 1 | raw: нет |
| 3 | Картина риска для CISO | 1–2 | raw: HR-отчётность ≠ CISO |

## Дашборд / отчёты
- Completion / quiz; нет behavioral telemetry (click, report, fail→remediate loop).
- HR-ориентированная отчётность ≠ CISO risk picture.
- → [SAT platform vs LMS](https://www.adaptivesecurity.com/blog/cybersecurity-awareness-training-platform-vs-lms) (через raw)

## Сильные стороны
- Зрелые отчёты completion / overdue для HR — референс **среза обучения**.
- Привычный HR-workflow назначений.

## Слабые места / жалобы пользователей
- Нет связки атака↔обучение и Risk Score — не закрывает job ИБ/CISO из интервью.
- Подмена SAT LMS-ом оставляет ручную склейку с Gophish/Excel (как в as-is интервью).

## UX-паттерны, достойные внимания
1. Чистый learning dashboard (in progress / completed / overdue) — паттерн для HR-среза «А».
2. Антипаттерн: строить «дашборд программы ИБ» только из LMS-метрик.

## Ценообразование (если применимо)
Различается по вендорам; не собрано.

## Источники
- `sources/competitors-sat-dashboard-raw.md` § Корпоративный LMS
- https://www.adaptivesecurity.com/blog/cybersecurity-awareness-training-platform-vs-lms
