---
type: source
env: 01-research
updated: 2026-09-15
reliability: medium-high
---

# Конкуренты SAT / phishing simulation — сырьё (фокус: дашборд)

Собрано 2026-09-15. Факты только из публичных страниц/обзоров. Не оценка «нашего» продукта.

## Прямые (фишинг-симуляции + обучение + аналитика)

### KnowBe4
- https://www.knowbe4.com/products/security-awareness-training
- https://www.knowbe4.com/advanced-reporting
- https://support.knowbe4.com/hc/en-us/articles/204218028-Dashboard-Overview
- https://support.knowbe4.com/hc/en-us/articles/360007952894-Reporting-Guide
- https://support.knowbe4.com/hc/en-us/articles/14636398798355-Executive-Reports-Overview

Дашборд:
- Organization Risk Score (тренд ~6 мес.), Phish-prone Percentage, виджеты phishing / training / Phish Alert Button.
- Advanced Reporting: 60+ отчётов; Group Report Card = Risk Score + PPP + failure types + training status.
- Executive Reports: шаблоны Security Admin / CISO / Team Manager → PDF, schedule.
- Связка training ↔ phishing в отчётах (PPP by training time и т.п.).

### Proofpoint Security Awareness / CISO Dashboard
- https://www.proofpoint.com/us/products/security-awareness-training/security-awareness-reporting
- https://www.proofpoint.com/us/products/security-awareness-training/phishing-simulations

Дашборд:
- CISO Dashboard: click / report rates для simulated + real attacks; benchmark по отрасли.
- Very Attacked People / vulnerability vs real targeting (интеграция TAP).
- Export для совета; overdue training; Results API → BI/LMS.

### Phishman (РФ, реестр ПО)
- https://www.anti-malware.ru/reviews/Phishman-2-35

Дашборд:
- Главная: обученность, иммунность, киберосознанность (~год по умолчанию).
- **Нельзя** переставлять виджеты и менять период на главной (слабость в обзоре).
- Уровень риска = агрегат + рекомендации по метрикам; кривая забывания.
- По атаке: коэффициент уязвимости, перешли / вложение / форма.
- Отчёты: системные + пользовательские из Обучение / Атаки / Отчёты.
- IA разделов близка к «А»: обучение, атаки, отчёты.

### Антифишинг (РФ)
- https://www.anti-malware.ru/reviews/antiphish

Дашборд:
- Панель: знания/навыки; рейтинг сотрудникам / подразделениям / орг.
- С дашборда — отправить на обучение / проверить навыки.
- История действий: графики атак vs подмножество сотрудников.
- Главный отчёт + отчёт по обучению; Syslog → SIEM.
- Планировщик отчётов и действий.

### Kaspersky ASAP
- https://www.k-asap.com/ru
- https://support.kaspersky.com/ASAP/1.0/ru-RU/205085.htm

- Курсы + автоматические учебные фишинговые атаки + отдельные кампании проверки.
- Библиотека шаблонов; результаты → корректировка обучения.
- Публично меньше деталей про единый risk-index dashboard (уточнять при глубоком разборе).

### EALP (РФ)
- https://e-alp.ru/capabilities

- Курсы, SCORM, фишинг (1–2 этапа), аналитика для ИБ / HR / админов обучения.
- Параллельные типы назначений (курс, инструктаж, миссия).

### Solar Security Awareness (РФ)
- https://rt-solar.ru/services/sa/
- https://rt-solar.ru/services/sa/on-premise/

- Курсы + учебный фишинг + модуль аналитики/отчётов; AD/SSO; cloud / on-prem.
- Экспертные отчёты для руководства о киберзащищённости персонала.

### Hoxhunt
- https://hoxhunt.com/
- https://hoxhunt.com/feature/human-risk-dashboard

- Human Risk Dashboard / Security Score; reporting time; click vs report динамика.
- Непрерывные симуляции + микрообучение; gamification.

## Косвенные / заменители

### Gophish (+ Evilginx / EvilGo Phish в интервью)
- https://docs.getgophish.com/user-guide/documentation/campaigns.md
- Кампания → results: open / click / submit / timeline / CSV. **Нет** org Risk Score и связки с LMS.
- Интервью: использовали EvilGo Phish; сводку готовили вручную (Word/PDF/Excel).

### Корпоративный LMS (iSpring, WebTutor, Moodle и т.п.)
- https://www.adaptivesecurity.com/blog/cybersecurity-awareness-training-platform-vs-lms
- Completion / quiz; нет behavioral telemetry (click, report, fail→remediate loop).
- HR-ориентированная отчётность ≠ CISO risk picture.

### Excel / Word / PDF (текущий workflow из интервью)
- Оба респондента: сводку часто забирают в Excel / Word→PDF, не живут в платформе.
- Решение после цифр: доклад руководству, назначить курсы, оценить эффективность обучения.

### Cofense / email security reporting (смежный)
- Фокус на реальном фишинге и SOC; обучение вторично vs полный SAT.
- Из интервью: SOC хочет список кампаний + уязвимых сотрудников.

## Паттерны дашбордов (сводка сырья)

1. Единый индекс риска (Risk Score / уровень риска / Security Score) + тренд.
2. Блок атак: open / click / submit / report (+ attachment / macro) за кампанию и в динамике.
3. Блок обучения: completion, in progress, overdue / не закончили.
4. Топ уязвимых людей / групп; сравнение подразделений или типов атак.
5. Drill-down и экспорт (PDF, schedule) — потому что CISO/CTO часто не «живут» в консоли.
6. Связка «провалил атаку → обучение → повтор» — у лидеров есть; у Gophish/Excel — нет.
7. Отдельные аудитории: ИБ vs HR vs SOC (разный срез, не обязательно два режима на одной странице).
