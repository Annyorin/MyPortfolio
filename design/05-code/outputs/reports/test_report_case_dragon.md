# Отчёт о тестировании задачи case-dragon

## Новые тесты

### End-to-end / scaffold
- ✅ `case-dragon.html links DS CSS, case.css, and case.js module` — PASSED
- ✅ `vite rollup input includes caseDragon entry` — PASSED
- ✅ `contentMap wires card.a.url and case.dragon keys` — PASSED
- ✅ `case.js exports initCasePage and binds segments/FAB helpers` — PASSED
- ✅ `case.css is page layout only (no token redefinition)` — PASSED

### Обновлённые регрессии под wiring карточки
- ✅ `TC-E2E-01 contentMap` — `card.a.url` = `case-dragon.html` — PASSED
- ✅ `TC-E2E-04 scene renderer` — cardA URL — PASSED
- ✅ `portfolio mobile width 360` — cardA URL вместо modal — PASSED

## Регрессионные тесты

### Запущено тестов: 163 (`npm test`)
### Прошло успешно: 158
### Упало: 5 (pre-existing, не из этой задачи)

## Упавшие тесты (вне scope case page)

### key box sizes / Chip modifiers (ds-showcase)
**Статус:** ❌ FAILED (pre-existing)
**Причина:** витрина DS уже содержит `<script>` / расхождения, не связанные с case page

### no tracked modifications under design/
**Статус:** ❌ FAILED (pre-existing workspace dirt)
**Причина:** в working tree уже есть неотслеживаемые файлы под `design/`

### portfolio entry getState / portfolio.css --color-
**Статус:** ❌ FAILED (pre-existing)
**Причина:** `main.js` / mobile CSS уже расходились с устаревшими assert'ами до этой задачи

## Детали выполнения

### Новый функционал
Страница `portfolio/case-dragon.html` собрана, contentMap + Vite entry подключены, карточка InnoDragon ведёт на кейс. Целевые тесты case/card wiring зелёные.

### Регрессия
Canvas `main.html` не менялся. Изменения в shared/content и layout только для card.a URL и case.* ключей.

## Итог

✅ Задача case-dragon выполнена
✅ Новые и обновлённые тесты по кейсу прошли
⚠️ Полный `npm test` имеет 5 pre-existing падений вне scope
