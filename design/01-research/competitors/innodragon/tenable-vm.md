---
type: competitor
env: 01-research
status: ready
updated: 2026-09-16
product: InnoDragon
sources: ["sources/innodragon-competitors-raw.md"]
---

# Tenable Vulnerability Management

## Позиционирование
Сканирование и VM. Уведомления в публичной доке — в основном на **завершение скана**, не матрица типов событий продукта.

## Целевая аудитория
Scan Operator / Standard / Scan Manager / Administrator.

## Ключевые сценарии
| # | Сценарий | Насколько хорошо закрыт (1–5) | Источник |
|---|----------|-------------------------------|----------|
| 1 | Email при завершении скана | 4 | Tenable docs: Email Recipient(s) |
| 2 | SMS при завершении скана | 3 | SMS Recipients |
| 3 | Фильтр, какие результаты триггерят письмо | 4 | Result Filters |
| 4 | Telegram / системные + почта как одно дерево | ❌ | не заявлено |

## Сильные стороны
Каналы рядом на Basic tab скана (email и SMS в одном месте). Фильтр результатов — аналог «не всё подряд».

## Слабые места
Это нотификация **джоба скана**, не политика по уязвимостям / активам / технологиям / инцидентам. Нет мастер-чекбокса групп событий продукта.

## UX-паттерны, достойные внимания
Не прятать второй канал на другую вкладку, если полей мало. Не раздувать до единственной модели InnoDragon.

## Источники
- https://docs.tenable.com/vulnerability-management/Content/Scans/configure-email-and-text-notifications-for-a-scan.htm
