---
type: competitor
env: 01-research
status: ready
updated: 2026-09-16
product: InnoDragon
sources: ["sources/innodragon-competitors-raw.md"]
---

# Rapid7 InsightVM

## Позиционирование
VM + automation. Нативные Notifications: trigger по активу/уязвимости → email или SMS. Slack — отдельный продукт InsightConnect.

## Целевая аудитория
Security team, которой нужны мгновенные апдейты по изменениям активов и уязвимостей.

## Ключевые сценарии
| # | Сценарий | Насколько хорошо закрыт (1–5) | Источник |
|---|----------|-------------------------------|----------|
| 1 | Визард: тип триггера → query → канал email/SMS | 5 | docs.rapid7.com/insightvm/notifications |
| 2 | Алерты скана SMTP/SNMP/Syslog | 4 | setting-up-scan-alerts |
| 3 | Slack на high-risk vuln | 3 | InsightConnect workflow, не тот же экран |
| 4 | Повторить дерево событий на вкладке Slack | 1 | канал выбирается в конце визарда |

## Сильные стороны
Сначала **что** (trigger + query), потом **куда**. Получатель может отписаться из письма — отдельный слой, не путать с админской политикой.

## Слабые места
Мессенджер вынесен в другую систему. Для РФ-Telegram это тот же риск, что KUMA-скрипт: канал «не из коробки».

## UX-паттерны, достойные внимания
Не начинать IA с вкладки канала. Query как фильтр шума. Не тащить InsightConnect в v1 InnoDragon.

## Источники
- https://docs.rapid7.com/insightvm/notifications/
- https://docs.rapid7.com/insightvm/setting-up-scan-alerts/
- https://extensions.rapid7.com/extension/Alert_on_New_High_Risk_Vulnerability_in_InsightVM_with_Slack
