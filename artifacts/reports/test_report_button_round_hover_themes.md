# Отчёт: ButtonRound hover light + dark (Figma 416:17567)

## Задача

Реальный `:hover` для ButtonRound (Outlined + Text) в light и dark по Figma; floating theme на главной + Text в Header/Toolbar. Без тестов, без коммита.

## Почему раньше «не добавилось»

1. Прошлый фикс вынес muted в `.ds-button-round:hover`, но **не перебил** более специфичные правила:
   - `html[data-theme="dark"] .ds-button-round { color: var(--color-black) }` — `(0,2,1)` > `.ds-button-round:hover` `(0,2,0)` → в dark hover никогда не применялся.
   - `body.case-page .dots-theme-toggle--inline.ds-button-round { color: var(--color-black) }` — `(0,3,1)` → Text theme в Header/Toolbar тоже без muted.
2. Ранее hover ещё прятали в `@media (hover: hover)` (Electron) — это уже правили; текущий баг — именно specificity.

## Селекторы

### Light (components.css)

| Состояние | Селектор | Эффект |
|-----------|----------|--------|
| Text / Outlined hover | `.ds-button-round:hover`, `.ds-button-round--outlined:hover` | `color: var(--color-gray-text)` (#888) |
| Demo class | `.ds-button-round.ds-button-round--hover`, `.ds-button-round--outlined.ds-button-round--hover` | то же |
| Touch reset | `@media (hover: none), (pointer: coarse)` → те же `:hover` | `color: var(--color-black)` |
| Outlined pressed (touch) | `.ds-button-round--outlined:active` / `--pressed` | muted, без fill |

### Dark (tokens.css)

| Состояние | Селектор | Эффект |
|-----------|----------|--------|
| Text / Outlined hover | `html[data-theme="dark"] .ds-button-round:hover`, `…--outlined:hover`, `…--hover` | `color: var(--color-gray-text)` (#b4b4bd) |
| Touch reset | same media + dark `:hover` | `color: var(--color-black)` (#f5f5f5) |
| Outlined pressed | dark `--outlined:active` / `--pressed` | muted |

### Floating home (theme.js)

`.dots-theme-toggle:not(.dots-theme-toggle--inline).ds-button-round--outlined:hover` → muted + `translateY(-2px)`; touch media сбрасывает оба.

### Header/Toolbar Text (case.css)

`body.case-page .dots-theme-toggle--inline.ds-button-round:hover` → muted; touch media → black.

## Проверки

- Mask-иконки: `filter: none` на `html[data-theme="dark"] .ds-button-round .ds-icon`; `color` / `currentColor` на `.ds-icon`.
- Figma: Outlined Hover Lignt `417:17882`, Outlined Hover Dark `417:17917`; Text hover = тот же muted.

## Файлы

- `ds-showcase/css/components.css`
- `ds-showcase/css/tokens.css`
- `portfolio/js/boot/dots/theme.js`
- `portfolio/css/case.css` (override Text theme на кейсах)
