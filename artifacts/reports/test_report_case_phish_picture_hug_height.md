# Отчёт о тестировании: InnoPhish picture hug height

## Задача
На mobile (~358–360) блоки `#finals` / `#ux_test` (scroll + inline center) давали ~149px. Нужна высота = hug content; только InnoPhish; Dragon не ломать.

## Причина
Общий ≤768 rule `.case-page__picture { aspect-ratio: 736 / 307; max-height: 307px }` (и ≤480 `height: 168px`) применялся к `--scroll` / `--inline`. Модификаторы сбрасывали только `height`, поэтому при ширине ~358 высота = `358 × 307/736 ≈ 149`.

## Изменённые файлы

### Код
- `portfolio/css/case.css` — phish-only: `.case-page__picture--scroll` / `--inline` → `height: auto`, `max-height: none`, `aspect-ratio: auto`

### Тесты / docs
- `tests/test_portfolio_case_phish.mjs` — assert hug overrides
- `tests/.AGENTS.md`

### Не тронуты
- `portfolio/js/case.js`
- базовые hero `.case-page__picture` (307 / 736÷307 / 168)
- Dragon cover 530×269

## Тесты

```
node --test tests/test_portfolio_case_phish.mjs tests/test_portfolio_case_dragon.mjs
```

Запущено: 17 · Passed: 17 · Failed: 0

## Браузер

URL: http://localhost:5174/portfolio/case-phish.html

### Mobile 360 (phish)
| Блок | clientH | aspect-ratio | max-height | кадры ratioOk |
|------|---------|--------------|------------|---------------|
| `#finals` scroll | 469 | auto | none | 269 / 421 |
| `#finals` inline center | 176 | auto | none | 144 |
| `#ux_test` scroll ×2 | 346 / 351 | auto | none | ok |

Больше не ~149px.

### Desktop (~1093–1366, phish)
| Блок | clientH | maxImgH |
|------|---------|---------|
| finals scroll | 566 | 510 |
| finals inline | 527 | 479 |
| ux_test scrolls | 567 / 481 | 495 / 409 |

### Dragon isolation
URL: http://localhost:5174/portfolio/case-dragon.html — кадры **530×269 / object-fit: cover / aspect-ratio 530/269**.

## Итог

✅ Hug content на phish scroll + inline  
✅ Тесты зелёные  
✅ Dragon cover не затронут  
✅ Коммит не создавался
