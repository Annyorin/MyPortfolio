# Отчёт о тестировании: InnoPhish finals imgscroll

## Новые тесты

Нет новых файлов. Обновлены утверждения в `tests/test_portfolio_case_phish.mjs`: один маркер `[[imgscroll:case.phish.final_1,case.phish.final_1_2,case.phish.final_2]]`, отсутствие `[[img:case.phish.final_2]]`. Проверки файлов ассетов `final_2` без изменений.

## Регрессионные тесты

Команда: `node --test tests/test_portfolio_case_phish.mjs`

### Запущено тестов: 10
### Прошло успешно: 9
### Упало: 1 (вне scope этой задачи)

`contentMap wires card.a.url and case.phish keys` — PASSED.

## Упавшие тесты

### case-phish.html links DS CSS, case.css, case.js and data-case-id
**Статус:** ❌ FAILED (предсуществующий, не из этой правки)
**Ошибка:** `assert.match` на `/href=["']main\.html["']/`, в HTML сейчас `index.html`
**Причина:** задача не трогает `case-phish.html` и навигацию
**Исправление:** не делалось (вне scope)

## Итог

✅ Маркер finals и связанные assertions работают
⚠️ Один HTML-assert на `main.html` падает независимо от imgscroll
✅ Задача готова к ревью по content/imgscroll
