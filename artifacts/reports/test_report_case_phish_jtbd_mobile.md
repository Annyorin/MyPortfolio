# Отчёт: InnoPhish JTBD mobile (&lt;768) → Figma 561:18198

## Задача
Выровнять блок JTBD на кейсе InnoPhish с макетом Figma на ширине ≤768: одна карточка на job со слитным «Когда / Я хочу / Чтобы», а не три отдельные Fill_Block в столбик.

## Что отличалось
| | Было (код) | Макет 561:18198 |
|---|---|---|
| Сетка | `@media (max-width: 768px)` → `grid-template-columns: 1fr` → 3 карточки друг под другом | 1 `Fill_Block` на Job, текст inline |
| Карточка | 3× pad 16 / radius 16 / secondary | 1× pad 16 / radius 16 / secondary |
| Marker | prefix bold/black в каждой из 3 карточек | те же prefix внутри одного абзаца |
| Контент | 7 jobs из канона | в ноде показаны 2 Job как паттерн; канон ×7 сохранён |

Desktop ≥769: 3-колоночная сетка без изменений по смыслу.

## Изменённые файлы
- `portfolio/js/case.js` — `createJtbdCellCard` / `createJtbdMergedCard`; ряд = 3 desktop-cell + 1 merged
- `portfolio/css/case.css` — ≤768: cells `display:none`, merged `display:flex`
- `tests/test_portfolio_case_phish.mjs` — проверки merged/mobile CSS + JS

## Тесты
```
node --test tests/test_portfolio_case_phish.mjs
```
9/9 passed.

## Browser verify
- URL: http://localhost:5173/portfolio/case-phish.html#analysis
- Breakpoints: 360 (merged ✓), 767 (merged ✓), desktop ~1366+ (3-col ✓, merged hidden)
- Vite: localhost:5173 (local-preview already_running)

## Допущения
- Breakpoint оставлен `max-width: 768px` как в существующем case.css (≤768 ≈ запрошенный &lt;768).
- В Figma-ноде 2 Job; в продукте остаются 7 из `jtbdGrids["case.phish.jtbd"]` (канон не переписывался).

## Открытые вопросы
Открытых вопросов нет.
