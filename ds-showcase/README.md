# DS Showcase

Локальная HTML+CSS витрина Ui kit (каталог компонентов и foundations). Это не портфолио-приложение и не продакшен-сайт.

## Как открыть

**Вариант A — файл в браузере**

Откройте `index.html` двойным кликом или через «Open file» в браузере (`file://`).

**Вариант B — статический сервер**

Из корня `ds-showcase/`:

```bash
npx --yes serve -l 4173 .
```

Затем откройте http://127.0.0.1:4173/ (порт можно заменить на любой свободный). Подойдёт любой static file server с корнем в этой папке.

Сборка, Docker, CI/CD и хостинг не требуются.

## Стек

- HTML + CSS
- Без бандлера, фреймворка и npm-скриптов сборки
- Шрифт Inter: Google Fonts CDN (`css/tokens.css`); при офлайне — fallback `sans-serif`. Локальные файлы в `assets/fonts/` не обязательны.

## Эталон Figma

Ui kit frame: [node `41:11646`](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=41-11646)  
`fileKey`: `xboMnqU5JURL0xlzxN7edN`

## Evidence (UC-04)

Локальный скриншот эталона (если нет доступа к Figma):

[`../docs/implementation/figma-ui-kit-reference.png`](../docs/implementation/figma-ui-kit-reference.png)

Заметки приёмки: [`../docs/implementation/uc04_notes.md`](../docs/implementation/uc04_notes.md)

## Запреты / out of scope

- Не менять каталог `design/**` при доработке витрины
- Якорное оглавление на странице — вне scope
- Публикация на хостинг / Docker / K8s — вне обязательного scope
