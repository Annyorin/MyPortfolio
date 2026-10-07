# Отчёт о тестировании: InnoDragon ImgBlockScroll

## Новые / обновлённые тесты

### `tests/test_portfolio_case_dragon.mjs`
- ✅ `contentMap wires card.b.url and case.dragon keys` — intro_body содержит `[[imgscroll:…]]`, без трёх отдельных `[[img:as_is*]]`
- ✅ `case.js exports initCasePage…` — `CASE_IMGSCROLL_MARKER_RE`, `createCasePictureScroll`, `bindCaseHscrollDrag`, классы hscroll
- ✅ `case.css covers Figma breakpoints…` — `.case-page__picture--scroll`, `.case-page__hscroll`, track/img, `overflow-x: auto`

## Регрессионные тесты

### Запущено: `node --test tests/test_portfolio_case_dragon.mjs`
### Прошло успешно: 7/7
### Упало: 0

## Браузерная проверка

URL: http://localhost:5173/portfolio/case-dragon.html  
Секция «Как сейчас»:

- один `.case-page__picture--scroll` (bg `#ededed`, r32, p24)
- внутри `.case-page__hscroll` + track gap 8px, 3 zoomable кадра `as_is` / `_2` / `_3`
- `scrollWidth > clientWidth` → горизонтальный scroll
- отдельных inline-картинок as_is нет

## Итог

✅ Тесты прошли  
✅ Разметка и стили соответствуют постановке  
✅ Задача готова к ревью
