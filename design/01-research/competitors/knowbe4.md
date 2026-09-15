---
type: competitor
env: 01-research
status: draft
updated: 2026-09-15
sources:
  - sources/competitors-sat-dashboard-raw.md
---

# KnowBe4

## Позиционирование
Глобальная SAT-платформа: Security Awareness Training + phishing simulation + advanced/executive reporting для ИБ и менеджмента.

## Целевая аудитория
Security awareness admins, CISO / security leadership, team managers (шаблоны Executive Reports).

## Ключевые сценарии
| # | Сценарий | Насколько хорошо закрыт (1–5) | Источник |
|---|----------|-------------------------------|----------|
| 1 | Org Risk Score + тренд на дашборде | 5 | raw → KnowBe4 Dashboard Overview |
| 2 | Phishing + training виджеты на одном экране | 5 | raw |
| 3 | Executive PDF / schedule для руководства | 5 | Executive Reports Overview |
| 4 | Связка training ↔ phishing в отчётах | 4–5 | PPP by training time и т.п. |

## Дашборд / отчёты
- **Dashboard:** Organization Risk Score (тренд ~6 мес.), Phish-prone Percentage, виджеты phishing / training / Phish Alert Button. → [Dashboard Overview](https://support.knowbe4.com/hc/en-us/articles/204218028-Dashboard-Overview)
- **Advanced Reporting:** 60+ отчётов; Group Report Card = Risk Score + PPP + failure types + training status. → [Reporting Guide](https://support.knowbe4.com/hc/en-us/articles/360007952894-Reporting-Guide)
- **Executive Reports:** шаблоны Security Admin / CISO / Team Manager → PDF, schedule. → [Executive Reports](https://support.knowbe4.com/hc/en-us/articles/14636398798355-Executive-Reports-Overview)
- Связка training ↔ phishing в отчётах (PPP by training time и др.).

## Сильные стороны
- Единый Risk Score + долгосрочный тренд на первом экране.
- Зрелый экспорт/schedule под зрителей, которые не живут в консоли.
- Явная связка обучения и phishing-метрик в reporting.

## Слабые места / жалобы пользователей
- Публичное сырьё не содержит негативных UX-отзывов; глубина кастомизации дашборда vs отчётов не разобрана. *(пробел источников, не факт слабости)*

## UX-паттерны, достойные внимания
1. Risk Score + Phish-prone % как «якоря» первого экрана.
2. Разделение: операционный Dashboard vs Executive Reports (не два режима на одной странице).
3. Group Report Card как единый срез risk + training status.

## Ценообразование (если применимо)
Не собрано в `sources/competitors-sat-dashboard-raw.md`.

## Источники
- `sources/competitors-sat-dashboard-raw.md` § KnowBe4
- https://www.knowbe4.com/products/security-awareness-training
- https://www.knowbe4.com/advanced-reporting
- https://support.knowbe4.com/hc/en-us/articles/204218028-Dashboard-Overview
- https://support.knowbe4.com/hc/en-us/articles/360007952894-Reporting-Guide
- https://support.knowbe4.com/hc/en-us/articles/14636398798355-Executive-Reports-Overview
