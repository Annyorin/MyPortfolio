# Отчёт: theme toggle icons / hover vs pressed

## Новые тесты

Не добавлялись.

## Регрессионные тесты

Не запускались (явный запрос пользователя).

## Итог

⚠️ Автотесты не запускались. Правки только в `portfolio/js/boot/dots/theme.js`, `ds-showcase/css/components.css`, `ds-showcase/css/tokens.css`.

## Изменённые файлы

- `portfolio/js/boot/dots/theme.js` — sun/moon по теме; hover lift; touch `--pressed`
- `ds-showcase/css/components.css` — hover vs pressed media для `.ds-button-round`
- `ds-showcase/css/tokens.css` — dark `:active` только на touch

## Ассеты

- `ds-showcase/assets/icons/sun.svg` — уже был
- `shared/content.js` `icons.sun` / `icons.moon` — уже были
