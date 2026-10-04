# Отчёт о тестировании: sidebar без «Контакты»

## Изменение

Из `nav#case-side-nav` убран пункт `a[data-case-nav="contacts"]` («Контакты») в обоих кейсах. Секция `#contacts` на странице сохранена.

## Новые тесты

Не добавлялись (существующие проверки не требовали пункта меню; секция `#contacts` по-прежнему ожидается).

## Регрессионные тесты

### Запущено: `node --test tests/test_portfolio_case_phish.mjs tests/test_portfolio_case_dragon.mjs`

| Сьют | Результат |
|------|-----------|
| portfolio case-phish page | 6/6 PASSED |
| portfolio case-dragon page | 5/6 PASSED, 1 FAILED (нерелевантно) |

### Упавшие тесты (не из этой задачи)

#### contentMap wires card.a.url and case.dragon keys
**Статус:** ❌ FAILED (pre-existing / out of scope)
**Ошибка:** `assert.match(analysis_body, /среднее время/)` — в текущем `case.dragon` тексте фразы нет
**Связь с задачей:** нет; HTML sidebar contacts не проверяется этим тестом

## Smoke превью

Vite: `http://localhost:5173/` (local-preview: HTTP 200).

Файловая проверка (источник страниц):
- `portfolio/case-phish.html` — нет `data-case-nav="contacts"`, секция `#contacts` есть
- `portfolio/case-dragon.html` — нет `data-case-nav="contacts"`, секция `#contacts` есть

## Итог

✅ Цель задачи закрыта (nav item убран)
✅ Тесты кейса phish зелёные
⚠️ Один dragon contentMap-тест падает по несвязанной причине (контент, не меню)
