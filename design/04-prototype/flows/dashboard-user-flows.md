---
type: flow
env: 04-prototype
status: ready
updated: 2026-09-30
focus: dashboard-summary
source: flows/dashboard-ia.md + decision-chart-index-2026-09-30.md
---

# User flows — сводный дашборд «А»

FigJam: [UF-Portfolio · Phish](https://www.figma.com/board/apRL892T8oK9XfD7YvbCRe/UF-Portfolio?node-id=1-2).

## UF-1 · Доклад CISO (primary)

1. Shell → **DASH-IB** (актуальный срез).
2. Смотрит Risk Score + график индекса.
3. При необходимости в легенде **скрывает серию обучения** (чистая линия для руководства).
4. **Экспорт** → PDF / файл (опц. EXT-REPORTS).
5. Конец. Dual-mode нет.

## UF-2 · Разбор атак на графике

1. На **DASH-IB** наводит на **вертикаль** графика.
2. Открывается **TIP-VERT**: список атак, которые начались.
3. Клик по строке → **EXT-ATTACKS**.
4. Назад в продукт (внешняя навигация) → при желании снова DASH-IB.

## UF-3 · Назначить обучение с топа

1. **DASH-IB** → строка ФИО / CTA «Назначить».
2. **DASH-ASSIGN** (sheet): выбрать курс → подтвердить.
3. Sheet закрывается → DASH-IB + тост.
4. Опц. «Открыть в Обучении» → **EXT-TRAINING**.

## UF-4 · Срез HR

1. С DASH-IB или land по роли → **DASH-HR**.
2. Только статусы обучения → drill **EXT-TRAINING** / ASSIGN.
3. «К полной сводке» → DASH-IB (если роль ИБ).

## UF-5 · Срез SOC

1. → **DASH-SOC**.
2. Уязвимый → **EXT-USERS**; частый инцидент → **EXT-ATTACKS**.
3. CTA обучение → ASSIGN.

## UF-6 · Пустая сводка

1. **DASH-EMPTY** → CTA кампания (**EXT-ATTACKS**) или шаблоны (**EXT-TEMPLATES**).

## Не делаем

- Hover точки атаки с волнами обучения и когортой (TIP-A) — отказ 2026-09-30.
- Toggle «режим ИБ / руководство» на одной странице.
- Подмена сводки разделом Отчёты.
