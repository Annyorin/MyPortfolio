# Test report: segments labels «Полностью» / «Кратко»

## Summary

Renamed shared case segment labels from «Длинная версия» / «Короткая версия» to «Полностью» / «Кратко».

## Tests run

| Suite | Result |
| --- | --- |
| `tests/test_portfolio_case_phish.mjs` | pass |
| `tests/test_segments_control.mjs` | pass |
| `tests/test_portfolio_case_dragon.mjs` | 1 fail unrelated (`/среднее время/` in dragon body copy) |
| `tests/test_ds_showcase_composite.mjs` | 1 fail unrelated (Media slot macbook 388×283) |

No tests asserted the old segment label strings; no test updates required.

## Preview

Expected URLs (Vite not running at check time):

- http://127.0.0.1:5173/portfolio/case-phish.html
- http://127.0.0.1:5173/portfolio/case-dragon.html
