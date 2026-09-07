---
type: map
updated: 2026-09-02
---

# Карта скиллов

**Правило.** 25 скиллов собраны в 6 групп-мультискиллов в `.cursor/skills/`.
Триггерятся только роутеры групп; подскилл роутер читает как файл
`<группа>/subskills/<имя>/SKILL.md`. На верхнем уровне лежат только роутеры.

Новый скилл вводится через протокол в роутере `infra`, а не кладётся в папку как есть.
При любом изменении скиллов обновляй также [`infoSkills.md`](../infoSkills.md) в корне.

**6 групп:** `discovery` (6) · `structure` (2) · `ds` (5) · `build` (4) ·
`quality` (4) · `infra` (4).

## Группы

| Группа | Зона | Среда | Подскиллы |
|--------|------|-------|-----------|
| `discovery` | сбор требований, конкуренты, инсайты, гипотезы, PRD | 01 | `research-scope`, `recursive-briefing`, `competitive-scan`, `insight-synthesis`, `hypothesis-builder`, `research-to-prd` |
| `structure` | архитектура и каркасы до визуала | 04 | `ia-first`, `wireframe-board` |
| `ds` | дизайн-система: стиль, Figma, связь с кодом | 02 | `style-decompose`, `handoff-to-figma`, `figma-ds-link`, `design-system-sync`, `ds-isolated-session` |
| `build` | генерация экранов и сборка в коде | 04, 05 | `design-loop`, `figma-to-proto`, `ds-to-storybook`, `flow-to-app` |
| `quality` | ревью, чистка, доводка, анимации | 04, 05 | `design-review`, `design-anti-slop`, `design-decompose`, `emil-design-eng` |
| `infra` | Figma-протокол, Git/GitHub, границы сред, библиотека | любая | `figma-mcp`, `git-github-check`, `env-handoff`, `skills-architect` |

## Что делает каждый подскилл

**discovery**: `research-scope` — границы исследования · `recursive-briefing` —
полный бриф · `competitive-scan` — конкуренты и матрица · `insight-synthesis` —
JTBD, боли, opportunities · `hypothesis-builder` — Lean-гипотезы и допущения ·
`research-to-prd` — сборка PRD.

**structure**: `ia-first` — граф навигации до экранов · `wireframe-board` — доска серых
каркасов одной HTML-страницей.

**ds**: `style-decompose` — разбор стиля студии в `STYLE_GUIDE` ·
`handoff-to-figma` — создание DS в новом файле Figma из бандла ·
`figma-ds-link` — индексация существующей DS в папку `ds/` ·
`design-system-sync` — долгоживущий мост Figma ↔ код, токены, Code Connect, дрифт ·
`ds-isolated-session` — вынос объёмной задачи в субагент с чистым контекстом.

**build**: `design-loop` — промпт для дизайн-генератора и петля критики ·
`figma-to-proto` — экраны Figma в живой React-прототип ·
`ds-to-storybook` — React-библиотека и Storybook из бандла ·
`flow-to-app` — оживление свёрстанных экранов.

**quality**: `design-review` — соответствие DS, a11y, состояния ·
`design-anti-slop` — чистка ИИ-паттернов по каталогу ·
`design-decompose` — доводка до эталона через свет, типографику, кромки ·
`emil-design-eng` — анимации и микровзаимодействия.

**infra**: `figma-mcp` — базовый протокол Figma ·
`git-github-check` — health-check Git и GitHub одной командой ·
`env-handoff` — контракт между средами · `skills-architect` — пересборка библиотеки.

## Разграничение похожих

Признак выбора — направление и жизненный цикл, а не тема.

| Задача | Скилл | Не путать с |
|--------|-------|-------------|
| как вообще ходить в Figma | `figma-mcp` | остальные Figma-скиллы — надстройки над ним |
| проверить git / github / remote | `git-github-check` | не путать с commit/push без запроса |
| DS уже есть, нужен индекс | `figma-ds-link` | `handoff-to-figma` создаёт DS с нуля |
| DS нет, есть бандл | `handoff-to-figma` | `figma-ds-link` только читает |
| связать DS с кодом надолго | `design-system-sync` | `ds-to-storybook` — разовый scaffold из бандла |
| разобрать стиль студии | `style-decompose` | `design-decompose` — механика одного элемента |
| макет не совпадает с DS | `design-review` | `design-anti-slop` — узнаваемость «нейронки» |
| визуал дешёвый после генерации | `design-loop` | `design-review` — формальное соответствие DS |
| экраны есть, но мёртвые | `flow-to-app` | `figma-to-proto` — ещё и перенос из Figma |
| собрать требования | `recursive-briefing` | `ia-first` — граф из уже готового флоу |

## Конвейер

```
research-scope → recursive-briefing → competitive-scan → insight-synthesis
  → hypothesis-builder → research-to-prd
       ↓
research-digest → Content / ia-first → wireframe-board → …
```

## Оставшиеся пересечения (дедуп-вахта)

- Инвентаризация DS: канон — `figma-ds-link`, `design-system-sync` его зовёт.
- Каталог анти-паттернов: канон — `design-anti-slop/references/catalog.md`,
  `design-decompose` по этим темам неавторитетен.
- `flow-to-app` встроен в `figma-to-proto` на этапе поведения; отдельно зовётся,
  когда переноса из Figma нет.
