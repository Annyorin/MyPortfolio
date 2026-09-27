# Отчёт: ButtonRound hover + Header burger gap

## Задача

1. Desktop hover ButtonRound (Text / Outlined) не срабатывал.
2. Header &lt;1024 — лишний зазор справа от burger.

## Тесты

Не запускались (явный запрос: «Не запускай тесты»).

## Изменения

### Hover

**Причина:** muted `:hover` и Outlined `translateY` были только внутри `@media (hover: hover) and (pointer: fine)`. В Cursor/Electron и части desktop-окружений этот media не матчится → hover-стили не применялись.

**Фикс:**
- `ds-showcase/css/components.css` — `:hover { color: gray-text }` по умолчанию; сброс sticky-hover + `:active` / `--pressed` только в `@media (hover: none), (pointer: coarse)`.
- `portfolio/js/boot/dots/theme.js` — то же для Outlined floating `translateY(-2px)`.
- `tokens.css` dark — без правок (hover через `--color-gray-text`; pressed fill уже за touch-media).

### Отступ справа от burger

**Причина:** `.ds-header__buttons` фиксированно `width: 96px` (theme+burger). Theme в портфолио absolute слева от burger → в потоке только 48px burger при `flex-start` → 48px пустоты справа. Header `padding` уже `16px 0`.

**Фикс:**
- `components.css` — `justify-content: flex-end` у `.ds-header__buttons`.
- `case.css` (`max-width: 1365px`) — `width: 48px` у `.ds-header__buttons` (как ≥1366).

## Файлы

- `ds-showcase/css/components.css`
- `portfolio/js/boot/dots/theme.js`
- `portfolio/css/case.css`
