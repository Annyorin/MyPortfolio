# Documentation Standards

Writing standards for all project documentation — code, marketing, design, planning, analytics.

---

## Principles

- **Content dictates structure** — use the sections that fit the topic, not a fixed template
- **DRY** — reference existing docs, never duplicate
- **Update, don't append** — keep docs current, not chronological
- **No code in docs** — high-level descriptions only; code lives in code

---

## Metadata

Every document **should** have at minimum:

```
- **Status:** draft | active | implemented | deprecated
- **Updated:** YYYY-MM-DD
```

Add more fields only when they provide value (e.g., `Owner` for shared docs).

---

## Writing Rules

### Qualifiers

Use consistently: **Must** (required), **Should** (recommended), **May** (optional), **Never** (prohibited).

### Words to cut

| Instead of | Write |
|------------|-------|
| In order to | (infinitive) |
| It is necessary to | Must |
| Due to the fact that | Because |
| Has the ability to | Can |
| Perhaps / might / it seems | Commit or omit |
| A large number of | Many |

### Inline vs reference

- Content >5 lines from another source — always reference
- Info that changes frequently — reference (single update point)
- 1-2 critical lines — inline is fine

---

## Representation Selection

Pick the simplest format that fits:

| Data Shape | Use |
|------------|-----|
| Single fact | Inline text |
| List of items (no attributes) | Bullet points |
| Named properties | `key: value` pairs |
| 2+ attributes per item | Table |
| Simple sequence | Numbered list |

---

## Compression Levels

Match verbosity to audience:

| Level | Guideline | When |
|-------|-----------|------|
| Light | Full explanations, examples | Onboarding, user-facing guides |
| Medium | Concise, no redundancy | Technical docs, daily reference |
| Heavy | Maximum compression | Agent context, METAs, skills, indexes |

Default: **Medium**. Use **Heavy** for files frequently loaded into agent context.

---

## Doc Update Hierarchy

| Doc type | Contains | Examples |
|----------|----------|----------|
| Top-level (`AGENTS.md`, `README.md`) | Project overview only | Architecture, routing, status |
| Environment (`*/AGENTS.md`, `outputs/`) | Scope and public artifacts | `research-digest.md`, `ds-manifest.md` |
| Reference (`_shared/reference/`) | Human guides, external notes | Workflow конспекты, handouts |

Never add changelogs or minor fixes to top-level docs.

---

## Domain Checklists

When writing about a specific domain, ensure the document covers these aspects (not as mandatory sections — as a checklist for completeness):

**Development / Feature**
- What it does and why (user story or problem statement)
- How it works now (architecture, data flow)
- What's broken or missing (known issues, tech debt)
- What's next (if applicable)

**Business / Strategy**
- Value proposition and audience
- Current metrics (revenue, churn, conversion)
- Risks and unvalidated assumptions

**Marketing / Content**
- Positioning and key messages
- Active channels and campaigns
- Performance metrics (CAC, engagement)

**Design / UX**
- Design principles and references
- Current implementation (components, tokens)
- Accessibility considerations
- Pain points from user feedback

**Operations / Deploy**
- Environment specifics (dev/staging/prod)
- Dependencies and prerequisites
- Rollback procedure
