# Портфолио.Главная

Один экран с camera pan/zoom. Shared DS и ассеты живут в `ds-showcase/`;
полный контракт поставки (Node LTS, `npm ci`, Storybook, тесты, запреты) —
в [корневом README](../README.md#портфолио--storybook).

## Запуск

Из **корня репозитория** (не из этой папки):

```bash
npm ci
npm run portfolio:dev
```

Откроется Vite на `/portfolio/main.html`. Для viewport ≥1024×609 старт камеры
`scale=1`, `translate=0`; на узком viewport — `fitToContent(24)`.

Опционально static:

```bash
npm run portfolio:static
```

Сервер отдаёт корень репозитория (порт **4174**); откройте `/portfolio/`.

Storybook (UC-01): `npm run storybook` — см. корневой README.

## Alias `@ds-assets`

`@ds-assets` → `ds-showcase/assets` (Vite `vite.config.js`, Storybook
`.storybook/main.js`). В коде: `portfolio/js/resolveAsset.js`.

## Эталон Figma

[Портфолио.Главная `41:1416`](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=41-1416)  
`fileKey`: `xboMnqU5JURL0xlzxN7edN`

Figma для локального запуска не нужна.

## Camera hotkeys

| Действие | Клавиши / жест |
|----------|----------------|
| Zoom in | `+` / `=` или Ctrl\|Meta + `=` / `+` |
| Zoom out | `-` или Ctrl\|Meta + `-` |
| 100% | Ctrl\|Meta + `0` или Shift + `0` |
| Fit | Shift + `1` |
| Zoom к курсору | Ctrl\|Meta + wheel |
| Pan | wheel без модификатора; Space + drag |

Битые медиа: DevTools Console (NFR).

## Запреты

- Не коммитить секреты.
- Не менять `design/**` без явной нужды.
- Не путать с `ds-showcase/` — это reference-витрина Ui kit, не этот сайт.
