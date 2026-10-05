# Отчёт: lightbox hi-res на case pages

## Что было

Lightbox брал `img.currentSrc || img.src` — для hero InnoPhish это mid-res cover `phish.png` (924×570). Inline case PNG уже были full (2–4k), кроме `final_2` (1164×1112).

## Что сделано

- `AssetRef.fullPathFromDsRoot` + `resolveAsset(key, { full: true })`
- Zoomable картинки кейса пишут `data-full-src`; lightbox предпочитает его
- Ассеты: `case-phish-hero-full.png` (1920×1200), `case-phish-final-2-full.png` (2480×1400)
- Main / card covers / `lowResImages` progressive pipeline не менялись

## Тесты

### `tests/test_portfolio_case_phish.mjs`
- ✅ 6/6 PASSED (в т.ч. `fullPathFromDsRoot`, наличие full files, `dataset.fullSrc`)

### `tests/test_portfolio_case_dragon.mjs`
- ⚠️ 5/6 — pre-existing fail на контенте Dragon (`/среднее время/`), не связан с lightbox

### Browser smoke
- URL: http://localhost:5173/portfolio/case-phish.html
- Hero lightbox → `case-phish-hero-full.png`, natural **1920×1200**
- final_2 lightbox → `case-phish-final-2-full.png`, natural **2480×1400**
- Inline hero остаётся `phish.png` 924×570

## Итог

✅ Lightbox на case-phish открывает hi-res  
✅ Main не затронут  
✅ Коммит не создавался  
