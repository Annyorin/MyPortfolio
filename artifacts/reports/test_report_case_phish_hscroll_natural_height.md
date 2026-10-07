# Отчёт о тестировании: InnoPhish hscroll natural height

## Задача
Убрать crop hscroll-кадров на InnoPhish (~269px cover). Высота трека = max natural height; без crop; короткие кадры не растягивать; mobile — пропорции; Dragon не трогать.

## Изменённые файлы

### Код
- `portfolio/css/case.css` — overrides под `body.case-page[data-case-id="phish"]`: track `align-items: flex-start`; img `height: auto`, `aspect-ratio: auto`, `object-fit: contain`; mobile ≤480 то же (без lock 530/269)

### Тесты / docs
- `tests/test_portfolio_case_phish.mjs` — тест phish hscroll natural height
- `portfolio/.AGENTS.md`, `tests/.AGENTS.md`

### Не тронуты
- `portfolio/js/case.js` (общий паттерн)
- `main.html` / обложки
- базовые `.case-page__hscroll-img` 530×269 cover (Dragon)

## Новые тесты

### Модульные / статичные
- ✅ `case.css phish hscroll uses natural height without cover crop` — PASSED

## Регрессионные тесты

```
node --test tests/test_portfolio_case_phish.mjs tests/test_portfolio_case_dragon.mjs
```

### Запущено тестов: 17
### Прошло успешно: 17
### Упало: 0

## Браузер

URL: http://localhost:5174/portfolio/case-phish.html

### Desktop (phish)
| Блок | max frame H | track H | object-fit | короткие не stretch |
|------|-------------|---------|------------|---------------------|
| ux_test 2tabs | 504 | 504 | contain | 495 / 504 |
| ux_test 3tabs | 514 | 514 | contain | 330 / 409 / 514 |
| finals | 796 | 796 | contain | 510 / 796 |

Все кадры: `clientH ≈ width × naturalH/naturalW` (±1px), не 269.

### Mobile 390px (phish)
Ширина кадра 310; `aspect-ratio: auto`; `ratioOk` для всех 7 кадров; без lock 530/269.

### Dragon isolation
URL: http://localhost:5174/portfolio/case-dragon.html — 3 кадра остались **530×269 / object-fit: cover / aspect-ratio 530/269**.

## Итог

✅ Все тесты прошли успешно  
✅ Регрессия Dragon не обнаружена  
✅ Изоляция через `[data-case-id="phish"]`  
✅ Коммит не создавался
