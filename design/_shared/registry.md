---
type: registry
updated: 2026-09-01
---

# Реестр сред и маршрутизация

Единая таблица принятия решения «куда идёт задача». Используется корневым
оркестратором и правилом `.cursor/rules/00-meta-router.mdc`.

## Триггеры

| Среда | Триггеры в запросе | Каталог |
|-------|--------------------|---------|
| Research | конкуренты, бенчмарк, бриф, интервью, JTBD, аудитория, гипотеза, рынок, PRD, исследование | `01-research/` |
| Design System | Figma, MCP, токены, foundations, компонент, вариант, библиотека, стиль, синк | `02-design-system/` |
| Content | текст, копирайт, tone of voice, изображение, иллюстрация, нейминг, микрокопи | `03-content/` |
| Prototype | экран, флоу, прототип, кликабельный, навигация, сборка макета | `04-prototype/` |
| Code | React, компонент в коде, токены, Storybook, вёрстка, стек | `05-code/` |

Конфликт триггеров разрешается по приоритету: Design System → Prototype → Code →
Content → Research. Обоснование: чем строже изоляция среды, тем выше её приоритет
владения задачей.

## Публичная поверхность сред

Среда читается снаружи **только** через эти файлы:

| Среда | Публичный выход | Кто потребляет |
|-------|-----------------|----------------|
| Research | `01-research/outputs/research-digest.md`, `01-research/outputs/prd.md` | Content, Prototype, человек |
| Design System | `02-design-system/outputs/ds-manifest.md` | Prototype, Code |
| Content | `03-content/outputs/content-package.md` | Prototype |
| Prototype | `04-prototype/outputs/build-log.md` | человек, Code, Design System (как запрос) |
| Code | `05-code/outputs/code-manifest.md` | человек |

## Группы скиллов по средам

Процедуры живут в скиллах и грузятся только по вызову; артефакты — в каталогах сред.
Триггерятся только роутеры групп; подскиллы роутер читает как файлы.
Полная карта с разграничением похожих скиллов — [`skills-map.md`](skills-map.md).

| Среда | Группы |
|-------|--------|
| Research | `discovery` |
| Design System | `ds` |
| Content | — |
| Prototype | `structure`, `build`, `quality` |
| Code | `build`, `quality` |
| Любая | `infra` |

Справочные материалы для человека — в `_shared/reference/`, агентами по умолчанию
не читаются.

## Реестры связи с Figma

| Реестр | Что связывает | Владелец |
|--------|---------------|----------|
| `02-design-system/figma/registry.md` | проект, файлы, компоненты, node-id, назначение | Design System |
| `04-prototype/screens/SCREEN-MAP.md` | экраны прототипа ↔ node-id ↔ версия зеркала | Prototype |

Маршрутизация ссылки `figma.com` идёт по `fileKey` через реестр среды 2: он же хранит
среду-владельца каждого файла. Протокол — в `infra/subskills/figma-mcp`.

## Запрещённые связи

- Любая среда → внутренние каталоги `02-design-system/` (кроме `outputs/`).
- Content → Design System напрямую. Контент не знает о компонентах.
- Research → любая среда. Research ничего не потребляет, только производит.
