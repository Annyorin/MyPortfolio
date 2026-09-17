---
type: competitor
env: 01-research
status: ready
updated: 2026-09-16
product: InnoDragon
sources: ["sources/innodragon-competitors-raw.md"]
---

# Qualys VMDR

## Позиционирование
Глобальный VMDR: обнаружение, приоритизация, ответ. Алерты — Responses: правило + действие.

## Целевая аудитория
Enterprise VM-команды; каналы запада: Email, Slack, PagerDuty — не Telegram.

## Ключевые сценарии
| # | Сценарий | Насколько хорошо закрыт (1–5) | Источник |
|---|----------|-------------------------------|----------|
| 1 | Правило по query + trigger (single / time-window) | 5 | Responses in VMDR |
| 2 | Действие = канал (Email / Slack / PagerDuty) | 5 | Creating a New Action |
| 3 | Одно дерево событий, скопированное на вкладки каналов | 1 | модель обратная: канал не дублирует каталог |

## Сильные стороны
Событие и канал разведены. Канал — action, его можно переиспользовать в правилах. Нет вкладки «Slack» с полным деревом CVE-типов.

## Слабые места
Конструктор правил тяжёлый для закрытого каталога из четырёх групп. Slack/PagerDuty, не Telegram. Для InnoDragon копировать визард целиком — оверкилл.

## UX-паттерны, достойные внимания
Разделение **что случилось** и **куда сказать**. Для InnoDragon свернуть до матрицы, не до конструктора.

## Источники
- https://docs.qualys.com/en/vm/latest/mergedProjects/create_rules_and_actions_from_responses_tab/responses/responses_in_vmdr.htm
- https://docs.qualys.com/en/vmdr/3.17.1.0/responses/creating_a_new_action_from_actions.htm
