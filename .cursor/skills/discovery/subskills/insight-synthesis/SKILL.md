---
name: insight-synthesis
description: Фаза 3 исследования — синтез JTBD, болей, возможностей (Opportunity Solution Tree) из брифа и конкурентного анализа. Использовать когда сырые данные собраны и нужны структурированные инсайты со ссылками на источники перед гипотезами и PRD.
---

# Insight Synthesis — фаза 3

## Среда

`01-research/`. Результаты:
- `insights/jtbd.md` — [`jtbd.md`](../../../../../design/_shared/templates/jtbd.md);
- `insights/pains.md` — боли с severity и источником;
- `insights/opportunities.md` — outcomes (не фичи), Opportunity Solution Tree lite.

Предусловие: `briefs/`, `competitors/_matrix.md` заполнены.

## Goal

Перейти от фактов к **пониманию пользователя**: какие jobs, где болит сильнее
всего, какие возможности открываются. Ещё без решений в виде фич.

## Process

1. Прочитай `briefs/01-product-brief.md` и `competitors/_matrix.md` точечно.
2. **JTBD**: для каждого сегмента сформулируй jobs в формате When/Want/So.
   Выдели main job. Пометь non-jobs.
3. **Pains** (`insights/pains.md`):

```markdown
| ID | Боль | Сегмент | Severity (1–5) | Частота | Источник |
```

4. **Opportunities** (`insights/opportunities.md`):
   Outcomes, которые улучшим — уровень OST (Torres), не solutions:

```markdown
| ID | Outcome | Связанные jobs | Почему сейчас плохо | Источник |
```

5. Каждый вывод — ссылка на `competitors/`, `briefs/` или `sources/`.
6. Обнови `outputs/research-digest.md`.

## Gate

Переход к `hypothesis-builder` только если:
- [ ] main job назван явно;
- [ ] ≥3 pains с severity ≥3;
- [ ] ≥2 opportunities без привязки к конкретным фичам;
- [ ] нет утверждений без источника (иначе → hypotheses позже).

## Rules

- Персоны не создавать. Используй роли и сегменты из brief.
- «Пользователям не нравится» — только с цитатой.
- Opportunity ≠ feature. «Добавить тёмную тему» — фича; «снизить нагрузку на глаза
  при ночной работе» — opportunity.

## Frameworks

JTBD (Moesta), Opportunity Solution Tree (Torres), Pain/Gain mapping (Osterwalder lite).
