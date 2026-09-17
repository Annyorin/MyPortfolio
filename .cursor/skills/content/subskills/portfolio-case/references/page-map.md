# Карта страницы

Оболочка: `portfolio/case-{id}.html`, `data-case-id="{id}"`. Тексты: `case.{id}.*` в `shared/content.js`. `##` в теле → `h3.case-page__text-sub`.

## Ключи

| Ключ | Секция | Short | Long |
|------|--------|-------|------|
| `card.{x}.title` / `meta` / `description` | карточка главной | да | да |
| `period_value`, `platforms_value`, `role_value`, `team_value` | мета | да | да |
| `intro_title` / `intro_body` | Вводные | да | да |
| `context_title` / `context_body` | Контекст задачи | нет | да |
| `analysis_title` / `analysis_body` | Исследование (`data-case-long-only`) | нет | сжатие, не `{slug}.md` целиком |
| `hypotheses_title` / `hypotheses_body` | Гипотезы и решения | да | да |
| `hypotheses_body_long` | добавка к гипотезам | нет | да |
| `conclusions_title` / `conclusions_body` | Выводы | да | да |

Short = мета + вводные + одно решение с провалом + «не стала» + выводы.  
Long = то же + сцена контекста + исследование + ещё выборы.

## Живой файл исследования

`copy/{slug}.md`: frontmatter `publish_title_key` / `publish_body_key`, затем шапка для агента, затем тело после `##`.

На сайт уходит **синтез** (бенчмарки, n, выводы). Полное тело показывают по запросу «расширенная версия» или кладут в `{slug}.md` как канон фактов.

## Синк

1. B в `copy/case-{id}.md` = канон речи.
2. Строка в `outputs/content-package.md`.
3. Значение в `shared/content.js` — побайтово тот же смысл, NBSP как на сайте.
4. Тест не должен требовать `analysis_body ===` полный `{slug}.md`.
