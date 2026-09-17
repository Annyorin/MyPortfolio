---
type: source
env: 01-research
status: ready
updated: 2026-09-16
product: InnoDragon
---

# Сырьё конкурентов InnoDragon (уведомления + VM)

Факты со ссылками. Интерпретация — в `competitors/innodragon/`.

## InnoDragon (публичное)

- https://hightech.fm/2024/11/26/inno-dragon — анонс 26.11.2024, Университет Иннополис; сканирование портов, веб-приложений, сайтов; отчёты; карта топологии; группировка активов, ответственные, доступ.
- Цитата М. Серёгина (тот же материал): изменения инфраструктуры не всегда сообщают ИБ; нужна картина в одном приложении и тест по широкой базе уязвимостей.
- https://www.ferra.ru/news/techlife/v-rossii-razrabotano-po-dlya-poiska-uyazvimosti-v-sistemakh-kompanii-26-11-2024.htm — пароли в файлах; отслеживание подключений/отключений сервисов.
- https://keep-intouch.ru/kit-news/2024/12/news_2024-12-05_21_universitete-innopolis-sozdali-platformu-innodragon-dlya-poiska.htm — у отдельных компонентов есть конкуренты; эффективность за счёт объединения ИБ-направлений.

## РФ

- MaxPatrol VM: https://help.ptsecurity.com/ru-RU/projects/vm/2.8/help/2204533771 — цикл: инвентаризация → классификация активов → выявление и приоритизация → устранение → проверка.
- MaxPatrol обзор: https://habr.com/ru/companies/tssolution/articles/791004/
- R-Vision VM: https://rvision.ru/products/vm — встроенный сканер + процесс VM; White/Black Box, Compliance; агент и безагент; интеграции CMDB/Service Desk.
- Security Vision VM: https://www.securityvision.ru/products/vm/ — сканер + дедуп из внешних сканеров + заявки SLA.
- Security Vision NG VM: https://www.securityvision.ru/blog/vozmozhnosti-novoy-versii-produkta-upravlenie-uyazvimostyami-vm-na-platforme-security-vision-5/ — уведомления ответственному при дедлайне, эскалация руководителю; каналы: почта, SIEM, мессенджеры.
- Kaspersky Security Center 15.1 delivery: https://support.kaspersky.com/ksc/15.1/en-US/180968.htm — вкладки Email / SMS / executable; настройки доставки применяются ко всем событиям; override в Event configuration.
- KUMA email rules: https://support.kaspersky.com/kuma/4.2/233518
- KUMA Telegram: https://support.kaspersky.com/kuma/4.6/258846 — бот + скрипт на корреляторе + response rule Run script. Не из коробки как чекбокс.
- Kaspersky MDR notifications: https://support.kaspersky.com/mdr/en-US/255153.htm — на одном экране Notify via email и Notify via Telegram; пересекающиеся типы (Incidents / Comments / Responses).

## Зарубежные

- Qualys VMDR Responses: https://docs.qualys.com/en/vm/latest/mergedProjects/create_rules_and_actions_from_responses_tab/responses/responses_in_vmdr.htm — rule query + trigger; notify Email or Slack.
- Qualys Actions: https://docs.qualys.com/en/vmdr/3.17.1.0/responses/creating_a_new_action_from_actions.htm — Send Email / Post to Slack / PagerDuty как **действия**, не копия дерева событий.
- Tenable scan notifications: https://docs.tenable.com/vulnerability-management/Content/Scans/configure-email-and-text-notifications-for-a-scan.htm — email + SMS на завершение скана; Result Filters.
- Rapid7 InsightVM Notifications: https://docs.rapid7.com/insightvm/notifications/ — Automation: trigger asset/vuln → email или SMS. Slack — через InsightConnect, не в том же визарде.
- Rapid7 scan alerts: https://docs.rapid7.com/insightvm/setting-up-scan-alerts/ — SMTP / SNMP / Syslog на сайте скана.
- GitHub notifications (UX-аналог, не конкурент VM): https://docs.github.com/en/subscriptions-and-notifications/get-started/configuring-notifications — событие отдельно, канал (web/email/mobile) выбирается настройкой; не вкладки с копией всего дерева, но и не единый мастер-чекбокс на все каналы.
