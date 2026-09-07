# Среда 1 — Research

Исследования для продуктового дизайна: от scope до PRD.

Канон: [`../_shared/research/PIPELINE.md`](../_shared/research/PIPELINE.md).
Как подавать данные: [`../_shared/research/INPUT-FORMAT.md`](../_shared/research/INPUT-FORMAT.md).

## Границы

- Работаю только в `01-research/`.
- Ничего не потребляю из других сред — Research стоит в начале потока.
- Наружу отдаю два файла: `outputs/research-digest.md` и `outputs/prd.md`.
- Не пишу финальные тексты и не трогаю Figma.

## Структура

| Каталог | Содержимое |
|---------|------------|
| `sources/` | сырьё: ссылки, цитаты, интервью, скрины — без интерпретации |
| `briefs/` | scope (фаза 0) и product brief (фаза 1) |
| `competitors/` | по файлу на конкурента + `_matrix.md` |
| `insights/` | jtbd, pains, opportunities, hypotheses, assumptions |
| `outputs/` | `research-digest.md` (сжатие) и `prd.md` (полнота) |

Шаблоны — в [`../_shared/templates/`](../_shared/templates/).
Скиллы — группа `discovery` (6 фаз).

## Рабочий цикл (prompt chaining)

```
0 scope → 1 brief → 2 competitors → 3 insights → 4 hypotheses → 5 PRD
```

Между фазами — gate из скилла. Прогресс — в `NOTES.md`.

## Качество

- Факт — со ссылкой на `sources/` или `competitors/`. Иначе — гипотеза.
- Opportunity ≠ feature. UI — не на этапе Discover.
- PRD трассируется к файлам в `insights/` и `briefs/`.
