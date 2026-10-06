# Отчёт: InnoDragon case → канон Figma 530:15457

## Задача
Выровнять страницу кейса InnoDragon (`case.dragon.*`) по скелету InnoPhish и тексту Figma; lightbox/zoom/`==` маркеры; JTBD×9; тесты.

## Изменённые файлы
- `portfolio/case-dragon.html` — nav/секции как Phish; без `#hypotheses`
- `shared/content.js` — тексты/ассеты/JTBD `case.dragon.*`
- `portfolio/js/case.js` — `data-case-zoomable` для Dragon hero
- `design/03-content/copy/case-dragon.md` — слой B
- `tests/test_portfolio_case_dragon.mjs` — ожидания под новую нарезку

## Структура
| Было | Стало |
|------|--------|
| Nav: Контекст / Анализ / Гипотезы / Выводы | Контекст / Исследование / Проектирование / UX-тест / Финальные макеты / Результаты |
| `#hypotheses` stub | Удалён |
| `context_title` Контекст задачи | Продукт |
| `intro_title` Вводные | Контекст задачи |
| `conclusions_title` Выводы | Результат и ограничения |

## Short / Long
- Short: мета + продукт + контекст + UX-тест + финалы + результат
- Long: + исследование + проектирование (`data-case-long-only`)

## Тесты
```
node --test tests/test_portfolio_case_dragon.mjs
```
7/7 passed.

## Preview
http://localhost:5173/portfolio/case-dragon.html

## Допущения
- Опечатки Figma («Отстутсвует», «обаружение», «зерез», «востребоваными» и т.п.) исправлены по смыслу.
- Marker «Провёла интервью» с ё.
- JTBD в Figma ещё с Phish-текстами; на сайте — 9 Dragon-рядов из постановки.
- Lightbox fullSrc: отдельного `-full` нет — тот же path.
