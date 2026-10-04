# Отчёт: lightbox close icon Black → Gray_text hover

## Что изменено

### `portfolio/css/case.css`
- Default `.case-page__lightbox-close.ds-button-round`: `color: var(--color-black)` (было `--color-gray-text`).
- Hover / `--hover`: `color: var(--color-gray-text)` — чтобы правило case не перебивало muted hover DS.
- `@media (hover: none)`: sticky `:hover` сбрасывается в `--color-black`.
- Удалён dark-only override с gray (в dark `--color-black` → ink `#f5f5f5`).

### `tests/test_portfolio_case_phish.mjs`
- Проверки: default `--color-black`, hover `--color-gray-text` на lightbox-close.

## Тесты

### Модульные
- Запущено: `node tests/test_portfolio_case_phish.mjs`
- Результат: ✅ 6/6

### Browser smoke (`http://localhost:5173/portfolio/case-phish.html`)
- Light default: icon `rgb(18,18,20)` = `--color-black` `#121214`
- Light hover (`--hover`): `rgb(136,136,136)` = `--color-gray-text` `#888888`
- Dark default: `rgb(245,245,245)` = dark `--color-black` `#f5f5f5`
- Dark hover: `rgb(180,180,189)` = dark `--color-gray-text` `#b4b4bd`
- Shadow / tapper / кнопка не трогались

## Допущения
Допущений нет

## Открытые вопросы
Открытых вопросов нет

## Примечания
Коммит не создавался.
Preview: http://localhost:5173/portfolio/case-phish.html
