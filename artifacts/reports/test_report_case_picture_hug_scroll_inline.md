# Отчёт: hug height для `--scroll` / `--inline`

## Задача
Убрать lock высоты (≤768 `aspect-ratio 736/307` + `max-height 307` / ≤480 `height 168`) у `.case-page__picture--scroll` и `--inline` для всех кейсов (не только phish). Dragon hscroll-кадры 530×269 оставить.

## Изменённые файлы

### Код
- `portfolio/css/case.css` — общий hug на `--scroll`/`--inline` (base + дубли в ≤768/≤480); phish-only container hug убран; phish hscroll-img `contain` без изменений

### Тесты
- `tests/test_portfolio_case_phish.mjs` — assert на shared селектор hug
- `tests/test_portfolio_case_dragon.mjs` — assert hug + media override

## Тесты

```
node --test tests/test_portfolio_case_phish.mjs tests/test_portfolio_case_dragon.mjs
```

- Запущено: 17
- Прошло: 17
- Упало: 0

## Браузер (dragon, vw=642)

| Блок | height | aspect-ratio | max-height |
|------|--------|--------------|------------|
| `--scroll` (context) | **317** (24+269+24) | auto | none |
| `--inline` analysis (3104×2792) | **554** (pad + img ~506) | auto | none |
| hscroll-img Dragon | 530×269 cover | 530/269 | — |

Не обрезано до ~268. Коммит не создавался.
