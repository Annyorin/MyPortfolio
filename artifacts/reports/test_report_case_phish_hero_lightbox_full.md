# Отчёт: lightbox cover InnoPhish — полный дашборд

## Что было

- Inline cover: `phish.png` 924×570 (mid-res) — ок.
- Lightbox `data-full-src` → `case-phish-hero-full.png` был landscape crop 1920×1200 (тот же верх дашборда, без нижних блоков).
- Эталон пользователя: полный экран «Главная» (реакции, время реакции, последние атаки).

## Что сделано

- Заменён только `ds-showcase/assets/images/case-phish-hero-full.png` на полный дашборд.
- Источник: lossless crop левой доски из `.tmp-frames/phish-hires/final1-4x.png` (тот же кадр, что в эталоне; выше пикселей, чем чат-вложение 1024×1012).
- Итог: **1115×1083**, PNG ~259 KB.
- Код lightbox / `fullPathFromDsRoot` / decode / fit-scale не менялись.
- Inline `phish.png` и main/card covers не трогались.
- Архив исходника: `.tmp-frames/phish-hires/hero-full-dashboard.png`.

## Main не трогала

- `phish.png` / `card-innophish.png` hash = HEAD `29ce055f…`, 159 470 B
- `portfolio/main.html`, `shared/lowResImages.js`, progressive/lq — без изменений

## Тесты

### `tests/test_portfolio_case_phish.mjs`
- ✅ 6/6 PASSED

### Browser smoke
- URL: http://localhost:5173/portfolio/case-phish.html
- Preview: already_running (`local-preview`)
- Inline hero: `phish.png` 924×570
- После клика: `img.case-page__lightbox-img` → `/ds-showcase/assets/images/case-phish-hero-full.png`, natural **1115×1083**, `decoding=async`, transform fit/scale как раньше
- Визуально: полный дашборд с нижними блоками (как эталон)

## Итог

✅ Lightbox cover показывает полный дашборд  
✅ Качество/рендер-пайплайн lightbox сохранён  
✅ Main / card covers не затронуты  
✅ Коммит не создавался  
