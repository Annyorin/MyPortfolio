# Отчёт: InnoPhish finals fills из Figma 509:19096

## Задача
Заменить fills `final_1` (hscroll InnoPhish finals) ассетами из Figma `509:19096` @2×; обновить `*-full` для lightbox. Не трогать final_2 / main / Dragon.

## Источник
- fileKey: `xboMnqU5JURL0xlzxN7edN`
- nodeId: `509:19096` (Picture → Interfs → 2× img8)
- Fill nodes: `586:15620` (287×276 clip), `586:15622` (277×416)

## Установленные ассеты
| Файл | Размер px | Назначение |
|------|-----------|------------|
| `ds-showcase/assets/images/case-phish-final-1.png` | 574×552 (@2×) | display hscroll |
| `ds-showcase/assets/images/case-phish-final-1-2.png` | 554×832 (@2×) | display hscroll |
| `ds-showcase/assets/images/case-phish-final-1-full.png` | 4096×4049 | lightbox |
| `ds-showcase/assets/images/case-phish-final-1-2-full.png` | 2729×4096 | lightbox |

## content.js
Кадров по-прежнему 2 (`final_1`, `final_1_2`); intrinsic 287×276 / 277×416 — без правок.

## Preview
- http://localhost:5173/portfolio/case-phish.html#finals — HTTP 200

## Тесты
### `node --test tests/test_portfolio_case_phish.mjs`
- ✅ 10/10 PASSED

## Итог
✅ Задача выполнена. Коммит не создавался.
