# Отчёт о тестировании: case-phish load/reveal + lightbox UI

## Новые тесты

### Модульные / wiring
- ✅ `case.js reads data-case-id and fills stub sections / short mode` — PASSED (lightbox close/tapper, `waitForCasePictureLayout`, no `loading=lazy`)
- ✅ `case.css styles zoomable inline pictures and lightbox chrome` — PASSED

### Browser smoke (localhost:5173)
- ✅ Inline zoomable pictures load with non-zero height (was 0×0 under lazy)
- ✅ Lightbox open → close button + DS tapper (±) visible
- ✅ Tapper zoom-in → `scale(1.5)`
- ✅ Escape / overlay click / close button → lightbox closes

## Регрессионные тесты

### Запущено: `tests/test_portfolio_case_phish.mjs`
### Прошло успешно: 6/6
### Упало: 0

### Заметка
`tests/test_portfolio_case_dragon.mjs` — 1 pre-existing fail на контенте Dragon (`/среднее время/`), не связан с этими правками.

## Итог

✅ Zoomable display восстановлен  
✅ Reveal ждёт реальный layout картинок  
✅ Lightbox: close + tapper + Escape/overlay  
✅ Задача готова к ревью  
