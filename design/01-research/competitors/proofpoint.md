---
type: competitor
env: 01-research
status: draft
updated: 2026-09-15
sources:
  - sources/competitors-sat-dashboard-raw.md
---

# Proofpoint Security Awareness

## Позиционирование
Enterprise SAT + phishing simulations с акцентом на CISO Dashboard, бенчмарки отрасли и связку с реальными атаками (TAP).

## Целевая аудитория
CISO / security leadership; security awareness teams; экспорт для совета директоров.

## Ключевые сценарии
| # | Сценарий | Насколько хорошо закрыт (1–5) | Источник |
|---|----------|-------------------------------|----------|
| 1 | Click / report rates (simulated + real) | 5 | CISO Dashboard |
| 2 | Very Attacked People / vulnerability vs real targeting | 5 | raw + TAP |
| 3 | Overdue training + export для совета | 4–5 | reporting page |
| 4 | Results API → BI/LMS | 4 | raw |

## Дашборд / отчёты
- **CISO Dashboard:** click / report rates для simulated + real attacks; benchmark по отрасли. → [Security Awareness Reporting](https://www.proofpoint.com/us/products/security-awareness-training/security-awareness-reporting)
- **Very Attacked People** / vulnerability vs real targeting (интеграция TAP).
- Export для совета; overdue training; Results API → BI/LMS.
- Phishing simulations как продуктовый блок. → [Phishing Simulations](https://www.proofpoint.com/us/products/security-awareness-training/phishing-simulations)

## Сильные стороны
- Executive-first дашборд (CISO) с бенчмарком.
- Связка симуляций с реальным targeting — сильнее «чистого» awareness.
- Экспорт и API под внешний BI / совет.

## Слабые места / жалобы пользователей
- В сырье меньше деталей про единый org Risk Score на первом экране vs KnowBe4/Hoxhunt (акцент на rates + people). *(наблюдение по публичным страницам в raw)*

## UX-паттерны, достойные внимания
1. Именованный **CISO Dashboard** как отдельный артефакт для руководства.
2. «Very Attacked People» как human-risk список, близкий к запросу SOC/топа уязвимых.
3. Отраслевой benchmark рядом с собственными click/report.

## Ценообразование (если применимо)
Не собрано в сырье.

## Источники
- `sources/competitors-sat-dashboard-raw.md` § Proofpoint
- https://www.proofpoint.com/us/products/security-awareness-training/security-awareness-reporting
- https://www.proofpoint.com/us/products/security-awareness-training/phishing-simulations
