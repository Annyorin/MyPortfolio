# Отчёт: case-phish JTBD (Figma 504:17637)

## Что в макете

`TextBlockSecond` (504:17637):

1. Заголовок **JTBD** — H2 (16/20 Medium, black)
2. Intro — Text2 (14/20 Regular, gray): длинная формулировка про доклад / Excel / Word / PDF
3. Сетка **JTBD**: 8 рядов × 3 `Fill_Block` (secondary `#ededed`, pad 16, radius 16, gap 8)
   - колонки: **Когда…** / **Я хочу…** / **Чтобы…**
   - prefix Medium black + rest Regular gray

## Что изменила

| Файл | Изменение |
|------|-----------|
| `shared/content.js` | В `case.phish.analysis_body` после intro — маркер `[[jtbd:case.phish.jtbd]]`; добавлен `jtbdGrids["case.phish.jtbd"]` (8×3) |
| `portfolio/js/case.js` | `CASE_JTBD_MARKER_RE`, `createJtbdGrid()` → `.case-page__jtbd` + `.case-page__fill-block--compact` |
| `portfolio/css/case.css` | Стили JTBD-сетки и compact Fill_Block; ≤768 — 1 колонка |
| `tests/test_portfolio_case_phish.mjs` | Asserts на маркер, grid data, CSS/JS |
| `portfolio/.AGENTS.md` | Документация маркера `[[jtbd:]]` |

Ключи: `case.phish.analysis_body`, `jtbdGrids.case.phish.jtbd`.

## Тесты

### Новые / обновлённые
- ✅ `contentMap wires card.b.url and case.phish keys` — JTBD marker + 8 rows
- ✅ `case.js reads data-case-id…` — `CASE_JTBD_MARKER_RE` / `createJtbdGrid`
- ✅ `case.css styles…` — `.case-page__jtbd` / `--compact` / 3-col grid

### Регрессия
- `tests/test_portfolio_case_phish.mjs` — **6/6 PASSED**

### Browser (localhost:5173)
- DOM: title JTBD, 1 intro, 8 rows / 24 cards; pad 16 / radius 16 / gap 8 / bg `#ededed`
- Short mode: `#analysis` скрыт; long — видим
- Lightbox: open/close на zoomable жив
- Reveal: text-block с JTBD в `is-reveal`

## Превью

http://localhost:5173/portfolio/case-phish.html#analysis

## Итог

✅ Блок JTBD совпадает со структурой макета 504:17637  
✅ Reveal / lightbox / short mode не сломаны  
✅ Коммит не делался
