---
type: decision
env: 01-research
status: ready
updated: 2026-09-30
product: InnoPhish / программа «А»
topic: график индекса защищённости
owners: UX + технические специалисты
---

# Решение — график индекса (без сложного ховера)

## Решение (2026-09-30)

1. **Отказаться** от сложного ховера TIP-A / TIP-A2 (атака + до 2 волн обучения + когорта «с курсом / без» в tooltip).
2. На графике индекса защищённости показывать **дополнительный график (серию) обучения**. Серию можно **скрыть / показать в легенде** графика.
3. **Вертикальные линии** на графике: при наведении — **список атак, которые начались** (в этой точке / на этой дате).

## Было (гипотеза UX)

CHART-LITE: линия + ● атаки + │ старты волн + текстовая лента.  
Ховер на ●: атака + волны + когорта (`chart-hover-rules-wireframe.html`).

## Стало (канон v1 с техспециалистами)

| Элемент | Поведение |
|---------|-----------|
| Линия индекса / click% | Как раньше — якорь графика |
| Серия «обучение» | Отдельный график на том же поле; toggle в легенде |
| Вертикаль | Маркер старта атак; hover → список начавшихся атак |
| TIP-A / когорта в tooltip | **Не делаем** (отложено / отказ) |
| Полный Гант | По-прежнему не на сводке v1 |

## Зачем

Технически проще серии + легенда, чем join когорт и волн в hover. Обучение остаётся видимым на графике без перегруженного tooltip. Список атак на вертикали закрывает «что началось в этот день» без карточки волны+когорты.

## Артефакты обновить

- `04-prototype/wireframes/risk-index-chart-wireframe.html`
- `04-prototype/wireframes/chart-hover-rules-wireframe.html` (superseded banner)
- `04-prototype/wireframes/dashboard-ib-home-wireframe.html`
- `04-prototype/flows/dashboard-ia.md`
- `04-prototype/flows/dashboard-user-flows.md`
- `competitors/_matrix.md`
- `outputs/research-digest.md` § решения
- FigJam Phish: https://www.figma.com/board/apRL892T8oK9XfD7YvbCRe/UF-Portfolio?node-id=1-2
