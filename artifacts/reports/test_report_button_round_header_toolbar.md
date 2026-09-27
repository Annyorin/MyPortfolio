# Отчёт: ButtonRound в Header / Toolbar (Figma)

## Источник

- Header `226:15768` — buttons: theme ButtonRound Text (moon) + BurgerMenu
- Toolbar `247:16546` — back ButtonRound (arrow-left) + label «Назад» + theme ButtonRound Text + burger

## Что сделано

| Поверхность | Разметка |
|---|---|
| Header | `ds-header__buttons` → theme `ds-button-round` (Text) + burger |
| Toolbar | back `ds-toolbar__back ds-button-round` + label + theme Text + burger |
| Case live | theme dock = Text + moon/sun (не Outlined); back = ButtonRound |

## Hover / Pressed

- Desktop `(hover: hover) and (pointer: fine)`: muted icon (`color: gray-text`). Outlined на главной дополнительно `translateY(-2px)`.
- Touch `(hover: none) / coarse`: Text Pressed = `--page-bg` через `:active` / `.ds-button-round--pressed`; Outlined — только muted, без fill.
- Иконки темы: light → moon, dark → sun.

## Тесты

Не запускались (явный запрос).

## Файлы

- `portfolio/js/boot/dots/theme.js`
- `portfolio/css/case.css`
- `portfolio/case-dragon.html`
- `portfolio/case-phish.html`
- `ds-showcase/css/components.css`
- `stories/Header.stories.js`
- `stories/Toolbar.stories.js`
- `artifacts/reports/test_report_button_round_header_toolbar.md`

Витрина `ds-showcase/index.html` и stories Markup уже совпадали с Figma — правки не потребовались (кроме комментариев в stories).
