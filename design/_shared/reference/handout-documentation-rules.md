# Documentation Rules (reference)

Конспект правил поддержки документации. Агентом не применяется напрямую — рабочая
версия в `.cursor/rules/60-doc-standards.mdc`.

## Writing Standards

Standard qualifiers (use consistently): **Must** (required), **Should** (recommended), **May** (optional), **Never** (prohibited).

Words to cut: "In order to" → (infinitive), "It is necessary to" → Must, "Due to the fact that" → Because, "Has the ability to" → Can, "Perhaps/might/it seems" → (commit or omit), "A large number of" → Many.

When to inline vs reference: content >5 lines from another source → always reference. Info that changes frequently → reference (single update point). 1-2 critical lines → inline.

## Doc Update Hierarchy

Top-level docs (`AGENTS.md`, `README.md`) — project overview only. Never add changelogs or minor fixes here.
Environment docs (`*/AGENTS.md`, `outputs/`, `NOTES.md`) — scope, artifacts, session progress.
Reference (`_shared/reference/`) — human guides; not loaded by default.

## Inline Documentation Updates

**Update each doc when its source-of-truth changed**, in the same work unit — not at session end.

The trigger is *documented behavior changed*, not *any file changed*. A refactor that
doesn't alter documented behavior needs no doc update. A new artifact, convention,
routing rule, or public output format does.

## What NOT to put in AGENTS / README

Anything that rots between sessions: counts, version headlines, ticket trails, release
narratives, «Phase N in progress», resolved bug forensics. Those belong in `NOTES.md`,
artifact frontmatter, or `_shared/reference/`.

**Keep in AGENTS:** architecture, routing, isolation rules, conventions, anti-goals,
stable paths and contracts.

## Index Maintenance

When creating or updating skills or registry entries, update `_shared/skills-map.md`,
`_shared/registry.md`, and the router `SKILL.md` of the affected group.
