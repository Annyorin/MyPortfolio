# Оркестрация агентов и субагентов

Схема соответствует документации Anthropic:

- [Create custom subagents](https://code.claude.com/docs/en/sub-agents) — файлы в `.claude/agents/`
- [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) — изолированный контекст, узкие tools
- [Multiagent orchestration](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration) — координатор + roster
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) — orchestrator-workers и evaluator-optimizer

## Кто есть кто

| Слой | Кто | Контекст |
|------|-----|----------|
| Координатор | основная сессия (`CLAUDE.md` / `AGENTS.md`) | статус, маршруты, решения |
| Исполнители | analyst, architect, planner, developer, designer | свой промпт, свои файлы |
| Дизайн-субагенты | research / content / ds / prototype | одна среда `design/` |
| Ревьюеры | tz, design, architecture, plan, code | почти read-only |
| Rescuer | только интерпретация блокера | без записи |

Координатор не выполняет предметную работу. Субагент не тащит историю всего пайплайна.

## Поток

```
пользователь
    → coordinator
        → analyst ⇄ tz-reviewer
        → designer
              → designer-research
              → designer-content
              → designer-ds          (строго один каталог)
              → designer-prototype
        → design-reviewer
        → architect ⇄ architecture-reviewer
        → planner ⇄ plan-reviewer
        → developer ⇄ code-reviewer   (по каждой задаче)
```

Параллелить: независимые ревью или content + IA после готового digest.
Не параллелить: DS и prototype, если prototype ждёт новый манифест.

## Безопасность

- Tools заданы в frontmatter каждого субагента (least privilege).
- Запреты сессии: `.claude/settings.json`.
- Figma только через OAuth пользователя, см. `.cursor/mcp.json.example`.
- Личные аккаунты из исходного TemplateDesign удалены.
- Артефакты пайплайна — `docs/implementation/` (в `.gitignore`).

## Запуск

**Claude Code:** открой репозиторий и делегируй по именам субагентов. Либо `claude` с проектом — подхватятся `.claude/agents/`.

**Cursor:** корневой `AGENTS.md`; субагенты через Task с тем же именем роли и промптом из `.claude/agents/<name>.md`.

**Cursor CLI** (как в исходном README):

```
Используя 01_orchestrator.md, выполни доработку {постановка}.
Каталог артефактов: docs/implementation
Роли: файлы 02*.md..12*.md и .claude/agents/
Дизайн-слой: design/
```

Программный каркас SDK: `orchestration/sdk_roster.py`.
