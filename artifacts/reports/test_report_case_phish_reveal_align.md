# Отчёт о тестировании: Phish reveal = Dragon grain

## Новые / обновлённые тесты

### Модульные
- ✅ `case.js reads data-case-id and fills stub sections / short mode` — PASSED  
  (asserts на `CASE_REVEAL_SELECTORS`: stub `> text-block` / `> picture`, без целого `.case-page__section-stub`)

## Регрессионные тесты

### Запущено
- `tests/test_portfolio_case_phish.mjs` — 6/6 PASSED
- `tests/test_portfolio_case_dragon.mjs` — 5/6 PASSED, 1 pre-existing fail на контенте Dragon (`/среднее время/` в `analysis_body`), не связан с reveal

### Итог по задаче: case-phish 6/6 ✅

## Browser (localhost:5173)

- Vite: already_running, http://localhost:5173/
- Phish: 9 text-block + 7 picture внутри stubs с `is-reveal`; stub сам без `is-reveal`
- После scroll: progressive `is-in` (сначала text, затем pictures)
- CSS state совпадает с Dragon: opacity 0 → 1, `translateY(10px)`, 360ms `cubic-bezier(0.33, 0.05, 0.2, 1)`
- Lightbox: click → open, close + tapper на месте, Escape закрывает

## Итог

✅ Reveal grain у Phish выровнен под Dragon  
✅ Lightbox/zoomable не сломан  
✅ Контент не откатывался  
