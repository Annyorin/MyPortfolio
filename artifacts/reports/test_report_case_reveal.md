# Отчёт о тестировании: case scroll/load reveal

## Новые / обновлённые тесты

### Модульные (source/CSS wiring)
- ✅ `case.js exports initCasePage and binds segments/FAB/drawer helpers` — PASSED (добавлены asserts на `setupCaseReveal`, IO options, crossfade wait, reduced-motion)
- ✅ `case.css covers Figma breakpoints without token redefinition` — PASSED (`.is-reveal` / `.is-in`, 360ms easing, reduced-motion)

## Регрессионные тесты

### Запущено
- `tests/test_portfolio_case_dragon.mjs`
- `tests/test_portfolio_case_phish.mjs`
- `tests/test_page_transition.mjs`

### Итог: 15/15 PASSED, 0 failed

## Детали

Reveal покрыт статическими asserts (классы, селекторы, timing constants, boot wiring). Runtime IntersectionObserver / stagger timing не гонялся в jsdom — без flaky delay-тестов.

## Итог

✅ Задача готова к ревью
