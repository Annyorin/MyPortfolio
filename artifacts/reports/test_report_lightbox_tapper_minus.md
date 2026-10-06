# Отчёт о тестировании: lightbox tapper minus (повтор)

## Баг (как видно сейчас)

Левая половина `ds-tapper` (−) в lightbox кейса вела себя странно относительно плюса:

1. Hit-target был только у иконки 24×24; padding/gap родителя — мёртвая зона (клик no-op или «мимо»).
2. Предыдущий фикс (`::before` + `z-index: -1`) расширял hit в CDP, но оставался хрупким; `<img>` иконок были `draggable` и принимали pointer — native drag мог съесть `click` именно на тонкой линии минуса.
3. На fit минус `aria-disabled` (ожидаемо no-op); важно, чтобы клик по левой половине не закрывал lightbox.

## Root cause

Не «disabled падает в overlay», а связка:

- мёртвая зона левой половины (иконка ≠ половина chrome);
- клики по `<img>` минуса (draggable + pointer-events) вместо `<button>`;
- активация только через `click` (легко теряется).

## Исправление

- Реальные половины 52×40: `padding/gap` сняты с chrome, перенесены в кнопки (иконки на тех же местах).
- `pointer-events: none` + `draggable=false` на иконках.
- Zoom на `pointerup` (с guard от double-fire с `click`); `click` остаётся для клавиатуры.
- `aria-disabled` на min/max сохранён.

## Browser verification (`http://localhost:5173/portfolio/case-phish.html`)

Cover → lightbox:

| Шаг | Результат |
|-----|-----------|
| Hit-map mid-row | left 26/26 → zoom-out, right 26/26 → zoom-in; кнопки 52×40 |
| Fit, клик левой половины − | lightbox открыт, scale без изменений, `aria-disabled=true` |
| Plus (левый край правой половины) | scale 0.569 → 0.711 |
| Plus (правый край) | 0.711 → 0.889 |
| Minus left pad | 0.889 → 0.711 |
| Minus icon area | 0.711 → 0.569 (fit) |
| Minus снова на fit | no-op, lightbox открыт |
| `img` pointer-events | `none`; `draggable=false` |

## Модульные тесты

### `tests/test_portfolio_case_phish.mjs`
- ✅ 6/6 PASSED (в т.ч. half-button padding, `pointer-events: none`, `aria-disabled`, `draggable=false`, `pointerup`)

## Итог

✅ Левая половина − симметрична плюсу по hit-area  
✅ Zoom-out срабатывает с pad и с иконки; на fit не закрывает lightbox  
✅ Нет double-zoom от pointerup+click  
✅ Главная не трогалась; коммита нет  
