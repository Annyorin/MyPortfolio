# Отчёт о тестировании: lightbox tapper minus visual parity

## Что было не так

На fit у zoom-out стоял `aria-disabled="true"`, и CSS гасил половину:

- `opacity: 0.35` — иконка выглядела светлой / «мёртвой»
- правила `:hover` / `:focus-visible` блокировали swap иконки и tooltip

Плюс при том же zoom оставался `opacity: 1` с нормальным hover.

## Исправление

В `portfolio/css/case.css` для `.case-page__lightbox-tapper .scene-tapper__hit[aria-disabled="true"]`:

- `opacity: 1`, `cursor: pointer` (визуальный parity с плюсом)
- удалены overrides, глушившие hover-swap и tooltip

`aria-disabled` в JS сохранён: на min/fit zoom-out по-прежнему no-op, lightbox не закрывается.

## Browser verification

URL: `http://localhost:5173/portfolio/case-phish.html` (cover → lightbox)

| Шаг | Результат |
|-----|-----------|
| Fit, opacity − / + | оба `1` |
| Fit, force `:hover` на − | hover-иконка `display:block`, tooltip «Отдалить» |
| Fit, pointerup на − | scale без изменений, lightbox open, `aria-disabled=true` |
| Plus | scale `0.569` → `0.711`, − становится `aria-disabled=false` |
| Minus после zoom | обратно на fit |
| Minus снова на fit | no-op, lightbox open |

## Модульные тесты

### `tests/test_portfolio_case_phish.mjs`
- ✅ 6/6 PASSED
- CSS: `opacity: 1` на `[aria-disabled="true"]`
- CSS: нет fade `opacity: 0.x` и нет блокировки hover-swap

## Итог

✅ Визуальный parity − с + на fit (контраст + hover)  
✅ Поведение no-op на min/fit сохранено  
✅ Плюс / close / pan / main не трогались  
✅ Коммита нет
