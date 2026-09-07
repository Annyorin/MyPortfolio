# Мультиагентная разработка + дизайн-слой

Локальная копия [rdudov/agents](https://github.com/rdudov/agents) с ролью дизайнера
из [Annyorin/TemplateDesign](https://github.com/Annyorin/TemplateDesign).

Оркестрация сделана по документации Anthropic: координатор в основной сессии,
исполнители и ревьюеры — изолированные субагенты с узкими tools.

- Как запускать субагентов: [orchestration/README.md](orchestration/README.md)
- Источники и лицензии: [NOTICE.md](NOTICE.md)
- Исходный подход Dudov: [00_agent_development.md](00_agent_development.md), [статья на Хабре](https://habr.com/ru/articles/971620/)
- Anthropic: [subagents](https://code.claude.com/docs/en/sub-agents), [SDK](https://code.claude.com/docs/en/agent-sdk/subagents), [multiagent](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration)

## Что где

| Путь | Назначение |
|------|------------|
| `01_orchestrator.md` | алгоритм координатора |
| `02_*.md` … `10_*.md` | исходные роли разработки |
| `11_designer_prompt.md`, `12_design_reviewer_prompt.md` | дизайн-слой |
| `.claude/agents/` | субагенты Claude Code / Agent SDK |
| `design/` | метасреда TemplateDesign |
| `.cursor/skills/` | процедуры дизайна (по вызову) |
| `docs/implementation/` | артефакты прогона (gitignored) |

## Поток

Анализ → (Дизайн, если есть UI) → Архитектура → План → Разработка.

Дизайнер не делает всё сам. Он вызывает `designer-research`, `designer-content`,
`designer-ds`, `designer-prototype`. Архитектор получает `design_spec.md` как
UX-ограничение, ТЗ остаётся источником продуктовых требований.

## Запуск в Cursor / Claude Code

```
По CLAUDE.md и 01_orchestrator.md выполни задачу: {постановка}.

Каталог артефактов: docs/implementation
Делегируй субагентам из .claude/agents/, не делай предметную работу сам.
Если есть UI — после ТЗ запусти designer, затем design-reviewer.
Дизайн-система только через designer-ds. Figma — OAuth текущего пользователя.
```

Для Cursor CLI по-прежнему можно вызывать `agent -f --model … -p …`, но
предпочтительнее встроенные субагенты: меньше утечки контекста и уже заданы
запреты инструментов.

Модели (ориентир исходного репозитория): аналитик / архитектор / планировщик /
дизайнер — более сильная; ревьюеры и разработчик — быстрее/дешевле.

## Figma

Скопируй `.cursor/mcp.json.example` в `.cursor/mcp.json` и перезапусти IDE.
Официальный сервер: `https://mcp.figma.com/mcp`. Кучу чужих аккаунтов в шаблоне
намеренно убрали — подключается твой OAuth.

## Портфолио + Storybook

Локальная поставка продукта (UC-01…UC-05): каталог компонентов в Storybook и сайт
«Портфолио.Главная». Figma для **запуска** не нужна. Краткая инструкция по сайту:
[`portfolio/README.md`](portfolio/README.md). Reference-витрина Ui kit (не продукт):
[`ds-showcase/README.md`](ds-showcase/README.md).

### Эталон Figma (опционально)

Сцена Главной: [node `41:1416`](https://www.figma.com/design/xboMnqU5JURL0xlzxN7edN/%D0%9F%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=41-1416)  
`fileKey`: `xboMnqU5JURL0xlzxN7edN`

### Требования

- Node.js LTS
- npm

### Установка

Из корня репозитория:

```bash
npm ci
```

или `npm install`, если lockfile ещё не зафиксирован.

Убедитесь, что на месте Shared DS:

- `ds-showcase/css/` (`tokens.css`, `components.css`, …)
- `ds-showcase/assets/` (images и прочие медиа)

### Команды

| Скрипт | Назначение |
|--------|------------|
| `npm run storybook` | UC-01: Storybook (порт по умолчанию **6006**) |
| `npm run portfolio:dev` | UC-02: Vite — Главная (`/portfolio/main.html`) |
| `npm run portfolio:static` | опционально: static serve **корня репозитория** (порт **4174**); откройте `/portfolio/` |
| `npm run build:pages` | production-сборка для GitHub Pages (`base=/MyPortfolio/`) |
| `npm test` | автотесты поставки |

### GitHub Pages

Публикация: workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) на push в `master`.

Сайт: **https://annyorin.github.io/MyPortfolio/**

Alias ассетов: **`@ds-assets` → `ds-showcase/assets`** (Vite `vite.config.js` и
Storybook `.storybook/main.js`; см. `package.json` description). Импорты вида
`@ds-assets/...` резолвятся одинаково в `portfolio:dev` и Storybook.

Если Storybook не стартует: проверьте Node LTS, выполните `npm ci`, убедитесь что
`ds-showcase/css` и `ds-showcase/assets` существуют; CLI Storybook печатает понятную
ошибку окружения (UC-01 A2).

Битые медиа на Главной: смотрите предупреждения в DevTools Console (NFR).

### Camera hotkeys (Главная)

Кратко (холст, не поля ввода):

| Действие | Клавиши / жест |
|----------|----------------|
| Zoom in | `+` / `=` или Ctrl\|Meta + `=` / `+` |
| Zoom out | `-` или Ctrl\|Meta + `-` |
| 100% | Ctrl\|Meta + `0` или Shift + `0` |
| Fit | Shift + `1` |
| Zoom к курсору | Ctrl\|Meta + wheel |
| Pan | wheel без модификатора; Space + drag |

### Запреты

- Не коммитить секреты (`.env`, токены, `.cursor/mcp.json` с ключами).
- Каталог `design/**` не менять без явной нужды (метасреда дизайна).
