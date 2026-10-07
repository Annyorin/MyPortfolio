# Отчёт о тестировании: InnoDragon hscroll lightbox

## Новые / обновлённые тесты

### Модульные / статические
- ✅ `case.js exports initCasePage…` — `CASE_HSCROLL_DRAG_THRESHOLD_PX`, `watchCaseHscrollFit`, `isCaseHscrollScrollable`, `case-page__hscroll-expand`, `is-scrollable`, deferred `setPointerCapture`, gate `.case-page__hscroll.is-scrollable`
- ✅ `case.css covers Figma breakpoints…` — `position: relative` на `--scroll`, `.is-scrollable`, `.case-page__hscroll-expand`, zoomable cursor только при scrollable

## Регрессионные тесты

### Запущено: `node --test tests/test_portfolio_case_dragon.mjs`
### Прошло успешно: 7
### Упало: 0

## Проверка в браузере (localhost:5173, одна вкладка portfolio)

- ✅ Expand «Открыть экраны в просмотре» открывает lightbox (первый кадр)
- ✅ Клик по кадру в `.is-scrollable` ленте lightbox не открывает
- ✅ Одиночный `[data-case-zoomable]` вне hscroll по-прежнему открывает lightbox
- ✅ Горизонтальный scroll ленты без открытия lightbox
- ⚠️ Реальный mouse-drag через automation: synthetic `PointerEvent` в locked browser перехватывается (defaultPrevented); логика deferred capture покрыта кодом + статическими assert'ами

## Итог

✅ Тесты прошли  
✅ Регрессия по `test_portfolio_case_dragon.mjs` не обнаружена  
✅ Задача готова к ревью
