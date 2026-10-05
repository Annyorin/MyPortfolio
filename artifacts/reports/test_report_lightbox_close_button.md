# Отчёт о тестировании: lightbox close ButtonRound (Figma 514:19567)

## Figma (узел 514:19567)

| Свойство | Значение |
| --- | --- |
| Компонент | ButtonRound instance, 48×48 |
| Item / padding | Item 01 48×48, padding 12 |
| Icon | close 24×24 |
| Fill | White `#fefefe` |
| Stroke | page/page-bg `#f5f5f5` |
| Shadow | 0 5px 9px `--shadow (tint)` `#bbbbbd40` |
| Icon color | Gray_text `#888888` |
| Radius | circle (35px / 50%) |
| Offset от края lightbox | в узле нет родителя-lightbox; сохранён `top/right: 16px` |

## Что изменено

### Light
- Убраны хардкоды `#fefefe` / `#f5f5f5` / shadow hex / `#121214` с `!important`.
- Chrome от DS Outlined: `--color-white`, `--page-bg`, `--shadow`.
- Иконка close через mask `close.svg` + `color: var(--color-gray-text)` (раньше `<img>` скрывался правилом `.ds-button-round .ds-icon > img`, маски close не было).

### Dark
- Семантический remap DS: fill `--color-white` → `#232323`, border `--color-secondary` → `#2f2f35`, shadow dark tint, icon `--color-gray-text` → `#b4b4bd`.
- Читается на оверлее lightbox; tapper/zoom не трогались.

## Новые / обновлённые тесты

### Модульные
- ✅ `case.css styles zoomable inline pictures and lightbox chrome` — PASSED (добавлены проверки `--color-gray-text`, `close.svg`, отсутствие `#fefefe !important` на close)

## Browser smoke (localhost:5173)

- ✅ Light: close 48×48, top/right 16, bg `rgb(254,254,254)`, border `rgb(245,245,245)`, shadow tint, icon Gray_text + mask
- ✅ Dark: bg `rgb(35,35,35)`, border `rgb(47,47,53)`, icon `rgb(180,180,189)`, tapper на месте
- ✅ Click close → lightbox закрывается; reopen OK

## Регрессионные тесты

### Запущено: `tests/test_portfolio_case_phish.mjs`
### Прошло успешно: 6/6
### Упало: 0

## Итог

✅ Кнопка close приведена к Figma 514:19567 в light  
✅ Dark через DS-токены  
✅ Tapper/zoom не затронуты  
✅ Коммит не создавался  
