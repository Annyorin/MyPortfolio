---
name: research-to-prd
description: Фаза 5 исследования — собирает PRD из артефактов 01-research с полной трассировкой к источникам и обновляет research-digest. Использовать когда исследование завершено и нужен документ требований для прототипирования, контента и разработки.
---

# Research to PRD — фаза 5

## Среда

`01-research/`. Результаты:
- `outputs/prd.md` — [`prd.md`](../../../../../design/_shared/templates/prd.md);
- `outputs/research-digest.md` — сжатое обновление для сред 3 и 4.

Предусловие: фазы 0–4 выполнены или пользователь явно запросил сокращённый трек
с разделом «Что не исследовали».

## Goal

Собрать **единый PRD** — мост от исследования к проектированию. Каждый раздел
трассируется к файлу в `01-research/`.

## Process

1. Прочитай точечно (не всю папку целиком):
   - `briefs/00-research-scope.md`, `briefs/01-product-brief.md`
   - `competitors/_matrix.md`
   - `insights/jtbd.md`, `insights/pains.md`, `insights/opportunities.md`
   - `insights/hypotheses.md`, `insights/assumptions.md`
2. Заполни `outputs/prd.md` по шаблону. Секции 1–13.
3. **User stories** — из jobs и opportunities, формат:
   «Как [роль], я хочу [действие], чтобы [исход]». Приоритет: MoSCoW.
4. **In/Out scope** — из research-scope + non-jobs из jtbd.
5. **Метрики** — из OKR brief + сигналы из hypotheses.
6. **Трассировка** — в конце каждого раздела ссылка `→ insights/...` или `→ competitors/...`.
7. Сожми в `outputs/research-digest.md`: контекст, сегменты, main job, топ pains,
   топ opportunities, топ-3 гипотезы.
8. Поставь `status: ready` в frontmatter PRD, если все gate фаз 0–4 пройдены.

## Gate (готовность PRD)

- [ ] problem statement есть и согласован с brief;
- [ ] main job и ≥3 user stories;
- [ ] in/out scope явные;
- [ ] ≥2 метрики с target;
- [ ] раздел рисков ссылается на assumptions;
- [ ] нет фич без привязки к opportunity или job.

## Rules

- PRD описывает **что** и **зачем**, не **как выглядит**. Визуал — среды 2–4.
- Не дублируй полноту insights в digest — digest ≤ 1 экрана чтения.
- Если данных не хватает — раздел «Открытые вопросы», не выдумывай.
- Сокращённый трек: обязателен раздел «Что не исследовали» + риски.

## После PRD

Следующие шаги для пользователя:
1. Content (среда 3) читает `research-digest.md`
2. Structure (`ia-first`) — навигация по user stories
3. Prototype — экраны по PRD
