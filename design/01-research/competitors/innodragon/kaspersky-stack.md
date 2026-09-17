---
type: competitor
env: 01-research
status: ready
updated: 2026-09-16
product: InnoDragon
sources: ["sources/innodragon-competitors-raw.md"]
---

# Kaspersky: Security Center, KUMA, MDR

Партнёрский стек InnoDragon (KATA, KUMA, CyberTrace) и ближайшие паттерны уведомлений.

## Позиционирование
KSC — консоль защиты конечных точек и событий. KUMA — SIEM. MDR — управляемое обнаружение; почта и Telegram как подписка.

## Целевая аудитория
Админы KSC; аналитики KUMA; подписчики MDR (ИБ без своей корреляции).

## Ключевые сценарии
| # | Сценарий | Насколько хорошо закрыт (1–5) | Источник |
|---|----------|-------------------------------|----------|
| 1 | Доставка «всем событиям» через Email/SMS | 3 | KSC 15.1: вкладки Email / SMS / executable |
| 2 | Override на тип события | 4 | Event configuration в KSC |
| 3 | Telegram из SIEM | 2 | KUMA 4.6: скрипт + response rule, не чекбокс |
| 4 | Почта и Telegram на одном экране подписки | 5 | MDR: Notify via email + Notify via Telegram |

## Сильные стороны
MDR: каналы рядом, типы событий чекбоксами, без вкладки «сначала канал, потом всё дерево заново». Telegram — ожидаемый канал в РФ.

## Слабые места
KSC: вкладки метода доставки; «сохранённые настройки доставки применяются ко всем событиям» — легко получить одинаковый спам. KUMA Telegram — инженерия, не настройка аналитика.

## UX-паттерны, достойные внимания
**Брать:** экран MDR (каналы + типы на одной форме).
**Не брать:** вкладки Email/SMS KSC как IA настроек — это текущая боль InnoDragon.

## Источники
- https://support.kaspersky.com/ksc/15.1/en-US/180968.htm
- https://support.kaspersky.com/kuma/4.6/258846
- https://support.kaspersky.com/mdr/en-US/255153.htm
