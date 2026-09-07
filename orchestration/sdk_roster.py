"""Roster субагентов для Claude Agent SDK.

Соответствует https://code.claude.com/docs/en/agent-sdk/subagents
Поля AgentDefinition оставлены в camelCase, как требует Python SDK.
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _prompt(relative: str, extra: str) -> str:
    return (
        f"Прочитай и строго следуй файлу {relative} в корне репозитория.\n\n"
        f"{extra}"
    )


def build_agents() -> dict:
    """Имена совпадают с `.claude/agents/*.md`."""
    try:
        from claude_agent_sdk import AgentDefinition
    except ImportError as exc:  # pragma: no cover
        raise SystemExit(
            "Установи пакет: pip install claude-agent-sdk\n"
            "Документация: https://code.claude.com/docs/en/agent-sdk/subagents"
        ) from exc

    read_write = ["Read", "Write", "Edit", "Glob", "Grep"]
    reviewer = ["Read", "Write", "Grep", "Glob"]

    return {
        "analyst": AgentDefinition(
            description="Создаёт ТЗ. Использовать на этапе анализа.",
            prompt=_prompt("02_analyst_prompt.md", "Не пиши код и не трогай design/."),
            tools=read_write,
            disallowedTools=["Bash", "Agent"],
            permissionMode="acceptEdits",
        ),
        "tz-reviewer": AgentDefinition(
            description="Ревью ТЗ. Использовать после analyst.",
            prompt=_prompt("03_tz_reviewer_prompt.md", "Пиши только файл ревью."),
            tools=reviewer,
            disallowedTools=["Bash", "Agent", "Edit"],
            permissionMode="plan",
        ),
        "designer": AgentDefinition(
            description="Координатор UX/UI. Использовать после ТЗ, если есть интерфейс.",
            prompt=_prompt(
                "11_designer_prompt.md",
                "Делегируй designer-research, designer-content, designer-ds, designer-prototype.",
            ),
            tools=read_write + ["Agent"],
            disallowedTools=["Bash"],
            skills=["discovery", "structure", "ds", "quality", "infra"],
            permissionMode="acceptEdits",
        ),
        "designer-research": AgentDefinition(
            description="UX-исследование в design/01-research.",
            prompt=_prompt(
                "design/01-research/AGENTS.md",
                "Пиши только внутри design/01-research/. Скилл discovery.",
            ),
            tools=read_write,
            disallowedTools=["Bash", "Agent"],
            skills=["discovery"],
            permissionMode="acceptEdits",
        ),
        "designer-content": AgentDefinition(
            description="Контент-пакет в design/03-content.",
            prompt=_prompt(
                "design/03-content/AGENTS.md",
                "Вход только research-digest. Не ходи в Figma.",
            ),
            tools=read_write,
            disallowedTools=["Bash", "Agent"],
            permissionMode="acceptEdits",
        ),
        "designer-ds": AgentDefinition(
            description="Дизайн-система. Строгая изоляция design/02-design-system.",
            prompt=_prompt(
                "design/02-design-system/AGENTS.md",
                "Не читай другие среды. Figma только через официальный MCP и OAuth.",
            ),
            tools=read_write,
            disallowedTools=["Bash", "Agent"],
            skills=["ds", "infra"],
            mcpServers=["figma"],
            permissionMode="acceptEdits",
        ),
        "designer-prototype": AgentDefinition(
            description="Экраны и флоу в design/04-prototype.",
            prompt=_prompt(
                "design/04-prototype/AGENTS.md",
                "Читай только outputs других сред. DS не меняй.",
            ),
            tools=read_write,
            disallowedTools=["Bash", "Agent"],
            skills=["structure", "quality", "infra"],
            mcpServers=["figma"],
            permissionMode="acceptEdits",
        ),
        "design-reviewer": AgentDefinition(
            description="Ревью design_spec. Использовать после designer.",
            prompt=_prompt("12_design_reviewer_prompt.md", "Не исправляй дизайн."),
            tools=reviewer,
            disallowedTools=["Bash", "Agent", "Edit"],
            permissionMode="plan",
        ),
        "architect": AgentDefinition(
            description="Архитектура по ТЗ и design_spec.",
            prompt=_prompt("04_architect_prompt.md", "Учти design_spec, если он есть."),
            tools=read_write,
            disallowedTools=["Bash", "Agent"],
            permissionMode="acceptEdits",
        ),
        "architecture-reviewer": AgentDefinition(
            description="Ревью архитектуры.",
            prompt=_prompt("05_architecture_reviewer_prompt.md", "Пиши только файл ревью."),
            tools=reviewer,
            disallowedTools=["Bash", "Agent", "Edit"],
            permissionMode="plan",
        ),
        "planner": AgentDefinition(
            description="План задач разработки.",
            prompt=_prompt("06_agent_planner.md", "Покрой UI-состояния из design_spec."),
            tools=read_write,
            disallowedTools=["Bash", "Agent"],
            permissionMode="acceptEdits",
        ),
        "plan-reviewer": AgentDefinition(
            description="Ревью плана.",
            prompt=_prompt("07_agent_plan_reviewer.md", "Пиши только файл ревью."),
            tools=reviewer,
            disallowedTools=["Bash", "Agent", "Edit"],
            permissionMode="plan",
        ),
        "developer": AgentDefinition(
            description="Реализация одной задачи плана.",
            prompt=_prompt("08_agent_developer.md", "Не рефактори без указания."),
            tools=read_write + ["Bash"],
            disallowedTools=["Agent"],
            permissionMode="acceptEdits",
        ),
        "code-reviewer": AgentDefinition(
            description="Ревью кода задачи.",
            prompt=_prompt("09_agent_code_reviewer.md", "Не исправляй код сам."),
            tools=reviewer + ["Bash"],
            disallowedTools=["Agent", "Edit"],
            permissionMode="plan",
        ),
        "blocker-rescuer": AgentDefinition(
            description="Интерпретация environment-блокера.",
            prompt=_prompt("10_agent_blocker_rescuer.md", "Ничего не меняй."),
            tools=["Read", "Grep", "Glob"],
            disallowedTools=["Bash", "Agent", "Write", "Edit"],
            permissionMode="plan",
        ),
    }


COORDINATOR_SYSTEM = (ROOT / "CLAUDE.md").read_text(encoding="utf-8")


if __name__ == "__main__":
    agents = build_agents()
    print(f"roster={len(agents)} cwd={ROOT}")
    print("\n".join(sorted(agents)))
