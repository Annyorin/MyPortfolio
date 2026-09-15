---
type: competitor
env: 01-research
status: draft
updated: 2026-09-15
sources:
  - sources/competitors-sat-dashboard-raw.md
  - sources/interview-ib-specialists.md
---

# Gophish / EvilGo Phish (косвенный)

## Позиционирование
Инструмент симуляции фишинга (open-source Gophish; в интервью — EvilGo Phish): кампания → результаты, **без** org-dashboard и связки с LMS.

## Целевая аудитория
ИБ / red team / awareness-практики, которым нужна симуляция, а сводку собирают вручную.

## Ключевые сценарии
| # | Сценарий | Насколько хорошо закрыт (1–5) | Источник |
|---|----------|-------------------------------|----------|
| 1 | Кампания: open / click / submit / timeline / CSV | 4 | Gophish docs |
| 2 | Org Risk Score + обучение на одном экране | 1 | raw: нет |
| 3 | Доклад руководству из продукта | 1 | интервью: Word/PDF вручную |

## Дашборд / отчёты
- Кампания → results: open / click / submit / timeline / CSV. **Нет** org Risk Score и связки с LMS. → [Gophish campaigns docs](https://docs.getgophish.com/user-guide/documentation/campaigns.md)
- Интервью: использовали EvilGo Phish; сводку готовили вручную (Word/PDF/Excel); пример «60% перешли по ссылке» + были курсы отдельно. → `sources/interview-ib-specialists.md`

## Сильные стороны
- Прозрачные метрики атаки на уровне кампании (open/click/submit).
- Низкий порог для запуска симуляций.

## Слабые места / жалобы пользователей
- Нет сводной org-аналитики и связки с обучением → ручной Excel/Word workflow (подтверждено интервью).
- Нет топа уязвимых / подразделений / Risk Score как продукта.

## UX-паттерны, достойные внимания
1. Кампанийный results-экран (timeline + CSV) — эталон **детализации атаки**, не сводки.
2. Антипаттерн для «А»: остановиться на campaign results без org-dashboard.

## Ценообразование (если применимо)
Gophish — open source; EvilGo — вне сырья.

## Источники
- `sources/competitors-sat-dashboard-raw.md` § Gophish
- `sources/interview-ib-specialists.md` (EvilGo Phish, ручная сводка)
- https://docs.getgophish.com/user-guide/documentation/campaigns.md
