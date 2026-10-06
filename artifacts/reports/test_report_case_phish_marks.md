# Отчёт о тестировании: InnoPhish highlighter marks

## Новые тесты

### Модульные
- ✅ `contentMap wraps InnoPhish highlighter phrases in == markers` — PASSED (14 пар `==`, Dragon без маркеров)
- ✅ `case.js parses == marks and observes highlighter sweep` — PASSED
- ✅ `case.css highlighter uses primary token, gradient, reduced-motion` — PASSED

## Задача (указанный прогон)

- ✅ `node --test tests/test_portfolio_case_phish.mjs` — 9/9 PASSED

## Регрессионные тесты

`npm test`: 228 тестов, 221 passed, 7 failed. Провалы pre-existing, не связаны с highlighter:

- Dragon content (`/среднее время/` в `case.dragon.analysis_body`)
- DS showcase sizes / `components.css` selectors / Media slots
- `design/` scope ban (грязное дерево вне этой задачи)
- `portfolio.css` `--color-` / CityBike card description class

## Browser

- URL: http://localhost:5173/portfolio/case-phish.html (существующая вкладка, второй Vite не стартовал)
- DOM: 14 `.case-page__mark`; парсер `==…==` → `<mark><span>`
- На старте все `--highlighted: 0` (ниже фолда)
- При появлении в вьюпорте: `--highlighted: 1`, синяя заливка primary 80%, цвет текста как у абзаца
- Проверены исследование, UX-тест/финалы, выводы

## Итог

✅ Highlighter работает по Framer-механике и токену `--color-primary`  
✅ Контент Dragon не менялся  
✅ Задача готова к ревью
