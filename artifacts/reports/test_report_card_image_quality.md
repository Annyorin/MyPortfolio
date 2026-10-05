# Отчёт: качество обложек карточек (сегодняшний визуал Oct4)

## Задача

Оставить **сегодняшние** обложки InnoPhish / InnoDragon (Figma 2026-10-04), не возвращать pre-Oct4 gauges/dashboard. Пересобрать card @3× 924×570 с высоким PNG quality и умеренные lq webp.

## Источник сегодняшних байтов

Ошибочный `git checkout HEAD` затёр working-tree native/hero-экспорты. Raw Oct4 **не потеряны** — во временных экспортах:

| Карточка | Исходник | Размер исходника |
|----------|----------|------------------|
| InnoPhish (`phish` / `img-2` / `card-innophish`) | `.tmp-frames/phish-hires/hero-raw1.png` | 1920×1200, 215 142 B |
| InnoDragon (`dragon` / `img-1` / `card-innodragon`) | `.tmp-frames/figma-covers/dragon-native.png` | 1558×962, 86 760 B |

Сгенерировано: sharp Lanczos3 `fit: cover` → PNG 924×570 (**159 470** / **118 549** B). lq: cwebp q90 @744w (**~23.8** / **~21.3** KB).

## Тесты

- ✅ `tests/test_card_image_quality.mjs` — 11/11

## Браузер

- URL: http://localhost:5173/portfolio/main.html
- cardA → `img-2.png` natural 924×570 (график индекса)
- cardB → `img-1.png` natural 924×570 (Уведомления)
- Progressive: card covers не в `LOW_RES_IMAGES` — full PNG

## Изменённые файлы

- `ds-showcase/assets/images/{phish,img-2,card-innophish,dragon,img-1,card-innodragon}.png`
- `ds-showcase/assets/images/lq/{phish,img-2,card-innophish,dragon,img-1,card-innodragon}.webp`
- `shared/lowResImages.js`
- `tests/test_card_image_quality.mjs`
- `artifacts/reports/test_report_card_image_quality.md`

Коммит не создавался.
