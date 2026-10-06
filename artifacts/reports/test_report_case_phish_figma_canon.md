# Отчёт: InnoPhish case → канон Figma 509:18872

## Задача
Выровнять страницу кейса InnoPhish (`case.phish.*`) по блокам и тексту Figma; убрать бизнес-схему; обновить short/long; тесты.

## Изменённые файлы
- `shared/content.js` — тексты/структура `case.phish.*`, JTBD×7
- `tests/test_portfolio_case_phish.mjs` — ожидания под новую нарезку
- `design/03-content/copy/case-phish.md` — канон-пакет слоя B

## Убрано / заменено
| Было | Стало |
|------|--------|
| ## Бизнес-схема + `[[img:case.phish.business]]` | Удалено из `design_body` (ассет на диске / в `assets` оставлен) |
| ## Вопросы пользователям | ## Результаты интервью (контент Figma, опечатки исправлены) |
| JTBD × 8 | JTBD × 7 (как в Figma) |
| Гипотезы × 6 | Гипотезы × 5 |
| Лишний пункт ценностей (HR/SOC слой) | 7 пунктов как в макете |
| Триггер про HR-доступ | «Начало очередного обучения…» |
| Highlighter в finals (3,4→45) | Только в UX-тесте; finals без `==` |
| Markers | 13 (было 14) |

## Short / Long
- Short: мета + продукт + контекст + UX-тест + финалы + результат (analysis/design по-прежнему `data-case-long-only`)
- Long: + исследование + проектирование (IA + User Flow)

## Тесты
```
node --test tests/test_portfolio_case_phish.mjs
```
9/9 passed.

## Preview
http://localhost:5173/portfolio/case-phish.html  
Vite :5173 already_running (local-preview).

## Допущения
- Опечатки Figma («оспециалисты», «закрываю», «наоборт», «ввыбирали», «стоблчатого», «преждний» и т.п.) исправлены по смыслу.
- Marker «Провёла интервью» с ё (корректный русский; в Figma marker без ё).
- Main cards не трогались.

## Открытые вопросы
Открытых вопросов нет.
