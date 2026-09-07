---
type: spec
env: 01-research
updated: 2026-09-02
---

# Пайплайн исследования → PRD

Спецификация среды `01-research/`. Описывает этапы, артефакты, фреймворки и
паттерны агентской работы. Скиллы реализуют этапы; этот документ — канон.

## Зачем так устроено

По [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
исследование — это **prompt chaining** с **gate** между этапами: каждый шаг получает
выход предыдущего, а переход дальше блокируется, пока артефакт не заполнен по критериям.

По [Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents):
- один артефакт — один файл (just-in-time чтение);
- сырьё отдельно от синтеза (`sources/` vs `insights/`);
- прогресс длинного исследования — в `NOTES.md`, не в контексте.

## Этапы и артефакты

```
Фаза 0  research-scope      → briefs/00-research-scope.md
Фаза 1  recursive-briefing  → briefs/01-product-brief.md
Фаза 2  competitive-scan    → competitors/*.md + competitors/_matrix.md
Фаза 3  insight-synthesis   → insights/jtbd.md, pains.md, opportunities.md
Фаза 4  hypothesis-builder  → insights/hypotheses.md + insights/assumptions.md
Фаза 5  research-to-prd     → outputs/prd.md
         (сжатие)            → outputs/research-digest.md
```

| Фаза | Скилл | Вопрос этапа | Gate (критерий перехода) |
|------|-------|--------------|--------------------------|
| 0 | `research-scope` | Что именно исследуем и зачем? | scope, границы, тип исследования |
| 1 | `recursive-briefing` | Какой продукт и для кого? | роли, сценарии, ограничения, метрики |
| 2 | `competitive-scan` | Что делают другие? | ≥3 конкурента + матрица сравнения |
| 3 | `insight-synthesis` | Что из этого следует для пользователя? | JTBD + боли + возможности со ссылками |
| 4 | `hypothesis-builder` | Что мы предполагаем и как проверим? | гипотезы в Lean-формате + карта допущений |
| 5 | `research-to-prd` | Что строим? | PRD с трассировкой к источникам |

Фазы 2–4 допускают **parallelization**: каждый конкурент — отдельный субагент,
сводка — в основном контексте (orchestrator-workers).

## Фреймворки по этапам

Не «всё сразу», а по назначению:

| Этап | Фреймворк | Зачем |
|------|-----------|-------|
| 0 | Double Diamond (Discover) | зафиксировать проблемное поле до решений |
| 1 | Problem Statement + OKR | сформулировать проблему и успех |
| 2 | Competitive landscape + feature matrix | сравнить альтернативы |
| 3 | JTBD (Christensen/Moesta) | jobs, не демография |
| 3 | Opportunity Solution Tree (Torres) | от исхода к возможностям, не к фичам |
| 3 | Pain/Gain mapping | боли и желаемые исходы |
| 4 | Lean UX hypothesis | «мы верим, что… для… достигнем… узнаем когда…» |
| 4 | Assumptions mapping (riskiest first) | что не проверено и опасно |
| 5 | PRD (problem → solution → scope → metrics) | решение для дизайна и разработки |

Источники методологии: Erika Hall — *Just Enough Research*; Teresa Torres —
*Continuous Discovery Habits*; Jeff Gothelf — *Lean UX*; Alan Cooper —
*About Face* (goal-directed design); Nielsen Norman Group — competitive analysis,
usability heuristics.

## Правила качества

1. **Факт vs гипотеза.** Наблюдаемое — со ссылкой на `sources/` или `competitors/`.
   Остальное — в `insights/hypotheses.md` или `insights/assumptions.md`.
2. **Трассировка.** Каждый пункт PRD ссылается на файл-источник (`→ jtbd.md#J2`).
3. **Один конкурент — один файл.** Синтез — только в `insights/` и `_matrix.md`.
4. **Дайджест короткий.** `research-digest.md` — сжатие для сред 3 и 4;
   полнота — в `outputs/prd.md` и `insights/`.
5. **Без решений на этапе Discover.** Фаза 2–3 не предлагают UI и фичи —
   только проблемы, jobs и возможности.

## Паттерны агентской работы

| Паттерн Anthropic | Где |
|-------------------|-----|
| Prompt chaining | фазы 0→1→2→3→4→5 последовательно |
| Routing | роутер `discovery` выбирает подскилл |
| Parallelization | фаза 2: конкуренты параллельно |
| Orchestrator-workers | основной агент сводит отчёты субагентов |
| Evaluator-optimizer | фаза 4: проверка гипотез на falsifiability |
| Structured note-taking | `NOTES.md`, frontmatter в каждом файле |

## Публичные выходы

| Файл | Кто читает | Содержимое |
|------|------------|------------|
| `outputs/research-digest.md` | Content, Prototype | сжатые выводы |
| `outputs/prd.md` | Prototype, Code, человек | полное ТЗ на продукт |

Внутренности `01-research/` снаружи не читаются — только эти два файла.
