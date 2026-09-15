---
type: notes
env: 04-prototype
updated: 2026-09-15
---

# Рабочие заметки

Прогресс длинных задач этой среды. Читается и дополняется только внутри среды.

## Активная задача
Сводный дашборд программы «А»: IA + HTML wireframe boards mobile + desktop (без Figma, без DS-сборки).

Сделано 2026-09-15:
- `flows/dashboard-ia.md` — граф primary ИБ / HR / SOC / empty / loading / ASSIGN / внешние узлы
- `wireframes/dashboard-wireframes.html` + `board.css` — 7 mobile каркасов (264×540)
- `wireframes/dashboard-wireframes-desktop.html` + `board-desktop.css` — 7 desktop каркасов (~1040×680): shell слева, колонки, modal ASSIGN, split-hint ATTACK
- обновлены `screens/SCREEN-MAP.md`, `outputs/build-log.md`

Следующий шаг (координатор / designer): design_spec → content/DS → Figma-сборка; не трогать dual-mode и 3–6–12 на первом экране.

## Открытые вопросы
- Вход в срезы HR/SOC: shell по роли vs чипы на сводке?
- Дефолт данных: последняя кампания vs org-срез
- EXPORT → всегда файл или опция в Отчёты?
- Тап по ФИО: сразу EXT-USERS или preview?
- Определение «частые инциденты» (A4); матрица PII ФИО (A2)

## Решения (дашборд, из PRD / человека)
- Первый экран = последняя кампания / актуальный срез; без 3–6–12
- Нет порога «плохо» по подразделениям
- HR = обучение; SOC = уязвимые + частые инциденты
- ФИО топа на сводке; нет dual-mode; дашборд ≠ Отчёты

## Решения (портфолио, архив)
- Эталон продукта = `41:1416` (1024×609); витрина DS = `41:11646` (reference).
- Comp/Stiker — bbox сцены, не atomic витрины (Stiker на сцене ~87×63 vs 81×32).
- Три Card = один демо InnoDragon из content-package.
- Canvas: zoom 25–400%, Tapper world; pan clamp AABB+1×viewport; contacts без URL; focus-visible.
- Storybook inventory coverage only — код вне design/.
